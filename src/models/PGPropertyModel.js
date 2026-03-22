const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

  rent: Number,

  roomType: {
    type: String,
    enum: ["single", "double", "triple"]
  },

  gender: {
    type: String,
    enum: ["male", "female", "unisex"]
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