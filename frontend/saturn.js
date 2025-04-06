const saturnGeometry = new THREE.SphereGeometry(9, 32, 32); // Radius 9, lebih kecil dari Jupiter
const saturnTexture = textureLoader.load(
  "saturn.jpg",
  () => console.log("Tekstur Saturnus loaded"),
  undefined,
  (error) => console.error("Gagal load tekstur Saturnus:", error)
);
const saturnMaterial = new THREE.MeshPhongMaterial({ map: saturnTexture });
const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
saturn.position.set(67, 0, 0); // Jauh dikit dari Jupiter

// Ring Saturnus
const ringGeometry = new THREE.RingGeometry(12, 18, 64); // Inner radius 12, outer 18
const ringTexture = textureLoader.load(
  "saturn_ring.png", // Nama file tekstur ring yang kamu punya
  () => console.log("Tekstur Ring Saturnus loaded"),
  undefined,
  (error) => console.error("Gagal load tekstur Ring:", error)
);
const ringMaterial = new THREE.MeshPhongMaterial({
  map: ringTexture,
  side: THREE.DoubleSide, // Biar ring keliatan dari atas/bawah
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2; // Putar 90 derajat biar horizontal
saturn.add(ring); // Ring jadi anak Saturnus, ikut posisi

function addSaturnToScene(scene) {
  scene.add(saturn);
}

function animateSaturn() {
  saturn.rotation.y += 0.001; // Rotasi planet + ring bareng
}
