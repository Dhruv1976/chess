import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useGame } from '../../context/GameContext';
import { useUser } from '../../context/UserContext';

const Chat = ({ chatOpen = false, onOpponentMessage = () => {} }) => {
  const { socket, connected } = useSocket();
  const { roomId } = useGame();
  const { username } = useUser();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatOpen]);

  useEffect(() => {
    if (!socket || !connected || !roomId) return;
    socket.emit('join_chat_room', { roomId });
  }, [socket, connected, roomId]);

  useEffect(() => {
    if (!socket) return;

    const handleChatHistory = (history) => {
      const formattedMessages = history.map((msg, idx) => ({
        id: `history-${idx}`,
        username: msg.username || 'Unknown',
        message: msg.message || '',
        socketId: msg.socketId,
        timestamp: new Date(msg.timestamp).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      }));
      setMessages(formattedMessages);
    };

    socket.on('chat_history', handleChatHistory);
    return () => socket.off('chat_history', handleChatHistory);
  }, [socket]);

 
  useEffect(() => {
    if (!socket || !connected) return;

    const handleReceiveMessage = (data) => {
      const isFromOpponent = data.socketId !== socket?.id;
      const shouldNotify = isFromOpponent && !chatOpen;

      
      onOpponentMessage?.(shouldNotify);

      const newMessage = {
        id: Math.random(),
        username: data.username || 'Unknown',
        message: data.message || '',
        socketId: data.socketId,
        timestamp: new Date(data.timestamp).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      };

      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on('receive_message', handleReceiveMessage);
    return () => socket.off('receive_message', handleReceiveMessage);
  }, [socket, connected, chatOpen, onOpponentMessage]);

 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(
    (e) => {
      e.preventDefault();

      if (!input.trim() || !roomId || !socket || !connected) return;

      socket.emit('send_message', {
        roomId,
        username,
        message: input.trim(),
      });

      setInput('');
    },
    [input, roomId, socket, connected, username]
  );



  return (
    <div className="flex flex-col h-full w-full bg-white rounded-xl overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400 text-center text-sm">
              💬 No messages yet
              <br />
              <span className="text-xs">Start chatting!</span>
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isOwn = msg.socketId === socket?.id;
              return (
                <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs${isOwn ? '' : ' flex flex-col'}`}>
                    {!isOwn && (
                      <p className="text-xs text-gray-600 font-semibold mb-1 px-2">
                        {msg.username}
                      </p>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 text-sm ${
                        isOwn
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                      }`}
                    >
                      {msg.message}
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right mr-2' : 'ml-2'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form
        onSubmit={handleSend}
        className="border-t border-gray-200 bg-white p-3 flex gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Say something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-full text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
          maxLength={200}
        />
        <button
          type="submit"
          disabled={!input.trim() || !connected}
          className="px-5 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-1"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;

