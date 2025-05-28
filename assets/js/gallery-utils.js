  document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery');

    if (!gallery) {
      console.error('Gallery container (#gallery) not found!');
      return;
    }

    for (let i = 1; i <= 125; i++) {
      const item = document.createElement('div');
      item.className = 'gallery-item position-relative';

      const imageUrl = `https://cdn-dia1.xperia.pt/Festa-${i}.jpg`;
      const hdUrl    = `https://cdn-dia1-hd.xperia.pt/Festa-${i}.jpg`;
      const filename = `Festa-${i}.jpg`;

      // Fancybox link
      const link = document.createElement('a');
      link.href = imageUrl;
      link.setAttribute('data-fancybox', 'gallery');
      link.setAttribute('data-caption', `Festa ${i} - Dia 1`);
      link.addEventListener('click', e => e.preventDefault()); // Prevent default nav

      // Image with lazy loading
      const img = document.createElement('img');
      img.src        = imageUrl;
      img.alt        = `Festa ${i} - Dia 1`;
      img.loading    = 'lazy';

      link.appendChild(img);
      item.appendChild(link);

      // Download button
      const btn = document.createElement('button');
      btn.className = 'gallery-download-btn';
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
             class="bi bi-download" viewBox="0 0 16 16">
          <path d="M.5 9.9a.5.5 0 0 1 .5.5V13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10.4a.5.5 0 0 1 1 0V13a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V10.4a.5.5 0 0 1 .5-.5z"/>
          <path fill="white" d="M7.646 10.854a.5.5 0 0 0 .708 0l3.5-3.5a.5.5 0 0 0-.708-.708L8.5 9.293V1.5a.5.5 
            0 0 0-1 0v7.793L5.354 6.646a.5.5 0 1 0-.708.708l3.5 3.5z"/>
        </svg>
      `;
      // Store URL & filename
      btn.dataset.url      = hdUrl;
      btn.dataset.filename = filename;

      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const url = this.dataset.url;
        const name = this.dataset.filename;
        // 1) Open HD image in new tab
        window.open(url, '_blank');
        // 2) Trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });

      item.appendChild(btn);
      gallery.appendChild(item);
    }

    // Initialize Fancybox
    if (window.Fancybox) {
      Fancybox.bind('[data-fancybox="gallery"]', {
        loop: true,
        animationEffect: "fade",
        transitionEffect: "fade",
        keyboard: {
          Escape: "close", Delete: "close", Backspace: "close",
          PageUp: "next", PageDown: "prev",
          ArrowUp: "next", ArrowDown: "prev",
          ArrowRight: "next", ArrowLeft: "prev"
        }
      });
    } else {
      console.error('Fancybox is not defined. Make sure Fancybox script is loaded.');
    }
  });
