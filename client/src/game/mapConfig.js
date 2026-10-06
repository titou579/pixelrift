// ============================================================
// CONFIG DE LA MAP — "Ville post-apo"
// Format: [modele, x, y, z, rotationY?, scale?]
// ============================================================

export const MAP_CONFIG = {
  // --- Bâtiments (les gros repères) ---
  buildings: [
    ['buildings/House_by_Quaternius.glb', -20, 0, -20, Math.PI / 4, 1.2],
    ['buildings/House_by_Quaternius.glb', 22, 0, -15, -Math.PI / 3, 1.2],
    ['buildings/House_by_Quaternius.glb', -18, 0, 22, Math.PI, 1.2],
    ['buildings/Hut_by_Quaternius.glb', 15, 0, 20, -Math.PI / 6, 1.3],
    ['buildings/Hut_by_Quaternius.glb', -25, 0, 5, Math.PI / 2, 1.3],
    ['buildings/Dock_by_Quaternius.glb', 0, 0, -38, 0, 1.5],
    ['buildings/Port_by_Quaternius.glb', 30, 0, -38, 0, 1.2],
    ['buildings/Stone_Wall_by_Quaternius.glb', -5, 0, -10, 0, 1],
    ['buildings/Wooden_Wall_by_Quaternius.glb', 10, 0, 10, Math.PI / 4, 1],
  ],

  // --- Nature (arbres, rochers) ---
  nature: [
    ['nature/Pine_by_Quaternius.glb', 10, 0, -5, 0, 1],
    ['nature/Pine_by_Quaternius.glb', -12, 0, -8, 0.5, 1.1],
    ['nature/Pine_by_Quaternius.glb', -30, 0, -25, 1, 0.9],
    ['nature/Pine_by_Quaternius.glb', 30, 0, 8, 2, 1],
    ['nature/Pine_by_Quaternius.glb', -28, 0, 28, 0, 1.2],

    ['nature/Dead_Tree_by_Quaternius.glb', 5, 0, -25, 0, 1],
    ['nature/Dead_Tree_by_Quaternius.glb', -35, 0, 10, 1, 1.1],
    ['nature/Dead_Tree_by_Quaternius.glb', 25, 0, 30, 2, 1],

    ['nature/Twisted_Tree_by_Quaternius.glb', -5, 0, 30, 0, 1],
    ['nature/Twisted_Tree_by_Quaternius.glb', 35, 0, -5, 1.5, 1],

    ['nature/Rocks_by_Quaternius.glb', 18, 0, -28, 0, 1],
    ['nature/Rocks_by_Quaternius.glb', -15, 0, 15, 1, 0.8],

    ['nature/Lis_by_Quaternius.glb', 3, 0, 3, 0, 1],
    ['nature/Lis_by_Quaternius.glb', -6, 0, 6, 0.7, 1],
    ['nature/Lis_by_Quaternius.glb', 8, 0, -3, 1.4, 1],

    ['nature/Plant_Big_by_Quaternius.glb', 4, 0, -2, 0, 1],
    ['nature/Plant_by_Quaternius.glb', -4, 0, 2, 0, 1],
  ],

  // --- Props urbains ---
  props: [
    ['props/Barrel_by_Quaternius.glb', 8, 0, 5, 0, 1],
    ['props/Barrel_by_Quaternius.glb', 9.5, 0, 5.5, 0, 1],
    ['props/Barrel_by_Quaternius.glb', 8.5, 0, 6.5, 0, 1],
    ['props/Container_Red_by_Quaternius.glb', -8, 0, -12, Math.PI / 4, 1],
    ['props/Fire_Hydrant_by_Quaternius.glb', 2, 0, 2, 0, 1],
    ['props/Trash_Bags_by_Quaternius.glb', -3, 0, 4, 0, 1],
    ['props/Traffic_Cone_by_Quaternius.glb', 0, 0, 10, 0, 1],
    ['props/Traffic_Cone_by_Quaternius.glb', 1, 0, 10.5, 0, 1],
    ['props/Street_Light_by_Quaternius.glb', 12, 0, 0, 0, 1],
    ['props/Street_Light_by_Quaternius.glb', -12, 0, 0, 0, 1],
    ['props/Town_Sign_by_Quaternius.glb', 0, 0, 8, 0, 1],
    ['props/Wood_Log_by_Quaternius.glb', -5, 0, -5, 0, 1],
    ['props/Wheels_Stack_by_Quaternius.glb', 6, 0, -10, 0, 1],
    ['props/Traffic_Barrier_by_Quaternius.glb', -10, 0, -3, 0, 1],
  ],

  // --- Véhicules (épaves) ---
  vehicles: [
    ['vehicles/Sports_Car_by_Quaternius.glb', 15, 0, 3, Math.PI / 3, 1],
    ['vehicles/Sports_Car_Armored_by_Quaternius.glb', -10, 0, 25, -Math.PI / 4, 1],
    ['vehicles/Truck_Armored_by_Quaternius.glb', 25, 0, -8, Math.PI / 2, 1],
  ],
};

