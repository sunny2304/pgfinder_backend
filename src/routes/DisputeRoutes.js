const express = require("express");
const router = express.Router();
const DisputeController = require("../controllers/DisputeController");

// Create dispute (user/landlord)
router.post("/disputes", DisputeController.createDispute);

// Get all disputes (admin)
router.get("/disputes", DisputeController.getAllDisputes);

// Get disputes by user
router.get("/users/:userId/disputes", DisputeController.getUserDisputes);

// Resolve dispute (admin)
router.patch("/disputes/:disputeId/status", DisputeController.resolveDispute);

module.exports = router;