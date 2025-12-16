import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    profilePic: {
        type: String, //cloudinary
        default: ""
    },
    bio: {
        type: String
    },

}, {timestamps: true})

export const User = mongoose.model("User", userSchema);