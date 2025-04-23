function getRandomImageUrls() {
  const cdns = [
    { base: "https://cdn-dia1.xperia.pt/Festa-", count: 125 },
    { base: "https://cdn-dia2.xperia.pt/Festa-", count: 110 },
    // cdn-dia3 has no images yet
  ];

  let images = [];

  cdns.forEach(cdn => {
    for (let i = 1; i <= cdn.count; i++) {
      images.push(`${cdn.base}${i}.jpg`);
    }
  });

  // Shuffle the array randomly
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }

  return images;
}

$(document).ready(function() {
  const imageUrls = getRandomImageUrls();

  imageUrls.forEach(url => {
    $('.carousel').append(`<div><img src="${url}" alt="Festa"></div>`);
  });

  $('.carousel').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    dots: false,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      }
    ]
  });
});
