// ============================================================
// CONFIG DE LA MAP — "Ville post-apo"
// ============================================================
// Format: [modele, x, y, z, rotationY?, scale?]
//   - modele   : chemin relatif dans /public (sans le /models/)
//   - x, y, z  : position dans l'arène (y = hauteur, 0 = sol)
//   - rotationY: rotation en radians (optionnel, défaut 0)
//   - scale    : multiplicateur de taille (optionnel, défaut 1)
// ============================================================

export const MAP_CONFIG = {
  // --- Bâtiments principaux (les gros repères) ---
  buildings: [
    // Maisons autour de la map
    ['buildings/House by Quaternius - L7h0SjZX2K.glb', -20, 0, -20, Math.PI / 4, 1.2],
    ['buildings/House by Quaternius - L7h0SjZX2K.glb', 22, 0, -15, -Math.PI / 3, 1.2],
    ['buildings/House by Quaternius - L7h0SjZX2K.glb', -18, 0, 22, Math.PI, 1.2],
    ['buildings/Hut by Quaternius - 4MWby0dw.glb', 15, 0, 20, -Math.PI / 6, 1.3],
    ['buildings/Hut by Quaternius - 4MWby0dw.glb', -25, 0, 5, Math.PI / 2, 1.3],

    // Docks / Port au fond
    ['buildings/Dock by Quaternius - XViK6hH2UN.glb', 0, 0, -38, 0, 1.5],
    ['buildings/Port by Quaternius - 4sE6mhKPF.glb', 30, 0, -38, 0, 1.2],
  ],

  // --- Arbres (répartis dans toute la map) ---
  nature: [
    // Sapins
    ['nature/Pine by Quaternius - 699sFuCN2.glb', 10, 0, -5, 0, 1],
    ['nature/Pine by Quaternius - Zt6ZgzcKXZ.glb', -12, 0, -8, 0.5, 1.1],
    ['nature/Pine by Quaternius - iqSuQcP8cz.glb', -30, 0, -25, 1, 0.9],
    ['nature/Pine by Quaternius - 699sFuCN2.glb', 30, 0, 8, 2, 1],
    ['nature/Pine by Quaternius - Zt6ZgzcKXZ.glb', -28, 0, 28, 0, 1.2],

    // Arbres morts (post-apo)
    ['nature/Dead Tree by Quaternius - CD4ecbP5Gm.glb', 5, 0, -25, 0, 1],
    ['nature/Dead Tree by Quaternius - CD4ecbP5Gm.glb', -35, 0, 10, 1, 1.1],
    ['nature/Dead Tree by Quaternius - CD4ecbP5Gm.glb', 25, 0, 30, 2, 1],

    // Arbres tordus
    ['nature/Twisted Tree by Quaternius - 7PDbpfKQr.glb', -5, 0, 30, 0, 1],
    ['nature/Twisted Tree by Quaternius - 8roK9m0Xg.glb', 35, 0, -5, 1.5, 1],

    // Rochers
    ['nature/Rocks by Quaternius - OQv8PlZ40.glb', 18, 0, -28, 0, 1],
    ['nature/Rocks by Quaternius - OQv8PlZ40.glb', -15, 0, 15, 1, 0.8],
  ],

  // --- Props urbains (détails au sol) ---
  props: [
    ['props/Barrel by Quaternius - Mr4lfFnPAY.glb', 8, 0, 5, 0, 1],
    ['props/Barrel by Quaternius - Mr4lfFnPAY.glb', 9.5, 0, 5.5, 0, 1],
    ['props/Barrel by Quaternius - Mr4lfFnPAY.glb', 8.5, 0, 6.5, 0, 1],
    ['props/Container Red by Quaternius - vzcCNJB6zn.glb', -8, 0, -12, Math.PI / 4, 1],
    ['props/Fire Hydrant by Quaternius - DKxM0bEkp.glb', 2, 0, 2, 0, 1],
    ['props/Trash Bags by Quaternius - eNn414Rr1.glb', -3, 0, 4, 0, 1],
    ['props/Traffic Cone by Quaternius - aDlUbMbW3.glb', 0, 0, 10, 0, 1],
    ['props/Traffic Cone by Quaternius - aDlUbMbW3.glb', 1, 0, 10.5, 0, 1],
    ['props/Street Light by Quaternius - Obx8D1UJ.glb', 12, 0, 0, 0, 1],
    ['props/Street Light by Quaternius - Obx8D1UJ.glb', -12, 0, 0, 0, 1],
    ['props/Town Sign by Quaternius - V5Zubp6ru3.glb', 0, 0, 8, 0, 1],
    ['props/Wood Log by Quaternius - L4E3zWceC.glb', -5, 0, -5, 0, 1],
    ['props/Wheels Stack by Quaternius - o1MjkMUPN.glb', 6, 0, -10, 0, 1],
  ],

  // --- Véhicules (épaves) ---
  vehicles: [
    ['vehicles/Sports Car by Quaternius - Ggj7Q4DXdr.glb', 15, 0, 3, Math.PI / 3, 1],
    ['vehicles/Sports Car Armored by Quaternius - bG0hEKdhx.glb', -10, 0, 25, -Math.PI / 4, 1],
    ['vehicles/Truck Armored by Quaternius - VxW0nmcCN5.glb', 25, 0, -8, Math.PI / 2, 1],
  ],
};

// Spawn du joueur (position initiale à chaque respawn)
export const SPAWN_POINT = { x: 0, y: 1.7, z: 15 };
