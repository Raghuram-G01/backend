const mongoose = require("mongoose");
const User = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  collegeName: {
    type: String,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  setOfAssignmentsAssigned: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssignmentCreated",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("User", User);