const API_BASE = import.meta.env.VITE_API_URL ;

export const fetchJSON = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || 'API request failed');
    err.status = res.status;
    err.response = data;
    throw err;
  }
  return data;
};
