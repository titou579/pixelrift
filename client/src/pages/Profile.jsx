import { useEffect, useState } from 'react';
import {
  getProfile,
  getShop,
  buyItem,
  equipSkin,
  claimQuest,
  getPass,
  claimPassTier,
} from '../api.js';

export default function Profile({ user, onBack }) {
  const [tab, setTab] = useState('stats');
  const [profile, setProfile] = useState(null);
  const [shop, setShop] = useState([]);
  const [pass, setPass] = useState({ tiers: [], claimedTiers: [] });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  async function refresh() {
    const [p, s, bp] = await Promise.all([getProfile(), getShop(), getPass()]);
    setProfile(p.profile);
    setShop(s.items);
    setPass(bp);
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  async function handleBuy(itemId) {
    try {
      setMsg('');
      const { profile: p } = await buyItem(itemId);
      setProfile(p);
      setMsg('✅ Achat effectué !');
      setTimeout(() => setMsg(''), 2000);
    } catch (e) {
      setMsg('❌ ' + e.message);
      setTimeout(() => setMsg(''), 2500);
    }
  }

  async function handleEquip(itemId) {
    try {
      const { profile: p } = await equipSkin(itemId);
      setProfile(p);
      setMsg('✅ Skin équipé !');
      setTimeout(() => setMsg(''), 2000);
    } catch (e) {
      setMsg('❌ ' + e.message);
    }
  }

  async function handleClaimQuest(questId) {
    try {
      const { profile: p } = await claimQuest(questId);
      setProfile(p);
      setMsg('🎁 Récompense récupérée !');
      setTimeout(() => setMsg(''), 2000);
    } catch (e) {
      setMsg('❌ ' + e.message);
    }
  }

  async function handleClaimPass(tier) {
    try {
      const { profile: p } = await claimPassTier(tier);
      setProfile(p);
      setPass((prev) => ({ ...prev, claimedTiers: [...prev.claimedTiers, tier] }));
      setMsg('🎁 Palier débloqué !');
      setTimeout(() => setMsg(''), 2000);
    } catch (e) {
      setMsg('❌ ' + e.message);
    }
  }

  if (loading || !profile) {
    return (
      <div className="screen center">
        <p className="muted">Chargement…</p>
      </div>
    );
  }

  const xpInLevel = profile.xp % 1000;
  const xpPercent = (xpInLevel / 1000) * 100;

  return (
    <div className="screen center">
      <div className="card wide">
        <div className="profile-header">
          <button className="secondary small-btn" onClick={onBack}>← Retour</button>
          <h1 className="logo">PIXEL<span>RIFT</span></h1>
          <div className="profile-coins">💰 {profile.coins}</div>
        </div>

        <div className="profile-tabs">
          {['stats', 'shop', 'pass', 'quests'].map((t) => (
            <button
              key={t}
              className={`tab-btn ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'stats' && '📊 Profil'}
              {t === 'shop' && '🛒 Shop'}
              {t === 'pass' && '🎫 Pass'}
              {t === 'quests' && '📜 Quêtes'}
            </button>
          ))}
        </div>

        {msg && <p className="profile-msg">{msg}</p>}

        {tab === 'stats' && (
          <div className="tab-content">
            <div className="xp-bar-wrap">
              <div className="xp-bar">
                <div className="xp-fill" style={{ width: `${xpPercent}%` }} />
              </div>
              <p className="xp-label">
                Niveau <strong>{profile.level}</strong> — {xpInLevel}/1000 XP
              </p>
            </div>

            <div className="stats-grid">
              <div className="stat-card"><p className="stat-num">{profile.stats.totalKills}</p><p className="stat-label">Kills totaux</p></div>
              <div className="stat-card"><p className="stat-num">{profile.stats.totalDeaths}</p><p className="stat-label">Morts</p></div>
              <div className="stat-card"><p className="stat-num">{profile.stats.totalWins}</p><p className="stat-label">Victoires</p></div>
              <div className="stat-card"><p className="stat-num">{profile.stats.totalMatches}</p><p className="stat-label">Matchs joués</p></div>
              <div className="stat-card"><p className="stat-num">{profile.stats.totalRiftUses}</p><p className="stat-label">Rifts utilisés</p></div>
              <div className="stat-card"><p className="stat-num">{profile.xp}</p><p className="stat-label">XP totale</p></div>
            </div>
          </div>
        )}

        {tab === 'shop' && (
          <div className="tab-content">
            <div className="shop-grid">
              {shop.map((item) => {
                const owned = profile.ownedItems.includes(item.id);
                const equipped = profile.equippedSkin === item.id;
                return (
                  <div key={item.id} className={`shop-item ${equipped ? 'equipped' : ''}`}>
                    <div
                      className="shop-preview"
                      style={{ background: `#${item.color.toString(16).padStart(6, '0')}` }}
                    />
                    <p className="shop-name">{item.name}</p>
                    <p className="shop-desc">{item.desc}</p>
                    {equipped && <p className="shop-status">✅ Équipé</p>}
                    {!equipped && owned && (
                      <button className="small-btn" onClick={() => handleEquip(item.id)}>
                        Équiper
                      </button>
                    )}
                    {!owned && (
                      <button
                        className="small-btn"
                        onClick={() => handleBuy(item.id)}
                        disabled={profile.coins < item.price}
                      >
                        {item.price === 0 ? 'Obtenir' : `${item.price} 💰`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'pass' && (
          <div className="tab-content">
            {pass.tiers.map((t) => {
              const claimed = pass.claimedTiers.includes(t.tier);
              const unlocked = profile.xp >= t.xpRequired;
              return (
                <div key={t.tier} className={`pass-tier ${claimed ? 'claimed' : unlocked ? 'unlocked' : ''}`}>
                  <div className="tier-num">Palier {t.tier}</div>
                  <div className="tier-info">
                    <p className="tier-reward">{t.label}</p>
                    <p className="tier-xp">{t.xpRequired} XP requis</p>
                  </div>
                  {claimed && <span className="tier-status">✅</span>}
                  {!claimed && unlocked && (
                    <button className="small-btn" onClick={() => handleClaimPass(t.tier)}>
                      Réclamer
                    </button>
                  )}
                  {!claimed && !unlocked && <span className="tier-lock">🔒</span>}
                </div>
              );
            })}
          </div>
        )}

        {tab === 'quests' && (
          <div className="tab-content">
            {profile.quests.map((q) => {
              const done = q.progress >= q.target;
              return (
                <div key={q.id} className={`quest-item ${q.claimed ? 'claimed' : done ? 'done' : ''}`}>
                  <div className="quest-info">
                    <p className="quest-desc">{q.desc}</p>
                    <div className="quest-progress-bar">
                      <div
                        className="quest-progress-fill"
                        style={{ width: `${Math.min(100, (q.progress / q.target) * 100)}%` }}
                      />
                    </div>
                    <p className="quest-progress-text">
                      {q.progress} / {q.target}
                    </p>
                    <p className="quest-reward">
                      Récompense : {q.reward.coins} 💰 + {q.reward.xp} XP
                    </p>
                  </div>
                  {q.claimed && <span className="tier-status">✅</span>}
                  {!q.claimed && done && (
                    <button className="small-btn" onClick={() => handleClaimQuest(q.id)}>
                      Réclamer
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
