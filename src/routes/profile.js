const express = require("express");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router()


//get profile api
profileRouter.get("/profile",userAuth, async (req, res) => {
  try {
    const user=req.user

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: "Error getting user data", error: error.message }); //error handling
  }
});

module.exports= profileRouter;