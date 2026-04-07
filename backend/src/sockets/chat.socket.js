const chatHistory = {};

const initializeChatRoom = (roomId) => {
  if (!chatHistory[roomId]) {
    chatHistory[roomId] = [];
  }
};

const addMessageToHistory = (roomId, message) => {
  if (!chatHistory[roomId]) {
    initializeChatRoom(roomId);
  }
  chatHistory[roomId].push(message);

  if (chatHistory[roomId].length > 100) {
    chatHistory[roomId].shift();
  }
};

const getChatHistory = (roomId) => {
  return chatHistory[roomId] || [];
};

export const setupChatSocket = (socket, io) => {
  socket.on('join_chat_room', ({ roomId }) => {
    if (!roomId) return;

    initializeChatRoom(roomId);
    const history = getChatHistory(roomId);

    socket.emit('chat_history', history);
  });

  socket.on('send_message', ({ roomId, username, message }) => {
    if (!roomId || !username || !message) {
      return;
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage || trimmedMessage.length > 500) {
      return;
    }

    initializeChatRoom(roomId);

    const messageData = {
      socketId: socket.id,
      username,
      message: trimmedMessage,
      timestamp: new Date().toISOString(),
    };

    addMessageToHistory(roomId, messageData);

    io.in(roomId).emit('receive_message', messageData);
  });
};
