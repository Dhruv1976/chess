export const calculateMovesForSquare = (board, square) => {
  if (!board || !square) {
    return [];
  }

  try {
    const piece = board.get(square);
    if (!piece) {
      return [];
    }

    const allMoves = board.moves({ square, verbose: true });
    return allMoves.map((move) => move.to);
  } catch (error) {
    return [];
  }
};

export const isPieceOwnedByPlayer = (board, square, playerColor) => {
  if (!board || !square || !playerColor) {
    return false;
  }

  try {
    const piece = board.get(square);
    if (!piece) {
      return false;
    }

    const playerColorCode = playerColor === 'white' ? 'w' : 'b';
    return piece.color === playerColorCode;
  } catch (error) {
    return false;
  }
};

export const getPieceSymbol = (piece) => {
  const symbols = {
    P: '♟',
    N: '♞',
    B: '♝',
    R: '♜',
    Q: '♛',
    K: '♚',
    p: '♙',
    n: '♘',
    b: '♗',
    r: '♖',
    q: '♕',
    k: '♔',
  };
  return symbols[piece] || '';
};

export const isMoveLegal = (board, move) => {
  if (!board || !move || !move.from || !move.to) {
    return false;
  }

  try {
    const possibleMoves = board.moves({ square: move.from, verbose: true });
    return possibleMoves.some((m) => m.to === move.to);
  } catch (error) {
    return false;
  }
};

export const getBoardFEN = (board) => {
  try {
    return board?.fen() || '';
  } catch (error) {
    return '';
  }
};
