const satellitesList = [];
let map,
  markers = [];
let altitudeChart;

function initMap() {
  const mapContainer = document.getElementById("map-container");
  map = L.map("map", { zoomControl: false }).setView([0, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const resizer = document.getElementById("map-resizer");
  let isResizing = false;

  resizer.addEventListener("mousedown", (e) => {
    isResizing = true;
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;
    const newWidth = window.innerWidth - e.clientX;
    const newHeight = window.innerHeight - e.clientY;
    mapContainer.style.width = `${Math.max(200, Math.min(newWidth, 600))}px`;
    mapContainer.style.height = `${Math.max(150, Math.min(newHeight, 400))}px`;
    map.invalidateSize();
  });

  document.addEventListener("mouseup", () => {
    isResizing = false;
  });
}

async function fetchSatellites() {
  try {
    const response = await fetch("http://localhost:8080/api/satellites");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const satellites = await response.json();

    // Kosongin semua dulu
    satellitesList.forEach((sat) => scene.remove(sat));
    satellitesList.length = 0;
    document.getElementById("satellite-list").innerHTML = "";
    markers.forEach((marker) => map.removeLayer(marker));
    markers = [];
    allSatellites = [];

    // Cek kalo satellites ada dan array
    if (!satellites || !Array.isArray(satellites)) {
      throw new Error("Data satelit tidak valid atau kosong");
    }

    satellites.forEach((sat) => {
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
      satellite.userData = { ...sat, radius, angle: theta };
      scene.add(satellite);
      satellitesList.push(satellite);

      const glowGeometry = new THREE.CircleGeometry(0.5, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      satellite.add(glow);

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
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7,
      });
      const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);

      addSatelliteToUI(sat, satellite);

      const marker = L.marker([sat.latitude, sat.longitude])
        .addTo(map)
        .bindPopup(`${sat.name}: Alt ${sat.altitude} km`);
      markers.push(marker);
    });

    updateStats(satellites);
    filterSatellites();
  } catch (error) {
    console.error("Gagal fetch data:", error);
    document.getElementById("satellite-list").innerText =
      "Error loading satellite data: " + error.message;
  }
}

function animateSatellites() {
  satellitesList.forEach((satellite) => {
    const data = satellite.userData;
    data.angle += 0.01;
    const phi = ((90 - data.latitude) * Math.PI) / 180;
    const theta = data.angle;
    const radius = data.radius;

    satellite.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  });
}

function updateStats(satellites) {
  const total = satellites.length;
  const active = satellites.length; // Asumsi semua aktif, kalo ada data status, bisa diubah
  const avgAltitude =
    satellites.reduce((sum, sat) => sum + sat.altitude, 0) / total || 0;
  const minAltitude = Math.min(...satellites.map((sat) => sat.altitude)) || 0;
  const maxAltitude = Math.max(...satellites.map((sat) => sat.altitude)) || 0;

  animateNumber("total-satellites", total);
  animateNumber("active-satellites", active);
  animateNumber("avg-altitude", avgAltitude.toFixed(2));
  animateNumber("min-altitude", minAltitude);
  animateNumber("max-altitude", maxAltitude);

  // Update chart
  const altitudeRanges = {
    "<500": 0,
    "500-1000": 0,
    ">1000": 0,
  };
  satellites.forEach((sat) => {
    if (sat.altitude < 500) altitudeRanges["<500"]++;
    else if (sat.altitude <= 1000) altitudeRanges["500-1000"]++;
    else altitudeRanges[">1000"]++;
  });

  if (!altitudeChart) {
    const ctx = document.getElementById("altitude-chart").getContext("2d");
    altitudeChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["<500 km", "500-1000 km", ">1000 km"],
        datasets: [
          {
            label: "Satellites",
            data: [
              altitudeRanges["<500"],
              altitudeRanges["500-1000"],
              altitudeRanges[">1000"],
            ],
            backgroundColor: "rgba(255, 51, 51, 0.7)",
            borderColor: "rgba(255, 51, 51, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { display: false } },
      },
    });
  } else {
    altitudeChart.data.datasets[0].data = [
      altitudeRanges["<500"],
      altitudeRanges["500-1000"],
      altitudeRanges[">1000"],
    ];
    altitudeChart.update();
  }
}

function animateNumber(elementId, target) {
  const element = document.getElementById(elementId);
  let start = parseFloat(element.innerText) || 0;
  const duration = 1000;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = start + (target - start) * progress;
    element.innerText =
      elementId === "avg-altitude" ? value.toFixed(2) : Math.round(value);

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

initMap();
fetchSatellites();
setInterval(fetchSatellites, 10457);
