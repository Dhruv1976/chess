import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useUser } from '../context/UserContext';
import { createRoom, joinRoom } from '../services/gameService';
import Button from '../components/ui/Button';

const Home = () => {
  const navigate = useNavigate();
  const { createGame, joinGame, setPlayer } = useGame();
  const { username } = useUser();
  const [joinRoomId, setJoinRoomId] = useState('');
  const [error, setError] = useState('');

  const handleCreateRoom = async () => {
    if (!username || !username.trim()) {
      setError('Please set a username before creating a room.');
      return;
    }
    try {
      const roomId = Math.random().toString(36).substring(2, 11).toUpperCase();
      await createRoom(roomId);
      createGame(roomId);
      setPlayer(username, 'self');

      navigate(`/game/${roomId}`);
    } catch (err) {
      setError('Unable to create room. Try again.');
    }
  };

  const handleJoinGame = async () => {
    if (!username || !username.trim()) {
      setError('Please set a username before joining a room.');
      return;
    }

    if (!joinRoomId.trim()) {
      setError('Please enter a room ID');
      return;
    }

    try {
      const roomIdCandidate = joinRoomId.toUpperCase();
      await joinRoom(roomIdCandidate);
      joinGame(roomIdCandidate);
      setPlayer(username, 'self');

      navigate(`/game/${roomIdCandidate}`);
      setError('');
    } catch (err) {
      setError('Unable to join room. Check that code is valid.');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md md:max-w-2xl">

        <div className="text-center mb-8 sm:mb-10">
          <div className="text-6xl sm:text-7xl mb-3 sm:mb-4">♟️</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Chess
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-700">
            Play online with friends
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">

          <div className="bg-white rounded-xl border-2 border-blue-200 shadow-md p-5 sm:p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">➕</span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Create</h2>
            </div>

            <p className="text-gray-600 text-xs sm:text-sm mb-4">
              Start a new game and share the room code with a friend.
            </p>

            <Button
              variant="primary"
              fullWidth
              onClick={handleCreateRoom}
              className="w-full py-2.5 sm:py-3 text-sm sm:text-base font-semibold"
            >
              Create New Game
            </Button>
          </div>

          <div className="bg-white rounded-xl border-2 border-green-200 shadow-md p-5 sm:p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🔗</span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Join</h2>
            </div>

            <p className="text-gray-600 text-xs sm:text-sm mb-4">
              Enter your friend's room code to join.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={joinRoomId}
                onChange={(e) =>
                  setJoinRoomId(e.target.value.toUpperCase().substring(0, 15))
                }
                onKeyDown={(e) => e.key === 'Enter' && handleJoinGame()}
                placeholder="Room code"
                maxLength={15}
                className="flex-1 min-w-0 px-3 py-2 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition text-sm sm:text-base"
              />

              <Button
                variant="success"
                onClick={handleJoinGame}
                className="px-4 sm:px-6 py-2.5 text-sm sm:text-base font-semibold whitespace-nowrap"
              >
                Join
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="w-full bg-red-50 border-l-4 border-red-500 rounded-lg p-4 sm:p-5 text-red-700 text-sm sm:text-base font-medium animate-pulse">
            {error}
          </div>
        )}

        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-xs sm:text-sm">
            Tip: Create a room to host, or join with a friend's room code
          </p>
        </div>

      </div>
    </div>
  );
};

export default Home;