import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [roomId, setRoomId] = useState(() => {
    try {
      const saved = sessionStorage.getItem('chess_room');
      return saved ? JSON.parse(saved)?.roomId : null;
    } catch (error) {
      return null;
    }
  });

  const [board, setBoard] = useState(() => {
    try {
      const saved = sessionStorage.getItem('chess_room');
      if (saved && JSON.parse(saved)?.fen) {
        return new Chess(JSON.parse(saved).fen);
      }
      return new Chess();
    } catch (error) {
      return new Chess();
    }
  });

  const [players, setPlayers] = useState(() => {
    try {
      const saved = sessionStorage.getItem('chess_room');
      return saved ? JSON.parse(saved)?.players : { self: null, opponent: null };
    } catch (error) {
      return { self: null, opponent: null };
    }
  });

  const [playerColor, setPlayerColor] = useState(() => {
    try {
      const saved = sessionStorage.getItem('chess_room');
      return saved ? JSON.parse(saved)?.playerColor : null;
    } catch (error) {
      return null;
    }
  });

  const [isYourTurn, setIsYourTurn] = useState(() => {
    try {
      const saved = sessionStorage.getItem('chess_room');
      return saved ? JSON.parse(saved)?.isYourTurn : false;
    } catch (error) {
      return false;
    }
  });

  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameStatus, setGameStatus] = useState('playing');
  const [drawReason, setDrawReason] = useState(null);
  const [opponentJoined, setOpponentJoined] = useState(false);

  const analyzeGameStatus = useCallback((chessBoard) => {
    let status = 'playing';
    let drawReason = null;
    let winner = null;

    try {
      if (chessBoard.isCheckmate()) {
        status = 'checkmate';
        winner = chessBoard.turn() === 'w' ? 'black' : 'white';
      } else if (chessBoard.isStalemate()) {
        status = 'stalemate';
        winner = 'draw';
      } else if (chessBoard.isDraw()) {
        status = 'draw';
        winner = 'draw';

        const moves = chessBoard.moves();
        if (moves.length === 0 && !chessBoard.isCheckmate()) {
          drawReason = 'stalemate';
        } else if (chessBoard.getHistory({ verbose: true }).length > 0) {
          const history = chessBoard.getHistory({ verbose: true });
          if (history.length >= 100) {
            drawReason = 'fifty-move';
          } else {
            drawReason = 'repetition';
          }
        } else {
          const pieces = chessBoard.board().flat().filter(p => p !== null);
          drawReason = 'insufficient';
        }
      } else if (chessBoard.inCheck()) {
        status = 'check';
      }

      return { status, drawReason, winner };
    } catch (error) {
      return { status: 'playing', drawReason: null, winner: null };
    }
  }, []);

  useEffect(() => {
    try {
      const data = {
        roomId,
        playerColor,
        isYourTurn,
        players,
        fen: board?.fen ? board.fen() : new Chess().fen(),
      };

      if (roomId) {
        sessionStorage.setItem('chess_room', JSON.stringify(data));
      } else {
        sessionStorage.removeItem('chess_room');
      }
    } catch (error) {
      // Silently fail on storage error
    }
  }, [roomId, playerColor, isYourTurn, players, board]);

  const createGame = useCallback((overrideRoomId = null) => {
    const newRoomId = overrideRoomId || Math.random().toString(36).substring(2, 11).toUpperCase();
    setRoomId(newRoomId);
    setBoard(new Chess());
    setPlayerColor('white');
    setIsYourTurn(true);
    setPlayers({ self: null, opponent: null });
    setOpponentJoined(false);
    setGameOver(false);
    setWinner(null);
    return newRoomId;
  }, []);

  const joinGame = useCallback((id) => {
    setRoomId(id);
    setPlayerColor('black');
    setIsYourTurn(false);
    setBoard(new Chess());
    setPlayers({ self: null, opponent: null });
    setOpponentJoined(false);
    setGameOver(false);
    setWinner(null);
  }, []);

  const makeMove = useCallback(
    (move) => {
      try {
        const newBoard = new Chess(board.fen());
        const result = newBoard.move(move, { sloppy: true });

        if (!result) {
          return null;
        }

        const newFEN = newBoard.fen();

        setBoard(newBoard);

        setIsYourTurn(false);

        const { status, drawReason: reason, winner: gameWinner } = analyzeGameStatus(newBoard);
        setGameStatus(status);
        if (reason) setDrawReason(reason);
        if (gameWinner) {
          setGameOver(true);
          setWinner(gameWinner);
        }

        return result;
      } catch (error) {
        return null;
      }
    },
    [board, playerColor]
  );

  const updateBoard = useCallback(
    (fen, playerColorOverride) => {
      try {
        const newBoard = new Chess(fen);
        setBoard(newBoard);

        const currentPlayerColor = playerColorOverride || playerColor;

        const currentTurn = newBoard.turn();
        const isWhiteTurn = currentTurn === 'w';
        const shouldBePlayerTurn = (isWhiteTurn && currentPlayerColor === 'white') || (!isWhiteTurn && currentPlayerColor === 'black');

        setIsYourTurn(shouldBePlayerTurn);

        const { status, drawReason: reason, winner: gameWinner } = analyzeGameStatus(newBoard);
        setGameStatus(status);
        if (reason) setDrawReason(reason);
        if (gameWinner) {
          setGameOver(true);
          setWinner(gameWinner);
        }
      } catch (error) {
      }
    },
    [playerColor]
  );

  const setPlayer = useCallback((username, position) => {
    setPlayers((prev) => ({
      ...prev,
      [position]: username,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setRoomId(null);
    setBoard(new Chess());
    setPlayers({ self: null, opponent: null });
    setPlayerColor(null);
    setIsYourTurn(false);
    setGameOver(false);
    setWinner(null);
    setOpponentJoined(false);
    sessionStorage.removeItem('chess_room');
  }, []);

  const rejoinRoom = useCallback((emit) => {
    if (roomId) {
      emit('join_room', {
        roomId,
        username: players.self || 'Player',
      });
    }
  }, [roomId, players.self]);

  const value = {
    roomId,
    board,
    players,
    playerColor,
    isYourTurn,
    gameOver,
    winner,
    gameStatus,
    drawReason,
    opponentJoined,
    createGame,
    joinGame,
    makeMove,
    updateBoard,
    setPlayer,
    setPlayerColor,
    setOpponentJoined,
    resetGame,
    rejoinRoom,
    setGameOver,
    setWinner,
    setIsYourTurn,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
