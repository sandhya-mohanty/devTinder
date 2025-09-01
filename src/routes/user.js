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
    res.status(400).json({message:error.message})
  }
})
//get all accepted  connection for logedin user

userRouter.get("/user/connections",userAuth,async(req,res)=>{
  try {
    const logedInUser = req.user
    const connectionRequest= await ConnectionRequestModel.find({
      $or:[
        {fromUserId:logedInUser._id,status:"accepted"},
        {toUserId:logedInUser._id,status:"accepted"}
      ]
    }).populate("fromUserId","firstName lastName photoUrl age skills gender")
    .populate("toUserId","firstName lastName photoUrl age skills gender")
    const data = connectionRequest.map((row)=>{
      if(row.fromUserId._id.toString()===logedInUser._id.toString()){
        return row.toUserId
      }
      return row.fromUserId
    })
 res.send(data)
  } catch (error) {
    res.status(400).json({message:error.message})
  }
})

module.exports=userRouter