import { setupSocketHandlers } from './sockets/index.js';

export const initializeSockets = (io) => {
  setupSocketHandlers(io);
};
