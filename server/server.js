import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import http from 'http' //we are using this http bcoz 'socket.io' support this
import { connectDB } from './src/db/db.js'
import userRouter from './src/routes/userRoutes.js'
import messageRouter from './src/routes/messageRoutes.js'
import {Server} from 'socket.io'



dotenv.config({
    path: './.env'
});

//1. create Express app and http server
const app = express();
const server = http.createServer(app)



// Initialize socket.io server - (*******)
export const io = new Server(server, {
    cors: {origin: "*"}
})
// store online users
export const userSocketMap = {}

// socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId
    console.log("user Connected", userId)

    if(userId) userSocketMap[userId] = socket.id

    //emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnec", () => {
        console.log("User Dissconected", userId);
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})
 


//2. Middlware setup
app.use(express.json({limit: "4mb"}))
app.use(cors())


//3. Routes setup
app.use("/api/status", (req, res) => (
    res.send("Server is live")
))
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter)


//4. connect to MongoDB
await connectDB();



if(process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 8000
    server.listen(PORT, () => (
        console.log(`Server is running on PORT ${PORT}`)
    ))
}


// Exporting server for vercel
export default server;