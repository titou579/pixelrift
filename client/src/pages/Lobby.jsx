export default function Lobby({ user, onPlay, onLogout }) {
  return (
    <div className="screen center">
      <div className="card wide">
        <h1 className="logo">PIXEL<span>RIFT</span></h1>
        <p className="tagline">
          Salut <strong>{user.username}</strong>
          {user.role === 'admin' && <span className="badge">ADMIN</span>}
        </p>

        <button onClick={onPlay} className="play-button">
          ▶ Lancer une partie
        </button>

        <div className="lobby-box">
          <p className="muted">🚧 Phase 2 arrive : multijoueur temps réel.</p>
          <p className="muted small">
            Pour l'instant, entraîne-toi sur les cibles et maîtrise le Rift.
          </p>
        </div>

        <button className="secondary" onClick={onLogout}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
