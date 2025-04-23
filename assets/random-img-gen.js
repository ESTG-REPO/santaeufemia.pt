<script>
const cdns = [
  { base: "https://cdn-dia1.xperia.pt/Festa-", count: 125 },
  { base: "https://cdn-dia2.xperia.pt/Festa-", count: 110 },
  // cdn-dia3 can be added later: { base: "https://cdn-dia3.xperia.pt/Festa-", count: 100 }
];

let imagePool = [];

// Generate all image URLs
function generateImagePool() {
  imagePool = [];
  cdns.forEach(cdn => {
    for (let i = 1; i <= cdn.count; i++) {
      imagePool.push(`${cdn.base}${i}.jpg`);
    }
  });
  shuffleArray(imagePool);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

let currentIndex = 0;

function showNextImage() {
  if (imagePool.length === 0) return;

  const currentImg = document.getElementById('carousel-image');
  currentImg.src = imagePool[currentIndex];

  // Preload the next image
  const nextIndex = (currentIndex + 1) % imagePool.length;
  const preloader = new Image();
  preloader.src = imagePool[nextIndex];

  currentIndex = nextIndex;
}

// Initialize
generateImagePool();
showNextImage();
setInterval(showNextImage, 3000); // change every 3 seconds
</script>
