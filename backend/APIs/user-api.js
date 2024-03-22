const exp=require('express')
const userApp=exp.Router()
const {createUser,userLogin}=require('./Util');
const expressAsyncHandler=require('express-async-handler');
//body parser
userApp.use(exp.json())

let userCollectionObj,reciepeCollectionObj;
userApp.use((req,res,next)=>{
    userCollectionObj=req.app.get('userCollection');
    reciepeCollectionObj=req.app.get('reciepeCollection');
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
userApp.put('/get-reciepe/:reciepeId/:username',expressAsyncHandler(async(req,res)=>{
    const idFromUrl=req.params.reciepeId;
    const usernameFromUrl=req.params.username;
    let dbReciepe=await reciepeCollectionObj.findOne({reciepeId:idFromUrl});
    res.send({payload:dbReciepe})

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

// GET RECIEPE BY ID
/*userApp.get('/reciepe/:reciepeId',expressAsyncHandler(async(req,res)=>{
    let idFromUrl=Number(req.params.reciepeid);
    let dbReciepe=await reciepeCollectionObj.findOne({reciepeId:idFromUrl});
    if(dbReciepe==null){
        res.send({message:"not found"});
    }else{
        res.send({message:"found",payload:dbReciepe});
    }
}))*/

module.exports=userApp;