const satellitesList = [];

async function fetchSatellites() {
  try {
    const response = await fetch("http://localhost:8080/api/satellites");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const satellites = await response.json();

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

      // Tambah ke UI
      addSatelliteToUI(sat, satellite);
    });
  } catch (error) {
    console.error("Gagal fetch data:", error);
    document.getElementById("satellite-list").innerText =
      "Error loading satellite data";
  }
}

function animateSatellites() {
  satellitesList.forEach((satellite) => {
    const data = satellite.userData;
    data.angle += 0.01;
    const phi = ((90 - data.latitude) * Math.PI) / 180;
    const theta = data.angle;

    satellite.position.set(
      data.radius * Math.sin(phi) * Math.cos(theta),
      data.radius * Math.cos(phi),
      data.radius * Math.sin(phi) * Math.sin(theta)
    );
  });
}

fetchSatellites();
