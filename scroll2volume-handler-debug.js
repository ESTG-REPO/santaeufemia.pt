(() => {
  const CONFIG = {
    videoSectionId: 'video05-4',
    videoId: 'main-video',
    fallbackBtnId: 'unmute-fallback-btn',
    overlayBtnId: 'overlay-button',
    debug: false,
    autoScrollDelay: 2000,
    overlayFallbackDelay: 4000,
    sessionKey: 'videoAutoScrollDone',
    cookieKey: 'videoSeen',
  };

  const log = (...args) => CONFIG.debug && console.log('[AutoVideo]', ...args);

  let volumeActivated = false;
  let autoScrollTimeout;
  let overlayFallbackTimeout;

  const getById = id => document.getElementById(id);

  function isElementInViewport(el) {
    if (!el || !el.getBoundingClientRect) return false;
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  function scrollToElement(el) {
    try {
      if ('scrollIntoView' in el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
      }
    } catch (e) {
      window.scrollTo(0, el.offsetTop);
    }
  }

  function activateVolumeOnInput() {
    if (volumeActivated) return;

    const video = getById(CONFIG.videoId);
    const overlay = getById(CONFIG.overlayBtnId);
    const fallbackBtn = getById(CONFIG.fallbackBtnId);

    if (video) {
      try {
        video.muted = false;
        video.setAttribute('aria-live', 'polite');
      } catch (err) {
        log('Video mute toggle failed', err);
      }
    }

    if (overlay) {
      overlay.style.transition = 'opacity 0.5s ease';
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 500);
    }

    if (fallbackBtn) {
      fallbackBtn.style.display = 'none';
    }

    volumeActivated = true;
    sessionStorage.setItem(CONFIG.sessionKey, '1');
    setCookie(CONFIG.cookieKey, '1', 24 * 60 * 60); // Cookie expiry 1 day
    clearTimeout(autoScrollTimeout);
    clearTimeout(overlayFallbackTimeout);
    log('Volume activated and UI cleaned up');
  }

  function tryAutoScroll() {
    const seen = sessionStorage.getItem(CONFIG.sessionKey);
    if (seen === '1') return;

    const section = getById(CONFIG.videoSectionId);
    if (section && !isElementInViewport(section)) {
      scrollToElement(section);
      log('Auto-scrolled to video section');
    }
  }

  function showOverlayFallback() {
    const overlay = getById(CONFIG.overlayBtnId);
    if (overlay && !volumeActivated) {
      overlay.style.opacity = '1';
      overlay.style.display = 'flex';
      overlay.setAttribute('role', 'button');
      overlay.setAttribute('tabindex', '0');
      overlay.setAttribute('aria-label', 'Tap to unmute video');
      log('Overlay fallback displayed');
    }
  }

  function setupInteractionEvents() {
    const events = ['click', 'touchstart', 'scroll', 'keydown'];
    events.forEach(eventType => {
      try {
        window.addEventListener(eventType, activateVolumeOnInput, {
          once: true,
          passive: true,
        });
      } catch (err) {
        window.attachEvent?.('on' + eventType, activateVolumeOnInput); // IE fallback
      }
    });
  }

  function setupManualFallbacks() {
    const fallbackBtn = getById(CONFIG.fallbackBtnId);
    if (fallbackBtn) {
      fallbackBtn.addEventListener('click', activateVolumeOnInput);
    }

    const overlay = getById(CONFIG.overlayBtnId);
    if (overlay) {
      overlay.addEventListener('click', activateVolumeOnInput);
      overlay.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          activateVolumeOnInput();
        }
      });
    }
  }

  // --- Mobile-First Hints ---
  if (navigator.connection?.saveData || navigator.connection?.effectiveType === '2g') {
    log('User has a slow or metered connection – skipping preload');
    // Optionally, delay heavy resources (like video)
    // Or avoid autoplay entirely for slow networks
  }

  // --- Cookie-Based Remembering (Persistent Across Sessions) ---
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
  }

  function autoplayVideoOnScroll() {
    const video = getById(CONFIG.videoId);
    if (video && isElementInViewport(video)) {
      if (!video.paused && !video.muted) return;
      video.play?.().catch(err => log('Auto-play failed:', err));
      window.removeEventListener('scroll', autoplayVideoOnScroll);
      log('Video auto-played on scroll into view');
    }
  }

  // --- MutationObserver to Support Dynamic DOM Updates ---
  const observer = new MutationObserver(() => {
    setupManualFallbacks(); // Re-bind buttons if new elements are added dynamically
  });
  observer.observe(document.body, { childList: true, subtree: true });

  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  onReady(() => {
    log('Initializing full-featured video handler');

    setupInteractionEvents();
    setupManualFallbacks();

    autoScrollTimeout = setTimeout(tryAutoScroll, CONFIG.autoScrollDelay);
    overlayFallbackTimeout = setTimeout(showOverlayFallback, CONFIG.overlayFallbackDelay);

    window.addEventListener('scroll', autoplayVideoOnScroll, { passive: true });

    // Lazy-load video on scroll (if needed)
    window.addEventListener('scroll', lazyLoadVideo, { passive: true });
  });
})();