const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");


const app = express();
app.use(express.json()); //middleware to parse JSON bodies
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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
//get profile api
app.get("/profile",userAuth, async (req, res) => {
  try {
    const user=req.user

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: "Error getting user data", error: error.message }); //error handling
  }
});

//send connection reques api
app.post("/sendConnectionRequest",userAuth,async(req,res)=>{
  const user= req.user
  res.send(user.firstName +" "+ "send connection")
})

//db connection with server start
connectDB()
  .then(() => {
    console.log("database connected");
    app.listen(7777, () => {
      console.log("server running port 7777");
    });
  })
  .catch((err) => {
    console.error("database not connected", err);
  });
