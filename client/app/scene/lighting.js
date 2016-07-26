// Player lighting setup
import THREE from 'three';

// Create some lights and position them
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.5);
hemiLight.color.setHSL(0.6, 1, 0.6);
hemiLight.groundColor.setHSL(0.095, 1, 0.75);
hemiLight.position.set(500, 500, 0);

// Add the lights to a container object
const Lighting = new THREE.Object3D();
Lighting.add(hemiLight);

export default Lighting;
