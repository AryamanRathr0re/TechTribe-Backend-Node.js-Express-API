const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "123@DEV";

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Please Log In" });
    }
    
    const decodedObj = jwt.verify(token, JWT_SECRET);
    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    req.user = user;
    next();
  } catch (err) {
    // JWT verification errors (expired, invalid signature, etc.)
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
    }
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = {
  userAuth,
};
