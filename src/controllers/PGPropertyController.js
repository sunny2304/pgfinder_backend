const PG = require("../models/PGPropertyModel");
const Review = require("../models/ReviewModel"); // optional if reviews stored separately

// GET PG BY ID
const getPGById = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id).lean();
    if (!pg) return res.status(404).json({ message: "PG not found" });

    // fetch reviews
    const reviews = await Review.find({ pgId: pg._id }).lean();

    res.json({ pg, reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getPGById };