import GameCanvas from '../game/GameCanvas.jsx';

export default function Game({ onExit }) {
  return <GameCanvas onExit={onExit} />;
}
