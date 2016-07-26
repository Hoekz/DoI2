export default class Clock {
  constructor() {
    this._lastTime = performance.now();
  }
  getDelta() {
    let time = performance.now();
    let delta = time - this._lastTime;
    this._lastTime = time;
    return delta / 1000;
  }
  getTime() {
    return performance.now();
  }
}
