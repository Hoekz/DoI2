'use strict';

const now = require('performance-now');

module.exports = class Clock {
  constructor() {
    this._lastTime = now();
  }
  getDelta() {
    let time = now();
    let delta = time - this._lastTime;
    this._lastTime = time;
    return delta / 1000;
  }
  getTime() {
    return now();
  }
};
