import { useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { useSocket } from '../context/SocketContext';

export const useGameMove = () => {
  const { board, playerColor, isYourTurn, gameOver, makeMove, roomId } = useGame();
  const { emit, connected } = useSocket();

  const canMove = useCallback(() => {
    const canMoveResult = !gameOver && isYourTurn && connected && roomId && board;
    return canMoveResult;
  }, [gameOver, isYourTurn, connected, roomId, board]);

  const executeMove = useCallback(
    (sourceSquare, targetSquare) => {
      if (!canMove()) {
        return false;
      }

      try {
        const moveResult = makeMove({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q',
        });

        if (!moveResult) {
          return false;
        }

        emit('send_move', {
          roomId,
          move: {
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q',
          },
        });

        return true;
      } catch (error) {
        return false;
      }
    },
    [canMove, makeMove, emit, roomId]
  );

  return {
    executeMove,
    canMove: canMove(),
    isYourTurn,
    gameOver,
    connected,
  };
};
