class VideoSync {
  constructor(mainVideoId, bgVideoId) {
    this.mainVideo = document.getElementById(mainVideoId);
    this.bgVideo = document.getElementById(bgVideoId);
    if (!this.mainVideo || !this.bgVideo) return;

    this.syncThreshold = 0.1; // 100ms drift tolerance
    this.driftThreshold = 0.05; // seconds
    this.fallbackMs = 300; // ms
    this.useFallback = false;
    this.isRunning = true;

    this.rafId = null;
    this.intervalId = null;

    this.initialize();
  }

  initialize() {
    // Mute and autoplay setup for both videos
    [this.mainVideo, this.bgVideo].forEach(v => {
      v.muted = true;
      v.defaultMuted = true;
      v.setAttribute("muted", "");
      v.volume = 0;
      v.playsInline = true;
    });

    this.tryPlay(this.mainVideo);
    this.tryPlay(this.bgVideo);

    // First interaction event listener
    document.addEventListener("click", this.onFirstInteraction.bind(this));
    document.addEventListener("touchstart", this.onFirstInteraction.bind(this), { passive: true });

    // Sync initialization
    setTimeout(() => {
      this.checkPerformance();
      this.startSync();
    }, 100);

    // Event listeners for play, pause, seek, and ended states
    this.mainVideo.addEventListener("play", this.onPlay.bind(this));
    this.mainVideo.addEventListener("pause", this.onPause.bind(this));
    this.mainVideo.addEventListener("seeked", this.onSeeked.bind(this));
    this.mainVideo.addEventListener("ended", this.onEnded.bind(this));
  }

  tryPlay(video) {
    const p = video.play();
    if (p && p.catch) {
      p.catch((error) => {
        console.error("Autoplay failed, will retry on user interaction:", error);
      });
    }
  }

  onFirstInteraction() {
    this.tryPlay(this.mainVideo);
    this.tryPlay(this.bgVideo);
    document.removeEventListener("click", this.onFirstInteraction.bind(this));
    document.removeEventListener("touchstart", this.onFirstInteraction.bind(this));
  }

  checkPerformance() {
    try {
      const mem = window.performance?.memory?.jsHeapSizeLimit || 0;
      this.useFallback = mem && mem < 500_000_000;
    } catch (error) {
      console.warn('Memory check failed or unsupported, fallback not used:', error);
      this.useFallback = false; // Default to no fallback
    }
  }

  syncOnce() {
    const drift = this.mainVideo.currentTime - this.bgVideo.currentTime;
    if (Math.abs(drift) > this.driftThreshold) {
      this.bgVideo.currentTime = this.mainVideo.currentTime;
      console.debug(`Sync corrected drift: ${drift.toFixed(3)}s`);
    }

    if (this.mainVideo.paused !== this.bgVideo.paused) {
      this.mainVideo.paused ? this.bgVideo.pause() : this.tryPlay(this.bgVideo);
    }
  }

  syncLoop() {
    this.syncOnce();
    this.rafId = requestAnimationFrame(this.syncLoop.bind(this));
  }

  startSync() {
    this.stopSync();
    if (this.useFallback) {
      this.intervalId = setInterval(this.syncOnce.bind(this), this.fallbackMs);
    } else {
      this.rafId = requestAnimationFrame(this.syncLoop.bind(this));
    }
  }

  stopSync() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.intervalId) clearInterval(this.intervalId);
  }

  onPlay() {
    this.tryPlay(this.bgVideo);
  }

  onPause() {
    this.bgVideo.pause();
  }

  onSeeked() {
    this.bgVideo.currentTime = this.mainVideo.currentTime;
  }

  onEnded() {
    this.bgVideo.pause();
  }

  // Start sync if already playing on load
  startIfPlaying() {
    if (!this.mainVideo.paused) {
      this.bgVideo.currentTime = this.mainVideo.currentTime;
      this.tryPlay(this.bgVideo);
    }
  }
}

// Usage
document.addEventListener("DOMContentLoaded", () => {
  const videoSync = new VideoSync("mainVideo", "bgVideo");
  videoSync.startIfPlaying();
});
