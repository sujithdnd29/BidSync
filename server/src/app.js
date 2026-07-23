const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const auctionRoutes = require("./routes/auctionRoutes");

const bidRoutes = require("./routes/bidRoutes");


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "BidSync API is running 🚀"
    });
});

app.use("/api/auctions", auctionRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/bids",bidRoutes);

module.exports = app;