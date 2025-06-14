// index.js or server.js
const express = require("express");

const { AuthAdmin } = require("./middlewares/auth");
const connectDB = require("./config/database");
require("./config/database");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const app = express();
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth.js");
app.use(express.json());
app.use(cookieparser());

const { validateSignUp } = require("./utils/validation.js");
const { default: isEmail } = require("validator/lib/isEmail.js");

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  const { Email, password } = req.body;

  const user = await User.findOne({ Email: Email });
  if (!user) {
    throw new Error("Invalid Credentials ");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (isPasswordValid) {
    const token = await jwt.sign({ _id: user._id }, "123@DEV");

    res.cookie("token", token);
    res.send("Login Successfull");
  } else {
    throw new Error("Invalid Credentials");
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
 
    res.send(user);
  } catch (err) {
    res.status(400).send("Please Login Again");
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.Email;
  try {
    const user = await User.find({ Email: userEmail });
    res.send(user);
  } catch (err) {
    res.status(400).send("There is some error");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Error");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User Deleted Successfully");
  } catch (err) {
    res.status(400).send("Error");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_USER = [
      "userId",
      "firstName",
      "LastName",
      "skills",
      "gender",
    ];

    const updateAllowed = Object.keys(data).every((k) =>
      ALLOWED_USER.includes(k)
    );

    if (!updateAllowed) {
      throw new Error("Invalid update fields");
    }
    if (data?.skills.length > 10) {
      throw new Error("skills cannot be more than 10");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });

    res.send("Updated the Data Successfully");
  } catch (err) {
    res.status(400).send(err.message || "Error");
  }
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
