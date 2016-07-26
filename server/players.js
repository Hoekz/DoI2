'use strict';

const Player = require('./player');
const getID = require('node-uuid').v1;

class Players {
  constructor() {
    this.players = [];
  }
  addPlayer(name, shipState) {

    /*
    let temp = [];
    for (let player of this.players) {
      player && temp.push[player];
    }
    this.players = temp;
    */

    let id = getID();
    this.players.push(new Player(id, name, shipState));
    console.log(this.players.length);
    return this.players[this.players.length - 1];
  }
  getPlayer(id) {
    return this.players.find((player) => {
      return player.id === id;
    });
  }
  getIndex(id) {
    return this.players.findIndex((player) => {
      return player.id === id;
    });
  }
  remove(id) {
    let i = this.getIndex(id);
    if (i !== -1) this.players.splice(i, 1);
  }
  forEach(callback) {
    for (let player of this.players) {
      callback(player);
    }
  }
}

const players = new Players();

module.exports = players;
