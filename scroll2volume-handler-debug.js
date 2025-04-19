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
      if (overlayButton.style.opacity === '1') {
        overlayButton.style.opacity = '0';
        setTimeout(() => {
          overlayButton.style.display = 'none';
          showFallbackButton(); // show fallback if overlay not clicked
        }, 500);
      }
    }, 5000);
  }
};

// Click action on overlay
overlayButton.addEventListener('click', () => {
  const video = document.getElementById('main-video');
  if (video) {
    video.muted = false;
    overlayButton.style.opacity = '0';
    setTimeout(() => {
      overlayButton.style.display = 'none';
    }, 500);
  }
});

// Add fallback button below video
const showFallbackButton = () => {
  if (document.getElementById('fallback-unmute-btn')) return; // avoid duplicates

  const btn = document.createElement('button');
  btn.id = 'fallback-unmute-btn';
  btn.className = 'btn btn-dark mt-3';
  btn.innerText = 'Ativar som';
  btn.onclick = () => {
    const video = document.getElementById('main-video');
    if (video) video.muted = false;
    btn.remove(); // hide button after click
  };

  const container = document.querySelector('#video05-4 .container-fluid');
  if (container) container.appendChild(btn);
};

// Detect on page load
window.addEventListener('load', showOverlayButton);

// Monitor video status
const video = document.getElementById('main-video');
if (video) {
  video.addEventListener('play', showOverlayButton);
  video.addEventListener('pause', showOverlayButton);
  video.addEventListener('volumechange', showOverlayButton);

  // New: also allow clicking directly on video to unmute
  video.addEventListener('click', () => {
    if (video.muted) {
      video.muted = false;
      overlayButton.style.opacity = '0';
      setTimeout(() => {
        overlayButton.style.display = 'none';
      }, 500);
    }
  });
}

// Auto scroll after 2 seconds
setTimeout(() => {
  const section = document.getElementById('video05-4');
  if (section) {
    window.scrollTo({
      top: section.offsetTop,
      behavior: 'smooth'
    });
  }
}, 2000);

// Detect any interaction to unmute
let volumeActivated = false;
const activateVolumeOnInput = () => {
  if (!volumeActivated) {
    if (video) video.muted = false;
    overlayButton.style.opacity = '0';
    setTimeout(() => {
      overlayButton.style.display = 'none';
    }, 500);
    volumeActivated = true;
  }
};
['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
  window.addEventListener(evt, activateVolumeOnInput, { once: true });
});