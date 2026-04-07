import { fetchJSON } from './api.js';

export const createRoom = async (roomId) => {
  const body = { roomId };
  const { data } = await fetchJSON('/games/create', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return data;
};

export const joinRoom = async (roomId) => {
  const { data } = await fetchJSON('/games/join', {
    method: 'POST',
    body: JSON.stringify({ roomId }),
  });
  return data;
};

export const getRoom = async (roomId) => {
  const { data } = await fetchJSON(`/games/${roomId}`);
  return data;
};
