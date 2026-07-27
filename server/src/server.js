require("dotenv").config();
const startAuctionStatusJob = require("./jobs/auctionStatus.job");

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");

const { initializeSocket } = require("./socket");

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// Make io available throughout the project
initializeSocket(io);

io.on("connection", (socket) => {

    console.log(`Client Connected : ${socket.id}`);

    // Join an auction room
    socket.on("join-auction", (auctionId) => {

        socket.join(auctionId);

        console.log(
            `${socket.id} joined auction ${auctionId}`
        );

    });

    // Leave an auction room
    socket.on("leave-auction", (auctionId) => {

        socket.leave(auctionId);

        console.log(
            `${socket.id} left auction ${auctionId}`
        );

    });

    socket.on("disconnect", () => {

        console.log(
            `Client Disconnected : ${socket.id}`
        );

    });

});

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

startAuctionStatusJob();
// Start Server
server.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});