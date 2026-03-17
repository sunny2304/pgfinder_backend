const Booking = require("../models/BookingModel");
const User = require("../models/UserModel");
const Property = require("../models/PGPropertyModel");

// CREATE BOOKING
const createBooking = async (req, res) => {
    try {
        const { userId, propertyId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ message: "Property not found" });

        const booking = await Booking.create({
            ...req.body,
            user: userId,
            property: propertyId
        });

        res.status(201).json(booking);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ALL
const getAllBookings = async (req, res) => {
    const bookings = await Booking.find().populate("user property");
    res.json(bookings);
};

// USER BOOKINGS
const getUserBookings = async (req, res) => {
    const bookings = await Booking.find({
        user: req.params.userId
    }).populate("property");

    res.json(bookings);
};

// GET BY ID
const getBookingById = async (req, res) => {
    const booking = await Booking.findById(req.params.bookingId)
        .populate("user property");

    res.json(booking);
};

// UPDATE STATUS
const updateBookingStatus = async (req, res) => {
    const updated = await Booking.findByIdAndUpdate(
        req.params.bookingId,
        { status: req.body.status },
        { new: true }
    );

    res.json(updated);
};

module.exports = {
    createBooking,
    getAllBookings,
    getUserBookings,
    getBookingById,
    updateBookingStatus
};