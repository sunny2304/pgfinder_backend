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

    // ✅ FIXED: use "city" instead of "location"
    if (location && location.trim() !== "") {
      filter.city = {
        $regex: location.trim(),
        $options: "i", // case-insensitive
      };
    }

    // ✅ GENDER (case-insensitive)
    if (gender) {
      filter.gender = { $regex: `^${gender}$`, $options: "i" };
    }

    // ✅ PRICE FILTER
    if (minPrice || maxPrice) {
      filter.rent = {};
      if (minPrice) filter.rent.$gte = Number(minPrice);
      if (maxPrice) filter.rent.$lte = Number(maxPrice);
    }

    // ✅ AMENITIES
    if (amenities) {
      const amenitiesArray = amenities.split(",").map(a => a.trim());
      filter.amenities = { $all: amenitiesArray };
    }

    console.log("FILTER:", filter); // debug

    const properties = await Property.find(filter).populate("landlordId");

    res.status(200).json({
      message: "Filtered properties fetched",
      data: properties
    });

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