import mongoose from "mongoose";


const connectDB=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO);
        console.log(`database connected:${conn.connection.host}`)
    } catch (error) {
        console.log(error)
    }
}

export default connectDB;

