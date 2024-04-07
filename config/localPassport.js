const passport = require('passport');
const {Strategy: LocalStrategy} = require('passport-local');
const {PrismaClient} = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();


passport.use(new LocalStrategy(async (username, password, done) => {
try {
    // Find user by email (assuming email is used for login)
    const user = await prisma.user.findUnique({ where: { email: username } });

    if (!user) {
    return done(null, false, { message: 'Incorrect email or password' });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
    return done(null, false, { message: 'Incorrect email or password' });
    }

    // Authentication successful
    return done(null, user);
} catch (error) {
    return done(error);
}
}));

passport.serializeUser((user, done) => {
done(null, user.id); // Serialize user by ID
});

passport.deserializeUser(async (id, done) => {
try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user); // Deserialize user from ID
} catch (error) {
    done(error);
}
});

module.exports = passport;