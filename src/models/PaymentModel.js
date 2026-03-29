const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({

    booking: {
        type: mongoose.Types.ObjectId,
        ref: "bookings"
    },

    userId: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },

    amount: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ["upi", "card", "netbanking"],
        default: "card"
    },

    paymentStatus: {
        type: String,
        enum: ["success", "failed", "pending"],
        default: "pending"
    },

    // Platform fee (5% of amount) — goes to admin
    platformFee: {
        type: Number,
        default: 0
    },

    // Amount landlord actually receives (amount - platformFee)
    landlordAmount: {
        type: Number,
        default: 0
    },

}, { timestamps: true });

module.exports = mongoose.model("payments", paymentSchema);