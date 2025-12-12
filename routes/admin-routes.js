const express = require("express");
const { getAllRequests } = require("../api-function/admin-function");
const router = express.Router();
router.get("/getAllRequests/:id", getAllRequests);
module.exports = router;