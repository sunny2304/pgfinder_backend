const express = require("express");
const router = express.Router();
const PropertyController = require("../controllers/PGPropertyController");
// const validateToken = require("../middleware/AuthMiddlware")
router.post("/users/:userId/properties", PropertyController.createProperty);
router.get("/properties",PropertyController.getAllProperties);
router.get("/properties/:propertyId", PropertyController.getPropertyById);
router.put("/properties/:propertyId", PropertyController.updateProperty);
router.delete("/properties/:propertyId", PropertyController.deleteProperty);

module.exports = router;