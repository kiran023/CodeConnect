const mongoose=require('mongoose');
const validator = require('validator');
const jwt=require('jsonwebtoken')


const userSchema= mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        // upppercase:true,
        // minLength:2,
        // maxLength:15
    },
    lastName:{
        type:String,
        // upppercase:true,
        // minLength:2,
        // maxLength:15 
    },
    age:{
        type:Number,
        // validate:(v)=>{
        //     if(v<18)
        //         throw new Error("age must be greater than 18")
        // },
        min:18,
        runValidators:true
    },
    email:{
        type:String,
        required:true,
        immutable:true,
        unique:true,
        lowercase:true,
        validate:{
           validator: function(email){
            return validator.isEmail(email)
           },
           message:"email is not valid"
        },
        runValidators:true
        },
    password:{
        type:String,
        required:true,
        // select:true
    },
    gender:{
        type:String,
        enum:["Male","Female","Others"],
        runValidators:true
    },
    about:{
        type:String,
        default:"this is a default intro"
    },
    photoUrl:{
        type:String,
       default:"https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"
    }

})

userSchema.methods.getJWT=async function(){
    const user=this;
    const token= await jwt.sign({_id:user._id},"CodeConnect@123");
    return token;
}

const User=mongoose.model('User',userSchema);

module.exports={User}