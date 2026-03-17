const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/PaymentController");

// Create payment for booking
router.post("/bookings/:bookingId/payments", PaymentController.createPayment);

// Get all payments
router.get("/payments", PaymentController.getAllPayments);

module.exports = router;