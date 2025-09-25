document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const slider = document.querySelector('.gallery-slider');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.gallery-slide'));
    const prevButton = slider.querySelector('[data-action="prev"]');
    const nextButton = slider.querySelector('[data-action="next"]');
    const progressBar = slider.querySelector('.slider-progress span');
    const interval = Number(slider.dataset.interval) || 5000;

    if (slides.length > 0) {
      let activeIndex = 0;
      let autoPlayTimer = null;
      const maxVisibleOffset = 2;

      const normaliseIndex = (index) => {
        const total = slides.length;
        return ((index % total) + total) % total;
      };

      const relativePosition = (index) => {
        const total = slides.length;
        let offset = index - activeIndex;
        if (offset > total / 2) offset -= total;
        if (offset < -total / 2) offset += total;
        return offset;
      };

      const updateSlides = () => {
        slides.forEach((slide, index) => {
          const position = relativePosition(index);
          const bounded = Math.max(
            Math.min(position, maxVisibleOffset + 1),
            -(maxVisibleOffset + 1)
          );
          slide.dataset.position = String(bounded);
          slide.setAttribute('aria-hidden', position === 0 ? 'false' : 'true');
        });
      };

      const restartProgress = () => {
        if (!progressBar) return;
        progressBar.style.transition = 'none';
        progressBar.style.transform = 'scaleX(0)';
        // force reflow to restart the animation
        void progressBar.offsetWidth;
        progressBar.style.transition = `transform ${interval}ms linear`;
        progressBar.style.transform = 'scaleX(1)';
      };

      const scheduleNext = () => {
        if (autoPlayTimer) {
          clearTimeout(autoPlayTimer);
        }
        if (slides.length <= 1) return;
        restartProgress();
        autoPlayTimer = setTimeout(() => {
          goToSlide(activeIndex + 1);
        }, interval);
      };

      const goToSlide = (index) => {
        activeIndex = normaliseIndex(index);
        updateSlides();
        scheduleNext();
      };

      const stopAutoPlay = () => {
        if (autoPlayTimer) {
          clearTimeout(autoPlayTimer);
          autoPlayTimer = null;
        }
        if (progressBar) {
          const computed = getComputedStyle(progressBar).transform;
          progressBar.style.transition = 'none';
          progressBar.style.transform = computed === 'none' ? 'scaleX(0)' : computed;
        }
      };

      const resumeAutoPlay = () => {
        scheduleNext();
      };

      if (prevButton) {
        prevButton.addEventListener('click', () => {
          goToSlide(activeIndex - 1);
        });
      }

      if (nextButton) {
        nextButton.addEventListener('click', () => {
          goToSlide(activeIndex + 1);
        });
      }

      slider.addEventListener('mouseenter', stopAutoPlay);
      slider.addEventListener('mouseleave', resumeAutoPlay);
      slider.addEventListener('focusin', stopAutoPlay);
      slider.addEventListener('focusout', resumeAutoPlay);

      updateSlides();
      scheduleNext();
    }
  }
});
