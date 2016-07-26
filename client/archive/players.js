var player = require('./player.js');
var User = require('./user.js');

var players = {

    players: [],

    ships: new THREE.Object3D(),

    lookup: function(id) {
      var playerIndex = this.players.map(function(x) {return x.id; }).indexOf(id);
      return this.players[playerIndex];
    },

    removePlayer: function(id) {    
      var playerIndex = this.players.map(function(x) {return x.id; }).indexOf(id);
      this.ships.remove(this.players[playerIndex].ship);
      mm.blips.remove(this.players[playerIndex].ship.blip);
      this.players.splice(playerIndex, 1);
    },

    addPlayer: function(id, name) {
      var playerIndex = this.players.push(new player(id, name));
      var newPlayer = this.players[playerIndex - 1];
      this.addShip(newPlayer.ship);
      return newPlayer;
    },

    addUser: function(id,name) {
      var playerIndex = this.players.push(new User(id, name));
      var newPlayer = this.players[playerIndex - 1];
      this.addShip(newPlayer.ship);
      return newPlayer;
    },

    removeShip: function(ship) {
      this.ships.remove(ship);
      mm.blips.remove(ship.blip);
    },

    addShip: function(ship) {
      this.ships.add(ship);
      mm.blips.add(ship.blip);
      ship.reset();
    },

    nextPlayer: function(player) {
      var i = this.players.indexOf(player);
      if(i >= 0 && i < this.players.length - 1)
        return this.players[i + 1];
      else
        return this.players[0];
    }
};

module.exports = players;

  
