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

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 10;
controls.maxDistance = 50;

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Tambah bintang
function addStars() {
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 1000;
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 2000; // x
    positions[i + 1] = (Math.random() - 0.5) * 2000; // y
    positions[i + 2] = (Math.random() - 0.5) * 2000; // z
  }

  starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8,
  });
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  // Animasi kedip
  function animateStars() {
    starMaterial.opacity = 0.8 + Math.sin(Date.now() * 0.001) * 0.2;
    requestAnimationFrame(animateStars);
  }
  animateStars();
}

addStars();

camera.position.z = 15;
