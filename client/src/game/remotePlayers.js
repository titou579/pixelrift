import * as THREE from 'three';

export function createRemotePlayersManager(scene) {
  const players = new Map(); // id -> { mesh, label, targetPos, targetRot }

  function makeLabelSprite(username) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(10,10,18,0.85)';
    ctx.fillRect(0, 0, 256, 64);
    ctx.strokeStyle = '#00eaff';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, 256, 64);
    ctx.fillStyle = '#e8e8f0';
    ctx.font = 'bold 32px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(username, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(1.8, 0.45, 1);
    return sprite;
  }

  function add(id, username, position, rotation) {
    if (players.has(id)) return;

    const group = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.4,
    });
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x00eaff,
      emissive: 0x00eaff,
      emissiveIntensity: 0.5,
    });

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 1.0, 0.4),
      bodyMat
    );
    body.position.y = 1.0;
    group.add(body);

    const head = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.4, 0.4),
      headMat
    );
    head.position.y = 1.7;
    group.add(head);

    const legsMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a4e,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.2,
    });
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.5, 0.18), legsMat);
    legL.position.set(-0.15, 0.25, 0);
    group.add(legL);
    const legR = legL.clone();
    legR.position.x = 0.15;
    group.add(legR);

    const label = makeLabelSprite(username);
    label.position.y = 2.2;
    group.add(label);

    group.position.set(position.x, position.y - 1.7, position.z);
    group.rotation.y = rotation.yaw;

    scene.add(group);

    players.set(id, {
      group,
      targetPos: new THREE.Vector3(
        position.x,
        position.y - 1.7,
        position.z
      ),
      targetYaw: rotation.yaw,
    });
  }

  function update(id, position, rotation) {
    const p = players.get(id);
    if (!p) return;
    p.targetPos.set(position.x, position.y - 1.7, position.z);
    p.targetYaw = rotation.yaw;
  }

  function remove(id) {
    const p = players.get(id);
    if (!p) return;
    scene.remove(p.group);
    p.group.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (obj.material.map) obj.material.map.dispose();
        obj.material.dispose();
      }
    });
    players.delete(id);
  }

  function tick(dt) {
    const lerp = Math.min(1, dt * 12);
    for (const p of players.values()) {
      p.group.position.lerp(p.targetPos, lerp);
      // Interpolation angulaire
      let diff = p.targetYaw - p.group.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      p.group.rotation.y += diff * lerp;
    }
  }

  function clear() {
    for (const id of Array.from(players.keys())) remove(id);
  }

  return { add, update, remove, tick, clear, players };
}
