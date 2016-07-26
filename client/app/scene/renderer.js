import Detector from 'helpers/detector.js';
import THREE from 'three';
import { FullScreen } from 'THREEx';
FullScreen.bindKey({ charCode: 'm'.charCodeAt(0) });

const Renderer = Detector.webgl
  ? new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
  : new THREE.CanvasRenderer();
Renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
Renderer.setSize(window.innerWidth, window.innerHeight);
Renderer.shadowMap.enabled = true;

window.addEventListener('resize', () => {
  Renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

document.getElementById('game').appendChild(Renderer.domElement);

export default Renderer;
