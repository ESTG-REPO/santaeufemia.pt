<script>
  document.addEventListener("DOMContentLoaded", function () {
    const mainVideo = document.getElementById("mainVideo");
    const bgVideo = document.getElementById("bgVideo");

    let syncCheckInterval = null;
    let frameSyncRunning = false;

    const MAX_DRIFT = 0.03; // seconds
    const SYNC_INTERVAL = 500; // milliseconds

    function hardSync() {
      try {
        if (!isNaN(mainVideo.currentTime)) {
          bgVideo.currentTime = mainVideo.currentTime;
        }
      } catch (e) {
        console.warn("Hard sync failed:", e);
      }
    }

    function syncLoop() {
      if (!frameSyncRunning) return;

      try {
        const drift = Math.abs(mainVideo.currentTime - bgVideo.currentTime);
        if (drift > MAX_DRIFT) {
          bgVideo.currentTime = mainVideo.currentTime;
        }
      } catch (e) {
        console.warn("Frame sync error:", e);
      }

      requestAnimationFrame(syncLoop);
    }

    function startSync() {
      try {
        hardSync();
        bgVideo.play().catch(err => console.warn("Background video play error:", err));
        bgVideo.playbackRate = mainVideo.playbackRate;

        frameSyncRunning = true;
        requestAnimationFrame(syncLoop);

        syncCheckInterval = setInterval(() => {
          try {
            const drift = Math.abs(mainVideo.currentTime - bgVideo.currentTime);
            if (drift > MAX_DRIFT) {
              hardSync();
            }
          } catch (e) {
            console.warn("Interval sync error:", e);
          }
        }, SYNC_INTERVAL);
      } catch (e) {
        console.error("Start sync error:", e);
      }
    }

    function stopSync() {
      try {
        bgVideo.pause();
        frameSyncRunning = false;
        if (syncCheckInterval) {
          clearInterval(syncCheckInterval);
          syncCheckInterval = null;
        }
      } catch (e) {
        console.warn("Stop sync error:", e);
      }
    }

    mainVideo.addEventListener("ended", () => {
      if (mainVideo.loop) {
        try {
          bgVideo.currentTime = 0;
          bgVideo.play().catch(e => console.warn("Background loop restart error:", e));
        } catch (e) {
          console.warn("Loop sync error:", e);
        }
      }
    });

    mainVideo.addEventListener("play", startSync);
    mainVideo.addEventListener("pause", stopSync);
    mainVideo.addEventListener("seeked", hardSync);

    mainVideo.addEventListener("ratechange", () => {
      try {
        bgVideo.playbackRate = mainVideo.playbackRate;
      } catch (e) {
        console.warn("Rate sync error:", e);
      }
    });

    window.addEventListener("beforeunload", stopSync);
  });
</script>
