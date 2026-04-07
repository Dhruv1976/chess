import React from 'react';
import { useGame } from '../../context/GameContext';
import { useUser } from '../../context/UserContext';

const GameInfo = () => {
  const { players, playerColor, gameOver, winner, isYourTurn, gameStatus } = useGame();
  const { username } = useUser();

  const isWhite = playerColor === 'white';
  const whitePlayer = isWhite ? username : players.opponent;
  const blackPlayer = isWhite ? players.opponent : username;

  const isWhiteTurn = (isWhite && isYourTurn) || (!isWhite && !isYourTurn);

  const isCheckOnWhite = gameStatus === 'check' && isWhiteTurn;
  const isCheckOnBlack = gameStatus === 'check' && !isWhiteTurn;

  const PlayerCard = ({ king, title, playerName, isPlaying, isInCheck, bgColor }) => {
    const borderClass = isInCheck ? 'border-red-500 bg-red-50' : `border-gray-200 ${bgColor}`;
    const kingClass = isInCheck ? 'text-red-600 animate-pulse' : 'text-gray-800';
    
    return (
      <div className={`border-2 rounded-lg p-4 shadow-sm transition-all ${borderClass}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <span className={`text-3xl transition-colors ${kingClass}`}>
              {king}
            </span>
            <div className="flex flex-col">
              <h3 className="text-gray-900 font-semibold text-base">{title}</h3>
              {isPlaying && (
                <span className="text-xs font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full w-fit mt-1">
                  👤 Playing (Turn)
                </span>
              )}
              {isInCheck && (
                <span className="text-xs font-bold text-red-600 mt-1">
                  ⚠️ CHECK!
                </span>
              )}
            </div>
          </div>
        </div>
        <p className={`text-sm font-medium ${playerName ? 'text-gray-700' : 'text-gray-500 italic'}`}>
          {playerName || 'Waiting...'}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <PlayerCard
          king="♔"
          title="White Player"
          playerName={whitePlayer}
          isPlaying={isWhiteTurn}
          isInCheck={isCheckOnWhite}
          bgColor="bg-white"
        />
        <PlayerCard
          king="♚"
          title="Black Player"
          playerName={blackPlayer}
          isPlaying={!isWhiteTurn}
          isInCheck={isCheckOnBlack}
          bgColor="bg-gray-50"
        />
      </div>

      {gameOver && (
        <div className={`rounded-lg p-5 border-2 shadow-md text-center font-bold ${
          winner === 'draw'
            ? 'bg-yellow-50 border-yellow-300'
            : 'bg-green-50 border-green-300'
        }`}>
          <p className={`text-lg mb-2 ${
            winner === 'draw' ? 'text-yellow-900' : 'text-green-900'
          }`}>
            🏁 Game Over!
          </p>
          <p className={`text-2xl font-bold ${
            winner === 'draw' ? 'text-yellow-700' : 'text-green-700'
          }`}>
            {winner === 'draw' ? '🤝 It\'s a Draw!' : `🏆 ${winner?.toUpperCase()} Wins!`}
          </p>
        </div>
      )}
    </div>
  );
};

export default GameInfo;
