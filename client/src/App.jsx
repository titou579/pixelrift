import { useEffect, useState } from 'react';
import Login from './pages/Login.jsx';
import Lobby from './pages/Lobby.jsx';
import Game from './pages/Game.jsx';
import Profile from './pages/Profile.jsx';
import { me, logout } from './api.js';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('lobby');

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

  if (view === 'game') {
    return <Game user={user} onExit={() => setView('lobby')} />;
  }

  if (view === 'profile') {
    return <Profile user={user} onBack={() => setView('lobby')} />;
  }

  return (
    <Lobby
      user={user}
      onPlay={() => setView('game')}
      onProfile={() => setView('profile')}
      onLogout={async () => { await logout(); setUser(null); }}
    />
  );
}
