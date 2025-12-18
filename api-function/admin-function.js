const admin = require("../models/admin");
const user = require("../models/user");
const AssignmentCreated = require("../models/assignment-created");
const AssignmentCompleted = require("../models/assignment-completed");

exports.getPendingUsers = async (req, res) => {
  try {
    const { adminId } = req.params;
    
    const adminData = await admin.findById(adminId);
    if (!adminData) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const pendingUsers = await user.find({ 
      collegeName: adminData.collegeName,
      isApproved: false
    }).sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      data: pendingUsers
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const { userId, action, adminId } = req.body;
    
    const adminData = await admin.findById(adminId);
    if (!adminData) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const userData = await user.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (userData.collegeName !== adminData.collegeName) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to manage this user",
      });
    }

    if (action === 'accept') {
      await user.findByIdAndUpdate(userId, { isApproved: true });
    } else {
      await user.findByIdAndDelete(userId);
    }

    await admin.findByIdAndUpdate(
      adminId,
      { $pull: { listOfRequest: userId } }
    );
    
    return res.status(200).json({
      success: true,
      message: action === 'accept' ? "User approved successfully" : "User request declined",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const { assignmentName, deadline, adminId } = req.body;
    
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
      { collegeName: adminDetails.collegeName, isApproved: true },
      { $push: { setOfAssignmentsAssigned: createAssignment._id } }
    );

    return res.status(200).json({
      success: true,
      message: "Assignment created successfully",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
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

exports.getAdminStats = async (req, res) => {
  try {
    const { adminId } = req.params;
    
    const adminData = await admin.findById(adminId);
    if (!adminData) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const totalStudents = await user.countDocuments({ 
      collegeName: adminData.collegeName,
      isApproved: true 
    });
    
    const pendingApprovals = await user.countDocuments({ 
      collegeName: adminData.collegeName,
      isApproved: false 
    });
    
    const totalAssignments = await AssignmentCreated.countDocuments({ 
      _id: { $in: adminData.listOfAssignments } 
    });
    
    const totalSubmissions = await AssignmentCompleted.countDocuments();

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        pendingApprovals,
        totalAssignments,
        totalSubmissions
      }
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
};

exports.getCollegeUsers = async (req, res) => {
  try {
    const { adminId } = req.params;
    
    const adminData = await admin.findById(adminId);
    if (!adminData) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const users = await user.find({ 
      collegeName: adminData.collegeName,
      isApproved: true 
    }).select('firstName email createdAt').sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
};