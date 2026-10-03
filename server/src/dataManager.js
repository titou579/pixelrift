import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'players.json');

// --- Shop : items disponibles ---
export const SHOP_ITEMS = [
  { id: 'default',     name: 'Standard',       desc: 'Arme de base cyan',        price: 0,    color: 0x00eaff },
  { id: 'pink_demon',  name: 'Pink Demon',     desc: 'Rose néon agressif',        price: 500,  color: 0xff2fb9 },
  { id: 'violet_void', name: 'Violet Void',    desc: 'Violet profond cosmique',   price: 1000, color: 0x8b5cf6 },
  { id: 'gold_legend', name: 'Gold Legend',    desc: 'Or massif étincelant',      price: 2500, color: 0xffd93d },
  { id: 'rainbow',     name: 'Rainbow',        desc: 'Arc-en-ciel animé',         price: 5000, color: 0xff00ff },
];

// --- Pass de combat ---
export const BATTLE_PASS_TIERS = [
  { tier: 1, xpRequired: 1000,  reward: { type: 'coins', amount: 200 },       label: '200 NovaCoins' },
  { tier: 2, xpRequired: 2500,  reward: { type: 'skin',  itemId: 'pink_demon' }, label: 'Skin Pink Demon' },
  { tier: 3, xpRequired: 5000,  reward: { type: 'coins', amount: 500 },       label: '500 NovaCoins' },
  { tier: 4, xpRequired: 10000, reward: { type: 'skin',  itemId: 'violet_void' }, label: 'Skin Violet Void' },
  { tier: 5, xpRequired: 20000, reward: { type: 'coins', amount: 1500 },      label: '1500 NovaCoins + Badge Légende' },
];

// --- Quêtes journalières (3 types aléatoires par jour) ---
const QUEST_POOL = [
  { id: 'kills_5',   type: 'kills',    target: 5, desc: 'Fais 5 kills',              reward: { coins: 100, xp: 200 } },
  { id: 'wins_2',    type: 'wins',     target: 2, desc: 'Gagne 2 matchs',            reward: { coins: 150, xp: 300 } },
  { id: 'rift_3',    type: 'riftUses', target: 3, desc: 'Utilise le Rift 3 fois',    reward: { coins: 80,  xp: 150 } },
  { id: 'matches_3', type: 'matches',  target: 3, desc: 'Joue 3 matchs',             reward: { coins: 120, xp: 250 } },
  { id: 'kills_10',  type: 'kills',    target: 10, desc: 'Fais 10 kills',            reward: { coins: 200, xp: 400 } },
  { id: 'deaths_5',  type: 'matches',  target: 5, desc: 'Termine 5 matchs',          reward: { coins: 100, xp: 200 } },
];

let players = {};
let saveTimeout = null;

// --- Initialisation ---
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function loadPlayers() {
  ensureDataDir();
  if (fs.existsSync(DATA_FILE)) {
    try {
      players = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      console.log(`💾 ${Object.keys(players).length} profil(s) chargé(s)`);
    } catch (e) {
      console.error('❌ Erreur lecture players.json:', e.message);
      players = {};
    }
  } else {
    players = {};
    console.log('💾 Aucun profil trouvé, création à la volée');
  }
}

