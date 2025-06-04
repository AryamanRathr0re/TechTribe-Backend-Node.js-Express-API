const AuthAdmin = (req, res, next) => {
  console.log("Admin Auth");
  const token = "xyz";
  const authTok = "xyz";

  if (authTok !== token) {
    res.status(401).send("Invalid Access");
  } else {
    next();
  }
};

module.exports = {
  AuthAdmin,
};
