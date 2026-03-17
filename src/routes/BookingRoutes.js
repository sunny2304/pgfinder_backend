const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/BookingController");

// Create booking
router.post(
    "/users/:userId/properties/:propertyId/bookings",
    BookingController.createBooking
);

// Get all bookings (admin)
router.get("/bookings", BookingController.getAllBookings);

// Get bookings of a user
router.get("/users/:userId/bookings", BookingController.getUserBookings);

// Get booking by ID
router.get("/bookings/:bookingId", BookingController.getBookingById);

// Update booking status
router.patch("/bookings/:bookingId/status", BookingController.updateBookingStatus);

module.exports = router;