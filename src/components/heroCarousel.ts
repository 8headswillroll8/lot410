export function setupHeroCarousel() {
  const heroCarousel = document.getElementById("hero-carousel");

  let lastKnownScrollPosition = 0;

  document.addEventListener("scroll", () => {
    lastKnownScrollPosition = window.scrollY;

    const negativePosition = lastKnownScrollPosition * -1;

    if (heroCarousel) {
      heroCarousel.style.transform = `translateX(${negativePosition}px)`;
    }
  });
}
