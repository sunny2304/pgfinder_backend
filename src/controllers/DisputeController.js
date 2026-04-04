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
        console.log("🔥 Fetching disputes...");

        const disputes = await Dispute.find().lean();

        const User = require("../models/UserModel");
        const Property = require("../models/PGPropertyModel");

        const result = [];

        for (let dispute of disputes) {
            let booking = null;
            let raisedBy = null;   // the user/landlord who submitted the dispute
            let tenant = null;     // the tenant on the booking
            let landlord = null;   // the landlord who owns the property
            let property = null;

            try {
                // Fetch the booking
                booking = await Booking.findById(dispute.bookingId).lean();

                if (booking) {
                    // Tenant on the booking
                    tenant = await User.findById(booking.tenantId).select("firstName lastName email role").lean();

                    // Property + landlord
                    property = await Property.findById(booking.pgId).select("pgName city area landlordId").lean();

                    if (property?.landlordId) {
                        landlord = await User.findById(property.landlordId).select("firstName lastName email role").lean();
                    }
                }

                // Who actually raised this dispute (could be tenant OR landlord)
                raisedBy = await User.findById(dispute.userId).select("firstName lastName email role").lean();

            } catch (err) {
                console.log("⚠️ Broken reference skipped:", err.message);
            }

            // Determine the "raised against" party:
            // If raisedBy is the tenant → dispute is against the landlord
            // If raisedBy is the landlord → dispute is against the tenant
            let raisedAgainst = null;
            if (raisedBy && tenant && landlord) {
                raisedAgainst = raisedBy._id?.toString() === tenant._id?.toString() ? landlord : tenant;
            } else if (raisedBy && tenant && !landlord) {
                raisedAgainst = tenant._id?.toString() === raisedBy._id?.toString() ? null : tenant;
            } else if (raisedBy && landlord && !tenant) {
                raisedAgainst = landlord._id?.toString() === raisedBy._id?.toString() ? null : landlord;
            }

            result.push({
                ...dispute,
                booking,
                raisedBy,       // who submitted the dispute
                raisedAgainst,  // the other party
                tenant,
                landlord,
                property
            });
        }

        res.json(result);

    } catch (err) {
        console.error("❌ FINAL ERROR:", err);
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