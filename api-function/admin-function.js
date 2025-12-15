const admin = require("../models/admin");
const user = require("../models/user");
const AssignmentCreated = require("../models/assignment-created");
const AssignmentCompleted = require("../models/assignment-completed");
const Request = require("../models/request");

//worked
exports.getAllRequests = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user registration requests
    const adminDetails = await admin.findById(id).populate("listOfRequest");
    
    // Get user requests (new request system)
    const userRequests = await Request.find({ adminId: id, status: 'pending' })
      .populate('userId', 'firstName email collegeName')
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      data: {
        registrationRequests: adminDetails.listOfRequest,
        userRequests: userRequests
      }
    });
  } catch (e) {
    return res.status(404).json({
      success: false,
      error: e,
    });
  }
};

//worked
exports.acceptOrDecline = async (req, res) => {
  try {
    const { adminId, userId, select } = req.body;
    if (select === 1) {
      await user.findByIdAndUpdate(userId, { active: true }, { new: true });
    }
    await admin.findByIdAndUpdate(
      adminId,
      {
        $pull: { listOfRequest: userId },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Process is done successfully",
    });
  } catch (e) {
    return res.status(404).json({
      success: false,
      error: e,
    });
  }
};

//worked
exports.createAssignment = async (req, res) => {
  try {
    const { assignmentName, deadline, adminId } = req.body;
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // convert incoming deadline
    const deadlineDate = new Date(deadline);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    if (deadlineDate < todayDate) {
      return res.status(400).json({
        success: false,
        message: "Deadline cannot be a past date",
      });
    }
    const createAssignment = await AssignmentCreated.create({
      assignmentName,
      deadline,
    });
    const adminDetails = await admin.findById(adminId);
    if (!adminDetails) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }
    
    await admin.findByIdAndUpdate(
      adminId,
      { $push: { listOfAssignments: createAssignment._id } },
      { new: true }
    );
    
    await user.updateMany(
      { collegeName: adminDetails.collegeName, active: true },
      { $push: { setOfAssignmentsAssigned: createAssignment._id } }
    );
    return res.status(200).json({
      success: true,
      message: "Assignment is created successfully",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
};

//worked
exports.deactivateUser = async (req, res) => {
  try {
    const { userId, decision } = req.body;
    const deactivateUser = await user.findByIdAndUpdate(
      userId,
      {
        active: decision,
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "User is deactivated",
    });
  } catch (e) {
    return res.status(404).json({
      success: false,
      error: e,
    });
  }
};

exports.fetchResult = async (req, res) => {
  try {
    const { assignmentId } = req.body;

    const result = await AssignmentCreated.findById(assignmentId)
      .populate({
        path: "assignmentCompleted",
        populate: {
          path: "user",
          select: "firstName email",
        },
      });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
};

// Get admin's assignments
exports.getAdminAssignments = async (req, res) => {
  try {
    const { adminId } = req.params;
    
    const adminData = await admin.findById(adminId).populate('listOfAssignments');
    
    if (!adminData) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: adminData.listOfAssignments,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
};

// Handle user requests (approve/reject)
exports.handleUserRequest = async (req, res) => {
  try {
    const { requestId, status, adminId } = req.body;
    
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }
    
    // Update request status
    request.status = status;
    await request.save();
    
    // If approved and it's an account activation request, activate the user
    if (status === 'approved' && request.requestType === 'Account Activation') {
      await user.findByIdAndUpdate(request.userId, { active: true });
    }
    
    return res.status(200).json({
      success: true,
      message: `Request ${status} successfully`
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message
    });
  }
};

// Grade assignment submission
exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId, marks, feedback } = req.body;
    
    const submission = await AssignmentCompleted.findByIdAndUpdate(
      submissionId,
      { marks, feedback, gradedAt: new Date() },
      { new: true }
    );
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Submission graded successfully",
      data: submission
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message
    });
  }
};