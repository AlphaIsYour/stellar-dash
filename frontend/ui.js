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

function addSatelliteToUI(sat, satelliteObj) {
  const satelliteListDiv = document.getElementById("satellite-list");
  const item = document.createElement("div");
  item.className =
    "p-2 my-1 bg-white/10 rounded hover:bg-white/20 hover:shadow-lg hover:shadow-red-500/50 cursor-pointer transition-all satellite-item";
  item.innerText = `${sat.name}: Alt ${sat.altitude} km`;
  item.onclick = () => {
    const info = `Lat ${sat.latitude}, Lon ${sat.longitude}, Alt ${sat.altitude} km`;
    showToast(sat.name, info);
    camera.position.set(
      satelliteObj.position.x,
      satelliteObj.position.y,
      satelliteObj.position.z + 10
    );
    controls.target.copy(satelliteObj.position);
    map.setView([sat.latitude, sat.longitude], 5);
  };
  satelliteListDiv.appendChild(item);

  tippy(item, {
    content: `Lat: ${sat.latitude}, Lon: ${sat.longitude}`,
    placement: "right",
    theme: "space",
    animation: "shift-away",
  });
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
    const info = `Lat ${sat.latitude}, Lon ${sat.longitude}, Alt ${sat.altitude} km`;
    showToast(sat.name, info);
    camera.position.set(
      intersects[0].object.position.x,
      intersects[0].object.position.y,
      intersects[0].object.position.z + 10
    );
    controls.target.copy(intersects[0].object.position);
    map.setView([sat.latitude, sat.longitude], 5);
  }
}

window.addEventListener("click", onMouseClick);

function toggleTheme() {
  const body = document.body;
  const themeToggle = document.getElementById("theme-toggle");

  if (body.classList.contains("from-gray-900")) {
    body.classList.remove("bg-gradient-to-b", "from-gray-900", "to-indigo-900");
    body.classList.add("bg-gradient-to-b", "from-blue-100", "to-indigo-300");
    themeToggle.innerText = "Dark";
    document
      .querySelectorAll("#header, #sidebar, #stats, #map-container")
      .forEach((el) => {
        el.classList.remove("bg-gray-900/80", "text-white");
        el.classList.add("bg-white/80", "text-gray-900");
      });
    document.querySelectorAll(".satellite-item").forEach((el) => {
      el.classList.remove(
        "bg-white/10",
        "hover:bg-white/20",
        "hover:shadow-red-500/50"
      );
      el.classList.add(
        "bg-gray-900/10",
        "hover:bg-gray-900/20",
        "hover:shadow-blue-500/50"
      );
    });
  } else {
    body.classList.remove("bg-gradient-to-b", "from-blue-100", "to-indigo-300");
    body.classList.add("bg-gradient-to-b", "from-gray-900", "to-indigo-900");
    themeToggle.innerText = "Light";
    document
      .querySelectorAll("#header, #sidebar, #stats, #map-container")
      .forEach((el) => {
        el.classList.remove("bg-white/80", "text-gray-900");
        el.classList.add("bg-gray-900/80", "text-white");
      });
    document.querySelectorAll(".satellite-item").forEach((el) => {
      el.classList.remove(
        "bg-gray-900/10",
        "hover:bg-gray-900/20",
        "hover:shadow-blue-500/50"
      );
      el.classList.add(
        "bg-white/10",
        "hover:bg-white/20",
        "hover:shadow-red-500/50"
      );
    });
  }
}

document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

document.getElementById("sidebar-toggle").addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("-translate-x-full");
});
