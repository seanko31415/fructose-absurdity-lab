/* ==========================================================================
   《全糖量測所：測測你的調皮不舒服程度》Fructose Absurdity Clinical Lab
   V5.1 Ambient Lab BGM & Web Audio Procedural Synthesizer (audio.js)
   全純程式碼合成：背景科幻環境音 (BGM) + 清脆方糖音效 + 果凍 Q 彈反饋
   ========================================================================== */

class FructoseAudioEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.bgmPlaying = false;
    this.bgmNodes = null;
    this.bgmTimer = null;
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
    } else {
      if (this.bgmPlaying) {
        this.stopBGM();
      }
    }
    return this.soundEnabled;
  }

  // ========================================================================
  // PROCEDURAL SCI-FI LAB AMBIENT BGM (高音質立體聲科幻實驗室背景音樂)
  // ========================================================================
  startBGM() {
    if (this.bgmPlaying) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const masterBgmGain = this.ctx.createGain();
      masterBgmGain.gain.setValueAtTime(0.01, now);
      // 大幅提升背景音樂音量，清晰溫暖不刺耳
      masterBgmGain.gain.exponentialRampToValueAtTime(0.32, now + 1.2);
      masterBgmGain.connect(this.ctx.destination);

      // 溫暖立體聲濾波器 (緩慢呼吸掃頻)
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(520, now);
      filter.Q.setValueAtTime(2.4, now);
      filter.connect(masterBgmGain);

      // 濾波調製 LFO
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.18, now);
      lfoGain.gain.setValueAtTime(220, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start(now);

      // 豐滿三和弦 Pad 振盪器 (C3: 130.81Hz, G3: 196.00Hz, E4: 329.63Hz)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(130.81, now);

      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(196.00 + 0.4, now);

      const osc3 = this.ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(246.94, now);

      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.38, now);

      osc1.connect(droneGain);
      osc2.connect(droneGain);
      osc3.connect(droneGain);
      droneGain.connect(filter);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      this.bgmNodes = { masterBgmGain, filter, lfo, osc1, osc2, osc3 };
      this.bgmPlaying = true;

      // 科幻水晶五聲音階旋律琶音 (每 0.9 ~ 1.6 秒清脆響起)
      const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
      let noteStep = 0;
      const scheduleAmbientSparkle = () => {
        if (!this.bgmPlaying || !this.ctx) return;
        const curTime = this.ctx.currentTime;
        const freq = pentatonic[(noteStep + Math.floor(Math.random() * 3)) % pentatonic.length];
        noteStep = (noteStep + 1) % pentatonic.length;

        const bellOsc = this.ctx.createOscillator();
        const subOsc = this.ctx.createOscillator();
        const bellGain = this.ctx.createGain();

        bellOsc.type = 'sine';
        bellOsc.frequency.setValueAtTime(freq, curTime);
        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(freq * 0.5, curTime);

        bellGain.gain.setValueAtTime(0.28, curTime);
        bellGain.gain.exponentialRampToValueAtTime(0.001, curTime + 1.4);

        bellOsc.connect(bellGain);
        subOsc.connect(bellGain);
        bellGain.connect(masterBgmGain);

        bellOsc.start(curTime);
        subOsc.start(curTime);
        bellOsc.stop(curTime + 1.45);
        subOsc.stop(curTime + 1.45);

        const nextDelay = 850 + Math.random() * 750;
        this.bgmTimer = setTimeout(scheduleAmbientSparkle, nextDelay);
      };

      this.bgmTimer = setTimeout(scheduleAmbientSparkle, 300);
    } catch (e) {
      console.warn('BGM initialization deferred until user interaction', e);
    }
  }

  stopBGM() {
    if (!this.bgmPlaying) return;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.bgmNodes && this.ctx) {
      const now = this.ctx.currentTime;
      try {
        this.bgmNodes.masterBgmGain.gain.setValueAtTime(this.bgmNodes.masterBgmGain.gain.value, now);
        this.bgmNodes.masterBgmGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
        setTimeout(() => {
          try {
            this.bgmNodes.osc1.stop();
            this.bgmNodes.osc2.stop();
            if (this.bgmNodes.osc3) this.bgmNodes.osc3.stop();
            this.bgmNodes.lfo.stop();
          } catch (e) {}
          this.bgmNodes = null;
        }, 600);
      } catch (e) {
        this.bgmNodes = null;
      }
    }
    this.bgmPlaying = false;
  }

  toggleBGM() {
    this.init();
    if (this.bgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  // 通用頻率音調合成器 (供折射儀、量子反應爐、神經元調諧器調用)
  playTone(freq = 440, type = 'sine', duration = 0.15, vol = 0.18) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(Math.max(40, Math.min(4000, freq)), now);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch (e) {}
  }

  // ========================================================================
  // INTERACTIVE SFX SOUNDS (即時交互音效)
  // ========================================================================

  // 方糖掉落撞擊玻璃清脆聲
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

  // 果糖怪 Q 彈果凍聲
  playJellySquish() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.07);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.16);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  // 3D 卡牌旋轉切換音 (立體微光 Whoosh)
  playCardSwipe() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(720, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // 果糖冒泡咕嚕聲
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

  // 熱感應印表機列印聲
  playPrinter() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        if (!this.soundEnabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(130 + (i % 4) * 35, now);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.045);
      }, i * 65);
    }
  }

  // 糖分過高警報
  playOverloadSiren() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    for (let c = 0; c < 2; c++) {
      setTimeout(() => {
        if (!this.soundEnabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(760, now + 0.18);
        osc.frequency.linearRampToValueAtTime(320, now + 0.36);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.37);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.38);
      }, c * 380);
    }
  }

  // 勝利號角
  playVictoryFanfare() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.soundEnabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.13, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.23);
      }, idx * 75);
    });
  }

  // 搖搖杯音效
  playShakerSound() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.playBubble();
      }, i * 70);
    }
  }

  // 聲納分貝感測器
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
