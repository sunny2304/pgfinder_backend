const Property = require("../models/PGPropertyModel");
const User = require("../models/UserModel");

// CREATE PROPERTY
const createProperty = async (req, res) => {
    try {
    const newProperty = await Property.create({
      ...req.body,
      landlordId: req.params.userId
    });

    res.status(201).json({
      message: "Property added successfully",
      data: newProperty
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding property" });
  }
};

// GET ALL
const getAllProperties = async (req, res) => {
  try {
    const { location, gender, minPrice, maxPrice, amenities } = req.query;

    let filter = {};

    // LOCATION: partial match, case-insensitive
    if (location) filter.location = { $regex: location.trim(), $options: "i" };

    // GENDER
    if (gender) filter.gender = gender;

    // PRICE
    if (minPrice) filter.rent = { ...filter.rent, $gte: Number(minPrice) };
    if (maxPrice) filter.rent = { ...filter.rent, $lte: Number(maxPrice) };

    // AMENITIES
    if (amenities) filter.amenities = { $all: amenities.split(",") };

    const properties = await Property.find(filter).populate("landlordId");

    res.status(200).json({ message: "Filtered properties fetched", data: properties });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: "Error fetching properties" });
  }
};


const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId)
      .populate("landlordId");

    res.json(property);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching property" });
  }
};

// UPDATE
const updateProperty = async (req, res) => {
    const updated = await Property.findByIdAndUpdate(
        req.params.propertyId,
        req.body,
        { new: true }
    );
    res.json(updated);
};

// DELETE
const deleteProperty = async (req, res) => {
    await Property.findByIdAndDelete(req.params.propertyId);
    res.json({ message: "Property deleted" });
};

module.exports = {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
};