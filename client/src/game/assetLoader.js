import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const cache = new Map();

/**
 * Charge un modèle .glb
 * @param {string} path - Chemin relatif dans /public, ex: 'models/buildings/House.glb'
 * @returns {Promise<THREE.Group>} - Le groupe Three.js prêt à cloner
 */
export function loadModel(path) {
  if (cache.has(path)) {
    return Promise.resolve(cache.get(path));
  }
  return new Promise((resolve, reject) => {
    loader.load(
      `/${path}`,
      (gltf) => {
        cache.set(path, gltf.scene);
        resolve(gltf.scene);
      },
      undefined,
      (err) => {
        console.error(`❌ Échec chargement ${path}:`, err);
        reject(err);
      }
    );
  });
}

/**
 * Clone un modèle chargé (pour placer plusieurs instances)
 * Clone récursivement les meshes pour que chaque instance soit indépendante
 */
export function cloneModel(model) {
  const clone = model.clone(true);
  clone.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return clone;
}

/**
 * Précharge une liste de modèles en parallèle
 */
export async function preloadModels(paths) {
  const results = await Promise.allSettled(paths.map((p) => loadModel(p)));
  const failed = results.filter((r) => r.status === 'rejected');
  if (failed.length > 0) {
    console.warn(`⚠️ ${failed.length}/${paths.length} modèles ont échoué`);
  }
  return results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
}
