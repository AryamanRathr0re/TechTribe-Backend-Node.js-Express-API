const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, LastName, Email, password } = req.body;

  if (!firstName || !LastName) {
    throw new Error("Name is not correct");
  } else if (!validator.isEmail(Email)) {
    throw new Error("Email is not correct");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  }
};

const validateEditProfileOfUser = (req) => {
  // Allow common profile fields that exist on the User schema
  const allowedEditFields = [
    "firstName",
    "LastName",
    "profile",
    "gender",
    "age",
    "skills",
    "about",
    "Contact",
    "location",
    "travelMode",
    "travelLocation",
  ];

  // Return only fields that are allowed to be edited
  const allowedUpdates = Object.keys(req.body).filter((field) =>
    allowedEditFields.includes(field)
  );

  return allowedUpdates;
};

module.exports = {
  validateSignUp,
  validateEditProfileOfUser,
};
