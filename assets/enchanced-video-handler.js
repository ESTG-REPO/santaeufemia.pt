document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('main-video');
  const button = document.getElementById('unmute-fallback-btn');
  const icon = button.querySelector('i');
  const tooltip = new bootstrap.Tooltip(button);
  const volumeSlider = document.getElementById('volume-slider');
  const AUTOHIDE = 10000;

  // Set initial volume from localStorage (if available)
  video.volume = parseFloat(localStorage.getItem('videoVolume')) || 1;

  // Fade-in effect for unmute button
  function fadeIn() {
    button.style.display = 'inline-block';
    setTimeout(() => button.classList.add('show'), 10);
  }

  // Fade-out effect for unmute button
  function fadeOut() {
    button.classList.remove('show');
    setTimeout(() => button.style.display = 'none', 500);
  }

  // Update icon based on video state (paused, muted, or playing)
  function updateIcon() {
    if (video.paused) {
      icon.className = 'fas fa-play me-2';
    } else if (video.muted) {
      icon.className = 'fas fa-volume-mute me-2';
    } else {
      icon.className = 'fas fa-volume-up me-2';
    }
  }

  // Try autoplaying the video while handling muted/unmuted state
  function tryAutoplay() {
    if (localStorage.getItem('videoUnmuted') === 'true') {
      video.muted = false;
      video.play().catch((err) => console.warn('Autoplay failed:', err));
      return;
    }

    video.muted = true;
    video.play().then(() => {
      if (video.muted) {
        fadeIn();
        setTimeout(fadeOut, AUTOHIDE);
      }
    }).catch((err) => {
      console.warn('Autoplay failed:', err);
      fadeIn();
      setTimeout(fadeOut, AUTOHIDE);
    });
  }

  // Click event to unmute and play video
  button.addEventListener('click', () => {
    video.muted = false;
    localStorage.setItem('videoUnmuted', 'true');
    video.play().catch((err) => console.warn('Play error:', err));
    updateIcon();
    fadeOut();
    tooltip.hide();
    if (navigator.vibrate) navigator.vibrate(50);
  });

  // Keyboard controls: Spacebar for play/pause, 'M' for mute/unmute
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && document.activeElement !== button) {
      e.preventDefault();
      if (video.paused) {
        video.play().catch((err) => console.warn('Play error:', err));
      } else {
        video.pause();
      }
      updateIcon();
    }
    if (e.key.toLowerCase() === 'm') {
      video.muted = !video.muted;
      updateIcon();
    }
  });

  // Add keyboard navigation to the button for accessibility (enter/space to click)
  button.setAttribute('tabindex', '0');
  button.addEventListener('keydown', (e) => {
    if (['Enter', ' '].includes(e.key)) {
      e.preventDefault();
      button.click();
    }
  });

  // Update icon when video volume changes
  video.addEventListener('volumechange', updateIcon);
  video.addEventListener('play', updateIcon);
  video.addEventListener('pause', updateIcon);

  // Double-click to toggle fullscreen mode
  video.addEventListener('dblclick', () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen().catch(() => {});
    }
  });

  // Click outside the video or button to hide the unmute button
  document.addEventListener('click', (e) => {
    if (!button.contains(e.target) && !video.contains(e.target)) {
      fadeOut();
    }
  });

  // Show volume slider on button hover
  button.addEventListener('mouseenter', () => {
    volumeSlider.style.display = 'inline-block';
  });

  button.addEventListener('mouseleave', () => {
    volumeSlider.style.display = 'none';
  });

  // Handle volume change from the slider
  volumeSlider.addEventListener('input', (e) => {
    video.volume = e.target.value / 100;
    localStorage.setItem('videoVolume', video.volume); // Save volume to localStorage
  });

  // Ensure video plays after the page loads with proper fallback behavior
  tryAutoplay();
});