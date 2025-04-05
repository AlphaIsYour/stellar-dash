const sunGeometry = new THREE.SphereGeometry(15, 32, 32);
const sunTexture = textureLoader.load(
  "sun.jpg",
  () => console.log("Tekstur Sun loaded"),
  undefined,
  (error) => console.error("Gagal load tekstur Sun:", error)
);
const sunMaterial = new THREE.MeshPhongMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(-67, 0, 0);

function addSunToScene(scene) {
  scene.add(sun);
}

function animateSun() {
  sun.rotation.y += 0.001;
}
