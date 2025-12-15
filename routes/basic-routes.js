const express = require("express");
const {
  createUser,
  adminSignup,
  getUserDetails,
  fetchAssignments,
  completeAssignment,
  submitTest,
  userLogin,
  adminLogin,
} = require("../api-function/user-function");
const {
  createRequest,
  getUserSubmissions,
} = require("../api-function/request-function");
// const {
//   createUser,
//   createManyUsers,
//   getAllUsers,
//   updateEmail,
//   getDetails,
//   userRegister,
//   getAllUserDetails,
//   deleteUsers,
// } = require("../apis-function/user-functions");
const router = express.Router();
router.post("/userSignup", createUser);
router.post("/adminSignup", adminSignup);
router.post("/userLogin", userLogin);
router.post("/adminLogin", adminLogin);
router.get("/getUserDetails/:id", getUserDetails);
router.post("/completeAssignment", completeAssignment);
router.post("/submitTest", submitTest);
router.post("/allAssignments", fetchAssignments);
router.post("/createRequest", createRequest);
router.get("/submissions", getUserSubmissions);
module.exports = router;
