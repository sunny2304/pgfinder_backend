const Property = require("../models/PGPropertyModel");
const User = require("../models/UserModel");

// CREATE PROPERTY
const createProperty = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const property = await Property.create({
            ...req.body,
            owner: userId
        });

        res.status(201).json(property);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ALL
const getAllProperties = async (req, res) => {
    const properties = await Property.find().populate("owner");
    res.json(properties);
};

// GET BY ID
const getPropertyById = async (req, res) => {
    const property = await Property.findById(req.params.propertyId).populate("owner");
    res.json(property);
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