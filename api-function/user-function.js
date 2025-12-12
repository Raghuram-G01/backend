const User = require("../models/user");
const Admin = require("../models/admin");
const mongoose = require("mongoose");
exports.createUser = async (req, res) => {
  try {
    const {
      firstName,
      secondName,
      email,
      mobileNumber,
      collegeName,
      active,
      password,
    } = req.body;
     const [checkDetails, checkAdminDetails] = await Promise.all([
      User.findOne({ mobileNumber, email }),
      Admin.findOne({ mobileNumber, email }),
    ]);
    if (checkDetails || checkAdminDetails) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const userDetails = await User.create({
      firstName,
      secondName,
      email,
      mobileNumber,
      collegeName,
      active: false,
      password,
    });

    await Admin.findOneAndUpdate(
      { collegeName: collegeName },
      { $push: { listOfRequest: userDetails._id } }
    );
    return res.status(200).json({
      success: true,
      message: "User is created successfully",
    });
  } catch (e) {
    res.status(404).json({
      success: false,
      error: e,
    });
  }
};
exports.adminSignup = async (req, res) => {
  try {
    const {
      firstName,
      secondName,
      email,
      mobileNumber,
      collegeName,
      password,
    } = req.body;
    const checkCollege = await Admin.findOne({ collegeName });
    if (checkCollege) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }
    const [checkDetails, checkUserDetails] = await Promise.all([
      Admin.findOne({ mobileNumber, email }),
      User.findOne({ mobileNumber, email }),
    ]);
    if (checkDetails || checkUserDetails) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }
    const createAdmin = await Admin.create({
      firstName,
      secondName,
      email,
      mobileNumber,
      collegeName,
      password,
    });
    return res.status(200).json({
      success: true,
      message: "Admin is created",
    });
  } catch (e) {
    res.status(404).json({
      success: false,
      error: e,
    });
  }
};
 
exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;  
      // console.log("hi");
      console.log("Requested ID:", id);
    const getDetails = await User.findById(id);
   
    return res.status(200).json({
      success: true,
      data: getDetails,
    });
  } catch (e) {
    return res.status(404).json({
      success: false,
      error: e,
    });
  }
};

