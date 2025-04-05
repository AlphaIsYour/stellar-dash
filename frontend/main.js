function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.001;
  mars.rotation.y += 0.001;
  venus.rotation.y += 0.001;
  mercury.rotation.y += 0.001;
  jupiter.rotation.y += 0.001;
  sun.rotation.y += 0.001;
  if (planets.has("mars")) animateMars();
  if (planets.has("venus")) animateVenus();
  if (planets.has("mercury")) animateMercury();
  if (planets.has("jupiter")) animateJupiter();
  if (planets.has("sun")) animateSun();
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
