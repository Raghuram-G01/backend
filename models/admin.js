const mongoose = require("mongoose");
const Admin = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  secondName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
  },
  collegeName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  listOfRequest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  listOfAssignments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssignmentCreated",
    },
  ],
});
module.exports = mongoose.model("Admin", Admin);
