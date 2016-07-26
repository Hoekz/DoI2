var ship = require('./ship.js');

function User(id, name) {
	this.id = id;
	this.name = name;
	this.kills = 0;
	this.deaths = 0;
	this.ship = new ship();
	this.inputs = [];
	this.seq = 0;
  this.currentSeq = 0;
}


User.prototype = {

  ship : new ship(),

  target : null,

  setTarget : function(target) {

    // If a target is already selected untarget it
    if (this.target !== null) this.target.ship.toggleTargeted();

    // Set the new target
    this.target = target;
    this.target.ship.toggleTargeted();

  },

  unsetTarget : function() {
    this.target.ship.toggleTargeted();
    this.target = null;
  },

  nextTarget : function() {

    var target;
    
    // If no target is selected, target the next player after this player (the user)
    if ( this.target === null ) {

      target = players.nextPlayer(this);

      // If the next player was also this player, then select no target
      if (target === this) return; 
    }

    // If a target is selected, target the next player after the current target
    else {
      target = players.nextPlayer(this.target); 

      // If the next player was also this player, then select no new target and deselect the current target
      if (target === this) {
        this.unsetTarget();
        return;
      }
    }

    // Set the target if everything above gets through
    this.setTarget(target);

  },

  handleServerUpdate: function(update) {

    // Accept Server Position Information
    this.ship.position.x = update.ship.position.x;
    this.ship.position.y = update.ship.position.y;
    this.ship.rotation.z = update.ship.rotation;
    this.ship.velocity.x = update.ship.velocity.x;
    this.ship.velocity.y = update.ship.velocity.y;
    this.ship.health = update.ship.health;
    this.ship.energy = update.ship.energy;

    if ( update.ship.isExploding ) this.ship.explode();
    
    var lastSeqIndex = -1;

    // Find and store the input index that the update from the server is associated with
    for(var i = 0, l = this.inputs.length; i < l; ++i) {
      if ( this.inputs[i].seq == update.seq ) {
        lastSeqIndex = i;
        break;
      }
    }

    // Assuming we found a matching input seq from the server, dump everything before it
    if(lastSeqIndex != -1) {
      var numberToClear = Math.abs(lastSeqIndex + 1);
      this.inputs.splice(0, numberToClear);
    }

    // For each remaining input reprocess positioning except last
    for(i = 0, l = this.inputs.length; i<l; i++) {
      var input = this.inputs[i].input;
      var delta = this.inputs[i].delta;
      if (input.up) this.ship.accelerate(delta);
      if (input.left) this.ship.turnLeft(delta);
      if (input.right) this.ship.turnRight(delta);
      this.ship.move(delta);
      if (this.currentSeq === this.inputs[i].seq ) {
        var o = this.seq - this.currentSeq;
        console.log("found: " + o);
        break;
      }
    }


  },

  executeInput : function(input, delta) {
    this.currentSeq += 1;
    if (input.up) this.ship.accelerate(delta);
    if (input.left) this.ship.turnLeft(delta);
    if (input.right) this.ship.turnRight(delta);
    if (!input.left && !input.right ) this.ship.resetBankAngle(delta);
    if (input.tab) this.nextTarget();
  },

  handleInput : function(input, delta) {

  	// set input sequence
  	this.seq += 1;

    // create input object for storing and emiting
    var newInput = {
    	input: input,
    	delta: delta,
    	seq:  this.seq
    };

    // store input
    this.inputs.push(newInput);

    var self = this;
    // handle input locally
    setTimeout(function() {
      self.executeInput(input, delta);
      
    }, ( 2 * latency.ping ) + 20);


    // return for use in main app flow (send to server)...
    return newInput;

  },

  update: function(delta) {

    // If the player's ship is flagged as dead do nothing
    if (this.ship.isDead) return;

    // If the player's ship has a target, and the target's ship is dead, reset this players target to null
    if (this.target && this.target.ship.isDead) this.target = null;

    // Regen the ship's hp and energy
    this.ship.regen(delta);

    // Move the ship
    this.ship.move(delta);

    // Handle Explosion
    if (this.ship.isExploding) {

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

module.exports = User;

