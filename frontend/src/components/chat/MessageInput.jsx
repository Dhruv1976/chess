import React from 'react';

const MessageInput = ({
  input,
  setInput,
  onSend,
  inputRef,
  onFocus,
  onBlur,
}) => {
  return (
    <div className="border-t border-gray-200 bg-white p-3">
      <form onSubmit={onSend} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          maxLength={200}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
