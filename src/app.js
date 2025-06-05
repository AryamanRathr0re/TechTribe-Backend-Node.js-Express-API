// index.js or server.js
const express = require("express");
const { AuthAdmin } = require("./middlewares/auth");
const connectDB = require("./config/database");
require("./config/database");
const User = require("./models/User");
const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Aryan",
    LastName: "Rathore",
    Email: "aryanrathore@gmail.com",
  });
  await user.save();
  res.send("Data added SuccesFully");
});

connectDB()
  .then(() => {
    console.log("Connection established Successfully");
    app.listen(3000, () => {
      console.log("the server is running");
    });
  })
  .catch((err) => {
    console.error("Error in connection");
  });
