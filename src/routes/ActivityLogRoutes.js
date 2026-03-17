const express = require("express");
const router = express.Router();
const ActivityLogController = require("../controllers/ActivityLogController");

// Create log
router.post("/logs", ActivityLogController.createLog);

// Get all logs
router.get("/logs", ActivityLogController.getLogs);

module.exports = router;