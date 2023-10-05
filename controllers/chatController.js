import { json } from "express";
import chatModel from "../models/chatModel.js";

export const createChatController=async (req,res)=>{
    try {
        const {userId}=req.body;

        if(!userId){
            return res.status(404).send(
                "enter the userId"
            )
        }
       
        var isChat=await chatModel.find({
            isGroup:false,
            $and:[{users:{$elemMatch:{$eq:req.user._id}}},{users:{$elemMatch:{$eq:userId}}}]
        })
        .populate("users","-password")
        .populate({path:"latestMessage",populate:{path:"sender",model:"User",select:"name email pic"}})
        


        if (isChat.length>0){
            res.status(200).send(isChat[0])
        }
        else{
            var chatData={
                chatName:"Sender",
                isGroupChat:false,
                users:[req.user._id,userId]
            }

            try {
                const createdChat=await new chatModel(chatData).save();

                const fullChat=await chatModel.findById({_id:createdChat._id}).populate("users","-password")

                res.status(200).send(fullChat)
            } catch (error) {
                res.status(500).send("error in the server")
            }
        }

    } catch (error) {
        res.status(500).send("error in the serrver")
    }


}

export const getChatController=async(req,res)=>{
    try {
        const chats= await chatModel.find({
            users:{$elemMatch:{$eq:req.user._id}}
        }).populate("users","-password")
        .populate({path:"latestMessage",populate:{path:"sender",model:"User",select:"name email pic"}})
        .populate("groupAdmin","-password")
        .sort({updatedAt:-1})
        
        
        res.status(200).send(chats)
    } catch (error) {
        res.status(500).send("Internal serverr error")
    }
}


export const creategroupController=async(req,res)=>{
    try {
       if(!req.body.users || !req.body.chatName){
        return res.status(400).send("enter the users and chatName")
       }
       var usersChat=JSON.parse(req.body.users)

       if(usersChat.length<2){
        return res.status(400).send("more than 2 users required")
       }

       usersChat.push(req.user);
      

       try {
        const groupChat=await new chatModel({
            chatName:req.body.chatName,
            isGroup:true,
            users:usersChat,
            groupAdmin:req.user
        }).save()

        const fullChatGroup=await chatModel.findById({_id:groupChat._id})
        .populate("users","-password").populate("groupAdmin","-password")

        res.status(200).json(fullChatGroup)
       } catch (error) {
        res.status(500).send("problem to create new group chat")
       }

    } catch (error) {
        res.status(500).send("internal server error")
    }
}

export const renameController=async (req,res)=>{
    try {
        const {chatId,chatName}=req.body;
        const updatedChat=await chatModel.findByIdAndUpdate(chatId,{chatName:chatName},{new:true})
        .populate("users","-password").populate("groupAdmin","-password")

        if(!updatedChat){
            return res.status(404).send("chat Not found")
        }else{
            res.json(updatedChat)
        }

    } catch (error) {
        res.status(500).send("internal server error")        
    }
}

export const  removeController=async (req,res)=>{
    try {
        const {chatId,user}=req.body
        const removed=await chatModel.findByIdAndUpdate(chatId,{
            $pull:{users:user}
        },{new:true}).populate("users","-password").populate("groupAdmin","-password")

        if(!removed){
            return res.status(404).send("chat not found")
        }else{
            res.json(removed)
        }
    } catch (error) {
        res.status(500).send("internal server error")
    }
}

export const addController=async (req,res)=>{
    try {
        const {chatId,user}=req.body
        const added=await chatModel.findByIdAndUpdate(chatId,{
            $push:{users:user}
        },{new:true}).populate("users","-password").populate("groupAdmin","-password")

        if(!added){
            return res.status(404).send("chat not found")
        }else{
            res.json(added)
        }
    } catch (error) {
        res.status(500).send("internal server error")
    }
}