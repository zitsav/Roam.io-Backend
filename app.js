const express = require('express');
const authRoutes = require('./Router/authRouter');
const passport = require('./config/passport');
const blogRouter = require('./Router/blogRouter')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended : false}))

app.use(passport.initialize());

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/blog',blogRouter)

const port = 3000
app.listen(port,()=>{
    console.log(`App listinng on port ${port}`)
})