// ============================================================
// CONFIG DE LA MAP — "Village post-apo organisé"
// ============================================================

// --- Zones de sol colorées (par-dessus le sol de base) ---
export const FLOOR_ZONES = [
  // Zone EAU (port, au nord) — sera utilisée pour l'oxygène
  { x: 0, z: -55, w: 100, d: 30, color: 0x0a4a8a, y: 0.05, type: 'water' },

  // Jardins verts (ouest et est)
  { x: -35, z: 5, w: 28, d: 28, color: 0x1e4d2b, y: 0.02, type: 'garden' },
  { x: 35, z: 5, w: 28, d: 28, color: 0x1e4d2b, y: 0.02, type: 'garden' },

  // Route principale (horizontale, au nord de la place)
  { x: 0, z: -25, w: 120, d: 8, color: 0x2a2a3e, y: 0.03, type: 'road' },

  // Route sud (horizontale, au sud des maisons)
  { x: 0, z: 22, w: 120, d: 8, color: 0x2a2a3e, y: 0.03, type: 'road' },

  // Route verticale (centre, relie les 2 routes)
  { x: 0, z: 0, w: 8, d: 50, color: 0x2a2a3e, y: 0.03, type: 'road' },

  // Place centrale (pavée)
  { x: 0, z: 5, w: 18, d: 18, color: 0x3a3a52, y: 0.04, type: 'plaza' },
];

