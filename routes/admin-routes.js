const express = require("express");
const {
  getAllRequests,
  adminSignup,
} = require("../api-function/admin-function");
const router = express.Router();
router.get("/getRequests/:id", getAllRequests);
router.post("/adminSignup", adminSignup);
module.exports = router;