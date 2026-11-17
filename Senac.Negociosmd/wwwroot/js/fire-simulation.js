const MIN_INTENSITY = 0;
const MAX_INTENSITY = 100;
const INCREASE_PER_SECOND = 30;
const DECREASE_PER_SECOND = 20;

export class FireSimulation {
  #intensity = MIN_INTENSITY;
  #isActive = false;

  get intensity() {
    return this.#intensity;
  }

  get isActive() {
    return this.#isActive;
  }

  get isSettled() {
    return !this.#isActive && this.#intensity === MIN_INTENSITY;
  }

  setActive(isActive) {
    this.#isActive = isActive;
  }

  update(deltaSeconds) {
    const rate = this.#isActive ? INCREASE_PER_SECOND : -DECREASE_PER_SECOND;
    this.#intensity = Math.min(
      MAX_INTENSITY,
      Math.max(MIN_INTENSITY, this.#intensity + rate * deltaSeconds)
    );
  }
}
