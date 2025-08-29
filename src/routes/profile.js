const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfile } = require("../utils/validation");

const profileRouter = express.Router()


//get profile api
profileRouter.get("/profile/view",userAuth, async (req, res) => {
  try {
    const user=req.user

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: "Error getting user data", error: error.message }); //error handling
  }
});

//profile edit api
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
  try {
    if(!validateEditProfile(req)){
      throw new Error("Invalid edit request");
      
    }
    const logedInUser = req.user
    Object.keys(req.body).forEach((key)=>(logedInUser[key] = req.body[key]))
 await logedInUser.save()
    
res.json({message:`${logedInUser.firstName}, your profile updated successfully`,user:logedInUser})
  } catch (error) {
        res.status(400).json({ message: "Error edit user data", error: error.message }); //error handling

  }
})

module.exports= profileRouter;