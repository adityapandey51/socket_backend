import express from "express";
import { getUserController, loginController, registerController } from "../controllers/userCntroller.js";
import { requireSignin } from "../middleware/authmiddleware.js";


const router=express.Router()


router.post("/register",registerController)
router.post("/login",loginController)
router.get("/getusers",requireSignin,getUserController)

export default router;