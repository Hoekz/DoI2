import keyboard from 'helpers/input';
import Player from './player';
import socket from 'helpers/socket';
import THREE from 'three';

class User extends Player {
  get shipState() {
    return this.ship.state;
  }
  constructor(id, name, ship) {
    super(id, name, ship);
    this.hasCorrected = false;
  }
  handleUpdate(update) {
    this.ship.state = Object.assign({}, this.ship.state, update.ship.state);
    if (update.needsCorrection) {
      this.ship.positionFromState();
      let index = keyboard.inputs.findIndex(input => { return input.seq === update.seq; });
      if (index !== -1) {
        keyboard.inputs.splice(0, index);
        this.hasCorrected = true;
        for (let i = 0, l = keyboard.inputs.length - 1; i < l; ++i) {
          let input = keyboard.inputs[i].input;
          let delta = keyboard.inputs[i].delta;
          if (input.left) this.ship.turnLeft(delta);
          if (input.right) this.ship.turnRight(delta);
          if (input.up) this.ship.thrust(delta);
          this.ship.setPosition(delta);
          this.hasCorrected = true;
        }
      }
    } else {
      // reset state from existing position
      this.ship.stateFromPosition();
    }
  }
  handleInput(delta) {
    let inputSeq = keyboard.getInput(delta);
    if (inputSeq.input.left) this.ship.turnLeft(delta);
    if (inputSeq.input.right) this.ship.turnRight(delta);
    if (inputSeq.input.up) this.ship.thrust(delta);
    this.ship.setPosition(delta);
    socket.emit('inputSeq', {
      input: inputSeq.input,
      seq: inputSeq.seq,
      delta: delta,
      hasCorrected: this.hasCorrected,
      state: this.ship.state
    });
    this.hasCorrected = false;
  }
}

export default User;
