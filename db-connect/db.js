const mongoose = require("mongoose");
exports.connect = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/sri-eshwar-backend-1");
    console.log("Db is connected");
  } catch (e) {
    console.log("Error in connecting to the db");
  }
};

//get

//post

//put

//delete

//
