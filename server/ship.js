'use strict';
const THREE = require('three');

class Ship {
  constructor(initState) {
    this.state = Object.assign({}, {
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
    }, initState);
    this.stats = {
      maxHealth: 300,
      maxEnergy: 72,
      regen: 10,
      hitBoxRadius: 2.75,
      accelRate: 35,
      angAccelRate: 35,
      maxVel: 40,
      turnRate: 220,
    };
    this.velocity = new THREE.Vector3();
    this.sceneObject = new THREE.Object3D();
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
  updatePosition(delta) {
    this.sceneObject.position.addScaledVector(this.velocity, delta);
    this.state.pos[0] = this.sceneObject.position.x;
    this.state.pos[1] = this.sceneObject.position.y;
    this.state.angPos[2] = this.sceneObject.rotation.z;
    this.state.vel = this.velocity.toArray();
  }
}

module.exports = Ship;
