const mongoose = require("mongoose");
const AssignmentCreated = new mongoose.Schema({
  assignmentName: {
    type: String,
    require: true,
  },
  deadline: {
    type: Date,
    require: true,
  },
  assignmentCompleted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssignmentCompleted",
    },
  ],
});
module.exports = mongoose.model("AssignmentCreated", AssignmentCreated);
