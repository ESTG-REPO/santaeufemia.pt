<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Localização | Santa Eufémia</title>
  <link href="<!-- Tailwind CSS -->
  <link href="https://cdn.tailwindcss.com" rel="stylesheet" />" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
  <link href="https://fonts.googleapis.com/css2?family=Monoton&family=Orbitron:wght@700&display=swap" rel="stylesheet">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      overflow-x: hidden;
      font-family: "Orbitron", sans-serif;
    }
    .jarallax {
      position: relative;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }
    video.bg-video {
      position: absolute;
      top: 0;
      left: 0;
      object-fit: cover;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1;
    }
    .map-section {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 90%;
      max-width: 1000px;
    }
    .map-title {
      font-family: "Monoton", cursive;
      font-size: 5rem;
      text-align: center;
      background: linear-gradient(90deg, #ff66cc, #cc66ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 2rem;
    }
    .countdown {
      font-family: "Orbitron", sans-serif;
      font-size: 2.5rem;
      color: #ffcc66;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    .map-container {
      width: 100%;
      aspect-ratio: 16 / 9;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    .map-container iframe {
      width: 100%;
      height: 100%;
      border: 0;
      display: block;
    }
    @media (max-width: 640px) {
      .map-container {
        aspect-ratio: 4 / 3;
      }
      .map-title {
        font-size: 2.5rem;
      }
      .countdown {
        font-size: 1.8rem;
      }
    }
    .three-canvas {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      height: 400px;
      width: 200px;
      z-index: 2;
    }
    .left-cube {
      left: 0;
    }
    .right-cube {
      right: 0;
    }
    @media (max-width: 768px) {
      .three-canvas {
        display: none;
      }
    html, body {
  height: 100%;
  overflow: hidden;  /* Prevents vertical scrolling */
  }
    }
  </style>
</head>
<body>
  <section class="jarallax">
    <video class="bg-video" autoplay muted loop playsinline>
      <source src="https://cdn.xperia.pt/background1.mp4" type="video/mp4" />
    </video>
    <div class="overlay"></div>
    <canvas id="leftCube" class="three-canvas left-cube"></canvas>
    <canvas id="rightCube" class="three-canvas right-cube"></canvas>
    <div class="map-section animate__animated animate__fadeInUp">
      <div class="map-title">Contagem para a festa</div>
      <div id="countdown" class="countdown">00d 00h 00m 00s</div>
      <div class="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.055245555793!2d-8.7482007!3d39.760867999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd2273d886fc905d%3A0x466a0a8c2400e785!2sPar%C3%B3quia%20de%20Santa%20Euf%C3%A9mia!5e0!3m2!1spt-PT!2spt!4v1744730386596!5m2!1spt-PT!2spt"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  </section>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script>
    function createWireframeCube(canvasId) {
      const canvas = document.getElementById(canvasId);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      const geometry = new THREE.BoxGeometry();
      const edges = new THREE.EdgesGeometry(geometry);
      const material = new THREE.LineBasicMaterial({ color: "#00FF00" });
      const wireframe = new THREE.LineSegments(edges, material);
      scene.add(wireframe);
      camera.position.z = 2;
      function animate() {
        requestAnimationFrame(animate);
        wireframe.rotation.x += 0.01;
        wireframe.rotation.y += 0.01;
        renderer.render(scene, camera);
      }
      animate();
    }
    createWireframeCube("leftCube");
    createWireframeCube("rightCube");
  </script>
  <script>
    const countdownElement = document.getElementById("countdown");
    const targetDate = new Date("2025-04-19T19:00:00");
    function updateCountdown() {
      const now = new Date();
      const diff = targetDate - now;
      if (diff <= 0) {
        countdownElement.textContent = "É hoje! 🎉";
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  </script>
</body>
</html>'>
