import THREE from 'three';

let fov = 30;
let aspect = window.innerWidth / window.innerHeight;
let near = 0.1;
let far = 8000;
let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

window.addEventListener('resize', () => {
  camera.aspect	= window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}, false);

let target = new THREE.Object3D();

class Camera {
  constructor() {
    this.offset = new THREE.Vector3(0, -70, 150);
    this.cameraObject = camera;
    this.update();
  }
  set Zoom(zoom) {
    this.offset = new THREE.Vector3(0, -70 * zoom, 150 * zoom);
  }
  update() {
    this.cameraObject.position.addVectors(target.position, this.offset);
  }
  get target() {
    return target;
  }
  set target(t) {
    target = t;
    this.cameraObject.lookAt(target.position);
    this.cameraObject.position.addVectors(target.position, this.offset);
  }
}

const CAMERA = new Camera();
export default CAMERA;
