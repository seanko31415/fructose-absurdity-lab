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

  playFrequencyTone(freq = 440, type = 'sine', duration = 0.28) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.20, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playCryoFreeze() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.35);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  // ========================================================================
  // PLAYFUL & MISCHIEVOUS CARTOON LAB BGM (調皮搞怪風格背景音樂合成器)
  // 靈感：搞怪實驗室 × 俏皮撥弦低音 × 滑音木琴與 Q 彈音效節奏 (125 BPM)
  // ========================================================================
  startBGM() {
    if (this.bgmPlaying) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const masterBgmGain = this.ctx.createGain();
      masterBgmGain.gain.setValueAtTime(0.01, now);
      masterBgmGain.gain.linearRampToValueAtTime(0.32, now + 0.3);
      masterBgmGain.connect(this.ctx.destination);

      this.bgmNodes = { masterBgmGain };
      this.bgmPlaying = true;

      // 調皮搞怪低音 Riff (C小調混合藍調半音階俏皮步伐)
      const bassPattern = [
        130.81, 0, 196.00, 0, 155.56, 164.81, 196.00, 0,
        174.61, 0, 164.81, 0, 146.83, 185.00, 196.00, 98.00
      ];

      // 俏皮搞怪主旋律 (含滑音與跳音)
      const melodyPattern = [
        { f: 523.25, slide: 0, type: 'triangle' },     // C5
        { f: 0 },
        { f: 622.25, slide: 659.25, type: 'sine' },    // D#5 -> E5 滑音
        { f: 587.33, slide: 0, type: 'triangle' },     // D5
        { f: 523.25, slide: 0, type: 'triangle' },     // C5
        { f: 392.00, slide: 0, type: 'sine' },         // G4
        { f: 466.16, slide: 523.25, type: 'triangle' },// A#4 -> C5 Boing!
        { f: 0 },
        { f: 698.46, slide: 0, type: 'sine' },         // F5
        { f: 659.25, slide: 0, type: 'triangle' },     // E5
        { f: 622.25, slide: 0, type: 'sine' },         // D#5
        { f: 523.25, slide: 0, type: 'triangle' },     // C5
        { f: 587.33, slide: 783.99, type: 'sine' },    // 搞笑上滑音!
        { f: 0 },
        { f: 523.25, slide: 261.63, type: 'triangle' },// 搞笑下滑收尾!
        { f: 0 }
      ];

      let step = 0;
      const stepMs = 230; // ~130 BPM 輕快調皮節拍

      const playMischiefStep = () => {
        if (!this.bgmPlaying || !this.ctx) return;
        const t = this.ctx.currentTime;
        const idx = step % 16;

        // 1. 俏皮彈跳低音 (Pizzicato Bounce Bass)
        const bFreq = bassPattern[idx];
        if (bFreq > 0) {
          const bOsc = this.ctx.createOscillator();
          const bGain = this.ctx.createGain();
          bOsc.type = 'triangle';
          bOsc.frequency.setValueAtTime(bFreq, t);
          bOsc.frequency.exponentialRampToValueAtTime(bFreq * 0.96, t + 0.14);

          bGain.gain.setValueAtTime(0.36, t);
          bGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

          bOsc.connect(bGain);
          bGain.connect(masterBgmGain);
          bOsc.start(t);
          bOsc.stop(t + 0.17);
        }

        // 2. 調皮木琴與搞笑滑音主旋律 (Quirky Xylophone & Boing Lead)
        const mNote = melodyPattern[idx];
        if (mNote && mNote.f > 0) {
          const mOsc = this.ctx.createOscillator();
          const mGain = this.ctx.createGain();
          mOsc.type = mNote.type || 'sine';
          mOsc.frequency.setValueAtTime(mNote.f, t);
          if (mNote.slide > 0) {
            mOsc.frequency.exponentialRampToValueAtTime(mNote.slide, t + 0.15);
          }

          mGain.gain.setValueAtTime(0.28, t);
          mGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

          mOsc.connect(mGain);
          mGain.connect(masterBgmGain);
          mOsc.start(t);
          mOsc.stop(t + 0.19);
        }

        // 3. 偶爾穿插搞怪氣泡彈簧音 (Cheeky Bubble Boing on step 7 or 15)
        if ((idx === 7 || idx === 15) && Math.random() < 0.75) {
          const qOsc = this.ctx.createOscillator();
          const qGain = this.ctx.createGain();
          qOsc.type = 'sine';
          const startF = idx === 7 ? 280 : 680;
          const endF = idx === 7 ? 720 : 240;
          qOsc.frequency.setValueAtTime(startF, t);
          qOsc.frequency.exponentialRampToValueAtTime(endF, t + 0.14);

          qGain.gain.setValueAtTime(0.22, t);
          qGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

          qOsc.connect(qGain);
          qGain.connect(masterBgmGain);
          qOsc.start(t);
          qOsc.stop(t + 0.16);
        }

        step++;
        if (this.bgmPlaying) {
          this.bgmTimer = setTimeout(playMischiefStep, stepMs);
        }
      };

      playMischiefStep();
    } catch (e) {
      console.warn('BGM initialization deferred until user interaction', e);
    }
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.bgmNodes && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        if (this.bgmNodes.masterBgmGain) {
          this.bgmNodes.masterBgmGain.gain.cancelScheduledValues(now);
          this.bgmNodes.masterBgmGain.gain.setValueAtTime(0, now);
          this.bgmNodes.masterBgmGain.disconnect();
        }
      } catch (e) {}
      this.bgmNodes = null;
    }
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

  // 離心機高頻機械加速蜂鳴
  playCentrifugeWhir(rpm = 3000) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const baseFreq = 120 + (rpm / 12000) * 880;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.22);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  // 果糖怪被打擊暴擊音效 (Punch Pop)
  playMonsterHit() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch (e) {}
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

  // 🔔 實驗室清脆鈴聲 (Chime)
  playChime() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [1046.5, 1318.51, 1567.98].forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.36);
      }, idx * 60);
    });
  }

  // ⚡ 賽博雷射掃描音效 (Laser)
  playLaser() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.22);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.23);
  }

  // 🎈 搞怪彈簧彈跳音效 (Boing)
  playBoing() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.16);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.32);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  // 💥 街機打擊擊碎音效 (WhackHit)
  playWhackHit() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }
}

window.labAudio = new FructoseAudioEngine();
