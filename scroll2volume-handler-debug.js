// --- Create the unmute overlay button programmatically ---
const overlayButton = document.createElement('div');
overlayButton.id = 'unmute-overlay';
overlayButton.style.display = 'none'; // Initially hidden
overlayButton.style.position = 'fixed';
overlayButton.style.top = '50%';
overlayButton.style.left = '50%';
overlayButton.style.transform = 'translate(-50%, -50%)';
overlayButton.style.background = 'rgba(0, 0, 0, 0.75)';
overlayButton.style.color = '#fff';
overlayButton.style.padding = '1.5em 2em';
overlayButton.style.borderRadius = '12px';
overlayButton.style.fontSize = '1.4em';
overlayButton.style.textAlign = 'center';
overlayButton.style.zIndex = '9999';
overlayButton.style.cursor = 'pointer';
overlayButton.style.maxWidth = '90%';
overlayButton.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.5)';
overlayButton.style.transition = 'opacity 0.5s ease, transform 0.3s ease-in-out';
overlayButton.style.opacity = '0';

// Hover effects
overlayButton.onmouseover = () => {
  overlayButton.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  overlayButton.style.transform = 'translate(-50%, -50%) scale(1.05)';
};
overlayButton.onmouseout = () => {
  overlayButton.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
  overlayButton.style.transform = 'translate(-50%, -50%)';
};

// Button text
overlayButton.innerText = 'Clica para ativar SOM';
document.body.appendChild(overlayButton);

let overlayShown = false;
let overlayFadeTimeout;

// Show overlay with fade-in and fade-out after 7s if not clicked
const showOverlayButton = () => {
  const video = document.getElementById('main-video');
  if (video && video.muted && !overlayShown) {
    overlayShown = true;
    overlayButton.style.display = 'block';
    setTimeout(() => { overlayButton.style.opacity = '1'; }, 10);

    // Auto-fade-out after 7 seconds
    overlayFadeTimeout = setTimeout(() => {
      overlayButton.style.opacity = '0';
      setTimeout(() => {
        overlayButton.style.display = 'none';
      }, 500);
    }, 7000);
  }
};

// Unmute on overlay click
overlayButton.addEventListener('click', function () {
  const video = document.getElementById('main-video');
  if (video) {
    video.muted = false;
    overlayButton.style.opacity = '0';
    setTimeout(() => {
      overlayButton.style.display = 'none';
    }, 500);
    clearTimeout(overlayFadeTimeout);
  }
});

// Show overlay on load if video is muted
window.addEventListener('load', showOverlayButton);

// Show overlay again if muted later
const video = document.getElementById('main-video');
if (video) {
  video.addEventListener('play', showOverlayButton);
  video.addEventListener('pause', showOverlayButton);
  video.addEventListener('volumechange', showOverlayButton);
  video.addEventListener('click', activateVolumeOnInput); // Volume on video click
}

// --- Auto-Scroll After 2 Seconds ---
setTimeout(() => {
  const videoSection = document.getElementById('video05-4');
  if (videoSection) {
    window.scrollTo({ top: videoSection.offsetTop, behavior: 'smooth' });
  }
}, 2000);

// --- Detect Any User Input to Unmute Video ---
let volumeActivated = false;
function activateVolumeOnInput() {
  if (!volumeActivated) {
    const video = document.getElementById('main-video');
    if (video) {
      video.muted = false;
      overlayButton.style.opacity = '0';
      setTimeout(() => {
        overlayButton.style.display = 'none';
      }, 500);
      clearTimeout(overlayFadeTimeout);
    }
    volumeActivated = true;

    // Hide fallback button too
    const fallbackBtn = document.getElementById('unmute-fallback-btn');
    if (fallbackBtn) fallbackBtn.style.display = 'none';
  }
}

// Trigger on any interaction
['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
  window.addEventListener(evt, activateVolumeOnInput, { once: true });
});

// --- Bootstrap Fallback Button Support ---
const fallbackBtn = document.getElementById('unmute-fallback-btn');
if (fallbackBtn) {
  fallbackBtn.addEventListener('click', activateVolumeOnInput);
}