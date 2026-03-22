const express = require("express");
const app = express();
const cors = require("cors");

// ENV
require("dotenv").config();

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// DB CONNECTION
const DBConnection = require("./src/utils/DBConnection");
DBConnection();

// ROUTES IMPORT
const UserRoutes = require("./src/routes/UserRoutes");
const PropertyRoutes = require("./src/routes/PGPropertyRoutes");
const BookingRoutes = require("./src/routes/BookingRoutes");
const PaymentRoutes = require("./src/routes/PaymentRoutes");
const ReviewRoutes = require("./src/routes/ReviewRoutes");
// const MessageRoutes = require("./src/routes/MessageRoutes");
const DisputeRoutes = require("./src/routes/DisputeRoutes");
const ActivityLogRoutes = require("./src/routes/ActivityLogRoutes");
const PropertyImageRoutes = require("./src/routes/PropertyImageRoutes");

// ROUTES USE 
app.use("/api", UserRoutes);
app.use("/api", PropertyRoutes);
app.use("/api", BookingRoutes);
app.use("/api", PaymentRoutes);
app.use("/api", ReviewRoutes);
// app.use("/api", MessageRoutes);
app.use("/api", PropertyImageRoutes);
app.use("/api", DisputeRoutes);
app.use("/api", ActivityLogRoutes);


// SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});