import GameCanvas from '../game/GameCanvas.jsx';

export default function Game({ user, onExit }) {
  return <GameCanvas user={user} onExit={onExit} />;
}
