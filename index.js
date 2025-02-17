const express=require('express');
const {connectDB}=require('./Configuration/database');
const {User}=require('./Model/User');
const bcrypt=require('bcrypt');
const {validateSignup}=require('./Utilities/validateSignUp');
const jwt=require('jsonwebtoken');
const {userAuth}=require('./Utilities/authentication')
const cookieParser=require('cookie-parser')

const app=express();

app.use(express.json());
app.use(cookieParser())

connectDB()
.then(()=>{
    console.log("database connected");
    app.listen(7777,()=>{
        console.log("server connected");
    })
})
.catch((err)=>{
    console.log("error occured",err);
});


app.post('/signup',async(req,res)=>{
    try{
        validateSignup(req);
        const {firstName,lastName,email,password}=req.body;
        const passwordHash=await bcrypt.hash(password,10)
        console.log(passwordHash)
        const newUser=new User({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:passwordHash
        });
        const user=await newUser.save();
        
        res.send("signup successfully"+user);
    }
    catch(err){
            console.log("sign up failed, Try again",err);
            res.status(400).send(err.message)
        }
})


// find,findOne,findById
app.get('/login',async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email:email})
        if(!user)
            throw new Error("Wrong Credential");
        const isValidPassword= await bcrypt.compare(password,user.password);
        if(!isValidPassword)
            throw new Error("Wrong Credential");
        
        // const token= await jwt.sign({_id:user._id},"CodeConnect@123",{expiresIn:"20000"});
        const token=await user.getJWT();
        console.log(token)
        res.cookie("token",token,{expires:new Date(Date.now()+20000)}); // for 20 sec
        res.end("logged in successfully");
    }
    catch(err){
        res.status(404).end("ERROR:"+err);
    }

})

app.get('/profile',userAuth,async(req,res)=>{
    const user=req.user;
    res.end("user details"+user);
})
app.patch('/profile/edit',userAuth,async(req,res)=>{
    try{
        const currUser=req.user;
        //kya kya allowed ni h change krna: password,email,first name
        const notAllowed=['email','password','firstName'];
        const isvalidEditFields= Object.keys(req.body).some((key)=>notAllowed.includes(key));
        if(isvalidEditFields)
            throw new Error("email password and firstName cant be changed");

        const updatedUser= await User.findByIdAndUpdate(currUser._id,req.body,{returnDocument:'after'});
        res.send(updatedUser);

    }
    catch(err){
        res.end("error:"+err);
    }
})

app.post('/signout',(req,res)=>{
    res.cookie('token',"",{expires:new Date(Date.now())});
})





