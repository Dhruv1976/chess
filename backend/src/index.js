import http from 'http';
import dotenv from 'dotenv';
import app from './app.js';
import { Server as SocketIOServer } from 'socket.io';
import { initializeSockets } from './socketManager.js';

dotenv.config();

const PORT = process.env.PORT;

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

initializeSockets(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});