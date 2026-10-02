import { useEffect, useState } from 'react';
import Login from './pages/Login.jsx';
import Lobby from './pages/Lobby.jsx';
import { me, logout } from './api.js';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    me()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="screen center"><p className="muted">Chargement…</p></div>;
  }

  if (!user) return <Login onLogin={setUser} />;

  return <Lobby user={user} onLogout={async () => { await logout(); setUser(null); }} />;
}
