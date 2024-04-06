const express = require('express');
const passport = require('../config/passport');
const router = express.Router();
const {
  registerGoogleUserController,
  registerLocalUserController,
  loginLocal,
  loginGoogle,
  loginGoogleCallback
} = require('../Controllers/authController');

router.get('/register/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), registerGoogleUserController);

router.post('/login/local', loginLocal);

router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), loginGoogleCallback);

router.get('/register/local', registerLocalUserController);

router.get('/test', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Welcome to the Test Page</h1>
        <p>Click <a href="/auth/login/google">here</a> to register with Google</p>
      </body>
    </html>
  `);
});

module.exports = router;