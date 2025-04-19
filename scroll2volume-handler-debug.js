// Create the unmute overlay button programmatically
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

// Hover effect
overlayButton.onmouseover = () => {
  overlayButton.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  overlayButton.style.transform = 'translate(-50%, -50%) scale(1.05)';
};

overlayButton.onmouseout = () => {
  overlayButton.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
  overlayButton.style.transform = 'translate(-50%, -50%)';
};

// Set the button text
overlayButton.innerText = 'Clica para ativar SOM';

// Append the button to the body
document.body.appendChild(overlayButton);

// Function to show the overlay with fade-in
const showOverlayButton = () => {
  const video = document.getElementById('main-video');
  if (video && video.muted) {
    overlayButton.style.display = 'block';
    setTimeout(() => {
      overlayButton.style.opacity = '1';
    }, 10);

    // Auto-hide after 5 seconds if not clicked
    setTimeout(() => {
      if (overlayButton.style.display === 'block') {
        overlayButton.style.opacity = '0';
        setTimeout(() => {
          overlayButton.style.display = 'none';
        }, 500);
      }
    }, 5000);
  }
};

// Listen for the unmute action when the overlay button is clicked
overlayButton.addEventListener('click', function () {
  const video = document.getElementById('main-video');
  if (video) {
    video.muted = false;
    overlayButton.style.opacity = '0';
    setTimeout(() => {
      overlayButton.style.display = 'none';
    }, 500);
  }
});

// Detect when the page is loaded and show overlay if muted
window.addEventListener('load', showOverlayButton);

// Also show overlay again if video is muted later
const video = document.getElementById('main-video');
if (video) {
  video.addEventListener('play', showOverlayButton);
  video.addEventListener('pause', showOverlayButton);
  video.addEventListener('volumechange', showOverlayButton);
}

// --- Auto-Scroll After 2 Seconds ---
setTimeout(() => {
  const videoSection = document.getElementById('video05-4');
  if (videoSection) {
    window.scrollTo({
      top: videoSection.offsetTop,
      behavior: 'smooth'
    });
  }
}, 2000);

// --- Detect Any User Input to Unmute Video ---
let volumeActivated = false;

const activateVolumeOnInput = () => {
  if (!volumeActivated) {
    const video = document.getElementById('main-video');
    if (video) {
      video.muted = false;
      overlayButton.style.opacity = '0';
      setTimeout(() => {
        overlayButton.style.display = 'none';
      }, 500);
    }
    volumeActivated = true;
  }
};

['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
  window.addEventListener(evt, activateVolumeOnInput, { once: true });
});