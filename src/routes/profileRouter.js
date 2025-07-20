const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileOfUser } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Please Login Again");
  }
});
profileRouter.patch("/editProfile", userAuth, async (req, res) => {
  try {
    // Assume userAuth sets req.user to the authenticated user
    const user = req.user;

    // Validate fields to be updated
    if (!validateEditProfileOfUser(req)) {
      return res.status(400).send("Cannot edit this field");
    }

    // Update only allowed fields
    const updates = Object.keys(req.body);
    updates.forEach((field) => {
      user[field] = req.body[field];
    });

    await user.save();
    res.status(200).send("Profile Updated Successfully!!!");
    console.log(user);
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

module.exports = profileRouter;
