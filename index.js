const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require("http");
const userRouter = require('./routes/userRoute');
const testRouter = require('./routes/testRoute');
const body_parser = require("body-parser");
const { Server } = require("socket.io");
const db = require('./db/db');
const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static('uploads')); 
// Routes
app.use('/usersroute', userRouter);
app.use('/testroute', testRouter);

db()
const httpServer = http.createServer(app);

// Setup Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join room with userId
    socket.on("join-room", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    // Handle friend request notifications
    socket.on("friend-request", (data) => {
        console.log(`Friend request sent to ${data.receiverId} from ${data.userId}`);
        io.to(data.receiverId).emit("friend-request", { senderId: data.userId, message: "New Friend Request!" });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

app.get("/",(req,res)=>{
    res.send("Welcome")

})

// Export io to use in routes

const PORT = process.env.PORT || 9000;
httpServer.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});