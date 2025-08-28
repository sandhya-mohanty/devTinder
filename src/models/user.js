const mongoose = require("mongoose");

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
    },
    password: {
      type: String,
      required: true,
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

//create a model
const User = mongoose.model("User", userSchema);
module.exports = User;
