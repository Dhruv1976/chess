import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { useGame } from '../../context/GameContext';
import { useSocket } from '../../context/SocketContext';

const ChessBoard = () => {
  const { board, playerColor, isYourTurn, gameOver, gameStatus, drawReason, winner, makeMove, roomId } = useGame();
  const { emit, connected } = useSocket();

  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);

  const boardOrientation = playerColor === 'black' ? 'black' : 'white';

  const calculatePossibleMoves = useCallback(
    (square) => {
      if (!board || !square) {
        return [];
      }

      try {
        const piece = board.get(square);

        if (!piece) {
          return [];
        }

        const playerColorCode = playerColor === 'white' ? 'w' : 'b';
        if (piece.color !== playerColorCode) {
          return [];
        }

        const allMoves = board.moves({ square, verbose: true });
        const moves = allMoves.map((move) => move.to);
        return moves;
      } catch (error) {
        return [];
      }
    },
    [board, playerColor]
  );

  const handleSquareClick = useCallback(
    (clickedSquare) => {
      if (!isYourTurn) {
        return;
      }

      if (gameOver) {
        return;
      }

      if (!connected) {
        return;
      }

      if (!board) {
        return;
      }

      if (selectedSquare === clickedSquare) {
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }

      if (selectedSquare && possibleMoves.includes(clickedSquare)) {
        try {
          const moveResult = makeMove({
            from: selectedSquare,
            to: clickedSquare,
            promotion: 'q',
          });

          if (!moveResult) {
            return;
          }

          emit('send_move', {
            roomId,
            move: { from: selectedSquare, to: clickedSquare, promotion: 'q' },
          });

          setSelectedSquare(null);
          setPossibleMoves([]);
        } catch (error) {
        }
        return;
      }

      const piece = board.get(clickedSquare);

      if (!piece) {
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }

      const pieceColor = piece.color === 'w' ? 'white' : 'black';

      if (pieceColor !== playerColor) {
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }

      const moves = calculatePossibleMoves(clickedSquare);

      setSelectedSquare(clickedSquare);
      setPossibleMoves(moves);
    },
    [
      selectedSquare,
      possibleMoves,
      isYourTurn,
      gameOver,
      connected,
      board,
      playerColor,
      makeMove,
      emit,
      roomId,
      calculatePossibleMoves,
    ]
  );

  useEffect(() => {
    setSelectedSquare(null);
    setPossibleMoves([]);
  }, [isYourTurn]);

  const customSquares = useMemo(() => {
    const squares = {};

    if (selectedSquare) {
      squares[selectedSquare] = {
        backgroundColor: 'rgba(255, 193, 7, 0.5)',
        boxShadow: 'inset 0 0 0 2px #ff9800',
      };
    }

    possibleMoves.forEach((sq) => {
      squares[sq] = {
        backgroundColor: 'rgba(76, 175, 80, 0.4)',
        boxShadow: 'inset 0 0 0 2px #4caf50',
      };
    });

    return squares;
  }, [selectedSquare, possibleMoves]);

  if (!board) {
    return (
      <div className="w-full max-w-lg mx-auto flex justify-center items-center bg-amber-100 rounded-lg p-10 border-4 border-amber-900">
        <p className="text-gray-600 font-semibold text-center">Initializing board...</p>
      </div>
    );
  }

  const chessboardOptions = {
    position: board.fen(),
    onSquareClick: ({ square, piece }) => {
      handleSquareClick(square);
    },
    boardOrientation: boardOrientation,
    allowDragging: false,
    squareStyles: customSquares,
    boardStyle: {
      borderRadius: '4px',
      boxShadow: 'inset 0 0 8px rgba(0, 0, 0, 0.2)',
    },
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="w-full max-w-lg bg-amber-100 p-2 sm:p-3 rounded-lg shadow-xl border-4 border-amber-900">
        <div style={{ width: '100%', aspectRatio: '1' }}>
          <Chessboard options={chessboardOptions} />
        </div>
      </div>

      {gameStatus === 'check' && isYourTurn && (
        <p className="text-xs sm:text-sm text-center max-w-lg px-2 py-2 border rounded bg-red-50 border-red-300 text-red-700 font-semibold">
          🔴 YOUR KING IS IN CHECK - MUST MOVE!
        </p>
      )}
      {gameStatus === 'checkmate' && (
        <p className="text-xs sm:text-sm text-center max-w-lg px-2 py-2 border rounded bg-yellow-50 border-yellow-300 text-yellow-800 font-semibold">
          🏁 CHECKMATE! Game Over!
        </p>
      )}
      {gameStatus === 'stalemate' && isYourTurn && (
        <p className="text-xs sm:text-sm text-center max-w-lg px-2 py-2 border rounded bg-blue-50 border-blue-300 text-blue-700 font-semibold">
          🤝 STALEMATE! No legal moves available!
        </p>
      )}
      {gameStatus === 'draw' && (
        <p className="text-xs sm:text-sm text-center max-w-lg px-2 py-2 border rounded bg-blue-50 border-blue-300 text-blue-700 font-semibold">
          🎯 DRAW - Game Over!
          {gameStatus === 'draw' && drawReason && (
            <span className="block text-xs mt-1">
              {drawReason === 'insufficient' && 'Insufficient Material'}
              {drawReason === 'repetition' && 'Threefold Repetition'}
              {drawReason === 'fifty-move' && '50-Move Rule'}
              {drawReason === 'stalemate' && 'Stalemate'}
            </span>
          )}
        </p>
      )}
      {gameOver && !['check', 'checkmate', 'stalemate', 'draw'].includes(gameStatus) && (
        <p className="text-xs sm:text-sm text-center max-w-lg px-2 py-2 border rounded bg-gray-50 border-gray-300 text-gray-700 font-semibold">
          🏁 Game Over!
        </p>
      )}
      {!gameOver && (gameStatus === 'playing' || (gameStatus === 'check' && !isYourTurn) || (gameStatus === 'stalemate' && !isYourTurn)) && (
        <p className="text-xs sm:text-sm text-center max-w-lg px-2 py-2 border rounded bg-blue-50 border-blue-300 text-blue-700">
          {!isYourTurn ? '⏳ Waiting for opponent...' : '👆 Click piece to select • Click destination to move'}
        </p>
      )}
    </div>
  );
};

export default ChessBoard;

