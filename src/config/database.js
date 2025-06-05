const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://aryanrathore301:123Aryan@namastenodejs.pfjoaco.mongodb.net/DevTinderPractice"
  );
};
module.exports = connectDB;
