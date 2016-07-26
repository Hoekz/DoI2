var ship = require('./ship.js');

function player(id, name) {
	this.id = id;
	this.name = name;
  this.kills = 0;
  this.deaths = 0;
  this.ship = new ship();
  this.updates = [];
}

player.prototype = {

  ship : new ship(),

  target : null,

  pHistory: [],
  vHistory: [],
  rHistory: [],


  historySize: 4,

  smoothing: 10,

  handleServerUpdate: function(update) {

    var d = new Date();
    var t = d.getTime();


    var p = new THREE.Vector4(update.ship.position.x, update.ship.position.y, 0, t);
    var r = new THREE.Vector4(0, 0, update.ship.rotation, t);

    this.pHistory.push(p);
    this.rHistory.push(r);

    this.ship.velocity.x = update.ship.velocity.x;
    this.ship.velocity.y = update.ship.velocity.y;

    if ( this.pHistory.length > this.historySize ) 
      this.pHistory.shift();

    if ( this.rHistory.length > this.historySize ) 
      this.rHistory.shift();

    if ( update.ship.isExploding ) this.ship.explode();

  },

  prediction: function(delta) {
    var d = new Date();
    var t = d.getTime();

    var position = extrapolate(t, this.pHistory);
    var targetPos = new THREE.Vector3(position.x, position.y, 0);
    this.ship.position.lerp(targetPos, delta * this.smoothing);

    var dir = this.rHistory[this.rHistory.length - 1];
    var targetDir = new THREE.Euler(0, 0, dir.z);

    var ghostDir = new THREE.Quaternion();
    ghostDir.setFromEuler(targetDir);

    var currentDir = new THREE.Quaternion();
    currentDir.setFromEuler(this.ship.rotation);

    currentDir.slerp(ghostDir, delta * this.smoothing);

    this.ship.rotation.setFromQuaternion(currentDir);

    function extrapolate(time, vectors) {
      var xVec = [],
          yVec = [],
          zVec = [];
 
      for (var i = 0; i < vectors.length; i++) {
          var x = new THREE.Vector2(vectors[i].w, vectors[i].x);
          var y = new THREE.Vector2(vectors[i].w, vectors[i].y);
          var z = new THREE.Vector2(vectors[i].w, vectors[i].z);

          xVec.push(x);
          yVec.push(y);
          zVec.push(z);
      }
   
      var newPos = new THREE.Vector3();
      newPos.x = NevillesAlgorithm(t, xVec);
      newPos.y = NevillesAlgorithm(t, yVec);
      newPos.z = NevillesAlgorithm(t, zVec);
   
      return newPos;
    }
     
    function NevillesAlgorithm (time, vector) {
        return P(0, vector.length-1, time, vector);
    }
     
    function P (i, j, x, v) {
        if (j === 0) return v[i].y;
        var ret = 0;
        ret = ((x - v[i].x) * P(i+1, j-1, x, v) + (v[i+j].x - x) * P(i, j-1, x, v)) / (v[i+j].x-v[i].x);

        return ret;
    }
  },

  update: function(delta) {

    // If the player's ship is flagged as dead do nothing
    if (this.ship.isDead) return;
    
    if (this.pHistory.length === this.historySize && !this.ship.isExploding) this.prediction(delta);

    // Regen the ship's hp and energy
    this.ship.regen(delta);

    // Handle Explosion
    if (this.ship.isExploding) {

      //Move Ship based on last velocity
      this.ship.move(delta);

      // Progress Explosion Frames
      this.ship.explosion.update(delta);
      
      // Hide this player's ship when the explosion gets to frame 13 (largest part of animation)
      if( this.ship.explosion.currentTile == 13 ) this.ship.shipModel.visible = false;

      // Remove this player's ship when explosion is over and increase this players death count
      if ( this.ship.explosion.isOver ) { 
        players.removeShip(this.ship);
        this.ship.isDead = true;
        this.deaths++;
      }
    }
  }
};

module.exports = player;

