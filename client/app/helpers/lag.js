import socket from 'helpers/socket';

function average(data) {
  return data.reduce((sum, value) => { return sum + value; }, 0) / data.length;
}

class Lag {
  constructor() {
    this._offset = 0;
    this.sendPing();
    socket.on('PONG', (pong) => this.handlePong(pong));
    this._offset = 0;
    this.pings = [];
    this.offsets = [];
  }
  sendPing() {
    socket.emit('PING', { time: new Date().getTime() });
  }
  handlePong(pong) {
    let now = new Date().getTime();
    let ping = now - pong.clientSentTime;
    let offset = pong.serverSentTime - (now - (ping / 2));
    this.addPing(ping);
    this.addOffset(offset);
    if (this.pings.length < 50) {
      this.sendPing();
    }
  }
  addOffset(offset) {
    this.offsets.push(offset);
    this.offsets = this.offsets.slice(0, 50);
  }
  addPing(ping) {
    this.pings.push(ping);
    this.pings = this.pings.slice(0, 50);
  }
  get ping() {
    return Math.round(average(this.pings));
  }
  get offset() {
    if (this.offsets.length < 50) {
      return Math.round(average(this.offsets));
    }
    this._offset = this._offset ? this._offset : Math.round(average(this.offsets));
    return this._offset;
  }
}

const LagHelper = new Lag();

export default LagHelper;
