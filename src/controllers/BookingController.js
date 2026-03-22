const Booking = require("../models/BookingModel");
const User = require("../models/UserModel");
const Property = require("../models/PGPropertyModel");

// 🔥 CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const { userId, propertyId } = req.params;
    const { checkInDate, checkOutDate, roomType, gender } = req.body;

    // ✅ Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Validate property
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // ✅ Validate dates
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date",
      });
    }

    // ✅ Create booking
    const booking = await Booking.create({
      tenantId: userId,
      pgId: propertyId,
      checkInDate,
      checkOutDate,
      roomType,
      gender,
    });

    res.status(201).json({
      message: "Booking successful 🎉",
      data: booking,
    });
  } catch (err) {
    console.log("BOOKING ERROR:", err);
    res.status(500).json({
      message: "Error creating booking",
      error: err.message,
    });
  }
};

// 🔥 GET ALL BOOKINGS (ADMIN)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("tenantId", "firstName email")
      .populate("pgId", "pgName city rent");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 GET BOOKINGS OF A USER
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      tenantId: req.params.userId,
    }).populate("pgId", "pgName rent city");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 GET BOOKING BY ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("tenantId", "firstName email")
      .populate("pgId", "pgName rent city");

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 UPDATE BOOKING STATUS
const updateBookingStatus = async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { bookingStatus: req.body.status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
};