// ============================================================
// MODÈLES — Format: [modele, x, y, z, rotY?, scale?]
// ============================================================
export const MAP_CONFIG = {
  // --- Bâtiments alignés le long des routes ---
  buildings: [
    // Rangée sud (4 maisons alignées)
    ['buildings/House_by_Quaternius.glb', -30, 0, 12, Math.PI, 0.5],
    ['buildings/House_by_Quaternius.glb', -12, 0, 12, Math.PI, 0.5],
    ['buildings/House_by_Quaternius.glb', 12, 0, 12, Math.PI, 0.5],
    ['buildings/House_by_Quaternius.glb', 30, 0, 12, Math.PI, 0.5],

    // Rangée nord (2 huttes de marché)
    ['buildings/Hut_by_Quaternius.glb', -20, 0, -12, 0, 1.5],
    ['buildings/Hut_by_Quaternius.glb', 20, 0, -12, 0, 1.5],

    // Zone port (au nord)
    ['buildings/Dock_by_Quaternius.glb', -15, 0, -38, 0, 0.8],
    ['buildings/Port_by_Quaternius.glb', 15, 0, -38, 0, 0.6],

    // Murs de pierre (limites est/ouest)
    ['buildings/Stone_Wall_by_Quaternius.glb', -55, 0, -15, Math.PI / 2, 0.8],
    ['buildings/Stone_Wall_by_Quaternius.glb', -55, 0, 15, Math.PI / 2, 0.8],
    ['buildings/Stone_Wall_by_Quaternius.glb', 55, 0, -15, Math.PI / 2, 0.8],
    ['buildings/Stone_Wall_by_Quaternius.glb', 55, 0, 15, Math.PI / 2, 0.8],

    // Mur en bois (entrée sud)
    ['buildings/Wooden_Wall_by_Quaternius.glb', -10, 0, 40, 0, 0.8],
    ['buildings/Wooden_Wall_by_Quaternius.glb', 10, 0, 40, 0, 0.8],
  ],

  // --- Nature (mini-forêts dans les jardins + déco) ---
  nature: [
    // MINI-FORÊT OUEST (jardin vert, arbres serrés pour se cacher)
    ['nature/Pine_by_Quaternius.glb', -42, 0, -5, 0, 0.6],
    ['nature/Pine_by_Quaternius.glb', -38, 0, 0, 1.2, 0.6],
    ['nature/Pine_by_Quaternius.glb', -42, 0, 8, 0.5, 0.6],
    ['nature/Pine_by_Quaternius.glb', -32, 0, -3, 2, 0.6],
    ['nature/Pine_by_Quaternius.glb', -32, 0, 12, 1, 0.6],
    ['nature/Pine_by_Quaternius.glb', -40, 0, 15, 0.8, 0.6],
    ['nature/Twisted_Tree_by_Quaternius.glb', -36, 0, 6, 1.5, 0.5],
    ['nature/Twisted_Tree_by_Quaternius.glb', -45, 0, 2, 0, 0.5],

    // MINI-FORÊT EST (jardin vert, miroir)
    ['nature/Pine_by_Quaternius.glb', 42, 0, -5, 0, 0.6],
    ['nature/Pine_by_Quaternius.glb', 38, 0, 0, 1.2, 0.6],
    ['nature/Pine_by_Quaternius.glb', 42, 0, 8, 0.5, 0.6],
    ['nature/Pine_by_Quaternius.glb', 32, 0, -3, 2, 0.6],
    ['nature/Pine_by_Quaternius.glb', 32, 0, 12, 1, 0.6],
    ['nature/Pine_by_Quaternius.glb', 40, 0, 15, 0.8, 0.6],
    ['nature/Twisted_Tree_by_Quaternius.glb', 36, 0, 6, 1.5, 0.5],
    ['nature/Twisted_Tree_by_Quaternius.glb', 45, 0, 2, 0, 0.5],

    // Arbres morts (déco dans la place centrale)
    ['nature/Dead_Tree_by_Quaternius.glb', -6, 0, 0, 0, 0.5],
    ['nature/Dead_Tree_by_Quaternius.glb', 6, 0, 0, 1, 0.5],

    // Rochers (bords)
    ['nature/Rocks_by_Quaternius.glb', 0, 0, 40, 0, 0.6],
    ['nature/Rocks_by_Quaternius.glb', -50, 0, 25, 1, 0.6],
    ['nature/Rocks_by_Quaternius.glb', 50, 0, 25, 2, 0.6],

    // Fleurs (déco autour du spawn)
    ['nature/Lis_by_Quaternius.glb', -4, 0, 30, 0, 1],
    ['nature/Lis_by_Quaternius.glb', 4, 0, 30, 0.7, 1],
    ['nature/Lis_by_Quaternius.glb', -8, 0, 28, 1.4, 1],
    ['nature/Lis_by_Quaternius.glb', 8, 0, 28, 2, 1],
  ],

  // --- Props (panneaux, barils, décos urbaines) ---
  props: [
    // Panneau de ville au centre de la place
    ['props/Town_Sign_by_Quaternius.glb', 0, 0, 5, 0, 1],

    // Barils (déco entre les maisons)
    ['props/Barrel_by_Quaternius.glb', -22, 0, 18, 0, 1],
    ['props/Barrel_by_Quaternius.glb', -21, 0, 19, 0, 1],
    ['props/Barrel_by_Quaternius.glb', 22, 0, 18, 0, 1],
    ['props/Barrel_by_Quaternius.glb', 21, 0, 19, 0, 1],

    // Bouche d'incendie (place centrale)
    ['props/Fire_Hydrant_by_Quaternius.glb', 4, 0, 8, 0, 1],

    // Cônes sur la route principale
    ['props/Traffic_Cone_by_Quaternius.glb', -15, 0, -25, 0, 1],
    ['props/Traffic_Cone_by_Quaternius.glb', -13, 0, -25, 0, 1],
    ['props/Traffic_Cone_by_Quaternius.glb', 15, 0, -25, 0, 1],
    ['props/Traffic_Cone_by_Quaternius.glb', 17, 0, -25, 0, 1],

    // Barrière de chantier sur route sud
    ['props/Traffic_Barrier_by_Quaternius.glb', -5, 0, 22, 0, 1],
    ['props/Traffic_Barrier_by_Quaternius.glb', 5, 0, 22, 0, 1],

    // Lampadaires aux coins de la place
    ['props/Street_Light_by_Quaternius.glb', -12, 0, -2, Math.PI / 4, 0.5],
    ['props/Street_Light_by_Quaternius.glb', 12, 0, -2, -Math.PI / 4, 0.5],
    ['props/Street_Light_by_Quaternius.glb', -12, 0, 15, (3 * Math.PI) / 4, 0.5],
    ['props/Street_Light_by_Quaternius.glb', 12, 0, 15, -Math.PI / 4, 0.5],

    // Lampadaires le long des routes
    ['props/Street_Light_by_Quaternius.glb', -40, 0, -22, 0, 0.5],
    ['props/Street_Light_by_Quaternius.glb', 40, 0, -22, 0, 0.5],
    ['props/Street_Light_by_Quaternius.glb', -40, 0, 22, 0, 0.5],
    ['props/Street_Light_by_Quaternius.glb', 40, 0, 22, 0, 0.5],

    // Container rouge (entrepôt est)
    ['props/Container_Red_by_Quaternius.glb', 40, 0, -15, Math.PI / 2, 1],

    // Bûches + roues (déco)
    ['props/Wood_Log_by_Quaternius.glb', -8, 0, 18, 0, 1],
    ['props/Wheels_Stack_by_Quaternius.glb', 8, 0, 18, 0, 1],

    // Poubelles
    ['props/Trash_Bags_by_Quaternius.glb', -20, 0, 20, 0, 1],
    ['props/Trash_Bags_by_Quaternius.glb', 20, 0, 20, 1, 1],
  ],

  // --- Véhicules (garés sur les routes) ---
  vehicles: [
    // Sur la route principale
    ['vehicles/Sports_Car_by_Quaternius.glb', -25, 0, -25, Math.PI / 2, 0.5],
    ['vehicles/Sports_Car_Armored_by_Quaternius.glb', 20, 0, -25, -Math.PI / 2, 0.5],

    // Sur la route sud
    ['vehicles/Sports_Car_by_Quaternius.glb', -18, 0, 22, Math.PI / 2, 0.5],
    ['vehicles/Sports_Car_by_Quaternius.glb', 18, 0, 22, -Math.PI / 2, 0.5],

    // Camion blindé près du port
    ['vehicles/Truck_Armored_by_Quaternius.glb', -30, 0, -35, Math.PI / 4, 0.5],
  ],
};

// Spawn du joueur (sud, face à la place)
export const SPAWN_POINT = { x: 0, y: 1.7, z: 35 };
