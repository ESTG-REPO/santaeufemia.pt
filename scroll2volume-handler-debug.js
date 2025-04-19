(function () { 
  'use strict';

  const VIDEO_CONTAINER_ID = 'video05-4';
  const VIDEO_ID = 'main-video';
  const OVERLAY_ID = 'unmute-overlay';
  let autoScrollInitiated = false;

  // Helper functions
  function getVideoElement() {
    const video = document.getElementById(VIDEO_ID);
    if (!video) return null;
    return video;
  }

  function getOverlayElement() {
    return document.getElementById(OVERLAY_ID);
  }

  function scrollToVideo() {
    const el = document.getElementById(VIDEO_CONTAINER_ID);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.pageYOffset;
    autoScrollInitiated = true;

    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo(0, y);  // Fallback for older browsers
    }

    setTimeout(() => {
      el.scrollIntoView({ block: 'start', behavior: 'auto' });
    }, 600);
  }

  // Function to activate sound
  function activateSound() {
    const vid = getVideoElement();
    if (!vid) return;

    if (vid.muted === false) return;  // Don't unmute if it's already unmuted

    try {
      vid.muted = false; // Unmute the video
      vid.volume = 1.0; // Set volume to maximum
      if (vid.paused) {
        vid.play().catch((error) => {
          console.error('Error playing video:', error);
        });
      }
      hideOverlay();  // Hide the overlay when the sound is activated
    } catch (e) {
      console.error('Error activating sound:', e);
      showOverlay(); // Ensure the overlay is shown in case of error
    }
  }

  // Show the unmute overlay
  function showOverlay() {
    const el = getOverlayElement();
    if (el) {
      el.style.display = 'block';  // Show the overlay
    }
  }

  // Hide the unmute overlay
  function hideOverlay() {
    const el = getOverlayElement();
    if (el) {
      el.style.display = 'none';  // Hide the overlay
    }
  }

  // Listen for clicks on the overlay to unmute the video
  function listenForOverlayClick() {
    const overlay = getOverlayElement();
    if (overlay) {
      overlay.addEventListener('click', () => {
        activateSound();  // When clicked, unmute the video
      });
    }
  }

  // Initialize the functionality
  function init() {
    const video = getVideoElement();
    if (video && video.muted) {
      showOverlay(); // If the video is muted, show the overlay
    }

    // Set up listener for overlay click
    listenForOverlayClick();

    setTimeout(() => {
      if (!autoScrollInitiated) {
        scrollToVideo();  // Automatically scroll to the video after 3 seconds
      }
    }, 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();