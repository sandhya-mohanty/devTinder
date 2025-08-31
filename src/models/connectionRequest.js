const mongoose= require("mongoose")
const connectionRequestSchema = new mongoose.Schema({
 fromUserId:{
  type:mongoose.Schema.Types.ObjectId,
  required:true
 },
 toUserId:{
  type:mongoose.Schema.Types.ObjectId,
  required:true
 },
 status:{
  type:String,
  required:true,
  enum:{
    values:["ignored", "interested", "accepted", "rejected"],
    message:`{value} is incorrect status type`
  }
 }
},{timestamps:true})
//add index
connectionRequestSchema.index({fromUserId:1,toUserId:1})//compound index


 connectionRequestSchema.pre("save",function(next){
  const connectionRequest=this
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Cannot send connection request to yourself!");
  }
  next()
})

const ConnectionRequestModel= new mongoose.model("ConnectionReqiuest",connectionRequestSchema)
module.exports= ConnectionRequestModel