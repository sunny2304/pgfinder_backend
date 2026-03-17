// const Review = require("../models/ReviewModel");
// const User = require("../models/UserModel");
// const Property = require("../models/PGPropertyModel");

// // ADD REVIEW
// const addReview = async (req, res) => {
//     try {
//         const { userId, propertyId } = req.params;

//         const user = await User.findById(userId);
//         const property = await Property.findById(propertyId);

//         if (!user || !property) {
//             return res.status(404).json({ message: "User or Property not found" });
//         }

//         const review = await Review.create({
//             ...req.body,
//             user: userId,
//             property: propertyId
//         });

//         res.status(201).json(review);

//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// // GET REVIEWS
// const getPropertyReviews = async (req, res) => {
//     const reviews = await Review.find({
//         property: req.params.propertyId
//     }).populate("user");

//     res.json(reviews);
// };

// module.exports = {
//     addReview,
//     getPropertyReviews
// };