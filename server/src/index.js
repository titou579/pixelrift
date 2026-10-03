import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import { authenticate, getSession, createSession, destroySession } from './auth.js';
import { setupGameServer } from './gameServer.js';
import {
  loadPlayers,
  getOrCreateProfile,
  SHOP_ITEMS,
  BATTLE_PASS_TIERS,
  buyItem,
  equipSkin,
  claimQuest,
  claimBattlePassTier,
  levelFromXp,
} from './dataManager.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

loadPlayers();

const io = new Server(server, {
  cors: { origin: CLIENT_URL, credentials: true },
});
setupGameServer(io);

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));

// --- Middleware auth ---
function requireAuth(req, res, next) {
  const session = getSession(req.cookies?.session);
  if (!session) return res.status(401).json({ error: 'Non connecté.' });
  req.user = session;
  next();
}

// --- Health ---
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', game: 'PIXELRIFT', time: new Date().toISOString() });
});

// --- Auth ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Requis.' });
  const user = authenticate(username, password);
  if (!user) return res.status(401).json({ error: 'Identifiants invalides.' });

  const token = createSession(user);
  res.cookie('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  getOrCreateProfile(user.username);
  res.json({ user });
});

app.get('/api/me', (req, res) => {
  const session = getSession(req.cookies?.session);
  if (!session) return res.status(401).json({ error: 'Non connecté.' });
  res.json({ user: session });
});

app.post('/api/logout', (req, res) => {
  destroySession(req.cookies?.session);
  res.clearCookie('session');
  res.json({ ok: true });
});

// --- Profil ---
app.get('/api/profile', requireAuth, (req, res) => {
  const profile = getOrCreateProfile(req.user.username);
  res.json({ profile, level: levelFromXp(profile.xp) });
});

// --- Shop ---
app.get('/api/shop', requireAuth, (req, res) => {
  res.json({ items: SHOP_ITEMS });
});

app.post('/api/shop/buy', requireAuth, (req, res) => {
  const { itemId } = req.body || {};
  const result = buyItem(req.user.username, itemId);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json({ profile: result.profile });
});

app.post('/api/shop/equip', requireAuth, (req, res) => {
  const { itemId } = req.body || {};
  const result = equipSkin(req.user.username, itemId);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json({ profile: result.profile });
});

// --- Quêtes ---
app.post('/api/quests/claim', requireAuth, (req, res) => {
  const { questId } = req.body || {};
  const result = claimQuest(req.user.username, questId);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json({ profile: result.profile });
});

// --- Battle Pass ---
app.get('/api/pass', requireAuth, (req, res) => {
  const profile = getOrCreateProfile(req.user.username);
  res.json({ tiers: BATTLE_PASS_TIERS, claimedTiers: profile.battlePass.claimedTiers });
});

app.post('/api/pass/claim', requireAuth, (req, res) => {
  const { tier } = req.body || {};
  const result = claimBattlePassTier(req.user.username, tier);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json({ profile: result.profile });
});

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

server.listen(PORT, () => {
  console.log(`🌌 PIXELRIFT API — listening on port ${PORT}`);
});
