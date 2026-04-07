import { Chess } from 'chess.js';

const rooms = {};

export const createRoom = (roomId = null) => {
  const id = roomId ? roomId.toUpperCase() : Math.random().toString(36).slice(2, 10).toUpperCase();
  if (!rooms[id]) {
    rooms[id] = {
      players: {},
      game: new Chess(),
    };
  }
  return { roomId: id, fen: rooms[id].game.fen() };
};

const sanitizeRoomId = (roomId) => (roomId || '').toString().trim().toUpperCase();

export const normalizeRoomId = sanitizeRoomId;

export const getRoom = (roomId) => rooms[roomId] || null;

export const roomExists = (roomId) => Boolean(rooms[roomId]);

export const removeRoom = (roomId) => {
  if (rooms[roomId]) {
    delete rooms[roomId];
  }
};

export const addPlayerToRoom = (roomId, socketId, username, color) => {
  if (!rooms[roomId]) return null;
  rooms[roomId].players[socketId] = { username, color };
  return rooms[roomId];
};

export const removePlayerFromRoom = (roomId, socketId) => {
  if (!rooms[roomId]) return;
  delete rooms[roomId].players[socketId];

  if (Object.keys(rooms[roomId].players).length === 0) {
    delete rooms[roomId];
  }
};

