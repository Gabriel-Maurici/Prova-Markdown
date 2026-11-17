export class FireRenderer {
  #canvas;
  #context;
  #width = 0;
  #height = 0;
  #pixelRatio = 1;
  #reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor(canvas) {
    this.#canvas = canvas;
    this.#context = canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', event => {
      this.#reducedMotion = event.matches;
    });
  }

  resize() {
    const bounds = this.#canvas.getBoundingClientRect();
    this.#pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.#width = bounds.width;
    this.#height = bounds.height;
    this.#canvas.width = Math.round(this.#width * this.#pixelRatio);
    this.#canvas.height = Math.round(this.#height * this.#pixelRatio);
    this.#context.setTransform(this.#pixelRatio, 0, 0, this.#pixelRatio, 0, 0);
  }

  draw(intensity, elapsedSeconds) {
    const context = this.#context;
    const width = this.#width;
    const height = this.#height;
    context.clearRect(0, 0, width, height);

    if (intensity <= 0 || width === 0 || height === 0) {
      return;
    }

    const power = intensity / 100;
    const motionTime = this.#reducedMotion ? 0 : elapsedSeconds;
    const centerX = width / 2;
    const baseY = height * 0.76;
    const flameHeight = height * (0.16 + power * 0.38);
    const flameWidth = width * (0.09 + power * 0.11);
    const sway = Math.sin(motionTime * 3.4) * width * 0.012 * power;
    const flicker = this.#reducedMotion ? 1 : 0.91 + Math.sin(motionTime * 8.5) * 0.045 + Math.sin(motionTime * 13.2) * 0.025;

    const glow = context.createRadialGradient(centerX, baseY - flameHeight * 0.25, 0, centerX, baseY - flameHeight * 0.25, flameHeight * 1.45);
    glow.addColorStop(0, `rgba(255, 133, 53, ${0.1 + power * 0.19})`);
    glow.addColorStop(1, 'rgba(255, 95, 25, 0)');
    context.fillStyle = glow;
    context.fillRect(centerX - flameHeight * 1.5, baseY - flameHeight * 1.7, flameHeight * 3, flameHeight * 2.2);

    context.save();
    context.translate(sway, 0);
    context.scale(1, flicker);

    const outer = context.createLinearGradient(0, baseY - flameHeight, 0, baseY);
    outer.addColorStop(0, '#ffb55e');
    outer.addColorStop(0.38, '#ff792f');
    outer.addColorStop(1, '#a9301d');
    context.fillStyle = outer;
    context.beginPath();
    context.moveTo(centerX - flameWidth, baseY);
    context.bezierCurveTo(centerX - flameWidth * 1.65, baseY - flameHeight * 0.36, centerX - flameWidth * 0.08, baseY - flameHeight * 0.54, centerX + sway - flameWidth * 0.18, baseY - flameHeight);
    context.bezierCurveTo(centerX + flameWidth * 0.82, baseY - flameHeight * 0.72, centerX + flameWidth * 0.46, baseY - flameHeight * 0.44, centerX + flameWidth, baseY);
    context.closePath();
    context.fill();

    const innerWidth = flameWidth * 0.58;
    const innerHeight = flameHeight * (0.56 + power * 0.08);
    const inner = context.createLinearGradient(0, baseY - innerHeight, 0, baseY);
    inner.addColorStop(0, '#fff0a5');
    inner.addColorStop(0.45, '#ffc45e');
    inner.addColorStop(1, '#ff6b2c');
    context.fillStyle = inner;
    context.beginPath();
    context.moveTo(centerX - innerWidth, baseY);
    context.bezierCurveTo(centerX - innerWidth * 1.15, baseY - innerHeight * 0.4, centerX + innerWidth * 0.45, baseY - innerHeight * 0.56, centerX + sway * 0.55, baseY - innerHeight);
    context.bezierCurveTo(centerX + innerWidth * 0.8, baseY - innerHeight * 0.7, centerX + innerWidth * 0.72, baseY - innerHeight * 0.36, centerX + innerWidth, baseY);
    context.closePath();
    context.fill();
    context.restore();

    this.#drawLogs(context, centerX, baseY, flameWidth);
    if (!this.#reducedMotion) {
      this.#drawSparks(context, centerX, baseY - flameHeight * 0.55, flameHeight, power, elapsedSeconds);
    }
  }

  #drawLogs(context, centerX, baseY, flameWidth) {
    const logWidth = flameWidth * 1.65;
    context.save();
    context.lineCap = 'round';
    context.lineWidth = Math.max(5, flameWidth * 0.34);
    context.strokeStyle = '#4d3025';
    context.beginPath();
    context.moveTo(centerX - logWidth * 0.72, baseY + 3);
    context.lineTo(centerX + logWidth * 0.62, baseY + 9);
    context.moveTo(centerX + logWidth * 0.72, baseY + 3);
    context.lineTo(centerX - logWidth * 0.62, baseY + 9);
    context.stroke();
    context.restore();
  }

  #drawSparks(context, centerX, originY, flameHeight, power, elapsedSeconds) {
    const sparkCount = Math.floor(power * 7);
    for (let index = 0; index < sparkCount; index++) {
      const phase = elapsedSeconds * (0.75 + index * 0.09) + index * 2.4;
      const rise = (phase % 1) * flameHeight * 0.7;
      const drift = Math.sin(phase * 2.1 + index) * flameHeight * 0.12;
      const alpha = (1 - rise / (flameHeight * 0.7)) * 0.75;
      context.beginPath();
      context.fillStyle = `rgba(255, 184, 104, ${alpha})`;
      context.arc(centerX + drift, originY - rise, 1 + (index % 2), 0, Math.PI * 2);
      context.fill();
    }
  }
}
