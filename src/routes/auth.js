const User = require("../models/User");
const { validateSignUp } = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const express = require("express");

const JWT_SECRET = process.env.JWT_SECRET || "123@DEV";
const isProd = process.env.NODE_ENV === "production";
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: isProd ? "none" : "lax",
  secure: isProd,
  expires: new Date(Date.now() + 8 * 3600000),
};

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
    const token = await savedUser.getJWT();
    res.cookie("token", token, COOKIE_OPTIONS);
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

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, COOKIE_OPTIONS);

    res.json(user);
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    ...COOKIE_OPTIONS,
    expires: new Date(Date.now()),
  });
  res.send("loggedout");
});

module.exports = authRouter;
