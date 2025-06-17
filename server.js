console.log("Starting server...");
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log("Client connected:", socket.id);

    socket.on('join_session', (data) => {
        socket.join(data.sessionId);
        console.log(`User ${socket.id} joined session ${data.sessionId}`);
    });

    socket.on('offer', (data) => socket.to(data.sessionId).emit('offer', data));
    socket.on('answer', (data) => socket.to(data.sessionId).emit('answer', data));
    socket.on('ice_candidate', (data) => socket.to(data.sessionId).emit('ice_candidate', data));
    socket.on('control_command', (data) => socket.to(data.sessionId).emit('control_command', data));

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

server.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
