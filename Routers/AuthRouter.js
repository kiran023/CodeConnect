const {validateSignup}=require('../Utilities/validateSignUp');
const bcrypt=require('bcrypt');
const {User}=require('../Model/User');
const express=require('express');

const authRouter=express.Router();

authRouter.post('/signup',async(req,res)=>{
    try{
        validateSignup(req);
        const {firstName,lastName,email,password}=req.body;
        const passwordHash=await bcrypt.hash(password,10)
        // console.log(passwordHash)
        const newUser=new User({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:passwordHash
        });
        const user=await newUser.save();
        
        res.send(user);
    }
    catch(err){
            // console.log("sign up failed, Try again",err);
            res.status(400).send(err.message)
        }
})


// find,findOne,findById
authRouter.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email:email})
        if(!user)
            return res.status(401).send("Error: Wrong Credential")
        const isValidPassword= await bcrypt.compare(password,user.password);
        if(!isValidPassword)
            return res.status(401).send("Error: Wrong Credential")
        
        // const token= await jwt.sign({_id:user._id},"CodeConnect@123",{expiresIn:"20000"});
        const token=await user.getJWT();
        // console.log(token)
        // console.log(token)
        res.cookie("token",token); // for 20 sec
        res.send(user);
    }
    catch(err){
        res.status(404).end("ERROR: "+err);
    }

})


authRouter.post('/logout',(req,res)=>{
    res.cookie('token',"",{expires:new Date(Date.now())});
    res.end("loggedout successfully")
})

module.exports={authRouter};