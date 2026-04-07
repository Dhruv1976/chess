import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const Navbar = () => {
  const { username, updateUsername } = useUser();
  const location = useLocation();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const [error, setError] = useState('');

  const isInGameRoom = location.pathname.startsWith('/game/');

  const handleUpdateUsername = () => {
    if (updateUsername(tempUsername)) {
      setIsEditingUsername(false);
      setError('');
    } else {
      setError('Username must be 1-20 characters');
    }
  };

  const handleCancel = () => {
    setTempUsername(username);
    setIsEditingUsername(false);
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUpdateUsername();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 h-16 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-3xl">♟</span>
              <span className="text-xl font-bold text-gray-900">Chess</span>
            </Link>

            <div className="flex items-center gap-3">
              {isInGameRoom ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium text-sm">👤</span>
                  <span className="text-gray-900 font-medium">{username}</span>
                </div>
              ) : isEditingUsername ? (
                <div className="flex gap-1 items-center">
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    onKeyDown={handleKeyPress}
                    maxLength={20}
                    className=" w-full max-w-50 sm:max-w-xs ml-2 px-2 py-1 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white shadow-sm transition-all duration-200"
                    placeholder="Enter username"
                    autoFocus
                  />
                  <button
                    onClick={handleUpdateUsername}
                    className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
                  >
                    ✓
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium text-sm">👤</span>
                  <span className="text-gray-900 font-medium">{username}</span>
                  <button
                    onClick={() => setIsEditingUsername(true)}
                    className="ml-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    title="Edit username"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && isEditingUsername && (
            <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg shadow-sm">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
