const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");


const app = express();
app.use(express.json()); //middleware to parse JSON bodies
app.use(cookieParser());


app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)


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
