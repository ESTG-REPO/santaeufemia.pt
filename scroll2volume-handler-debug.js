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
      overlayButton.style.opacity = '1'; // Fade in the button
    }, 10);

    // Auto-hide after 5 seconds if not clicked
    setTimeout(() => {
      if (overlayButton.style.opacity === '1') {
        overlayButton.style.opacity = '0'; // Start fading out
        setTimeout(() => {
          overlayButton.style.display = 'none'; // Hide button after fade-out
        }, 500); // Delay to allow fade-out effect
      }
    }, 5000); // 5 seconds auto-hide timer
  }
};

// Listen for the unmute action when the overlay button is clicked
overlayButton.addEventListener('click', function () {
  const video = document.getElementById('main-video');
  if (video) {
    video.muted = false;
    overlayButton.style.opacity = '0';
    setTimeout(() => {
      overlayButton.style.display = 'none'; // Hide button after unmuting
    }, 500); // Delay for fade-out
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
        overlayButton.style.display = 'none'; // Hide after unmute
      }, 500);
    }
    volumeActivated = true;
  }
};

// Detect all user inputs
['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
  window.addEventListener(evt, activateVolumeOnInput, { once: true });
});

// Fallback button HTML
const fallbackButton = document.createElement('button');
fallbackButton.className = 'btn btn-dark';
fallbackButton.id = 'unmute-fallback-button';
fallbackButton.innerText = 'Clica para ativar SOM';
fallbackButton.style.display = 'none'; // Initially hidden

// Append fallback button below the video container
document.getElementById('video05-4').appendChild(fallbackButton);

// Function to show fallback button if overlay is not available
const showFallbackButton = () => {
  fallbackButton.style.display = 'block';
  fallbackButton.addEventListener('click', function () {
    const video = document.getElementById('main-video');
    if (video) {
      video.muted = false;
      fallbackButton.style.display = 'none'; // Hide after click
    }
  });
};

// Listen for fallback button if overlay is not shown
setTimeout(() => {
  if (overlayButton.style.display === 'none') {
    showFallbackButton();
  }
}, 5000); // Show fallback button after 5 seconds if overlay is not shown