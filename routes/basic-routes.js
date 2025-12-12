const express = require("express");
const { createUser, adminSignup } = require("../api-function/user-function");
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
module.exports = router;
