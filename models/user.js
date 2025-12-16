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
  collegeName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
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