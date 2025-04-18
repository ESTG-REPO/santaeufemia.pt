 document.addEventListener("DOMContentLoaded", function () {
    const section = document.getElementById("video05-4");
    const video = document.getElementById("main-video");
    const overlay = document.getElementById("unmute-overlay");

    if (!video || !section) {
      console.warn("Video or section not found.");
      return;
    }

    let volumeActivated = false;
    let scrollCompleted = false;

    function tryUnmuteVideo() {
      if (volumeActivated) return;
      console.log("Trying to unmute video...");

      video.muted = false;
      video.volume = 1.0;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Video successfully unmuted.");
            volumeActivated = true;
          })
          .catch((err) => {
            console.warn("Unmute failed, showing overlay fallback.");
            showOverlayFallback();
          });
      }
    }

    function showOverlayFallback() {
      if (!overlay || volumeActivated) return;

      overlay.style.display = "block";
      const activate = () => {
        video.muted = false;
        video.volume = 1.0;
        video.play();
        overlay.style.display = "none";
        volumeActivated = true;
        console.log("User triggered unmute via overlay.");
        document.removeEventListener("click", activate);
        overlay.removeEventListener("click", activate);
      };

      document.addEventListener("click", activate);
      overlay.addEventListener("click", activate);
    }

    function isSectionVisible() {
      const rect = section.getBoundingClientRect();
      const winH = window.innerHeight || document.documentElement.clientHeight;
      return rect.top < winH * 0.75 && rect.bottom > winH * 0.25;
    }

    function autoScrollToVideo() {
      if (scrollCompleted) return;
      console.log("Auto-scrolling to video section...");
      scrollCompleted = true;

      section.scrollIntoView({ behavior: "smooth", block: "start" });

      setTimeout(() => {
        if (!isSectionVisible()) {
          console.log("Scroll incomplete, retrying...");
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          console.log("Section successfully in view.");
        }

        tryUnmuteVideo();
      }, 1500);
    }

    // Trigger scroll after 3 seconds
    setTimeout(autoScrollToVideo, 3000);

    // Also detect if user manually scrolls to section
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              console.log("User/view reached section.");
              tryUnmuteVideo();
            }
          });
        },
        { threshold: 0.5 }
      );

      setTimeout(() => observer.observe(section), 500);
    } else {
      // Fallback if IntersectionObserver not supported
      window.addEventListener("scroll", () => {
        if (isSectionVisible()) {
          tryUnmuteVideo();
        }
      });
    }
  });