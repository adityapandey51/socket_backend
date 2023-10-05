import express from "express";
import dotenv from "dotenv";
import userRoute from "./Routes/userRoutes.js"
import connectDB from "./config/db.js";
import chatRoutes from "./Routes/chatRoutes.js"
import { errorHandler, notFound } from "./middleware/errormiddleware.js";

dotenv.config();

const app=express();

const PORT =process.env.PORT;

connectDB();

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("API is running")
})


app.use("/api/v1/users",userRoute)
app.use("/api/v1/chats",chatRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`)
})