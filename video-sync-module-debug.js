document.addEventListener("DOMContentLoaded", function () {
  const mainVideo = document.getElementById("main-video") || document.getElementById("video05-4");
  const bgVideo = document.getElementById("bg-video");

  if (!mainVideo || !bgVideo) return;

  // Ensure attributes for autoplay compatibility across browsers
  [mainVideo, bgVideo].forEach(video => {
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    video.setAttribute("muted", "true"); // helps with autoplay policy
  });

  mainVideo.volume = 1;
  mainVideo.muted = false;

  bgVideo.volume = 0;
  bgVideo.muted = true;

  // Fallback autoplay handler
  function forcePlay(video) {
    return video.play().catch(() => {
      video.muted = true;
      return video.play();
    });
  }

  // Play both videos, fallback to muted autoplay
  forcePlay(mainVideo).then(() => {
    forcePlay(bgVideo);
  });

  // Manual loop fallback
  function enforceLoop(video) {
    video.addEventListener("ended", () => {
      video.currentTime = 0;
      video.play();
    });
  }

  enforceLoop(mainVideo);
  enforceLoop(bgVideo);

  // Sync playback times
  const syncThreshold = 0.1;

  function syncVideos() {
    const drift = Math.abs(mainVideo.currentTime - bgVideo.currentTime);
    if (drift > syncThreshold) {
      bgVideo.currentTime = mainVideo.currentTime;
    }
  }

  function syncLoop() {
    syncVideos();
    requestAnimationFrame(syncLoop);
  }

  requestAnimationFrame(syncLoop);

  // Mirror play/pause/seek
  mainVideo.addEventListener("play", () => bgVideo.play());
  mainVideo.addEventListener("pause", () => bgVideo.pause());
  mainVideo.addEventListener("seeked", () => {
    bgVideo.currentTime = mainVideo.currentTime;
  });

  ["ended", "emptied", "error"].forEach(evt => {
    mainVideo.addEventListener(evt, () => bgVideo.pause());
  });

  // Extra detection for in-app browsers (Facebook, Instagram, Messenger)
  const ua = navigator.userAgent || navigator.vendor;
  const isInAppBrowser = /FBAN|FBAV|Instagram|Messenger/i.test(ua);

  if (isInAppBrowser) {
    // Force muted autoplay in in-app browsers
    mainVideo.muted = true;
    bgVideo.muted = true;
    forcePlay(mainVideo);
    forcePlay(bgVideo);
  }
});