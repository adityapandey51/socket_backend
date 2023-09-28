import mongoose from "mongoose";


const messageSchema=new mongoose.Schema({
    Sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:string,
        trim:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat"
    }
},{timestamps:true})


export default mongoose.model("Message",messageSchema)