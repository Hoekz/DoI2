export default class Detector {
  static webgl () {
    try {
      let canvas = document.createElement('canvas');
      return !! window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  }
}
