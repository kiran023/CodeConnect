const {userAuth}=require('../Utilities/authentication')
const {User}=require('../Model/User');
const express=require('express');
const profileRouter=express.Router();
const DATA="lastName about photoUrl age gender"

profileRouter.get('/profile',userAuth,async(req,res)=>{
    const user=req.user;
    return res.send(user);
})

profileRouter.patch('/profile/edit',userAuth,async(req,res)=>{
    try{
        const currUser=req.user;
        //kya kya allowed ni h change krna: password,email,first name
        const notAllowed=['email','password'];
        const isvalidEditFields= Object.keys(req.body).some((key)=>notAllowed.includes(key));
        if(isvalidEditFields)
            return res.status(400).send("email password can't be changed");

        const updatedUser= await User.findByIdAndUpdate(currUser._id,req.body,{returnDocument:'after'}).select(DATA);
        res.send(updatedUser);

    }
    catch(err){
        res.end("error:"+err);
    }
})

module.exports={profileRouter};