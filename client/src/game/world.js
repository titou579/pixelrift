import * as THREE from 'three';

export function buildWorld(scene) {
  const colliders = [];

  // Sol
  const floorGeo = new THREE.PlaneGeometry(80, 80);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x12121e, roughness: 0.9 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Grille néon
  const grid = new THREE.GridHelper(80, 40, 0x8b5cf6, 0x2a2a3e);
  grid.position.y = 0.01;
  scene.add(grid);

  // Murs
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    emissive: 0x2a1a4e,
    emissiveIntensity: 0.3,
  });
  const walls = [
    { pos: [0, 3, -40], size: [80, 6, 1] },
    { pos: [0, 3, 40], size: [80, 6, 1] },
    { pos: [-40, 3, 0], size: [1, 6, 80] },
    { pos: [40, 3, 0], size: [1, 6, 80] },
  ];
  for (const w of walls) {
    const geo = new THREE.BoxGeometry(w.size[0], w.size[1], w.size[2]);
    const mesh = new THREE.Mesh(geo, wallMat);
    mesh.position.set(w.pos[0], w.pos[1], w.pos[2]);
    scene.add(mesh);
    colliders.push(new THREE.Box3().setFromObject(mesh));
  }

  // Caisses / plateformes
  const boxMat = new THREE.MeshStandardMaterial({
    color: 0x2a2a4e,
    emissive: 0x8b5cf6,
    emissiveIntensity: 0.2,
  });
  const boxDefs = [
    [10, 1, -10, 3, 2, 3],
    [-12, 0.75, 8, 2.5, 1.5, 2.5],
    [5, 1.5, 15, 4, 3, 2],
    [-8, 2, -18, 3, 4, 3],
    [20, 0.5, 20, 5, 1, 5],
    [-20, 1, -5, 2, 2, 6],
    [0, 0.5, -25, 8, 1, 3],
  ];
  for (const [x, y, z, w, h, d] of boxDefs) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, boxMat);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    colliders.push(new THREE.Box3().setFromObject(mesh));
  }

  // Piliers néon aux coins
  const pillarMat = new THREE.MeshBasicMaterial({ color: 0xff2fb9 });
  const pillarPositions = [
    [-30, -30], [30, -30], [-30, 30], [30, 30],
  ];
  for (const [x, z] of pillarPositions) {
    const geo = new THREE.CylinderGeometry(0.3, 0.3, 12, 8);
    const mesh = new THREE.Mesh(geo, pillarMat);
    mesh.position.set(x, 6, z);
    scene.add(mesh);
    colliders.push(new THREE.Box3().setFromObject(mesh));
  }

  return { colliders };
}
