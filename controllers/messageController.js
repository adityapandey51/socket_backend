import chatModel from "../models/chatModel.js";
import Message from "../models/messageModel.js"

export const sendMessageController=async(req,res)=>{
    
        const {message,chatId}=req.body;

        if(!message ||!chatId){
            return res.status(400).send("Enter the details")
        }

        var newMessage={
            sender:req.user._id,
            content:message,
            chat:chatId
        }
        

        try {
            const message=await new Message(newMessage).save()

            const fullMessage=await Message.findById({_id:message._id}).populate("sender","name pic").populate({path:"chat",populate:{path:"users",model:"User",select:"name email pic"}})

            await chatModel.findByIdAndUpdate(req.body.chatId,{
                latestMessage:fullMessage
            })

            res.status(200).json(fullMessage)
           
        } catch (error) {
           
            res.status(500).send("ternal ver error")
        }
}

export const allMessageContrller=async(req,res)=>{
    try {
        const allMessages=await Message.find({chat:req.params.chatId}).populate("sender","name email pic").populate("chat");

        res.status(200).json(allMessages)
    } catch (error) {
        res.status(500).send("server error")
    }
}