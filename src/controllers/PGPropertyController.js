const Property = require("../models/PGPropertyModel");
const User = require("../models/UserModel");

// CREATE PROPERTY
const createProperty = async (req, res) => {
  try {
    const { roomCategories, ...rest } = req.body;

    // Derive base rent from the lowest-priced room category (for filter compatibility)
    let derivedRent = rest.rent;
    let derivedRoomType = rest.roomType;

    if (Array.isArray(roomCategories) && roomCategories.length > 0) {
      // Ensure availableRooms defaults to totalRooms on creation
      const normalizedCategories = roomCategories.map((rc) => ({
        type: rc.type,
        totalRooms: Number(rc.totalRooms) || 0,
        availableRooms: Number(rc.totalRooms) || 0, // start fully available
        pricePerBed: Number(rc.pricePerBed) || 0,
      }));

      // Base rent = lowest pricePerBed across categories
      const prices = normalizedCategories.map((c) => c.pricePerBed).filter((p) => p > 0);
      if (prices.length > 0) {
        derivedRent = Math.min(...prices);
      }
      // Legacy roomType = first category type
      derivedRoomType = normalizedCategories[0].type;

      const newProperty = await Property.create({
        ...rest,
        landlordId: req.params.userId,
        roomCategories: normalizedCategories,
        rent: derivedRent,
        roomType: derivedRoomType,
      });

      return res.status(201).json({
        message: "Property added successfully",
        data: newProperty,
      });
    }

    // Legacy fallback (no roomCategories sent)
    const newProperty = await Property.create({
      ...rest,
      landlordId: req.params.userId,
    });

    res.status(201).json({
      message: "Property added successfully",
      data: newProperty,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding property" });
  }
};

// GET ALL
const getAllProperties = async (req, res) => {
  try {
    const { location, gender, minPrice, maxPrice, amenities, roomType } = req.query;

    let filter = {};

    if (location && location.trim() !== "") {
      filter.city = { $regex: location.trim(), $options: "i" };
    }

    if (gender) {
      filter.gender = { $regex: `^${gender}$`, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.rent = {};
      if (minPrice) filter.rent.$gte = Number(minPrice);
      if (maxPrice) filter.rent.$lte = Number(maxPrice);
    }

    if (amenities) {
      const amenitiesArray = amenities.split(",").map((a) => a.trim());
      filter.amenities = { $all: amenitiesArray };
    }

    if (roomType) {
      // Match properties that have this roomType in their roomCategories
      filter.$or = [
        { "roomCategories.type": { $regex: `^${roomType}$`, $options: "i" } },
        { roomType: { $regex: `^${roomType}$`, $options: "i" } },
      ];
    }

    const properties = await Property.find(filter).populate("landlordId");

    res.status(200).json({
      message: "Filtered properties fetched",
      data: properties,
    });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: "Error fetching properties" });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId).populate("landlordId");
    res.json(property);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching property" });
  }
};

// UPDATE
const updateProperty = async (req, res) => {
  try {
    const { roomCategories, ...rest } = req.body;

    let updateData = { ...rest };

    if (Array.isArray(roomCategories) && roomCategories.length > 0) {
      updateData.roomCategories = roomCategories.map((rc) => ({
        type: rc.type,
        totalRooms: Number(rc.totalRooms) || 0,
        availableRooms: rc.availableRooms !== undefined ? Number(rc.availableRooms) : Number(rc.totalRooms) || 0,
        pricePerBed: Number(rc.pricePerBed) || 0,
      }));

      const prices = updateData.roomCategories.map((c) => c.pricePerBed).filter((p) => p > 0);
      if (prices.length > 0) updateData.rent = Math.min(...prices);
      updateData.roomType = updateData.roomCategories[0].type;
    }

    const updated = await Property.findByIdAndUpdate(req.params.propertyId, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
  deleteProperty,
};