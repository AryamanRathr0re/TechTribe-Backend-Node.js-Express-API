const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is invalid!!!");
    }
    const decodedObj = await jwt.verify(token, "123@DEV");
    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User is not Found");
    }
    req.user = user;

    next();
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
};

module.exports = {
  userAuth,
};
