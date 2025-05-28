// Scroll to Video Section Handler
export default function initScrollToVideo() {
  let hasUserScrolled = false;
  let scrollTimeout;
  const VIDEO_SECTION_ID = 'video05-4';

  // Function to scroll to video section
  function scrollToVideoSection() {
    const videoSection = document.getElementById(VIDEO_SECTION_ID);
    if (videoSection) {
      videoSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Handle user scroll
  function handleScroll() {
    hasUserScrolled = true;
    // Clear any existing scroll timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
  }

  // Initialize scroll handling
  function init() {
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Wait for page load
    if (document.readyState === 'complete') {
      initAutoScroll();
    } else {
      window.addEventListener('load', initAutoScroll);
    }
  }

  // Initialize auto-scroll functionality
  function initAutoScroll() {
    scrollTimeout = setTimeout(() => {
      if (!hasUserScrolled) {
        scrollToVideoSection();
      }
    }, 2000); // 2 seconds delay
  }

  // Start the module
  init();

  // Cleanup function
  return function cleanup() {
    window.removeEventListener('scroll', handleScroll);
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
  };
}

// Fallback for non-module environments
if (typeof window !== 'undefined') {
  if (!window.initScrollToVideo) {
    window.initScrollToVideo = initScrollToVideo;
  }
}
