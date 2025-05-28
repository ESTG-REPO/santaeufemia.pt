<script>
document.addEventListener("DOMContentLoaded", function () {
  const bgVideo = document.getElementById("bg-video");
  const mainVideo = document.getElementById("main-video");

  // Force autoplay, loop, playsinline, muted on both videos
  [bgVideo, mainVideo].forEach(video => {
    video.setAttribute("autoplay", true);
    video.setAttribute("loop", true);
    video.setAttribute("playsinline", true);
    video.muted = true;
    video.play().catch(err => console.warn("Autoplay error:", err));
  });

  // Create fixed toggle button
  const btn = document.createElement("button");
  btn.innerHTML = "<span style='margin-right: 8px;'>&#128266;</span>com som";
  btn.style.position = "fixed";
  btn.style.top = "20px";
  btn.style.right = "20px";
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
      }, 5000); // fade out after 5 seconds
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
});
</script>
