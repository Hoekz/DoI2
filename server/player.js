'use strict';
const Ship = require('./ship');
const Clock = require('./clock');

class Player {
  constructor(id, name, shipState) {
    this.id = id;
    this.name = name;
    this.ship = new Ship(shipState);
    this.clock = new Clock();
    this.needsCorrection = false;
    this.hasSentUpdate = false;
    this.updates = [];
    this.update = {
      input: {
        up: false,
        left: false,
        right: false
      },
      state: {
        pos: [0, 0]
      },
      seq: 0
    };
    this.input = {
      up: false,
      down: false,
      left: false,
      right: false,
      space: false
    };
  }
  get toEmit() {
    return {
      name: this.name,
      id: this.id,
      needsCorrection: this.needsCorrection,
      seq: this.currentSeq,
      ship: {
        state: this.ship.state,
        stats: this.ship.stats
      }
    };
  }
  handleUpdate(update) {
    this.updates.push(update);
  }
  updatePosition(delta) {
    console.log(delta);
    if (this.updates.length > 5) {
      let update = this.updates.shift();
      if (update.input.up) this.ship.thrust(delta);
      if (update.input.left) this.ship.turnLeft(delta);
      if (update.input.right) this.ship.turnRight(delta);
      this.ship.updatePosition(delta);
      this.currentSeq = update.seq;

      if (update.hasCorrected) { this.needsCorrection = false; }

      if (!this.needsCorrection) {
        let clientX = update.state.pos[0];
        let clientY = update.state.pos[1];
        let serverX = this.ship.state.pos[0];
        let serverY = this.ship.state.pos[1];

        let deltaX = clientX - serverX;
        let deltaY = clientY - serverY;
        let deltaSqr = Math.abs(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        this.needsCorrection = deltaSqr > 0.3;
      }
    }
  }
}

module.exports = Player;
