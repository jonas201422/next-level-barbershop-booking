document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const galleryRing = document.querySelector('.gallery-ring .ring');
  if (galleryRing) {
    const state = {
      rotation: 0,
      pointerActive: false,
      keyboardActive: false,
      pointerStartX: 0,
      pointerStartRotation: 0,
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationFrameId = null;
    let lastTimestamp = null;

    const updateInteractionState = () => {
      galleryRing.classList.toggle(
        'is-interacting',
        state.pointerActive || state.keyboardActive
      );
    };

    const setRotation = (value) => {
      if (!Number.isFinite(value)) return;
      state.rotation = value;
      if (state.rotation > 1e6 || state.rotation < -1e6) {
        state.rotation = state.rotation % 360;
      }
      galleryRing.style.setProperty('--rotation', state.rotation.toFixed(3));
    };

    const autoSpinStep = (timestamp) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }

      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!state.pointerActive && !state.keyboardActive) {
        const speed = 0.02; // degrees per millisecond
        setRotation(state.rotation + delta * speed);
      }

      animationFrameId = window.requestAnimationFrame(autoSpinStep);
    };

    const startAutoSpin = () => {
      if (reduceMotion.matches) {
        return;
      }
      if (animationFrameId !== null) {
        return;
      }
      lastTimestamp = null;
      animationFrameId = window.requestAnimationFrame(autoSpinStep);
    };

    const stopAutoSpin = () => {
      if (animationFrameId === null) {
        return;
      }
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
      lastTimestamp = null;
    };

    const handlePointerDown = (event) => {
      if (event.button !== undefined && event.button !== 0) {
        return;
      }
      event.preventDefault();
      state.pointerActive = true;
      state.pointerStartX = event.clientX;
      state.pointerStartRotation = state.rotation;
      if (galleryRing.setPointerCapture) {
        try {
          galleryRing.setPointerCapture(event.pointerId);
        } catch (error) {
          // Ignore browsers that do not support pointer capture.
        }
      }
      updateInteractionState();
    };

    const handlePointerMove = (event) => {
      if (!state.pointerActive) {
        return;
      }
      const deltaX = event.clientX - state.pointerStartX;
      setRotation(state.pointerStartRotation + deltaX * 0.35);
    };

    const endPointerInteraction = (event) => {
      if (!state.pointerActive) {
        return;
      }
      state.pointerActive = false;
      if (
        event.pointerId !== undefined &&
        galleryRing.releasePointerCapture &&
        galleryRing.hasPointerCapture &&
        galleryRing.hasPointerCapture(event.pointerId)
      ) {
        galleryRing.releasePointerCapture(event.pointerId);
      }
      updateInteractionState();
    };

    const handleFocus = () => {
      state.keyboardActive = true;
      updateInteractionState();
    };

    const handleBlur = () => {
      state.keyboardActive = false;
      updateInteractionState();
    };

    const handleKeyDown = (event) => {
      const step = event.shiftKey ? 36 : 18;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setRotation(state.rotation - step);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setRotation(state.rotation + step);
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stopAutoSpin();
      } else {
        startAutoSpin();
      }
    };

    const handleMotionPreference = (event) => {
      if (event.matches) {
        stopAutoSpin();
      } else {
        startAutoSpin();
      }
    };

    galleryRing.addEventListener('pointerdown', handlePointerDown);
    galleryRing.addEventListener('pointermove', handlePointerMove);
    galleryRing.addEventListener('pointerup', endPointerInteraction);
    galleryRing.addEventListener('pointercancel', endPointerInteraction);
    galleryRing.addEventListener('pointerleave', endPointerInteraction);
    galleryRing.addEventListener('focus', handleFocus);
    galleryRing.addEventListener('blur', handleBlur);
    galleryRing.addEventListener('keydown', handleKeyDown);

    document.addEventListener('visibilitychange', handleVisibility);

    if (typeof reduceMotion.addEventListener === 'function') {
      reduceMotion.addEventListener('change', handleMotionPreference);
    } else if (typeof reduceMotion.addListener === 'function') {
      reduceMotion.addListener(handleMotionPreference);
    }

    updateInteractionState();
    handleMotionPreference(reduceMotion);
  }
});
