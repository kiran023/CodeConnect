const validator=require('validator');

const validateSignup=(req)=>{
    const {email,password}=req.body;
    if(!validator.isEmail(email))
        throw new Error("email is not valid");
    if(!validator.isStrongPassword(password))
        throw new Error("please set strong password");
}

module.exports={validateSignup};