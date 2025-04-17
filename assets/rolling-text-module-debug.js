    const text = document.getElementById("scroll-text");

    let pos = window.innerWidth;
    const speed = 1; // Adjust speed here (pixels per frame)

    function animate() {
      pos -= speed;
      if (pos < -text.offsetWidth) {
        pos = window.innerWidth;
      }
      text.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(animate);
    }

    animate();