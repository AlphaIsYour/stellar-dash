const mercuryGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const mercuryTexture = textureLoader.load(
  "mercury.jpg",
  () => console.log("Tekstur Mercury loaded"),
  undefined,
  (error) => console.error("Gagal load tekstur Mercury:", error)
);
const mercuryMaterial = new THREE.MeshPhongMaterial({ map: mercuryTexture });
const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
mercury.position.set(-28, 0, 0);

function addMercuryToScene(scene) {
  scene.add(mercury);
}

function animateMercury() {
  mercury.rotation.y += 0.001;
}
