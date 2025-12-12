const mongoose = require("mongoose");
const User = new mongoose.Schema({
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
  active: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  setOfAssignmentsAssigned: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssignmentCreated",
    },
  ],
});
module.exports = mongoose.model("User", User);
