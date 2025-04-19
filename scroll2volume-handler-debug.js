(function () {
  'use strict';

  const VIDEO_CONTAINER_ID = 'video05-4';
  const OVERLAY_ID = 'unmute-overlay';
  let userScrolled = false;
  let userInteracted = false;
  let autoScrollInitiated = false;

  // Helper functions to get video and overlay elements
  function getVideoElement() {
    const container = document.getElementById(VIDEO_CONTAINER_ID);
    if (!container) return null;
    return container.querySelector('video') || container;
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
      window.scrollTo(0, y);
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

      // Play video if paused
      if (vid.paused) {
        vid.play().catch(() => {
          showOverlay();
        });
      }
    } catch (e) {
      showOverlay();
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