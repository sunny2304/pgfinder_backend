const express = require("express");
const router = express.Router();
const DisputeController = require("../controllers/DisputeController");

// Create dispute
router.post("/disputes", DisputeController.createDispute);

// Get all disputes
router.get("/disputes", DisputeController.getAllDisputes);

module.exports = router;