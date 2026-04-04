const Dispute = require("../models/DisputeModel");
const Booking = require("../models/BookingModel");

// CREATE DISPUTE
const createDispute = async (req, res) => {
    try {
        const { bookingId, userId, description } = req.body;

        if (!bookingId || !userId || !description) {
            return res.status(400).json({ message: "bookingId, userId and description are required" });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Prevent duplicate open disputes for same booking by same user
        const existing = await Dispute.findOne({ bookingId, userId, status: "open" });
        if (existing) {
            return res.status(409).json({ message: "You already have an open dispute for this booking" });
        }

        const dispute = await Dispute.create({ bookingId, userId, description });
        res.status(201).json(dispute);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ALL DISPUTES (ADMIN)
const getAllDisputes = async (req, res) => {
    try {
        const disputes = await Dispute.find()
            .populate({
                path: "bookingId",
                populate: [
                    { path: "tenantId", select: "firstName lastName email" },
                    { path: "pgId", select: "pgName city" }
                ]
            })
            .populate("userId", "firstName lastName email")
            .sort({ createdAt: -1 });

        res.json(disputes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET DISPUTES BY USER
const getUserDisputes = async (req, res) => {
    try {
        const disputes = await Dispute.find({ userId: req.params.userId })
            .populate({
                path: "bookingId",
                populate: { path: "pgId", select: "pgName city" }
            })
            .sort({ createdAt: -1 });

        res.json(disputes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// RESOLVE DISPUTE (ADMIN)
const resolveDispute = async (req, res) => {
    try {
        const dispute = await Dispute.findByIdAndUpdate(
            req.params.disputeId,
            { status: "resolved" },
            { new: true }
        )
        .populate("userId", "firstName lastName email")
        .populate({
            path: "bookingId",
            populate: [
                { path: "tenantId", select: "firstName lastName email" },
                { path: "pgId", select: "pgName city" }
            ]
        });

        if (!dispute) {
            return res.status(404).json({ message: "Dispute not found" });
        }

        res.json(dispute);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createDispute,
    getAllDisputes,
    getUserDisputes,
    resolveDispute
};