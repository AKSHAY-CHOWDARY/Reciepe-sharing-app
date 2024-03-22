const jwt=require('jsonwebtoken')
require('dotenv').config()

 const verifyToken=(req,res,next)=>{
    
    let bearerToken=req.headers.authorization;

    if(!bearerToken){
        res.send({message:"Unauthorized access"});
    }
    try{
    let token=bearerToken.split(' ')[1];
    let decodedToken=jwt.verify(token,process.env.SECRET_KEY);
    next();
    }catch(err){
        next(err);
    }

}

module.exports= verifyToken