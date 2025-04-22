export default function initVideoSoundHandler() {
  const VIDEO_ID = 'main-video';
  const OVERLAY_ID = 'unmute-overlay';
  const STORAGE_KEY = 'hasInteractedWithVideo';
  let hasUserInteracted = false;

  const video = document.getElementById(VIDEO_ID) || document.getElementById("video05-4");
  const unmuteOverlay = document.getElementById(OVERLAY_ID);

  const ua = navigator.userAgent || navigator.vendor || '';
  const isInAppBrowser = /FBAN|FBAV|Instagram|Messenger|TikTok|Snapchat/i.test(ua);

  function checkPreviousInteraction() {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }

  function handleInteraction() {
    if (!hasUserInteracted) {
      hasUserInteracted = true;
      localStorage.setItem(STORAGE_KEY, 'true');

      if (video) {
        video.muted = false;
        video.volume = 1;
        video.play().catch(() => {}); // retry with sound
      }

      if (unmuteOverlay) {
        unmuteOverlay.style.opacity = '0';
        setTimeout(() => {
          unmuteOverlay.style.display = 'none';
        }, 300);
      }
    }
  }

  function ensureVideoAttributes(video) {
    video.setAttribute('autoplay', 'true');
    video.setAttribute('muted', 'true');
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
  }

  function manualLoop(video) {
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    });
  }

  function aggressiveAutoplay(video) {
    if (!video) return;

    ensureVideoAttributes(video);

    const tryPlay = () => {
      video.play().then(() => {
        // success
      }).catch(() => {
        video.muted = true;
        video.play().catch(() => {
          // Wait for visibility change or interaction
        });
      });
    };

    tryPlay();

    // Retry on visibility change (tab was inactive or delayed)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        tryPlay();
      }
    });

    // Retry on scroll/touchstart if blocked
    ['scroll', 'touchstart'].forEach(evt => {
      window.addEventListener(evt, tryPlay, { passive: true, once: true });
    });

    // Aggressive retry every 2s for embedded browsers
    if (isInAppBrowser) {
      const autoplayInterval = setInterval(() => {
        video.play().catch(() => {});
      }, 2000);

      setTimeout(() => clearInterval(autoplayInterval), 15000); // stop after 15s
    }

    manualLoop(video); // fallback loop
  }

  function init() {
    if (!video) return;

    // Always force autoplay first
    aggressiveAutoplay(video);

    if (!checkPreviousInteraction() && unmuteOverlay) {
      unmuteOverlay.style.display = 'block';
      requestAnimationFrame(() => {
        unmuteOverlay.style.opacity = '1';
      });

      const interactionEvents = ['click', 'touchstart', 'keydown'];
      interactionEvents.forEach(event => {
        unmuteOverlay.addEventListener(event, handleInteraction, { passive: true });
        video.addEventListener(event, handleInteraction, { passive: true });
      });

      document.addEventListener('keydown', handleInteraction);
      document.addEventListener('touchstart', handleInteraction, { passive: true });
      window.addEventListener('scroll', handleInteraction, { passive: true, once: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return function cleanup() {
    if (video && unmuteOverlay) {
      const events = ['click', 'touchstart', 'keydown'];
      events.forEach(event => {
        unmuteOverlay.removeEventListener(event, handleInteraction);
        video.removeEventListener(event, handleInteraction);
      });

      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    }
  };
}

if (typeof window !== 'undefined') {
  if (!window.initVideoSoundHandler) {
    window.initVideoSoundHandler = initVideoSoundHandler;
  }
}