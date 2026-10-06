import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const cache = new Map();

/**
 * Charge un modèle .glb depuis /public/models/
 * @param {string} path - Chemin relatif SANS "models/", ex: 'buildings/House.glb'
 * @returns {Promise<THREE.Group>}
 */
export function loadModel(path) {
  if (cache.has(path)) {
    return Promise.resolve(cache.get(path));
  }
  return new Promise((resolve, reject) => {
    loader.load(
      `/models/${path}`,
      (gltf) => {
        // Optimisation : désactive les ombres sur les gros objets pour la perf
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
            // Figé pour économiser du CPU
            child.matrixAutoUpdate = false;
          }
        });
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
 */
export function cloneModel(model) {
  const clone = model.clone(true);
  clone.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = false;
      child.receiveShadow = false;
      child.matrixAutoUpdate = false;
    }
  });
  clone.updateMatrixWorld(true);
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
