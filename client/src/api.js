const API_URL = import.meta.env.VITE_API_URL || '';

export async function api(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);
  return data;
}

export const login = (username, password) =>
  api('/api/login', { method: 'POST', body: JSON.stringify({ username, password }) });
export const logout = () => api('/api/logout', { method: 'POST' });
export const me = () => api('/api/me');

export const getProfile = () => api('/api/profile');
export const getShop = () => api('/api/shop');
export const buyItem = (itemId) =>
  api('/api/shop/buy', { method: 'POST', body: JSON.stringify({ itemId }) });
export const equipSkin = (itemId) =>
  api('/api/shop/equip', { method: 'POST', body: JSON.stringify({ itemId }) });

export const claimQuest = (questId) =>
  api('/api/quests/claim', { method: 'POST', body: JSON.stringify({ questId }) });

export const getPass = () => api('/api/pass');
export const claimPassTier = (tier) =>
  api('/api/pass/claim', { method: 'POST', body: JSON.stringify({ tier }) });
