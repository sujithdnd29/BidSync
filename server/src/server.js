require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {

    console.log(`Client Connected : ${socket.id}`);

    socket.on("disconnect", () => {

        console.log(`Client Disconnected : ${socket.id}`);

    });

});

const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Start Server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});