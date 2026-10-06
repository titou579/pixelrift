import { useEffect, useRef, useState } from 'react';
import { createEngine } from './engine.js';
import { buildMapFromModels } from './mapBuilder.js';
import { createPlayer } from './player.js';
import { createWeapon, createTargets } from './weapon.js';
import { createRift } from './rift.js';
import { createRemotePlayersManager } from './remotePlayers.js';
import { getSocket } from '../socket.js';
import '../styles/game.css';

export default function GameCanvas({ user, roomCode, onExit }) {
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
  const [mapLoading, setMapLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState('Initialisation…');

  useEffect(() => {
    const canvas = canvasRef.current;
    const socket = getSocket();
    let cancelled = false;

    // Refs mutables pour accéder aux objets depuis les handlers
    const game = {
      renderer: null,
      scene: null,
      camera: null,
      player: null,
      weapon: null,
      targets: null,
      rift: null,
      remotes: null,
      raf: null,
      sendState: null,
      timerInt: null,
      respawnInt: null,
      handlers: {},
    };

    // --- Initialisation moteur 3D ---
    const { renderer, scene, camera } = createEngine(canvas);
    game.renderer = renderer;
    game.scene = scene;
    game.camera = camera;

    // --- Socket listeners (définis AVANT le chargement de la map,
    //     car ils n'ont pas besoin de la map pour être enregistrés) ---
    const onPlayerJoined = (p) => {
      if (!game.remotes) return;
      if (p.username === user.username) return;
      game.remotes.add(p.id, p.username, p.position, p.rotation);
    };
    const onPlayerLeft = ({ id }) => game.remotes?.remove(id);
    const onPlayerState = ({ id, position, rotation }) =>
      game.remotes?.update(id, position, rotation);

    const onMatchEntered = ({ players }) => {
      if (!game.remotes) return;
      game.remotes.clear();
      for (const p of players) {
        if (p.id === socket.id) continue;
        game.remotes.add(p.id, p.username, p.position, p.rotation);
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
      else game.remotes?.setHp(targetId, hp);
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
        game.remotes?.kill(id);
      }
    };
    const onPlayerRespawned = ({ id, position }) => {
      if (id === socket.id) {
        if (game.player) {
          game.player.state.position.set(position.x, position.y, position.z);
        }
        setAlive(true);
        setMyHp(100);
        setRespawnIn(0);
      } else {
        game.remotes?.respawn(id, position);
      }
    };

    const rejoinRoom = () => {
      if (!roomCode) return;
      console.log('🔄 Réintégration du salon', roomCode);
      socket.emit('room:join', { code: roomCode, username: user.username }, (res) => {
        if (res?.error) {
          console.warn('Reconnexion échouée:', res.error);
          return;
        }
        socket.emit('match:enter');
      });
    };

    const onConnect = () => {
      console.log('✅ Socket connecté, réintégration...');
      rejoinRoom();
    };
    const onDisconnect = (reason) => {
      console.warn('⚠️ Socket déconnecté:', reason);
    };

    // Enregistrement des listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
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

    // Stocke les handlers pour le cleanup
    game.handlers = {
      onConnect, onDisconnect,
      onPlayerJoined, onPlayerLeft, onPlayerState, onMatchEntered,
      onScoresUpdate, onMatchStarted, onMatchEnded, onMatchReset, onMatchRewards,
      onPlayerHit, onPlayerDied, onPlayerRespawned,
    };

    // --- Chargement de la map en async ---
    (async () => {
      try {
        setLoadProgress('Chargement de la ville…');
        const { colliders } = await buildMapFromModels(scene);

        if (cancelled) return;

        setLoadProgress('Création du joueur…');
        game.player = createPlayer(camera, canvas, colliders);
        game.weapon = createWeapon(scene, camera);
        game.targets = createTargets(scene);
        game.rift = createRift(scene, camera, game.player);
        game.remotes = createRemotePlayersManager(scene);

        game.weapon.onHit((s) => setScore(s));

        // --- Contrôles ---
        const onMouseDown = (e) => {
          if (document.pointerLockElement !== canvas) return;
          if (e.button === 0 && game.player && game.weapon && game.targets) {
            game.weapon.shoot(game.targets);
            const hitId = game.remotes?.raycast(camera);
            if (hitId && socket.connected) {
              socket.emit('player:shoot', { targetId: hitId });
            }
          }
        };
        document.addEventListener('mousedown', onMouseDown);
        game.handlers.onMouseDown = onMouseDown;

        const onKeyDown = (e) => {
          if (e.code === 'KeyE' && game.rift) {
            const ok = game.rift.use();
            if (ok) {
              if (socket.connected) socket.emit('player:rift');
              setRiftReady(false);
              setTimeout(() => setRiftReady(true), 4000);
            }
          }
          if (e.code === 'Escape') document.exitPointerLock();
          if (e.code === 'Tab') { e.preventDefault(); setShowScoreboard(true); }
        };
        const onKeyUp = (e) => {
          if (e.code === 'Tab') { e.preventDefault(); setShowScoreboard(false); }
        };
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        game.handlers.onKeyDown = onKeyDown;
        game.handlers.onKeyUp = onKeyUp;

        const onLockChange = () => setLocked(document.pointerLockElement === canvas);
        document.addEventListener('pointerlockchange', onLockChange);
        game.handlers.onLockChange = onLockChange;

        const onResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onResize);
        game.handlers.onResize = onResize;

        // --- Entrée dans le match (après que tout soit prêt) ---
        if (socket.connected) {
          rejoinRoom();
        }

        // --- Envoi de la position à 20 Hz ---
        game.sendState = setInterval(() => {
          if (!game.player || !game.player.state.position || !socket.connected) return;
          socket.emit('player:state', {
            position: {
              x: game.player.state.position.x,
              y: game.player.state.position.y,
              z: game.player.state.position.z,
            },
            rotation: {
              yaw: game.player.state.yaw,
              pitch: game.player.state.pitch,
            },
          });
        }, 50);

        // --- Timer local ---
        game.timerInt = setInterval(() => {
          setTimeLeft((t) => (t > 0 ? t - 1 : 0));
        }, 1000);

        // --- Respawn countdown ---
        game.respawnInt = setInterval(() => {
          setRespawnIn((r) => {
            if (r <= 1) {
              if (r === 1 && socket.connected) socket.emit('player:respawn');
              return 0;
            }
            return r - 1;
          });
        }, 1000);

        // --- Boucle principale ---
        let last = performance.now();
        function loop() {
          if (cancelled) return;
          const now = performance.now();
          const dt = Math.min((now - last) / 1000, 0.05);
          last = now;

          if (game.player) game.player.update(dt);
          if (game.rift) game.rift.update(dt);
          if (game.remotes) game.remotes.tick(dt);
          if (game.targets) {
            for (const t of game.targets) {
              t.rotation.y += t.userData.spinSpeed * dt;
              t.rotation.x += t.userData.spinSpeed * dt * 0.7;
            }
          }

          renderer.render(scene, camera);
          game.raf = requestAnimationFrame(loop);
        }
        loop();

        setMapLoading(false);
        console.log('🎮 Map prête');
      } catch (e) {
        console.error('❌ Erreur chargement map:', e);
        setLoadProgress('Erreur de chargement. Recharge la page.');
      }
    })();

    // --- Cleanup ---
    return () => {
      cancelled = true;
      cancelAnimationFrame(game.raf);
      clearInterval(game.sendState);
      clearInterval(game.timerInt);
      clearInterval(game.respawnInt);

      socket.emit('match:leave');
      socket.off('connect', game.handlers.onConnect);
      socket.off('disconnect', game.handlers.onDisconnect);
      socket.off('player:joined', game.handlers.onPlayerJoined);
      socket.off('player:left', game.handlers.onPlayerLeft);
      socket.off('player:state', game.handlers.onPlayerState);
      socket.off('match:entered', game.handlers.onMatchEntered);
      socket.off('scores:update', game.handlers.onScoresUpdate);
      socket.off('match:started', game.handlers.onMatchStarted);
      socket.off('match:ended', game.handlers.onMatchEnded);
      socket.off('match:reset', game.handlers.onMatchReset);
      socket.off('match:rewards', game.handlers.onMatchRewards);
      socket.off('player:hit', game.handlers.onPlayerHit);
      socket.off('player:died', game.handlers.onPlayerDied);
      socket.off('player:respawned', game.handlers.onPlayerRespawned);

      if (game.handlers.onMouseDown) document.removeEventListener('mousedown', game.handlers.onMouseDown);
      if (game.handlers.onKeyDown) document.removeEventListener('keydown', game.handlers.onKeyDown);
      if (game.handlers.onKeyUp) document.removeEventListener('keyup', game.handlers.onKeyUp);
      if (game.handlers.onLockChange) document.removeEventListener('pointerlockchange', game.handlers.onLockChange);
      if (game.handlers.onResize) window.removeEventListener('resize', game.handlers.onResize);

      game.remotes?.clear();
      game.player?.dispose();
      document.exitPointerLock();
      renderer.dispose();
    };
  }, [user.username, roomCode]);

  const enterGame = () => canvasRef.current?.requestPointerLock();

  const min = Math.floor(timeLeft / 60);
  const sec = String(timeLeft % 60).padStart(2, '0');

  // --- Écran de chargement ---
  if (mapLoading) {
    return (
      <div className="game-container">
        <canvas ref={canvasRef} className="game-canvas" />
        <div className="map-loading-overlay">
          <div className="map-loading-content">
            <h2>PIXEL<span>RIFT</span></h2>
            <div className="loader-bar">
              <div className="loader-fill" />
            </div>
            <p>{loadProgress}</p>
          </div>
        </div>
      </div>
    );
  }

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
