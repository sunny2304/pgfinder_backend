const express = require("express");
const router = express.Router();
const MessageController = require("../controllers/MessageController");

// Send message
router.post("/messages", MessageController.sendMessage);

// Get messages of user
router.get("/users/:userId/messages", MessageController.getUserMessages);

module.exports = router;