import { useEffect, useState } from 'react';
import { getSocket } from '../socket.js';

export default function Lobby({ user, onPlay, onLogout, onProfile }) {
  const [roomCode, setRoomCode] = useState(null);
  const [players, setPlayers] = useState([]);
  const [joinCode, setJoinCode] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [error, setError] = useState('');
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    socket.on('player:joined', (p) => setPlayers((prev) => [...prev, p]));
    socket.on('player:left', ({ id }) => setPlayers((prev) => prev.filter((p) => p.id !== id)));
    socket.on('chat:message', (msg) => setMessages((prev) => [...prev, msg]));
    return () => {
      socket.off('player:joined');
      socket.off('player:left');
      socket.off('chat:message');
    };
  }, []);

  function createRoom() {
    setError(''); setConnecting(true);
    getSocket().emit('room:create', { username: user.username }, (res) => {
      setConnecting(false);
      if (res.error) return setError(res.error);
      setRoomCode(res.code); setPlayers(res.players);
    });
  }

  function joinRoom() {
    if (!joinCode.trim()) return;
    setError(''); setConnecting(true);
    getSocket().emit('room:join',
      { code: joinCode.trim().toUpperCase(), username: user.username },
      (res) => {
        setConnecting(false);
        if (res.error) return setError(res.error);
        setRoomCode(res.code); setPlayers(res.players); setJoinCode('');
      }
    );
  }

  function leaveRoom() {
    getSocket().emit('room:leave');
    setRoomCode(null); setPlayers([]); setMessages([]);
  }

  function sendMessage(e) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    getSocket().emit('chat:message', { text: chatInput.trim() });
    setChatInput('');
  }

  if (!roomCode) {
    return (
      <div className="screen center">
        <div className="card wide">
          <h1 className="logo">PIXEL<span>RIFT</span></h1>
          <p className="tagline">
            Salut <strong>{user.username}</strong>
            {user.role === 'admin' && <span className="badge">ADMIN</span>}
          </p>

          <button className="play-button" onClick={createRoom} disabled={connecting}>
            🎮 Créer un salon
          </button>

          <div className="join-row">
            <input
              type="text" placeholder="CODE" value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={4} className="code-input"
            />
            <button onClick={joinRoom} disabled={connecting || joinCode.length < 4}>
              Rejoindre
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          <button className="secondary" onClick={onProfile}>
            👤 Mon profil & progression
          </button>

          <button className="secondary" onClick={onLogout}>
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen center">
      <div className="card wide">
        <h1 className="logo">PIXEL<span>RIFT</span></h1>

        <div className="room-header">
          <div>
            <p className="muted small">Code du salon</p>
            <p className="room-code">{roomCode}</p>
          </div>
          <button className="secondary small-btn" onClick={leaveRoom}>Quitter</button>
        </div>

        <div className="players-list">
          <p className="muted small">Joueurs connectés ({players.length})</p>
          {players.map((p) => (
            <div key={p.id} className="player-row">
              <span className="status-dot" />
              <span>{p.username}</span>
              {p.username === user.username && <span className="you">(toi)</span>}
            </div>
          ))}
        </div>

        <div className="chat-box">
          <div className="chat-messages">
            {messages.length === 0 && <p className="muted small">Aucun message…</p>}
            {messages.map((m, i) => (
              <div key={i} className="chat-line">
                <span className="chat-user">{m.username}</span>
                <span className="chat-text">{m.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="chat-form">
            <input
              type="text" placeholder="Écris un message…"
              value={chatInput} onChange={(e) => setChatInput(e.target.value)}
              maxLength={200}
            />
            <button type="submit">↑</button>
          </form>
        </div>

        <button className="play-button" onClick={() => onPlay(roomCode)}>
          ▶ Lancer la partie
        </button>
      </div>
    </div>
  );
}
