import * as THREE from 'three';
import { loadModel, cloneModel } from './assetLoader.js';
import { MAP_CONFIG, FLOOR_ZONES } from './mapConfig.js';

export async function buildMapFromModels(scene) {
  const colliders = [];

  // 1. Sol de base (grand, sombre)
  const baseFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(140, 140),
    new THREE.MeshStandardMaterial({ color: 0x0f0f1a, roughness: 0.9 })
  );
  baseFloor.rotation.x = -Math.PI / 2;
  baseFloor.receiveShadow = true;
  scene.add(baseFloor);

  // 2. Zones colorées (eau, jardin, routes, place)
  if (FLOOR_ZONES && FLOOR_ZONES.length > 0) {
    for (const zone of FLOOR_ZONES) {
      const geo = new THREE.PlaneGeometry(zone.w, zone.d);
      const mat = new THREE.MeshStandardMaterial({
        color: zone.color,
        roughness: zone.type === 'water' ? 0.3 : 0.9,
        metalness: zone.type === 'water' ? 0.6 : 0.1,
        transparent: zone.type === 'water',
        opacity: zone.type === 'water' ? 0.85 : 1,
        emissive: zone.type === 'water' ? 0x0a2a4a : 0x000000,
        emissiveIntensity: zone.type === 'water' ? 0.3 : 0,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(zone.x, zone.y || 0.02, zone.z);
      scene.add(mesh);
    }
  }

  // 3. Collecte tous les modèles à charger (sans doublons)
  const allPaths = new Set();
  for (const category of Object.keys(MAP_CONFIG)) {
    for (const entry of MAP_CONFIG[category]) {
      allPaths.add(entry[0]);
    }
  }

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
