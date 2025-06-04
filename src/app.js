const express = require("express");

const app = express();

app.use("/admin/getdata", (req, res) => {
  const token = "xyz";
  const authTok = "xyz";

  if (token === authTok) {
    res.send("All data Send");
  }
});

app.use("/admin/deleteData", (req, res) => {
  const token = "xyz";
  const authTok = "xyaz";
  if (token === authTok) {
    res.send("Deleted a user");
  } else {
    res.status(401).send("Invalid Auth");
  }
});

app.listen(3000, () => {
  console.log("the server is running");
});
