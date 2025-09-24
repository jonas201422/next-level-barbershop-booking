document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const galleryScroller = document.querySelector('.gallery-scroller');
  if (galleryScroller) {
    setupGalleryAutoScroll(galleryScroller);
  }
});

function setupGalleryAutoScroll(scroller) {
  const track = scroller.querySelector('.gallery-track');
  if (!track) return;

  const originalItems = Array.from(track.children);
  if (originalItems.length < 2) return;

  originalItems.forEach((item) => {
    const clone = item.cloneNode(true);
    if (clone instanceof HTMLElement) {
      clone.setAttribute('aria-hidden', 'true');
    }
    track.appendChild(clone);
  });

  const updateAnimation = () => {
    const scrollDistance = track.scrollWidth / 2;
    if (!scrollDistance) {
      return;
    }

    track.style.setProperty('--scroll-distance', `${scrollDistance}px`);

    const baseSpeed = parseFloat(scroller.dataset.speed || '80');
    const safeSpeed = Number.isFinite(baseSpeed) && baseSpeed > 0 ? baseSpeed : 80;
    const durationInSeconds = scrollDistance / safeSpeed;
    const clampedDuration = Math.max(durationInSeconds, 12);

    track.style.setProperty('--scroll-duration', `${clampedDuration}s`);
  };

  const onImageLoad = () => updateAnimation();

  track.querySelectorAll('img').forEach((img) => {
    if (img.complete) {
      return;
    }
    img.addEventListener('load', onImageLoad, { once: true });
  });

  updateAnimation();
  window.addEventListener('resize', () => requestAnimationFrame(updateAnimation));

  scroller.classList.add('is-ready');
}
