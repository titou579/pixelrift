// ============================================================
// MAP CONFIG — City Props (J-Toastie) — Route urbaine
// Format: [chemin, x, y, z, rotY, scale, opts]
// ============================================================

export const FLOOR_ZONES = [
  { x: 0, z: 0, w: 90, d: 8, color: 0x2a2a3e, y: 0.02, type: 'road' },
  { x: 0, z: -7, w: 90, d: 6, color: 0x555555, y: 0.03, type: 'road' },
  { x: 0, z: 7, w: 90, d: 6, color: 0x555555, y: 0.03, type: 'road' },
  { x: 0, z: -14, w: 90, d: 8, color: 0x2e5a2e, y: 0.01, type: 'road' },
  { x: 0, z: 14, w: 90, d: 8, color: 0x2e5a2e, y: 0.01, type: 'road' },
  { x: -30, z: 0, w: 8, d: 30, color: 0x2a2a3e, y: 0.025, type: 'road' },
  { x: 30, z: 0, w: 8, d: 30, color: 0x2a2a3e, y: 0.025, type: 'road' },
];

export const MAP_CONFIG = {
  props: [
    // LAMPADAIRES
    ['city/Street_Light.glb', -36, 0, -10, 0, 1],
    ['city/Street_Light.glb', -24, 0, -10, 0, 1],
    ['city/Street_Light.glb', -12, 0, -10, 0, 1],
    ['city/Street_Light.glb', 0, 0, -10, 0, 1],
    ['city/Street_Light.glb', 12, 0, -10, 0, 1],
    ['city/Street_Light.glb', 24, 0, -10, 0, 1],
    ['city/Street_Light.glb', 36, 0, -10, 0, 1],
    ['city/Street_Light.glb', -36, 0, 10, Math.PI, 1],
    ['city/Street_Light.glb', -24, 0, 10, Math.PI, 1],
    ['city/Street_Light.glb', -12, 0, 10, Math.PI, 1],
    ['city/Street_Light.glb', 0, 0, 10, Math.PI, 1],
    ['city/Street_Light.glb', 12, 0, 10, Math.PI, 1],
    ['city/Street_Light.glb', 24, 0, 10, Math.PI, 1],
    ['city/Street_Light.glb', 36, 0, 10, Math.PI, 1],

    // FEUX TRICOLORES
    ['city/Traffic_Light.glb', -34, 0, -8, 0, 1],
    ['city/Traffic_Light.glb', 34, 0, -8, 0, 1],
    ['city/Traffic_Light.glb', -34, 0, 8, Math.PI, 1],
    ['city/Traffic_Light.glb', 34, 0, 8, Math.PI, 1],

    // PANNEAUX STOP
    ['city/Stop_Sign.glb', -26, 0, -8, 0, 1],
    ['city/Stop_Sign.glb', 26, 0, 8, Math.PI, 1],

    // BANCS
    ['city/Bench.glb', -30, 0, -6.5, 0, 1],
    ['city/Bench.glb', -15, 0, -6.5, 0, 1],
    ['city/Bench.glb', 0, 0, -6.5, 0, 1],
    ['city/Bench.glb', 15, 0, -6.5, 0, 1],
    ['city/Bench.glb', 30, 0, -6.5, 0, 1],
    ['city/Bench.glb', -30, 0, 6.5, Math.PI, 1],
    ['city/Bench.glb', -15, 0, 6.5, Math.PI, 1],
    ['city/Bench.glb', 0, 0, 6.5, Math.PI, 1],
    ['city/Bench.glb', 15, 0, 6.5, Math.PI, 1],
    ['city/Bench.glb', 30, 0, 6.5, Math.PI, 1],

    // BORNES
    ['city/Bollard.glb', -22, 0, -4.5, 0, 1],
    ['city/Bollard.glb', -18, 0, -4.5, 0, 1],
    ['city/Bollard.glb', 18, 0, -4.5, 0, 1],
    ['city/Bollard.glb', 22, 0, -4.5, 0, 1],
    ['city/Bollard.glb', -22, 0, 4.5, 0, 1],
    ['city/Bollard.glb', -18, 0, 4.5, 0, 1],
    ['city/Bollard.glb', 18, 0, 4.5, 0, 1],
    ['city/Bollard.glb', 22, 0, 4.5, 0, 1],

    // RATELIERS À VÉLOS
    ['city/Bike_Rack.glb', -40, 0, -6.5, 0, 1],
    ['city/Bike_Rack.glb', 40, 0, 6.5, Math.PI, 1],

    // BOUCHES D'INCENDIE
    ['city/Fire_Hydrant.glb', -10, 0, -4.8, 0, 1],
    ['city/Fire_Hydrant.glb', 10, 0, 4.8, Math.PI, 1],
    ['city/Fire_Hydrant.glb', -32, 0, -4.8, 0, 1],
    ['city/Fire_Hydrant.glb', 32, 0, 4.8, Math.PI, 1],

    // POUBELLES
    ['city/Trash_Can.glb', -25, 0, -6, 0, 1],
    ['city/Trash_Can.glb', 5, 0, -6, 0, 1],
    ['city/Trash_Can.glb', 25, 0, 6, 0, 1],
    ['city/Trash_Can.glb', -5, 0, 6, 0, 1],
    ['city/Trash_Bag.glb', -24, 0, -5.8, 0, 1],
    ['city/Trash_Bag.glb', -23.5, 0, -6.2, 0, 1],
    ['city/Trash_Bag.glb', 24, 0, 5.8, 0, 1],
    ['city/Trash_Bag.glb', 23.5, 0, 6.2, 0, 1],
    ['city/Floor_Trash.glb', -40, 0, -6, 0, 1],
    ['city/Floor_Trash.glb', 40, 0, 6, 0, 1],

    // CÔNES DE CHANTIER
    ['city/Traffic_Cone.glb', -20, 0, -2, 0, 1],
    ['city/Traffic_Cone.glb', -16, 0, -2, 0, 1],
    ['city/Traffic_Cone.glb', -12, 0, -2, 0, 1],
    ['city/Traffic_Cone.glb', 12, 0, 2, 0, 1],
    ['city/Traffic_Cone.glb', 16, 0, 2, 0, 1],
    ['city/Traffic_Cone.glb', 20, 0, 2, 0, 1],

    // BARRIÈRES BÉTON
    ['city/Concrete_Barrier.glb', -18, 0, -1, 0, 1],
    ['city/Concrete_Barrier.glb', 18, 0, 1, 0, 1],

    // CARTONS
    ['city/Box_Pile.glb', 42, 0, -8, 0, 1],
    ['city/Box_Pile.glb', -42, 0, 8, 0, 1],

    // BOUCHES D'ÉGOUT
    ['city/Manhole.glb', -5, 0, 0, 0, 1],
    ['city/Manhole.glb', 8, 0, 0, 0, 1],
    ['city/Manhole.glb', -25, 0, 0, 0, 1],
    ['city/Manhole.glb', 28, 0, 0, 0, 1],
  ],

  nature: [
    // ARBRES NORD
    ['city/Tree.glb', -40, 0, -14, 0, 1],
    ['city/Tree.glb', -28, 0, -14, 0, 1],
    ['city/Tree.glb', -16, 0, -14, 0, 1],
    ['city/Tree.glb', -4, 0, -14, 0, 1],
    ['city/Tree.glb', 8, 0, -14, 0, 1],
    ['city/Tree.glb', 20, 0, -14, 0, 1],
    ['city/Tree.glb', 32, 0, -14, 0, 1],
    ['city/Tree.glb', 44, 0, -14, 0, 1],

    // ARBRES SUD
    ['city/Tree_Long.glb', -40, 0, 14, 0, 1],
    ['city/Tree_Long.glb', -28, 0, 14, 0, 1],
    ['city/Tree_Long.glb', -16, 0, 14, 0, 1],
    ['city/Tree_Long.glb', -4, 0, 14, 0, 1],
    ['city/Tree_Long.glb', 8, 0, 14, 0, 1],
    ['city/Tree_Long.glb', 20, 0, 14, 0, 1],
    ['city/Tree_Long.glb', 32, 0, 14, 0, 1],
    ['city/Tree_Long.glb', 44, 0, 14, 0, 1],

    // BUISSONS
    ['city/Long_Bush.glb', -46, 0, -14, 0, 1],
    ['city/Long_Bush.glb', 46, 0, -14, 0, 1],
    ['city/Long_Bush.glb', -46, 0, 14, 0, 1],
    ['city/Long_Bush.glb', 46, 0, 14, 0, 1],
    ['city/Small_Bush.glb', -34, 0, -16, 0, 1],
    ['city/Small_Bush.glb', -10, 0, -16, 0, 1],
    ['city/Small_Bush.glb', 14, 0, -16, 0, 1],
    ['city/Small_Bush.glb', 38, 0, -16, 0, 1],
    ['city/Small_Bush.glb', -34, 0, 16, 0, 1],
    ['city/Small_Bush.glb', -10, 0, 16, 0, 1],
    ['city/Small_Bush.glb', 14, 0, 16, 0, 1],
    ['city/Small_Bush.glb', 38, 0, 16, 0, 1],

    // FEUILLES MORTES
    ['city/Fallen_Leaves.glb', -30, 0, -13, 0, 1],
    ['city/Fallen_Leaves.glb', -10, 0, -13, 0, 1],
    ['city/Fallen_Leaves.glb', 10, 0, -13, 0, 1],
    ['city/Fallen_Leaves.glb', 30, 0, -13, 0, 1],
  ],
};

export const EXTRA_PROPS = [];

export const SPAWN_POINT = { x: -45, y: 1.7, z: 0 };
