const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // temporary storage
const {
  createPropertyImage,
  getPropertyImages
} = require("../controllers/PropertyImageController");

// Route to upload a new property image
router.post("/upload", upload.single("image"), createPropertyImage);

// Route to get all images for a property
router.get("/propertyimage/:pgId", getPropertyImages);

module.exports = router;