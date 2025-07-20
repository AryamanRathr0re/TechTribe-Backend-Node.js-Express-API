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
  const allowedEditFields = [
    "firstName",
    "LastName",
    "profile",
    "gender",
    "age",
    "skills",
    "about",
  ];

  const isAllowedEdit = Object.keys(req.body).every((field) => {
   return allowedEditFields.includes(field);
  });
  return isAllowedEdit;
};

module.exports = {
  validateSignUp,
  validateEditProfileOfUser,
};
