import { createRoom, getRoom, roomExists, normalizeRoomId } from '../services/gameStore.js';

export const createGame = (req, res, next) => {
  try {
    const roomId = normalizeRoomId(req.body.roomId);
    const created = createRoom(roomId);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
};

export const joinGame = (req, res, next) => {
  try {
    const roomId = normalizeRoomId(req.body.roomId);
    if (!roomId || !roomExists(roomId)) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    const room = getRoom(roomId);
    const players = Object.values(room.players).map((p) => ({ username: p.username, color: p.color }));
    res.status(200).json({ success: true, data: { roomId, fen: room.game.fen(), players } });
  } catch (error) {
    next(error);
  }
};

export const getGame = (req, res, next) => {
  try {
    const roomId = normalizeRoomId(req.params.roomId);
    if (!roomId || !roomExists(roomId)) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    const room = getRoom(roomId);
    res.status(200).json({ success: true, data: { roomId, fen: room.game.fen(), players: Object.values(room.players) } });
  } catch (error) {
    next(error);
  }
};
