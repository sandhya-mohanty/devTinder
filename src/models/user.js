const mongoose = require("mongoose");
const validator =require("validator");
const jwt = require("jsonwebtoken");
const bcrypt= require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("email id is not valid");
          
        }
      }
    },
    password: {
      type: String,
      required: true,
       validate(value){
        if(!validator.isStrongPassword(value)){
          throw new Error("Enter strong password");
          
        }
      }
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["female", "male", "others"].includes(value)) {
          throw new Error("Gender data not valid");
        }
      },
    },
    photoUrl: {
      type: String,
       validate(value){
        if(!validator.isURL(value)){
          throw new Error("photoURL  is not valid");
          
        }
      },
      default:
        "https://nationalchaplains.us/wp-content/uploads/2021/07/dummy-profile-pic.jpg",
    },
    about: {
      type: String,
      default: "This is some about for this users",
    },
    skills: {
      type: [String],
      validate(value){
        if(value.length > 10){
          throw new Error("skills can not add more than 10");
          
        }
      }
      
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function(){
  const user=this
  const token = await jwt.sign({ _id: user._id }, "Dev@Tinder123",{ expiresIn: '2d' });
return token;
} 
  userSchema.methods.validatePassword = async function(inputPasswordByUser){
    const user = this
    const isPasswordValid= await bcrypt.compare(inputPasswordByUser,user.password)
    return isPasswordValid
  }
//create a model
const User = mongoose.model("User", userSchema);
module.exports = User;
