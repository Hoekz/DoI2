import Player from 'characters/player';
import User from 'characters/user';

const players = [];

class Players {
  addPlayer(id, name, ship) {
    players.push(new Player(id, name, ship));
    return players[players.length - 1];
  }
  addUser(id, name, ship) {
    this.user = new User(id, name, ship);
    return this.user;
  }
  getPlayer(id) {
    return players.find((player) => {
      return player.id === id;
    });
  }
  getIndex(id) {
    return players.findIndex((player) => {
      return player.id === id;
    });
  }
  remove(id) {
    let i = this.getIndex(id);
    if (i) {
      players[i].ship.remove();
      players.splice(i, 1);
    }
  }
  forEach(callback) {
    for (let player of players) {
      callback(player);
    }
  }
}

const _players = new Players();

export default _players;
