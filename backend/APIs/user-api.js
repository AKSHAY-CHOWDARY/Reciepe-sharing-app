const exp=require('express')
const userApp=exp.Router()
const {createUser,userLogin}=require('./Util');
const expressAsyncHandler=require('express-async-handler');

//body parser
userApp.use(exp.json())

let userCollectionObj,reciepeCollectionObj,savedReciepeCollectionObj;
userApp.use((req,res,next)=>{
    userCollectionObj=req.app.get('userCollection');
    reciepeCollectionObj=req.app.get('reciepeCollection');
    savedReciepeCollectionObj=req.app.get('savedReciepeCollection');
    next();
})

//registration
userApp.post('/user',expressAsyncHandler(createUser));

//login
userApp.post('/login',expressAsyncHandler(userLogin));
// Reciepes request
userApp.get('/reciepes',expressAsyncHandler(async(req,res)=>{
    const reciepeList=await reciepeCollectionObj.find({status:true}).toArray();
    res.send({message:"ALL RECIEPES",payload:reciepeList});
}))
// POST RECIEPE
userApp.post('/new-reciepe',expressAsyncHandler(async(req,res)=>{
    const reciepe=req.body;
    let result=await reciepeCollectionObj.insertOne(reciepe);
    console.log(result);
    res.send({messsage:"NEW RECIEPE ADDED"});
}))

//POST COMMENTS ON RECIEPES
userApp.post('/comments/:reciepeId',expressAsyncHandler(async(req,res)=>{

    let idFromUrl = req.params.reciepeId
    const comment=req.body;
    let dbReciepe=await reciepeCollectionObj.updateOne({reciepeId:idFromUrl},{$addToSet:{comments:comment}});
    res.send({message:"comment added"});
}))
//GET HIS OWN RECIEPES
userApp.get('/reciepe/:username',expressAsyncHandler(async(req,res)=>{
    const usernameFromUrl=req.params.username;
    const reciepeList=await reciepeCollectionObj.find({username:usernameFromUrl}).toArray();
    if(reciepeList==null){
        res.send({message:"no reciepes"});
    }else{
        res.send({message:"user reciepes",payload:reciepeList});
    }
}))

// LIKE BY RECIEPE ID and username
userApp.post('/like/:reciepeId',expressAsyncHandler(async(req,res)=>{
    const idFromUrl=req.params.reciepeId;
    const user=req.body;
    //check if post has already been liked
    let dbReciepe=await reciepeCollectionObj.findOne({reciepeId:idFromUrl});
    if(dbReciepe.likes.filter(like=>like.username.toString()===user.username).length>0){
        return res.send({message:"post already liked"})
    }
    dbReciepe.likes.unshift({username:user.username});

    await reciepeCollectionObj.updateOne({reciepeId:idFromUrl},{$set:{...dbReciepe}})
    
    res.send({message:"liked",payload:dbReciepe.likes})

}))

// UNLIKE THE RECIEPE
userApp.post('/unlike/:reciepeId',expressAsyncHandler(async(req,res)=>{
    const idFromUrl=req.params.reciepeId;
    const user=req.body;
    //check if post has already been liked
    let dbReciepe=await reciepeCollectionObj.findOne({reciepeId:idFromUrl});
    if(dbReciepe.likes.filter(like=>like.username.toString()===user.username).length===0){
        return res.send({message:"post not liked yet"})
    }
    const delIndex=dbReciepe.likes.map(like=>like.username.toString()).indexOf(user.username);
    dbReciepe.likes.splice(delIndex,1);
    await reciepeCollectionObj.updateOne({reciepeId:idFromUrl},{$set:{...dbReciepe}})
    res.send({message:"unliked",payload:dbReciepe.likes})

}))

// GET THE FAVOURITES OF A USER
userApp.get('/fav-reciepes/:username',expressAsyncHandler(async(req,res)=>{
    const usernameFromUrl=req.params.username;
    let reciepeList=await reciepeCollectionObj.find({likes:{$all:[{username:usernameFromUrl}]}}).toArray()
    console.log(reciepeList);
    if(reciepeList==null){
        return res.send({message:"No favourites"});
    }
    return res.send({message:"favourite reciepes",payload:reciepeList});
}))
// EDIT HIS OWN RECIEPES
userApp.put('/reciepe/:reciepeId',expressAsyncHandler(async(req,res)=>{
    const reciepeIdFromUrl=req.params.reciepeId;
    const editedReciepe=req.body;
    let latestReciepe=await reciepeCollectionObj.findOneAndUpdate({reciepeId:reciepeIdFromUrl},{$set:{...editedReciepe}},{returnDocument:'after'})
    res.send({message:"reciepe edited",payload:latestReciepe})
}))

//DELETE RECIEPE
userApp.put('/reciepe/:reciepeId',expressAsyncHandler(async(req,res)=>{
    let reciepeIdFromUrl=Number(req.params.reciepeId)
    let reciepe=req.body;
    if(reciepe.status==true){
    let result = await reciepeCollectionObj.updateOne({reciepeId:reciepeIdFromUrl},{$set:{status:false}})
    if(result.modifiedCount==1){
        res.send({message:"reciepe deleted"})
    }
    }
    if(reciepe.status==false){
        let result=await reciepeCollectionObj.updateOne({reciepeId:reciepeIdFromUrl},{$set:{status:true}})
        if(result.modifiedCount==1){
            res.send({message:"reciepe restored"});
        }
    }
}))


module.exports=userApp;