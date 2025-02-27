const mongoose=require('mongoose');
const { User } = require('./User');

const ConnectionRequestSchema= mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:User
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:User
    },
    status:{
        type:String,
        enum:["interested","pass","accepted","rejected"],
        required:true,
    }
})
ConnectionRequestSchema.pre('save',function(next){
    const currRequest=this;
    if(currRequest.fromUserId.equals(currRequest.toUserId))
        throw new Error("you cant send request to yourself")
    next();
})
const Connection=mongoose.model('Connection',ConnectionRequestSchema);
module.exports={Connection};
