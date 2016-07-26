import THREE from 'three';
import Fighter from 'models/fighter';
import SCENE from 'scene';
import extrap from 'helpers/extrap';

const SMOOTHING = 10;

// import Explosion from 'effects/explosion';
export default class Ship {
  constructor(initState = {}) {
    this.sceneObject = Fighter();
    SCENE.add(this.sceneObject);
    this.state = Object.assign({}, this.state, initState);
    this.velocity = new THREE.Vector3();
    this.correction = false;
    this.history = {
      x: [[0, 0]],
      y: [[0, 0]],
      dir: 0
    };
  }
  state = {
    health: 300,
    energy: 72,
    isDead: false,
    pos: [0, 0, 0],
    vel: [0, 0, 0],
    accel: [0, 0, 0],
    angPos: [0, 0, 0],
    angVel: [0, 0, 0],
    angAccel: [0, 0, 0],
    isExploding: false
  }
  stats = {
    maxHealth: 300,
    maxEnergy: 72,
    regen: 10,
    hitBoxRadius: 2.75,
    accelRate: 35,
    angAccelRate: 35,
    maxVel: 40,
    turnRate: 220,
  }
  remove() {
    SCENE.remove(this.sceneObject);
  }
  explode() {
    this.isExploding = true;
    // this.explosion = new Explosion();
    // this.sceneObject.add(this.exposion);
  }
  thrust(delta) {
    let velocity = this.velocity;
    let rotation = this.sceneObject.rotation.z;
    let accelX = this.stats.accelRate * -Math.sin(rotation);
    let accelY = this.stats.accelRate * Math.cos(rotation);
    let accel = new THREE.Vector3(accelX, accelY, 0);
    velocity.addScaledVector(accel, delta);
    if (velocity.lengthSq() > Math.pow(this.stats.maxVel, 2)) {
      velocity.setLength(this.stats.maxVel);
    }
  }
  turnLeft(delta) {
    let turn = parseFloat((delta * Math.PI / 180 * this.stats.turnRate).toFixed(4));
    this.sceneObject.rotateOnAxis(new THREE.Vector3(0, 0, 1), turn);
  }
  turnRight(delta) {
    let turn = parseFloat((delta * Math.PI / 180 * this.stats.turnRate).toFixed(4));
    this.sceneObject.rotateOnAxis(new THREE.Vector3(0, 0, -1), turn);
  }
  positionFromState() {
    this.sceneObject.position.x = this.state.pos[0];
    this.sceneObject.position.y = this.state.pos[1];
    this.sceneObject.rotation.z = this.state.angPos[2];
    this.velocity.x = this.state.vel[0];
    this.velocity.y = this.state.vel[1];
  }
  stateFromPosition() {
    this.state.pos[0] = this.sceneObject.position.x;
    this.state.pos[1] = this.sceneObject.position.y;
    this.state.angPos[2] = this.sceneObject.rotation.z;
    this.state.vel = this.velocity.toArray();
  }
  updateFromServer(state, time) {
    this.history.pos.x.push([time, state.pos[0]]);
    if (this.history.pos.x.length > 4) {
      this.history.pos.x.shift();
    }
    this.history.pos.y.push([time, state.pos[1]]);
    if (this.history.pos.y.length > 4) {
      this.history.pos.y.shift();
    }
    this.history.dir = state.angPos[2];
    this.state = Object.assign({}, this.state, state);
  }
  extrapPosition(delta, time) {
    let x = extrap(time, this.history.x);
    let y = extrap(time, this.history.y);
    let targetPos = new THREE.Vector3(x, y, 0);

    let lastPos = new THREE.Vector3(this.sceneObject.position.x, this.sceneObject.position.y, 0);
    lastPos.lerp(targetPos, delta * SMOOTHING);
    this.sceneObject.position.x = lastPos.x;
    this.sceneObject.position.y = lastPos.y;

    let targetDir = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, this.history.dir));
    let currentDir = new THREE.Quaternion().setFromEuler(this.sceneObject.rotation);
    currentDir.slerp(targetDir, delta * SMOOTHING);
    this.sceneObject.rotation.setFromQuaternion(currentDir);

  }
  setPosition(delta) {
    if (this.correction) {
      this.sceneObject.position.lerp(this.correction, delta * SMOOTHING);
    }
    this.sceneObject.position.addScaledVector(this.velocity, delta);
    this.stateFromPosition();
  }
}
