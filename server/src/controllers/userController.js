import { User } from "../models/User.model.js";
import bcrypt from 'bcryptjs'
import { generateToken } from "../utils/utils.js";
import cloudinary from "../utils/cloudinary.js";


//1. Sign up a new user
const signup = async (req, res) => {

    //1. get the data from form
    const {fullName, email, password, bio} = req.body;

    try {
        //2. check for all required data
        if(!fullName || !email || !password || !bio) {
            return res.status(401).json({
                success: false,
                message: "Missing required data"
            })
        }

        //3. check for existing user
        const user = await User.findOne({email})
        if(user) {
            return res.status(401).json({
                success: false, 
                message: "User already exits"
            })
        }

        //4. Hash the password to save in DB
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        //5. create new user
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        })      

        //6. generate token
        const token = generateToken(newUser._id)

        //7. return the response after sign up successfully
        res
        .status(200)
        .json({
            success: true,
            token,
            userData: newUser, 
            message: "Account created successfully"
        })

    } catch (error) {
        console.log(error.message)
        res
        .status(500)
        .json({
            success: false,
            message: error.message,
        })
    }
}

//2. controller to login a user
const login = (async (req, res) => {
    try {
        //1. get data from frontend
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(401).json({success: false, message: "Email or password is required"})
        }

        //2. find user in db
        const user = await User.findOne({email})
        if(!user) {
            return res.json({status: 401, success: false, message: "User not exits"})
        }

        //3. match password
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect) {
            return res.status(401).json({success: false, message: "Invalid credentials"})
        }

        //4. if login successfuly - generate token
        const token = generateToken(user._id)

        //5. return the response
        return res
        .status(200)
        .json({
            success: true,
            user,
            token,
            message: "Logged in successfully",
        })

    } catch (error) {
        console.log("Error", error.message);
        res.json({success: false, message: error.message})
    }
})

//controller to check if user is authenticated 
const checkAuth = async (req, res) => {
    res
    .status(200)
    .json({
        success: true,
        user: req.user
    })
}

//controller to update user profile detail
const updateProfile = (async (req, res) => {
    try {
        const {profilePic, bio, fullName} = req.body
        
        const userId = req.user._id

        let updatedUser;

        if(!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId,
                {
                    $set: {
                        bio,
                        fullName, 
                    }
                },
                {new: true} // Return the updated user (not the old one)

            ).select("-password")
        
        } else {
            const upload = await cloudinary.uploader.upload(profilePic) //cloudinary return url of profile pic

            updatedUser = await User.findByIdAndUpdate(userId,
                {
                    $set: {
                        profilePic: upload.secure_url,
                        bio,
                        fullName
                    }
                },
                {new: true}

            ).select("-password")
        }

        return res
        .status(200)
        .json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully"
        })

    } catch (error) {
        console.log("Error", error.message);
        res.status(401).json({success: false, message: error.message})
    }
})


export {
    signup, 
    login,
    checkAuth,
    updateProfile
}
