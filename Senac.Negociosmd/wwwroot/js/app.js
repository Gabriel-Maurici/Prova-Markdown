import { FireSimulation } from './fire-simulation.js';
import { FireRenderer } from './fire-renderer.js';

const control = document.querySelector('#fire-control');
const canvas = document.querySelector('#fire-canvas');
const intensityValue = document.querySelector('#intensity-value');
const intensityTrack = document.querySelector('#intensity-track');
const intensityFill = document.querySelector('#intensity-fill');

const simulation = new FireSimulation();
const renderer = new FireRenderer(canvas);
let activePointerId = null;
let activeSource = null;
let animationFrame = null;
let previousFrameTime = null;
let elapsedSeconds = 0;
let lastAnnouncedIntensity = -1;

function beginInteraction(source, pointerId = null) {
  if (simulation.isActive) {
    return;
  }

  if (source === 'pointer') {
    activePointerId = pointerId;
  }

  activeSource = source;
  simulation.setActive(true);
  control.classList.add('is-active');
  control.setAttribute('aria-pressed', 'true');
  requestAnimation();
}

function endInteraction(source = null, pointerId = null) {
  if (!simulation.isActive) {
    return;
  }

  if (source !== null && source !== activeSource) {
    return;
  }

  if (activeSource === 'pointer' && source === 'pointer' && activePointerId !== pointerId) {
    return;
  }

  activePointerId = null;
  activeSource = null;
  simulation.setActive(false);
  control.classList.remove('is-active');
  control.setAttribute('aria-pressed', 'false');
  requestAnimation();
}

function requestAnimation() {
  if (animationFrame === null) {
    animationFrame = window.requestAnimationFrame(renderFrame);
  }
}

function renderFrame(timestamp) {
  animationFrame = null;
  const deltaSeconds = previousFrameTime === null ? 0 : (timestamp - previousFrameTime) / 1000;
  previousFrameTime = timestamp;
  elapsedSeconds += deltaSeconds;

  simulation.update(deltaSeconds);
  const intensity = simulation.intensity;
  renderer.draw(intensity, elapsedSeconds);
  intensityFill.style.width = `${intensity}%`;
  intensityTrack.setAttribute('aria-valuenow', String(Math.round(intensity)));

  const roundedIntensity = Math.round(intensity);
  if (roundedIntensity !== lastAnnouncedIntensity) {
    intensityValue.value = `${roundedIntensity}%`;
    lastAnnouncedIntensity = roundedIntensity;
  }

  if (!simulation.isSettled) {
    animationFrame = window.requestAnimationFrame(renderFrame);
  } else {
    previousFrameTime = null;
    intensityFill.style.width = '0%';
    renderer.draw(0, elapsedSeconds);
  }
}

control.addEventListener('pointerdown', event => {
  if (event.pointerType === 'mouse' && event.button !== 0) {
    return;
  }

  event.preventDefault();
  beginInteraction('pointer', event.pointerId);
});

control.addEventListener('pointerleave', event => {
  endInteraction('pointer', event.pointerId);
});

window.addEventListener('pointerup', event => {
  endInteraction('pointer', event.pointerId);
});

window.addEventListener('pointercancel', event => {
  endInteraction('pointer', event.pointerId);
});

window.addEventListener('keydown', event => {
  const target = event.target;
  const isEditingText = target instanceof HTMLElement
    && (target.isContentEditable || target.matches('input, textarea, select'));

  if (event.code === 'Space' && !event.repeat && !isEditingText) {
    event.preventDefault();
    beginInteraction('keyboard');
  }
});

window.addEventListener('keyup', event => {
  if (event.code === 'Space' && activeSource === 'keyboard') {
    event.preventDefault();
    endInteraction('keyboard');
  }
});

window.addEventListener('blur', () => {
  endInteraction();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    endInteraction();
  }
});

control.setAttribute('aria-pressed', 'false');
renderer.draw(0, 0);
