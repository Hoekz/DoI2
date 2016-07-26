const keysDown = [];
const keysUp = [];
const ALIAS	= {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  space: 32,
  pageup: 33,
  pagedown: 34,
  tab: 9
};
const checkAlias = (key) => {
  return typeof ALIAS[key] !== 'undefined' ? ALIAS[key] : key;
};
const keyUp = (event) => {
  let keyCode = event.keyCode;
  keysDown[keyCode] = false;
  keysUp[keyCode] = true;
};
const keyDown = (event) => {
  let keyCode = event.keyCode;
  keysDown[keyCode] = true;
  keysUp[keyCode] = false;
};


class Keyboard {
  constructor() {
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    this._seq = 0;
    this.inputs = [];
  }
  keyDown(key) {
    let _key = checkAlias(key);
    return keysDown[_key];
  }
  keyUp(key) {
    let _key = checkAlias(key);
    if (keysUp[_key]) {
      keysUp[_key] = false;
      return true;
    }
    return false;
  }
  // Shortcuts
  getInput(delta) {
    this._seq += 1;
    let input = {
      seq: this._seq,
      delta: delta,
      input: {
        up: this.up || false,
        left: this.left || false,
        right: this.right || false,
        space: this.space || false
      }
    };
    this.inputs.push(input);
    return this.inputs[this.inputs.length - 1];
  }
  get up() { return this.keyDown('up'); }
  get left() { return this.keyDown('left'); }
  get right() { return this.keyDown('right'); }
  get down() { return this.keyDown('down'); }
  get space() { return this.keyDown('space'); }
  get tab() { return this.keyUp('tab'); }
}

const keyboard = new Keyboard();

export default keyboard;
