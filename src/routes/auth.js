const User = require("../models/User");
const { validateSignUp } = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const { default: isEmail } = require("validator/lib/isEmail.js");

const express = require("express");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  //validate the DATA first
  try {
    validateSignUp(req);
    const { firstName, LastName, Email, password } = req.body;

    // encrypt the password
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      LastName,
      Email,
      password: hashPassword,
    });

    await user.save();
    res.send("Data added SuccesFully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { Email, password } = req.body;

  const user = await User.findOne({ Email: Email });
  if (!user) {
    throw new Error("Invalid Credentials ");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (isPasswordValid) {
    const token = await jwt.sign({ _id: user._id }, "123@DEV", {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.send("Login Successfull");
  } else {
    throw new Error("Invalid Credentials");
  }
});
authRouter.post("/logout", async (req, res) => {
  res.cookie("token",null,{
    expires:new Date(Date.now())

  })
  res.send("loggedout")
});

module.exports = authRouter;
