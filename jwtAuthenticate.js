require('dotenv').config()
const jwt = require('jsonwebtoken')

async function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    if(!authHeader){
        return res.status(403).send('No authHeader')
    }
    const token = authHeader.split(' ')[1];
    if(!token){
        console.log('No token')
        return res.status(403).send('No token')
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            console.log(err);
            return res.status(403).send('Wrong JWT')
        }
        req.body.username = decoded.username
        next()
    })
}

module.exports = authenticateToken