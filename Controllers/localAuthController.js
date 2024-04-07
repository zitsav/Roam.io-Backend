const passport = require('../config/localPassport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function registerLocalUserController(req, res, next) {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!email) {
      return res.status(400).send('Email is required');
    }
    if (!firstName) {
      return res.status(400).send('Firstname is required');
    }
    if (!lastName) {
      return res.status(400).send('Lastname is required');
    }

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUserByEmail) {
      return res.status(409).send(`User with email ${email} is already registered`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword
      }
    });

    res.status(200).send(newUser);
  } catch (err) {
    console.error('Error in registerLocalUserController:', err);
    res.status(500).send('Internal Server Error');
  }
}

async function loginLocal(req, res, next) {
  passport.authenticate('local', async (err, user, info) => {
    try {
      if (err) {
        throw new Error(err);
      }

      if (!user) {
        return res.status(401).send(info.message || 'Invalid credentials');
      }

      // Generate JWT token
      const token = generateToken(user);

      // Respond with token
      res.status(200).send({ token });
    } catch (err) {
      console.error('Error in loginLocal:', err);
      res.status(500).send('Internal Server Error');
    }
  })(req, res, next);
}

function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
}

module.exports = {
  registerLocalUserController,
  loginLocal,
};