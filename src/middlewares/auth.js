const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  //read the token from the req cookeis
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token!!!!");
    }
    //validate the token
    const decodedMessage = await jwt.verify(token, "Dev@Tinder123");
    const { _id } = decodedMessage;
    //find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    req.user=user;
    next();
  } catch (error) {
    res.status(400).send("err :" + error.message);
  }
};
module.exports = {
  userAuth,
};
