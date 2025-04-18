  document.addEventListener("DOMContentLoaded", function () {
    const sectionId = "video05-4";
    const videoId = "main-video";
    const overlayId = "unmute-overlay";
    const video = document.getElementById(videoId);
    const section = document.getElementById(sectionId);
    const overlay = document.getElementById(overlayId);
    let triggered = false;

    if (!video || !section) {
      console.warn("Video or section not found.");
      return;
    }

    function tryUnmuteVideo() {
      if (triggered) return;
      triggered = true;
      video.muted = false;
      video.volume = 1.0;

      // Try to play silently (in case browser requires it)
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Video attempted with sound.");
          })
          .catch((error) => {
            // Show fallback if browser blocks sound
            console.warn("Auto unmute failed. Awaiting user interaction.");
            showUnmuteOverlay();
          });
      }
    }

    function showUnmuteOverlay() {
      if (overlay) {
        overlay.style.display = "block";

        const activateSound = () => {
          video.muted = false;
          video.volume = 1.0;
          video.play();
          overlay.style.display = "none";
          console.log("User triggered unmute.");
          document.removeEventListener("click", activateSound);
          overlay.removeEventListener("click", activateSound);
        };

        // First click anywhere enables sound
        document.addEventListener("click", activateSound);
        overlay.addEventListener("click", activateSound);
      }
    }

    // IntersectionObserver for modern scroll detection
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              tryUnmuteVideo();
            }
          });
        },
        { threshold: 0.5 }
      );
      observer.observe(section);
    } else {
      // Fallback for older browsers
      window.addEventListener("scroll", function () {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        if (
          rect.top < windowHeight * 0.5 &&
          rect.bottom > windowHeight * 0.5
        ) {
          tryUnmuteVideo();
        }
      });
    }
  });