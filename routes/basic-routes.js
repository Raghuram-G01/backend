const express = require("express");
const {
  createUser,
  adminSignup,
  userLogin,
  adminLogin,
  fetchAssignments,
  submitTest,
  getUserSubmissions,
} = require("../api-function/user-function");
const { authenticateToken, authorizeRole } = require("../middleware/auth");

const router = express.Router();

router.post("/userSignup", createUser);
router.post("/adminSignup", adminSignup);
router.post("/userLogin", userLogin);
router.post("/adminLogin", adminLogin);
router.post("/allAssignments", authenticateToken, authorizeRole(['user']), fetchAssignments);
router.post("/submitTest", authenticateToken, authorizeRole(['user']), submitTest);
router.post("/submissions", authenticateToken, authorizeRole(['user']), getUserSubmissions);

module.exports = router;