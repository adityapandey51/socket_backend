import express from "express";
import { requireSignin } from "../middleware/authmiddleware.js";
import { addController, createChatController, creategroupController, getChatController, removeController, renameController } from "../controllers/chatController.js";

const router=express.Router();

router.post("/createchat",requireSignin,createChatController)
router.get("/getchat",requireSignin,getChatController)
router.post("/creategroup",requireSignin,creategroupController)
router.put("/rename",requireSignin,renameController)
router.put("/groupremove",requireSignin,removeController)
router.put("/groupadd",requireSignin,addController)



export default router