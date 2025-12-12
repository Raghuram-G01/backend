const Admin = require("../models/admin");
const User = require("../models/user");
exports.getAllRequests = async (req, res) => {
  try {
    const { id } = req.params;
    const getDetails = await Admin.findById(id).populate("listOfRequest");
    return res.status(200).json({
      success: true,
      data: getDetails.listOfRequest,
    });
  } catch (e) {
    return res.status(404).json({
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
    const [checkDetails, checkUserDetails, checkCollege] = await Promise.all([
      Admin.findOne({ mobileNumber, email }),
      User.findOne({ mobileNumber, email }),
      Admin.findOne({ collegeName }),
    ]);
    if (checkDetails || checkUserDetails || checkCollege) {
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
