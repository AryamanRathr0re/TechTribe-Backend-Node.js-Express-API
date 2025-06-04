const express = require("express");

const app = express();

// app.use((req, res) => {
//   res.send("hello");
// });

app.get("/hello", (req, res) => {
  res.send("this is a get api here");
});
app.listen(3000, () => {
  console.log("the server is running");
});
