const { Connection } = require("../Model/ConnectionRequest");
const { User } = require("../Model/User");
const { userAuth } = require('../Utilities/authentication')
const express = require('express');
const userRouter = express.Router();

const DATA="firstName lastName about photoUrl age gender"

userRouter.get('/user/requests', userAuth, async (req, res) => {
    try {
        const currUser = req.user._id;
        console.log(currUser);
        const allRequests = await Connection.find({
            toUserId: currUser,
            status: 'interested'
        }).populate('fromUserId', DATA)
        // console.log(allRequests);

        res.send(allRequests);
    }
    catch (err) {
        res.end("error" + err);
    }


})

userRouter.get('/user/allConnections', userAuth, async (req, res) => {
    try {
        const currUser = req.user._id;
        const allConnections = await Connection.find({
            $or: [{ fromUserId: currUser }, { toUserId: currUser }],
            status: 'accepted'
        }).populate('toUserId', DATA).populate('fromUserId', DATA);
        // console.log(allConnections);

        const connectionData = allConnections.map((connection) => {
            // console.log(connection.fromUserId,connection.toUserId,currUser,connection.fromUserId.equals(currUser));
            if (connection.fromUserId._id.equals(currUser))
                return connection.toUserId;
            return connection.fromUserId;
        })

        res.send(connectionData);



    }
    catch (err) {
        res.end("error" + err);
    }
})


userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {

        const currUser = req.user._id;
        const page = (req.query.page) || 1;
        let limit = (req.query.limit) || 10;
        limit = limit > 50 ? 10 : limit;
        const skip = (page - 1) * limit;

        const allSendConnections = await Connection.find({
            $or: [{ fromUserId: currUser }, { toUserId: currUser }]
        });

        let hideFromFeed = []
        allSendConnections.forEach(element => {
            if (element.toUserId.equals(currUser))
                hideFromFeed = [...hideFromFeed, element.fromUserId];
            else hideFromFeed = [...hideFromFeed, element.toUserId];
        });
        
        hideFromFeed = [...hideFromFeed, currUser]
        // console.log(allSendConnections);

        const feed = await User.find({
            _id: { $nin: hideFromFeed }
        })
            .select(DATA)
            .skip(skip)
            .limit(limit);
        res.send(feed);
    }
    catch (err) {
        res.end("err" + err);
    }
})


module.exports = { userRouter }