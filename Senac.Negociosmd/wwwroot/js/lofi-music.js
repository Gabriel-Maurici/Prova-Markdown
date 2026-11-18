const CHORDS = [
  [130.81, 164.81, 196, 246.94],
  [110, 130.81, 164.81, 196],
  [87.31, 110, 130.81, 164.81],
  [98, 123.47, 146.83, 196]
];

export class LofiMusic {
  #audioContext = null;
  #masterGain = null;
  #noiseBuffer = null;
  #scheduler = null;
  #nextStepTime = 0;
  #step = 0;
  #enabled = false;

  get enabled() {
    return this.#enabled;
  }

  async toggle() {
    if (this.#enabled) {
      this.#disable();
      return false;
    }

    this.#initialize();
    await this.#audioContext.resume();
    this.#enabled = true;
    this.#masterGain.gain.setTargetAtTime(0.18, this.#audioContext.currentTime, 0.35);
    this.#nextStepTime = this.#audioContext.currentTime + 0.08;
    this.#scheduler = window.setInterval(() => this.#scheduleAhead(), 100);
    this.#scheduleAhead();
    return true;
  }

  #initialize() {
    if (this.#audioContext) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) throw new Error('Este navegador não oferece suporte à reprodução de áudio.');

    this.#audioContext = new AudioContext();
    this.#masterGain = this.#audioContext.createGain();
    this.#masterGain.gain.value = 0;
    this.#masterGain.connect(this.#audioContext.destination);
    this.#noiseBuffer = this.#createNoiseBuffer();
    this.#startVinylTexture();
  }

  #createNoiseBuffer() {
    const buffer = this.#audioContext.createBuffer(1, this.#audioContext.sampleRate * 2, this.#audioContext.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < samples.length; index++) {
      samples[index] = (Math.random() * 2 - 1) * 0.35;
    }
    return buffer;
  }

  #startVinylTexture() {
    const source = this.#audioContext.createBufferSource();
    const filter = this.#audioContext.createBiquadFilter();
    const textureGain = this.#audioContext.createGain();
    source.buffer = this.#noiseBuffer;
    source.loop = true;
    filter.type = 'lowpass';
    filter.frequency.value = 1800;
    textureGain.gain.value = 0.006;
    source.connect(filter);
    filter.connect(textureGain);
    textureGain.connect(this.#masterGain);
    source.start();
  }

  #scheduleAhead() {
    if (!this.#enabled) return;

    const horizon = this.#audioContext.currentTime + 0.5;
    while (this.#nextStepTime < horizon) {
      this.#scheduleStep(this.#step, this.#nextStepTime);
      this.#step = (this.#step + 1) % 64;
      this.#nextStepTime += 0.5;
    }
  }

  #scheduleStep(step, time) {
    const chordIndex = Math.floor(step / 16);
    const chord = CHORDS[chordIndex];
    const positionInChord = step % 16;

    if (positionInChord === 0) {
      chord.forEach((frequency, index) => {
        this.#scheduleTone(frequency, time, 0.012, 0.9, 7.5, index === 0 ? 'sine' : 'triangle');
      });
      this.#scheduleTone(chord[0] / 2, time, 0.04, 0.12, 3.6, 'sine');
    }

    if (positionInChord % 2 === 0) {
      const noteIndex = (positionInChord / 2 + chordIndex) % chord.length;
      this.#scheduleTone(chord[noteIndex] * 2, time, 0.035, 0.025, 0.42, 'sine');
    }

    if (positionInChord % 4 === 0) {
      this.#scheduleKick(time);
    } else if (positionInChord % 4 === 2) {
      this.#scheduleNoise(time, 0.012, 0.16, 6200);
    }
  }

  #scheduleTone(frequency, time, volume, attack, release, type) {
    const oscillator = this.#audioContext.createOscillator();
    const envelope = this.#audioContext.createGain();
    const filter = this.#audioContext.createBiquadFilter();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, time);
    filter.type = 'lowpass';
    filter.frequency.value = 2400;
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(volume, time + attack);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + attack + release);
    oscillator.connect(filter);
    filter.connect(envelope);
    envelope.connect(this.#masterGain);
    oscillator.start(time);
    oscillator.stop(time + attack + release + 0.05);
  }

  #scheduleKick(time) {
    const oscillator = this.#audioContext.createOscillator();
    const envelope = this.#audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(95, time);
    oscillator.frequency.exponentialRampToValueAtTime(48, time + 0.18);
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(0.075, time + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + 0.28);
    oscillator.connect(envelope);
    envelope.connect(this.#masterGain);
    oscillator.start(time);
    oscillator.stop(time + 0.3);
  }

  #scheduleNoise(time, volume, duration, cutoff) {
    const source = this.#audioContext.createBufferSource();
    const filter = this.#audioContext.createBiquadFilter();
    const envelope = this.#audioContext.createGain();
    source.buffer = this.#noiseBuffer;
    filter.type = 'highpass';
    filter.frequency.value = cutoff;
    envelope.gain.setValueAtTime(volume, time);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(this.#masterGain);
    source.start(time);
    source.stop(time + duration + 0.02);
  }

  #disable() {
    this.#enabled = false;
    window.clearInterval(this.#scheduler);
    this.#scheduler = null;
    this.#masterGain.gain.setTargetAtTime(0, this.#audioContext.currentTime, 0.12);
  }
}
