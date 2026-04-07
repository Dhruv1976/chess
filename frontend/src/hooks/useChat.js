import { useState, useRef, useEffect, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { useGame } from '../context/GameContext';
import { useUser } from '../context/UserContext';

export const useChat = (onNewMessage = () => {}) => {
  const { socket, emit, on, off } = useSocket();
  const { roomId } = useGame();
  const { username } = useUser();
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleMessage = (data) => {
      const formattedMessage = {
        username: data.username || 'Unknown',
        message: data.message || '',
        socketId: data.socketId,
        timestamp: new Date(data.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      
      const isOwnMessage = data.socketId && socket && data.socketId === socket.id;
      
      setMessages((prev) => [...prev, formattedMessage]);
      
      if (!isFocused && !isOwnMessage) {
        setUnreadCount((count) => count + 1);
      }
    };

    if (socket) {
      socket.on('receive_message', handleMessage);
    }

    return () => {
      if (socket) {
        socket.off('receive_message', handleMessage);
      }
    };
  }, [socket, isFocused]);

  useEffect(() => {
    onNewMessage?.(unreadCount);
  }, [unreadCount, onNewMessage]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setUnreadCount(0);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);


  const handleSend = useCallback((e) => {
    e.preventDefault();
    
    if (!input.trim() || !roomId || !socket) return;

    emit('send_message', {
      roomId,
      username,
      message: input.trim(),
    });

    setInput('');
  }, [input, roomId, socket, username, emit]);

  return {
    messages,
    input,
    setInput,
    unreadCount,
    messagesEndRef,
    inputRef,
    handleSend,
    handleFocus,
    handleBlur,
  };
};
