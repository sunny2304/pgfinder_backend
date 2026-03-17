const Payment = require("../models/PaymentModel");
const Booking = require("../models/BookingModel");

// CREATE PAYMENT
const createPayment = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        const payment = await Payment.create({
            ...req.body,
            booking: bookingId
        });

        res.status(201).json(payment);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ALL
const getAllPayments = async (req, res) => {
    const payments = await Payment.find().populate({
        path: "booking",
        populate: ["user", "property"]
    });

    res.json(payments);
};

module.exports = {
    createPayment,
    getAllPayments
};