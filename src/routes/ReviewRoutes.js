const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/ReviewController");

// Add review
router.post(
    "/users/:userId/properties/:propertyId/reviews",
    ReviewController.addReview
);

// Get reviews of property
router.get(
    "/properties/:propertyId/reviews",
    ReviewController.getPropertyReviews
);

module.exports = router;