const express = require("express");
const {
  getAllRequests,
  acceptOrDecline,
  createAssignment,
  deactivateUser,
  fetchResult,
  handleUserRequest,
  gradeSubmission,
  getAdminAssignments,
} = require("../api-function/admin-function");
const router = express.Router();
router.get("/getAllRequests/:id", getAllRequests);
router.post("/acceptOrDecline", acceptOrDecline);
router.post("/createAssignment", createAssignment);
router.put("/deactivateUser", deactivateUser);
router.post("/fetchResult", fetchResult);
router.post("/handleUserRequest", handleUserRequest);
router.post("/gradeSubmission", gradeSubmission);
router.get("/getAssignments/:adminId", getAdminAssignments);
module.exports = router;
