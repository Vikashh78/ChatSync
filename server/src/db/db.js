import mongoose from 'mongoose'

const DB_NAME = "chatApp";

export const connectDB = (async () => {
    try {
        const x = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n Database Connected !! DB HOST : ${x.connection.host}`)
        
    } catch (error) {
        console.log("error", error.message)
        throw error
    }
});