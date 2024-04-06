const express = require('express');
const authRoutes = require('./Router/authRouter');
const passport = require('./config/passport');

const app = express()
app.use(express.json())

app.use(passport.initialize());

app.use(express.json());

app.use('/auth', authRoutes);

const port = 3000
app.listen(port,()=>{
    console.log(`App listinng on port ${port}`)
})