const express = require('express');
const passport = require('../config/googlePassport');
const router = express.Router();
const {
  registerLocalUserController,
  loginLocal,
} = require('../Controllers/localAuthController');
const {
  handleGoogleCallback
} = require('../Controllers/googleAuthController');


router.post('/register/local', registerLocalUserController);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', handleGoogleCallback);

router.post('/login/local', loginLocal);

router.get('/test', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Welcome to the Test Page</h1>
        <p>Click <a href="/auth/google">here</a> to log in with Google</p>
      </body>
    </html>
  `);
});

module.exports = router;