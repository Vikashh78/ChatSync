import { Message } from '../models/Message.model.js';
import { User } from '../models/User.model.js'
import cloudinary from '../utils/cloudinary.js'
import {io, userSocketMap} from '../../server.js' 

// Get all users except logged in user
const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id; //curr user
        
        const filteredUsers = await User.find({
            _id: { $ne: userId }  //Select documents whose _id is NOT equal to userId.
        }).select("-password")

        //Count number of messages not seen for each user
        const unseenMessages = {}

        // map() returns an array of Promises
        const promises = filteredUsers.map(async (user) => { //
            const messages = await Message.find({
                senderId: user._id,
                receiverId: userId,
                seen: false
            })
            
            //Store unseen count per user
            if(messages.length > 0) {
                unseenMessages[user._id] = messages.length
            }
        })

        await Promise.all(promises); //execute the promises

        return res.json({
            success: true,
            users: filteredUsers,
            message: unseenMessages
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: error.message})
    }
}

// Get all messages for selected user : Chat
const getMessages = async (req, res) => {
    try {
        //1. Extract id & rename it selectedUserId
        const selectedUserId = req.params.id;
        const myId = req.user._id

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId}
            ]
        }).sort({createdAt: 1});

        // marks msg as seen in db
        await Message.updateMany(
            {senderId: selectedUserId, receiverId: myId},
            {seen: true}
        )

        return res
        .status(200)
        .json({
            success: true,
            message: messages
        })

    } catch (error) {
        console.log("Error", error.message);
        res.status(500).json({success: false, message: error.message})
    }
}

// Api to mark message as seen using message id
const markMessageAsSeen = async (req, res) => {
    try {
        const {id} = req.params
        await Message.findByIdAndUpdate(
            id,
            {seen: true},
            {new: true}
        ) 
        res.
        status(200)
        .json({success: true})

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: error.message})
    }
}

// Send message to selected User
const sendMessage = async (req, res) => {
    try {
        //1. get the data from sender
        const { text, image} = req.body;
        const receiverId = req.params.id; //URL path → req.params
        const senderId = req.user._id;

        let imageUrl;
        //2. if image is there then upload it on cloudinary
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // 3. store the msg in DB
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        // Emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId]
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        // send the response
        return res
        .status(200)
        .json({
            success: true,
            newMessage
        })
        
    } catch (error) {
        console.log("Error", error.message);
        res.status(500).json({success: false, message: error.message})
    }
}


export { 
    getUsersForSidebar,  
    getMessages,
    markMessageAsSeen,
    sendMessage
}