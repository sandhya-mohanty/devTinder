const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();


//send connection reques api
requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
 
try {
const fromUserId = req.user._id;
const toUserId = req.params.toUserId;
const status = req.params.status;
 
const isAllowedStatus =["interested","ignored"]
if(!isAllowedStatus.includes(status)){
  return res.status(400).json({message:"Invalid Status type"})
}
const toUser = await User.findById(toUserId);

if(!toUser){
  return res.status(404).json({message:"user not found"})
}
 
const existingConnectionRequest = await ConnectionRequestModel.findOne({
  $or:[
    {fromUserId,toUserId},
    {fromUserId:toUserId,toUserId:fromUserId}
  ]
})
if(existingConnectionRequest){
  return res.status(400).json({message:"Connection request already exist"})
}

const connectionRequest = new ConnectionRequestModel({
  fromUserId,toUserId,status
})

const savedCoonectionData = await connectionRequest.save()
res.status(200).json({message:req.user.firstName + " is " + status + " in " + toUser.firstName,data:savedCoonectionData})

  
} catch (error) {
  res.status(400).json("Error:"+ error.message)
}

})
 //accepted and rejected api
 requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
  try {
    const logedInUser= req.user
    const {status,requestId} = req.params
    //validate status check
    const allowedStatus=["accepted","rejected"]
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message:"Invalid Status type"})
    }
      
    const connectionRequest = await ConnectionRequestModel.findOne({
      _id:requestId,
      toUserId:logedInUser._id,
      // status:status
      status:"interested"
    })
    if(!connectionRequest){
    return res.status(404).json({message:"Connection request not found"})

    }
     connectionRequest.status=status;
     const savedData = await connectionRequest.save()
     res.status(200).json({message:"Connection request " + status, savedData })
    
  } catch (error) {
    res.status(400).json({Error:error.message})
    
  }
 })
module.exports = requestRouter;