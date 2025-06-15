const express = require("express");
const { model } = require("mongoose");
const connectionRequest = express.Router();
const {userAuth} = require("../middlewares/auth");

connectionRequest.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("Sending Conn Req");
  res.send(user.firstName + " Sent connection request");
});

module.exports = connectionRequest;