export function savePlayers() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(players, null, 2));
  }, 500); // debounce 500ms
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function pickRandomQuests() {
  const shuffled = [...QUEST_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((q) => ({
    ...q,
    progress: 0,
    claimed: false,
  }));
}

// --- Profil ---
export function getOrCreateProfile(username) {
  if (!players[username]) {
    players[username] = {
      username,
      xp: 0,
      level: 1,
      coins: 0,
      ownedItems: ['default'],
      equippedSkin: 'default',
      quests: pickRandomQuests(),
      questsDay: today(),
      battlePass: { claimedTiers: [] },
      stats: {
        totalKills: 0,
        totalDeaths: 0,
        totalWins: 0,
        totalMatches: 0,
        totalRiftUses: 0,
      },
      createdAt: Date.now(),
    };
    savePlayers();
  }

  const p = players[username];

  // Renouvelle les quêtes si nouveau jour
  if (p.questsDay !== today()) {
    p.quests = pickRandomQuests();
    p.questsDay = today();
    savePlayers();
  }

  return p;
}

export function getProfile(username) {
  return players[username] || null;
}

export function levelFromXp(xp) {
  return Math.max(1, Math.floor(xp / 1000) + 1);
}

// --- Gains ---
export function addXp(username, amount) {
  const p = getOrCreateProfile(username);
  p.xp += amount;
  p.level = levelFromXp(p.xp);
  savePlayers();
  return p;
}

export function addCoins(username, amount) {
  const p = getOrCreateProfile(username);
  p.coins += amount;
  savePlayers();
  return p;
}

// --- Quêtes : progression ---
export function progressQuest(username, type, amount = 1) {
  const p = getOrCreateProfile(username);
  let changed = false;
  for (const q of p.quests) {
    if (q.type === type && !q.claimed && q.progress < q.target) {
      q.progress = Math.min(q.target, q.progress + amount);
      changed = true;
    }
  }
  if (changed) savePlayers();
  return p;
}

export function claimQuest(username, questId) {
  const p = getOrCreateProfile(username);
  const q = p.quests.find((x) => x.id === questId);
  if (!q || q.claimed || q.progress < q.target) return { error: 'Quête non terminée' };
  q.claimed = true;
  p.coins += q.reward.coins;
  p.xp += q.reward.xp;
  p.level = levelFromXp(p.xp);
  savePlayers();
  return { ok: true, profile: p };
}

// --- Shop ---
export function buyItem(username, itemId) {
  const p = getOrCreateProfile(username);
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item) return { error: 'Item introuvable' };
  if (p.ownedItems.includes(itemId)) return { error: 'Déjà possédé' };
  if (p.coins < item.price) return { error: 'Pas assez de NovaCoins' };
  p.coins -= item.price;
  p.ownedItems.push(itemId);
  savePlayers();
  return { ok: true, profile: p };
}

export function equipSkin(username, itemId) {
  const p = getOrCreateProfile(username);
  if (!p.ownedItems.includes(itemId)) return { error: 'Skin non possédé' };
  p.equippedSkin = itemId;
  savePlayers();
  return { ok: true, profile: p };
}

// --- Battle Pass ---
export function claimBattlePassTier(username, tier) {
  const p = getOrCreateProfile(username);
  const bp = BATTLE_PASS_TIERS.find((t) => t.tier === tier);
  if (!bp) return { error: 'Palier inexistant' };
  if (p.battlePass.claimedTiers.includes(tier)) return { error: 'Déjà réclamé' };
  if (p.xp < bp.xpRequired) return { error: 'XP insuffisante' };

  p.battlePass.claimedTiers.push(tier);
  if (bp.reward.type === 'coins') {
    p.coins += bp.reward.amount;
  } else if (bp.reward.type === 'skin') {
    if (!p.ownedItems.includes(bp.reward.itemId)) {
      p.ownedItems.push(bp.reward.itemId);
    }
  }
  savePlayers();
  return { ok: true, profile: p };
}

// --- Fin de match : applique les récompenses ---
export function applyMatchRewards(username, { kills, deaths, isWinner }) {
  const p = getOrCreateProfile(username);
  const xpGain = 100 + kills * 50 + (isWinner ? 200 : 0);
  const coinGain = 20 + kills * 10 + (isWinner ? 100 : 0);

  p.xp += xpGain;
  p.coins += coinGain;
  p.level = levelFromXp(p.xp);
  p.stats.totalKills += kills;
  p.stats.totalDeaths += deaths;
  p.stats.totalMatches += 1;
  if (isWinner) p.stats.totalWins += 1;

  // Progression des quêtes
  progressQuestInternal(p, 'kills', kills);
  progressQuestInternal(p, 'matches', 1);
  if (isWinner) progressQuestInternal(p, 'wins', 1);

  savePlayers();
  return { profile: p, xpGain, coinGain };
}

function progressQuestInternal(p, type, amount) {
  for (const q of p.quests) {
    if (q.type === type && !q.claimed && q.progress < q.target) {
      q.progress = Math.min(q.target, q.progress + amount);
    }
  }
}

export function registerRiftUse(username) {
  const p = getOrCreateProfile(username);
  p.stats.totalRiftUses += 1;
  progressQuestInternal(p, 'riftUses', 1);
  savePlayers();
}
