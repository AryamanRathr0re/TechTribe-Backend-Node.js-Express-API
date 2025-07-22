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

    const savedUser = await user.save();
    const token=await savedUser.getJWT()
     res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.json({ message: "User Added", data: savedUser });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { Email, password } = req.body;

  try {
    const user = await User.findOne({ Email: Email });

    if (!user) {
      return res.status(401).json({ message: " Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ _id: user._id }, "123@DEV", {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json(user);
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("loggedout");
});

module.exports = authRouter;
