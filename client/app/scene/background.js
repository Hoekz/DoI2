import THREE from 'three';
import camera from 'scene/camera';

const STAR_COUNT = 2000;
const randomize = () => { return Math.random() * 500 - 250; };

let geometry = new THREE.Geometry();
for (let i = 0; i < STAR_COUNT; i++) {
  let vert = new THREE.Vector3(
    randomize(),
    randomize(),
    -Math.abs(randomize()) - 70);
  geometry.vertices.push(vert);
  let color = new THREE.Color(0xffffff).setHSL(Math.random(), 1.0, Math.random() + 0.2);
  geometry.colors.push(color);
}

let material = new THREE.PointsMaterial({
  map: new THREE.TextureLoader().load('assets/star.png'),
  blending: THREE.AdditiveBlending,
  transparent: true,
  size: 3,
  vertexColors: THREE.VertexColors
});

const stars = new THREE.Points(geometry, material);

export default class Background {
  stars = stars;
  update() {
    if (this.stars.geometry.boundingSphere !== null && this.stars.geometry.boundingSphere.radius !== 10000000) {
      this.stars.geometry.boundingSphere.radius = 10000000;
    }
    let target = camera.target.position;
    for (let star of this.stars.geometry.vertices) {
      let deltaY = target.y - star.y;
      if (deltaY > 250) {
        star.setY(target.y + 250);
      } else if (deltaY < -250) {
        star.setY(target.y - 250);
      }

      let deltaX = target.x - star.x;
      if (deltaX > 250) {
        star.setX(target.x + 250);
      } else if (deltaX < -250) {
        star.setX(target.x - 250);
      }
    }
    this.stars.geometry.verticesNeedUpdate = true;
  }
}
