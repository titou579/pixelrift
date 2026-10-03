import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import { authenticate, getSession, createSession, destroySession } from './auth.js';
import { setupGameServer } from './gameServer.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// --- Socket.io ---
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
});
setupGameServer(io);

// --- Middlewares ---
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

// --- Health check (pour UptimeRobot) ---
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', game: 'PIXELRIFT', time: new Date().toISOString() });
});

// --- Auth: login ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Pseudo et mot de passe requis.' });
  }

  const user = authenticate(username, password);
  if (!user) {
    return res.status(401).json({ error: 'Identifiants invalides.' });
  }

  const token = createSession(user);
  res.cookie('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.json({ user });
});

// --- Auth: me ---
app.get('/api/me', (req, res) => {
  const session = getSession(req.cookies?.session);
  if (!session) return res.status(401).json({ error: 'Non connecté.' });
  res.json({ user: session });
});

// --- Auth: logout ---
app.post('/api/logout', (req, res) => {
  destroySession(req.cookies?.session);
  res.clearCookie('session');
  res.json({ ok: true });
});

// --- 404 ---
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

server.listen(PORT, () => {
  console.log(`🌌 PIXELRIFT API — listening on port ${PORT}`);
});
