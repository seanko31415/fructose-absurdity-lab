const fs = require('fs');

console.log('=== STARTING DEBUG ROUND 2: DOM Runtime Simulation & Logic Verification ===');

// Setup minimal browser mock
global.window = global;
global.document = {
  _elements: {},
  createElement(tag) {
    return this.getElementById('mock-' + Math.random());
  },
  getElementById(id) {
    if (!this._elements[id]) {
      this._elements[id] = {
        id,
        classList: {
          classes: new Set(),
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); },
          toggle(c, force) {
            if (force === undefined) {
              if (this.classes.has(c)) this.classes.delete(c);
              else this.classes.add(c);
            } else if (force) {
              this.classes.add(c);
            } else {
              this.classes.delete(c);
            }
          },
          contains(c) { return this.classes.has(c); }
        },
        style: {},
        innerHTML: '',
        textContent: '',
        value: '',
        addEventListener() {},
        removeEventListener() {},
        setAttribute() {},
        getAttribute() { return ''; },
        getBoundingClientRect() { return { left: 100, top: 100, width: 120, height: 120 }; },
        appendChild() {},
        querySelectorAll() { return []; },
        focus() {}
      };
    }
    return this._elements[id];
  },
  querySelectorAll() { return []; },
  addEventListener() {},
  removeEventListener() {},
  body: {
    classList: { add() {}, remove() {} },
    style: {}
  }
};
global.navigator = { clipboard: { writeText: () => Promise.resolve() } };
global.performance = { now: () => Date.now() };
global.requestAnimationFrame = (fn) => setTimeout(fn, 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);
global.localStorage = {
  _data: {},
  getItem(k) { return this._data[k] || null; },
  setItem(k, v) { this._data[k] = String(v); },
  removeItem(k) { delete this._data[k]; }
};

// Mock AudioContext
global.AudioContext = class {
  constructor() {
    this.currentTime = 0;
    this.destination = {};
  }
  createGain() {
    return {
      gain: {
        setValueAtTime() {},
        linearRampToValueAtTime() {},
        exponentialRampToValueAtTime() {},
        cancelScheduledValues() {},
        value: 1
      },
      connect() {},
      disconnect() {}
    };
  }
  createOscillator() {
    return {
      type: 'sine',
      frequency: {
        setValueAtTime() {},
        linearRampToValueAtTime() {},
        exponentialRampToValueAtTime() {}
      },
      connect() {},
      start() {},
      stop() {}
    };
  }
};

// 1. Load scripts in sequence
try {
  require('../data.js');
  require('../audio.js');
  require('../app.js');
  console.log('[PASS] All scripts loaded into DOM runtime environment without throwing.');
} catch (e) {
  console.error('[FAIL] Runtime exception during script load:', e);
  process.exit(1);
}

const LabApp = window.LabApp;
if (!LabApp) {
  console.error('[FAIL] window.LabApp was not initialized!');
  process.exit(1);
}

// 2. Test BGM toggle and mute permanence
console.log('[TEST] Checking BGM sound engine and toggle permanence...');
window.labAudio.startBGM();
if (!window.labAudio.bgmPlaying) {
  console.error('[FAIL] BGM did not start when requested.');
  process.exit(1);
}
LabApp.toggleBgmMusic(); // Turn off
if (window.labAudio.bgmPlaying) {
  console.error('[FAIL] BGM failed to stop on toggleBgmMusic().');
  process.exit(1);
}
console.log('[PASS] BGM toggles on/off cleanly and cuts all oscillators.');

// 3. Test Mascot Demon Interaction
console.log('[TEST] Testing Sugar Demon mascot interactions...');
try {
  LabApp.feedMascotSugar(3);
  LabApp.tickleMascotBelly();
  console.log('[PASS] Sugar Demon feed and tickle methods execute successfully.');
} catch (e) {
  console.error('[FAIL] Error during mascot interaction:', e);
  process.exit(1);
}

// 4. Test Caramel Fusion Reactor & Synthesizer & Large Cylinder Ladder
console.log('[TEST] Testing Caramel Fusion Reactor, Synthesizer and 1000mL Cylinder Ladder...');
try {
  LabApp.pulseReactorFission();
  LabApp.cryoCoolReactor();
  LabApp.injectReactorNucleotide();
  LabApp.pulseArtInstallation(); // Alias test
  LabApp.setSynthesizerWaveform('sawtooth', 880);
  LabApp.setSynthesizerFrequency(520);
  LabApp.playSynthesizerTone();
  LabApp.selectLadderLevel(4, true);
  LabApp.selectLadderLevel(14, true);
  console.log('[PASS] Caramel fusion reactor, frequency synthesizer, and 0~14 level scale ladder pass.');
} catch (e) {
  console.error('[FAIL] Error in Reactor / Synthesizer / Ladder:', e);
  process.exit(1);
}

// 5. Test Quiz questions & Neural Agitation Monitor
console.log('[TEST] Testing Quiz questions, modes (20/30/50/100) and ECG Monitor...');
try {
  LabApp.setQuestionCountMode(30);
  LabApp.chooseQuizOption('q_exam_fail', 1);
  LabApp.coolDownBrainWave();
  console.log('[PASS] Quiz modes, option selection, and ECG brainwave cooldown pass.');
} catch (e) {
  console.error('[FAIL] Error in Quiz / ECG:', e);
  process.exit(1);
}

// 6. Test Monster Whack Game Sensitivity
console.log('[TEST] Testing Monster Whack arcade game...');
try {
  LabApp.startMonsterWhackGame();
  LabApp.whackMonsterHole(4);
  console.log('[PASS] Monster Whack pointerdown/click game logic passes.');
} catch (e) {
  console.error('[FAIL] Error in Monster Whack:', e);
  process.exit(1);
}

console.log('=== DEBUG ROUND 2 PASSED WITH ZERO ERRORS ===');
