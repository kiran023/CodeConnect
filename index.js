const express=require('express');
const {connectDB}=require('./Configuration/database');
const cookieParser=require('cookie-parser');
const {authRouter}=require('./Routers/AuthRouter')
const {profileRouter}=require('./Routers/ProfileRouter');
const { connectionRouter } = require('./Routers/ConnectionRouter');
const {userRouter}=require('./Routers/UserRouter');
const cors=require('cors');

const app=express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true

}));

app.use(authRouter);
app.use(profileRouter);
app.use(connectionRouter);
app.use(userRouter);


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




