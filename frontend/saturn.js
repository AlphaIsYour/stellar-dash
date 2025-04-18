const saturnGeometry = new THREE.SphereGeometry(9, 32, 32);
const saturnTexture = textureLoader.load(
  "saturn.jpg",
  () => console.log("Tekstur Saturnus loaded"),
  undefined,
  (error) => console.error("Gagal load tekstur Saturnus:", error)
);
const saturnMaterial = new THREE.MeshPhongMaterial({ map: saturnTexture });
const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
saturn.position.set(67, 0, 0);

const ringGeometry = new THREE.RingGeometry(12, 18, 64);
const ringTexture = textureLoader.load(
  "saturn_ring.png",
  () => console.log("Tekstur Ring Saturnus loaded"),
  undefined,
  (error) => console.error("Gagal load tekstur Ring:", error)
);
const ringMaterial = new THREE.MeshPhongMaterial({
  map: ringTexture,
  side: THREE.DoubleSide,
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2;
saturn.add(ring);

function addSaturnToScene(scene) {
  scene.add(saturn);
}

function animateSaturn() {
  saturn.rotation.y += 0.001;
}
