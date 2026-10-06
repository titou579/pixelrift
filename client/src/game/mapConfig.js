// ============================================================
// CONFIG DE LA MAP — "Place de village post-apo"
// Format: [modele, x, y, z, rotationY?, scale?]
//   - x, z : position (mètres) — le centre est (0, 0)
//   - y    : hauteur (0 = sol)
//   - rotY : rotation en radians
//   - scale: multiplicateur de taille
// ============================================================

export const MAP_CONFIG = {
  // --- Bâtiments (disposés en carré autour de la place) ---
  buildings: [
    // Coin Nord-Ouest
    ['buildings/House_by_Quaternius.glb', -18, 0, -18, Math.PI / 4, 0.4],
    // Coin Nord-Est
    ['buildings/House_by_Quaternius.glb', 18, 0, -18, -Math.PI / 4, 0.4],
    // Coin Sud-Ouest
    ['buildings/House_by_Quaternius.glb', -18, 0, 18, (3 * Math.PI) / 4, 0.4],
    // Coin Sud-Est (un peu en retrait pour laisser le spawn)
    ['buildings/House_by_Quaternius.glb', 20, 0, 20, -Math.PI / 2, 0.4],

    // Deux huttes sur les côtés (cabanes de marché)
    ['buildings/Hut_by_Quaternius.glb', -30, 0, 0, Math.PI / 2, 1.2],
    ['buildings/Hut_by_Quaternius.glb', 30, 0, 0, -Math.PI / 2, 1.2],

    // Port + Dock au fond (au nord)
    ['buildings/Dock_by_Quaternius.glb', 0, 0, -35, 0, 0.8],
    ['buildings/Port_by_Quaternius.glb', -15, 0, -40, 0, 0.6],

    // Murs de pierre (barrières naturelles)
    ['buildings/Stone_Wall_by_Quaternius.glb', -35, 0, -15, Math.PI / 2, 0.8],
    ['buildings/Stone_Wall_by_Quaternius.glb', 35, 0, -15, Math.PI / 2, 0.8],
    ['buildings/Stone_Wall_by_Quaternius.glb', -35, 0, 15, Math.PI / 2, 0.8],
    ['buildings/Stone_Wall_by_Quaternius.glb', 35, 0, 15, Math.PI / 2, 0.8],

    // Mur en bois (entrée sud)
    ['buildings/Wooden_Wall_by_Quaternius.glb', -8, 0, 32, 0, 0.8],
    ['buildings/Wooden_Wall_by_Quaternius.glb', 8, 0, 32, 0, 0.8],
  ],

  // --- Nature (bordures + décoration) ---
  nature: [
    // Sapins aux 4 coins extérieurs (créent une "forêt" protectrice)
    ['nature/Pine_by_Quaternius.glb', -40, 0, -30, 0, 0.7],
    ['nature/Pine_by_Quaternius.glb', 40, 0, -30, 1.5, 0.7],
    ['nature/Pine_by_Quaternius.glb', -40, 0, 30, 0.5, 0.7],
    ['nature/Pine_by_Quaternius.glb', 40, 0, 30, 2, 0.7],

    // Sapins le long des bords
    ['nature/Pine_by_Quaternius.glb', -25, 0, -30, 1, 0.6],
    ['nature/Pine_by_Quaternius.glb', 25, 0, -30, 0, 0.6],
    ['nature/Pine_by_Quaternius.glb', -25, 0, 30, 0, 0.6],
    ['nature/Pine_by_Quaternius.glb', 25, 0, 30, 1.2, 0.6],

    // Arbres morts (ambiance post-apo, sur la place)
    ['nature/Dead_Tree_by_Quaternius.glb', -8, 0, -8, 0, 0.8],
    ['nature/Dead_Tree_by_Quaternius.glb', 8, 0, -8, 1, 0.8],
    ['nature/Dead_Tree_by_Quaternius.glb', -8, 0, 8, 2, 0.8],

    // Arbres tordus (côté est)
    ['nature/Twisted_Tree_by_Quaternius.glb', 15, 0, -25, 0.5, 0.7],
    ['nature/Twisted_Tree_by_Quaternius.glb', -15, 0, 25, 1.5, 0.7],

    // Rochers (déco)
    ['nature/Rocks_by_Quaternius.glb', -12, 0, -22, 0, 0.7],
    ['nature/Rocks_by_Quaternius.glb', 12, 0, 22, 1, 0.7],
    ['nature/Rocks_by_Quaternius.glb', 22, 0, -5, 2, 0.6],

    // Fleurs / plantes (déco fine sur la place)
    ['nature/Lis_by_Quaternius.glb', 5, 0, 5, 0, 1],
    ['nature/Lis_by_Quaternius.glb', -5, 0, 5, 0.7, 1],
    ['nature/Lis_by_Quaternius.glb', 5, 0, -5, 1.4, 1],
    ['nature/Plant_Big_by_Quaternius.glb', -3, 0, -15, 0, 0.8],
    ['nature/Plant_by_Quaternius.glb', 3, 0, -15, 0, 1],
  ],

  // --- Props urbains (la place centrale) ---
  props: [
    // Panneau de ville au centre (point de repère)
    ['props/Town_Sign_by_Quaternius.glb', 0, 0, -12, 0, 1],

    // Groupe de barils (côté ouest)
    ['props/Barrel_by_Quaternius.glb', -10, 0, 2, 0, 1],
    ['props/Barrel_by_Quaternius.glb', -10.5, 0, 3, 0, 1],
    ['props/Barrel_by_Quaternius.glb', -9.5, 0, 3.5, 0, 1],

    // Bouche d'incendie (centre)
    ['props/Fire_Hydrant_by_Quaternius.glb', 3, 0, 0, 0, 1],

    // Poubelles
    ['props/Trash_Bags_by_Quaternius.glb', -4, 0, 8, 0, 1],
    ['props/Trash_Bags_by_Quaternius.glb', 4, 0, 8, 1, 1],

    // Cônes de chantier (barrière visuelle)
    ['props/Traffic_Cone_by_Quaternius.glb', -2, 0, 12, 0, 1],
    ['props/Traffic_Cone_by_Quaternius.glb', 0, 0, 12, 0, 1],
    ['props/Traffic_Cone_by_Quaternius.glb', 2, 0, 12, 0, 1],

    // Barrière de chantier
    ['props/Traffic_Barrier_by_Quaternius.glb', 0, 0, 14, 0, 1],

    // Lampadaires (éclairage symbolique de la place)
    ['props/Street_Light_by_Quaternius.glb', -14, 0, -14, Math.PI / 4, 1],
    ['props/Street_Light_by_Quaternius.glb', 14, 0, -14, -Math.PI / 4, 1],
    ['props/Street_Light_by_Quaternius.glb', -14, 0, 14, (3 * Math.PI) / 4, 1],
    ['props/Street_Light_by_Quaternius.glb', 14, 0, 14, -Math.PI / 4, 1],

    // Container rouge (côté est, comme entrepôt)
    ['props/Container_Red_by_Quaternius.glb', 22, 0, -8, Math.PI / 2, 1],

    // Bûche / roues (déco)
    ['props/Wood_Log_by_Quaternius.glb', -12, 0, -5, 0, 1],
    ['props/Wheels_Stack_by_Quaternius.glb', 12, 0, 5, 0, 1],
  ],

  // --- Véhicules (épaves) ---
  vehicles: [
    // Voiture au nord-est (garée devant une maison)
    ['vehicles/Sports_Car_by_Quaternius.glb', 15, 0, -22, Math.PI / 2, 0.5],
    // Voiture blindée au sud-ouest (abandonnée)
    ['vehicles/Sports_Car_Armored_by_Quaternius.glb', -20, 0, 22, -Math.PI / 3, 0.5],
    // Camion blindé au fond (près du port)
    ['vehicles/Truck_Armored_by_Quaternius.glb', -22, 0, -30, Math.PI / 6, 0.5],
  ],
};

// Position de spawn du joueur (sud de la place)
export const SPAWN_POINT = { x: 0, y: 1.7, z: 20 };
