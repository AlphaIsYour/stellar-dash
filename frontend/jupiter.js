const jupiterGeometry = new THREE.SphereGeometry(10, 32, 32);
const jupiterTexture = textureLoader.load(
  "jupiter.jpg",
  () => console.log("Tekstur Jupiter loaded"),
  undefined,
  (error) => console.error("Gagal load tekstur Jupiter:", error)
);
const jupiterMaterial = new THREE.MeshPhongMaterial({ map: jupiterTexture });
const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
jupiter.position.set(35, 0, 0);

function addJupiterToScene(scene) {
  scene.add(jupiter);
}

function animateJupiter() {
  jupiter.rotation.y += 0.001;
}
