// ============================================================
// SCÈNE DE CALIBRATION — Tous les modèles à scale 1.0
// Le PANNEAU (Town_Sign) est la RÉFÉRENCE au centre
// ============================================================

export const FLOOR_ZONES = [
  // Sol général clair pour bien voir les modèles
  { x: 0, z: 0, w: 200, d: 200, color: 0x2a2a3e, y: 0.01, type: 'road' },
  // Ligne de repère au centre (là où est le panneau)
  { x: 0, z: 0, w: 200, d: 0.5, color: 0xff2fb9, y: 0.02, type: 'road' },
];

export const MAP_CONFIG = {
  // ============================================================
  // RANGÉE 1 (z = -30) : BÂTIMENTS
  // ============================================================
  buildings: [
    ['buildings/House_by_Quaternius.glb', -60, 0, -30, 0, 1],
    ['buildings/Hut_by_Quaternius.glb', -20, 0, -30, 0, 1],
    ['buildings/Dock_by_Quaternius.glb', 20, 0, -30, 0, 1],
    ['buildings/Port_by_Quaternius.glb', 60, 0, -30, 0, 1],
  ],

  // ============================================================
  // RANGÉE 2 (z = -15) : NATURE (arbres, rochers)
  // ============================================================
  nature: [
    ['nature/Pine_by_Quaternius.glb', -60, 0, -15, 0, 1],
    ['nature/Dead_Tree_by_Quaternius.glb', -40, 0, -15, 0, 1],
    ['nature/Twisted_Tree_by_Quaternius.glb', -20, 0, -15, 0, 1],
    ['nature/Rocks_by_Quaternius.glb', 0, 0, -15, 0, 1],
    ['nature/Lis_by_Quaternius.glb', 20, 0, -15, 0, 1],
    ['nature/Plant_Big_by_Quaternius.glb', 40, 0, -15, 0, 1],
    ['nature/Plant_by_Quaternius.glb', 60, 0, -15, 0, 1],
  ],

  // ============================================================
  // RANGÉE 3 (z = 0) : PROPS + ⭐ RÉFÉRENCE AU CENTRE
  // ============================================================
  props: [
    ['props/Barrel_by_Quaternius.glb', -60, 0, 0, 0, 1],
    ['props/Container_Red_by_Quaternius.glb', -40, 0, 0, 0, 1],
    ['props/Fire_Hydrant_by_Quaternius.glb', -20, 0, 0, 0, 1],
    // ⭐ RÉFÉRENCE — Ne pas toucher
    ['props/Town_Sign_by_Quaternius.glb', 0, 0, 0, 0, 1],
    ['props/Street_Light_by_Quaternius.glb', 20, 0, 0, 0, 1],
    ['props/Trash_Bags_by_Quaternius.glb', 40, 0, 0, 0, 1],
    ['props/Traffic_Cone_by_Quaternius.glb', 60, 0, 0, 0, 1],
  ],

  // ============================================================
  // RANGÉE 4 (z = 15) : VÉHICULES + RESTE DES PROPS
  // ============================================================
  vehicles: [
    ['vehicles/Sports_Car_by_Quaternius.glb', -60, 0, 15, 0, 1],
    ['vehicles/Sports_Car_Armored_by_Quaternius.glb', -20, 0, 15, 0, 1],
    ['vehicles/Truck_Armored_by_Quaternius.glb', 20, 0, 15, 0, 1],
  ],
};

// Petit fichier pour les props restants (mis dans une liste séparée pour ne pas polluer)
export const EXTRA_PROPS = [
  ['props/Traffic_Barrier_by_Quaternius.glb', 60, 0, 15, 0, 1],
  ['props/Wheels_Stack_by_Quaternius.glb', -60, 0, 30, 0, 1],
  ['props/Wood_Log_by_Quaternius.glb', -20, 0, 30, 0, 1],
];

export const SPAWN_POINT = { x: 0, y: 1.7, z: 50 };
