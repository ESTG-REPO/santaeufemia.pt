document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('main-video');
  const muteBtn = document.getElementById('mute-toggle-btn');
  const volumeSlider = document.getElementById('volume-slider');
  const icon = muteBtn.querySelector('i');
  const AUTOHIDE = 10000;

  // Restore volume from localStorage
  video.volume = parseFloat(localStorage.getItem('videoVolume')) || 1;
  video.muted = localStorage.getItem('videoUnmuted') !== 'true';
  volumeSlider.value = video.volume;

  // Update icon based on state
  function updateIcon() {
    if (video.paused) {
      icon.className = 'fas fa-play';
    } else if (video.muted || video.volume === 0) {
      icon.className = 'fas fa-volume-mute';
    } else if (video.volume <= 0.5) {
      icon.className = 'fas fa-volume-down';
    } else {
      icon.className = 'fas fa-volume-up';
    }
  }

  // Autoplay with fallback
  function tryAutoplay() {
    video.play().then(() => {
      if (video.muted) showControlsTemporarily();
    }).catch(() => {
      showControlsTemporarily();
    });
  }

  // Show/hide controls
  function showControlsTemporarily() {
    muteBtn.parentElement.style.display = 'flex';
    setTimeout(() => {
      muteBtn.parentElement.style.display = 'none';
    }, AUTOHIDE);
  }

  // Toggle mute
  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    localStorage.setItem('videoUnmuted', (!video.muted).toString());
    if (navigator.vibrate) navigator.vibrate(50);
    updateIcon();
  });

  // Slider control
  volumeSlider.addEventListener('input', (e) => {
    const vol = parseFloat(e.target.value);
    video.volume = vol;
    video.muted = vol === 0;
    localStorage.setItem('videoVolume', vol);
    updateIcon();
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && document.activeElement !== volumeSlider) {
      e.preventDefault();
      video.paused ? video.play() : video.pause();
    }
    if (e.key.toLowerCase() === 'm') {
      video.muted = !video.muted;
      updateIcon();
    }
  });

  // Double-click fullscreen
  video.addEventListener('dblclick', () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen().catch(() => {});
    }
  });

  // Icon updates on change
  video.addEventListener('volumechange', updateIcon);
  video.addEventListener('play', updateIcon);
  video.addEventListener('pause', updateIcon);

  updateIcon();
  tryAutoplay();
});