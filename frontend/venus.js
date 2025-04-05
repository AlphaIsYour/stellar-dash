const venusGeometry = new THREE.SphereGeometry(3, 32, 32);
const venusTexture = textureLoader.load(
  "venus.jpg",
  () => console.log("Tekstur Venus loaded"),
  undefined,
  (error) => console.error("Gagal load tekstur Venus:", error)
);
const venusMaterial = new THREE.MeshPhongMaterial({ map: venusTexture });
const venus = new THREE.Mesh(venusGeometry, venusMaterial);
venus.position.set(-20, 0, 0);

function addVenusToScene(scene) {
  scene.add(venus);
}

function animateVenus() {
  venus.rotation.y += 0.001;
}
