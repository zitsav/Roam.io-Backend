const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require('bcrypt')

async function registerUserController(req,res,next){
    try{
        const existingUser = await prisma.user.findUnique({
            where : {
                username : req.body.username
            }
        })
        if(existingUser!== null){
            res.status(409).send(`Username ${req.body.username} is already in use`)
            return
        }
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        const currUser = await prisma.user.create({
            data : {
                username : req.body.username,
                password : hashedPassword,
            }
        })
        res.status(200).send(currUser)
    }
    catch(err){
        console.log(err.message)
    }
}

// async function loginUserController(req,res,next){

// }

module.exports = {registerUserController}