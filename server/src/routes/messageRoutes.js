import express from 'express'
import jwtVerify from '../middleware/auth.middleware.js'
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from '../controllers/messageController.js'

const messageRouter = express.Router();

messageRouter.get("/users", jwtVerify, getUsersForSidebar)
messageRouter.put("/:id", jwtVerify, getMessages)
messageRouter.get("/mark/:id", jwtVerify, markMessageAsSeen)
messageRouter.post("/send/:id", jwtVerify, sendMessage)


export default messageRouter