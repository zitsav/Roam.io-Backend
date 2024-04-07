const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, name, emails, photos } = profile;
        const googleId = id;
        const firstName = name.givenName || "";
        const lastName = name.familyName || "";
        const fullName = firstName + " " + lastName;
        const email = emails[0].value;
        const profilePic = photos && photos.length > 0 ? photos[0].value : null;

        let user = await prisma.user.findUnique({ where: { googleId } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId,
              name: fullName,
              email,
              profilePicture: profilePic // Use 'profilePicture' instead of 'profilePic'
            }
          });
        } else {
          // Update profilePicture if it's missing or needs to be refreshed
          if (!user.profilePicture && profilePic) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { profilePicture: profilePic }
            });
          }
        }

        const token = generateToken(user);

        return done(null, { user, token });
      } catch (err) {
        console.error('Error in Google OAuth strategy:', err);
        return done(err, null);
      }
    }
  )
);

function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
}

passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize the user ID into the session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user); // Deserialize the user from the ID stored in the session
  } catch (error) {
    done(error);
  }
});

module.exports = passport;