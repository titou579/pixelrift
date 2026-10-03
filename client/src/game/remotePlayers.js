import * as THREE from 'three';

export function createRemotePlayersManager(scene) {
  const players = new Map();
  const raycaster = new THREE.Raycaster();

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

  function makeHpBar() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, 128, 16);
    ctx.fillStyle = '#00eaff';
    ctx.fillRect(2, 2, 124, 12);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(1.2, 0.15, 1);
    sprite.userData.canvas = canvas;
    sprite.userData.ctx = ctx;
    sprite.userData.texture = texture;
    return sprite;
  }

  function updateHpBar(sprite, hp) {
    const ctx = sprite.userData.ctx;
    ctx.clearRect(0, 0, 128, 16);
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, 128, 16);
    const ratio = Math.max(0, hp / 100);
    ctx.fillStyle = ratio > 0.5 ? '#00eaff' : ratio > 0.25 ? '#ffd93d' : '#ff2fb9';
    ctx.fillRect(2, 2, 124 * ratio, 12);
    sprite.userData.texture.needsUpdate = true;
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
    const legsMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a4e,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.2,
    });

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.0, 0.4), bodyMat);
    body.position.y = 1.0;
    group.add(body);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), headMat);
    head.position.y = 1.7;
    group.add(head);

    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.5, 0.18), legsMat);
    legL.position.set(-0.15, 0.25, 0);
    group.add(legL);
    const legR = legL.clone();
    legR.position.x = 0.15;
    group.add(legR);

    // Hitbox invisible pour le raycast
    const hitbox = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 1.9, 0.7),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitbox.position.y = 0.95;
    hitbox.userData.playerId = id;
    group.add(hitbox);

    const label = makeLabelSprite(username);
    label.position.y = 2.3;
    group.add(label);

    const hpBar = makeHpBar();
    hpBar.position.y = 2.1;
    group.add(hpBar);

    group.position.set(position.x, position.y - 1.7, position.z);
    group.rotation.y = rotation.yaw;

    scene.add(group);

    players.set(id, {
      group,
      hitbox,
      hpBar,
      targetPos: new THREE.Vector3(position.x, position.y - 1.7, position.z),
      targetYaw: rotation.yaw,
      hp: 100,
      alive: true,
    });
  }

  function update(id, position, rotation) {
    const p = players.get(id);
    if (!p) return;
    p.targetPos.set(position.x, position.y - 1.7, position.z);
    p.targetYaw = rotation.yaw;
  }

  function setHp(id, hp) {
    const p = players.get(id);
    if (!p) return;
    p.hp = hp;
    updateHpBar(p.hpBar, hp);
  }

  function kill(id) {
    const p = players.get(id);
    if (!p) return;
    p.alive = false;
    p.group.visible = false;
  }

  function respawn(id, position) {
    const p = players.get(id);
    if (!p) return;
    p.alive = true;
    p.hp = 100;
    updateHpBar(p.hpBar, 100);
    p.group.visible = true;
    p.group.position.set(position.x, position.y - 1.7, position.z);
    p.targetPos.copy(p.group.position);
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

  function raycast(camera) {
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const meshes = [];
    for (const p of players.values()) {
      if (p.alive && p.group.visible) meshes.push(p.hitbox);
    }
    if (meshes.length === 0) return null;
    const hits = raycaster.intersectObjects(meshes, false);
    if (hits.length === 0) return null;
    return hits[0].object.userData.playerId;
  }

  function tick(dt) {
    const lerp = Math.min(1, dt * 12);
    for (const p of players.values()) {
      if (!p.alive) continue;
      p.group.position.lerp(p.targetPos, lerp);
      let diff = p.targetYaw - p.group.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      p.group.rotation.y += diff * lerp;
    }
  }

  function clear() {
    for (const id of Array.from(players.keys())) remove(id);
  }

  return { add, update, setHp, kill, respawn, remove, raycast, tick, clear };
}
