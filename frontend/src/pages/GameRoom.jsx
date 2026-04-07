import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useSocket } from '../context/SocketContext';
import { useUser } from '../context/UserContext';
import ChessBoard from '../components/chess/ChessBoard';
import GameInfo from '../components/chess/GameInfo';
import Chat from '../components/chat/ChatBox';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const GameRoom = () => {
  const { roomId: routeRoomId } = useParams();
  const navigate = useNavigate();
  const {
    roomId: contextRoomId,
    board,
    playerColor,
    isYourTurn,
    gameOver,
    winner,
    setOpponentJoined,
    joinGame,
    updateBoard,
    setGameOver,
    setWinner,
    setPlayer,
    setPlayerColor,
  } = useGame();
  const { socket, emit, on, off, connected } = useSocket();
  const [mySocketId, setMySocketId] = useState(null);
  const { username } = useUser();
  const [copied, setCopied] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [hasUnreadMessage, setHasUnreadMessage] = useState(false);
  const hasJoinedRef = useRef(false);
  const { rejoinRoom } = useGame();

  useEffect(() => {
    if (!connected || !routeRoomId) {
      navigate('/');
    }
  }, [connected, routeRoomId, navigate]);

  useEffect(() => {
    if (!connected || !routeRoomId || hasJoinedRef.current) return;

    if (!contextRoomId) {
      joinGame(routeRoomId);
    }

    emit('join_room', {
      roomId: routeRoomId,
      username,
    });

    hasJoinedRef.current = true;
  }, [connected, routeRoomId, contextRoomId, playerColor, username, emit, joinGame]);

  useEffect(() => {
    if (!connected || !routeRoomId) return;

    const handlePlayerJoined = (data) => {
      setOpponentJoined(true);
      setGameStarted(true);
      toast.success(`${data.username} joined the game!`, {
        icon: '🎉',
        duration: 4000,
      });
    };

    const handleWaiting = () => {
      setGameStarted(false);
      setOpponentJoined(false);
      toast('Waiting for opponent to join...', {
        icon: '⏳',
        duration: 3000,
      });
    };

    const handleJoinedRoom = (data) => {
      if (!data) {
        return;
      }

      if (data.mySocketId) {
        setMySocketId(data.mySocketId);
      }

      if (data.playerColor) {
        setPlayerColor(data.playerColor);
      }

      if (data.players) {
        const self = data.players.find((p) => p.socketId === (data.mySocketId || socket?.id));
        const opponent = data.players.find((p) => p.socketId !== (data.mySocketId || socket?.id));

        if (self) {
          setPlayer(self.username, 'self');
        }

        if (opponent) {
          setPlayer(opponent.username, 'opponent');
          setOpponentJoined(true);
        }
      }

      if (data.fen) {
        updateBoard(data.fen, data.playerColor);
      }
    };

    const handleGameStart = (data) => {
      const currentSocketId = mySocketId || socket?.id;
      const self = data.players.find((p) => p.socketId === currentSocketId);
      const opponent = data.players.find((p) => p.socketId !== currentSocketId);

      if (self) {
        setPlayer(self.username, 'self');
        if (self.color) {
          setPlayerColor(self.color);
        }
      }

      if (opponent) {
        setPlayer(opponent.username, 'opponent');
      }

      setOpponentJoined(Boolean(opponent));
      setGameStarted(true);

      if (data.initialFen) {
        updateBoard(data.initialFen, self?.color);
      }
    };

    const handleReceiveMove = (payload) => {
      if (!payload || !payload.fen) {
        return;
      }

      updateBoard(payload.fen);

      if (payload.isGameOver) {
        setGameOver(true);
      }

      if (payload.isCheckmate) {
        setWinner(payload.lastMoveBy || 'opponent');
      } else if (payload.isDraw) {
        setWinner('draw');
      }
    };

    const handleRoomUpdate = (data) => {
      if (!data || !Array.isArray(data.players)) return;

      const currentSocketId = mySocketId || socket?.id;
      const self = data.players.find((p) => p.socketId === currentSocketId);
      const opponent = data.players.find((p) => p.socketId !== currentSocketId);

      if (self) {
        setPlayer(self.username, 'self');
      }

      if (opponent) {
        setPlayer(opponent.username, 'opponent');
        setOpponentJoined(true);
      }
    };

    const handleOpponentDisconnected = () => {
      setOpponentJoined(false);
      setGameStarted(false);
      toast.error('Opponent disconnected. Waiting for them to reconnect...', {
        icon: '⚠️',
        duration: 5000,
      });
    };

    const handlePlayerResigned = (data) => {
      const didIWin = data.winner === playerColor;
      setGameOver(true);
      setWinner(data.winner);
      
      if (didIWin) {
        toast.success(`🏆 ${data.resignedPlayer} resigned. You Win!`, {
          duration: 6000,
        });
      } else {
        toast.error(`⛔ You resigned. ${data.winner?.toUpperCase()} Wins!`, {
          duration: 6000,
        });
      }
    };

    const handleError = (data) => {
      toast.error(data.message || 'An error occurred', {
        icon: '❌',
        duration: 4000,
      });
    };

    on('joined_room', handleJoinedRoom);
    on('player_joined', handlePlayerJoined);
    on('waiting_for_opponent', handleWaiting);
    on('game_start', handleGameStart);
    on('room_update', handleRoomUpdate);
    on('receive_move', handleReceiveMove);
    on('opponent_disconnected', handleOpponentDisconnected);
    on('player_resigned', handlePlayerResigned);
    on('error', handleError);

    return () => {
      off('joined_room');
      off('player_joined');
      off('waiting_for_opponent');
      off('game_start');
      off('room_update');
      off('receive_move');
      off('opponent_disconnected');
      off('player_resigned');
      off('error');
    };
  }, [connected, routeRoomId, username, on, off, setOpponentJoined, updateBoard, setGameOver, setWinner, setPlayer, setPlayerColor, board, mySocketId, socket?.id]);

  const copyRoomId = () => {
    navigator.clipboard.writeText(routeRoomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeaveGame = () => {
    emit('leave_room', { roomId: routeRoomId });
    navigate('/');
  };

  const handleOpponentMessage = useCallback((shouldNotify) => {
    if (shouldNotify) {
      setHasUnreadMessage(true);
    }
  }, []);

  useEffect(() => {
    if (connected && routeRoomId && !hasJoinedRef.current) {
      rejoinRoom(emit);
      hasJoinedRef.current = true;
    }
  }, [connected, routeRoomId, rejoinRoom, emit]);

  useEffect(() => {
    const handleReconnect = () => {
      if (routeRoomId) {
        hasJoinedRef.current = false;
        emit('join_room', {
          roomId: routeRoomId,
          username,
        });
        hasJoinedRef.current = true;
      }
    };

    on('reconnect', handleReconnect);

    return () => {
      off('reconnect', handleReconnect);
    };
  }, [on, off, emit, routeRoomId, username, playerColor]);

  if (!connected || !routeRoomId) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-900 font-bold text-lg">Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white overflow-y-auto">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pb-2 mb-2 sm:mb-3 md:mb-4">
          {gameOver ? (
            <div className={`flex items-center justify-center gap-2 p-3 sm:p-4 rounded-lg border-2 text-center font-bold text-sm sm:text-base shadow-sm ${
              winner === 'draw'
                ? 'bg-yellow-50 border-yellow-300 text-yellow-900'
                : playerColor === winner
                ? 'bg-green-50 border-green-300 text-green-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}>
              <span className="text-lg">🏁</span>
              <span>
                {winner === 'draw' 
                  ? '🤝 Draw!' 
                  : playerColor === winner
                  ? '🏆 You Won!'
                  : '⛔ You Lost!'}
              </span>
            </div>
          ) : gameStarted ? (
            <div className="flex items-center justify-center gap-2 p-2 sm:p-3 rounded-lg bg-blue-100 border border-blue-300 text-center font-bold text-sm sm:text-base text-blue-900 shadow-sm">
              
              <span>{isYourTurn ? '🎯 Your Turn' : '⏳ Opponent\'s Turn'}</span>
              {hasUnreadMessage && (
                <span className="text-lg animate-bounce">💬</span>
              )}
            </div>
          ) : (
            <div className="p-2 sm:p-3 rounded-lg border-2 border-blue-300 bg-blue-50 text-blue-800 font-bold text-center text-sm sm:text-base">
              ⏳ Waiting for opponent to join...
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
          <div className="flex-1">
            <ChessBoard />
          </div>
          <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 w-full lg:w-80">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-600 text-xs sm:text-sm font-medium">Room Code</p>
                  <p className="text-gray-900 font-mono font-bold text-sm sm:text-base truncate mt-1">{routeRoomId}</p>
                </div>
                <button
                  onClick={copyRoomId}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-xs sm:text-sm shadow-md transition-all shrink-0"
                  title="Copy room code"
                >
                  {copied ? '✓' : '📋'}
                </button>
              </div>
            </div>

            <GameInfo />

            <button
              onClick={() => {
                setChatOpen(!chatOpen);
                if (!chatOpen) {
                  setHasUnreadMessage(false);
                }
              }}
              className="relative w-full px-3 py-2 sm:px-4 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{chatOpen ? '✕ Close Chat' : '💬 Open Chat'}</span>
              {hasUnreadMessage && !chatOpen && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                  💬
                </span>
              )}
            </button>
          </div>
        </div>

        {chatOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md h-96 shadow-2xl flex flex-col overflow-hidden rounded-2xl">
              <div className="bg-blue-500 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">💬</div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Chat</h2>
                    <p className="text-blue-100 text-xs">Real-time messages</p>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-white hover:bg-blue-700 p-2 rounded-full transition-colors"
                  title="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <Chat 
                chatOpen={chatOpen}
                onOpponentMessage={handleOpponentMessage}
              />
            </div>
          </div>
        )}

        {!chatOpen && (
          <div className="hidden">
            <Chat 
              chatOpen={chatOpen}
              onOpponentMessage={handleOpponentMessage}
            />
          </div>
        )}

        <div className="border-t border-gray-200 pt-3 sm:pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">
                Room: <span className="font-mono font-bold text-gray-900">{routeRoomId}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <Button
              variant="danger"
              onClick={() => {
                const opponentColor = playerColor === 'white' ? 'black' : 'white';
                emit('resign', { roomId: routeRoomId });
                setGameOver(true);
                setWinner(opponentColor);
                toast.error('You resigned. Opponent Wins!', { duration: 3000 });
              }}
              className="text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3"
            >
              Resign
            </Button>
            <Button variant="destructive" onClick={handleLeaveGame} className="text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3">
              Leave Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
