export default function Lobby({ user, onLogout }) {
  return (
    <div className="screen center">
      <div className="card wide">
        <h1 className="logo">PIXEL<span>RIFT</span></h1>
        <p className="tagline">
          Salut <strong>{user.username}</strong>
          {user.role === 'admin' && <span className="badge">ADMIN</span>}
        </p>

        <div className="lobby-box">
          <p className="muted">🚧 Lobby en construction — Phase 1 arrive.</p>
          <p className="muted small">
            Ici : liste des joueurs connectés, bouton "Créer une partie",
            sélection de map, et lancement du match.
          </p>
        </div>

        <button className="secondary" onClick={onLogout}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
