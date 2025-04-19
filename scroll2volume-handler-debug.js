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
overlayButton.style.transition = 'all 0.3s ease-in-out';

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

// Append the button to the body (or anywhere you want in the document)
document.body.appendChild(overlayButton);

// Function to show the overlay button when the video is muted
const showOverlayButton = () => {
  const video = document.getElementById('main-video');
  if (video && video.muted) {
    overlayButton.style.display = 'block'; // Show the overlay when the video is muted
  }
};

// Listen for the unmute action when the overlay button is clicked
overlayButton.addEventListener('click', function () {
  const video = document.getElementById('main-video');
  if (video) {
    video.muted = false; // Unmute the video
    overlayButton.style.display = 'none'; // Hide the overlay button after unmuting
  }
});

// Detect when the page is loaded and check if the video is muted
window.addEventListener('load', showOverlayButton);

// Additionally, monitor for video changes and show overlay if muted
const video = document.getElementById('main-video');
if (video) {
  video.addEventListener('play', showOverlayButton);
  video.addEventListener('pause', showOverlayButton);
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
}, 2000); // 2 seconds delay for auto-scroll

// --- Detect User Input to Activate Video Volume ---

let volumeActivated = false; // Flag to check if volume was activated

const activateVolumeOnInput = () => {
  if (!volumeActivated) {
    const video = document.getElementById('main-video');
    if (video) {
      video.muted = false; // Unmute the video
      volumeActivated = true; // Set flag to prevent further triggering
    }
  }
};

// Listen for any type of user interaction: click, scroll, touch, etc.
window.addEventListener('click', activateVolumeOnInput);
window.addEventListener('touchstart', activateVolumeOnInput);
window.addEventListener('scroll', activateVolumeOnInput);
window.addEventListener('keydown', activateVolumeOnInput); // For keyboard interaction