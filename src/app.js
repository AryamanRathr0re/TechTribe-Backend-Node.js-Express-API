const express = require("express");

const app = express();

app.use("/route", [
  (req, res, next) => {
    console.log("this is 1");
    next();
  },
  (req, res, next) => {
    // res.send("this is route 2 sent from the next()");
    next();
  },
  (req, res, next) => {
    // res.send("this is 3");
    next();
  },
]);

app.listen(3000, () => {
  console.log("the server is running");
});
