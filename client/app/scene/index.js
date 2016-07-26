import THREE from 'three';
import Background from './background';
import camera from './camera';
import lighting from './lighting';
import renderer from './renderer';

const background = new Background(camera.cameraObject);
const scene = new THREE.Scene();

scene.add(camera.cameraObject);
scene.add(background.stars);
scene.add(lighting);

export default class Scene {
  constructor() {
    this.scene = scene;
    this.camera = camera;
  }
  update() {
    background.update();
    camera.update();
    renderer.render(scene, camera.cameraObject);
  }
  add(object) {
    scene.add(object);
  }
  remove(object) {
    scene.remove(object);
  }
  set target(target) {
    camera.target = target;
  }
  set Zoom(zoom) {
    camera.zoom = zoom;
  }
}

const SCENE = new Scene();

export default SCENE;
