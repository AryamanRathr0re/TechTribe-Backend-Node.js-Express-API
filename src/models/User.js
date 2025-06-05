const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  LastName: {
    type: String,
  },
  Email: {
    type: String,
  },
  Contact: {
    type: Number,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
