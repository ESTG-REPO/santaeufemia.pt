document.addEventListener("DOMContentLoaded", function () {
  const mainVideo = document.getElementById("main-video");
  const bgVideo = document.getElementById("bg-video");

  if (!mainVideo || !bgVideo) return;

  // Set volume for main video
  mainVideo.volume = 1; // Set to full volume for the foreground video
  bgVideo.volume = 0; // Ensure background video remains muted

  // Force autoplay with fallback
  const playPromise = mainVideo.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        bgVideo.play(); // Start background video once the main video plays
      })
      .catch(() => {
        mainVideo.muted = true; // Mute if autoplay fails
        mainVideo.play();
        bgVideo.play();
      });
  }

  // Sync playback between the main and background videos
  let syncThreshold = 0.1; // 100ms drift tolerance

  function syncVideos() {
    const drift = Math.abs(mainVideo.currentTime - bgVideo.currentTime);
    if (drift > syncThreshold) {
      bgVideo.currentTime = mainVideo.currentTime; // Sync background video time to the main video
    }
  }

  // Sync videos continuously with requestAnimationFrame
  function syncLoop() {
    syncVideos();
    requestAnimationFrame(syncLoop);
  }

  // Start sync loop
  requestAnimationFrame(syncLoop);

  // Mirror play/pause/seek between main and background video
  mainVideo.addEventListener("play", () => bgVideo.play());
  mainVideo.addEventListener("pause", () => bgVideo.pause());
  mainVideo.addEventListener("seeked", () => {
    bgVideo.currentTime = mainVideo.currentTime; // Ensure bg-video syncs with main-video seek
  });

  // Stop syncing when videos end or encounter an error
  ["ended", "emptied", "error"].forEach(evt => {
    mainVideo.addEventListener(evt, () => {
      bgVideo.pause(); // Stop background video if main video ends
    });
  });
});
