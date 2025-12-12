const mongoose = require("mongoose");
const Admin = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
  },
  secondName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  mobileNumber: {
    type: String,
    require: true,
  },
  collegeName: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  listOfRequest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
module.exports = mongoose.model("Admin", Admin);
