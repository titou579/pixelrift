import {
  applyMatchRewards,
  registerRiftUse,
  getOrCreateProfile,
} from './dataManager.js';

const rooms = new Map();
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const MATCH_DURATION = 5 * 60 * 1000;
const KILL_TARGET = 15;
const END_SCREEN_DURATION = 10000;

function generateCode() {
  let code;
  do {
    code = '';
    for (let i = 0; i < 4; i++) {
      code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }
  } while (rooms.has(code));
  return code;
}

function createRoom() {
  return {
    players: new Map(),
    scores: new Map(),
    deaths: new Map(),
    matchStatus: 'waiting',
    matchStartTime: 0,
  };
}

export function setupGameServer(io) {
  function broadcastScores(code) {
    const room = rooms.get(code);
    if (!room) return;
    const list = Array.from(room.players.values()).map((p) => ({
      id: p.id,
      username: p.username,
      kills: room.scores.get(p.id) || 0,
      deaths: room.deaths.get(p.id) || 0,
    }));
    io.to(code).emit('scores:update', list);
  }

  function startMatch(code) {
    const room = rooms.get(code);
    if (!room) return;
    room.matchStatus = 'playing';
    room.matchStartTime = Date.now();
    room.scores.clear();
    room.deaths.clear();
    for (const p of room.players.values()) {
      room.scores.set(p.id, 0);
      room.deaths.set(p.id, 0);
      p.hp = 100;
      p.alive = true;
      p.position = {
        x: (Math.random() - 0.5) * 30,
        y: 1.7,
        z: (Math.random() - 0.5) * 30,
      };
    }
    io.to(code).emit('match:started', {
      duration: MATCH_DURATION,
      killTarget: KILL_TARGET,
    });
    broadcastScores(code);
    console.log(`🎮 Match démarré dans ${code}`);
  }

  function endMatch(code) {
    const room = rooms.get(code);
    if (!room || room.matchStatus !== 'playing') return;
    room.matchStatus = 'ended';

    const list = Array.from(room.players.values())
      .map((p) => ({
        id: p.id,
        username: p.username,
        kills: room.scores.get(p.id) || 0,
        deaths: room.deaths.get(p.id) || 0,
      }))
      .sort((a, b) => b.kills - a.kills);

    const winnerUsername = list[0]?.username;

    // --- Récompenses ---
    for (const p of list) {
      const rewards = applyMatchRewards(p.username, {
        kills: p.kills,
        deaths: p.deaths,
        isWinner: p.username === winnerUsername,
      });
      io.to(p.id).emit('match:rewards', {
        xpGain: rewards.xpGain,
        coinGain: rewards.coinGain,
        profile: rewards.profile,
      });
    }

    io.to(code).emit('match:ended', { results: list });
    console.log(`🏆 Match terminé dans ${code} — Vainqueur: ${winnerUsername}`);

    setTimeout(() => {
      if (!rooms.has(code)) return;
      room.matchStatus = 'waiting';
      for (const p of room.players.values()) {
        p.hp = 100;
        p.alive = true;
        p.position = { x: 0, y: 1.7, z: 15 };
      }
      io.to(code).emit('match:reset');
      const inGame = Array.from(room.players.values()).filter((x) => x.inGame).length;
      if (inGame >= 2) startMatch(code);
    }, END_SCREEN_DURATION);
  }

  setInterval(() => {
    for (const [code, room] of rooms) {
      if (
        room.matchStatus === 'playing' &&
        Date.now() - room.matchStartTime >= MATCH_DURATION
      ) {
        endMatch(code);
      }
    }
  }, 1000);

  io.on('connection', (socket) => {
    let currentRoom = null;

    socket.on('room:create', ({ username }, cb) => {
      const code = generateCode();
      rooms.set(code, createRoom());
      joinRoom(code, username, cb);
    });

    socket.on('room:join', ({ code, username }, cb) => {
      if (!code || !rooms.has(code.toUpperCase())) {
        return cb({ error: 'Salon introuvable.' });
      }
      joinRoom(code.toUpperCase(), username, cb);
    });

    function joinRoom(code, username, cb) {
      if (currentRoom) leaveRoom();
      const room = rooms.get(code);
      const profile = getOrCreateProfile(username);
      const playerData = {
        id: socket.id,
        username,
        position: { x: 0, y: 1.7, z: 15 },
        rotation: { yaw: 0, pitch: 0 },
        hp: 100,
        alive: true,
        inGame: false,
        skin: profile.equippedSkin,
      };
      room.players.set(socket.id, playerData);
      room.scores.set(socket.id, 0);
      room.deaths.set(socket.id, 0);
      socket.join(code);
      currentRoom = code;

      cb({
        ok: true,
        code,
        players: Array.from(room.players.values()),
        matchStatus: room.matchStatus,
      });

      socket.to(code).emit('player:joined', playerData);
      broadcastScores(code);
    }

    socket.on('match:enter', () => {
      if (!currentRoom) return;
      const room = rooms.get(currentRoom);
      const p = room?.players.get(socket.id);
      if (!p) return;
      p.inGame = true;
      p.hp = 100;
      p.alive = true;

      const others = Array.from(room.players.values()).filter(
        (x) => x.id !== socket.id
      );
      socket.emit('match:entered', { players: others });

      const inGame = Array.from(room.players.values()).filter((x) => x.inGame).length;
      if (room.matchStatus === 'waiting' && inGame >= 2) {
        startMatch(currentRoom);
      } else if (room.matchStatus === 'playing') {
        socket.emit('match:started', {
          duration: MATCH_DURATION,
          killTarget: KILL_TARGET,
          timeLeft: MATCH_DURATION - (Date.now() - room.matchStartTime),
        });
        socket.emit('scores:update', Array.from(room.players.values()).map((pp) => ({
          id: pp.id,
          username: pp.username,
          kills: room.scores.get(pp.id) || 0,
          deaths: room.deaths.get(pp.id) || 0,
        })));
      }
    });

    socket.on('match:leave', () => {
      if (!currentRoom) return;
      const room = rooms.get(currentRoom);
      const p = room?.players.get(socket.id);
      if (p) p.inGame = false;
    });

    socket.on('player:state', ({ position, rotation }) => {
      if (!currentRoom) return;
      const room = rooms.get(currentRoom);
      const p = room?.players.get(socket.id);
      if (!p || !p.alive) return;
      p.position = position;
      p.rotation = rotation;
      socket.to(currentRoom).emit('player:state', {
        id: socket.id,
        position,
        rotation,
      });
    });

    socket.on('player:shoot', ({ targetId }) => {
      if (!currentRoom) return;
      const room = rooms.get(currentRoom);
      if (!room || room.matchStatus !== 'playing') return;
      const shooter = room.players.get(socket.id);
      const target = room.players.get(targetId);
      if (!shooter || !target) return;
      if (!shooter.alive || !target.alive) return;
      if (shooter.id === target.id) return;

      target.hp -= 25;
      io.to(currentRoom).emit('player:hit', {
        targetId,
        hp: Math.max(0, target.hp),
        shooterName: shooter.username,
      });

      if (target.hp <= 0) {
        target.alive = false;
        target.hp = 0;
        room.scores.set(socket.id, (room.scores.get(socket.id) || 0) + 1);
        room.deaths.set(targetId, (room.deaths.get(targetId) || 0) + 1);

        io.to(currentRoom).emit('player:died', {
          id: targetId,
          username: target.username,
          killerName: shooter.username,
        });

        broadcastScores(currentRoom);

        if ((room.scores.get(socket.id) || 0) >= KILL_TARGET) {
          endMatch(currentRoom);
        }
      }
    });

    socket.on('player:respawn', () => {
      if (!currentRoom) return;
      const room = rooms.get(currentRoom);
      if (!room || room.matchStatus !== 'playing') return;
      const p = room.players.get(socket.id);
      if (!p || p.alive) return;
      p.alive = true;
      p.hp = 100;
      p.position = {
        x: (Math.random() - 0.5) * 30,
        y: 1.7,
        z: (Math.random() - 0.5) * 30,
      };
      io.to(currentRoom).emit('player:respawned', {
        id: socket.id,
        position: p.position,
      });
    });

    socket.on('player:rift', () => {
      if (!currentRoom) return;
      const room = rooms.get(currentRoom);
      const p = room?.players.get(socket.id);
      if (!p) return;
      registerRiftUse(p.username);
    });

    socket.on('chat:message', ({ text }) => {
      if (!currentRoom || !text || text.length > 200) return;
      const room = rooms.get(currentRoom);
      const p = room?.players.get(socket.id);
      if (!p) return;
      io.to(currentRoom).emit('chat:message', {
        username: p.username,
        text: text.trim(),
        time: Date.now(),
      });
    });

    socket.on('room:leave', () => leaveRoom());

    function leaveRoom() {
      if (!currentRoom) return;
      const room = rooms.get(currentRoom);
      if (!room) return;
      room.players.delete(socket.id);
      room.scores.delete(socket.id);
      room.deaths.delete(socket.id);
      socket.to(currentRoom).emit('player:left', { id: socket.id });
      socket.leave(currentRoom);
      if (room.players.size === 0) {
        rooms.delete(currentRoom);
      } else {
        broadcastScores(currentRoom);
      }
      currentRoom = null;
    }

    socket.on('disconnect', () => {
      leaveRoom();
    });
  });
}
