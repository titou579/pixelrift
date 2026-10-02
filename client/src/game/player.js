import * as THREE from 'three';

export function createPlayer(camera, canvas, colliders) {
  const PLAYER_HEIGHT = 1.7;
  const PLAYER_RADIUS = 0.4;
  const SPEED = 6;
  const SPRINT = 9.5;
  const GRAVITY = 22;
  const JUMP_VELOCITY = 8;

  const state = {
    position: new THREE.Vector3(0, PLAYER_HEIGHT, 15),
    velocity: new THREE.Vector3(),
    yaw: 0,
    pitch: 0,
    onGround: false,
    sprinting: false,
  };

  const keys = {};

  canvas.addEventListener('click', () => {
    if (document.pointerLockElement !== canvas) {
      canvas.requestPointerLock();
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement !== canvas) return;
    state.yaw -= e.movementX * 0.002;
    state.pitch -= e.movementY * 0.002;
    state.pitch = Math.max(
      -Math.PI / 2 + 0.01,
      Math.min(Math.PI / 2 - 0.01, state.pitch)
    );
  });

  const onKeyDown = (e) => { keys[e.code] = true; };
  const onKeyUp = (e) => { keys[e.code] = false; };
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  function pointInBoxXZ(p, box, r) {
    return (
      p.x > box.min.x - r && p.x < box.max.x + r &&
      p.z > box.min.z - r && p.z < box.max.z + r
    );
  }

  function collidesXZ(p, r) {
    const feet = p.y - PLAYER_HEIGHT + 0.1;
    const head = p.y - 0.1;
    for (const box of colliders) {
      if (head < box.min.y || feet > box.max.y) continue;
      if (pointInBoxXZ(p, box, r)) return true;
    }
    return false;
  }

  function update(dt) {
    const forward =
      (keys['KeyW'] || keys['KeyZ'] ? 1 : 0) - (keys['KeyS'] ? 1 : 0);
    const right =
      (keys['KeyD'] ? 1 : 0) - (keys['KeyA'] || keys['KeyQ'] ? 1 : 0);

    state.sprinting = !!(keys['ShiftLeft'] || keys['ShiftRight']);
    const speed = state.sprinting ? SPRINT : SPEED;

    const sin = Math.sin(state.yaw);
    const cos = Math.cos(state.yaw);
    state.velocity.x = (right * cos - forward * sin) * speed;
    state.velocity.z = (-right * sin - forward * cos) * speed;

    if (keys['Space'] && state.onGround) {
      state.velocity.y = JUMP_VELOCITY;
      state.onGround = false;
    }

    state.velocity.y -= GRAVITY * dt;

    // Collision horizontale (X puis Z séparément)
    const tryX = state.position.clone();
    tryX.x += state.velocity.x * dt;
    if (!collidesXZ(tryX, PLAYER_RADIUS)) state.position.x = tryX.x;

    const tryZ = state.position.clone();
    tryZ.z += state.velocity.z * dt;
    if (!collidesXZ(tryZ, PLAYER_RADIUS)) state.position.z = tryZ.z;

    // Vertical
    state.position.y += state.velocity.y * dt;

    // Sol
    if (state.position.y <= PLAYER_HEIGHT) {
      state.position.y = PLAYER_HEIGHT;
      state.velocity.y = 0;
      state.onGround = true;
    }

    // Atterrir sur les caisses
    for (const box of colliders) {
      if (!pointInBoxXZ(state.position, box, PLAYER_RADIUS)) continue;
      const top = box.max.y;
      const feet = state.position.y - PLAYER_HEIGHT;
      if (feet <= top + 0.05 && feet >= top - 1.2 && state.velocity.y <= 0) {
        state.position.y = top + PLAYER_HEIGHT;
        state.velocity.y = 0;
        state.onGround = true;
      }
    }

    // Caméra
    camera.position.copy(state.position);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = state.yaw;
    camera.rotation.x = state.pitch;
  }

  function dispose() {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
  }

  return { state, update, dispose };
}
