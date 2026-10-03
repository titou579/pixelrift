// Gestion des salons, joueurs et chat via Socket.io
const rooms = new Map(); // code -> { players: Map<socketId, playerData> }

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

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

export function setupGameServer(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connecté : ${socket.id}`);

    let currentRoom = null;

    // --- CRÉER UN SALON ---
    socket.on('room:create', ({ username }, callback) => {
      const code = generateCode();
      rooms.set(code, { players: new Map() });
      joinRoom(code, username, callback);
    });

    // --- REJOINDRE UN SALON ---
    socket.on('room:join', ({ code, username }, callback) => {
      if (!code || !rooms.has(code.toUpperCase())) {
        return callback({ error: 'Salon introuvable.' });
      }
      joinRoom(code.toUpperCase(), username, callback);
    });

    function joinRoom(code, username, callback) {
      if (currentRoom) leaveRoom();

      const room = rooms.get(code);
      room.players.set(socket.id, {
        id: socket.id,
        username,
        position: { x: 0, y: 1.7, z: 15 },
        rotation: { yaw: 0, pitch: 0 },
      });
      socket.join(code);
      currentRoom = code;

      // Confirme au joueur qui rejoint
      callback({
        ok: true,
        code,
        players: Array.from(room.players.values()),
      });

      // Préviens les autres
      socket.to(code).emit('player:joined', {
        id: socket.id,
        username,
        position: { x: 0, y: 1.7, z: 15 },
        rotation: { yaw: 0, pitch: 0 },
      });

      console.log(`👤 ${username} a rejoint ${code} (${room.players.size} joueurs)`);
    }

    // --- POSITION DES JOUEURS ---
    socket.on('player:state', ({ position, rotation }) => {
      if (!currentRoom) return;
      const room = rooms.get(currentRoom);
      const p = room?.players.get(socket.id);
      if (!p) return;
      p.position = position;
      p.rotation = rotation;

      socket.to(currentRoom).emit('player:state', {
        id: socket.id,
        position,
        rotation,
      });
    });

    // --- CHAT ---
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

    // --- QUITTER LE SALON ---
    socket.on('room:leave', () => {
      leaveRoom();
    });

    function leaveRoom() {
      if (!currentRoom) return;
      const room = rooms.get(currentRoom);
      if (!room) return;

      room.players.delete(socket.id);
      socket.to(currentRoom).emit('player:left', { id: socket.id });
      socket.leave(currentRoom);

      if (room.players.size === 0) {
        rooms.delete(currentRoom);
        console.log(`🗑️  Salon ${currentRoom} supprimé (vide)`);
      }
      currentRoom = null;
    }

    // --- DÉCONNEXION ---
    socket.on('disconnect', () => {
      leaveRoom();
      console.log(`❌ Socket déconnecté : ${socket.id}`);
    });
  });
}
