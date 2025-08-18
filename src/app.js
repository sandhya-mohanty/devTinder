const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");


const app = express()
app.use(express.json()); //middleware to parse JSON bodies
app.post("/signup",async(req, res) => {
  const user= new User(req.body); //create a new user instance with the request body
  //   {
  //   //Hard coded data for testing
  //   // firstName: "sandhya",
  //   // lastName: "mohanty",
  //   // emailId: "sandhya@gmail.com",
  //   // password: "sandhya@12",
  //   // age: 23,
  //   // gender: "female"
  // }

  try {
    const savedUser = await user.save();
    res.status(201).json({message: "User created successfully", user: savedUser});
  } catch (error) {
    res.status(500).json({message: "Error creating user", error: error.message});//error handling
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

