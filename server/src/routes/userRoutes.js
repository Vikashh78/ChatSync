import express from 'express'
import { checkAuth, login, signup, updateProfile } from '../controllers/userController.js';
import jwtVerify from '../middleware/auth.middleware.js'


const userRouter = express.Router();

userRouter.post("/signup", signup)
userRouter.post("/login", login)
userRouter.put("/update-profile", jwtVerify, updateProfile)
userRouter.get("/check", jwtVerify, checkAuth)

export default userRouter;