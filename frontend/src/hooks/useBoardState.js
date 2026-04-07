import { useCallback, useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

export const useBoardState = () => {
  const { board, playerColor, isYourTurn } = useGame();
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);

  useEffect(() => {
    setSelectedSquare(null);
    setPossibleMoves([]);
  }, [isYourTurn]);

  const calculateMoves = useCallback((square) => {
    if (!board || !square) {
      return [];
    }

    try {
      const allMoves = board.moves({ square, verbose: true });
      return allMoves.map((move) => move.to);
    } catch (error) {
      return [];
    }
  }, [board]);

  const selectSquare = useCallback(
    (square) => {
      if (!board || !square || !playerColor) {
        return;
      }

      const piece = board.get(square);
      if (!piece) {
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }

      const playerColorCode = playerColor === 'white' ? 'w' : 'b';
      if (piece.color !== playerColorCode) {
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }

      const moves = calculateMoves(square);
      setSelectedSquare(square);
      setPossibleMoves(moves);
    },
    [board, playerColor, calculateMoves]
  );

  const handleSquareClick = useCallback(
    (square, onMovePiece) => {
      if (!isYourTurn) {
        return;
      }

      if (selectedSquare === square) {
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }

      if (selectedSquare && possibleMoves.includes(square)) {
        onMovePiece(selectedSquare, square);
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }

      selectSquare(square);
    },
    [isYourTurn, selectedSquare, possibleMoves, selectSquare]
  );

  const getCustomSquares = useCallback(() => {
    const squares = {};

    if (selectedSquare) {
      squares[selectedSquare] = {
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
        border: '2px solid #ff6b35',
      };
    }

    possibleMoves.forEach((square) => {
      squares[square] = {
        backgroundColor: 'rgba(0, 255, 0, 0.3)',
        border: '2px solid #00ff00',
      };
    });

    return squares;
  }, [selectedSquare, possibleMoves]);

  return {
    selectedSquare,
    possibleMoves,
    handleSquareClick,
    getCustomSquares,
    selectSquare,
    clearSelection: () => {
      setSelectedSquare(null);
      setPossibleMoves([]);
    },
  };
};
