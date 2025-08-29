const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();


//send connection reques api
requestRouter.post("/sendConnectionRequest",userAuth,async(req,res)=>{
  const user= req.user
  res.send(user.firstName +" "+ "send connection")
})

module.exports = requestRouter;