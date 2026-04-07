import React from 'react';

const Message = ({ username, message, timestamp, isOwnMessage = false }) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-xs rounded-lg px-4 py-2 ${
        isOwnMessage
          ? 'bg-purple-600 text-white'
          : 'bg-slate-700/60 text-gray-200'
      }`}>
        {!isOwnMessage && (
          <p className="text-xs font-semibold text-cyan-400 mb-1">{username}</p>
        )}
        <p className="text-sm whitespace-normal">{message}</p>
        <p className={`text-xs mt-1 ${
          isOwnMessage ? 'text-purple-200' : 'text-gray-400'
        }`}>
          {timestamp}
        </p>
      </div>
    </div>
  );
};

export default Message;
