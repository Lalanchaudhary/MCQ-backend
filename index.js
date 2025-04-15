const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require("http");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const userRouter = require('./routes/userRoute');
const testRouter = require('./routes/testRoute');
const LeaderBoardRoute = require('./routes/LeaderBoardRoute');
const body_parser = require("body-parser");
const { Server } = require("socket.io");
const db = require('./db/db');
const app = express();
dotenv.config();

// Security middleware
app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/usersroute', userRouter);
app.use('/testroute', testRouter);
app.use('/LeaderBoardRoute', LeaderBoardRoute);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const startServer = async () => {
    try {
        await db();
        const httpServer = http.createServer(app);

        // Setup Socket.IO
        const io = new Server(httpServer, {
            cors: {
                origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                credentials: true
            }
        });

        io.on("connection", (socket) => {
            console.log("User connected:", socket.id);

            socket.on("join-room", (userId) => {
                socket.join(userId);
                console.log(`User ${userId} joined room`);
            });

            socket.on("friend-request", (data) => {
                console.log(`Friend request sent to ${data.receiverId} from ${data.userId}`);
                io.to(data.receiverId).emit("friend-request", { 
                    senderId: data.userId, 
                    message: "New Friend Request!" 
                });
            });

            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });

        app.get("/", (req, res) => {
            res.send("Welcome");
        });

        const PORT = process.env.PORT || 9000;
        httpServer.listen(PORT, () => {
            console.log(`Server started at ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();