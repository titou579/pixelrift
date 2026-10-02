import * as THREE from 'three';

export function createWeapon(scene, camera) {
  const gunGroup = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x2a2a3e,
    metalness: 0.7,
    roughness: 0.3,
  });
  const accentMat = new THREE.MeshBasicMaterial({ color: 0x00eaff });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.5), bodyMat);
  body.position.set(0, 0, -0.3);
  gunGroup.add(body);

  const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.4), accentMat);
  barrel.position.set(0, 0, -0.6);
  gunGroup.add(barrel);

  gunGroup.position.set(0.25, -0.2, -0.4);
  camera.add(gunGroup);
  scene.add(camera);

  const flash = new THREE.PointLight(0x00eaff, 0, 10);
  flash.position.set(0.25, -0.1, -1.0);
  camera.add(flash);

  const raycaster = new THREE.Raycaster();
  let score = 0;

  const hitCallbacks = [];

  function shoot(targets) {
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const hits = raycaster.intersectObjects(targets, false);

    flash.intensity = 5;
    setTimeout(() => { flash.intensity = 0; }, 60);

    if (hits.length > 0) {
      const target = hits[0].object;
      target.position.set(
        (Math.random() - 0.5) * 60,
        1.5 + Math.random() * 3,
        (Math.random() - 0.5) * 60
      );
      score++;
      hitCallbacks.forEach((cb) => cb(score));
    }
  }

  return {
    shoot,
    getScore: () => score,
    onHit: (cb) => hitCallbacks.push(cb),
  };
}

export function createTargets(scene) {
  const targets = [];
  const geo = new THREE.IcosahedronGeometry(0.7, 0);

  for (let i = 0; i < 8; i++) {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xff2fb9,
      emissive: 0xff2fb9,
      emissiveIntensity: 0.6,
    });
    const m = new THREE.Mesh(geo, mat);
    m.position.set(
      (Math.random() - 0.5) * 60,
      1.5 + Math.random() * 3,
      (Math.random() - 0.5) * 60
    );
    m.userData.spinSpeed = 0.5 + Math.random();
    scene.add(m);
    targets.push(m);
  }

  return targets;
}
