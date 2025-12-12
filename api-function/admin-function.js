const admin = require("../models/admin");

exports.getAllRequests = async (req, res) => {
  try {
    const { id } = req.params;
    const getDetails = await admin.findById(id).populate("listOfRequest");
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
