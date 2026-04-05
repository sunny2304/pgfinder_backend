const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/ReviewController");

// Add review
router.post(
    "/users/:userId/properties/:propertyId/reviews",
    ReviewController.addReview
);

// Get reviews of a property
router.get(
    "/properties/:propertyId/reviews",
    ReviewController.getPropertyReviews
);

// Get all reviews for a landlord's properties
router.get(
    "/landlord/:landlordId/reviews",
    ReviewController.getLandlordReviews
);

module.exports = router;