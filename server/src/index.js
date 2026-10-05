import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const BACKUP_TOKEN = process.env.BACKUP_TOKEN || 'change_me_backup_token';

loadPlayers();

const io = new Server(server, {
  cors: { origin: CLIENT_URL, credentials: true },
});
setupGameServer(io);

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));

function requireAuth(req, res, next) {
  const session = getSession(req.cookies?.session);
  if (!session) return res.status(401).json({ error: 'Non connecté.' });
  req.user = session;
  next();
}

function requireBackupToken(req, res, next) {
  const token = req.headers['x-backup-token'] || req.query.token;
  if (token !== BACKUP_TOKEN) {
    return res.status(403).json({ error: 'Token invalide.' });
  }
  next();
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', game: 'PIXELRIFT', time: new Date().toISOString() });
});

// --- BACKUP (protégé par token) ---
const DATA_FILE = path.join(__dirname, '..', 'data', 'players.json');

app.get('/api/backup/download', requireBackupToken, (_req, res) => {
  if (!fs.existsSync(DATA_FILE)) {
    return res.json({ players: {}, empty: true });
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const players = JSON.parse(raw);
    res.json({ players, count: Object.keys(players).length, time: Date.now() });
  } catch (e) {
    res.status(500).json({ error: 'Erreur lecture backup: ' + e.message });
  }
});

app.post('/api/backup/upload', requireBackupToken, (req, res) => {
  const { players } = req.body || {};
  if (!players || typeof players !== 'object') {
    return res.status(400).json({ error: 'Format invalide (players attendu).' });
  }
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(players, null, 2));
  console.log(`💾 Backup restauré manuellement (${Object.keys(players).length} profils)`);
  res.json({ ok: true, count: Object.keys(players).length });
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
app.get('/api/shop', requireAuth, (_req, res) => {
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
