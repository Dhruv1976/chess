import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const Navbar = () => {
  const { username, updateUsername } = useUser();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const [error, setError] = useState('');

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
              {isEditingUsername ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    maxLength={20}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter username"
                    autoFocus
                  />
                  <button
                    onClick={handleUpdateUsername}
                    className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium text-sm">👤</span>
                  <span className="text-gray-900 font-medium">{username}</span>
                  <button
                    onClick={() => setIsEditingUsername(true)}
                    className="ml-2 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                    title="Edit username"
                  >
                    ✎
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && isEditingUsername && (
            <p className="text-red-500 text-xs mt-2">{error}</p>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
