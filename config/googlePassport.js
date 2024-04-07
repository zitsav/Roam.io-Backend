const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, name, emails } = profile;
        const googleId = id;
        const firstName = name.givenName;
        const lastName = name.familyName;
        const email = emails[0].value;

        let user = await prisma.user.findUnique({ where: { googleId } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId,
              firstName,
              lastName,
              email
            }
          });
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
  done(null, user); // Serialize the entire user object into the session
});

passport.deserializeUser(async (user, done) => {
  try {
    // Deserialize the entire user object from the session
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;