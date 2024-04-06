const express = require('express')
const app = express()
app.use(express.json())
const userRouter = require('./Router/userRouter')



app.use('/user',userRouter)
const port = 3000
app.listen(port,()=>{
    console.log(`App listinng on port ${port}`)
})