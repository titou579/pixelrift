import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const loader = new GLTFLoader();
const cache = new Map();
const BASE = import.meta.env.BASE_URL || '/';

/**
 * Charge un modèle .glb depuis /public/
 * @param {string} path - Chemin relatif depuis /public/, ex: 'city/LES_ASSETS/Bench.glb'
 */
export function loadModel(path) {
  if (cache.has(path)) return cache.get(path);

  const url = `${BASE}${path}`.replace(/\/{2,}/g, '/');
  const promise = new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => resolve(gltf.scene),
      undefined,
      (err) => {
        console.error(
          `❌ Échec chargement ${url}\n` +
          `   Vérifie : chemin, casse (majuscules), extension.`,
          err
        );
        reject(err);
      }
    );
  });
  cache.set(path, promise);
  return promise;
}

export function cloneModel(model) {
  return SkeletonUtils.clone(model);
}

export async function preloadModels(paths) {
  const results = await Promise.allSettled(paths.map((p) => loadModel(p)));
  const failed = results.filter((r) => r.status === 'rejected');
  if (failed.length > 0) {
    console.warn(`⚠️ ${failed.length}/${paths.length} modèles ont échoué`);
  }
  return results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
}
