import crypto from 'crypto';

// --- Comptes (lus depuis les variables d'env Render / .env local) ---
const ACCOUNTS = [
  { username: 'titou',  password: process.env.ACCOUNT_TITOU_PWD,  role: 'admin'  },
  { username: 'thomas', password: process.env.ACCOUNT_THOMAS_PWD, role: 'player' },
  { username: 'hugo',   password: process.env.ACCOUNT_HUGO_PWD,   role: 'player' },
  { username: 'lilou',  password: process.env.ACCOUNT_LILOU_PWD,  role: 'player' },
  { username: 'matteo', password: process.env.ACCOUNT_MATTEO_PWD, role: 'player' },
];

// --- Sessions en mémoire (pour Phase 0 — on ajoutera la persistance ensuite) ---
const sessions = new Map(); // token -> { username, role, loginAt }

export function authenticate(username, password) {
  const acc = ACCOUNTS.find(
    a => a.username.toLowerCase() === username.toLowerCase() && a.password
  );
  if (!acc) return null;
  if (acc.password !== password) return null;

  return { username: acc.username, role: acc.role };
}

export function createSession(user) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { ...user, loginAt: Date.now() });
  return token;
}

export function getSession(token) {
  if (!token) return null;
  return sessions.get(token) || null;
}

export function destroySession(token) {
  if (token) sessions.delete(token);
}
