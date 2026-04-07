import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UserContext = createContext();

const generateGuestUsername = () => {
  const randomNum = Math.floor(Math.random() * 10000);
  return `guest_${randomNum}`;
};

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(() => {
    const saved = sessionStorage.getItem('chessUsername');
    return saved || generateGuestUsername();
  });

  useEffect(() => {
    sessionStorage.setItem('chessUsername', username);
  }, [username]);

  const updateUsername = useCallback((newUsername) => {
    if (newUsername.trim().length > 0 && newUsername.length <= 20) {
      setUsername(newUsername.trim());
      return true;
    }
    return false;
  }, []);

  const resetUsername = useCallback(() => {
    const newUsername = generateGuestUsername();
    setUsername(newUsername);
    return newUsername;
  }, []);

  const value = {
    username,
    updateUsername,
    resetUsername,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
