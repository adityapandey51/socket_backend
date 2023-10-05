import { comparePassword, hashPassword } from "../helpers/authhelper.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"

export const registerController = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;

    if(!name){
      return res.status(400).send("please entr the name")
    }
    if(!email){
      return res.status(400).send("please entr the email")
    }
    if(!password){
      return res.status(400).send("please entr the password")
    }

    const userExists = await userModel.findOne({ email });

    if (userExists) {
      return res.status(200).send("already user exists");
    }


    const hash=await hashPassword(password)

    const user = await new userModel({
      name,
      email,
      password:hash,
      pic,
    }).save();

    const token =await jwt.sign({id:user._id},process.env.JWT_SECRET,{
      expiresIn:"7d"
    })
    res.status(201).send({
      success: true,
      user:{
        id:user._id,
        name:user.name,
        email:user.email,
        pic:user.pic
      },
      token,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      error,
    });
  }
};


export const loginController=async(req,res)=>{
 try {
  const {email,password}=req.body;
  if(!email || !password){
    return res.status(400).send("enter the details");
  };

  const user=await userModel.findOne({email});

  if (user && await comparePassword(password,user.password)){
       const token=await jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
       res.status(200).send({
        success:true,
        user:{
          id:user._id,
        name:user.name,
        email:user.email,
        pic:user.pic
        },
        token
       })
  }else{
    res.status(400).send("wrong credentials")
  }
 } catch (error) {
  console.log(error)
 }
}


export const getUserController=async(req,res)=>{
 try {
  const keyword=req.query.search ? {
    $or:[{name:{$regex:req.query.search,$options:"i"}},{
      email:{$regex:req.query.search,$options:"i"}
    }]
  }:{};
  const users=await userModel.find(keyword).find({_id:{$ne:req.user._id}}).select("-password");
  res.status(200).send(users)
 } catch (error) {
  res.status(500).send("internal server error")
 }
}