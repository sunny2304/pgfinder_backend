const Dispute = require("../models/DisputeModel");
const Booking = require("../models/BookingModel");

// CREATE DISPUTE
const createDispute = async (req, res) => {
    try {
        const booking = await Booking.findById(req.body.booking);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const dispute = await Dispute.create(req.body);
        res.status(201).json(dispute);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllDisputes = async (req, res) => {
    const disputes = await Dispute.find().populate("booking");
    res.json(disputes);
};

module.exports = {
    createDispute,
    getAllDisputes
};