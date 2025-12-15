const User = require("../models/user");
const Admin = require("../models/admin");
const Request = require("../models/request");

// Create user request
exports.createRequest = async (req, res) => {
  try {
    const { userId, email, requestType, message } = req.body;
    
    let user;
    if (email && !userId) {
      user = await User.findOne({ email });
    } else if (userId) {
      user = await User.findById(userId);
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Find admin for the user's college
    const admin = await Admin.findOne({ collegeName: user.collegeName });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "No admin found for your college"
      });
    }

    // Create request
    const newRequest = await Request.create({
      userId: user._id,
      adminId: admin._id,
      requestType,
      message
    });

    return res.status(200).json({
      success: true,
      message: "Request sent successfully",
      data: newRequest
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message
    });
  }
};

// Get user submissions
exports.getUserSubmissions = async (req, res) => {
  try {
    const { userId } = req.query;
    
    // For now, return empty array
    // In a real app, you'd fetch from assignments completed collection
    return res.status(200).json({
      success: true,
      data: []
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message
    });
  }
};