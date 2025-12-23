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
profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    // Assume userAuth sets req.user to the authenticated user
    const user = req.user;

    // Get list of fields that are allowed to be updated
    const updates = validateEditProfileOfUser(req);

    if (!updates.length) {
      return res.status(400).send("Cannot edit this field");
    }

    // Update only allowed fields
    updates.forEach((field) => {
      user[field] = req.body[field];
    });

    await user.save();
    res.json({ message:"updated",data:user });
    console.log(user);
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

module.exports = profileRouter;
