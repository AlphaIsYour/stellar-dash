function showToast(title, content) {
  Toastify({
    text: `${title}\n${content}`,
    duration: 3000,
    gravity: "top",
    position: "right",
    style: {
      background: "linear-gradient(to right, #ff3333, #cc0000)",
      borderRadius: "5px",
      boxShadow: "0 0 10px rgba(255, 0, 0, 0.5)",
    },
  }).showToast();
}

let allSatellites = [];

function addSatelliteToUI(sat, satelliteObj) {
  const satelliteListDiv = document.getElementById("satellite-list");
  const item = document.createElement("div");
  item.className =
    "p-2 my-1 bg-white/10 rounded hover:bg-white/20 hover:shadow-lg hover:shadow-red-500/50 cursor-pointer transition-all satellite-item";
  item.innerText = `${sat.name}: Alt ${sat.altitude} km`;
  item.onclick = () => {
    showPopup(sat, satelliteObj);
  };
  satelliteListDiv.appendChild(item);

  tippy(item, {
    content: `Lat: ${sat.latitude}, Lon: ${sat.longitude}`,
    placement: "right",
    theme: "space",
    animation: "shift-away",
  });

  allSatellites.push({ sat, satelliteObj, element: item });
}

function filterSatellites() {
  const searchQuery = document.getElementById("search-bar").value.toLowerCase();
  const altitudeFilter = document.getElementById("altitude-filter").value;

  allSatellites.forEach(({ sat, satelliteObj, element }) => {
    const matchesSearch = sat.name.toLowerCase().includes(searchQuery);
    let matchesAltitude = true;

    if (altitudeFilter === "low") matchesAltitude = sat.altitude < 500;
    else if (altitudeFilter === "mid")
      matchesAltitude = sat.altitude >= 500 && sat.altitude <= 1000;
    else if (altitudeFilter === "high") matchesAltitude = sat.altitude > 1000;

    const isVisible = matchesSearch && matchesAltitude;
    element.style.display = isVisible ? "block" : "none";
    satelliteObj.visible = isVisible;
  });
}

function showPopup(sat, satelliteObj) {
  const popup = document.getElementById("satellite-popup");
  const title = document.getElementById("popup-title");
  const info = document.getElementById("popup-info");

  title.innerText = sat.name;
  info.innerHTML = `
    Latitude: ${sat.latitude.toFixed(2)}°<br>
    Longitude: ${sat.longitude.toFixed(2)}°<br>
    Altitude: ${sat.altitude} km
  `;
  popup.classList.remove("hidden");

  camera.position.set(
    satelliteObj.position.x,
    satelliteObj.position.y,
    satelliteObj.position.z + 10
  );
  controls.target.copy(satelliteObj.position);
  map.setView([sat.latitude, sat.longitude], 5);
}

function exportData() {
  const visibleSatellites = allSatellites
    .filter(({ element }) => element.style.display !== "none")
    .map(({ sat }) => ({
      name: sat.name,
      latitude: sat.latitude,
      longitude: sat.longitude,
      altitude: sat.altitude,
    }));

  const jsonData = JSON.stringify(visibleSatellites, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "satellites.json";
  a.click();
  URL.revokeObjectURL(url);

  showToast("Export Success", "Data downloaded as satellites.json");
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(satellitesList);
  if (intersects.length > 0) {
    const sat = intersects[0].object.userData;
    showPopup(sat, intersects[0].object);
  }
}

window.addEventListener("click", onMouseClick);

function applyTheme(theme) {
  const body = document.body;
  const elements = document.querySelectorAll(
    "#header, #sidebar, #stats, #map-container, #satellite-popup"
  );

  body.className = "transition-colors duration-500";
  elements.forEach((el) => {
    el.classList.remove(
      "bg-gray-900/80",
      "bg-blue-900/80",
      "bg-purple-900/80",
      "bg-orange-900/80",
      "text-white",
      "text-gray-900"
    );
  });
  document.querySelectorAll(".satellite-item").forEach((el) => {
    el.classList.remove(
      "bg-white/10",
      "hover:bg-white/20",
      "hover:shadow-red-500/50",
      "bg-blue-900/10",
      "hover:bg-blue-900/20",
      "hover:shadow-blue-500/50",
      "bg-purple-900/10",
      "hover:bg-purple-900/20",
      "hover:shadow-purple-500/50",
      "bg-orange-900/10",
      "hover:bg-orange-900/20",
      "hover:shadow-orange-500/50"
    );
  });

  if (theme === "dark") {
    body.classList.add("bg-gradient-to-b", "from-gray-900", "to-indigo-900");
    elements.forEach((el) => el.classList.add("bg-gray-900/80", "text-white"));
    document
      .querySelectorAll(".satellite-item")
      .forEach((el) =>
        el.classList.add(
          "bg-white/10",
          "hover:bg-white/20",
          "hover:shadow-red-500/50"
        )
      );
  } else if (theme === "space-blue") {
    body.classList.add("bg-gradient-to-b", "from-blue-900", "to-blue-500");
    elements.forEach((el) => el.classList.add("bg-blue-900/80", "text-white"));
    document
      .querySelectorAll(".satellite-item")
      .forEach((el) =>
        el.classList.add(
          "bg-blue-900/10",
          "hover:bg-blue-900/20",
          "hover:shadow-blue-500/50"
        )
      );
  } else if (theme === "nebula-purple") {
    body.classList.add("bg-gradient-to-b", "from-purple-900", "to-purple-500");
    elements.forEach((el) =>
      el.classList.add("bg-purple-900/80", "text-white")
    );
    document
      .querySelectorAll(".satellite-item")
      .forEach((el) =>
        el.classList.add(
          "bg-purple-900/10",
          "hover:bg-purple-900/20",
          "hover:shadow-purple-500/50"
        )
      );
  } else if (theme === "solar-orange") {
    body.classList.add("bg-gradient-to-b", "from-orange-900", "to-orange-500");
    elements.forEach((el) =>
      el.classList.add("bg-orange-900/80", "text-white")
    );
    document
      .querySelectorAll(".satellite-item")
      .forEach((el) =>
        el.classList.add(
          "bg-orange-900/10",
          "hover:bg-orange-900/20",
          "hover:shadow-orange-500/50"
        )
      );
  }
}

document.getElementById("theme-picker").addEventListener("change", (e) => {
  applyTheme(e.target.value);
});

document.getElementById("sidebar-toggle").addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("-translate-x-full");
});

document
  .getElementById("search-bar")
  .addEventListener("input", filterSatellites);
document
  .getElementById("altitude-filter")
  .addEventListener("change", filterSatellites);
document.getElementById("popup-close").addEventListener("click", () => {
  document.getElementById("satellite-popup").classList.add("hidden");
});
document.getElementById("export-data").addEventListener("click", exportData);

applyTheme("dark");
