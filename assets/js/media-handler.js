document.addEventListener("DOMContentLoaded", function () {
  const bgVideo = document.getElementById("bg-video");
  const mainVideo = document.getElementById("main-video");

  // Ensure both videos autoplay, loop, and are muted initially
  [bgVideo, mainVideo].forEach(video => {
    video.setAttribute("autoplay", true);
    video.setAttribute("loop", true);
    video.setAttribute("playsinline", true);
    video.muted = true;
    video.play().catch(err => console.warn("Autoplay error:", err));
  });

  // Create toggle button
  const btn = document.createElement("button");
  btn.innerHTML = "<span style='margin-right: 8px;'>&#128266;</span>com som";
  btn.style.position = "fixed";
  btn.style.top = "20px";
  btn.style.left = "50%";
  btn.style.transform = "translateX(-50%)";
  btn.style.padding = "10px 20px";
  btn.style.backgroundColor = "rgba(0,0,0,0.6)";
  btn.style.color = "#fff";
  btn.style.border = "none";
  btn.style.borderRadius = "8px";
  btn.style.cursor = "pointer";
  btn.style.zIndex = "10000";
  btn.style.transition = "opacity 0.5s ease";
  btn.style.opacity = "1";
  document.body.appendChild(btn);

  let fadeTimeout;

  function fadeOutButton() {
    btn.style.opacity = "0";
  }

  function fadeInButton() {
    btn.style.opacity = "1";
  }

  // Toggle sound on button click
  btn.addEventListener("click", () => {
    if (mainVideo.muted) {
      mainVideo.muted = false;
      mainVideo.volume = 1.0;
      mainVideo.play().catch(() => {});
      btn.innerHTML = "<span style='margin-right: 8px;'>&#128263;</span>sem som";
      fadeInButton();
      clearTimeout(fadeTimeout);
      fadeTimeout = setTimeout(() => {
        fadeOutButton();
      }, 5000);
    } else {
      mainVideo.muted = true;
      btn.innerHTML = "<span style='margin-right: 8px;'>&#128266;</span>com som";
      fadeInButton();
      clearTimeout(fadeTimeout);
    }
  });

  // Global click handler to enable audio once
  let userHasInteracted = false;
  document.addEventListener("click", () => {
    if (!userHasInteracted) {
      mainVideo.muted = false;
      mainVideo.volume = 1.0;
      mainVideo.play().catch(() => {});
      btn.innerHTML = "<span style='margin-right: 8px;'>&#128263;</span>sem som";
      fadeInButton();
      clearTimeout(fadeTimeout);
      fadeTimeout = setTimeout(() => {
        fadeOutButton();
      }, 5000);
      userHasInteracted = true;
    } else {
      if (mainVideo.paused || mainVideo.readyState < 3) {
        mainVideo.play().catch(() => {});
      }
    }
  }, { once: true });

  // Sync logic: mainVideo is the master
  function syncVideos() {
    const diff = Math.abs(bgVideo.currentTime - mainVideo.currentTime);
    if (diff > 0.3) {
      bgVideo.currentTime = mainVideo.currentTime;
    }
  }

  // Interval fallback sync
  const syncInterval = setInterval(syncVideos, 300);

  // Event-based sync fallback
  mainVideo.addEventListener("seeking", () => {
    bgVideo.currentTime = mainVideo.currentTime;
  });

  mainVideo.addEventListener("timeupdate", () => {
    const diff = Math.abs(bgVideo.currentTime - mainVideo.currentTime);
    if (diff > 0.3) {
      bgVideo.currentTime = mainVideo.currentTime;
    }
  });
});
