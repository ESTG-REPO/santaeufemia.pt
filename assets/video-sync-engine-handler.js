// Get references to the videos and controls
const bgVideo = document.getElementById('bg-video');
const mainVideo = document.getElementById('main-video');
const playPauseBtn = document.getElementById('play-pause-btn');
const muteBtn = document.getElementById('mute-btn');
const volumeControl = document.getElementById('volume-control');
const fullscreenBtn = document.getElementById('fullscreen-btn');

// Sync videos on buffering
function syncOnBuffering() {
  if (bgVideo.paused || mainVideo.paused) return;

  const bgVideoTime = bgVideo.currentTime;
  const mainVideoTime = mainVideo.currentTime;
  const timeDifference = bgVideoTime - mainVideoTime;

  if (Math.abs(timeDifference) > 0.02) {  // 20 milliseconds threshold
    mainVideo.currentTime = bgVideoTime;
  }
}

// Event listeners for video control buttons
playPauseBtn.addEventListener('click', () => {
  if (bgVideo.paused) {
    bgVideo.play();
    mainVideo.play();
    playPauseBtn.textContent = 'Pause';
  } else {
    bgVideo.pause();
    mainVideo.pause();
    playPauseBtn.textContent = 'Play';
  }
});

muteBtn.addEventListener('click', () => {
  bgVideo.muted = !bgVideo.muted;
  mainVideo.muted = !mainVideo.muted;
  muteBtn.textContent = bgVideo.muted ? 'Unmute' : 'Mute';
});

volumeControl.addEventListener('input', () => {
  bgVideo.volume = volumeControl.value;
  mainVideo.volume = volumeControl.value;
});

fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
});

// Handle errors for both videos
bgVideo.addEventListener('error', () => {
  alert('An error occurred while loading the background video.');
});

mainVideo.addEventListener('error', () => {
  alert('An error occurred while loading the foreground video.');
});

// Synchronize videos using requestAnimationFrame for smoother sync
function syncVideos() {
  if (bgVideo.paused || mainVideo.paused) {
    return;
  }

  const bgVideoTime = bgVideo.currentTime;
  const mainVideoTime = mainVideo.currentTime;

  const timeDifference = bgVideoTime - mainVideoTime;
  if (Math.abs(timeDifference) > 0.02) {
    mainVideo.currentTime = bgVideoTime;
  }

  // Request the next animation frame for smoother syncing
  requestAnimationFrame(syncVideos);
}

// Smooth fade-in transition
function fadeIn() {
  bgVideo.style.opacity = 0;
  mainVideo.style.opacity = 0;
  setTimeout(() => {
    bgVideo.style.transition = 'opacity 1s ease';
    mainVideo.style.transition = 'opacity 1s ease';
    bgVideo.style.opacity = 1;
    mainVideo.style.opacity = 1;
  }, 100);
}

// Listen for video play events and fade in when they start
bgVideo.addEventListener('play', fadeIn);
mainVideo.addEventListener('play', fadeIn);

// Listen for video 'ended' events for looping synchronization
bgVideo.addEventListener('ended', () => {
  mainVideo.currentTime = bgVideo.currentTime;
  mainVideo.play();
});

mainVideo.addEventListener('ended', () => {
  bgVideo.currentTime = mainVideo.currentTime;
  bgVideo.play();
});

// Sync videos on buffering and playback
bgVideo.addEventListener('waiting', syncOnBuffering);
mainVideo.addEventListener('waiting', syncOnBuffering);
bgVideo.addEventListener('playing', syncOnBuffering);
mainVideo.addEventListener('playing', syncOnBuffering);

// Initial synchronization when the videos are ready to play
bgVideo.addEventListener('canplay', () => {
  requestAnimationFrame(syncVideos);
});

mainVideo.addEventListener('canplay', () => {
  requestAnimationFrame(syncVideos);
});