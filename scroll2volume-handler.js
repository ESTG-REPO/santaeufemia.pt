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

      console.log("Attempting to unmute video...");

      video.muted = false;
      video.volume = 1.0;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Video unmuted successfully.");
          })
          .catch((error) => {
            console.warn("Auto unmute failed. Showing overlay.", error);
            showUnmuteOverlay();
          });
      }
    }

    function showUnmuteOverlay() {
      if (overlay) {
        overlay.style.display = "block";

        const activateSound = () => {
          console.log("User tapped to enable sound.");
          video.muted = false;
          video.volume = 1.0;
          video.play();
          overlay.style.display = "none";
          document.removeEventListener("click", activateSound);
          overlay.removeEventListener("click", activateSound);
        };

        document.addEventListener("click", activateSound);
        overlay.addEventListener("click", activateSound);
      }
    }

    // IntersectionObserver
    if ("IntersectionObserver" in window) {
      console.log("Using IntersectionObserver...");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              console.log("Section is in view.");
              tryUnmuteVideo();
            }
          });
        },
        { threshold: 0.5 }
      );

      // Wait a moment to ensure DOM is ready for observation
      setTimeout(() => observer.observe(section), 100);
    } else {
      // Fallback scroll detection
      console.log("Fallback scroll detection active.");
      window.addEventListener("scroll", function () {
        const rect = section.getBoundingClientRect();
        const winH = window.innerHeight || document.documentElement.clientHeight;

        if (
          rect.top < winH * 0.5 &&
          rect.bottom > winH * 0.5
        ) {
          console.log("Section reached via scroll.");
          tryUnmuteVideo();
        }
      });
    }
  });