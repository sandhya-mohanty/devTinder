const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt=require("bcrypt");

const app = express()
app.use(express.json()); //middleware to parse JSON bodies

app.post("/signup",async(req, res) => {
 
  try {
     //validation on data signup api
  validateSignupData(req)
  const {firstName,lastName,emailId,password}=req.body
  
  //encryption the password
  const hashPassword = await bcrypt.hash(password,10)
  console.log(hashPassword);
  
    const user= new User({
      firstName,lastName,emailId,password:hashPassword
    });
    const savedUser = await user.save();
    res.status(201).json({message: "User created successfully", user: savedUser});
  } catch (error) {
    res.status(500).json({message: "Error creating user", error: error.message});//error handling
  }
})
//get user by emailId
app.get("/user", async (req, res) => {
  const  userEmail  = req.body.emailId; //extract emailId from request parameters
  try {
    const users = await User.find({ emailId:userEmail }); //find user by emailId
    if (!users) {
      return res.status(404).json({ message: "User not found" }); //if user not found, return 404
    } 
    res.status(200).json(users); //return user data
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message }); //error handling
  }
});

//feed api get/feed -- get vall the users from the database
app.get("/feed", async(req,res)=>{
  try {
    const users = await User.find({}); //fetch all users from the database
    res.status(200).json(users); //return the list of users
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message }); //errorhandling
  }
})
//user find by id
app.get("/user/:id",async(req,res)=>{
  const userId=req.params.id;
  try {
    const users=await User.findById({_id:userId})
    if(!users){
      return res.status(404).json({message:"user not found"})

    }else{
      res.status(200).json(users)
    }
    
  } catch (error) {
    res.status(500).json({message:"error fetching user",error:error.message})
    
  }
})
//delete user by id
app.delete("/user/:id",async(req,res)=>{
  const userId= req.params.id;
  try{
    const users = await User.findByIdAndDelete({_id: userId})
    if(!users){
      res.status(404).json({message:"user not found"})
    }else{
      res.status(200).json({message:"user deleted successfully"})
    }
  }catch(error){
    res.status(500).json({message:"error deleting user",error:error.message})
  }
})

//update user by id
app.patch("/user/:id",async(req,res)=>{
  const userId= req.params?.id;
  const updateData=req.body;
  try {
    const ALLOWED_UPDATE=["gender","skills","age","photoUrl","about"]
    const isAllowedUpdate=Object.keys(updateData).every((k)=>ALLOWED_UPDATE.includes(k))
    if(!isAllowedUpdate){
      throw new Error("update not allowed");
      
    }
    // if(updateData?.skills.length >10){
    //   throw new Error("skills can not be add more than 10")
    // }
    const users= await User.findByIdAndUpdate({_id:userId},updateData,{new:true,runValidators:true})
    if(!users){     
      res.status(404).json({message:"user not found"})
    }else{
      res.status(200).json({message:"user updated successfully",user:users})
      console.log(users);
      
    }
  } catch (error) {
    res.status(500).json({message:"error updating user",error:error.message})
    
  }

})


//db connection with server start
connectDB()
.then(()=>{
  console.log("database connected");
  app.listen(7777,()=>{
  console.log("server running port 7777");
  
})
}).catch((err)=>{
  console.error("database not connected",err);
  
})

