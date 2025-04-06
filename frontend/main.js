function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.001;
  planets.forEach((planet) => {
    planet.rotation.y += 0.001; // Rotasi semua planet di Map
  });
  animateSatellites();
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
