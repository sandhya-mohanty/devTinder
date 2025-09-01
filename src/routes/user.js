const express = require("express")
const { userAuth } = require("../middlewares/auth")
const ConnectionRequestModel = require("../models/connectionRequest")

const userRouter = express.Router()
//get all the pending connection requset for the logedIn user
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
  try {
    const logedInUser = req.user

    const connectionRequest = await ConnectionRequestModel.find({
      toUserId : logedInUser._id,
      status:"interested"
    }).populate("fromUserId","firstName lastName photoUrl age skills gender")
    res.status(200).json({message:"data fetched successfully",data:connectionRequest})
    
  } catch (error) {
    res.status(400).json({})
  }
})

module.exports=userRouter