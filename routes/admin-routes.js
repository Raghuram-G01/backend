const express = require("express");
const {
  getPendingUsers,
  approveUser,
  createAssignment,
  fetchResult,
  gradeSubmission,
  getAdminAssignments,
} = require("../api-function/admin-function");
const router = express.Router();

router.get("/pendingUsers/:adminId", getPendingUsers);
router.post("/approveUser", approveUser);
router.post("/createAssignment", createAssignment);
router.post("/fetchResult", fetchResult);
router.post("/gradeSubmission", gradeSubmission);
router.get("/getAssignments/:adminId", getAdminAssignments);

module.exports = router;