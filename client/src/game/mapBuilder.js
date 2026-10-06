import * as THREE from 'three';
import { loadModel, cloneModel } from './assetLoader.js';
import { MAP_CONFIG } from './mapConfig.js';

/**
 * Construit la map complète à partir de MAP_CONFIG.
 * @returns {Promise<{ colliders: THREE.Box3[] }>}
 */
export async function buildMapFromModels(scene) {
  const colliders = [];

  // 1. Sol (damier sombre pour le moment)
  const floorGeo = new THREE.PlaneGeometry(100, 100);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    roughness: 0.85,
    metalness: 0.1,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Grille néon subtile par-dessus
  const grid = new THREE.GridHelper(100, 50, 0x8b5cf6, 0x2a2a3e);
  grid.position.y = 0.01;
  grid.material.opacity = 0.3;
  grid.material.transparent = true;
  scene.add(grid);

  // 2. Collecte TOUS les modèles à charger (sans doublons)
  const allPaths = new Set();
  for (const category of Object.keys(MAP_CONFIG)) {
    for (const entry of MAP_CONFIG[category]) {
      allPaths.add(entry[0]);
    }
  }

  // 3. Préchargement en parallèle
  console.log(`📦 Chargement de ${allPaths.size} modèles...`);
  const loadPromises = Array.from(allPaths).map((p) => loadModel(p));
  await Promise.allSettled(loadPromises);
  console.log('✅ Tous les modèles sont chargés');

  // 4. Placement de chaque instance
  for (const category of Object.keys(MAP_CONFIG)) {
    for (const entry of MAP_CONFIG[category]) {
      const [path, x, y, z, rotY = 0, scale = 1] = entry;

      try {
        const model = await loadModel(path);
        const clone = cloneModel(model);
        clone.position.set(x, y, z);
        clone.rotation.y = rotY;
        clone.scale.setScalar(scale);
        scene.add(clone);

        // Créer un collider (Box3) pour chaque objet
        const box = new THREE.Box3().setFromObject(clone);
        colliders.push(box);
      } catch (e) {
        console.warn(`⚠️ Impossible de placer ${path}:`, e.message);
      }
    }
  }

  console.log(`🗺️  Map construite : ${colliders.length} colliders`);

  return { colliders };
}
