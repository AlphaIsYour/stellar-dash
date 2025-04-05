const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// TextureLoader global
const textureLoader = new THREE.TextureLoader();

// Bumi langsung di scene.js
const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
const earthTexture = textureLoader.load(
  "earth.jpg",
  () => console.log("Tekstur Bumi loaded"),
  undefined,
  (error) => console.error("Gagal load tekstur Bumi:", error)
);
const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

const planets = new Map();

// Tambah planet ke scene
function addPlanet(planetName) {
  if (planets.has(planetName)) return;

  switch (planetName) {
    case "mars":
      addMarsToScene(scene);
      planets.set(planetName, mars);
      break;
    case "venus":
      addVenusToScene(scene);
      planets.set(planetName, venus);
      break;
    case "mercury":
      addMercuryToScene(scene);
      planets.set(planetName, mercury);
      break;
    case "jupiter":
      addJupiterToScene(scene);
      planets.set(planetName, jupiter);
      break;
    case "sun":
      addSunToScene(scene);
      planets.set(planetName, sun);
      break;
  }
}

function removePlanet(planetName) {
  const planet = planets.get(planetName);
  if (planet) {
    scene.remove(planet);
    planets.delete(planetName);
  }
}

// Dropdown logic
const planetToggle = document.getElementById("planet-dropdown-toggle");
const planetDropdown = document.getElementById("planet-dropdown");
planetToggle.addEventListener("click", () => {
  planetDropdown.classList.toggle("hidden");
});

document.querySelectorAll(".planet-option").forEach((option) => {
  option.addEventListener("click", () => {
    const planetName = option.dataset.planet;
    if (!planets.has(planetName)) {
      addPlanet(planetName);
      option.classList.add("planet-selected");
      const removeBtn = document.createElement("span");
      removeBtn.innerText = " ×";
      removeBtn.classList.add("text-red-500", "cursor-pointer", "ml-1");
      removeBtn.onclick = (e) => {
        e.stopPropagation();
        removePlanet(planetName);
        option.classList.remove("planet-selected");
        removeBtn.remove();
      };
      option.appendChild(removeBtn);
    }
  });
});

camera.position.z = 20;
