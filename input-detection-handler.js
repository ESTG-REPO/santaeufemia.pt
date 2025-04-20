// First Time User Input Detection and Video Sound Handler
export default function initVideoSoundHandler() {
  const VIDEO_ID = 'main-video';
  const OVERLAY_ID = 'unmute-overlay';
  const STORAGE_KEY = 'hasInteractedWithVideo';
  let hasUserInteracted = false;

  // Get DOM elements
  const video = document.getElementById(VIDEO_ID);
  const unmuteOverlay = document.getElementById(OVERLAY_ID);

  // Check if user has previously interacted
  function checkPreviousInteraction() {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }

  // Handle user interaction
  function handleInteraction() {
    if (!hasUserInteracted) {
      hasUserInteracted = true;
      localStorage.setItem(STORAGE_KEY, 'true');
      
      // Enable sound
      if (video) {
        video.muted = false;
        
        // Hide overlay after interaction
        if (unmuteOverlay) {
          unmuteOverlay.style.opacity = '0';
          setTimeout(() => {
            unmuteOverlay.style.display = 'none';
          }, 300);
        }
      }
    }
  }

  // Initialize the handler
  function init() {
    if (!checkPreviousInteraction() && video && unmuteOverlay) {
      // Show overlay for first-time users with fade in
      unmuteOverlay.style.display = 'block';
      requestAnimationFrame(() => {
        unmuteOverlay.style.opacity = '1';
      });
      
      // Add event listeners for both mobile and desktop
      const interactionEvents = ['click', 'touchstart', 'keydown'];
      
      // Add events to overlay
      interactionEvents.forEach(event => {
        unmuteOverlay.addEventListener(event, handleInteraction, { passive: true });
      });

      // Add events to video
      interactionEvents.forEach(event => {
        video.addEventListener(event, handleInteraction, { passive: true });
      });

      // Add events to document for keyboard and touch
      document.addEventListener('keydown', handleInteraction);
      document.addEventListener('touchstart', handleInteraction, { passive: true });

      // Handle scroll interaction
      window.addEventListener('scroll', handleInteraction, { passive: true, once: true });
    }
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Cleanup function
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

// Fallback for non-module environments
if (typeof window !== 'undefined') {
  if (!window.initVideoSoundHandler) {
    window.initVideoSoundHandler = initVideoSoundHandler;
  }
}
