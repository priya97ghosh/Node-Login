const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const loginModel = require("./models/login");
var app = express();
const cors = require("cors");

mongoose
  .connect(
    "mongodb+srv://priya_ghosh:mongodb1234@cluster0.l75h3.mongodb.net/myDb?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.warn("connected");
  });
app.set("view engine", "ejs");
app.use(express.json()); // for parsing application/json
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use("/user", require("./routes/userRoutes"));
app.use("/meals", require("./routes/mealRoutes"));
app.use("/profile", require("./routes/profileRoutes"));
app.use("/", require("./routes/index"));

app.listen(4000);
