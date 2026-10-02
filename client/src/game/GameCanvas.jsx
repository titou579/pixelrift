import { useEffect, useRef, useState } from 'react';
import { createEngine } from './engine.js';
import { buildWorld } from './world.js';
import { createPlayer } from './player.js';
import { createWeapon, createTargets } from './weapon.js';
import { createRift } from './rift.js';
import '../styles/game.css';

export default function GameCanvas({ onExit }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [locked, setLocked] = useState(false);
  const [riftReady, setRiftReady] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const { renderer, scene, camera } = createEngine(canvas);
    const { colliders } = buildWorld(scene);
    const player = createPlayer(camera, canvas, colliders);
    const weapon = createWeapon(scene, camera);
    const targets = createTargets(scene);
    const rift = createRift(scene, camera, player);

    weapon.onHit((s) => setScore(s));

    const onMouseDown = (e) => {
      if (document.pointerLockElement !== canvas) return;
      if (e.button === 0) weapon.shoot(targets);
    };
    document.addEventListener('mousedown', onMouseDown);

    const onKeyDown = (e) => {
      if (e.code === 'KeyE') {
        const ok = rift.use();
        if (ok) {
          setRiftReady(false);
          setTimeout(() => setRiftReady(true), 4000);
        }
      }
      if (e.code === 'Escape') {
        document.exitPointerLock();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    const onLockChange = () =>
      setLocked(document.pointerLockElement === canvas);
    document.addEventListener('pointerlockchange', onLockChange);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    let raf;
    let last = performance.now();
    function loop() {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      player.update(dt);
      rift.update(dt);

      for (const t of targets) {
        t.rotation.y += t.userData.spinSpeed * dt;
        t.rotation.x += t.userData.spinSpeed * dt * 0.7;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerlockchange', onLockChange);
      window.removeEventListener('resize', onResize);
      player.dispose();
      document.exitPointerLock();
      renderer.dispose();
    };
  }, []);

  const enterGame = () => {
    canvasRef.current?.requestPointerLock();
  };

  return (
    <div className="game-container">
      <canvas ref={canvasRef} className="game-canvas" />

      <div className="hud">
        <div className="hud-top">
          <div className="hud-score">🎯 <strong>{score}</strong></div>
          <button className="hud-exit" onClick={onExit}>Quitter</button>
        </div>

        <div className="hud-crosshair">+</div>

        <div className="hud-bottom">
          <div className={`hud-rift ${riftReady ? 'ready' : 'cooldown'}`}>
            <span className="key">E</span> Rift {riftReady ? '✅' : '⏳'}
          </div>
          <div className="hud-hint">Clic : tirer · Échap : libérer souris</div>
        </div>
      </div>

      {!locked && (
        <div className="hud-overlay" onClick={enterGame}>
          <div className="hud-overlay-content">
            <h2>PIXEL<span>RIFT</span></h2>
            <p className="big">Clique pour jouer</p>
            <p className="small">
              <strong>ZQSD</strong> (ou WASD) : se déplacer<br />
              <strong>Souris</strong> : viser<br />
              <strong>Clic gauche</strong> : tirer<br />
              <strong>Espace</strong> : sauter<br />
              <strong>Shift</strong> : sprinter<br />
              <strong>E</strong> : Rift (téléportation)<br />
              <strong>Échap</strong> : libérer la souris
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
