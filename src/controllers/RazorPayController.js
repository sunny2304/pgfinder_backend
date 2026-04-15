const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/PaymentModel");
const Booking = require("../models/BookingModel");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PLATFORM_FEE_PCT = 5;

// ── CREATE ORDER ─────────────────────────────────────────────────────────────
// POST /api/payment/create-order
// Body: { amount }   (amount in INR, e.g. 8000)
const createOrder = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount) * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
  }
};

// ── VERIFY PAYMENT ────────────────────────────────────────────────────────────
// POST /api/payment/verify-payment
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, userId, amount }
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
      userId,
      amount,
    } = req.body;

    // 1. Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    const platformFee = Math.round(amount * PLATFORM_FEE_PCT / 100);
    const landlordAmount = amount - platformFee;

    // 2. Save payment record
    await Payment.create({
      booking: bookingId,
      userId,
      amount,
      paymentMethod: "upi",
      paymentStatus: isValid ? "success" : "failed",
      platformFee,
      landlordAmount,
    });

    if (isValid) {
      // 3a. Payment success — confirm the booking
      await Booking.findByIdAndUpdate(bookingId, { bookingStatus: "confirmed" });
      return res.status(200).json({ success: true, message: "Payment verified" });
    } else {
      // 3b. Payment failed — cancel the booking so it doesn't show as pending
      await Booking.findByIdAndUpdate(bookingId, { bookingStatus: "cancelled" });
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { createOrder, verifyPayment };