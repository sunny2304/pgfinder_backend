const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/PaymentController");
const RazorpayController = require("../controllers/RazorPayController");

// ── Existing routes ──────────────────────────────────────────────────────────
// Create payment for booking (used internally after verification)
router.post("/bookings/:bookingId/payments", PaymentController.createPayment);

// Get all payments (admin)
router.get("/payments", PaymentController.getAllPayments);

// ── Razorpay routes ──────────────────────────────────────────────────────────
// Step 1: Create Razorpay order
router.post("/payment/create-order", RazorpayController.createOrder);

// Step 2: Verify payment signature + save record + confirm booking
router.post("/payment/verify-payment", RazorpayController.verifyPayment);

module.exports = router;