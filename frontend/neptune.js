const neptuneGeometry = new THREE.SphereGeometry(3, 32, 32);
const neptuneTexture = textureLoader.load(
  "neptune.jpg",
  () => console.log("Tekstur Neptune loaded"),
  undefined,
  (error) => console.error("Gagal load tekstur Neptune:", error)
);
const neptuneMaterial = new THREE.MeshPhongMaterial({ map: neptuneTexture });
const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
neptune.position.set(100, 0, 0);

function addNeptuneToScene(scene) {
  scene.add(neptune);
}

function animateNeptune() {
  neptune.rotation.y += 0.001;
}
