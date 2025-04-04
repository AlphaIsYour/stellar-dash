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
  item.className = "satellite-item";
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
    map.setView([sat.latitude, sat.longitude], 5); // Zoom ke satelit
  };
  satelliteListDiv.appendChild(item);

  tippy(item, {
    content: `Lat: ${sat.latitude}, Lon: ${sat.longitude}`,
    placement: "right",
    theme: "space",
    animation: "shift-away",
  });
}

const style = document.createElement("style");
style.innerHTML = `
  .tippy-box[data-theme~='space'] {
    background: rgba(0, 0, 50, 0.9);
    color: #fff;
    border: 1px solid #ff3333;
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
  }
  .tippy-box[data-theme~='space'] .tippy-arrow {
    color: #ff3333;
  }
`;
document.head.appendChild(style);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -((event.clientY / window.innerHeight) * 0.7) * 2 + 1; // Adjust buat 70vh

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
    map.setView([sat.latitude, sat.longitude], 5); // Zoom ke satelit
  }
}

window.addEventListener("click", onMouseClick);

function toggleTheme() {
  const body = document.body;
  const themeToggle = document.getElementById("theme-toggle");
  body.classList.toggle("light-theme");
  themeToggle.innerText = body.classList.contains("light-theme")
    ? "Dark"
    : "Light";
}
