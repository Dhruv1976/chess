import { createRoom, getRoom, roomExists, addPlayerToRoom, removePlayerFromRoom, normalizeRoomId } from '../services/gameStore.js';
import { Chess } from 'chess.js';

const safeColorAssignment = (roomId, requestedColor) => {
  const room = getRoom(roomId);
  if (!room) return requestedColor || 'white';

  const colorsTaken = new Set(Object.values(room.players).map((p) => p.color));

  if (requestedColor && !colorsTaken.has(requestedColor)) {
    return requestedColor;
  }

  if (!colorsTaken.has('white')) return 'white';
  if (!colorsTaken.has('black')) return 'black';

  return 'white';
};

const isValidMove = (move) => {
  if (!move || typeof move !== 'object') return false;
  if (!move.from || !move.to) return false;
  if (move.from.length !== 2 || move.to.length !== 2) return false;
  return true;
};

export const setupGameSocket = (socket, io, socketRoomMap) => {
  socket.on('join_room', ({ roomId, username, color } = {}) => {
    try {
      roomId = normalizeRoomId(roomId);
      if (!roomId || !username) {
        socket.emit('error', { message: 'Missing roomId or username' });
        return;
      }

      if (!roomExists(roomId)) {
        createRoom(roomId);
      }

      const room = getRoom(roomId);
      const existingPlayer = room.players[socket.id];

      if (existingPlayer) {
      }

      const playerCount = Object.keys(room.players).length;

      if (!existingPlayer && playerCount >= 2) {
        socket.emit('error', { message: 'Room is full' });
        return;
      }

      const playerColor = existingPlayer ? existingPlayer.color : safeColorAssignment(roomId, color || 'white');

      addPlayerToRoom(roomId, socket.id, username, playerColor);
      socketRoomMap[socket.id] = roomId;
      socket.join(roomId);

      const updatedRoom = getRoom(roomId);
      const players = Object.entries(updatedRoom.players).map(([id, p]) => ({ socketId: id, username: p.username, color: p.color }));

      socket.emit('joined_room', { roomId, players, playerColor, fen: updatedRoom.game.fen(), mySocketId: socket.id });
      socket.to(roomId).emit('player_joined', { socketId: socket.id, username, color: playerColor });

      if (players.length === 2) {
        io.in(roomId).emit('game_start', {
          roomId,
          players,
          initialFen: updatedRoom.game.fen(),
          turn: 'white',
        });
      } else {
        socket.emit('waiting_for_opponent', { roomId });
      }

      io.in(roomId).emit('room_update', {
        roomId,
        players,
        fen: updatedRoom.game.fen(),
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  socket.on('send_move', ({ roomId, move } = {}) => {
    try {
      roomId = normalizeRoomId(roomId);

      if (!roomId || !isValidMove(move)) {
        socket.emit('error', { message: 'Invalid move payload' });
        return;
      }

      const room = getRoom(roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      const player = room.players[socket.id];
      if (!player) {
        socket.emit('error', { message: 'You are not a player in this room' });
        return;
      }

      const chess = room.game;
      const turn = chess.turn();
      const isPlayerTurn = (turn === 'w' && player.color === 'white') || (turn === 'b' && player.color === 'black');

      if (!isPlayerTurn) {
        socket.emit('error', { message: 'Not your turn' });
        return;
      }

      const result = chess.move(move, { sloppy: true });
      if (!result) {
        socket.emit('illegal_move', { message: 'Illegal move', move });
        return;
      }

      const fen = chess.fen();

      const isCheckmate = chess.isCheckmate();
      const isDraw = chess.isDraw();
      const isCheck = chess.isCheck();
      const isGameOver = chess.isGameOver();

      io.in(roomId).emit('receive_move', {
        roomId,
        move: result,
        fen,
        isCheckmate,
        isDraw,
        isCheck,
        isGameOver,
        lastMoveBy: player.username,
      });

      if (isGameOver) {
        const winner = isCheckmate ? `${player.username} (${player.color})` : 'Draw';
        io.in(roomId).emit('game_over', {
          roomId,
          result: isCheckmate ? `${player.username} (${player.color}) wins by checkmate` : 'Draw',
          winner: isCheckmate ? player.color : 'draw',
        });
      }
    } catch (error) {
      socket.emit('error', { message: 'Failed to process move' });
    }
  });

  socket.on('resign', ({ roomId } = {}) => {
    try {
      roomId = normalizeRoomId(roomId);
      const room = getRoom(roomId);
      if (!room) {
        return;
      }
      const player = room.players[socket.id];
      if (!player) {
        return;
      }

      const winner = player.color === 'white' ? 'black' : 'white';
      console.log(`[Resign] ${player.username} (${player.color}) resigned. Winner: ${winner}`);
      io.in(roomId).emit('player_resigned', {
        roomId,
        resignedPlayer: player.username,
        winner,
      });

      room.game = new Chess();
    } catch (error) {
      console.error('[Resign Error]', error.message || error);
      socket.emit('error', { message: 'Failed to process resign' });
    }
  });

  const disconnectHandler = () => {
    try {
      const roomId = socketRoomMap[socket.id];
      if (!roomId) {
        return;
      }

      const normalizedRoomId = normalizeRoomId(roomId);
      const room = getRoom(normalizedRoomId);
      if (!room) {
        delete socketRoomMap[socket.id];
        return;
      }

      const player = room.players[socket.id];

      if (player) {
        removePlayerFromRoom(normalizedRoomId, socket.id);
      }

      delete socketRoomMap[socket.id];
      socket.leave(normalizedRoomId);

      const updatedRoom = getRoom(normalizedRoomId);
      if (updatedRoom) {
        io.in(normalizedRoomId).emit('room_update', {
          roomId: normalizedRoomId,
          players: Object.values(updatedRoom.players).map((p) => ({ username: p.username, color: p.color })),
          fen: updatedRoom.game.fen(),
        });

        if (player) {
          io.in(normalizedRoomId).emit('opponent_disconnected', {
            username: player.username,
            role: 'player',
          });
        }
      }
    } catch (error) {
      console.error('[Disconnect Error]', error.message || error);
    }
  };

  socket.on('leave_room', () => {
    disconnectHandler();
  });

  socket.on('disconnect', () => {
    disconnectHandler();
  });
};
