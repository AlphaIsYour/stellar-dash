const uranusGeometry = new THREE.SphereGeometry(3.5, 32, 32);
const uranusTexture = textureLoader.load(
  "uranus.jpg",
  () => console.log("Tekstur uranus loaded"),
  undefined,
  (error) => console.error("Gagal load tekstur Uranus:", error)
);
const uranusMaterial = new THREE.MeshPhongMaterial({ map: uranusTexture });
const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
uranus.position.set(92, 0, 0);

function addUranusToScene(scene) {
  scene.add(uranus);
}

function animateUranus() {
  uranus.rotation.y += 0.001;
}
