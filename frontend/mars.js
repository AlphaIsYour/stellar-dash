const marsGeometry = new THREE.SphereGeometry(2.5, 32, 32);
const marsTexture = textureLoader.load(
  "mars.jpg",
  () => console.log("Tekstur Mars loaded"),
  undefined,
  (error) => console.error("Gagal load tekstur Mars:", error)
);
const marsMaterial = new THREE.MeshPhongMaterial({ map: marsTexture });
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
mars.position.set(20, 0, 0);

function addMarsToScene(scene) {
  scene.add(mars);
}

function animateMars() {
  mars.rotation.y += 0.001;
}
