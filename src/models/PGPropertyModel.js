const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Sub-schema for each room category
const roomCategorySchema = new Schema({
  type: {
    type: String,
    enum: ["single", "double", "triple"],
    required: true
  },
  totalRooms: {
    type: Number,
    required: true,
    min: 0
  },
  availableRooms: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerBed: {
    type: Number,
    min: 0
  }
}, { _id: false });

const pgPropertySchema = new Schema({

  pgName: {
    type: String,
    required: true
  },

  landlordId: {
    type: mongoose.Types.ObjectId,
    ref: "users"
  },

  city: String,
  area: String,
  address: String,

  // Base rent (kept for backward compat / browse filters)
  rent: Number,

  // ── NEW: multiple room categories ──────────────────────────────────────────
  // e.g. [{ type:"single", totalRooms:10, availableRooms:8, pricePerBed:7000 },
  //        { type:"double", totalRooms:6,  availableRooms:6, pricePerBed:5000 }]
  roomCategories: {
    type: [roomCategorySchema],
    default: []
  },

  // Legacy single roomType kept for backward compat with old documents
  roomType: {
    type: String,
    enum: ["single", "double", "triple"]
  },

  gender: {
    type: String,
    enum: ["male", "female"]
  },

  amenities: {
    type: [String],
    enum: ["wifi", "ac", "meals", "laundry", "gym", "parking", "security"]
  },

  description: String,

  available: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("pg_properties", pgPropertySchema);