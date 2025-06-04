// index.js or server.js
const express = require("express");
const { AuthAdmin } = require("./middlewares/auth");

const app = express();

// Register middleware for /admin routes
app.use("/admin", AuthAdmin);

app.use("/admin/getData", (req, res) => {
  res.send("Got all the Users");
});

app.use("/admin/deleteUser", (req, res) => {
  res.send("Deleted A user");
});

app.listen(3000, () => {
  console.log("the server is running");
});
