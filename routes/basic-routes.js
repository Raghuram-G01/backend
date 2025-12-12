const express = require("express");
const { createUser, adminSignup, getUserDetails} = require("../api-function/user-function");
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
router.get("/getUserDetails/:id", getUserDetails);
module.exports = router;
