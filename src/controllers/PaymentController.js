const Payment = require("../models/PaymentModel");
const Booking = require("../models/BookingModel");

const PLATFORM_FEE_PCT = 5; // 5% goes to admin

// CREATE PAYMENT
const createPayment = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        const amount = req.body.amount;
        const platformFee = req.body.platformFee || Math.round(amount * PLATFORM_FEE_PCT / 100);
        const landlordAmount = req.body.landlordAmount || (amount - platformFee);

        const payment = await Payment.create({
            booking: bookingId,
            userId: req.body.userId || booking.tenantId,
            amount,
            paymentMethod: req.body.paymentMethod || "card",
            paymentStatus: req.body.paymentStatus || "pending",
            platformFee,
            landlordAmount,
        });

        res.status(201).json(payment);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ALL
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate({
                path: "booking",
                populate: [
                    { path: "tenantId", select: "firstName lastName email" },
                    { path: "pgId", select: "pgName city rent" }
                ]
            })
            .populate("userId", "firstName lastName email")
            .sort({ createdAt: -1 });

        // Normalize structure for frontend
        const normalized = payments.map(p => ({
            ...p.toObject(),
            bookingId: p.booking,
        }));

        res.json(normalized);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createPayment,
    getAllPayments
};