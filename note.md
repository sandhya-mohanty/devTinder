order of routes matter alot 
ex------------------------------------------------------
//routes are write in ordered way other wise they give another request
//create a test handler
app.use("/test",(req,res)=>{
  res.send("test the server is working as /test handling as router wise")
})
app.use("/",(req,res)=>{
  res.send("test the server is working / router ")
})
//this function is known as request handler
 app.use("/",(req,res)=>{
    res.send("server send data")
})
------------------------------------------------------------