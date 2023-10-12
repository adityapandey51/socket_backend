import express from "express";
import dotenv from "dotenv";
import userRoute from "./Routes/userRoutes.js"
import connectDB from "./config/db.js";
import chatRoutes from "./Routes/chatRoutes.js"
import messageRoutes from "./Routes/messageRoutes.js"
import { errorHandler, notFound } from "./middleware/errormiddleware.js";
import SocketIo from "socket.io";

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
app.use("/api/v1/message",messageRoutes)

app.use(notFound)
app.use(errorHandler)

const server=app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`)
})

const io=new SocketIo(server,{
    pingTimeout:60000
})

io.on("connection",(socket)=>{
    console.log("connected to socket.io")
    socket.on("setup",(userData)=>{
        socket.join(userData._id)
        socket.emit("connected")
    })
    socket.on("join chat",(room)=>{
        socket.join(room)
        console.log("user joined room"+room)
    })

    socket.on("typing",(room)=>{
        socket.in(room).emit("typing")
    })
    socket.on("stop typing",(room)=>{
        socket.in(room).emit("stop typing")
    })

    socket.on("new message",(newMessageReceived)=>{
        var chat =newMessageReceived.chat
        if(!chat.users){
            console.log("chat.users not defined")
        }

        chat.users.forEach(user => {
            if(user._id==newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received",newMessageReceived)
        });
    })
    socket.off("setup",()=>{
        socket.leave(userData._id)
    })
}) 



