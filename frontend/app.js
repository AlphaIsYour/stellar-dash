// Ga perlu import, THREE udah global dari CDN

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Tambah OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 10;
controls.maxDistance = 50;

// Tambah cahaya
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Bikin Bumi dengan tekstur
const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load(
  "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
  () => console.log("Tekstur Bumi loaded"),
  undefined,
  (error) => console.error("Gagal load tekstur:", error)
);
const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Fetch satelit
async function fetchSatellites() {
  try {
    console.log("Fetching satellites...");
    const response = await fetch("http://localhost:8080/api/satellites");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const satellites = await response.json();
    console.log("Data satelit:", satellites);
    let infoText = "Satellites:\n";

    satellites.forEach((sat, index) => {
      const satGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      const satMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const satellite = new THREE.Mesh(satGeometry, satMaterial);

      const phi = ((90 - sat.latitude) * Math.PI) / 180;
      const theta = ((sat.longitude + 180) * Math.PI) / 180;
      const radius = 5 + sat.altitude / 100;

      satellite.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
      scene.add(satellite);

      const curve = new THREE.EllipseCurve(
        0,
        0,
        radius,
        radius,
        0,
        2 * Math.PI,
        false,
        0
      );
      const points = curve.getPoints(50);
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);

      infoText += `${sat.name}: Lat ${sat.latitude}, Lon ${sat.longitude}, Alt ${sat.altitude} km\n`;
    });

    document.getElementById("info").innerText = infoText;
  } catch (error) {
    console.error("Gagal fetch data:", error);
    document.getElementById("info").innerText = "Error loading satellite data";
  }
}

fetchSatellites();

camera.position.z = 15;

function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
