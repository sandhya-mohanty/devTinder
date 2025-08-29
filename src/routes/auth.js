const express = require("express");
const { validateSignupData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt")

const authRouter= express.Router()

authRouter.post("/signup", async (req, res) => {
  try {
    //validation on data signup api
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;

    //encryption the password
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });
    const savedUser = await user.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message }); //error handling
  }
});

//user login api
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //create a jwt token
      // const token = await jwt.sign({ _id: user._id }, "Dev@Tinder123",{ expiresIn: '2d' });
      const token = await user.getJWT();
      console.log(token);

      res.cookie("token", token);

      res.status(200).json({ message: "user login Successfully", user });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message }); //error handling
  }
});

//logout api
authRouter.post("/logout",async(req,res)=>{
res.cookie("token",null,{
  expires:new Date(Date.now())
})
res.send("Logout Successfully!!!")
})
module.exports=authRouter;