import React from 'react';
import { useSocket } from '../../context/SocketContext';


const MessageBubble = ({ message, isOwnMessage }) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        {!isOwnMessage && (
          <span className="text-xs text-gray-600 font-medium ml-2 mb-1">
            {message.username}
          </span>
        )}
        <div
          className={`px-3 py-2 rounded-lg text-sm max-w-xs ${
            isOwnMessage
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-900'
          }`}
        >
          {message.message}
        </div>
        <span className="text-xs text-gray-500 mt-0.5 px-2">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
};


const MessageList = ({ messages, messagesEndRef }) => {
  const { socket } = useSocket();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-400 text-sm">No messages yet...</p>
        </div>
      ) : (
        <>
          {messages.map((msg, idx) => {
            const isOwnMessage = msg.socketId && socket?.id && msg.socketId === socket.id;
            return (
              <MessageBubble
                key={idx}
                message={msg}
                isOwnMessage={isOwnMessage}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessageList;
