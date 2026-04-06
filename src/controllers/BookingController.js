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

    // ✅ Room availability logic
    // Check roomCategories array first (new schema); fall back to legacy roomType
    if (property.roomCategories && property.roomCategories.length > 0) {
      const category = property.roomCategories.find(
        (c) => c.type === roomType
      );

      if (!category) {
        return res.status(400).json({
          message: `This property does not offer ${roomType} rooms`,
        });
      }

      if (category.availableRooms <= 0) {
        return res.status(400).json({
          message: `No ${roomType} rooms available at this property`,
        });
      }

      // Determine how many bookings fill one room:
      // single = 1 booking, double = 2 bookings, triple = 3 bookings
      const bedsPerRoom = roomType === "triple" ? 3 : roomType === "double" ? 2 : 1;

      // Count CONFIRMED bookings of this type for this property
      const confirmedBookingsForType = await Booking.countDocuments({
        pgId: propertyId,
        roomType: roomType,
        bookingStatus: { $in: ["confirmed", "pending"] },
      });

      // Check if adding this booking would fill the next room slot
      // New booking occupies slot: confirmedBookingsForType + 1
      const occupiedBeds = confirmedBookingsForType + 1; // after this booking
      const roomsOccupied = Math.ceil(occupiedBeds / bedsPerRoom);
      const totalRooms = category.totalRooms;

      if (roomsOccupied > totalRooms) {
        return res.status(400).json({
          message: `No ${roomType} rooms available at this property`,
        });
      }

      // Recalculate available rooms dynamically
      const occupiedRoomsNow = Math.ceil(confirmedBookingsForType / bedsPerRoom);
      const newAvailable = totalRooms - occupiedRoomsNow - (occupiedBeds % bedsPerRoom === 1 ? 1 : 0);

      // Update availableRooms in roomCategories
      await Property.findOneAndUpdate(
        { _id: propertyId, "roomCategories.type": roomType },
        {
          $set: {
            "roomCategories.$.availableRooms": Math.max(0, totalRooms - Math.ceil(occupiedBeds / bedsPerRoom)),
          },
        }
      );
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
      .populate("tenantId", "firstName lastName email")
      .populate("pgId", "pgName city rent roomCategories");

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
    }).populate("pgId", "pgName rent city roomCategories");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 GET BOOKING BY ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("tenantId", "firstName lastName email")
      .populate("pgId", "pgName rent city roomCategories");

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 UPDATE BOOKING STATUS
// When cancelling a booking, restore the room slot
const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const prevStatus = booking.bookingStatus;
    const newStatus = req.body.status;

    const updated = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { bookingStatus: newStatus },
      { new: true }
    );

    // If cancelling a confirmed/pending booking → restore available room slot
    if (
      newStatus === "cancelled" &&
      prevStatus !== "cancelled"
    ) {
      const property = await Property.findById(booking.pgId);
      if (property && property.roomCategories && property.roomCategories.length > 0) {
        const roomType = booking.roomType;
        const bedsPerRoom = roomType === "triple" ? 3 : roomType === "double" ? 2 : 1;
        const category = property.roomCategories.find((c) => c.type === roomType);

        if (category) {
          // Recalculate: count remaining active bookings of this type
          const remainingBookings = await Booking.countDocuments({
            pgId: booking.pgId,
            roomType: roomType,
            bookingStatus: { $in: ["confirmed", "pending"] },
          });

          const roomsOccupied = Math.ceil(remainingBookings / bedsPerRoom);
          const newAvailable = Math.max(0, category.totalRooms - roomsOccupied);

          await Property.findOneAndUpdate(
            { _id: booking.pgId, "roomCategories.type": roomType },
            { $set: { "roomCategories.$.availableRooms": newAvailable } }
          );
        }
      }
    }

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