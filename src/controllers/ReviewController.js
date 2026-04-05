const Review = require("../models/ReviewModel");
const User = require("../models/UserModel");
const Property = require("../models/PGPropertyModel");

// ADD REVIEW
const addReview = async (req, res) => {
    try {
        const { userId, propertyId } = req.params;

        const user = await User.findById(userId);
        const property = await Property.findById(propertyId);

        if (!user || !property) {
            return res.status(404).json({ message: "User or Property not found" });
        }

        const review = await Review.create({
            ...req.body,
            userId: userId,   // ✅ matches ReviewModel field name
            pgId: propertyId  // ✅ matches ReviewModel field name
        });

        res.status(201).json(review);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET REVIEWS FOR A PROPERTY
const getPropertyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            pgId: req.params.propertyId   // ✅ matches ReviewModel field name
        }).populate("userId", "firstName lastName email profilePic"); // ✅ populate userId

        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ALL REVIEWS FOR A LANDLORD'S PROPERTIES
const getLandlordReviews = async (req, res) => {
    try {
        const { landlordId } = req.params;

        // Get all properties belonging to this landlord
        const properties = await Property.find({ landlordId });
        const pgIds = properties.map(p => p._id);

        // Fetch all reviews for those properties
        const reviews = await Review.find({ pgId: { $in: pgIds } })
            .populate("userId", "firstName lastName email profilePic")
            .populate("pgId", "pgName city area")
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    addReview,
    getPropertyReviews,
    getLandlordReviews
};