const express = require("express");

const app = express();

app.use("/admin", (req, res, next) => {
  console.log("Admin Auth");
  const token = "xyaz";
  const authTok = "xyz";

  if (authTok !== token) {
    res.status(401).send("Invalid Access");
  } else {
    next();
  }
});

app.use("/admin/getData", (req, res) => {
  res.send("Got all the Users");
});
app.use("/admin/deleteUser", (req, res) => {
  res.send("Deleted A user");
});

app.listen(3000, () => {
  console.log("the server is running");
});
