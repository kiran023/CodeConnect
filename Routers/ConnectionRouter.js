const express=require('express');
const {userAuth}=require('../Utilities/authentication');
const {Connection}=require('../Model/ConnectionRequest');
const {User}=require('../Model/User');

const connectionRouter=express.Router();

connectionRouter.post('/connect/send/:status/:userId',userAuth,async(req,res)=>{
    try{
        const status=req.params.status;
        const toUser=req.params.userId;
        const fromUser=req.user._id;

        if(status!=="interested" && status!="pass")
            throw new Error("status is not valid");

        
        // if(toUser===currUser.toString())
        //     throw new Error("cant send connection request to yourself");

        const toUserExistance= await User.findById(toUser);
        if(!toUserExistance)
            throw new Error("toUser does not exist");

        // const currUserConnections=await Connection.find({fromUserId:currUser})
        // const toUserConnections=await Connection.find({fromUserId:toUser})

        // const isConnectionExist=currUserConnections.some(connect=>connect.toUserId.toString()===toUser);
        // const isRevConnectionExist=toUserConnections.some(connect=>connect.toUserId.toString()===currUser.toString());
        // // console.log(isRevConnectionExist,toUserConnections)
        // if(isConnectionExist || isRevConnectionExist)
        //     throw new Error("connection already exist");

        const validatingConnection=await Connection.find({
            $or:[{fromUserId:fromUser,toUserId:toUser},{fromUserId:toUser,toUserId:fromUser}]
        })
        // console.log("connections",validatingConnection);
        if(validatingConnection.length>0)
          throw new Error("connection already exist");

        const newConnection=new Connection({
            fromUserId:fromUser,
            toUserId:toUser,
            status:status
        })
        const connect=await newConnection.save();
        res.send(connect);

    }
    catch(err){
        res.end("Error:"+err);
    }
    
})

connectionRouter.post('/connect/review/:status/:requestId',userAuth,async(req,res)=>{
    try{
        const requestId=req.params.requestId;
        const currUser=req.user._id;
        const status=req.params.status;
        
        if(status!=='accepted' && status!='rejected')
            throw new Error("invalid status")

        const requiredConnection=await Connection.findOne({
            toUserId:currUser,
            status:'interested',
            _id:requestId
        })
        if(!requiredConnection)
            throw new Error("connection does not exists")

        requiredConnection.status=status;
        const connected= await requiredConnection.save();
        res.send(connected);
    }
    catch(err){
        res.status(404).json({error:err.message});
    }
   


})

module.exports={connectionRouter};