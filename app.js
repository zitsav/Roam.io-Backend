const express = require('express');
const authRoutes = require('./Router/authRouter');
const passport = require('./config/googlePassport');
const session = require('express-session');

const app = express()
app.use(express.json())

app.use(session({
secret: process.env.SESSION_SECRET,
resave: false,
saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use('/auth', authRoutes);

const port = 3000
app.listen(port,()=>{
    console.log(`App listinng on port ${port}`)
})