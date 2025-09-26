// central API helper (very small)
const API_BASE = process.env.REACT_APP_API_BASE || 'https://car-rental-backend-1-e7w9.onrender.com/api';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: 'Bearer ' + token } : {};
}

export async function apiFetch(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (authHeaders().Authorization) headers.Authorization = authHeaders().Authorization;
  const res = await fetch(API_BASE + path, { ...opts, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API Error');
  return data;
}

export default { apiFetch };
