const passport = require('../config/googlePassport');
const { PrismaClient } = require('@prisma/client');

async function loginGoogle(req, res, next) {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
}

async function handleGoogleCallback(req, res, next) {
  passport.authenticate('google', async (err, { user, token }) => {
    try {
      if (err) {
        throw new Error(err);
      }

      if (!user) {
        return res.status(401).send('OAuth authentication failed');
      }

      // Redirect or respond with token as needed
      res.status(200).send({ user, token });
    } catch (err) {
      console.error('Error in handleGoogleCallback:', err);
      res.status(500).send('Internal Server Error');
    }
  })(req, res, next);
}

module.exports = {
  loginGoogle,
  handleGoogleCallback
};