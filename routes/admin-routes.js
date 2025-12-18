const express = require("express");
const {
  getPendingUsers,
  approveUser,
  createAssignment,
  fetchResult,
  gradeSubmission,
  getAdminAssignments,
  getAdminStats,
  getCollegeUsers,
} = require("../api-function/admin-function");
const router = express.Router();

router.get("/pendingUsers/:adminId", getPendingUsers);
router.post("/approveUser", approveUser);
router.post("/createAssignment", createAssignment);
router.post("/fetchResult", fetchResult);
router.post("/gradeSubmission", gradeSubmission);
router.get("/getAssignments/:adminId", getAdminAssignments);
router.get("/stats/:adminId", getAdminStats);
router.get("/collegeUsers/:adminId", getCollegeUsers);

module.exports = router;