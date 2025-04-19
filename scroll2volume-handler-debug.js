(function () {
  'use strict';

  const VIDEO_CONTAINER_ID = 'video05-4';  // The container holding your video
  const VIDEO_ID = 'main-video';           // The video element ID
  const OVERLAY_ID = 'unmute-overlay';     // The overlay ID for unmuting the video
  let userScrolled = false;
  let userInteracted = false;
  let autoScrollInitiated = false;

  // Helper functions to get video and overlay elements
  function getVideoElement() {
    const video = document.getElementById(VIDEO_ID);
    if (!video) return null;
    return video;
  }

  function getOverlayElement() {
    return document.getElementById(OVERLAY_ID);
  }

  // Detect user scroll
  function detectUserScroll() {
    window.addEventListener('scroll', () => {
      if (!autoScrollInitiated && !userScrolled) {
        userScrolled = true;
        activateSound();
      }
    }, { passive: true });
  }

  // Detect any user interaction (click, touch, or keydown)
  function detectUserInteraction() {
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(evt => {
      window.addEventListener(evt, () => {
        if (!userInteracted) {
          userInteracted = true;
          activateSound();
        }
      }, { once: true, passive: true });
    });
  }

  // Scroll to video container
  function scrollToVideo(callback) {
    const el = document.getElementById(VIDEO_CONTAINER_ID);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.pageYOffset;
    autoScrollInitiated = true;

    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo(0, y);  // Fallback for older browsers
    }

    // Additional scroll to ensure visibility
    setTimeout(() => el.scrollIntoView({ block: 'start', behavior: 'auto' }), 600);

    // Trigger sound activation after scroll
    setTimeout(() => {
      activateSound();
    }, 1200);
  }

  // Activate sound for the video
  function activateSound() {
    const vid = getVideoElement();
    if (!vid || !vid.muted) return;

    try {
      vid.muted = false;
      vid.volume = 1.0;

      // Try to play the video if it's paused
      if (vid.paused) {
        vid.play().catch(() => {
          showOverlay();  // Show overlay if video fails to play
        });
      }
    } catch (e) {
      showOverlay();  // Show overlay if an error occurs
    }

    hideOverlay();
  }

  // Show the unmute overlay if autoplay is blocked
  function showOverlay() {
    const el = getOverlayElement();
    if (el) {
      el.style.display = 'block';
      el.onclick = () => {
        activateSound();
        hideOverlay();
      };
    }
  }

  // Hide the overlay
  function hideOverlay() {
    const el = getOverlayElement();
    if (el) el.style.display = 'none';
  }

  // Initialization function
  function init() {
    detectUserScroll();
    detectUserInteraction();

    // Auto scroll after 3 seconds if no user scroll or interaction
    setTimeout(() => {
      if (!userScrolled && !userInteracted) {
        scrollToVideo();
      }
    }, 3000);
  }

  // Wait for DOM to load before initializing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();