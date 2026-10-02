import * as THREE from 'three';

export function createEngine(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a12);
  scene.fog = new THREE.Fog(0x0a0a12, 30, 90);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  );

  const ambient = new THREE.AmbientLight(0x8b5cf6, 0.55);
  scene.add(ambient);

  const dir = new THREE.DirectionalLight(0x00eaff, 1.1);
  dir.position.set(20, 40, 15);
  scene.add(dir);

  const pink = new THREE.PointLight(0xff2fb9, 1.4, 50);
  pink.position.set(-15, 8, -15);
  scene.add(pink);

  const violet = new THREE.PointLight(0x8b5cf6, 1.2, 50);
  violet.position.set(15, 8, 15);
  scene.add(violet);

  return { renderer, scene, camera };
}
