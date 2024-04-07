const passport = require('passport');
const {Strategy: LocalStrategy} = require('passport-local');
const {Strategy: GoogleStrategy} = require('passport-google-oauth20');
const {PrismaClient} = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

passport.use(new LocalStrategy(async (email, password, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      return done(null, false, { message: 'Incorrect email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return done(null, false, { message: 'Incorrect email or password' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.use(
    new GoogleStrategy(
        {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/register/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
        try {
            const { id, name, emails } = profile;

            // Extract relevant user data from Google profile
            const googleId = id;
            const firstName = name.givenName;
            const lastName = name.familyName;
            const email = emails[0].value;

            // Pass user data to the 'done' callback function
            return done(null, { googleId, firstName, lastName, email });
        } catch (err) {
            console.error('Error in Google OAuth strategy:', err);
            return done(err, null);
        }
        }
    )
);

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;