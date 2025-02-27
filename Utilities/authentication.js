const jwt=require('jsonwebtoken');
const { User } = require('../Model/User');

const userAuth=async(req,res,next)=>{
    try{
        const cookies=req.cookies;
        const {token}=cookies;
        if(!token){
            return res.status(401).send("please login first");
        }
        // console.log(token)
        const decoded=await jwt.verify(token,"CodeConnect@123");
        const id=decoded._id;
        const user=await User.findById(id);
        if(!user)
            return res.status(401).send("please login first");
        req.user=user;
        next();
    }
    catch(err){
        res.status(400).send(err.message);
    }
    
}

module.exports={userAuth};