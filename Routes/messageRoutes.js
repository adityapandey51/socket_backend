import express from "express"
import { requireSignin } from "../middleware/authmiddleware.js";
import { allMessageContrller, sendMessageController } from "../controllers/messageController.js";

const router=express.Router();

router.post("/sendmessage",requireSignin,sendMessageController)
router.get("/:chatId",requireSignin,allMessageContrller)


export default router;