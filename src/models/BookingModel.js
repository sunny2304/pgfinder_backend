const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    // 👤 User reference
    tenantId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },

    // 🏠 Property reference
    pgId: {
      type: mongoose.Types.ObjectId,
      ref: "pg_properties",
      required: true,
    },

    // 📅 Booking Dates
    checkInDate: {
      type: Date,
      required: true,
    },

    checkOutDate: {
      type: Date,
      required: true,
    },

    // 🛏 Room Type
    roomType: {
      type: String,
      enum: ["single", "double", "triple"],
      required: true,
    },

    // 👤 Gender Preference (optional)
    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
    },

    // 📌 Status
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("bookings", bookingSchema);