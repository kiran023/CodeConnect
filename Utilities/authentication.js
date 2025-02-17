const jwt=require('jsonwebtoken');
const { User } = require('../Model/User');

const userAuth=async(req,res,next)=>{
    try{
        const cookies=req.cookies;
        const {token}=cookies;
        if(!token){
            throw new Error();
        }
        const decoded=await jwt.verify(token,"CodeConnect@123");
        const id=decoded._id;
        const user=await User.findById(id);
        if(!user)
            throw new Error();
        req.user=user;
        next();
    }
    catch(err){
        res.end("please login first");
    }
    
}

module.exports={userAuth};