// Spawn du joueur (position initiale à chaque respawn)
export const SPAWN_POINT = { x: 0, y: 1.7, z: 15 };// ============================================================
// CONFIG DE LA MAP — "Ville post-apo"
// Format: [modele, x, y, z, rotationY?, scale?]
// ============================================================

export const MAP_CONFIG = {
  // --- Bâtiments (les gros repères) ---
  buildings: [
    ['buildings/House_by_Quaternius.glb', -20, 0, -20, Math.PI / 4, 1.2],
    ['buildings/House_by_Quaternius.glb', 22, 0, -15, -Math.PI / 3, 1.2],
    ['buildings/House_by_Quaternius.glb', -18, 0, 22, Math.PI, 1.2],
    ['buildings/Hut_by_Quaternius.glb', 15, 0, 20, -Math.PI / 6, 1.3],
    ['buildings/Hut_by_Quaternius.glb', -25, 0, 5, Math.PI / 2, 1.3],
    ['buildings/Dock_by_Quaternius.glb', 0, 0, -38, 0, 1.5],
    ['buildings/Port_by_Quaternius.glb', 30, 0, -38, 0, 1.2],
    ['buildings/Stone_Wall_by_Quaternius.glb', -5, 0, -10, 0, 1],
    ['buildings/Wooden_Wall_by_Quaternius.glb', 10, 0, 10, Math.PI / 4, 1],
  ],

  // --- Nature (arbres, rochers) ---
  nature: [
    ['nature/Pine_by_Quaternius.glb', 10, 0, -5, 0, 1],
    ['nature/Pine_by_Quaternius.glb', -12, 0, -8, 0.5, 1.1],
    ['nature/Pine_by_Quaternius.glb', -30, 0, -25, 1, 0.9],
    ['nature/Pine_by_Quaternius.glb', 30, 0, 8, 2, 1],
    ['nature/Pine_by_Quaternius.glb', -28, 0, 28, 0, 1.2],

    ['nature/Dead_Tree_by_Quaternius.glb', 5, 0, -25, 0, 1],
    ['nature/Dead_Tree_by_Quaternius.glb', -35, 0, 10, 1, 1.1],
    ['nature/Dead_Tree_by_Quaternius.glb', 25, 0, 30, 2, 1],

    ['nature/Twisted_Tree_by_Quaternius.glb', -5, 0, 30, 0, 1],
    ['nature/Twisted_Tree_by_Quaternius.glb', 35, 0, -5, 1.5, 1],

    ['nature/Rocks_by_Quaternius.glb', 18, 0, -28, 0, 1],
    ['nature/Rocks_by_Quaternius.glb', -15, 0, 15, 1, 0.8],

    ['nature/Lis_by_Quaternius.glb', 3, 0, 3, 0, 1],
    ['nature/Lis_by_Quaternius.glb', -6, 0, 6, 0.7, 1],
    ['nature/Lis_by_Quaternius.glb', 8, 0, -3, 1.4, 1],

    ['nature/Plant_Big_by_Quaternius.glb', 4, 0, -2, 0, 1],
    ['nature/Plant_by_Quaternius.glb', -4, 0, 2, 0, 1],
  ],

  // --- Props urbains ---
  props: [
    ['props/Barrel_by_Quaternius.glb', 8, 0, 5, 0, 1],
    ['props/Barrel_by_Quaternius.glb', 9.5, 0, 5.5, 0, 1],
    ['props/Barrel_by_Quaternius.glb', 8.5, 0, 6.5, 0, 1],
    ['props/Container_Red_by_Quaternius.glb', -8, 0, -12, Math.PI / 4, 1],
    ['props/Fire_Hydrant_by_Quaternius.glb', 2, 0, 2, 0, 1],
    ['props/Trash_Bags_by_Quaternius.glb', -3, 0, 4, 0, 1],
    ['props/Traffic_Cone_by_Quaternius.glb', 0, 0, 10, 0, 1],
    ['props/Traffic_Cone_by_Quaternius.glb', 1, 0, 10.5, 0, 1],
    ['props/Street_Light_by_Quaternius.glb', 12, 0, 0, 0, 1],
    ['props/Street_Light_by_Quaternius.glb', -12, 0, 0, 0, 1],
    ['props/Town_Sign_by_Quaternius.glb', 0, 0, 8, 0, 1],
    ['props/Wood_Log_by_Quaternius.glb', -5, 0, -5, 0, 1],
    ['props/Wheels_Stack_by_Quaternius.glb', 6, 0, -10, 0, 1],
    ['props/Traffic_Barrier_by_Quaternius.glb', -10, 0, -3, 0, 1],
  ],

  // --- Véhicules (épaves) ---
  vehicles: [
    ['vehicles/Sports_Car_by_Quaternius.glb', 15, 0, 3, Math.PI / 3, 1],
    ['vehicles/Sports_Car_Armored_by_Quaternius.glb', -10, 0, 25, -Math.PI / 4, 1],
    ['vehicles/Truck_Armored_by_Quaternius.glb', 25, 0, -8, Math.PI / 2, 1],
  ],
};

