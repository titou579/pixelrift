import { useEffect, useRef, useState } from 'react';
import { createEngine } from './engine.js';
import { buildWorld } from './world.js';
import { createPlayer } from './player.js';
import { createWeapon, createTargets } from './weapon.js';
import { createRift } from './rift.js';
import { createRemotePlayersManager } from './remotePlayers.js';
import { getSocket } from '../socket.js';
import '../styles/game.css';

export default function GameCanvas({ user, onExit }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [locked, setLocked] = useState(false);
  const [riftReady, setRiftReady] = useState(true);
  const [myHp, setMyHp] = useState(100);
  const [alive, setAlive] = useState(true);
  const [scores, setScores] = useState([]);
  const [killFeed, setKillFeed] = useState([]);
  const [matchStatus, setMatchStatus] = useState('waiting');
  const [matchEnd, setMatchEnd] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [respawnIn, setRespawnIn] = useState(0);
  const [rewards, setRewards] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const socket = getSocket();

    const { renderer, scene, camera } = createEngine(canvas);
    const { colliders } = buildWorld(scene);
    const player = createPlayer(camera, canvas, colliders);
    const weapon = createWeapon(scene, camera);
    const targets = createTargets(scene);
    const rift = createRift(scene, camera, player);
    const remotes = createRemotePlayersManager(scene);

    weapon.onHit((s) => setScore(s));

    // --- Socket listeners ---
    const onPlayerJoined = (p) => {
      if (p.username === user.username) return;
      remotes.add(p.id, p.username, p.position, p.rotation);
    };
    const onPlayerLeft = ({ id }) => remotes.remove(id);
    const onPlayerState = ({ id, position, rotation }) =>
      remotes.update(id, position, rotation);

    const onMatchEntered = ({ players }) => {
      for (const p of players) {
        if (p.id === socket.id) continue;
        remotes.add(p.id, p.username, p.position, p.rotation);
      }
    };

    const onScoresUpdate = (list) => setScores(list);

    const onMatchStarted = ({ duration, timeLeft: tl }) => {
      setMatchStatus('playing');
      setMatchEnd(null);
      setRewards(null);
      setTimeLeft(tl != null ? Math.floor(tl / 1000) : Math.floor(duration / 1000));
    };

    const onMatchEnded = ({ results }) => {
      setMatchStatus('ended');
      setMatchEnd(results);
    };

    const onMatchReset = () => {
      setMatchStatus('waiting');
      setMatchEnd(null);
      setRewards(null);
    };

    const onMatchRewards = (data) => {
      setRewards({ xpGain: data.xpGain, coinGain: data.coinGain });
    };

    const onPlayerHit = ({ targetId, hp }) => {
      if (targetId === socket.id) setMyHp(hp);
      else remotes.setHp(targetId, hp);
    };

    const onPlayerDied = ({ id, username, killerName }) => {
      setKillFeed((prev) => [
        ...prev.slice(-4),
        { id: Date.now() + Math.random(), text: `${killerName} 💀 ${username}` },
      ]);
      setTimeout(() => {
        setKillFeed((prev) => prev.slice(1));
      }, 5000);
      if (id === socket.id) {
        setAlive(false);
        setRespawnIn(3);
      } else {
        remotes.kill(id);
      }
    };

    const onPlayerRespawned = ({ id, position }) => {
      if (id === socket.id) {
        player.state.position.set(position.x, position.y, position.z);
        setAlive(true);
        setMyHp(100);
        setRespawnIn(0);
      } else {
        remotes.respawn(id, position);
      }
    };

    socket.on('player:joined', onPlayerJoined);
    socket.on('player:left', onPlayerLeft);
    socket.on('player:state', onPlayerState);
    socket.on('match:entered', onMatchEntered);
    socket.on('scores:update', onScoresUpdate);
    socket.on('match:started', onMatchStarted);
    socket.on('match:ended', onMatchEnded);
    socket.on('match:reset', onMatchReset);
    socket.on('match:rewards', onMatchRewards);
    socket.on('player:hit', onPlayerHit);
    socket.on('player:died', onPlayerDied);
    socket.on('player:respawned', onPlayerRespawned);

    // --- Maintenant que les listeners sont prêts, on entre en jeu ---
    socket.emit('match:enter');

    // --- Envoi de la position à 20 Hz ---
    const sendState = setInterval(() => {
      if (!player.state.position) return;
      socket.emit('player:state', {
        position: {
          x: player.state.position.x,
          y: player.state.position.y,
          z: player.state.position.z,
        },
        rotation: {
          yaw: player.state.yaw,
          pitch: player.state.pitch,
        },
      });
    }, 50);

    // --- Timer local ---
    const timerInt = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    // --- Respawn countdown ---
    const respawnInt = setInterval(() => {
      setRespawnIn((r) => {
        if (r <= 1) {
          if (r === 1) socket.emit('player:respawn');
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    // --- Contrôles ---
    const onMouseDown = (e) => {
      if (document.pointerLockElement !== canvas) return;
      if (e.button === 0) {
        weapon.shoot(targets);
        const hitId = remotes.raycast(camera);
        if (hitId) {
          socket.emit('player:shoot', { targetId: hitId });
        }
      }
    };
    document.addEventListener('mousedown', onMouseDown);

    const onKeyDown = (e) => {
      if (e.code === 'KeyE') {
        const ok = rift.use();
        if (ok) {
          socket.emit('player:rift');
          setRiftReady(false);
          setTimeout(() => setRiftReady(true), 4000);
        }
      }
      if (e.code === 'Escape') {
        document.exitPointerLock();
      }
      if (e.code === 'Tab') {
        e.preventDefault();
        setShowScoreboard(true);
      }
    };
    const onKeyUp = (e) => {
      if (e.code === 'Tab') {
        e.preventDefault();
        setShowScoreboard(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    const onLockChange = () =>
      setLocked(document.pointerLockElement === canvas);
    document.addEventListener('pointerlockchange', onLockChange);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // --- Boucle ---
    let raf;
    let last = performance.now();
    function loop() {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      player.update(dt);
      rift.update(dt);
      remotes.tick(dt);
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
      clearInterval(sendState);
      clearInterval(timerInt);
      clearInterval(respawnInt);
      socket.emit('match:leave');
      socket.off('player:joined', onPlayerJoined);
      socket.off('player:left', onPlayerLeft);
      socket.off('player:state', onPlayerState);
      socket.off('match:entered', onMatchEntered);
      socket.off('scores:update', onScoresUpdate);
      socket.off('match:started', onMatchStarted);
      socket.off('match:ended', onMatchEnded);
      socket.off('match:reset', onMatchReset);
      socket.off('match:rewards', onMatchRewards);
      socket.off('player:hit', onPlayerHit);
      socket.off('player:died', onPlayerDied);
      socket.off('player:respawned', onPlayerRespawned);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('pointerlockchange', onLockChange);
      window.removeEventListener('resize', onResize);
      remotes.clear();
      player.dispose();
      document.exitPointerLock();
      renderer.dispose();
    };
  }, [user.username]);

  const enterGame = () => canvasRef.current?.requestPointerLock();

  const min = Math.floor(timeLeft / 60);
  const sec = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="game-container">
      <canvas ref={canvasRef} className="game-canvas" />

      <div className="hud">
        <div className="hud-top">
          <div className="hud-left">
            <div className="hud-hp-bar">
              <div
                className="hud-hp-fill"
                style={{
                  width: `${myHp}%`,
                  background: myHp > 50 ? '#00eaff' : myHp > 25 ? '#ffd93d' : '#ff2fb9',
                }}
              />
              <span className="hud-hp-text">{myHp} PV</span>
            </div>
            <div className="hud-score">🎯 <strong>{score}</strong></div>
          </div>

          <div className="hud-timer">{min}:{sec}</div>

          <button className="hud-exit" onClick={onExit}>Quitter</button>
        </div>

        <div className="hud-killfeed">
          {killFeed.map((k) => (
            <div key={k.id} className="kill-line">{k.text}</div>
          ))}
        </div>

        <div className="hud-crosshair">+</div>

        <div className="hud-bottom">
          <div className={`hud-rift ${riftReady ? 'ready' : 'cooldown'}`}>
            <span className="key">E</span> Rift {riftReady ? '✅' : '⏳'}
          </div>
          <div className="hud-hint">Tab : scores · Clic : tirer · Échap : libérer souris</div>
        </div>
      </div>

      {showScoreboard && (
        <div className="scoreboard-overlay">
          <div className="scoreboard">
            <h3>Classement</h3>
            <table>
              <thead>
                <tr><th>#</th><th>Joueur</th><th>Kills</th><th>Morts</th></tr>
              </thead>
              <tbody>
                {[...scores].sort((a, b) => b.kills - a.kills).map((p, i) => (
                  <tr key={p.id} className={p.username === user.username ? 'me' : ''}>
                    <td>{i + 1}</td>
                    <td>{p.username}</td>
                    <td>{p.kills}</td>
                    <td>{p.deaths}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!alive && matchStatus === 'playing' && (
        <div className="death-overlay">
          <div className="death-content">
            <h2>💀 Éliminé</h2>
            <p>Respawn dans <strong>{respawnIn}</strong>s</p>
          </div>
        </div>
      )}

      {matchEnd && (
        <div className="match-end-overlay">
          <div className="match-end-content">
            <h2>🏆 Match terminé</h2>
            <table>
              <thead>
                <tr><th>#</th><th>Joueur</th><th>Kills</th><th>Morts</th></tr>
              </thead>
              <tbody>
                {matchEnd.map((p, i) => (
                  <tr key={p.id} className={i === 0 ? 'winner' : ''}>
                    <td>{i + 1}</td>
                    <td>{p.username}</td>
                    <td>{p.kills}</td>
                    <td>{p.deaths}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rewards && (
              <p className="match-rewards">
                🎁 +{rewards.xpGain} XP · +{rewards.coinGain} 💰
              </p>
            )}
            <p className="muted">Nouveau match dans quelques secondes…</p>
          </div>
        </div>
      )}

      {!locked && !matchEnd && alive && (
        <div className="hud-overlay" onClick={enterGame}>
          <div className="hud-overlay-content">
            <h2>PIXEL<span>RIFT</span></h2>
            <p className="big">Clique pour jouer</p>
            <p className="small">
              <strong>ZQSD</strong> : bouger · <strong>Clic</strong> : tirer<br />
              <strong>Espace</strong> : sauter · <strong>Shift</strong> : courir<br />
              <strong>E</strong> : Rift · <strong>Tab</strong> : scores<br />
              <strong>Échap</strong> : libérer la souris
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
