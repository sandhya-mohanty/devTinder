const express = require("express");




//it should to create a express application / you create a web server
const app = express()
//create a test handler
app.use("/test",(req,res)=>{
  res.send("test the server is working as /test handling as router wise")
})
app.use("/",(req,res)=>{
  res.send("test the server is working / router ")
})
//this function is known as request handler
 app.use((req,res)=>{
    res.send("server send data")
})
//app.listen() is the method used to start the server and make it listen for incoming requests on a specific port and host.
app.listen(3000,()=>{
  console.log("server running port 3000");
  
})