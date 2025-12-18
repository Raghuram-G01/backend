const Admin = require("../models/admin");
const User = require("../models/user");
const assignmentCompleted = require("../models/assignment-completed");
const assignmentCreated = require("../models/assignment-created");

exports.createUser = async (req, res) => {
  try {
    const { firstName, email, password, collegeName } = req.body;
    
    if (!firstName || !email || !password || !collegeName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const adminExists = await Admin.findOne({ collegeName: collegeName });
    if (!adminExists) {
      return res.status(400).json({
        success: false,
        message: "No admin found for this college. Please contact support.",
      });
    }

    const userDetails = await User.create({
      firstName,
      email,
      password,
      collegeName,
      isApproved: false
    });

    await Admin.findOneAndUpdate(
      { collegeName: collegeName },
      { $push: { listOfRequest: userDetails._id } }
    );

    return res.status(200).json({
      success: true,
      message: "Registration successful. Waiting for admin approval.",
    });
  } catch (e) {
    console.error('User registration error:', e);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.adminSignup = async (req, res) => {
  try {
    const { firstName, email, password, collegeName } = req.body;
    
    if (!firstName || !email || !password || !collegeName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    
    const checkCollege = await Admin.findOne({ collegeName });
    if (checkCollege) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists for this college",
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    await Admin.create({
      firstName,
      email,
      password,
      collegeName,
    });

    return res.status(200).json({
      success: true,
      message: "Admin created successfully",
    });
  } catch (e) {
    console.error('Admin registration error:', e);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "You don't have access"
      });
    }
    
    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Wrong password"
      });
    }
    
    if (!user.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Waiting for admin approval"
      });
    }
    
    const { generateToken } = require('../middleware/auth');
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: 'user'
    });
    
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        collegeName: user.collegeName,
        role: 'user',
        token
      }
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message
    });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "You don't have access"
      });
    }
    
    if (admin.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Wrong password"
      });
    }
    
    const { generateToken } = require('../middleware/auth');
    const token = generateToken({
      id: admin._id,
      email: admin.email,
      role: 'admin'
    });
    
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: admin._id,
        firstName: admin.firstName,
        email: admin.email,
        collegeName: admin.collegeName,
        role: 'admin',
        token
      }
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message
    });
  }
};

exports.fetchAssignments = async (req, res) => {
  try {
    const { userId } = req.body;
    const getAssignments = await User.findById(userId).populate(
      "setOfAssignmentsAssigned"
    );
    return res.status(200).json({
      success: true,
      assignmentList: getAssignments?.setOfAssignmentsAssigned || [],
    });
  } catch (e) {
    res.status(404).json({
      success: false,
      error: e,
    });
  }
};

exports.submitTest = async (req, res) => {
  try {
    const { userId, assignmentId } = req.body;
    const assignmentDetails = await assignmentCreated.findById(assignmentId);
    if (!assignmentDetails) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }
    if (new Date() > new Date(assignmentDetails.deadline)) {
      return res.status(400).json({
        success: false,
        message: "Deadline crossed. Submission not allowed",
      });
    }
    const alreadySubmitted = await assignmentCompleted.findOne({
      user: userId,
      assignment: assignmentId,
    });
    if (alreadySubmitted) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted this test",
      });
    }
    const completeAssignment = await assignmentCompleted.create({
      user: userId,
      assignment: assignmentId,
      submittedAt: new Date(),
      marks: null,
      feedback: null
    });
    await assignmentCreated.findByIdAndUpdate(
      assignmentId,
      { $push: { assignmentCompleted: completeAssignment._id } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Assignment submitted successfully",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
};

exports.getUserSubmissions = async (req, res) => {
  try {
    const { userId } = req.body;
    const submissions = await assignmentCompleted.find({ user: userId })
      .populate('assignment', 'assignmentName deadline')
      .sort({ submittedAt: -1 });
    
    return res.status(200).json({
      success: true,
      submissions: submissions
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
};