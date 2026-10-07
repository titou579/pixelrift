// ============================================================
// TEST — Comparaison Pack J-Toastie vs Référence Quaternius
// Tous les modèles à scale 1.0
// ============================================================

export const FLOOR_ZONES = [
  { x: 0, z: 0, w: 100, d: 60, color: 0x3a5a3a, y: 0.01, type: 'road' },
  { x: 0, z: 0, w: 100, d: 0.5, color: 0xff2fb9, y: 0.02, type: 'road' },
];

export const MAP_CONFIG = {
  // ⭐ Référence Quaternius (à gauche)
  props: [
    ['props/Town_Sign_by_Quaternius.glb', -15, 0, 0, 0, 1],
  ],

  // 🆕 Nouveaux modèles J-Toastie à tester
  nature: [
    ['test_models/Traffic_Light_by_J-Toastie.glb', 0, 0, 0, 0, 1],
    ['test_models/Trash_Bag_by_J-Toastie.glb', 15, 0, 0, 0, 1],
  ],

  // Vide pour l'instant
  buildings: [],
  vehicles: [],
};

export const EXTRA_PROPS = [];

export const SPAWN_POINT = { x: 0, y: 1.7, z: 20 };
