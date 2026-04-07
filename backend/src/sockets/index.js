import { setupGameSocket } from './game.socket.js';
import { setupChatSocket } from './chat.socket.js';

export const setupSocketHandlers = (io) => {
  const socketRoomMap = {};

  io.on('connection_error', (err) => {
    console.error('[Socket Connection Error]', err.message || err);
  });

  io.on('connect_error', (err) => {
    console.error('[Socket Connect Error]', err.message || err);
  });

  io.on('connection', (socket) => {
    try {
      setupGameSocket(socket, io, socketRoomMap);
      setupChatSocket(socket, io);

      socket.on('error', (error) => {
        console.error('[Socket Handler Error]', error.message || error);
      });

    } catch (error) {
      socket.emit('error', { message: 'Failed to initialize socket handlers' });
    }
  });
};
