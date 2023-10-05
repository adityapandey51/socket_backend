import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const requireSignin=async(req,res,next)=>{
    let token;
    try {
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token=req.headers.authorization.split(" ")[1];
            const decoded=await jwt.verify(token,process.env.JWT_SECRET);

            req.user=await userModel.findById(decoded.id).select("-password")
            next()
        }else{
            res.status(401).send("not authorized")
        }
    } catch (error) {
        res.status(500).send("internal server error")
    }
}