// Spawn du joueur (position initiale à chaque respawn)
export const SPAWN_POINT = { x: 0, y: 1.7, z: 15 };// ============================================================
// CONFIG DE LA MAP — "Ville post-apo"
// Format: [modele, x, y, z, rotationY?, scale?]
// ============================================================

export const MAP_CONFIG = {
  // --- Bâtiments (les gros repères) ---
  buildings: [
    ['buildings/House_by_Quaternius.glb', -20, 0, -20, Math.PI / 4, 1.2],
    ['buildings/House_by_Quaternius.glb', 22, 0, -15, -Math.PI / 3, 1.2],
    ['buildings/House_by_Quaternius.glb', -18, 0, 22, Math.PI, 1.2],
    ['buildings/Hut_by_Quaternius.glb', 15, 0, 20, -Math.PI / 6, 1.3],
    ['buildings/Hut_by_Quaternius.glb', -25, 0, 5, Math.PI / 2, 1.3],
    ['buildings/Dock_by_Quaternius.glb', 0, 0, -38, 0, 1.5],
    ['buildings/Port_by_Quaternius.glb', 30, 0, -38, 0, 1.2],
    ['buildings/Stone_Wall_by_Quaternius.glb', -5, 0, -10, 0, 1],
    ['buildings/Wooden_Wall_by_Quaternius.glb', 10, 0, 10, Math.PI / 4, 1],
  ],

  // --- Nature (arbres, rochers) ---
  nature: [
    ['nature/Pine_by_Quaternius.glb', 10, 0, -5, 0, 1],
    ['nature/Pine_by_Quaternius.glb', -12, 0, -8, 0.5, 1.1],
    ['nature/Pine_by_Quaternius.glb', -30, 0, -25, 1, 0.9],
    ['nature/Pine_by_Quaternius.glb', 30, 0, 8, 2, 1],
    ['nature/Pine_by_Quaternius.glb', -28, 0, 28, 0, 1.2],

    ['nature/Dead_Tree_by_Quaternius.glb', 5, 0, -25, 0, 1],
    ['nature/Dead_Tree_by_Quaternius.glb', -35, 0, 10, 1, 1.1],
    ['nature/Dead_Tree_by_Quaternius.glb', 25, 0, 30, 2, 1],

    ['nature/Twisted_Tree_by_Quaternius.glb', -5, 0, 30, 0, 1],
    ['nature/Twisted_Tree_by_Quaternius.glb', 35, 0, -5, 1.5, 1],

    ['nature/Rocks_by_Quaternius.glb', 18, 0, -28, 0, 1],
    ['nature/Rocks_by_Quaternius.glb', -15, 0, 15, 1, 0.8],

    ['nature/Lis_by_Quaternius.glb', 3, 0, 3, 0, 1],
    ['nature/Lis_by_Quaternius.glb', -6, 0, 6, 0.7, 1],
    ['nature/Lis_by_Quaternius.glb', 8, 0, -3, 1.4, 1],

    ['nature/Plant_Big_by_Quaternius.glb', 4, 0, -2, 0, 1],
    ['nature/Plant_by_Quaternius.glb', -4, 0, 2, 0, 1],
  ],

  // --- Props urbains ---
  props: [
    ['props/Barrel_by_Quaternius.glb', 8, 0, 5, 0, 1],
    ['props/Barrel_by_Quaternius.glb', 9.5, 0, 5.5, 0, 1],
    ['props/Barrel_by_Quaternius.glb', 8.5, 0, 6.5, 0, 1],
    ['props/Container_Red_by_Quaternius.glb', -8, 0, -12, Math.PI / 4, 1],
    ['props/Fire_Hydrant_by_Quaternius.glb', 2, 0, 2, 0, 1],
    ['props/Trash_Bags_by_Quaternius.glb', -3, 0, 4, 0, 1],
    ['props/Traffic_Cone_by_Quaternius.glb', 0, 0, 10, 0, 1],
    ['props/Traffic_Cone_by_Quaternius.glb', 1, 0, 10.5, 0, 1],
    ['props/Street_Light_by_Quaternius.glb', 12, 0, 0, 0, 1],
    ['props/Street_Light_by_Quaternius.glb', -12, 0, 0, 0, 1],
    ['props/Town_Sign_by_Quaternius.glb', 0, 0, 8, 0, 1],
    ['props/Wood_Log_by_Quaternius.glb', -5, 0, -5, 0, 1],
    ['props/Wheels_Stack_by_Quaternius.glb', 6, 0, -10, 0, 1],
    ['props/Traffic_Barrier_by_Quaternius.glb', -10, 0, -3, 0, 1],
  ],

  // --- Véhicules (épaves) ---
  vehicles: [
    ['vehicles/Sports_Car_by_Quaternius.glb', 15, 0, 3, Math.PI / 3, 1],
    ['vehicles/Sports_Car_Armored_by_Quaternius.glb', -10, 0, 25, -Math.PI / 4, 1],
    ['vehicles/Truck_Armored_by_Quaternius.glb', 25, 0, -8, Math.PI / 2, 1],
  ],
};

// Spawn du joueur (position initiale à chaque respawn)
export const SPAWN_POINT = { x: 0, y: 1.7, z: 15 };
