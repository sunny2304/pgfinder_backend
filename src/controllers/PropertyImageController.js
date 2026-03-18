const PropertyImage = require("../models/PropertyImageModel");
const uploadToCloudinary = require("../utils/CloudinaryUtil");

// CREATE PROPERTY IMAGE
const createPropertyImage = async (req, res) => {
  try {
    // Upload file to Cloudinary
    const cloudinaryResponse = await uploadToCloudinary(req.file.path);
    console.log("cloudinaryResponse", cloudinaryResponse);

    // Save property image to DB
    const savedImage = await PropertyImage.create({
      pgId: req.body.pgId, // property id
      imageUrl: cloudinaryResponse.secure_url
    });

    res.status(201).json({
      message: "Property image created successfully",
      savedImage: savedImage
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error while creating property image",
      err: err
    });
  }
};

// GET ALL IMAGES FOR A PROPERTY
const getPropertyImages = async (req, res) => {
  try {
    const { pgId } = req.params;
    const images = await PropertyImage.find({ pgId });

    res.status(200).json({
      message: "Property images fetched successfully",
      images: images
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error while fetching property images",
      err: err
    });
  }
};

module.exports = {
  createPropertyImage,
  getPropertyImages
};