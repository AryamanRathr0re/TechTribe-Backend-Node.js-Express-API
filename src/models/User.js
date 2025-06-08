const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    LastName: {
      type: String,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email ID");
        }
      },
    },
    password:{
      type:String,
      validate(value){
        if(!validator.isStrongPassword(value)){
          throw new Error("Password Needs to be Strong");
          
        }
      }
    },
    profile: {
      type: String,
      default:
        "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png",

      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL");
        }
      },
    },

    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender doenst exist");
        }
      },
    },
    about: {
      type: String,
      default: "This is default About",
    },
    skills: {
      type: [String],
    },
    Contact: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
