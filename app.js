/* ==========================================================================
   《全糖量測所：測測你的調皮不舒服程度》Fructose Absurdity Clinical Lab
   V5.0 — 3D Orbiting Card Login + 4-Page Switchable SPA + Creative Overload
   Complete Interactive Application Controller (app.js)
   ========================================================================== */

(function () {
  const DATA = window.FRUCTOSE_LAB_DATA;

  // ========================================================================
  // 全域響應式狀態 (appState)
  // ========================================================================
  const appState = {
    activePage: 1, // 1: 主頁量筒天平 | 2: 問問題測糖度(核心頁) | 3: 診斷收據與室友PK | 4: 遊樂場與榮譽榜
    carouselIndex: 0,
    carouselAngle: 0,
    carouselAutoRotate: true,
    carouselRafId: null,
    carouselPausedByHover: false,
    playerName: '全糖受測員 #128',
    playerCard: DATA.loginIdentityCards[0],
    globalSugarCubes: 12,
    activeLadderLevel: 4,
    scaleOverload: false,
    overloadShakeMode: 'auto', // 'auto' | 'wobble' | 'quake' | 'off'
    quizIndex: 0,
    quizViewAll: false,
    quizAnswers: {},
    soundEnabled: true,
    rootClearance: false,
    absurdityMultiplier: 1.0,
    monsterClicks: 0,
    easterEggUnlocked: false,
    selectedToppings: ['top-boba', 'top-syrup'],
    roachGame: {
      running: false,
      hits: 0,
      misses: 0,
      timeLeft: 15,
      timerId: null,
      spawnId: null
    },
    beakerMix: {
      techA: 50,
      humorB: 50
    },
    currentReceipt: null,
    apiConfig: {
      mode: 'instant',
      provider: 'openai',
      apiKey: '',
      model: 'gpt-4o-mini'
    },
    hallOfShameList: [],
    hosFilter: 'ALL'
  };

  // ========================================================================
  // 1. 持久化載入與通用工具 (Persistence & Utilities)
  // ========================================================================
  function loadPersistedData() {
    try {
      const savedHos = localStorage.getItem('fructose_v5_hos');
      if (savedHos) {
        appState.hallOfShameList = JSON.parse(savedHos);
      } else {
        appState.hallOfShameList = JSON.parse(JSON.stringify(DATA.initialHallOfShame));
      }

      const savedApi = localStorage.getItem('fructose_v5_api');
      if (savedApi) {
        appState.apiConfig = { ...appState.apiConfig, ...JSON.parse(savedApi) };
      }

      const savedCustomQs = localStorage.getItem('fructose_v5_custom_qs');
      if (savedCustomQs) {
        const parsed = JSON.parse(savedCustomQs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          DATA.calibrationQuestions = [...DATA.calibrationQuestions, ...parsed];
        }
      }

      const savedCustomEx = localStorage.getItem('fructose_v5_custom_ex');
      if (savedCustomEx) {
        const parsedEx = JSON.parse(savedCustomEx);
        if (Array.isArray(parsedEx) && parsedEx.length > 0) {
          DATA.presetConfessions = [...DATA.presetConfessions, ...parsedEx];
        }
      }
    } catch (e) {
      appState.hallOfShameList = JSON.parse(JSON.stringify(DATA.initialHallOfShame));
    }
  }

  function saveHallOfShame() {
    try {
      localStorage.setItem('fructose_v5_hos', JSON.stringify(appState.hallOfShameList));
    } catch (e) {}
  }

  function cubesToLevelObj(cubes) {
    const maxLv = appState.easterEggUnlocked ? 15 : 14;
    let matched = DATA.fructoseLevels[0];
    for (let i = 0; i <= maxLv; i++) {
      const item = DATA.fructoseLevels[i];
      if (item && cubes >= item.cubes) {
        matched = item;
      } else {
        break;
      }
    }
    return matched;
  }

  function triggerLabShake() {
    document.body.classList.remove('shake-screen');
    void document.body.offsetWidth;
    document.body.classList.add('shake-screen');
    if (navigator.vibrate) {
      try { navigator.vibrate([70, 30, 90]); } catch (e) {}
    }
  }

  function showToast(title, desc, tone = 'amber') {
    const box = document.getElementById('toast-stack');
    if (!box) return;
    const styles = {
      amber: 'border-amber-400/80 bg-slate-900/95 text-amber-300',
      cyan: 'border-cyan-400/80 bg-slate-900/95 text-cyan-300',
      emerald: 'border-emerald-400/80 bg-slate-900/95 text-emerald-300',
      red: 'border-red-500/85 bg-red-950/95 text-red-200',
      fuchsia: 'border-fuchsia-400/85 bg-purple-950/95 text-fuchsia-200'
    };
    const item = document.createElement('div');
    item.className = `px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 flex items-start gap-3 max-w-sm ${styles[tone] || styles.amber}`;
    item.innerHTML = `
      <div class="text-lg leading-none mt-0.5">${tone === 'red' ? '🚨' : tone === 'emerald' ? '✅' : tone === 'fuchsia' ? '🌌' : '🧊'}</div>
      <div class="text-xs flex-1">
        <div class="font-mono font-bold uppercase tracking-wider">${title}</div>
        <div class="text-slate-200 mt-0.5 leading-relaxed">${desc}</div>
      </div>
    `;
    box.appendChild(item);
    setTimeout(() => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(20px)';
      setTimeout(() => item.remove(), 300);
    }, 3600);
  }

  // ========================================================================
  // 2. 3D 環繞卡牌登入介面 (3D Orbiting Card Carousel Login Portal)
  // ========================================================================
  function render3DCarouselCards() {
    const ring = document.getElementById('carousel-3d-ring');
    if (!ring) return;

    const cards = DATA.loginIdentityCards;
    const count = cards.length;
    const stepDeg = 360 / count;
    const isMobile = window.innerWidth < 640;
    const radius = isMobile ? 200 : 260;

    ring.innerHTML = cards.map((c, idx) => {
      const isSelected = idx === appState.carouselIndex;
      const angle = idx * stepDeg;
      return `
        <div onclick="window.LabApp.select3DCard(${idx})"
             style="transform: rotateY(${angle}deg) translateZ(${radius}px);"
             class="card-3d-item ${isSelected ? 'active-3d-card' : ''}">
          <div>
            <div class="flex items-center justify-between font-mono text-[9px] text-slate-400 mb-1.5">
              <span style="color:${c.accent}" class="font-bold">${c.code}</span>
              <span class="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">${c.initCubes} 顆</span>
            </div>
            <div class="w-12 h-12 rounded-2xl mx-auto my-1.5 flex items-center justify-center text-2xl border"
                 style="background:${c.accent}22; border-color:${c.accent}">
              ${c.icon}
            </div>
            <h3 class="text-sm sm:text-base font-black text-white text-center leading-tight">${c.title}</h3>
            <p class="text-[10px] text-slate-400 text-center mt-0.5 font-mono">${c.subtitle}</p>
          </div>

          <div class="space-y-1.5 mt-2">
            <div class="p-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-[10px] text-slate-300 leading-snug">
              <strong class="text-amber-300">特性：</strong>${c.perk}
            </div>
            <div class="text-[9px] italic text-cyan-300 text-center truncate">${c.quote}</div>
          </div>
        </div>
      `;
    }).join('');

    updateSelected3DCardSummary();
  }

  // 3D 卡牌平滑自動旋轉
  function start3DAutoOrbit() {
    if (appState.carouselRafId) return;
    let lastTime = performance.now();
    function orbitStep(time) {
      const delta = Math.min(64, time - lastTime);
      lastTime = time;
      if (appState.carouselAutoRotate && !appState.carouselPausedByHover) {
        // 每秒旋轉 ~16 度，平滑優雅
        appState.carouselAngle -= 0.026 * delta;
        const ring = document.getElementById('carousel-3d-ring');
        if (ring) {
          ring.style.transform = `rotateY(${appState.carouselAngle}deg)`;
        }
        const count = DATA.loginIdentityCards.length;
        const stepDeg = 360 / count;
        let normAngle = (-appState.carouselAngle) % 360;
        if (normAngle < 0) normAngle += 360;
        const nearestIdx = Math.round(normAngle / stepDeg) % count;
        if (nearestIdx !== appState.carouselIndex) {
          appState.carouselIndex = nearestIdx;
          highlightActive3DCard(nearestIdx);
          updateSelected3DCardSummary();
        }
      }
      appState.carouselRafId = requestAnimationFrame(orbitStep);
    }
    appState.carouselRafId = requestAnimationFrame(orbitStep);
  }

  function stop3DAutoOrbit() {
    if (appState.carouselRafId) {
      cancelAnimationFrame(appState.carouselRafId);
      appState.carouselRafId = null;
    }
  }

  function toggle3DAutoRotate() {
    appState.carouselAutoRotate = !appState.carouselAutoRotate;
    const btn = document.getElementById('carousel-auto-toggle-btn');
    if (btn) {
      btn.innerHTML = appState.carouselAutoRotate
        ? `<span>⏸️ 自動旋轉: 開</span>`
        : `<span>▶️ 自動旋轉: 關</span>`;
    }
    showToast('3D 卡牌', appState.carouselAutoRotate ? '自動旋轉已啟動' : '自動旋轉已暫停', 'cyan');
  }

  function highlightActive3DCard(activeIdx) {
    const cardItems = document.querySelectorAll('.card-3d-item');
    cardItems.forEach((card, idx) => {
      card.classList.toggle('active-3d-card', idx === activeIdx);
    });
  }

  function rotate3DCarousel(deltaStep) {
    const count = DATA.loginIdentityCards.length;
    const stepDeg = 360 / count;
    appState.carouselIndex = (appState.carouselIndex + deltaStep + count) % count;
    appState.carouselAngle -= deltaStep * stepDeg;

    const ring = document.getElementById('carousel-3d-ring');
    if (ring) {
      ring.style.transform = `rotateY(${appState.carouselAngle}deg)`;
    }
    window.labAudio.playCardSwipe();
    highlightActive3DCard(appState.carouselIndex);
    updateSelected3DCardSummary();
  }

  function select3DCard(targetIndex) {
    const count = DATA.loginIdentityCards.length;
    let diff = targetIndex - appState.carouselIndex;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    rotate3DCarousel(diff);
  }

  function updateSelected3DCardSummary() {
    const card = DATA.loginIdentityCards[appState.carouselIndex];
    if (!card) return;
    appState.playerCard = card;
    const titleEl = document.getElementById('login-selected-card-title');
    const perkEl = document.getElementById('login-selected-card-perk');
    if (titleEl) titleEl.textContent = `${card.icon} ${card.title}`;
    if (perkEl) perkEl.textContent = `初始 ${card.initCubes} 顆 (${card.perk})`;
  }

  function enterLabFrom3DLogin(targetPage = 1) {
    const nameInput = document.getElementById('login-player-name');
    const name = nameInput?.value.trim() || appState.playerCard.title;
    appState.playerName = name;

    const overlay = document.getElementById('login-3d-overlay');
    if (overlay) {
      overlay.classList.add('portal-hidden');
    }

    const hudUser = document.getElementById('hud-user-identity');
    if (hudUser) {
      hudUser.textContent = `${appState.playerCard.icon} ${appState.playerName}`;
    }

    if (appState.playerCard.id === 'card-monster' && !appState.rootClearance) {
      toggleRootMode();
    }

    // 自動啟動環境背景音 (若尚未播放)
    if (window.labAudio && !window.labAudio.bgmPlaying && appState.soundEnabled) {
      window.labAudio.startBGM();
      const eqBars = document.getElementById('hud-eq-bars');
      if (eqBars) eqBars.classList.remove('eq-paused');
    }

    window.labAudio.playVictoryFanfare();
    setGlobalSugarCubes(appState.playerCard.initCubes, { syncLadder: true });
    switchLabPage(targetPage);
    broadcastMascotMessage(`歡迎【${appState.playerName}】！點上方切換頁面，或去第 2 頁問問題測糖度！`);
  }

  function reopen3DLoginPortal() {
    const overlay = document.getElementById('login-3d-overlay');
    if (overlay) {
      overlay.classList.remove('portal-hidden');
      window.labAudio.playBubble();
    }
  }

  // ========================================================================
  // 3. 四頁式獨立切換架構 (4-Page Switchable SPA Router)
  // ========================================================================
  function switchLabPage(pageNumber) {
    const p = Math.max(1, Math.min(4, parseInt(pageNumber, 10) || 1));
    appState.activePage = p;

    for (let i = 1; i <= 4; i++) {
      const pageEl = document.getElementById(`lab-page-${i}`);
      const topTab = document.getElementById(`top-page-tab-${i}`);
      const mobTab = document.getElementById(`mob-page-tab-${i}`);

      if (pageEl) {
        pageEl.classList.toggle('active-page', i === p);
      }
      if (topTab) {
        topTab.className = i === p
          ? 'px-3.5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center gap-1.5'
          : 'px-3.5 py-2 rounded-xl font-bold text-xs bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-amber-300 border border-slate-800 transition-all flex items-center gap-1.5';
      }
      if (mobTab) {
        mobTab.className = i === p
          ? 'flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/50 font-black transition-all'
          : 'flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-slate-400 hover:text-amber-300 transition-all';
      }
    }

    window.labAudio.playBubble();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const pageTitles = {
      1: '目前位於【第 1 頁：實驗室主頁・天平與 15 階果糖量筒】！想幫朋友測糖度請點「第 2 頁：問問題測糖度」！',
      2: '目前位於【第 2 頁：問問題測出你的糖度】！可答題校準、輸入經歷，下方還為您預留了專屬擴充卡槽！',
      3: '目前位於【第 3 頁：臨床診斷收據機 ＆ 室友雙人 PK 擂台】！可列印收據、下載 IG 限動卡或跟室友對決！',
      4: '目前位於【第 4 頁：高果糖互動遊樂場 ＆ 社死榮譽榜】！快來搖珍奶、打飛天蟑螂或幫別人的蠢事加糖！'
    };
    broadcastMascotMessage(pageTitles[p]);
  }

  // ========================================================================
  // 4. 全域糖分同步與「糖分過高創意全站晃動 / 高血糖幻覺特效」
  // ========================================================================
  function setGlobalSugarCubes(newCubes, options = {}) {
    const { syncLadder = true, isOverloadTrigger = false } = options;
    appState.globalSugarCubes = Math.max(0, Math.round(newCubes));
    appState.scaleOverload = isOverloadTrigger || appState.globalSugarCubes >= 1000;

    const lvObj = cubesToLevelObj(appState.globalSugarCubes);
    if (syncLadder) {
      appState.activeLadderLevel = lvObj.level;
    }

    const hudCubes = document.getElementById('hud-sugar-cubes');
    const hudGrams = document.getElementById('hud-sugar-grams');
    const hudLvBadge = document.getElementById('hud-level-badge');
    const ecgPath = document.getElementById('ecg-monitor-path');
    const ecgBpmText = document.getElementById('ecg-bpm-readout');

    if (hudCubes) hudCubes.textContent = `${appState.globalSugarCubes} 顆方糖`;
    if (hudGrams) hudGrams.textContent = `${(appState.globalSugarCubes * 5).toFixed(0)} g`;
    if (hudLvBadge) {
      hudLvBadge.textContent = `Lv.${lvObj.level} ${lvObj.name}`;
      hudLvBadge.className = `font-mono text-xs font-bold px-2.5 py-1 rounded-lg border ${lvObj.badgeClass}`;
    }

    const bpm = Math.min(220, 62 + Math.round(Math.sqrt(appState.globalSugarCubes) * 14));
    if (ecgBpmText) ecgBpmText.textContent = `${bpm} BPM (${appState.globalSugarCubes >= 12 ? '理智斷線警戒' : '理智正常'})`;
    if (ecgPath) {
      ecgPath.style.animationDuration = appState.globalSugarCubes >= 100 ? '0.85s' : appState.globalSugarCubes >= 12 ? '1.5s' : '3.2s';
    }

    // Check Creative Sugar Overload Effects (糖分過高網站晃動、果凍暈眩與幻覺彈幕)
    applyCreativeSugarOverloadEffects();

    renderHeroScale();
    if (syncLadder) {
      renderLadderSection(false);
    }
    updateMascotUI(false);
  }

  function applyCreativeSugarOverloadEffects() {
    const cubes = appState.globalSugarCubes;
    const overloadBanner = document.getElementById('syrup-overload-banner');

    document.body.classList.remove('sugar-rush-wobble', 'sugar-quake-extreme');

    if (appState.overloadShakeMode === 'off') {
      if (overloadBanner) overloadBanner.classList.remove('active');
      return;
    }

    if (appState.overloadShakeMode === 'quake' || cubes >= 500) {
      document.body.classList.add('sugar-quake-extreme');
      if (overloadBanner) overloadBanner.classList.add('active');
      spawnHallucinationBarrage(3);
    } else if (appState.overloadShakeMode === 'wobble' || cubes >= 60) {
      document.body.classList.add('sugar-rush-wobble');
      if (overloadBanner) overloadBanner.classList.add('active');
      spawnHallucinationBarrage(2);
    } else {
      if (overloadBanner) overloadBanner.classList.remove('active');
    }
  }

  function triggerCreativeOverloadMode(mode) {
    appState.overloadShakeMode = mode;
    if (mode === 'wobble') {
      if (appState.globalSugarCubes < 85) setGlobalSugarCubes(85, { syncLadder: true });
      else applyCreativeSugarOverloadEffects();
      window.labAudio.playBubble();
      broadcastMascotMessage('🥴【高血糖微醺果凍晃動模式】啟動！整個網站正在跟著你的社死指數一起果凍搖擺！');
    } else if (mode === 'quake') {
      window.labAudio.playOverloadSiren();
      setGlobalSugarCubes(1000, { syncLadder: true, isOverloadTrigger: true });
      broadcastMascotMessage('🚨【1L 糖漿焦糖化大地震】全站劇烈搖晃中！高血糖幻覺彈幕來襲！快按「緊急注射無糖綠茶」解毒！');
    } else {
      emergencyGreenTeaFlush();
    }
  }

  function spawnHallucinationBarrage(count = 2) {
    const list = DATA.hallucinationTexts || [];
    if (list.length === 0) return;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const pill = document.createElement('div');
        const text = list[Math.floor(Math.random() * list.length)];
        pill.className = 'hallucination-pill px-4 py-2 rounded-full bg-red-950/90 border-2 border-amber-400 text-amber-200 font-mono text-xs sm:text-sm font-black shadow-[0_0_25px_rgba(239,68,68,0.6)]';
        pill.style.top = `${16 + Math.random() * 68}vh`;
        pill.textContent = text;
        document.body.appendChild(pill);
        setTimeout(() => pill.remove(), 7600);
      }, i * 650);
    }
  }

  function emergencyGreenTeaFlush() {
    appState.overloadShakeMode = 'auto';
    appState.scaleOverload = false;
    document.body.classList.remove('sugar-rush-wobble', 'sugar-quake-extreme');
    window.labAudio.playBubble();
    setGlobalSugarCubes(0, { syncLadder: true, isOverloadTrigger: false });
    broadcastMascotMessage('💉 已為您緊急注射 3,000cc 冰鎮無糖綠茶！網站搖晃與高血糖幻覺已完全平息！');
    showToast('💉 無糖綠茶解毒完成', '網站已停止搖晃，體內含糖量恢復至 0g 純潔狀態！', 'emerald');
  }

  // ========================================================================
  // 5. 不藏在右下角的「果糖怪全息浮動廣播舞台艙」 (Prominent Floating Mascot Stage)
  // ========================================================================
  function broadcastMascotMessage(customText) {
    const quoteEl = document.getElementById('mascot-quote-text');
    const stageEl = document.getElementById('prominent-mascot-stage');
    if (quoteEl && customText) {
      quoteEl.textContent = customText;
      quoteEl.dataset.ready = '1';
    }
    if (stageEl) {
      stageEl.classList.remove('jelly-bounce');
      void stageEl.offsetWidth;
      stageEl.classList.add('jelly-bounce');
    }
  }

  function getMascotState() {
    const c = appState.globalSugarCubes;
    const states = DATA.monsterStates;
    for (let i = states.length - 1; i >= 0; i--) {
      if (c >= states[i].min) return states[i];
    }
    return states[0];
  }

  function updateMascotUI(newRandomQuote = false) {
    const m = getMascotState();
    const badge = document.getElementById('mascot-status-badge');
    const quote = document.getElementById('mascot-quote-text');
    const combo = document.getElementById('mascot-combo-counter');

    if (badge) {
      badge.textContent = appState.easterEggUnlocked ? '🌌 暗物質覺醒態 (Lv.15)' : m.title;
      badge.style.color = appState.easterEggUnlocked ? '#E879F9' : m.color;
      badge.style.borderColor = appState.easterEggUnlocked ? '#E879F9' : m.color;
    }

    if (combo) {
      combo.textContent = appState.easterEggUnlocked
        ? '★ Lv.15 隱藏彩蛋已解鎖'
        : `點我餵糖連擊: ${appState.monsterClicks} / 10`;
    }

    if (quote && (newRandomQuote || !quote.dataset.ready)) {
      const q = m.quotes[Math.floor(Math.random() * m.quotes.length)];
      quote.textContent = q;
      quote.dataset.ready = '1';
    }

    // 動態更新果糖怪表情嘴形
    const mouth = document.getElementById('mascot-mouth-path');
    if (mouth) {
      if (appState.easterEggUnlocked || appState.globalSugarCubes >= 100) {
        mouth.setAttribute('d', 'M40,70 Q60,102 80,70 Z'); // 大笑驚呼
      } else if (appState.globalSugarCubes >= 12) {
        mouth.setAttribute('d', 'M42,72 Q60,92 78,72 Z'); // 興奮張嘴
      } else {
        mouth.setAttribute('d', 'M44,74 Q60,86 76,74 Z'); // 正常微甜微笑
      }
    }
  }

  function clickFructoseMonster() {
    appState.monsterClicks += 1;
    const btn = document.getElementById('mascot-avatar-btn');
    if (btn) {
      btn.classList.remove('jelly-squish', 'jelly-bounce');
      void btn.offsetWidth;
      btn.classList.add('jelly-squish');
    }

    window.labAudio.playJellySquish();
    window.labAudio.playSugarDrop(1);
    setGlobalSugarCubes(appState.globalSugarCubes + 1, { syncLadder: false });
    updateMascotUI(true);

    if (appState.monsterClicks === 10 && !appState.easterEggUnlocked) {
      triggerSecretMonsterEasterEgg();
    }
  }

  function triggerSecretMonsterEasterEgg() {
    appState.easterEggUnlocked = true;
    window.labAudio.playVictoryFanfare();
    triggerLabShake();
    launchFullScreenSugarRain();
    selectLadderLevel(15, true);
    updateMascotUI(false);
    broadcastMascotMessage('🌌【果糖怪暴走覺醒】你已餵滿 10 顆方糖！隱藏階級「Level 15：跨維度暗物質方糖結晶 (9,999顆)」正式解鎖！');
    showToast('🌌 隱藏彩蛋解鎖：Level 15 暗物質方糖結晶！', '全畫面方糖雨降臨！', 'fuchsia');
  }

  function launchFullScreenSugarRain() {
    const canvas = document.getElementById('sugar-rain-canvas');
    if (!canvas) return;
    canvas.classList.remove('hidden');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const drops = Array.from({ length: 85 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 500,
      size: 16 + Math.random() * 16,
      vy: 4 + Math.random() * 6,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.1,
      gold: Math.random() > 0.45
    }));

    let frames = 0;
    const animate = () => {
      frames++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drops.forEach(d => {
        d.y += d.vy;
        d.rot += d.vRot;
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rot);
        ctx.fillStyle = d.gold ? '#FBBF24' : '#FFFFFF';
        ctx.strokeStyle = d.gold ? '#EF4444' : '#06B6D4';
        ctx.lineWidth = 2;
        ctx.fillRect(-d.size / 2, -d.size / 2, d.size, d.size);
        ctx.strokeRect(-d.size / 2, -d.size / 2, d.size, d.size);
        ctx.restore();
      });

      if (frames < 210) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.classList.add('hidden');
      }
    };
    requestAnimationFrame(animate);
  }

  // ========================================================================
  // 6. 第 1 頁：電子天平與 15 階高果糖玻璃量筒
  // ========================================================================
  function injectSugarToScale(deltaCubes, mode = 'add') {
    const mult = appState.absurdityMultiplier;
    if (mode === 'reset') {
      emergencyGreenTeaFlush();
      return;
    }
    if (mode === 'overload') {
      triggerCreativeOverloadMode('quake');
      spawnScaleParticles(14, true);
      return;
    }

    const added = Math.max(1, Math.round(deltaCubes * mult));
    window.labAudio.playSugarDrop(Math.min(added, 6));
    if (added >= 12) triggerLabShake();
    spawnScaleParticles(Math.min(added, 10), added >= 12);
    setGlobalSugarCubes(appState.globalSugarCubes + added, { syncLadder: true });
  }

  function randomDormBlindBoxSugar() {
    const acts = DATA.pkRandomActs;
    const pick = acts[Math.floor(Math.random() * acts.length)];
    const added = Math.round(pick.baseCubes * appState.absurdityMultiplier);
    window.labAudio.playSugarDrop(5);
    triggerLabShake();
    spawnScaleParticles(8, true);
    setGlobalSugarCubes(appState.globalSugarCubes + added, { syncLadder: true });
    broadcastMascotMessage(`🎲 盲盒抽中：「${pick.text}」➔ 當場暴增 +${added} 顆方糖！`);
  }

  function spawnScaleParticles(count, isGolden = false) {
    const stage = document.getElementById('scale-particle-stage');
    if (!stage) return;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = `falling-particle sugar-cube-item ${isGolden ? 'syrup-gold' : ''}`;
      p.style.left = `${58 + Math.random() * 24}%`;
      p.style.top = '0px';
      p.style.setProperty('--tx', `${(Math.random() - 0.5) * 44}px`);
      p.style.animationDelay = `${i * 0.045}s`;
      p.textContent = isGolden ? '糖' : '🧊';
      stage.appendChild(p);
      setTimeout(() => p.remove(), 750);
    }
  }

  function renderHeroScale() {
    const cubes = appState.globalSugarCubes;
    const grams = (cubes * 5).toFixed(1);
    const beam = document.getElementById('scale-beam');
    const cubeTray = document.getElementById('scale-right-cube-stack');
    const brainIcon = document.getElementById('scale-left-brain-icon');
    const brainLabel = document.getElementById('scale-left-brain-label');
    const ledScreen = document.getElementById('scale-led-display');
    const ledSub = document.getElementById('scale-led-sub');

    if (beam) {
      let deg = 0;
      if (cubes === 0) deg = -10;
      else if (cubes <= 12) deg = Math.round((cubes / 12) * 8);
      else deg = Math.min(20, 8 + Math.round(Math.log10(cubes) * 6));
      beam.style.transform = `rotate(${deg}deg)`;
    }

    if (brainIcon && brainLabel) {
      if (cubes === 0) {
        brainIcon.textContent = '🧠✨';
        brainLabel.textContent = '理智滿載 100%';
      } else if (cubes < 12) {
        brainIcon.textContent = '🧠💦';
        brainLabel.textContent = '微糖冒汗中';
      } else if (cubes < 100) {
        brainIcon.textContent = '🧠🔥';
        brainLabel.textContent = '全糖理智斷線';
      } else {
        brainIcon.textContent = '🫠🍯';
        brainLabel.textContent = '大腦果糖結晶化';
      }
    }

    if (cubeTray) {
      const visibleCount = cubes === 0 ? 0 : Math.min(28, Math.max(1, Math.ceil(cubes / (cubes > 100 ? 35 : 2))));
      cubeTray.innerHTML = '';
      for (let i = 0; i < visibleCount; i++) {
        const div = document.createElement('div');
        div.className = `sugar-cube-item ${cubes >= 100 ? 'syrup-gold' : ''}`;
        div.style.width = '18px';
        div.style.height = '18px';
        div.style.fontSize = '9px';
        div.textContent = cubes >= 100 ? '糖' : '🧊';
        cubeTray.appendChild(div);
      }
    }

    if (ledScreen && ledSub) {
      if (appState.scaleOverload || cubes >= 1000) {
        ledScreen.textContent = 'OVERLOAD: 9999.9 g';
        ledScreen.className = 'font-mono text-2xl sm:text-3xl font-extrabold text-red-500 tracking-wider animate-pulse';
        ledSub.textContent = `🚨 BIOHAZARD // ${cubes}+ 顆方糖 (網站搖晃警戒中)`;
      } else {
        const padded = grams.padStart(6, '0');
        ledScreen.textContent = `${padded} g (${cubes}顆)`;
        ledScreen.className = `font-mono text-2xl sm:text-3xl font-extrabold tracking-wider ${cubes >= 12 ? 'text-amber-400' : 'text-emerald-400'}`;
        const lv = cubesToLevelObj(cubes);
        ledSub.textContent = `STATUS: Lv.${lv.level} ${lv.name} // 1顆方糖 = 5.0g`;
      }
    }
  }

  function renderBeverageBenchmarkCards() {
    const grid = document.getElementById('beverage-benchmark-grid');
    if (!grid) return;

    grid.innerHTML = DATA.beverageStandards.map(b => `
      <button onclick="window.LabApp.selectBeverageStandard(${b.level}, ${b.cubes})"
              class="lab-card rounded-2xl p-4 text-left transition-all relative overflow-hidden group ${
                b.isCritical ? 'border-red-500/70 bg-red-950/25 shadow-[0_0_25px_rgba(239,68,68,0.2)]' : ''
              }">
        <div class="flex items-center justify-between gap-1 mb-2">
          <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded" style="background:${b.color}22; color:${b.color}; border:1px solid ${b.color}66">
            ${b.tag}
          </span>
          <span class="font-mono text-xs text-slate-400">${b.bpm} BPM</span>
        </div>
        <div class="text-base font-black text-white group-hover:text-amber-300 transition-colors">${b.title}</div>
        <div class="mt-2 flex items-baseline gap-2 font-mono">
          <span class="text-2xl font-extrabold text-amber-400">${b.cubes} 顆</span>
          <span class="text-xs text-slate-400">/ ${b.grams} g</span>
        </div>
        <p class="text-xs text-slate-300 mt-2 leading-relaxed">${b.desc}</p>
      </button>
    `).join('');
  }

  function selectBeverageStandard(level, cubes) {
    window.labAudio.playSugarDrop(Math.max(1, Math.min(cubes, 5)));
    setGlobalSugarCubes(cubes, { syncLadder: true });
    selectLadderLevel(level, false);
  }

  function selectLadderLevel(lvIndex, updateGlobal = true) {
    const maxLv = appState.easterEggUnlocked ? 15 : 14;
    const lv = Math.max(0, Math.min(maxLv, parseInt(lvIndex, 10) || 0));
    appState.activeLadderLevel = lv;
    const item = DATA.fructoseLevels[lv];

    if (lv >= 14) {
      window.labAudio.playOverloadSiren();
      triggerLabShake();
    } else {
      window.labAudio.playBubble();
    }

    if (updateGlobal && item) {
      setGlobalSugarCubes(item.cubes, { syncLadder: false, isOverloadTrigger: lv >= 14 });
    }

    renderLadderSection();
  }

  function renderLadderSection() {
    const lv = appState.activeLadderLevel;
    const maxLv = appState.easterEggUnlocked ? 15 : 14;
    const item = DATA.fructoseLevels[lv] || DATA.fructoseLevels[4];

    const liquid = document.getElementById('cylinder-liquid');
    const slider = document.getElementById('ladder-slider');
    const pourStream = document.getElementById('cylinder-top-stream');

    if (slider) {
      slider.max = String(maxLv);
      slider.value = String(lv);
    }

    if (liquid) {
      const pct = Math.round(7 + (lv / maxLv) * 91);
      liquid.style.height = `${pct}%`;
      liquid.className = `w-full absolute bottom-0 left-0 bg-gradient-to-t ${item.color}`;
    }

    if (pourStream) {
      pourStream.style.opacity = lv >= 4 ? '1' : '0.25';
    }

    const spotlight = document.getElementById('ladder-detail-card');
    if (spotlight) {
      spotlight.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs font-extrabold px-2.5 py-1 rounded border ${item.badgeClass}">
                LEVEL ${item.level} // ${item.zone}
              </span>
              <span class="font-mono text-xs text-slate-400">黏稠度：${item.viscosity}</span>
            </div>
            <h3 class="text-2xl sm:text-3xl font-black text-white mt-2">${item.name}</h3>
          </div>
          <div class="text-right font-mono bg-slate-950/90 px-4 py-2.5 rounded-2xl border border-amber-500/40">
            <div class="text-2xl sm:text-3xl font-extrabold text-amber-400">
              ${item.level === 14 ? '1,000+ 顆' : `${item.cubes} 顆方糖`}
            </div>
            <div class="text-xs text-cyan-300">折合含糖量：${item.grams} g</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
          <div class="p-3.5 rounded-xl bg-slate-950/85 border border-slate-800">
            <div class="font-mono text-amber-400 font-bold mb-1.5">🩺 臨床生理與心理病徵</div>
            <p class="text-slate-200 leading-relaxed">${item.symptom}</p>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/85 border border-slate-800">
            <div class="font-mono text-cyan-400 font-bold mb-1.5">🏫 校園與男宿典型案例</div>
            <p class="text-slate-200 leading-relaxed">${item.example}</p>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-950/85 border border-slate-800">
            <div class="font-mono text-emerald-400 font-bold mb-1.5">💊 果糖怪建議解毒處方</div>
            <p class="text-slate-200 leading-relaxed">${item.prescription}</p>
          </div>
        </div>
      `;
    }

    const matrix = document.getElementById('ladder-matrix-buttons');
    if (matrix) {
      const levelsToShow = DATA.fructoseLevels.filter(x => !x.isSecret || appState.easterEggUnlocked);
      matrix.innerHTML = levelsToShow.map(l => {
        const active = l.level === lv;
        return `
          <button onclick="window.LabApp.selectLadderLevel(${l.level}, true)"
                  class="p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    active
                      ? 'bg-amber-500/25 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-[1.02]'
                      : 'bg-slate-950/80 border-slate-800 hover:border-amber-500/40'
                  }">
            <div class="flex items-center justify-between w-full font-mono text-xs">
              <span class="font-extrabold ${active ? 'text-amber-300' : 'text-slate-400'}">Lv.${l.level}</span>
              <span class="text-[11px] ${l.level >= 10 ? 'text-red-400' : 'text-cyan-300'}">${l.level === 14 ? '1000+' : l.cubes}顆</span>
            </div>
            <div class="text-xs font-bold text-white truncate mt-1">${l.name}</div>
          </button>
        `;
      }).join('');
    }
  }

  // ========================================================================
  // 7. 第 2 頁：核心「問問題測出你的糖度」＋ 預留問題與例子擴充專屬卡槽
  // ========================================================================
  function getQuizSumCubes() {
    let total = 0;
    Object.values(appState.quizAnswers).forEach(a => {
      total += a.cubes;
    });
    return Math.round(total * appState.absurdityMultiplier);
  }

  function renderCalibrationSection() {
    const qList = DATA.calibrationQuestions;
    const container = document.getElementById('calibration-quiz-box');
    const stepDots = document.getElementById('calibration-step-dots');
    if (!container) return;

    if (stepDots) {
      stepDots.innerHTML = qList.map((q, idx) => {
        const answered = Boolean(appState.quizAnswers[q.id]);
        const isCurrent = idx === appState.quizIndex && !appState.quizViewAll;
        return `
          <button onclick="window.LabApp.jumpToQuizStep(${idx})"
                  class="px-3 py-1 rounded-lg font-mono text-xs font-bold border transition-all ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : answered
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                  }">
            Q${idx + 1} ${answered ? '✓' : ''}
          </button>
        `;
      }).join('');
    }

    const questionsToRender = appState.quizViewAll ? qList : [qList[appState.quizIndex]];

    container.innerHTML = questionsToRender.map(q => {
      const chosen = appState.quizAnswers[q.id];
      return `
        <div class="lab-card rounded-2xl p-5 sm:p-6 space-y-4">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <span class="font-mono text-xs text-cyan-400 font-bold tracking-wider">${q.scene}</span>
            <span class="font-mono text-xs px-2.5 py-0.5 rounded ${
              chosen ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
            }">
              ${chosen ? `已記錄 +${Math.round(chosen.cubes * appState.absurdityMultiplier)} 顆方糖` : `第 ${q.step} / ${qList.length} 題`}
            </span>
          </div>

          <h3 class="text-lg sm:text-xl font-black text-white leading-snug">${q.question}</h3>

          <div class="space-y-2.5">
            ${q.options.map((opt, oIdx) => {
              const isSelected = chosen && chosen.optIndex === oIdx;
              const effCubes = Math.round(opt.cubes * appState.absurdityMultiplier);
              return `
                <button onclick="window.LabApp.chooseQuizOption('${q.id}', ${oIdx})"
                        class="w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 group ${
                          isSelected
                            ? 'bg-amber-500/25 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.22)]'
                            : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-amber-500/50'
                        }">
                  <div class="flex items-start gap-3">
                    <span class="w-6 h-6 rounded-lg font-mono text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400 group-hover:text-amber-300'
                    }">${opt.label}</span>
                    <span class="text-sm leading-relaxed">${opt.text}</span>
                  </div>
                  <span class="font-mono text-xs font-bold px-2.5 py-1 rounded shrink-0 ${
                    effCubes >= 20 ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }">甜度 +${effCubes} 顆</span>
                </button>
              `;
            }).join('')}
          </div>

          ${chosen ? `
            <div class="p-3.5 rounded-xl bg-slate-950/95 border border-cyan-500/40 text-xs text-cyan-200 flex items-start gap-2.5">
              <span class="text-base">🧪</span>
              <div>
                <div class="font-mono font-bold text-cyan-400">實驗室即時臨床記錄 (CLINICAL LOG)：</div>
                <p class="mt-0.5 text-slate-200 leading-relaxed">${chosen.note}</p>
              </div>
            </div>
          ` : ''}

          ${!appState.quizViewAll ? `
            <div class="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <button onclick="window.LabApp.jumpToQuizStep(${Math.max(0, appState.quizIndex - 1)})"
                      ${appState.quizIndex === 0 ? 'disabled' : ''}
                      class="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs text-slate-300 disabled:opacity-40">
                ← 上一題
              </button>
              <button onclick="window.LabApp.toggleQuizViewMode()"
                      class="font-mono text-xs text-amber-300 hover:underline">
                展開全部 ${qList.length} 題清單
              </button>
              <button onclick="window.LabApp.jumpToQuizStep(${Math.min(qList.length - 1, appState.quizIndex + 1)})"
                      ${appState.quizIndex === qList.length - 1 ? 'disabled' : ''}
                      class="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400 font-mono text-xs font-bold text-amber-200 disabled:opacity-40">
                下一題 →
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    updateQuizGaugeAndSummary();
    renderReservedExpansionSlots();
  }

  // Render Reserved Question & Example Expansion Slots on Page 2
  function renderReservedExpansionSlots() {
    const qSlotBox = document.getElementById('reserved-question-slots-box');
    if (qSlotBox) {
      qSlotBox.innerHTML = DATA.reservedQuestionSlots.map((slot, idx) => `
        <div class="p-4 rounded-2xl border-2 border-dashed border-amber-500/45 bg-slate-950/65 flex flex-col justify-between gap-3">
          <div>
            <div class="flex items-center justify-between font-mono text-xs text-amber-400 mb-1">
              <span>RESERVED SLOT // ${slot.slotId}</span>
              <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200">預留擴充題位</span>
            </div>
            <h4 class="font-bold text-sm text-white">${slot.title}</h4>
            <p class="text-xs text-slate-400 mt-1 leading-relaxed">${slot.placeholderDesc}</p>
          </div>
          <button onclick="window.LabApp.toggleModal('add-question-modal', true)"
                  class="w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/60 text-amber-200 font-mono text-xs font-bold transition-all">
            ➕ 點此立即填入您的新題目 (${slot.slotId})
          </button>
        </div>
      `).join('');
    }

    const exSlotBox = document.getElementById('reserved-example-slots-box');
    if (exSlotBox) {
      exSlotBox.innerHTML = DATA.reservedExampleSlots.map((ex, i) => `
        <button onclick="window.LabApp.useReservedExample(${i})"
                class="px-3.5 py-2 rounded-xl border-2 border-dashed border-cyan-400/50 bg-cyan-950/25 hover:bg-cyan-900/40 text-cyan-200 font-mono text-xs font-bold transition-all flex items-center gap-1.5">
          <span>${ex.label}</span>
        </button>
      `).join('');
    }
  }

  function useReservedExample(idx) {
    const ex = DATA.reservedExampleSlots[idx];
    if (!ex) return;
    const customText = prompt('您可以直接輸入想保存在這個預留卡槽的「問問題/社死例子」：', ex.sampleText);
    if (customText && customText.trim()) {
      ex.sampleText = customText.trim();
      ex.label = `📌 自訂例子 ${idx + 1}：${customText.trim().slice(0, 10)}...`;
      DATA.presetConfessions.push({
        title: ex.label,
        text: customText.trim()
      });
      try {
        const savedEx = JSON.parse(localStorage.getItem('fructose_v5_custom_ex') || '[]');
        savedEx.push({ title: ex.label, text: customText.trim() });
        localStorage.setItem('fructose_v5_custom_ex', JSON.stringify(savedEx));
      } catch (e) {}
      renderDeepDivePresetsAndMultipliers();
      renderReservedExpansionSlots();
      const input = document.getElementById('confession-textarea');
      if (input) {
        input.value = customText.trim();
        onConfessionInputChanged();
      }
      showToast('✅ 預留例子卡槽已更新', '您的新例子已加入並自動填入下方測糖度輸入框！', 'emerald');
    }
  }

  function saveCustomQuestionFromModal() {
    const scene = document.getElementById('new-q-scene')?.value.trim() || `SCENE 0${DATA.calibrationQuestions.length + 1} // 自訂問答`;
    const question = document.getElementById('new-q-title')?.value.trim();
    const optA = document.getElementById('new-q-opt-a')?.value.trim() || '冷靜裝沒事繼續走';
    const optB = document.getElementById('new-q-opt-b')?.value.trim() || '尷尬傻笑趕快離開';
    const optC = document.getElementById('new-q-opt-c')?.value.trim() || '當場社死全場安靜';

    if (!question) {
      showToast('⚠️ 請輸入題目內容', '請填寫您想新增的測糖度問題描述！', 'amber');
      return;
    }

    const newQ = {
      id: `q-custom-${Date.now()}`,
      step: DATA.calibrationQuestions.length + 1,
      scene,
      question,
      options: [
        { label: 'A', text: optA, cubes: 3, clinicalNote: '微糖過關！反應相當鎮定 (+3 顆)' },
        { label: 'B', text: optB, cubes: 12, clinicalNote: '達到全糖創始人基準線！開始流汗 (+12 顆)' },
        { label: 'C', text: optC, cubes: 45, clinicalNote: '高果糖爆擊！直接列入本週社死教材 (+45 顆)' }
      ]
    };

    DATA.calibrationQuestions.push(newQ);
    try {
      const saved = JSON.parse(localStorage.getItem('fructose_v5_custom_qs') || '[]');
      saved.push(newQ);
      localStorage.setItem('fructose_v5_custom_qs', JSON.stringify(saved));
    } catch (e) {}

    appState.quizIndex = DATA.calibrationQuestions.length - 1;
    toggleModal('add-question-modal', false);
    renderCalibrationSection();
    window.labAudio.playVictoryFanfare();
    showToast('✅ 新問題已加入測驗題庫！', `目前已擴充至 ${DATA.calibrationQuestions.length} 道題目！`, 'emerald');
  }

  function chooseQuizOption(qId, optIndex) {
    const q = DATA.calibrationQuestions.find(item => item.id === qId);
    if (!q) return;
    const opt = q.options[optIndex];
    appState.quizAnswers[qId] = {
      optIndex,
      cubes: opt.cubes,
      note: opt.clinicalNote,
      label: opt.label
    };

    const eff = Math.round(opt.cubes * appState.absurdityMultiplier);
    window.labAudio.playSugarDrop(Math.max(1, Math.min(eff, 6)));
    if (eff >= 25) triggerLabShake();

    const quizTotal = getQuizSumCubes();
    setGlobalSugarCubes(Math.max(appState.globalSugarCubes, quizTotal), { syncLadder: true });
    broadcastMascotMessage(`🧪 第 ${q.step} 題測出 +${eff} 顆方糖！${opt.clinicalNote}`);
    renderCalibrationSection();
  }

  function jumpToQuizStep(idx) {
    appState.quizIndex = idx;
    appState.quizViewAll = false;
    window.labAudio.playBubble();
    renderCalibrationSection();
  }

  function toggleQuizViewMode() {
    appState.quizViewAll = !appState.quizViewAll;
    renderCalibrationSection();
  }

  function resetCalibrationQuiz() {
    appState.quizAnswers = {};
    appState.quizIndex = 0;
    window.labAudio.playBubble();
    renderCalibrationSection();
    showToast('🔄 問答測驗已重置', '所有問題與離心甜度壓力錶已歸零。', 'cyan');
  }

  function updateQuizGaugeAndSummary() {
    const sumCubes = getQuizSumCubes();
    const grams = sumCubes * 5;
    const answeredCount = Object.keys(appState.quizAnswers).length;
    const totalCount = DATA.calibrationQuestions.length;
    const lvObj = cubesToLevelObj(sumCubes);

    const circle = document.getElementById('quiz-gauge-circle');
    const cubesText = document.getElementById('quiz-gauge-cubes');
    const gramsText = document.getElementById('quiz-gauge-grams');
    const lvText = document.getElementById('quiz-gauge-level');
    const pool = document.getElementById('quiz-crystal-pool');
    const summaryBox = document.getElementById('quiz-final-summary-box');

    if (cubesText) cubesText.textContent = `${sumCubes} 顆`;
    if (gramsText) gramsText.textContent = `${grams} g`;
    if (lvText) lvText.textContent = `Lv.${lvObj.level} ${lvObj.name}`;

    if (circle) {
      const ratio = Math.min(1, sumCubes / 150);
      const offset = 283 - ratio * 283;
      circle.style.strokeDashoffset = String(offset);
      circle.setAttribute('stroke', sumCubes >= 50 ? '#EF4444' : sumCubes >= 12 ? '#F59E0B' : '#06B6D4');
    }

    if (pool) {
      const iconCount = sumCubes === 0 ? 0 : Math.min(36, Math.max(1, Math.ceil(sumCubes / 3)));
      pool.innerHTML = '';
      for (let i = 0; i < iconCount; i++) {
        const span = document.createElement('span');
        span.className = `sugar-cube-item ${sumCubes >= 50 ? 'syrup-gold' : ''}`;
        span.textContent = '🧊';
        pool.appendChild(span);
      }
    }

    if (summaryBox) {
      if (answeredCount > 0) {
        summaryBox.classList.remove('hidden');
        summaryBox.innerHTML = `
          <div class="font-mono text-xs font-bold text-emerald-400 mb-1">
            📊 已作答 ${answeredCount} / ${totalCount} 題 — 即時糖度診斷：
          </div>
          <div class="text-sm font-black text-white">累積甜度：${sumCubes} 顆方糖 (${grams}g) — 【Lv.${lvObj.level} ${lvObj.name}】</div>
          <p class="text-xs text-slate-300 mt-1 leading-relaxed">${lvObj.symptom}</p>
          <button onclick="window.LabApp.printQuizSummaryToReceipt()"
                  class="mt-3 w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono text-xs font-black transition-all">
            🖨️ 產生正式臨床診斷收據（前往第 3 頁列印）→
          </button>
        `;
      } else {
        summaryBox.classList.add('hidden');
      }
    }
  }

  function printQuizSummaryToReceipt() {
    const sumCubes = getQuizSumCubes();
    const lvObj = cubesToLevelObj(sumCubes);
    const receiptData = {
      ticketId: `LAB-${Math.floor(1000000 + Math.random() * 9000000)}`,
      story: `【受測者：${appState.playerName}】完成校園情境問答測驗，共測出 ${sumCubes} 顆方糖當量（${sumCubes * 5}g）。`,
      cubes: sumCubes,
      grams: sumCubes * 5,
      level: lvObj.level,
      levelName: lvObj.name,
      stamp: lvObj.stamp,
      roast: `判決：${sumCubes} 顆方糖。${lvObj.symptom}`,
      prescription: lvObj.prescription,
      factors: ['問問題測糖度核定', `Lv.${lvObj.level} ${lvObj.name}`]
    };
    switchLabPage(3);
    setTimeout(() => renderThermalReceipt(receiptData), 220);
  }

  // ========================================================================
  // 8. AI 實時語意分析與第 3 頁熱感應收據機 (Model FR-9000)
  // ========================================================================
  function renderDeepDivePresetsAndMultipliers() {
    const capsuleBox = document.getElementById('preset-capsules-box');
    if (capsuleBox) {
      capsuleBox.innerHTML = DATA.presetConfessions.map((p, i) => `
        <button onclick="window.LabApp.fillPresetConfession(${i})"
                class="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900 hover:bg-amber-500/20 border border-amber-500/35 text-amber-200 transition-all">
          ${p.title}
        </button>
      `).join('');
    }

    const multBox = document.getElementById('scene-multipliers-box');
    if (multBox) {
      multBox.innerHTML = DATA.sceneMultipliers.map(m => `
        <label class="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-950/85 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all">
          <div class="flex items-center gap-2.5">
            <input type="checkbox" value="${m.multiplier}" data-label="${m.label}"
                   onchange="window.LabApp.onConfessionInputChanged()"
                   class="scene-mult-checkbox w-4 h-4 accent-amber-400 rounded cursor-pointer" />
            <span class="text-xs font-bold text-slate-200">${m.label}</span>
          </div>
          <span class="font-mono text-xs font-extrabold text-amber-400">x${m.multiplier}</span>
        </label>
      `).join('');
    }
  }

  function fillPresetConfession(idx) {
    const item = DATA.presetConfessions[idx];
    if (!item) return;
    const input = document.getElementById('confession-textarea');
    if (input) {
      input.value = item.text;
      window.labAudio.playSugarDrop(2);
      onConfessionInputChanged();
    }
  }

  function detectShameFactors(text) {
    const matched = [];
    let factorCubes = 0;

    DATA.shameFactors.forEach(f => {
      const m = text.match(f.regex);
      if (m && m.length > 0) {
        matched.push({ ...f, count: m.length });
        factorCubes += f.addCubes * m.length;
      }
    });

    return { matched, factorCubes };
  }

  function onConfessionInputChanged() {
    const input = document.getElementById('confession-textarea');
    const tagContainer = document.getElementById('detected-shame-tags');
    const previewMultiplierEl = document.getElementById('live-multiplier-readout');
    if (!input || !tagContainer) return;

    const text = input.value.trim();
    const { matched } = detectShameFactors(text);

    let mult = appState.absurdityMultiplier;
    document.querySelectorAll('.scene-mult-checkbox:checked').forEach(cb => {
      mult *= parseFloat(cb.value || '1');
    });

    if (previewMultiplierEl) {
      previewMultiplierEl.textContent = `當前總乘算倍率：x${mult.toFixed(2)}`;
    }

    if (matched.length === 0) {
      tagContainer.innerHTML = `<span class="font-mono text-xs text-slate-500">等待輸入以即時偵測羞恥語意因子（如：阿嬤、教授、男宿、內褲、大群、螺螄粉、暗戀...）</span>`;
    } else {
      tagContainer.innerHTML = matched.map(m => `
        <span class="px-2.5 py-1 rounded-lg border font-mono text-xs font-bold ${m.badge}">
          ${m.name} (+${m.addCubes * m.count}顆)
        </span>
      `).join('');
    }
  }

  function computeLocalSemanticVerdict(text) {
    const { matched, factorCubes } = detectShameFactors(text);
    let base = 8 + factorCubes + Math.min(30, Math.floor(text.length / 6));

    let mult = appState.absurdityMultiplier;
    const activeMultLabels = [];
    document.querySelectorAll('.scene-mult-checkbox:checked').forEach(cb => {
      mult *= parseFloat(cb.value || '1');
      activeMultLabels.push(cb.getAttribute('data-label'));
    });

    let finalCubes = Math.round(base * mult);
    if (text.includes('阿嬤') && text.includes('吃飽沒') && activeMultLabels.length === 0 && appState.absurdityMultiplier === 1) {
      finalCubes = 50;
    }

    const lvObj = cubesToLevelObj(finalCubes);

    let roast = '';
    if (text.includes('阿嬤') || text.includes('教授')) {
      roast = `判決：${finalCubes} 顆方糖。你的尊嚴已經跟著阿嬤去廟裡拜拜了。教授正在考慮把你列入榮譽孫子名單。`;
    } else if (text.includes('臉盆') || text.includes('內褲') || text.includes('澡堂')) {
      roast = `判決：${finalCubes} 顆方糖。男宿光學遮蔽奇蹟！那個塑膠臉盆拯救了全校的視網膜。`;
    } else if (text.includes('螺螄粉') || text.includes('火警') || text.includes('警報')) {
      roast = `判決：${finalCubes} 顆方糖。一人煮粉全棟逃生，你成功用一碗螺螄粉完成了男宿年度防災演習。`;
    } else if (text.includes('女僕') || text.includes('學姐') || text.includes('暗戀')) {
      roast = `判決：${finalCubes} 顆方糖。戀愛與社交雙重粉碎性骨折，這套女僕裝將成為你的畢業紀念冊封面。`;
    } else {
      roast = `判決：${finalCubes} 顆方糖。${lvObj.symptom}`;
    }

    return {
      ticketId: `LAB-${Math.floor(1000000 + Math.random() * 9000000)}`,
      story: text,
      cubes: finalCubes,
      grams: finalCubes * 5,
      level: lvObj.level,
      levelName: lvObj.name,
      stamp: lvObj.stamp,
      roast,
      prescription: lvObj.prescription,
      factors: [...matched.map(m => m.name), ...activeMultLabels]
    };
  }

  async function runSemanticEngine() {
    const input = document.getElementById('confession-textarea');
    const text = input ? input.value.trim() : '';
    if (!text) {
      showToast('⚠️ 請先輸入經歷或點選例子', '您可以直接打字，或點擊上方「經典病歷膠囊」一鍵帶入！', 'amber');
      return;
    }

    const barWrap = document.getElementById('scan-stage-wrapper');
    const barFill = document.getElementById('scan-stage-bar');
    const stageText = document.getElementById('scan-stage-text');

    if (barWrap) barWrap.classList.remove('hidden');
    if (barFill) barFill.style.width = '35%';
    if (stageText) stageText.textContent = 'STAGE 1/3 // 解構語意羞恥張力與關鍵字權重...';
    window.labAudio.playSugarDrop(1);
    await new Promise(r => setTimeout(r, 320));

    if (barFill) barFill.style.width = '75%';
    if (stageText) stageText.textContent = 'STAGE 2/3 // 乘算現場目擊當量與高果糖黏稠度...';
    window.labAudio.playBubble();
    await new Promise(r => setTimeout(r, 320));

    const verdict = computeLocalSemanticVerdict(text);
    if (barFill) barFill.style.width = '100%';
    if (stageText) stageText.textContent = 'STAGE 3/3 // 診斷完成！自動跳轉至第 3 頁熱感應印表機吐紙...';

    setGlobalSugarCubes(Math.max(appState.globalSugarCubes, verdict.cubes), { syncLadder: true });
    switchLabPage(3);
    setTimeout(() => {
      renderThermalReceipt(verdict);
      broadcastMascotMessage(`🖨️ 診斷收據列印完成！核定【${verdict.cubes} 顆方糖 (${verdict.grams}g)】！${verdict.roast}`);
    }, 260);
  }

  function renderThermalReceipt(verdict) {
    appState.currentReceipt = {
      ...verdict,
      dateStr: new Date().toLocaleString('zh-TW', { hour12: false })
    };

    const paper = document.getElementById('thermal-receipt-paper');
    const body = document.getElementById('thermal-receipt-body');
    if (!paper || !body) return;

    paper.style.maxHeight = '0px';
    paper.style.opacity = '0.25';

    const r = appState.currentReceipt;
    const factorBadges = (r.factors || []).map(f => `<span class="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[10px]">#${f}</span>`).join(' ');

    body.innerHTML = `
      <div class="text-center border-b-2 border-dashed border-slate-400 pb-3">
        <div class="font-mono text-[10px] font-bold tracking-widest text-slate-500">FRUCTOSE ABSURDITY CLINICAL LAB // MODEL FR-9000</div>
        <h4 class="text-lg font-black text-slate-900 mt-0.5">《全糖量測所・臨床社死診斷收據》</h4>
        <div class="flex justify-between font-mono text-[11px] text-slate-600 mt-1.5">
          <span>受測者: ${appState.playerName}</span>
          <span>${r.ticketId}</span>
        </div>
      </div>

      <div class="py-3 border-b border-dashed border-slate-300 text-xs">
        <div class="font-mono font-bold text-slate-500 mb-1">【受測者病歷引述】</div>
        <p class="text-slate-900 font-medium leading-relaxed bg-white p-2.5 rounded border border-slate-200">「${r.story}」</p>
        <div class="flex flex-wrap gap-1 mt-2">${factorBadges}</div>
      </div>

      <div class="py-3.5 border-b-2 border-dashed border-slate-400 flex items-center justify-between relative">
        <div>
          <div class="font-mono text-[11px] text-slate-500">核定果糖階梯</div>
          <div class="text-base font-black text-slate-900">Lv.${r.level} ${r.levelName}</div>
          <div class="font-mono text-xs text-slate-700 mt-0.5">當量克數：<strong>${r.grams} g</strong></div>
        </div>
        <div class="text-right">
          <div class="font-mono text-[10px] text-slate-500">核定方糖當量</div>
          <div class="font-mono text-4xl font-black text-red-600">${r.cubes}<span class="text-sm ml-1">顆</span></div>
        </div>
      </div>

      <div class="py-3 border-b border-dashed border-slate-300 text-xs relative">
        <div class="font-mono font-bold text-slate-600 mb-1">【AI 審判庭毒舌臨床評語】</div>
        <p class="text-slate-900 font-bold leading-relaxed">${r.roast}</p>

        <div class="font-mono font-bold text-slate-600 mt-3 mb-1">【果糖怪解毒處方箋】</div>
        <p class="text-emerald-800 font-medium leading-relaxed">${r.prescription}</p>

        <div class="clinical-red-stamp absolute right-1 bottom-2 w-20 h-20 rounded-full border-4 border-red-600 text-red-600 flex flex-col items-center justify-center font-mono font-black bg-red-50/85 shadow-sm pointer-events-none">
          <span class="text-[8px] tracking-tighter">CLINICAL LAB</span>
          <span class="text-xs border-y border-red-600 px-1 my-0.5">${r.stamp || '重度調皮'}</span>
          <span class="text-[8px]">VERIFIED</span>
        </div>
      </div>

      <div class="pt-3 text-center font-mono">
        <div class="text-xs tracking-[0.28em] text-slate-800 font-black">||| |||| || ||||| ||| |||| ||||| || |||</div>
        <div class="text-[10px] text-slate-500 mt-1">FOUNDER-60G-12CUBES // ${r.dateStr}</div>
      </div>
    `;

    window.labAudio.playPrinter();
    requestAnimationFrame(() => {
      paper.style.maxHeight = '920px';
      paper.style.opacity = '1';
    });
  }

  function copyReceiptToClipboard() {
    if (!appState.currentReceipt) return;
    const r = appState.currentReceipt;
    const text = `🧾《全糖量測所・臨床社死診斷收據》
受測者：${appState.playerName} (${r.ticketId})
病歷：「${r.story}」
判決：${r.cubes} 顆方糖 (${r.grams}g) ｜ Lv.${r.level} ${r.levelName}
評語：${r.roast}
處方：${r.prescription}`;
    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 診斷證明已複製', '已複製到剪貼簿，快貼給朋友看！', 'emerald');
    }).catch(() => {
      showToast('📋 複製完成', '請直接分享您的方糖判決！', 'amber');
    });
  }

  function postReceiptToHallOfShame() {
    if (!appState.currentReceipt) return;
    const r = appState.currentReceipt;
    const nick = prompt('請輸入登上社死榮譽榜的匿名稱號：', appState.playerName);
    if (nick === null) return;

    const newItem = {
      id: `hos-${Date.now()}`,
      ticket: r.ticketId,
      author: nick.trim() || appState.playerName,
      category: r.cubes >= 100 ? '男宿暴露' : '尊稱錯亂',
      story: r.story,
      cubes: r.cubes,
      grams: r.grams,
      level: r.level,
      roast: r.roast,
      prescription: r.prescription,
      stamp: r.stamp || '重度調皮',
      timestamp: '剛剛'
    };

    appState.hallOfShameList.unshift(newItem);
    saveHallOfShame();
    renderHallOfShame();
    window.labAudio.playVictoryFanfare();
    switchLabPage(4);
    showToast('🏆 已登上第 4 頁全校社死榮譽榜', '你的荒謬事蹟已成為全糖量測所公開教材！', 'amber');
  }

  function exportIgStoryCard() {
    if (!appState.currentReceipt) return;
    const r = appState.currentReceipt;
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGrad.addColorStop(0, '#070A12');
    bgGrad.addColorStop(0.5, '#111827');
    bgGrad.addColorStop(1, '#1E1108');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 6;
    ctx.strokeRect(48, 48, 984, 1824);

    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 30px monospace';
    ctx.fillText(`FRUCTOSE ABSURDITY LAB // ${r.ticketId}`, 96, 140);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 56px sans-serif';
    ctx.fillText(`《全糖量測所：${appState.playerName} 診斷書》`, 88, 225);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(90, 290, 900, 340);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
    ctx.lineWidth = 3;
    ctx.strokeRect(90, 290, 900, 340);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = '36px sans-serif';
    drawWrappedText(ctx, `「${r.story}」`, 126, 390, 820, 52);

    ctx.fillStyle = 'rgba(245, 158, 11, 0.14)';
    ctx.fillRect(90, 680, 900, 380);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.strokeRect(90, 680, 900, 380);

    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 36px monospace';
    ctx.fillText(`核定果糖階梯：Lv.${r.level} ${r.levelName}`, 130, 755);

    ctx.fillStyle = '#EF4444';
    ctx.font = '900 135px monospace';
    ctx.fillText(`${r.cubes} 顆方糖`, 130, 920);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 38px monospace';
    ctx.fillText(`折合純糖重量：${r.grams} g  (理智臨界點 = 12顆/60g)`, 130, 1005);

    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('🔬 AI 審判庭毒舌臨床評語：', 96, 1150);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 38px sans-serif';
    drawWrappedText(ctx, r.roast, 96, 1215, 880, 56);

    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('💊 果糖怪專屬解毒處方箋：', 96, 1440);
    ctx.fillStyle = '#D1FAE5';
    ctx.font = '36px sans-serif';
    drawWrappedText(ctx, r.prescription, 96, 1505, 880, 54);

    const link = document.createElement('a');
    link.download = `${r.ticketId}-IG限動診斷卡.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    window.labAudio.playVictoryFanfare();
    showToast('📸 IG 限動炫耀圖卡已下載', '已生成 1080×1920 黑金實驗室高畫質診斷圖卡！', 'emerald');
  }

  function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    const chars = String(text).split('');
    let line = '';
    let curY = y;
    for (let i = 0; i < chars.length; i++) {
      const test = line + chars[i];
      if (ctx.measureText(test).width > maxWidth && i > 0) {
        ctx.fillText(line, x, curY);
        line = chars[i];
        curY += lineHeight;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, x, curY);
  }

  // ========================================================================
  // 9. 室友雙人 PK 擂台 & 第 4 頁遊樂場與榮譽榜
  // ========================================================================
  function drawRandomPkAct(player) {
    const pick = DATA.pkRandomActs[Math.floor(Math.random() * DATA.pkRandomActs.length)];
    const input = document.getElementById(player === 'A' ? 'pk-input-a' : 'pk-input-b');
    const nameInput = document.getElementById(player === 'A' ? 'pk-name-a' : 'pk-name-b');
    if (input) input.value = pick.text;
    if (nameInput && !nameInput.value) {
      nameInput.value = player === 'A' ? '404號房上舖阿哲' : '404號房下舖冠宇';
    }
    window.labAudio.playSugarDrop(2);
  }

  function startRoommatePkBattle() {
    const nameA = document.getElementById('pk-name-a')?.value.trim() || '室友 Player A';
    const nameB = document.getElementById('pk-name-b')?.value.trim() || '室友 Player B';
    const textA = document.getElementById('pk-input-a')?.value.trim() || '';
    const textB = document.getElementById('pk-input-b')?.value.trim() || '';

    if (!textA || !textB) {
      showToast('⚔️ 請填寫雙方事蹟', '請輸入兩位室友的蠢事，或點擊「🎲 隨機抽男宿蠢事」！', 'amber');
      return;
    }

    const vA = computeLocalSemanticVerdict(textA);
    const vB = computeLocalSemanticVerdict(textB);
    if (vA.cubes === vB.cubes) vB.cubes += 5;

    const beam = document.getElementById('pk-scale-beam');
    const resultBox = document.getElementById('pk-battle-result');
    const scoreAEl = document.getElementById('pk-score-a');
    const scoreBEl = document.getElementById('pk-score-b');

    if (scoreAEl) scoreAEl.textContent = `${vA.cubes} 顆 (${vA.grams}g)`;
    if (scoreBEl) scoreBEl.textContent = `${vB.cubes} 顆 (${vB.grams}g)`;

    if (beam) {
      const diff = vB.cubes - vA.cubes;
      const angle = Math.max(-22, Math.min(22, Math.round((diff / Math.max(vA.cubes, vB.cubes, 1)) * 22)));
      beam.style.transform = `rotate(${angle}deg)`;
    }

    const winnerName = vA.cubes > vB.cubes ? nameA : nameB;
    const loserName = vA.cubes > vB.cubes ? nameB : nameA;
    const winVerdict = vA.cubes > vB.cubes ? vA : vB;

    if (resultBox) {
      resultBox.classList.remove('hidden');
      resultBox.innerHTML = `
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div class="font-mono text-xs text-amber-400 font-bold">👑 雙人果糖對決最終宣判 // DORM PK WINNER</div>
            <h4 class="text-xl font-black text-white mt-1">
              恭喜 <span class="text-amber-300 underline">${winnerName}</span> 以 <span class="font-mono text-red-400">${winVerdict.cubes} 顆方糖</span> 奪得今日「寢室高果糖社死王」！
            </h4>
            <p class="text-xs text-slate-300 mt-1">${winVerdict.roast}（敗方 ${loserName} 今晚請喝無糖綠茶！）</p>
          </div>
          <button onclick="window.LabApp.sendPkWinnerToPrinter()"
                  class="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono text-xs font-black shrink-0">
            🧾 將勝方印成上方收據
          </button>
        </div>
      `;
    }

    appState.lastPkWinnerVerdict = {
      ...winVerdict,
      story: `【室友PK勝出：${winnerName}】${winVerdict.story}`
    };

    window.labAudio.playVictoryFanfare();
    triggerLabShake();
    setGlobalSugarCubes(Math.max(appState.globalSugarCubes, winVerdict.cubes), { syncLadder: true });
  }

  function sendPkWinnerToPrinter() {
    if (!appState.lastPkWinnerVerdict) return;
    renderThermalReceipt(appState.lastPkWinnerVerdict);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderBobaShakerToppings() {
    const box = document.getElementById('boba-toppings-list');
    if (!box) return;

    box.innerHTML = DATA.bobaToppings.map(t => {
      const active = appState.selectedToppings.includes(t.id);
      return `
        <button onclick="window.LabApp.toggleBobaTopping('${t.id}')"
                class="p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  active
                    ? 'bg-amber-500/25 border-amber-400 text-white'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700'
                }">
          <span class="text-xs font-bold">${t.name}</span>
          <span class="font-mono text-xs text-amber-300">+${t.cubes}顆</span>
        </button>
      `;
    }).join('');

    updateBobaCupPreview();
  }

  function toggleBobaTopping(id) {
    const idx = appState.selectedToppings.indexOf(id);
    if (idx >= 0) appState.selectedToppings.splice(idx, 1);
    else appState.selectedToppings.push(id);
    window.labAudio.playBubble();
    renderBobaShakerToppings();
  }

  function updateBobaCupPreview() {
    let total = 12;
    appState.selectedToppings.forEach(id => {
      const item = DATA.bobaToppings.find(x => x.id === id);
      if (item) total += item.cubes;
    });
    const label = document.getElementById('boba-cup-total');
    if (label) label.textContent = `${total} 顆方糖 (${total * 5}g)`;
    return total;
  }

  function shakeBobaCupAndDrink() {
    const cup = document.getElementById('boba-visual-cup');
    if (cup) {
      cup.classList.remove('shaking-cup');
      void cup.offsetWidth;
      cup.classList.add('shaking-cup');
    }
    const total = updateBobaCupPreview();
    window.labAudio.playShakerSound();
    setTimeout(() => {
      setGlobalSugarCubes(appState.globalSugarCubes + total, { syncLadder: true });
      broadcastMascotMessage(`🧋 特調手搖飲乾杯！一口氣灌入 +${total} 顆方糖！`);
    }, 450);
  }

  function startCockroachMiniGame() {
    if (appState.roachGame.running) return;
    appState.roachGame.running = true;
    appState.roachGame.hits = 0;
    appState.roachGame.misses = 0;
    appState.roachGame.timeLeft = 15;

    const arena = document.getElementById('roach-game-arena');
    const startBtn = document.getElementById('roach-start-btn');
    if (startBtn) startBtn.textContent = '🩴 戰鬥進行中... 快點擊飛天蟑螂！';

    updateRoachHud();

    appState.roachGame.timerId = setInterval(() => {
      appState.roachGame.timeLeft -= 1;
      updateRoachHud();
      if (appState.roachGame.timeLeft <= 0) {
        endCockroachMiniGame();
      }
    }, 1000);

    const spawnNext = () => {
      if (!appState.roachGame.running || !arena) return;
      arena.innerHTML = '';
      const isSupervisor = Math.random() < 0.22;
      const target = document.createElement('button');
      target.className = 'absolute text-3xl sm:text-4xl transition-transform hover:scale-125 select-none';
      target.style.left = `${8 + Math.random() * 78}%`;
      target.style.top = `${12 + Math.random() * 68}%`;
      target.textContent = isSupervisor ? '👮‍♂️' : '🪳';

      target.onclick = (e) => {
        e.stopPropagation();
        if (isSupervisor) {
          appState.roachGame.misses += 1;
          window.labAudio.playOverloadSiren();
          showToast('👮‍♂️ 誤拿拖鞋打中宿管組長！', '社死暴擊！直接罰加 +25 顆方糖！', 'red');
          setGlobalSugarCubes(appState.globalSugarCubes + 25, { syncLadder: true });
        } else {
          appState.roachGame.hits += 1;
          window.labAudio.playSugarDrop(1);
        }
        updateRoachHud();
        spawnNext();
      };

      arena.appendChild(target);
      appState.roachGame.spawnId = setTimeout(spawnNext, 780);
    };

    spawnNext();
  }

  function updateRoachHud() {
    const timeEl = document.getElementById('roach-time');
    const hitsEl = document.getElementById('roach-hits');
    if (timeEl) timeEl.textContent = `${appState.roachGame.timeLeft}s`;
    if (hitsEl) hitsEl.textContent = `擊殺: ${appState.roachGame.hits} 隻 ｜ 誤擊宿管: ${appState.roachGame.misses} 次`;
  }

  function endCockroachMiniGame() {
    appState.roachGame.running = false;
    clearInterval(appState.roachGame.timerId);
    clearTimeout(appState.roachGame.spawnId);

    const arena = document.getElementById('roach-game-arena');
    const startBtn = document.getElementById('roach-start-btn');
    if (startBtn) startBtn.textContent = '🪳 重新啟動 15 秒男宿打蟑螂測試';

    const { hits, misses } = appState.roachGame;
    const screamCubes = Math.max(0, (8 - hits) * 4 + misses * 25);
    if (arena) {
      arena.innerHTML = `
        <div class="text-center p-4">
          <div class="text-base font-black text-amber-300">戰鬥結束！共擊斃 ${hits} 隻飛天蟑螂</div>
          <div class="text-xs text-slate-300 mt-1">驚嚇與誤傷衍生方糖：+${screamCubes} 顆</div>
        </div>
      `;
    }
    if (screamCubes > 0) {
      setGlobalSugarCubes(appState.globalSugarCubes + screamCubes, { syncLadder: true });
    }
  }

  function updateHealingReactor() {
    const sA = document.getElementById('reactor-slider-a');
    const sB = document.getElementById('reactor-slider-b');
    const vA = sA ? parseInt(sA.value, 10) : 50;
    const vB = sB ? parseInt(sB.value, 10) : 50;
    appState.beakerMix.techA = vA;
    appState.beakerMix.humorB = vB;

    const fillA = document.getElementById('beaker-a-liquid');
    const fillB = document.getElementById('beaker-b-liquid');
    const fillCenter = document.getElementById('reactor-center-liquid');
    const valAText = document.getElementById('beaker-a-pct');
    const valBText = document.getElementById('beaker-b-pct');

    if (fillA) fillA.style.height = `${vA}%`;
    if (fillB) fillB.style.height = `${vB}%`;
    if (fillCenter) fillCenter.style.height = `${Math.round((vA + vB) / 2)}%`;
    if (valAText) valAText.textContent = `${vA}%`;
    if (valBText) valBText.textContent = `${vB}%`;
  }

  function synthesizeSocialHealing() {
    window.labAudio.playVictoryFanfare();
    const halved = Math.floor(appState.globalSugarCubes * 0.5);
    setGlobalSugarCubes(halved, { syncLadder: true });
    broadcastMascotMessage('⚗️ 社交治癒中和反應成功！您的社死方糖已減半轉化為友誼笑料！');
  }

  async function toggleMicSensor() {
    const btn = document.getElementById('mic-toggle-btn');
    const readout = document.getElementById('mic-db-value');
    if (window.labAudio.micActive) {
      window.labAudio.stopMicrophoneSensor();
      if (btn) btn.textContent = '🎙️ 測慘叫分貝';
      return;
    }
    const ok = await window.labAudio.startMicrophoneSensor(
      (db) => {
        if (readout) readout.textContent = `${db} dB`;
        if (db >= 88) {
          setGlobalSugarCubes(appState.globalSugarCubes + 2, { syncLadder: true });
        }
      },
      () => {
        const simDb = Math.floor(92 + Math.random() * 26);
        if (readout) readout.textContent = `${simDb} dB (模擬海豚音)`;
        window.labAudio.playSugarDrop(4);
        setGlobalSugarCubes(appState.globalSugarCubes + 15, { syncLadder: true });
        showToast(`🔊 男宿海豚音慘叫 ${simDb} dB`, '聲波震碎走廊玻璃！已自動換算 +15 顆方糖！', 'cyan');
      }
    );
    if (ok && btn) {
      btn.textContent = '⏹️ 停止聲納';
    }
  }

  function filterHallOfShame(category) {
    appState.hosFilter = category;
    renderHallOfShame();
  }

  function renderHallOfShame() {
    const grid = document.getElementById('hall-of-shame-grid');
    if (!grid) return;

    const list = appState.hallOfShameList.filter(
      item => appState.hosFilter === 'ALL' || item.category === appState.hosFilter
    );

    grid.innerHTML = list.map((item, idx) => `
      <div class="lab-card rounded-2xl p-5 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-2 flex-wrap mb-2">
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">#${idx + 1}</span>
              <span class="font-mono text-xs text-slate-400">${item.ticket}</span>
              <span class="text-xs px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">${item.category}</span>
            </div>
            <span class="font-mono text-xs text-slate-500">${item.timestamp || '最新'}</span>
          </div>

          <div class="text-xs text-slate-400 mb-1.5">受測苦主：<strong class="text-white">${item.author}</strong></div>
          <p class="text-sm text-slate-100 leading-relaxed bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">「${item.story}」</p>
          <p class="text-xs text-amber-300 mt-2.5 leading-relaxed">💬 <strong>臨床評語：</strong>${item.roast}</p>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
          <div>
            <span class="font-mono text-xs text-slate-400">當前累積：</span>
            <span class="font-mono text-lg font-extrabold text-amber-400">${item.cubes} 顆</span>
            <span class="font-mono text-xs text-slate-500">(${item.cubes * 5}g / Lv.${item.level})</span>
          </div>
          <div class="flex items-center gap-1.5">
            <button onclick="window.LabApp.addSugarToHosItem('${item.id}', 1)"
                    class="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400 text-amber-200 font-mono text-xs font-bold transition-all">
              🧊 +1 顆幫他加糖
            </button>
            <button onclick="window.LabApp.addSugarToHosItem('${item.id}', 12)"
                    class="px-2.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/35 border border-red-400 text-red-200 font-mono text-xs font-bold transition-all">
              +12 全糖
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function addSugarToHosItem(id, delta = 1) {
    const item = appState.hallOfShameList.find(x => x.id === id);
    if (!item) return;
    item.cubes += delta;
    item.grams = item.cubes * 5;
    item.level = cubesToLevelObj(item.cubes).level;
    saveHallOfShame();
    renderHallOfShame();
    window.labAudio.playSugarDrop(Math.min(delta, 4));
    setGlobalSugarCubes(appState.globalSugarCubes + delta, { syncLadder: false });
  }

  function toggleRootMode() {
    appState.rootClearance = !appState.rootClearance;
    const btn = document.getElementById('hud-root-btn');
    const panel = document.getElementById('root-overclock-bar');
    if (appState.rootClearance) {
      window.labAudio.playVictoryFanfare();
      if (btn) {
        btn.textContent = '🔓 ROOT LV.5';
        btn.className = 'px-2.5 py-1.5 rounded-lg font-mono text-xs font-bold bg-emerald-500/25 text-emerald-300 border border-emerald-400';
      }
      if (panel) panel.classList.remove('hidden');
    } else {
      appState.absurdityMultiplier = 1.0;
      if (btn) {
        btn.textContent = '🔒 LV.1';
        btn.className = 'px-2.5 py-1.5 rounded-lg font-mono text-xs bg-slate-900 text-slate-300 border border-slate-700';
      }
      if (panel) panel.classList.add('hidden');
      renderCalibrationSection();
    }
  }

  function setRootMultiplier(val) {
    appState.absurdityMultiplier = parseFloat(val) || 1.0;
    const lbl = document.getElementById('root-mult-display');
    if (lbl) lbl.textContent = `x${appState.absurdityMultiplier.toFixed(1)}`;
    renderCalibrationSection();
    onConfessionInputChanged();
  }

  function toggleModal(id, show = true) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', !show);
  }

  function saveApiSettings() {
    appState.apiConfig.mode = document.getElementById('modal-api-mode')?.value || 'instant';
    appState.apiConfig.provider = document.getElementById('modal-api-provider')?.value || 'openai';
    appState.apiConfig.apiKey = document.getElementById('modal-api-key')?.value.trim() || '';
    try {
      localStorage.setItem('fructose_v5_api', JSON.stringify(appState.apiConfig));
    } catch (e) {}

    const badge = document.getElementById('ai-engine-mode-badge');
    if (badge) {
      badge.textContent = appState.apiConfig.mode === 'live' && appState.apiConfig.apiKey
        ? `⚡ LIVE API (${appState.apiConfig.provider.toUpperCase()})`
        : '🧠 內建量子語意引擎 (免Key零延遲)';
    }
    toggleModal('api-settings-modal', false);
    showToast('⚙️ 引擎設定已儲存', 'AI 實時語意分析引擎設定已更新！', 'cyan');
  }

  function setViewportPreview(mode = 'auto') {
    document.body.classList.remove('preview-mode-mobile', 'preview-mode-tablet');
    if (mode === 'mobile') {
      document.body.classList.add('preview-mode-mobile');
      showToast('📱 已切換為「手機版 (390px)」排版預覽', '目前模擬手機直向螢幕與底部四頁切換導覽列！', 'amber');
    } else if (mode === 'tablet') {
      document.body.classList.add('preview-mode-tablet');
      showToast('📟 已切換為「平板版 (820px)」排版預覽', '目前模擬 iPad / 平板雙欄自適應排版！', 'cyan');
    } else {
      showToast('🖥️ 已切換為「全螢幕自適應 RWD」模式', '自動根據您的真實裝置調整排版！', 'emerald');
    }

    ['auto', 'tablet', 'mobile'].forEach(m => {
      const btn = document.getElementById(`vp-btn-${m}`);
      if (btn) {
        btn.className = m === mode
          ? 'px-2 py-1 rounded bg-amber-400 text-slate-950 font-mono text-[11px] font-black transition-all'
          : 'px-2 py-1 rounded bg-slate-900 text-slate-300 hover:text-amber-300 font-mono text-[11px] transition-all';
      }
    });
  }

  // ========================================================================
  // FLUID DYNAMIC CURSOR & MASCOT EYE TRACKING (自訂流體動態游標與眼睛追蹤)
  // ========================================================================
  function initCustomFluidCursor() {
    const dot = document.getElementById('custom-cursor-dot');
    const ring = document.getElementById('custom-cursor-ring');
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
      updateMascotEyes(mouseX, mouseY);
    });

    function renderCursorRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursorRing);
    }
    requestAnimationFrame(renderCursorRing);

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('button, a, input, textarea, select, [role="button"], .card-3d-item, .cursor-pointer, .liquid-glass-btn')) {
        document.body.classList.add('cursor-is-hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('button, a, input, textarea, select, [role="button"], .card-3d-item, .cursor-pointer, .liquid-glass-btn')) {
        document.body.classList.remove('cursor-is-hovering');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.add('cursor-is-clicking');
    });

    document.addEventListener('mouseup', () => {
      document.body.classList.remove('cursor-is-clicking');
    });
  }

  function updateMascotEyes(mouseX, mouseY) {
    const mascotBtn = document.getElementById('mascot-avatar-btn');
    const pupilLeft = document.getElementById('mascot-pupil-left');
    const pupilRight = document.getElementById('mascot-pupil-right');
    if (!mascotBtn || !pupilLeft || !pupilRight) return;

    const rect = mascotBtn.getBoundingClientRect();
    const mascotCenterX = rect.left + rect.width / 2;
    const mascotCenterY = rect.top + rect.height / 2;

    const dx = mouseX - mascotCenterX;
    const dy = mouseY - mascotCenterY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(4.2, Math.hypot(dx, dy) * 0.035);

    const pupilDx = Math.cos(angle) * distance;
    const pupilDy = Math.sin(angle) * distance;

    pupilLeft.style.transform = `translate(${pupilDx.toFixed(1)}px, ${pupilDy.toFixed(1)}px)`;
    pupilRight.style.transform = `translate(${pupilDx.toFixed(1)}px, ${pupilDy.toFixed(1)}px)`;
  }

  function toggleBgmMusic() {
    const playing = window.labAudio.toggleBGM();
    const eqBars = document.getElementById('hud-eq-bars');
    if (eqBars) {
      eqBars.classList.toggle('eq-paused', !playing);
    }
    showToast('背景環境音', playing ? '已開啟科幻實驗室 BGM 🎵' : '已關閉 BGM', playing ? 'emerald' : 'cyan');
  }

  // ========================================================================
  // INITIALIZE ALL MODULES
  // ========================================================================
  function init() {
    loadPersistedData();
    initCustomFluidCursor();
    render3DCarouselCards();
    start3DAutoOrbit();

    // 移入卡牌區暫停自動旋轉，移出繼續旋轉
    const sceneContainer = document.getElementById('carousel-scene-container');
    if (sceneContainer) {
      sceneContainer.addEventListener('mouseenter', () => {
        appState.carouselPausedByHover = true;
      });
      sceneContainer.addEventListener('mouseleave', () => {
        appState.carouselPausedByHover = false;
      });
      sceneContainer.addEventListener('touchstart', () => {
        appState.carouselPausedByHover = true;
      }, { passive: true });
      sceneContainer.addEventListener('touchend', () => {
        setTimeout(() => { appState.carouselPausedByHover = false; }, 1000);
      }, { passive: true });
    }

    renderBeverageBenchmarkCards();
    renderLadderSection();
    renderCalibrationSection();
    renderDeepDivePresetsAndMultipliers();
    renderBobaShakerToppings();
    updateHealingReactor();
    renderHallOfShame();
    setGlobalSugarCubes(12, { syncLadder: true });
    updateMascotUI(true);

    const input = document.getElementById('confession-textarea');
    if (input) {
      input.value = DATA.presetConfessions[0].text;
      onConfessionInputChanged();
    }
    renderThermalReceipt({
      ticketId: 'LAB-1285160',
      story: '上台把大刀教授叫阿嬤，還問吃飽沒...',
      cubes: 50,
      grams: 250,
      level: 7,
      levelName: '阿嬤孝孫級爆糖',
      stamp: '孝感動天',
      roast: '判決：50 顆方糖。尊嚴隨阿嬤去拜拜。',
      prescription: '每日服綠茶 3,000cc，下課幫教授提包包。',
      factors: ['👵 稱謂錯亂', '🎓 權威暴擊']
    });

    drawRandomPkAct('A');
    drawRandomPkAct('B');

    window.addEventListener('resize', () => {
      render3DCarouselCards();
    });
  }

  window.LabApp = {
    rotate3DCarousel,
    select3DCard,
    toggle3DAutoRotate,
    enterLabFrom3DLogin,
    reopen3DLoginPortal,
    toggleBgmMusic,
    switchLabPage,
    injectSugarToScale,
    randomDormBlindBoxSugar,
    triggerCreativeOverloadMode,
    emergencyGreenTeaFlush,
    selectBeverageStandard,
    selectLadderLevel,
    chooseQuizOption,
    jumpToQuizStep,
    toggleQuizViewMode,
    resetCalibrationQuiz,
    printQuizSummaryToReceipt,
    useReservedExample,
    saveCustomQuestionFromModal,
    fillPresetConfession,
    onConfessionInputChanged,
    runSemanticEngine,
    copyReceiptToClipboard,
    postReceiptToHallOfShame,
    exportIgStoryCard,
    drawRandomPkAct,
    startRoommatePkBattle,
    sendPkWinnerToPrinter,
    toggleBobaTopping,
    shakeBobaCupAndDrink,
    startCockroachMiniGame,
    updateHealingReactor,
    synthesizeSocialHealing,
    toggleMicSensor,
    filterHallOfShame,
    addSugarToHosItem,
    clickFructoseMonster,
    toggleRootMode,
    setRootMultiplier,
    toggleModal,
    saveApiSettings,
    setViewportPreview,
    toggleSound: () => {
      const enabled = window.labAudio.toggleSound();
      appState.soundEnabled = enabled;
      const btn = document.getElementById('hud-sound-btn');
      if (btn) btn.textContent = enabled ? '🔊' : '🔇';
    }
  };

  document.addEventListener('DOMContentLoaded', init);
})();
