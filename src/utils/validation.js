const validator = require("validator")
const validateSignupData=(req)=>{
  const {firstName, lastName, emailId, password}=req.body
  if(!firstName || !lastName){
    throw new Error("Name is not valid");
  }
  else if(!validator.isEmail(emailId)){
       throw new Error("Enter valid email id");
  }
  else if(!validator.isStrongPassword(password)){
    throw new Error("Please Enter valid password");
  }
}


const validateEditProfile=(req)=>{
const allowedEditProfile=[
  "firstName",
  "lastName",
  "age",
  "about",
  "skills",
  "gender",
  "photoUrl"
]
const isEditAllowed = Object.keys(req.body).every((field)=>allowedEditProfile.includes(field));
return isEditAllowed
}
module.exports={validateSignupData,validateEditProfile}