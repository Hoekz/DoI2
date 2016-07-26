function Laser(position, rotation, velocity, owner, timeTraveled) {

	THREE.Object3D.call(this);
  	this.sprite = new THREE.Sprite(this.spriteMaterial);
  	this.add(this.sprite);

  	this.owner = owner;

  	this.timeTraveled = timeTraveled;

  	// Copy ship rotation and then randomize slightly based on set accuracy
  	this.rotation.z = rotation;

	// Copy ship velocity then add new velocity based on rotation and set speed
	this.velocity = new THREE.Vector3();
	this.velocity.x = velocity.x;
	this.velocity.y = velocity.y;

	// Position a little above game plane and directly in front of ship
	this.position.x = position.x;
	this.position.y = position.y;
	this.position.z = 0.2;

	// Sound
	this.startSound = new THREE.Sound3D("assets/laser.mp3", 220, 0.05, false);
	this.add(this.startSound);
	this.startSound.play();

}

Laser.prototype = new THREE.Object3D();
Laser.prototype.constructor = Laser;

Laser.prototype.stats = {
	speed : 40,
	range : 1,
	accuracy : 0,
	dmg : 10
};

Laser.prototype.spriteMaterial = new THREE.SpriteMaterial({ 
	map: THREE.ImageUtils.loadTexture( "assets/particle.png" ), 
	transparent: true,
	blending: THREE.AdditiveBlending,
	color: 0xff0000,
	fog: true 
});

Laser.prototype.move = function(delta) {
	this.position.x += delta * this.velocity.x;
	this.position.y += delta * this.velocity.y;
	this.timeTraveled += delta * 1;
};

Laser.prototype.testCollision = function() {
	for ( var i = 0, l = players.ships.children.length; i < l; i++ ) {
		var ship = players.ships.children[i];
		var d = this.position.distanceTo(ship.position);
		if ( d < ship.stats.hitBoxRadius ) {
			return true;
		}
	}
};

module.exports = Laser;
