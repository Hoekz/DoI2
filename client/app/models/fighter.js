import THREE from 'three';

const getLighting = () => {
  let key = new THREE.DirectionalLight(0xffffff, 0.3);
  key.position.set(-2, -2, 3);
  key.position.multiplyScalar(30);
  key.castShadow = true;
  key.shadow.camera.left = -5;
  key.shadow.camera.right = 5;
  key.shadow.camera.top = 5;
  key.shadow.camera.bottom = -5;
  return key;
};

export default () => {
  let fighter = new THREE.Object3D();
  fighter.add(getLighting());
  let loader = new THREE.JSONLoader();
  loader.load('/assets/ship/ship.js', (geometry, materials) => {
    let material = new THREE.MultiMaterial(materials);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    fighter.add(mesh);
  });
  return fighter;
};
