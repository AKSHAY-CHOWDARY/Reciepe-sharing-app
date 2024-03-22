const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
require('dotenv').config();


//USER REGISTRATION
const createUser=async(req,res)=>{
    const userCollectionObj=req.app.get('userCollection');
    const user=req.body;
    let userObj=await userCollectionObj.findOne({username:user.username});
    if(userObj!=null){
        return res.send({message:"username already taken"});
    }
    //hash pass
    const hashedpassword=await bcryptjs.hash(user.password,7);
    user.password=hashedpassword;
    //save user
    await userCollectionObj.insertOne(user);
    res.send({message:"User created"});

}
//USER LOGIN
const userLogin=async(req,res)=>{
    const userCollectionObj=req.app.get("userCollection");
    const user=req.body;
    let userObj=await userCollectionObj.findOne({username:user.username});
    if(userObj==null){
        return res.send({message:"Invalid username"});
    }
    let result=await bcryptjs.compare(user.password,userObj.password,);
    if(result==false){
        return res.send({message:"Password is invalid"});
    }
    const token=jwt.sign({username:user.username},process.env.SECRET_KEY,{expiresIn:'1d'});
    delete userObj.password;
    return res.send({message:"Login successful",token:token,payload:userObj})
}

module.exports={createUser,userLogin}