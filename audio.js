/* ==========================================================================
   《全糖量測所：測測你的調皮不舒服程度》Fructose Absurdity Clinical Lab
   V3.0 Ultra-Detailed Edition — Web Audio API Synthesizer (audio.js)
   ========================================================================== */

class FructoseAudioEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.micStream = null;
    this.analyser = null;
    this.micActive = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    if (this.soundEnabled) {
      this.playSugarDrop(1);
    }
    return this.soundEnabled;
  }

  // 1. playSugarDrop()：正弦波 520Hz -> 980Hz 清脆方糖落入玻璃杯碰撞聲
  playSugarDrop(count = 1) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const drops = Math.min(Math.max(count, 1), 6);
    for (let i = 0; i < drops; i++) {
      setTimeout(() => {
        if (!this.soundEnabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const jitter = (Math.random() - 0.5) * 60;
        osc.frequency.setValueAtTime(520 + jitter, now);
        osc.frequency.exponentialRampToValueAtTime(980 + jitter, now + 0.095);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      }, i * 52);
    }
  }

  // 2. playBubble()：三角波 240Hz -> 640Hz 濃稠果糖液體冒泡咕嚕聲
  playBubble() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.15);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  // 3. playPrinter()：方波序列模擬熱感應印表機「滋滋滋」吐紙列印聲
  playPrinter() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        if (!this.soundEnabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(120 + (i % 4) * 38, now);

        gain.gain.setValueAtTime(0.055, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.042);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.048);
      }, i * 65);
    }
  }

  // 4. playOverloadSiren()：鋸齒波 320Hz <-> 760Hz 實驗室生化警報聲
  playOverloadSiren() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    for (let c = 0; c < 3; c++) {
      setTimeout(() => {
        if (!this.soundEnabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(760, now + 0.18);
        osc.frequency.linearRampToValueAtTime(320, now + 0.36);

        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.37);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.39);
      }, c * 400);
    }
  }

  // 5. 雙人 PK 對決與隱藏彩蛋覺醒音效
  playVictoryFanfare() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.soundEnabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
      }, idx * 85);
    });
  }

  // 6. 搖搖杯與離心機音效
  playShakerSound() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        this.playBubble();
      }, i * 75);
    }
  }

  // 7. 瀏覽器麥克風聲納分貝感測器
  async startMicrophoneSensor(onLevelCallback, onErrorCallback) {
    try {
      this.init();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.micStream = stream;
      const source = this.ctx.createMediaStreamSource(stream);
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      source.connect(this.analyser);
      this.micActive = true;

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      const loop = () => {
        if (!this.micActive) return;
        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length;
        const db = Math.min(125, Math.round(34 + (avg / 128) * 90));
        onLevelCallback(db, dataArray);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
      return true;
    } catch (e) {
      if (onErrorCallback) onErrorCallback(e);
      return false;
    }
  }

  stopMicrophoneSensor() {
    this.micActive = false;
    if (this.micStream) {
      this.micStream.getTracks().forEach(t => t.stop());
      this.micStream = null;
    }
  }
}

window.labAudio = new FructoseAudioEngine();
