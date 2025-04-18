  document.addEventListener("DOMContentLoaded", function () {
    const sectionId = "video05-4";
    const navbarId = "menu03-2";
    const videoId = "main-video"; // Targeting the foreground video with this ID
    const expectedVideoSrc = "https://cdn.xperia.pt/tascadosirol-20250417-0001.mp4"; // Expected source URL

    setTimeout(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        console.log("User prefers reduced motion. Skipping auto-scroll.");
        return;
      }

      const section = document.getElementById(sectionId);
      const navbar = document.getElementById(navbarId);
      const video = document.getElementById(videoId);
      const videoSrc = video?.querySelector("source")?.getAttribute("src") || "";

      if (!section) {
        console.warn(`#${sectionId} not found.`);
        return;
      }

      scrollToSection(section);
      hideNavbar(navbar);

      setTimeout(() => {
        if (video && videoSrc === expectedVideoSrc) {
          tryUnmuteVideo(video);
        } else {
          console.warn(`Video #${videoId} not found or src doesn't match.`);
        }
      }, 1500); // Delay after scroll
    }, 3000);

    // Show navbar again if user scrolls to top
    window.addEventListener("scroll", function () {
      const navbar = document.getElementById(navbarId);
      if (window.scrollY === 0 && navbar) {
        navbar.style.display = "block";
        navbar.style.opacity = "1";
        console.log("Navbar shown.");
      }
    });

    // Helpers
    function scrollToSection(section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      console.log(`Scrolled to #${sectionId}`);
    }

    function hideNavbar(navbar) {
      if (navbar) {
        navbar.style.transition = "opacity 0.5s ease";
        navbar.style.opacity = "0";
        setTimeout(() => {
          navbar.style.display = "none";
          console.log("Navbar hidden.");
        }, 500);
      }
    }

    function tryUnmuteVideo(video) {
      video.muted = false;
      video.volume = 1.0;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Video playing with sound.");
          })
          .catch((error) => {
            console.warn("Autoplay with sound failed.", error);
            showUnmuteOverlay(video);
          });
      }
    }

    function showUnmuteOverlay(video) {
      const overlay = document.getElementById("unmute-overlay");
      if (!overlay) return;

      overlay.style.display = "block";

      overlay.addEventListener("click", function () {
        video.muted = false;
        video.volume = 1.0;
        video.play();
        overlay.style.display = "none";
        console.log("Sound activated manually.");
      });
    }
  });
