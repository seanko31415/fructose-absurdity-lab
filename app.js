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
    // 題數模式：20題 / 30題 / 50題 / 100題
    questionCountMode: 20,
    activeQuestions: [],
    quizIndex: 0,
    quizAnswers: {},
    quizSecretCubes: 0,
    quizCompleted: false,
    soundEnabled: true,
    rootClearance: false,
    absurdityMultiplier: 1.0,
    monsterClicks: 0,
    easterEggUnlocked: false,
    // 高級遊樂場模組
    quantumStability: 100,
    distillerDrips: 12,
    distillerTemp: -196,
    neuralFreq: 432,
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
    const frame = document.getElementById('viewport-simulator-frame') || document.body;
    frame.classList.remove('shake-screen');
    void frame.offsetWidth;
    frame.classList.add('shake-screen');
    setTimeout(() => frame.classList.remove('shake-screen'), 580);
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
      setTimeout(() => {
        if (typeof item.remove === 'function') {
          item.remove();
        } else if (item.parentNode) {
          item.parentNode.removeChild(item);
        }
      }, 300);
    }, 3600);
  }

  // ========================================================================
  // 2. 清爽高質感 3D 煙燻液態玻璃卡牌登入艙 (Clean Smoked-Glass 3D Cards + Big SVG Art)
  // ========================================================================
  function getCardHeroSvgIllustration(card, idx) {
    const c = card.accent || '#38BDF8';
    const svgs = [
      // 0: 全糖真傳弟子 (巨型发光波霸珍奶杯插畫)
      `<svg viewBox="0 0 110 100" class="w-24 h-24 mx-auto drop-shadow">
        <circle cx="55" cy="52" r="40" fill="${c}18" stroke="${c}55" stroke-width="1.2" />
        <path d="M35,30 L75,30 L69,84 Q68,88 63,88 L47,88 Q42,88 41,84 Z" fill="#0B1325" stroke="${c}" stroke-width="2.2" />
        <path d="M39,50 Q55,55 71,50 L68,83 L42,83 Z" fill="${c}" opacity="0.65" />
        <line x1="62" y1="12" x2="50" y2="76" stroke="#FDE047" stroke-width="4.5" stroke-linecap="round" />
        <circle cx="48" cy="76" r="4" fill="#1E1B4B" /><circle cx="57" cy="78" r="4" fill="#1E1B4B" /><circle cx="63" cy="74" r="4" fill="#1E1B4B" />
      </svg>`,
      // 1: 社恐隱身特務 (全息雷達潛行護目鏡插畫)
      `<svg viewBox="0 0 110 100" class="w-24 h-24 mx-auto drop-shadow">
        <circle cx="55" cy="52" r="40" fill="${c}18" stroke="${c}55" stroke-width="1.2" />
        <path d="M28,58 C28,32 82,32 82,58 L76,78 L34,78 Z" fill="#0F172A" stroke="${c}" stroke-width="2" />
        <rect x="33" y="46" width="44" height="15" rx="7" fill="${c}" opacity="0.85" />
        <line x1="38" y1="53" x2="72" y2="53" stroke="#FFF" stroke-width="2" stroke-linecap="round" />
      </svg>`,
      // 2: 孝孫爆糖宗師 (皇家金冠與閃電茶杯插畫)
      `<svg viewBox="0 0 110 100" class="w-24 h-24 mx-auto drop-shadow">
        <circle cx="55" cy="52" r="40" fill="${c}18" stroke="${c}55" stroke-width="1.2" />
        <polygon points="28,68 34,34 48,48 55,26 62,48 76,34 82,68" fill="${c}" stroke="#FEF08A" stroke-width="2" stroke-linejoin="round" />
        <rect x="30" y="72" width="50" height="8" rx="4" fill="#FDE047" />
        <circle cx="55" cy="22" r="4" fill="#FFF" />
      </svg>`,
      // 3: 數位自爆狂人 (高能訊號衛星核爆插畫)
      `<svg viewBox="0 0 110 100" class="w-24 h-24 mx-auto drop-shadow">
        <circle cx="55" cy="52" r="40" fill="${c}18" stroke="${c}55" stroke-width="1.2" />
        <circle cx="55" cy="52" r="26" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="5 4" />
        <polygon points="58,20 38,54 54,54 48,84 72,48 56,48" fill="${c}" stroke="#FFF" stroke-width="1.5" />
      </svg>`,
      // 4: 果糖怪掌門人 (皇冠果糖大魔王插畫)
      `<svg viewBox="0 0 110 100" class="w-24 h-24 mx-auto drop-shadow">
        <circle cx="55" cy="52" r="40" fill="${c}18" stroke="${c}55" stroke-width="1.2" />
        <path d="M55,24 C78,24 86,44 86,66 C86,80 74,84 55,84 C36,84 24,80 24,66 C24,44 32,24 55,24 Z" fill="${c}" stroke="#FDE047" stroke-width="2" />
        <circle cx="44" cy="52" r="6.5" fill="#FFF" /><circle cx="45" cy="52" r="3" fill="#090D16" />
        <circle cx="66" cy="52" r="6.5" fill="#FFF" /><circle cx="65" cy="52" r="3" fill="#090D16" />
        <path d="M44,67 Q55,78 66,67 Z" fill="#450A0A" />
      </svg>`
    ];
    return svgs[idx % svgs.length];
  }

  function render3DCarouselCards() {
    const ring = document.getElementById('carousel-3d-ring');
    if (!ring) return;

    const cards = DATA.loginIdentityCards;
    const count = cards.length;
    const stepDeg = 360 / count;
    const isMobile = window.innerWidth < 640;
    // 加大旋轉半徑讓 5 張卡牌彼此分明、絕不擁擠雜亂
    const radius = isMobile ? 210 : 285;

    ring.innerHTML = cards.map((c, idx) => {
      const isSelected = idx === appState.carouselIndex;
      const angle = idx * stepDeg;
      const floatDelay = (idx * -0.75).toFixed(2);
      return `
        <div onclick="window.LabApp.select3DCard(${idx})"
             style="transform: rotateY(${angle}deg) translateZ(${radius}px);"
             class="card-3d-item ${isSelected ? 'active-3d-card' : ''}">
          <div class="card-3d-inner w-full h-full flex flex-col justify-between select-none relative"
               style="animation-delay: ${floatDelay}s;">

            <!-- 高級皇家巴洛克浮雕邊角花紋 (Ornate Filigree Patterns) -->
            <div class="card-filigree-frame"></div>
            <svg class="card-filigree-corner card-filigree-tl" viewBox="0 0 24 24"><path d="M2,2 L14,2 C10,6 6,10 2,14 Z M2,2 L2,20 C6,16 6,8 14,2 Z" fill="#FBBF24" opacity="0.75"/></svg>
            <svg class="card-filigree-corner card-filigree-tr" viewBox="0 0 24 24"><path d="M2,2 L14,2 C10,6 6,10 2,14 Z M2,2 L2,20 C6,16 6,8 14,2 Z" fill="#FBBF24" opacity="0.75"/></svg>
            <svg class="card-filigree-corner card-filigree-bl" viewBox="0 0 24 24"><path d="M2,2 L14,2 C10,6 6,10 2,14 Z M2,2 L2,20 C6,16 6,8 14,2 Z" fill="#FBBF24" opacity="0.75"/></svg>
            <svg class="card-filigree-corner card-filigree-br" viewBox="0 0 24 24"><path d="M2,2 L14,2 C10,6 6,10 2,14 Z M2,2 L2,20 C6,16 6,8 14,2 Z" fill="#FBBF24" opacity="0.75"/></svg>

            <div class="flex items-center justify-between font-mono text-[10px] px-1 relative z-10">
              <span style="color:${c.accent}" class="font-bold tracking-wider">${c.code}</span>
              <span class="embossed-badge px-2 py-0.5 rounded-full text-amber-200 font-mono text-[10px] font-bold">${c.initCubes}顆</span>
            </div>

            <!-- 中央大畫圖角色插畫 (Big Hero Vector Illustration) -->
            <div class="my-auto py-1 relative z-10">
              ${getCardHeroSvgIllustration(c, idx)}
              <h3 class="text-base font-black text-white text-center leading-tight mt-1.5">${c.title}</h3>
            </div>

            <div class="embossed-well px-2.5 py-1.5 rounded-xl text-[10px] text-cyan-200 font-bold text-center truncate relative z-10">
              ${c.perk}
            </div>
          </div>
        </div>
      `;
    }).join('');

    updateSelected3DCardSummary();
  }

  // 登入艙全息星空與動態星雲背景 (Ethereal Cosmic Nebula Canvas)
  function initLoginCosmicBackground() {
    const canvas = document.getElementById('login-starfield-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const colors = ['#F59E0B', '#06B6D4', '#EC4899', '#A855F7', '#FBBF24', '#38BDF8'];
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.15,
        alpha: Math.random() * 0.7 + 0.3,
        shape: Math.random() < 0.35 ? 'cube' : 'star'
      });
    }

    let nebulaPhase = 0;
    function render() {
      if (document.getElementById('login-3d-overlay')?.classList.contains('portal-hidden')) {
        return; // 若已進入主站，暫停背景運算省電
      }

      ctx.clearRect(0, 0, width, height);
      nebulaPhase += 0.008;

      // 1. 動態雙子星雲氣流
      const blob1X = width * 0.35 + Math.sin(nebulaPhase) * 110;
      const blob1Y = height * 0.3 + Math.cos(nebulaPhase * 0.8) * 70;
      const grad1 = ctx.createRadialGradient(blob1X, blob1Y, 10, blob1X, blob1Y, width * 0.45);
      grad1.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
      grad1.addColorStop(0.5, 'rgba(245, 158, 11, 0.06)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const blob2X = width * 0.68 + Math.cos(nebulaPhase * 1.2) * 100;
      const blob2Y = height * 0.65 + Math.sin(nebulaPhase * 0.9) * 80;
      const grad2 = ctx.createRadialGradient(blob2X, blob2Y, 10, blob2X, blob2Y, width * 0.42);
      grad2.addColorStop(0, 'rgba(6, 182, 212, 0.22)');
      grad2.addColorStop(0.5, 'rgba(168, 85, 247, 0.07)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 2. 懸浮方糖微粒與繁星
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;

        if (p.shape === 'cube') {
          ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2.2, p.r * 2.2);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  // 3D 卡牌平滑自動旋轉（滑鼠靠近時變慢轉動，絕不完全卡住停止！）
  function start3DAutoOrbit() {
    if (appState.carouselRafId) return;
    let lastTime = performance.now();
    function orbitStep(time) {
      const delta = Math.min(64, time - lastTime);
      lastTime = time;
      if (appState.carouselAutoRotate) {
        // 滑鼠靠近時減速為 1/4 慢速優雅旋轉，移開時恢復正常巡航速度
        const speed = appState.carouselPausedByHover ? 0.0068 : 0.028;
        appState.carouselAngle -= speed * delta;
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
    // 進入主站後暫停 3D 卡牌背景循環，確保主站按鈕與捲動 120fps 極速順暢
    stop3DAutoOrbit();

    const hudUser = document.getElementById('hud-user-identity');
    if (hudUser) {
      hudUser.textContent = `${appState.playerCard.icon} ${appState.playerName}`;
    }

    if (appState.playerCard.id === 'card-monster' && !appState.rootClearance) {
      toggleRootMode();
    }

    // 自動啟動調皮搞怪風背景音樂 (若尚未播放)
    if (window.labAudio && !window.labAudio.bgmPlaying && appState.soundEnabled) {
      window.labAudio.startBGM();
      const eqBars = document.getElementById('hud-eq-bars');
      if (eqBars) eqBars.classList.remove('eq-paused');
    }

    window.labAudio.playVictoryFanfare();
    setGlobalSugarCubes(appState.playerCard.initCubes, { syncLadder: true });
    switchLabPage(targetPage);
    broadcastMascotMessage(`歡迎【${appState.playerName}】！去第 2 頁問問題測糖度，或去第 4 頁玩街機遊戲！`);
  }

  function reopen3DLoginPortal() {
    const overlay = document.getElementById('login-3d-overlay');
    if (overlay) {
      overlay.classList.remove('portal-hidden');
      start3DAutoOrbit();
      initLoginCosmicBackground();
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
      quoteEl.setAttribute('data-ready', '1');
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

    if (quote && (newRandomQuote || !quote.getAttribute('data-ready'))) {
      const q = m.quotes[Math.floor(Math.random() * m.quotes.length)];
      quote.textContent = q;
      quote.setAttribute('data-ready', '1');
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
    feedMascotSugar(1);
  }

  // 餵食糖果魔王方糖
  function feedMascotSugar(count = 1) {
    appState.monsterClicks += count;
    const btn = document.getElementById('mascot-avatar-btn');
    if (btn) {
      btn.classList.remove('jelly-squish', 'jelly-bounce');
      void btn.offsetWidth;
      btn.classList.add('jelly-squish');
    }

    if (window.labAudio && window.labAudio.playJellySquish) {
      window.labAudio.playJellySquish();
    }
    if (window.labAudio && window.labAudio.playSugarDrop) {
      window.labAudio.playSugarDrop(count);
    }
    setGlobalSugarCubes(appState.globalSugarCubes + count, { syncLadder: false });
    updateMascotUI(true);

    const demonReplies = [
      `「嗷嗚！咕嚕吞下 ${count} 顆方糖！好甜好舒服～」`,
      `「甜度注入！我的眼睛在盯著你看呢，嘿嘿！」`,
      `「滿口焦糖香～多餵一點，飽食度滿 10 有隱藏大彩蛋喔！」`,
      `「呼呼～糖分神經突觸連線成功！再來一顆！」`
    ];
    const quoteEl = document.getElementById('mascot-quote-text');
    if (quoteEl) {
      quoteEl.textContent = demonReplies[Math.floor(Math.random() * demonReplies.length)];
    }

    if (appState.monsterClicks >= 10 && !appState.easterEggUnlocked) {
      triggerSecretMonsterEasterEgg();
    }
  }

  // 戳戳魔王肚皮
  function tickleMascotBelly() {
    const btn = document.getElementById('mascot-avatar-btn');
    if (btn) {
      btn.classList.remove('jelly-squish', 'jelly-bounce');
      void btn.offsetWidth;
      btn.classList.add('jelly-bounce');
    }
    if (window.labAudio && window.labAudio.playBubble) {
      window.labAudio.playBubble();
    }
    const quoteEl = document.getElementById('mascot-quote-text');
    if (quoteEl) {
      quoteEl.textContent = '「噗嗤哈哈哈！好癢！魔王的肚皮不是給人隨便戳的啦！(扭動)」';
    }
    showToast('🤏 戳戳肚皮', '糖果魔王被你戳得笑得合不攏嘴！', 'fuchsia');
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
  const randomBlindBoxSugar = randomDormBlindBoxSugar;

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

  // 3D 立體浮雕方糖鑄造機 (Embossed Sugar Mint Press)
  let mintedSugarCount = 4;
  function mintEmbossedSugar(icon = '🧊', label = '水晶方糖', cubes = 3) {
    mintedSugarCount += 1;
    const counter = document.getElementById('minted-sugar-counter');
    const showcase = document.getElementById('minted-crystal-showcase');
    if (counter) counter.textContent = `已鑄造: ${mintedSugarCount} 枚`;
    if (showcase) {
      const badge = document.createElement('span');
      badge.className = 'embossed-badge px-2 py-0.5 rounded-lg text-xs font-bold text-amber-200 inline-flex items-center gap-1 animate-bounce';
      badge.innerHTML = `<span>${icon}</span><span class="text-[10px]">+${cubes}</span>`;
      showcase.appendChild(badge);
      setTimeout(() => badge.classList.remove('animate-bounce'), 900);
      if (showcase.children.length > 12) {
        showcase.removeChild(showcase.children[1]);
      }
    }
    window.labAudio.playSugarDrop(Math.min(cubes, 5));
    setGlobalSugarCubes(appState.globalSugarCubes + cubes, { syncLadder: true });
    showToast(`⚜️ 壓鑄「${label}」成功`, `已鑄造立體浮雕結晶，天平注入 +${cubes} 顆方糖！`, 'amber');
  }

  function renderBeverageBenchmarkCards() {
    const grid = document.getElementById('beverage-benchmark-grid');
    if (!grid) return;

    grid.innerHTML = DATA.beverageStandards.map((b, idx) => {
      const fillPct = Math.min(92, 18 + idx * 19);
      return `
        <button onclick="window.LabApp.selectBeverageStandard(${b.level}, ${b.cubes})"
                class="liquid-glass-card rounded-2xl p-3 text-left transition-all relative overflow-hidden group ${
                  b.isCritical ? 'border-red-400/80 shadow-[0_0_25px_rgba(239,68,68,0.28)]' : ''
                }">
          <div class="flex items-center justify-between gap-1 mb-1.5">
            <span class="embossed-badge font-mono text-[9px] font-bold px-2 py-0.5 rounded" style="color:${b.color}; border-color:${b.color}88">
              ${b.tag}
            </span>
            <!-- 視覺化手搖杯 SVG 圖標 -->
            <svg viewBox="0 0 32 36" class="w-6 h-7 shrink-0">
              <path d="M6,6 L26,6 L23,32 Q22.5,34 20,34 L12,34 Q9.5,34 9,32 Z" fill="rgba(15,23,42,0.85)" stroke="${b.color}" stroke-width="1.8" />
              <rect x="8" y="${34 - (fillPct * 0.24)}" width="16" height="${fillPct * 0.24}" rx="2" fill="${b.color}" opacity="0.65" />
              <line x1="18" y1="1" x2="14" y2="30" stroke="#FDE047" stroke-width="2" stroke-linecap="round" />
            </svg>
          </div>
          <div class="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate">${b.title}</div>
          <div class="mt-1 flex items-baseline gap-1.5 font-mono">
            <span class="text-lg sm:text-xl font-extrabold text-amber-300">${b.cubes}顆</span>
            <span class="text-[10px] text-slate-400">/ ${b.grams}g</span>
          </div>
        </button>
      `;
    }).join('');
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

  // 全息糖分離心萃取機 (Holographic Sugar Centrifuge)
  function adjustCentrifugeRpm(rpmVal) {
    const rpm = parseInt(rpmVal, 10) || 6000;
    const rpmDisplay = document.getElementById('centrifuge-rpm-display');
    const statusTag = document.getElementById('centrifuge-status-tag');
    const sedimentLabel = document.getElementById('centrifuge-sediment-label');
    const rotor = document.getElementById('centrifuge-rotor');

    let stage = '待機運轉中';
    let sediment = '未分離 (均勻稀釋液)';
    if (rpm >= 10000) {
      stage = '⚡ 極速離心超載';
      sediment = '離心沉澱層：純度99.9% 巨型方糖塊 (120g)';
    } else if (rpm >= 7000) {
      stage = '💥 結晶高速析出';
      sediment = '離心沉澱層：特濃果糖膏 85g';
    } else if (rpm >= 4000) {
      stage = '🌀 正常分離沉澱';
      sediment = '離心沉澱層：濃稠金黃糖蜜 60g';
    } else if (rpm > 0) {
      stage = '緩慢混合中';
      sediment = '離心沉澱層：微量糖分沉積 20g';
    } else {
      stage = '🛑 停機狀態';
      sediment = '無沉澱析出';
    }

    if (rpmDisplay) {
      rpmDisplay.textContent = `${rpm.toLocaleString()} RPM (${stage.replace(/^[^\s]+\s*/, '')})`;
    }
    if (statusTag) {
      statusTag.textContent = stage;
      statusTag.className = `px-2 py-0.5 rounded text-[10px] font-bold border ${
        rpm >= 8000 ? 'bg-amber-500/25 text-amber-300 border-amber-400' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
      }`;
    }
    if (sedimentLabel) {
      sedimentLabel.textContent = sediment;
    }
    if (rotor) {
      if (rpm <= 0) {
        rotor.classList.add('centrifuge-rotor-paused');
      } else {
        rotor.classList.remove('centrifuge-rotor-paused');
        // RPM 越高，轉得越快 (0.75s ~ 0.08s)
        const duration = Math.max(0.08, (0.75 - (rpm / 12000) * 0.65)).toFixed(2);
        rotor.style.animationDuration = `${duration}s`;
      }
    }

    if (window.labAudio && window.labAudio.playCentrifugeWhir) {
      window.labAudio.playCentrifugeWhir(rpm);
    }
  }

  // 點擊超速萃取按鈕：高速甩動並析出純淨方糖
  function spinCentrifugeExtract() {
    const slider = document.getElementById('centrifuge-slider');
    const oldRpm = slider ? parseInt(slider.value, 10) : 6000;
    if (slider) slider.value = '12000';
    adjustCentrifugeRpm(12000);

    const bonus = Math.floor(Math.random() * 8) + 8; // 8 ~ 15 顆
    showToast('🌀 離心分離啟動！', `超速離心轉速爆發！成功析出 ${bonus} 顆純淨方糖結晶！`, 'amber');
    if (window.labAudio && window.labAudio.playSugarDrop) {
      window.labAudio.playSugarDrop(bonus);
    }
    setGlobalSugarCubes(appState.globalSugarCubes + bonus, { syncLadder: true });

    setTimeout(() => {
      if (slider) slider.value = String(oldRpm);
      adjustCentrifugeRpm(oldRpm);
    }, 1800);
  }

  // 向下相容折射儀函式
  function adjustRefractometer(brixVal) {
    const b = parseFloat(brixVal) || 12;
    adjustCentrifugeRpm(Math.round(b * 180));
  }

  // 點擊藝術雕塑晶格激發光學脈衝
  function pulseArtInstallation() {
    if (window.labAudio && window.labAudio.playSugarDrop) {
      window.labAudio.playSugarDrop(3);
    }
    setGlobalSugarCubes(appState.globalSugarCubes + 1, { syncLadder: false });
    showToast('✨ 藝術晶格激發', '光學雕塑共振！琥珀光環流轉，凝聚 1 枚純淨水晶方糖！', 'amber');
  }

  function renderLadderSection() {
    const lv = appState.activeLadderLevel;
    const maxLv = appState.easterEggUnlocked ? 15 : 14;
    const item = DATA.fructoseLevels[lv] || DATA.fructoseLevels[4];

    const liquid = document.getElementById('cylinder-liquid');
    const slider = document.getElementById('ladder-slider');
    const pourStream = document.getElementById('cylinder-top-stream');
    const mlVal = document.getElementById('cylinder-ml-val');
    const levelVal = document.getElementById('cylinder-level-val');
    const sliderBadge = document.getElementById('ladder-slider-val-badge');

    if (slider) {
      slider.max = String(maxLv);
      slider.value = String(lv);
    }

    if (mlVal) {
      const mlMap = [0, 15, 30, 45, 60, 120, 200, 250, 400, 600, 750, 800, 880, 950, 1000, 1500];
      mlVal.textContent = `${mlMap[lv] !== undefined ? mlMap[lv] : 60} mL`;
    }
    if (levelVal) {
      levelVal.textContent = `Lv.${item.level} ${item.name}`;
    }
    if (sliderBadge) {
      sliderBadge.textContent = `目前選擇：Lv.${item.level} ${item.name}`;
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
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="embossed-badge font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded ${item.badgeClass}">
                LV.${item.level} // ${item.stamp}
              </span>
              <span class="font-mono text-[11px] text-slate-400">黏度 ${item.viscosity}</span>
            </div>
            <h3 class="text-lg sm:text-2xl font-black text-white mt-1">${item.name}</h3>
          </div>
          <div class="embossed-well text-right font-mono px-3.5 py-2 rounded-2xl">
            <div class="text-xl sm:text-2xl font-extrabold text-amber-400">
              ${item.level === 14 ? '1,000+ 顆' : `${item.cubes} 顆`}
            </div>
            <div class="text-[10px] text-cyan-300">含糖 ${item.grams} g</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-3 text-xs">
          <div class="embossed-well p-2.5 rounded-xl">
            <div class="font-mono text-amber-300 font-bold mb-0.5 text-[11px]">🩺 生理反應</div>
            <p class="text-slate-200 leading-snug break-words">${item.symptom}</p>
          </div>
          <div class="embossed-well p-2.5 rounded-xl">
            <div class="font-mono text-cyan-300 font-bold mb-0.5 text-[11px]">🎬 典型現場</div>
            <p class="text-slate-200 leading-snug break-words">${item.example}</p>
          </div>
          <div class="embossed-well p-2.5 rounded-xl">
            <div class="font-mono text-emerald-300 font-bold mb-0.5 text-[11px]">💊 解毒處方</div>
            <p class="text-slate-200 leading-snug break-words">${item.prescription}</p>
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
  
  // ========================================================================
  // 7. 第 2 頁：核心「問問題測出你的糖度」(支援 20 / 30 / 50 / 100 題動態題庫)
  // 嚴格遵守：選項中絕不提前洩漏方糖數，作答完畢後才全面統計診斷揭曉！
  // ========================================================================

  // 25 組主題母體情境（動態乘載擴充至 20 / 30 / 50 / 100 題）
  const scenarioPool25 = [
    {
      scene: 'SCENE // 圖書館自習室',
      question: '期末自習室安靜到連根針掉地都聽得見，你點開影片，耳機沒連上，直接最大音量公放羞恥動漫撒嬌聲：',
      options: [
        { label: 'A', text: '面不改色繼續做筆記，假裝聲音不是我的', cubes: 2, note: '強大心理素質，但對面同學已憋笑抽搐' },
        { label: 'B', text: '手忙腳亂狂按音量鍵，發出劇烈假咳嗽掩飾', cubes: 8, note: '破音咳嗽與撒嬌聲完美交響' },
        { label: 'C', text: '起立大喊「這室友傳的！」奪門而出', cubes: 18, note: '全場百雙眼睛鎖定，室友隔空背鍋' },
        { label: 'D', text: '手滑把手機甩進學霸咖啡杯裡繼續公放', cubes: 32, note: '水陸立體聲社死傳奇成就達成' }
      ]
    },
    {
      scene: 'SCENE // 走廊樓梯轉角',
      question: '深夜走廊裝水，一隻巴掌大的會飛大蟑螂張開翅膀直線朝你臉上衝刺：',
      options: [
        { label: 'A', text: '眼神一凝，脫下拖鞋精準一擊必殺', cubes: 0, note: '無糖戰神！在場所有人拜你為義父' },
        { label: 'B', text: '怪叫一聲，百米衝刺閃回房內反鎖', cubes: 5, note: '微糖驚嚇，只有隔壁聽見嬌喘' },
        { label: 'C', text: '海豚音慘叫，無尾熊抱住剛開門的朋友', cubes: 16, note: '突破全糖臨界！整層開門圍觀抱抱' },
        { label: 'D', text: '殺蟲劑狂噴猛掃觸發走廊煙霧火警', cubes: 40, note: '生化浩劫！全棟寒風吹冷風點名' }
      ]
    },
    {
      scene: 'SCENE // 早八必修課堂',
      question: '早八必修課睡著被嚴格教授點名，驚醒站起來脫口而出：',
      options: [
        { label: 'A', text: '「報告教授，邏輯推導中請容我思考30秒。」', cubes: 1, note: '危機處理典範，教授點頭認可' },
        { label: 'B', text: '「阿姨我要大冰奶加蛋，內用！」', cubes: 10, note: '少糖夢遊！教授問可不可以幫代購' },
        { label: 'C', text: '「阿嬤早安！妳今天中午吃飽沒？」', cubes: 25, note: '孝孫爆糖！學分跟阿嬤去廟裡拜拜' },
        { label: 'D', text: '叫阿嬤還踢翻全糖珍奶一路滾到講台腳邊', cubes: 50, note: '身心雙重毀滅！預約明年第一排重修' }
      ]
    },
    {
      scene: 'SCENE // 數位萬人大群',
      question: '自拍配文「這課無聊到想圓寂」，按下發送才發現：',
      options: [
        { label: 'A', text: '發在自己的個人私人備忘錄裡', cubes: 0, note: '安全過關，僅果糖怪知曉' },
        { label: 'B', text: '發在好友4人群，2秒內光速收回', cubes: 4, note: '朋友截圖永遠比光速快0.1秒' },
        { label: 'C', text: '發在有系主任的180人必修大群無法收回', cubes: 22, note: '系主任回覆問號並將圖片置頂' },
        { label: 'D', text: '助教上課開投影機時直接放大在300吋巨幕', cubes: 65, note: '焦糖核爆！從此稱號圓寂武士' }
      ]
    },
    {
      scene: 'SCENE // 尖峰學餐美食街',
      question: '端麻婆豆腐走過暗戀對象身旁，腳底踩到油漬失去重心：',
      options: [
        { label: 'A', text: '太空步滑行穩住餐盤，一滴不漏', cubes: 2, note: '全場誤以為是熱舞社長帥氣登場' },
        { label: 'B', text: '單膝跪地做出求婚姿勢化解尷尬', cubes: 10, note: '暗戀對象以為你在跟打飯阿姨求婚' },
        { label: 'C', text: '大劈腿滑行三公尺，豆腐精準扣在自己頭頂', cubes: 28, note: '摩西分海！全場三百人起立鼓掌' },
        { label: 'D', text: '亂抓扯翻暗戀對象的熱湯與外套陪葬', cubes: 55, note: '史詩連坐！戀情尚未開始先入土' }
      ]
    },
    {
      scene: 'SCENE // 健身房更衣室',
      question: '在健身房更衣室吹頭髮，突然發現全身鏡裡反射著旁邊教練驚訝的表情：',
      options: [
        { label: 'A', text: '從容關掉吹風機，點頭致意離場', cubes: 1, note: '無懈可擊的紳士風度' },
        { label: 'B', text: '發現自己褲子穿反，迅速轉身整理', cubes: 8, note: '教練默默轉移視線' },
        { label: 'C', text: '拿著吹風機對著空氣假裝麥克風高歌副歌', cubes: 18, note: '被當成健身房表演型人格' },
        { label: 'D', text: '轉身滑倒直接撞進置物櫃整個人卡住', cubes: 36, note: '叫來三位巡場教練一起拔你出來' }
      ]
    },
    {
      scene: 'SCENE // 文青咖啡廳',
      question: '在文青咖啡廳點單，店員問「冰塊甜度怎麼調整？」，你神遊中脫口而出：',
      options: [
        { label: 'A', text: '「正常冰微糖，謝謝。」', cubes: 0, note: '日常純潔操作' },
        { label: 'B', text: '「加一匙胡椒，少蔥多辣！」', cubes: 7, note: '店員笑著問要不要加酸菜' },
        { label: 'C', text: '「只要店員笑一個，我都覺得甜！」', cubes: 22, note: '油膩土味暴擊！全咖啡廳瞬間冷場' },
        { label: 'D', text: '付錢拿悠遊卡在熱拿鐵杯蓋上連刷三次逼逼逼', cubes: 40, note: '整排排隊客人屏住呼吸看你刷咖啡' }
      ]
    },
    {
      scene: 'SCENE // 電梯密閉空間',
      question: '客滿 12 人的公司電梯緩慢上升，肚子突傳一陣雷鳴般的滾動聲：',
      options: [
        { label: 'A', text: '氣沉丹田，用意志力鎖死括約肌', cubes: 2, note: '成功化解危機於無形' },
        { label: 'B', text: '放出微弱氣聲，立刻低頭看手機', cubes: 9, note: '後方同事默默拉高衣領' },
        { label: 'C', text: '長達 4 秒重低音響屁，全場無人敢動', cubes: 26, note: '空氣凝固！樓層數字跳得比一世紀還慢' },
        { label: 'D', text: '放屁後電梯突然故障卡在樓層間整整十分鐘', cubes: 70, note: '生化封閉空間！所有人共同經歷人生走馬燈' }
      ]
    },
    {
      scene: 'SCENE // 跨年慶典晚會',
      question: '萬人跨年倒數最後 3 秒「3、2、1！」，大家都在相擁歡呼，你興奮舉起雙手：',
      options: [
        { label: 'A', text: '和同行朋友碰杯慶祝新年快樂', cubes: 1, note: '溫馨滿分無社死' },
        { label: 'B', text: '揮手打翻了隔壁陌生人的爆米花桶', cubes: 10, note: '新年第一秒就忙著在地上撿爆米花' },
        { label: 'C', text: '把旁邊穿羽絨衣的陌生大叔抱住親了一口', cubes: 35, note: '大叔老婆在旁邊眼神充滿殺氣' },
        { label: 'D', text: '跳躍落地直接踩裂舞台總控制線煙火啞火', cubes: 85, note: '全場萬人瞪大眼睛盯著你' }
      ]
    },
    {
      scene: 'SCENE // 線上會議報告',
      question: '百人遠距線上大會輪到你分享螢幕，你按下「共用整個螢幕」的那一刻：',
      options: [
        { label: 'A', text: '精準切換到準備好的乾淨簡報頁面', cubes: 0, note: '專業滿分操作' },
        { label: 'B', text: '跳出網購「生髮水與脫毛膏」購物車視窗', cubes: 14, note: '總監輕咳一聲提醒換頁' },
        { label: 'C', text: '視窗停在自己搜尋「如何假裝工作很忙」頁面', cubes: 28, note: '全螢幕截圖立刻出現在主管私訊群' },
        { label: 'D', text: '公放背景音樂是「戀愛告白模擬音檔」大音量播放', cubes: 60, note: '會議室百人共同見證你的少女心' }
      ]
    },
    {
      scene: 'SCENE // 捷運通勤車廂',
      question: '搭乘擠滿通勤族的捷運末班車，太睏不小心睡著：',
      options: [
        { label: 'A', text: '只是小點頭，到站前自然清醒', cubes: 1, note: '優雅的日常通勤者' },
        { label: 'B', text: '整顆頭靠在旁邊大叔肩膀上，還發出微弱鼾聲', cubes: 12, note: '大叔身體僵硬一動不敢動' },
        { label: 'C', text: '睡到口水流在大叔名牌西裝外套上形成地圖', cubes: 30, note: '大叔默默掏出衛生紙幫你擦拭' },
        { label: 'D', text: '夢遊突然站起來大喊「抓小偷啊！」驚醒整車乘客', cubes: 55, note: '列車長緊急連線停靠月台關心' }
      ]
    },
    {
      scene: 'SCENE // 社區倒垃圾現場',
      question: '提著兩大袋滿滿的廚餘垃圾走向垃圾車，在鄰居眾目睽睽之下：',
      options: [
        { label: 'A', text: '優雅準確丟入垃圾車壓縮槽', cubes: 0, note: '標準模範公民' },
        { label: 'B', text: '垃圾袋手把斷掉，袋子在地上滾了兩圈', cubes: 8, note: '清潔隊員好心幫忙撿起' },
        { label: 'C', text: '袋底破裂，隔夜麻辣火鍋湯汁淋在自己新白鞋上', cubes: 24, note: '整條巷子飄散著濃郁麻辣火鍋香氣' },
        { label: 'D', text: '丟垃圾甩太大力，連自己的手機一起甩進壓縮槽', cubes: 65, note: '隊員叫停整台垃圾車陪你在垃圾堆裡找手機' }
      ]
    },
    {
      scene: 'SCENE // 專業美髮沙龍',
      question: '設計師精雕細琢剪了一小時，拿起鏡子問你「帥嗎？還滿意嗎？」，鏡子裡你的瀏海短到像西瓜皮：',
      options: [
        { label: 'A', text: '禮貌微笑「很清爽，謝謝設計師」快步結帳', cubes: 3, note: '成熟大人的體面謊言' },
        { label: 'B', text: '呆滯 5 秒脫口而出「這是我嗎？怎麼像河童」', cubes: 12, note: '全店美髮師突然安靜' },
        { label: 'C', text: '當場眼眶泛紅默默滑下一顆淚珠', cubes: 28, note: '設計師慌忙拿整盒髮夾過來搶救' },
        { label: 'D', text: '戴上安全帽奪門而出，並宣布未來三個月不出門', cubes: 45, note: '成為該店傳奇案例照片' }
      ]
    },
    {
      scene: 'SCENE // 家族過年圍爐',
      question: '三十幾位親戚的大圓桌前，你站起來要敬酒，對著最有錢的大伯脫口喊道：',
      options: [
        { label: 'A', text: '「大伯新年快樂，身體健康萬事如意！」', cubes: 0, note: '吉祥話滿分，紅包加碼' },
        { label: 'B', text: '「二舅公新年快樂！」（全場提醒這是大伯）', cubes: 8, note: '氣氛略顯尷尬但紅包照拿' },
        { label: 'C', text: '「大伯你今年股票賠多少？有我多嗎？」', cubes: 32, note: '全桌長輩筷子同時停在半空中' },
        { label: 'D', text: '「爸，祝你早日找到第二春！」（親媽就坐在旁邊）', cubes: 90, note: '核平圍爐！家族群組瞬間被炸翻' }
      ]
    },
    {
      scene: 'SCENE // 牙醫洗牙候診',
      question: '躺在牙醫躺椅上洗牙，醫生說「嘴巴張大喔」，下一秒吸水管掉落：',
      options: [
        { label: 'A', text: '舉手示意暫停，擦拭嘴角', cubes: 1, note: '冷靜從容' },
        { label: 'B', text: '口水嗆到氣管發出劇烈咳嗽噴出水花', cubes: 11, note: '護士小姐迅速拿毛巾遮擋' },
        { label: 'C', text: '口水直接順著下巴流到耳根和衣服上', cubes: 24, note: '醫生溫柔安慰「沒事每個人都會這樣」' },
        { label: 'D', text: '咳嗽太猛直接把牙醫的放大鏡面罩震歪打翻托盤', cubes: 52, note: '診所全體醫護人員衝進來急救' }
      ]
    },
    {
      scene: 'SCENE // 超商深夜結帳',
      question: '買宵夜店員問「有會員嗎？請報電話號碼」，你心不在焉大聲唸出：',
      options: [
        { label: 'A', text: '自己順暢無比的手機號碼', cubes: 0, note: '絲滑結帳' },
        { label: 'B', text: '家裡二十年前的市話號碼', cubes: 6, note: '店員笑著說查無此人' },
        { label: 'C', text: '暗戀對象的生日加學號', cubes: 20, note: '後面排隊的人開始幫忙算星座' },
        { label: 'D', text: '大聲喊出自己提款卡的四位數密碼', cubes: 48, note: '全家店員與排隊客人齊聲喊「請不要報密碼！」' }
      ]
    },
    {
      scene: 'SCENE // 考場絕對安靜',
      question: '國家考試倒數 10 分鐘，考場針落有聲，你剛吃完麻辣鍋的腸胃突然發作：',
      options: [
        { label: 'A', text: '深呼吸收緊腹部，靠意志力撐到交卷鐘響', cubes: 2, note: '定力極強的考生' },
        { label: 'B', text: '肚子發出咕嚕嚕長達三秒的低音炮', cubes: 10, note: '隔壁考生默默分心看你一眼' },
        { label: 'C', text: '連續長音排氣伴隨回音，監考老師走到你身邊', cubes: 30, note: '監考老師輕聲問「同學需要去醫護室嗎」' },
        { label: 'D', text: '站起來衝向廁所時把桌子整張撞翻試卷漫天飛舞', cubes: 60, note: '考場秩序維護史上的重大事故' }
      ]
    },
    {
      scene: 'SCENE // 電影院生離死別高潮',
      question: '催淚大片演到男女主角生離死別、全場抽泣啜泣時，你喉嚨奇癢無比：',
      options: [
        { label: 'A', text: '用紙巾捂死嘴巴，發出悶悶的微響', cubes: 2, note: '極具同理心的觀影人' },
        { label: 'B', text: '一聲石破天驚的巨型噴嚏打破悲傷氣氛', cubes: 14, note: '前排觀眾被嚇得彈起來' },
        { label: 'C', text: '噴嚏同時將一整桶爆米花天女散花砸向前排所有頭頂', cubes: 32, note: '悲劇片當場變成爆笑喜劇' },
        { label: 'D', text: '嗆到打嗝不止，每三秒嗝一聲持續到片尾工作人員名單', cubes: 58, note: '全場觀眾記住的不是男主角而是你的打嗝聲' }
      ]
    },
    {
      scene: 'SCENE // 畢業典禮受獎',
      question: '台上校長親自頒發優秀學業獎，你踏上講台紅毯時踩到學士袍下擺：',
      options: [
        { label: 'A', text: '一個踉蹌立即站穩，微笑向校長鞠躬', cubes: 2, note: '優雅化解危機' },
        { label: 'B', text: '單膝下跪，乾脆順勢做出領取爵士榮譽姿勢', cubes: 12, note: '台下響起善意的掌聲' },
        { label: 'C', text: '向前撲倒直接抱住校長大腿，把校長褲子扯下一截', cubes: 45, note: '校史館永久封存的珍貴錄影' },
        { label: 'D', text: '學士帽飛出削中前方攝影師的百萬鏡頭', cubes: 75, note: '家長代表與全體師生全體起立驚呼' }
      ]
    },
    {
      scene: 'SCENE // 游泳池跳水台',
      question: '夏日泳池眾多帥哥美女在旁，你自信滿滿從三米跳板優美躍下：',
      options: [
        { label: 'A', text: '完美入水水花極小，全場讚嘆', cubes: 0, note: '水上王子/公主' },
        { label: 'B', text: '大肚子平拍落水「啪」的一聲巨響肚皮通紅', cubes: 15, note: '救生員差點吹哨衝過來' },
        { label: 'C', text: '浮出水面發現泳褲被水流衝脫卡在膝蓋處', cubes: 38, note: '只能泡在水裡假裝在練習閉氣' },
        { label: 'D', text: '泳褲漂浮在水面上被隔壁小朋友當成戰利品撈起來', cubes: 80, note: '只能在池底蹲到天黑清場' }
      ]
    },
    {
      scene: 'SCENE // 租屋處門口反鎖',
      question: '穿著蕾絲卡哇伊粉紅睡袍出來丟門口垃圾，大門「碰」一聲自動鎖死：',
      options: [
        { label: 'A', text: '口袋剛好有手機，從容聯絡房東開鎖', cubes: 2, note: '隨時有備無患' },
        { label: 'B', text: '蹲在門口用腳踏墊遮身等鄰居經過求助', cubes: 15, note: '走廊監視器記錄下無助背影' },
        { label: 'C', text: '正巧撞見整群外送員與巡邏警衛走上樓', cubes: 36, note: '當場成為大樓管委會焦點' },
        { label: 'D', text: '試圖翻爬走廊氣窗結果整個人卡在半空中進退兩難', cubes: 70, note: '出動消防隊動用油壓剪解救' }
      ]
    },
    {
      scene: 'SCENE // 公司大螢幕投影',
      question: '正在向客戶與高層簡報，手機連動投影突然彈出置頂浮動視窗：',
      options: [
        { label: 'A', text: '已事先開啟請勿打擾模式，無任何通知', cubes: 0, note: '專業商務菁英' },
        { label: 'B', text: '彈出外送平台「您的香酥雞排與大冰奶即將送達」', cubes: 12, note: '客戶笑問這家好不好吃' },
        { label: 'C', text: '曖昧對象訊息：「寶貝～今晚穿你買的戰袍好嗎？」', cubes: 38, note: '會議室溫度驟降至零下三十度' },
        { label: 'D', text: '通訊軟體群組跳出好友大罵本客戶是黑心老闆截圖', cubes: 85, note: '全場直接原地解散，合約直接火化' }
      ]
    },
    {
      scene: 'SCENE // 潮流鞋店試穿',
      question: '試穿最新款球鞋，店員請你在鏡子前走走看腳感：',
      options: [
        { label: 'A', text: '踩了兩步確認尺寸剛好，脫下交還店員', cubes: 0, note: '正常試穿流程' },
        { label: 'B', text: '單腳試穿走著走著神遊直接走到隔壁奶茶店排隊', cubes: 16, note: '店員拿著另一隻鞋追出來問先生要去哪' },
        { label: 'C', text: '原地起跳測試彈跳力，直接踩穿店內強化玻璃展台', cubes: 42, note: '當場從買鞋變成賠償展台全套' },
        { label: 'D', text: '脫鞋時露出破了五個大洞的大拇指與腳底板濃烈氣味', cubes: 65, note: '全店客人默默往後退散三公尺' }
      ]
    },
    {
      scene: 'SCENE // 觀光風景區合照',
      question: '幫熱戀中的情侶朋友在名勝風景區拍全身照，你負責掌鏡倒數：',
      options: [
        { label: 'A', text: '構圖完美光線充足，情侶非常感激', cubes: 0, note: '專業神隊友攝影師' },
        { label: 'B', text: '拍了三十張才發現相機開著前鏡頭，拍的全是自己的雙下巴', cubes: 18, note: '朋友檢查相簿時露出神秘笑容' },
        { label: 'C', text: '倒退取景沒注意身後，直接掉進許願池激起兩公尺水花', cubes: 40, note: '許願池旁所有遊客許願你平安' },
        { label: 'D', text: '腳滑撞倒旁邊有五百年歷史的古蹟石碑碎成兩半', cubes: 90, note: '直接榮登晚間新聞地方版頭條' }
      ]
    },
    {
      scene: 'SCENE // 超市試吃攤位',
      question: '熱情阿姨遞上一塊剛煎好的黑胡椒多汁香腸：「帥哥試吃看看！」你一口咬下：',
      options: [
        { label: 'A', text: '細嚼慢嚥讚不絕口並禮貌買了一包', cubes: 0, note: '攤位阿姨的最愛' },
        { label: 'B', text: '太燙直接把香腸吐在自己手掌心被阿姨全程目睹', cubes: 12, note: '阿姨連忙遞水安慰' },
        { label: 'C', text: '咬得太急連同竹籤一起吞下去引發劇烈乾嘔', cubes: 28, note: '整排推車客人駐足關心' },
        { label: 'D', text: '香腸噴汁直接精準射中對面客人的名牌絲巾', cubes: 55, note: '阿姨默默把整鍋香腸端到桌下裝沒看見' }
      ]
    }
  ];

  // 動態題庫生成器（精準生成 20 / 30 / 50 / 100 題）
  function generateQuestionsForMode(targetCount) {
    const questions = [];
    const poolLen = scenarioPool25.length;
    const variants = [
      '',
      '【突發情境：暗戀對象恰好站在你正前方】',
      '【突發情境：狂風暴雨天大家都在避雨】',
      '【突發情境：指導教授與大老闆正巧帶隊巡視】',
      '【突發情境：現場有三台手機正開著超清直播】'
    ];

    for (let i = 0; i < targetCount; i++) {
      const baseIdx = i % poolLen;
      const cycle = Math.floor(i / poolLen);
      const proto = scenarioPool25[baseIdx];
      const variantText = variants[cycle % variants.length];

      const qObj = {
        id: `dynamic_q_${targetCount}_${i + 1}`,
        step: i + 1,
        scene: `${proto.scene} // NO. ${String(i + 1).padStart(2, '0')}`,
        question: variantText ? `${variantText} ${proto.question}` : proto.question,
        options: proto.options.map((opt, oIdx) => ({
          label: opt.label,
          text: opt.text,
          cubes: Math.max(0, opt.cubes + (cycle > 0 ? (oIdx * 2 + cycle) : 0)),
          clinicalNote: opt.note
        }))
      };
      questions.push(qObj);
    }
    return questions;
  }

  // 設定測驗題數模式 (20 / 30 / 50 / 100 題)
  function setQuestionCountMode(count) {
    const validCount = [20, 30, 50, 100].includes(count) ? count : 20;
    appState.questionCountMode = validCount;

    [20, 30, 50, 100].forEach(c => {
      const btn = document.getElementById(`q-mode-${c}`);
      if (btn) {
        if (c === validCount) {
          btn.className = 'quiz-mode-pill px-2.5 py-1 rounded-lg text-amber-300 bg-amber-500/25 border border-amber-400 font-bold active transition-all shadow-[0_0_12px_rgba(245,158,11,0.25)]';
        } else {
          btn.className = 'quiz-mode-pill px-2.5 py-1 rounded-lg text-slate-300 bg-slate-900 border border-slate-700/80 transition-all hover:text-white';
        }
      }
    });

    appState.activeQuestions = generateQuestionsForMode(validCount);
    appState.quizIndex = 0;
    appState.quizAnswers = {};
    appState.quizCompleted = false;

    const revealBox = document.getElementById('quiz-final-reveal-box');
    if (revealBox) revealBox.classList.add('hidden');

    renderCalibrationSection();
    showToast('🎯 測驗模式就緒', `已載入全新 ${validCount} 道情境盲測！選項中不預先顯示糖度，測完為您全面結算！`, 'cyan');
  }

  function getQuizSumCubes() {
    let total = 0;
    Object.values(appState.quizAnswers).forEach(a => {
      total += a.cubes;
    });
    return Math.round(total * appState.absurdityMultiplier);
  }

  // 渲染題庫與選項（長文字自動折行，絕不截斷；選項絕對不帶方糖數字！）
  function renderCalibrationSection() {
    if (!appState.activeQuestions || appState.activeQuestions.length === 0) {
      appState.activeQuestions = generateQuestionsForMode(appState.questionCountMode || 20);
    }

    const qList = appState.activeQuestions;
    const totalCount = qList.length;
    const curIdx = Math.max(0, Math.min(appState.quizIndex, totalCount - 1));
    appState.quizIndex = curIdx;
    const curQ = qList[curIdx];

    const container = document.getElementById('calibration-quiz-box');
    const stepDots = document.getElementById('calibration-step-dots');
    const progressText = document.getElementById('quiz-progress-text');
    if (!container || !curQ) return;

    if (progressText) {
      const answeredCount = Object.keys(appState.quizAnswers).length;
      progressText.textContent = `第 ${curIdx + 1} 題 // 共 ${totalCount} 題 (已作答 ${answeredCount}/${totalCount})`;
    }

    if (stepDots) {
      // 若題目小於等於 30 題，全顯示按鈕；大於 30 題則滑動顯示當前周邊
      let displayIndices = [];
      if (totalCount <= 30) {
        displayIndices = Array.from({ length: totalCount }, (_, i) => i);
      } else {
        const start = Math.max(0, Math.min(curIdx - 7, totalCount - 15));
        const end = Math.min(totalCount, start + 15);
        for (let i = start; i < end; i++) displayIndices.push(i);
      }

      stepDots.innerHTML = displayIndices.map(idx => {
        const q = qList[idx];
        const answered = Boolean(appState.quizAnswers[q.id]);
        const isCurrent = idx === curIdx;
        return `
          <button onclick="window.LabApp.jumpToQuizStep(${idx})"
                  class="px-2 py-0.5 rounded font-mono text-[11px] font-bold border transition-all ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 border-amber-300 scale-105 shadow-[0_0_10px_#f59e0b]'
                      : answered
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                  }">
            Q${idx + 1}${answered ? '✓' : ''}
          </button>
        `;
      }).join('');
    }

    const chosen = appState.quizAnswers[curQ.id];

    container.innerHTML = `
      <div class="liquid-glass-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div class="flex items-center justify-between gap-2 flex-wrap border-b border-white/10 pb-2">
          <span class="font-mono text-xs text-cyan-400 font-bold tracking-wider break-words">${curQ.scene}</span>
          <span class="font-mono text-xs px-2.5 py-0.5 rounded ${
            chosen ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
          }">
            ${chosen ? '✅ 已直覺填答' : `進度 ${curIdx + 1} / ${totalCount}`}
          </span>
        </div>

        <!-- 題目文字：break-words 防止長字截斷 -->
        <h3 class="text-base sm:text-lg font-black text-white leading-relaxed break-words">
          ${curQ.question}
        </h3>

        <!-- 選項列表：絕不顯示任何顆數，純靠直覺作答！ -->
        <div class="space-y-2.5">
          ${curQ.options.map((opt, oIdx) => {
            const isSelected = chosen && chosen.optIndex === oIdx;
            return `
              <button onclick="window.LabApp.chooseQuizOption('${curQ.id}', ${oIdx})"
                      class="quiz-option-btn w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 group ${
                        isSelected
                          ? 'bg-amber-500/25 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.22)]'
                          : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-amber-500/50 hover:bg-slate-900/80'
                      }">
                <div class="flex items-start gap-3 w-full">
                  <span class="w-7 h-7 rounded-lg font-mono text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400 group-hover:text-amber-300'
                  }">${opt.label}</span>
                  <span class="text-sm leading-relaxed break-words flex-1 text-slate-100">${opt.text}</span>
                </div>
                <div class="shrink-0 text-slate-500 text-xs font-mono group-hover:text-amber-300">
                  ${isSelected ? '●' : '○'}
                </div>
              </button>
            `;
          }).join('')}
        </div>

        <!-- 選擇後僅揭示心理觀察小記，絕不揭示顆數 -->
        ${chosen ? `
          <div class="p-3.5 rounded-xl bg-slate-950/95 border border-cyan-500/40 text-xs text-cyan-200 flex items-start gap-2.5">
            <span class="text-base">🧪</span>
            <div>
              <div class="font-mono font-bold text-cyan-400">臨床反應記錄 (CLINICAL LOG)：</div>
              <p class="mt-0.5 text-slate-200 leading-relaxed break-words">${chosen.note}</p>
            </div>
          </div>
        ` : ''}

        <!-- 切換按鈕 -->
        <div class="flex items-center justify-between pt-3 border-t border-slate-800/80">
          <button onclick="window.LabApp.jumpToQuizStep(${Math.max(0, curIdx - 1)})"
                  ${curIdx === 0 ? 'disabled' : ''}
                  class="liquid-glass-btn px-4 py-2 rounded-xl font-mono text-xs text-slate-300 disabled:opacity-30">
            ← 上一題
          </button>
          <span class="font-mono text-xs text-slate-400">${curIdx + 1} / ${totalCount}</span>
          <button onclick="window.LabApp.jumpToQuizStep(${Math.min(totalCount - 1, curIdx + 1)})"
                  ${curIdx === totalCount - 1 ? 'disabled' : ''}
                  class="liquid-glass-amber px-4 py-2 rounded-xl font-mono text-xs font-bold text-slate-950 disabled:opacity-30">
            下一題 →
          </button>
        </div>
      </div>
    `;

    updateQuizGaugeAndSummary();
    renderReservedExpansionSlots();
  }

  function renderReservedExpansionSlots() {
    const qSlotBox = document.getElementById('reserved-question-slots-box');
    if (qSlotBox && DATA.reservedQuestionSlots) {
      qSlotBox.innerHTML = DATA.reservedQuestionSlots.map((slot, idx) => `
        <div class="p-4 rounded-2xl border-2 border-dashed border-amber-500/45 bg-slate-950/65 flex flex-col justify-between gap-3">
          <div>
            <div class="flex items-center justify-between font-mono text-xs text-amber-400 mb-1">
              <span>RESERVED SLOT // \${slot.slotId}</span>
              <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200">預留擴充題位</span>
            </div>
            <h4 class="font-bold text-sm text-white">\${slot.title}</h4>
            <p class="text-xs text-slate-400 mt-1 leading-relaxed">\${slot.placeholderDesc}</p>
          </div>
          <button onclick="window.LabApp.toggleModal('add-question-modal', true)"
                  class="w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/60 text-amber-200 font-mono text-xs font-bold transition-all">
            ➕ 點此立即填入您的新題目 (\${slot.slotId})
          </button>
        </div>
      `).join('');
    }

    const exSlotBox = document.getElementById('reserved-example-slots-box');
    if (exSlotBox && DATA.reservedExampleSlots) {
      exSlotBox.innerHTML = DATA.reservedExampleSlots.map((ex, i) => `
        <button onclick="window.LabApp.useReservedExample(\${i})"
                class="px-3.5 py-2 rounded-xl border-2 border-dashed border-cyan-400/50 bg-cyan-950/25 hover:bg-cyan-900/40 text-cyan-200 font-mono text-xs font-bold transition-all flex items-center gap-1.5">
          <span>\${ex.label}</span>
        </button>
      `).join('');
    }
  }

  function chooseQuizOption(qId, optIndex) {
    const qList = appState.activeQuestions;
    const q = qList.find(item => item.id === qId);
    if (!q) return;

    const opt = q.options[optIndex];
    appState.quizAnswers[qId] = {
      optIndex,
      cubes: opt.cubes,
      note: opt.clinicalNote,
      label: opt.label
    };

    window.labAudio.playSugarDrop(1);

    const answeredCount = Object.keys(appState.quizAnswers).length;
    const totalCount = qList.length;

    // 若全部作答完畢，自動結算揭曉！
    if (answeredCount >= totalCount) {
      finishAndRevealQuizVerdict();
    } else {
      // 自動前進下一題
      if (appState.quizIndex < totalCount - 1) {
        setTimeout(() => {
          appState.quizIndex += 1;
          renderCalibrationSection();
        }, 220);
      } else {
        renderCalibrationSection();
      }
    }
  }

  // 作答完畢：全面統計揭曉最終糖度
  function finishAndRevealQuizVerdict() {
    appState.quizCompleted = true;
    const sumCubes = getQuizSumCubes();
    const grams = sumCubes * 5;
    const lvObj = cubesToLevelObj(sumCubes);

    setGlobalSugarCubes(Math.max(appState.globalSugarCubes, sumCubes), { syncLadder: true });

    const revealBox = document.getElementById('quiz-final-reveal-box');
    const tagEl = document.getElementById('final-sugar-verdict-tag');
    const descEl = document.getElementById('final-sugar-verdict-desc');

    if (revealBox) {
      revealBox.classList.remove('hidden');
      if (tagEl) tagEl.textContent = `Lv.${lvObj.level} ${lvObj.name}`;
      if (descEl) {
        descEl.innerHTML = `
          <div class="text-amber-300 font-mono text-base font-black mb-1">
            總測得糖度：${sumCubes} 顆方糖 (含糖量 ${grams}g) — 【${lvObj.stamp}】
          </div>
          <div class="text-xs text-slate-200 leading-relaxed break-words">
            ${lvObj.symptom}
          </div>
        `;
      }
    }

    renderCalibrationSection();
    window.labAudio.playVictoryFanfare();
    if (sumCubes >= 25) triggerLabShake();
    broadcastMascotMessage(`🎉 全數問答完成！共核定 ${sumCubes} 顆方糖！獲得「${lvObj.name}」診斷！`);
    showToast('🎉 糖度結算完成！', `共計 ${sumCubes} 顆方糖（${grams}g），已核發診斷！可前往第 3 頁列印收據！`, 'amber');
  }

  function jumpToQuizStep(idx) {
    appState.quizIndex = idx;
    window.labAudio.playBubble();
    renderCalibrationSection();
  }

  function resetCalibrationQuiz() {
    appState.quizAnswers = {};
    appState.quizIndex = 0;
    appState.quizCompleted = false;
    const revealBox = document.getElementById('quiz-final-reveal-box');
    if (revealBox) revealBox.classList.add('hidden');
    window.labAudio.playBubble();
    renderCalibrationSection();
    showToast('🔄 測驗已重置', '所有回答與進度已歸零，請重新作答。', 'cyan');
  }

  function updateQuizGaugeAndSummary() {
    const answeredCount = Object.keys(appState.quizAnswers).length;
    const totalCount = appState.activeQuestions ? appState.activeQuestions.length : 20;
    const isCompleted = answeredCount >= totalCount && totalCount > 0;
    const pct = Math.round((answeredCount / Math.max(1, totalCount)) * 100);
    const sumCubes = getQuizSumCubes();
    const grams = sumCubes * 5;
    const lvObj = cubesToLevelObj(sumCubes);

    const circle = document.getElementById('quiz-gauge-circle');
    const pctEl = document.getElementById('quiz-gauge-pct');
    const answeredEl = document.getElementById('quiz-gauge-answered');
    const statusEl = document.getElementById('quiz-gauge-status');
    const pool = document.getElementById('quiz-crystal-pool');

    if (pctEl) {
      pctEl.textContent = isCompleted ? `${sumCubes} 顆` : `${pct}%`;
      pctEl.className = isCompleted
        ? 'font-mono text-2xl font-black text-amber-300 my-0.5'
        : 'font-mono text-2xl font-black text-cyan-300 my-0.5';
    }
    if (answeredEl) {
      answeredEl.textContent = isCompleted
        ? `總糖量 ${grams}g`
        : `${answeredCount} / ${totalCount} 題`;
    }
    if (statusEl) {
      statusEl.textContent = isCompleted
        ? `Lv.${lvObj.level} ${lvObj.name}`
        : answeredCount === 0 ? '等待作答' : '直覺盲測中';
    }

    if (circle) {
      const ratio = answeredCount / Math.max(1, totalCount);
      const offset = 283 - ratio * 283;
      circle.style.strokeDashoffset = String(offset);
      circle.setAttribute('stroke', isCompleted ? '#F59E0B' : '#06B6D4');
    }

    if (pool) {
      const iconCount = isCompleted
        ? Math.min(28, Math.max(1, Math.ceil(sumCubes / 4)))
        : Math.min(24, Math.max(0, answeredCount));
      pool.innerHTML = '';
      for (let i = 0; i < iconCount; i++) {
        const span = document.createElement('span');
        span.className = `sugar-cube-item ${isCompleted && sumCubes >= 50 ? 'syrup-gold' : ''}`;
        span.textContent = isCompleted && sumCubes >= 50 ? '🍯' : '🧊';
        pool.appendChild(span);
      }
    }

    updateNeuralAgitationGauge();
  }

  // 心率與羞恥腦波儀即時監控
  function updateNeuralAgitationGauge() {
    const answeredCount = Object.keys(appState.quizAnswers).length;
    const totalCount = appState.activeQuestions ? appState.activeQuestions.length : 20;
    const ratio = answeredCount / Math.max(1, totalCount);

    const bpmEl = document.getElementById('ecg-bpm-label');
    const frontalEl = document.getElementById('frontal-sugar-pct');
    const shameValEl = document.getElementById('shame-index-val');
    const shameBar = document.getElementById('shame-progress-bar');
    const ecgPath = document.getElementById('ecg-path');

    const bpm = Math.round(72 + ratio * 58);
    const frontalPct = Math.round(14 + ratio * 80);
    const shamePct = Math.round(20 + ratio * 78);

    let status = '正常平穩';
    if (shamePct >= 80) status = '😱 社死極限崩潰';
    else if (shamePct >= 50) status = '😳 羞恥感劇烈激增';
    else if (shamePct >= 30) status = '😅 輕微心慌';

    if (bpmEl) {
      bpmEl.textContent = `${bpm} BPM // ${status}`;
      bpmEl.className = `embossed-badge px-2 py-0.5 rounded font-black text-[11px] ${
        bpm > 105 ? 'text-rose-400 border-rose-500/50' : 'text-cyan-300 border-cyan-500/50'
      }`;
    }
    if (frontalEl) frontalEl.textContent = `${frontalPct}%`;
    if (shameValEl) shameValEl.textContent = `${shamePct}% ${status}`;
    if (shameBar) shameBar.style.width = `${shamePct}%`;

    if (ecgPath) {
      const animSpeed = Math.max(0.7, (2.4 - ratio * 1.5)).toFixed(2);
      ecgPath.style.animationDuration = `${animSpeed}s`;
    }
  }

  // 生理食鹽水手動冷卻腦電波
  function coolDownBrainWave() {
    const bpmEl = document.getElementById('ecg-bpm-label');
    const frontalEl = document.getElementById('frontal-sugar-pct');
    const shameValEl = document.getElementById('shame-index-val');
    const shameBar = document.getElementById('shame-progress-bar');
    const ecgPath = document.getElementById('ecg-path');

    if (bpmEl) bpmEl.textContent = '72 BPM // 冰鎮鎮靜';
    if (frontalEl) frontalEl.textContent = '8%';
    if (shameValEl) shameValEl.textContent = '5% 心如止水';
    if (shameBar) shameBar.style.width = '5%';
    if (ecgPath) ecgPath.style.animationDuration = '3.0s';

    if (window.labAudio && window.labAudio.playSugarDrop) {
      window.labAudio.playSugarDrop(3);
    }
    showToast('🧊 生理食鹽水冷卻', '已成功為額葉降溫！心電與羞恥腦波已回歸平靜！', 'cyan');
  }

  function printQuizSummaryToReceipt() {
    const sumCubes = getQuizSumCubes();
    const lvObj = cubesToLevelObj(sumCubes);
    const receiptData = {
      ticketId: `LAB-${Math.floor(1000000 + Math.random() * 9000000)}`,
      story: `【受測者：${appState.playerName}】完成 ${appState.questionCountMode || 20} 題情境心理測驗，共測出 ${sumCubes} 顆方糖當量（${sumCubes * 5}g）。`,
      cubes: sumCubes,
      grams: sumCubes * 5,
      level: lvObj.level,
      levelName: lvObj.name,
      stamp: lvObj.stamp,
      roast: `判決：${sumCubes} 顆方糖。臨床評語：${lvObj.symptom}`,
      prescription: lvObj.prescription,
      factors: ['問問題測糖度核定', `Lv.${lvObj.level} ${lvObj.name}`]
    };
    switchLabPage(3);
    setTimeout(() => renderThermalReceipt(receiptData), 220);
  }

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
      tagContainer.innerHTML = `<span class="font-mono text-xs text-slate-500">等待輸入以即時偵測羞恥語意因子（如：阿嬤、教授、大群、暗戀、咖啡、電梯...）</span>`;
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
    } else if (text.includes('臉盆') || text.includes('恐龍') || text.includes('卡住')) {
      roast = `判決：${finalCubes} 顆方糖。全場光學遮蔽奇蹟！那個恐龍頭套拯救了全場的視網膜。`;
    } else if (text.includes('螺螄粉') || text.includes('火警') || text.includes('警報')) {
      roast = `判決：${finalCubes} 顆方糖。一人觸發全棟逃生，你成功用一碗濃郁重口味完成了年度防災疏散演習。`;
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
      <div class="text-center border-b-2 border-dashed border-slate-400 pb-3 relative">
        <div class="flex items-center justify-between font-mono text-[9px] text-slate-500 mb-1">
          <span>ORIGINAL RX RECORD</span>
          <span class="px-1.5 py-0.2 rounded bg-slate-200 text-slate-800 font-bold">SECURED</span>
        </div>
        <div class="font-mono text-[10px] font-bold tracking-widest text-slate-500">FRUCTOSE ABSURDITY CLINICAL LAB // MODEL FR-9000</div>
        <h4 class="text-lg font-black text-slate-900 mt-0.5 tracking-tight">《全糖量測所・臨床社死診斷收據》</h4>
        <div class="flex justify-between font-mono text-[11px] text-slate-600 mt-1.5">
          <span>受測者: <strong>${appState.playerName}</strong></span>
          <span class="font-bold text-slate-800">${r.ticketId}</span>
        </div>
      </div>

      <div class="py-3 border-b border-dashed border-slate-300 text-xs">
        <div class="flex justify-between items-center font-mono font-bold text-slate-500 mb-1">
          <span>【受測者病歷引述】</span>
          <span class="text-[10px] text-slate-400">CONFIDENTIAL</span>
        </div>
        <p class="text-slate-900 font-medium leading-relaxed bg-white/90 p-2.5 rounded-lg border border-slate-300 shadow-sm">「${r.story}」</p>
        <div class="flex flex-wrap gap-1 mt-2">${factorBadges}</div>
      </div>

      <div class="py-3.5 border-b-2 border-dashed border-slate-400 flex items-center justify-between relative bg-amber-50/50 p-2 rounded-lg">
        <div>
          <div class="font-mono text-[11px] text-slate-500 font-bold">核定果糖階梯等級</div>
          <div class="text-base font-black text-slate-900">Lv.${r.level} ${r.levelName}</div>
          <div class="font-mono text-xs text-slate-700 mt-0.5">糖分當量：<strong class="text-amber-700">${r.grams} g</strong></div>
        </div>
        <div class="text-right">
          <div class="font-mono text-[10px] text-slate-500 font-bold">核定方糖總數</div>
          <div class="font-mono text-4xl font-black text-rose-600 drop-shadow-sm">${r.cubes}<span class="text-sm ml-1 text-slate-700">顆</span></div>
        </div>
      </div>

      <div class="py-3 border-b border-dashed border-slate-300 text-xs relative">
        <div class="font-mono font-bold text-slate-600 mb-1">【AI 審判庭毒舌臨床評語】</div>
        <p class="text-slate-900 font-bold leading-relaxed bg-white/80 p-2 rounded border border-slate-200">${r.roast}</p>

        <div class="font-mono font-bold text-slate-600 mt-2.5 mb-1">【果糖怪解毒處方箋】</div>
        <p class="text-emerald-900 font-bold leading-relaxed bg-emerald-50/90 p-2 rounded border border-emerald-300">${r.prescription}</p>

        <!-- 官方立體雙環防偽印章 (Double-Ring Clinical Seal) -->
        <div class="clinical-red-stamp absolute right-1 bottom-1.5 w-24 h-24 rounded-full border-4 border-double border-red-600 text-red-600 flex flex-col items-center justify-center font-mono font-black bg-red-50/90 shadow-md pointer-events-none">
          <span class="text-[7px] tracking-tighter">★ FRUCTOSE LAB ★</span>
          <span class="text-[13px] border-y-2 border-red-600 px-1.5 my-0.5">${r.stamp || '重度調皮'}</span>
          <span class="text-[7px] tracking-widest">CLINICAL VERIFIED</span>
        </div>
      </div>

      <div class="pt-3 text-center font-mono">
        <div class="text-xs tracking-[0.32em] text-slate-900 font-black">||| |||| | ||||| ||| |||| ||||| || |||</div>
        <div class="flex items-center justify-between text-[9px] text-slate-500 mt-1 px-1">
          <span>SEC: SHA256-AUTHENTIC</span>
          <span>FOUNDER-60G-12CUBES</span>
          <span>${r.dateStr}</span>
        </div>
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
      category: r.cubes >= 100 ? '史詩社死' : '尊稱錯亂',
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
      showToast('⚔️ 請填寫雙方事蹟', '請輸入兩位選手的事蹟，或點擊「🎲 隨機抽社死蠢事」！', 'amber');
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
            <div class="font-mono text-xs text-amber-400 font-bold">👑 雙人果糖對決最終宣判 // DUEL PK WINNER</div>
            <h4 class="text-xl font-black text-white mt-1">
              恭喜 <span class="text-amber-300 underline">${winnerName}</span> 以 <span class="font-mono text-red-400">${winVerdict.cubes} 顆方糖</span> 奪得今日「全場高果糖社死王」！
            </h4>
            <p class="text-xs text-slate-300 mt-1">${winVerdict.roast}（敗方 ${loserName} 負責請喝無糖綠茶！）</p>
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
      story: `【雙人對決勝出：${winnerName}】${winVerdict.story}`
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

  
  // ========================================================================
  // 10. 第 4 頁：全糖皇家街機遊樂場 (3 款真正好玩、高質感實時互動遊戲)
  // 遊戲 1: 極速磁浮接方糖 (Cyber Sugar Catcher)
  // 遊戲 2: 皇家 777 社死拉霸機 (Royal Jackpot Slot Machine)
  // 遊戲 3: 爆走果糖怪極速打擊戰 (Hyper-Reflex Monster Whack)
  // ========================================================================

  // --- 遊戲 1: 極速磁浮接方糖街機 (Cyber Sugar Catcher) ---
  const catcherGame = {
    running: false,
    score: 0,
    combo: 1,
    timeLeft: 30,
    paddleX: 150,
    paddleW: 66,
    items: [],
    popups: [],
    rafId: null,
    timerId: null
  };

  function initSugarCatcherArena() {
    const canvas = document.getElementById('sugar-catcher-canvas');
    if (!canvas) return;

    const updatePaddleFromEvent = (clientX) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0) return;
      const relX = ((clientX - rect.left) / rect.width) * canvas.width;
      catcherGame.paddleX = Math.max(catcherGame.paddleW / 2, Math.min(canvas.width - catcherGame.paddleW / 2, relX));
      if (!catcherGame.running) drawCatcherIdleFrame();
    };

    canvas.addEventListener('mousemove', (e) => updatePaddleFromEvent(e.clientX), { passive: true });
    canvas.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        updatePaddleFromEvent(e.touches[0].clientX);
      }
    }, { passive: true });

    drawCatcherIdleFrame();
  }

  function drawCatcherIdleFrame() {
    const canvas = document.getElementById('sugar-catcher-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 繪製暗黑科技網格
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // 預覽圖示與提示
    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🧊   🍯   🧋   👑', canvas.width / 2, 62);
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#67E8F9';
    ctx.fillText('點擊下方按鈕啟動・滑動接糖！', canvas.width / 2, 95);

    // 磁浮接盤
    const px = catcherGame.paddleX - catcherGame.paddleW / 2;
    const py = canvas.height - 22;
    ctx.fillStyle = '#06B6D4';
    ctx.fillRect(px, py, catcherGame.paddleW, 10);
    ctx.strokeStyle = '#E0F2FE';
    ctx.strokeRect(px, py, catcherGame.paddleW, 10);
  }

  function toggleSugarCatcherGame() {
    if (catcherGame.running) {
      endSugarCatcherGame();
      return;
    }

    const canvas = document.getElementById('sugar-catcher-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    catcherGame.running = true;
    catcherGame.score = 0;
    catcherGame.combo = 1;
    catcherGame.timeLeft = 30;
    catcherGame.items = [];
    catcherGame.popups = [];

    const startBtn = document.getElementById('catcher-start-btn');
    if (startBtn) startBtn.textContent = '⏹️ 遊戲進行中 (滑動上方接盤！)';
    updateCatcherHud();
    window.labAudio.playBubble();

    catcherGame.timerId = setInterval(() => {
      catcherGame.timeLeft -= 1;
      updateCatcherHud();
      if (catcherGame.timeLeft <= 0) {
        endSugarCatcherGame();
      }
    }, 1000);

    const catalog = [
      { icon: '🧊', pts: 10, speed: 2.3, isBomb: false, color: '#38BDF8' },
      { icon: '🍯', pts: 25, speed: 2.8, isBomb: false, color: '#FBBF24' },
      { icon: '🧋', pts: 45, speed: 3.3, isBomb: false, color: '#C084FC' },
      { icon: '👑', pts: 70, speed: 3.9, isBomb: false, color: '#F43F5E' },
      { icon: '🍵', pts: -20, speed: 2.9, isBomb: true, color: '#10B981' }
    ];

    let lastSpawn = 0;
    function stepFrame(ts) {
      if (!catcherGame.running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 產生掉落物
      if (ts - lastSpawn > 420) {
        lastSpawn = ts;
        const pick = catalog[Math.floor(Math.random() * catalog.length)];
        catcherGame.items.push({
          x: 20 + Math.random() * (canvas.width - 40),
          y: -15,
          ...pick
        });
      }

      // 繪製磁浮接盤
      const px = catcherGame.paddleX - catcherGame.paddleW / 2;
      const py = canvas.height - 22;
      ctx.fillStyle = '#06B6D4';
      ctx.fillRect(px, py, catcherGame.paddleW, 10);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(px, py, catcherGame.paddleW, 10);

      // 更新掉落物
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      for (let i = catcherGame.items.length - 1; i >= 0; i--) {
        const it = catcherGame.items[i];
        it.y += it.speed;
        ctx.fillText(it.icon, it.x, it.y);

        // 碰撞判定
        if (it.y >= py - 4 && it.y <= py + 16 && Math.abs(it.x - catcherGame.paddleX) <= catcherGame.paddleW / 2 + 12) {
          if (it.isBomb) {
            catcherGame.combo = 1;
            catcherGame.score = Math.max(0, catcherGame.score + it.pts);
            catcherGame.popups.push({ x: it.x, y: py - 8, text: '苦茶 -20!', color: '#EF4444', life: 24 });
            if (window.labAudio.playTone) window.labAudio.playTone(150, 'sawtooth', 0.14, 0.15);
          } else {
            const gain = it.pts * catcherGame.combo;
            catcherGame.score += gain;
            catcherGame.combo = Math.min(8, catcherGame.combo + 1);
            catcherGame.popups.push({ x: it.x, y: py - 8, text: `+${gain} (x${catcherGame.combo})`, color: it.color, life: 24 });
            if (window.labAudio.playTone) window.labAudio.playTone(480 + catcherGame.combo * 55, 'sine', 0.09, 0.12);
          }
          updateCatcherHud();
          catcherGame.items.splice(i, 1);
        } else if (it.y > canvas.height + 20) {
          if (!it.isBomb) catcherGame.combo = 1;
          catcherGame.items.splice(i, 1);
        }
      }

      // 繪製漂浮得分特效字
      ctx.font = 'bold 11px monospace';
      for (let i = catcherGame.popups.length - 1; i >= 0; i--) {
        const pop = catcherGame.popups[i];
        ctx.fillStyle = pop.color;
        ctx.fillText(pop.text, pop.x, pop.y);
        pop.y -= 1.2;
        pop.life -= 1;
        if (pop.life <= 0) catcherGame.popups.splice(i, 1);
      }

      catcherGame.rafId = requestAnimationFrame(stepFrame);
    }

    catcherGame.rafId = requestAnimationFrame(stepFrame);
  }

  function updateCatcherHud() {
    const el = document.getElementById('catcher-score-display');
    if (el) {
      el.textContent = `${catcherGame.timeLeft}s ｜ ${catcherGame.score}分 (x${catcherGame.combo})`;
    }
  }

  function endSugarCatcherGame() {
    catcherGame.running = false;
    if (catcherGame.timerId) clearInterval(catcherGame.timerId);
    if (catcherGame.rafId) cancelAnimationFrame(catcherGame.rafId);

    const startBtn = document.getElementById('catcher-start-btn');
    if (startBtn) startBtn.textContent = '🚀 再玩一局！啟動磁浮接糖 (30秒)';

    const earnedCubes = Math.max(5, Math.round(catcherGame.score / 15));
    setGlobalSugarCubes(appState.globalSugarCubes + earnedCubes, { syncLadder: true });
    window.labAudio.playVictoryFanfare();
    showToast('🎯 磁浮接糖結算！', `總分 ${catcherGame.score} 分！成功兌換 +${earnedCubes} 顆方糖注入天平！`, 'cyan');
    drawCatcherIdleFrame();
  }

  // --- 遊戲 2: 皇家 777 社死拉霸機 (Royal Jackpot Slot Machine) ---
  let slotSpinning = false;
  const slotSymbols = [
    { icon: '👑', name: '蜂王漿777', cubes: 150 },
    { icon: '🍯', name: '黃金焦糖', cubes: 80 },
    { icon: '🧋', name: '全糖珍奶', cubes: 50 },
    { icon: '🦖', name: '恐龍卡門', cubes: 40 },
    { icon: '💘', name: '暗戀社死', cubes: 60 },
    { icon: '💎', name: '鑽石冰糖', cubes: 100 }
  ];

  function spinFructoseSlotMachine() {
    if (slotSpinning) return;
    slotSpinning = true;

    const r1 = document.getElementById('slot-reel-1');
    const r2 = document.getElementById('slot-reel-2');
    const r3 = document.getElementById('slot-reel-3');
    const badge = document.getElementById('slot-status-badge');
    const resText = document.getElementById('slot-result-text');
    const spinBtn = document.getElementById('slot-spin-btn');

    if (badge) badge.textContent = '高速旋轉中...';
    if (spinBtn) spinBtn.textContent = '🎰 轉輪減速鎖定中...';

    // 提高中獎樂趣機率：30% 三連線 JACKPOT，45% 雙連線
    const roll = Math.random();
    let finalIdx1 = Math.floor(Math.random() * slotSymbols.length);
    let finalIdx2 = Math.floor(Math.random() * slotSymbols.length);
    let finalIdx3 = Math.floor(Math.random() * slotSymbols.length);

    if (roll < 0.30) {
      finalIdx2 = finalIdx1;
      finalIdx3 = finalIdx1;
    } else if (roll < 0.78) {
      finalIdx2 = finalIdx1;
    }

    const renderReel = (el, sym, highlight = false) => {
      if (!el) return;
      el.style.borderColor = highlight ? '#FBBF24' : 'rgba(255,255,255,0.14)';
      el.innerHTML = `
        <span class="text-3xl leading-none select-none">${sym.icon}</span>
        <span class="font-mono text-[10px] text-amber-200 mt-1 font-bold">${sym.name}</span>
      `;
    };

    let ticks = 0;
    const spinTimer = setInterval(() => {
      ticks++;
      if (ticks < 8) {
        renderReel(r1, slotSymbols[ticks % slotSymbols.length]);
      } else if (ticks === 8) {
        renderReel(r1, slotSymbols[finalIdx1], true);
        if (window.labAudio.playTone) window.labAudio.playTone(520, 'triangle', 0.08, 0.14);
      }

      if (ticks < 14) {
        renderReel(r2, slotSymbols[(ticks + 2) % slotSymbols.length]);
      } else if (ticks === 14) {
        renderReel(r2, slotSymbols[finalIdx2], true);
        if (window.labAudio.playTone) window.labAudio.playTone(660, 'triangle', 0.08, 0.14);
      }

      if (ticks < 20) {
        renderReel(r3, slotSymbols[(ticks + 4) % slotSymbols.length]);
        if (ticks % 2 === 0 && window.labAudio.playTone) {
          window.labAudio.playTone(300 + (ticks * 18), 'sine', 0.05, 0.08);
        }
      } else {
        clearInterval(spinTimer);
        renderReel(r3, slotSymbols[finalIdx3], true);
        slotSpinning = false;
        if (spinBtn) spinBtn.textContent = '🎰 再拉一次！啟動皇家拉霸';

        const s1 = slotSymbols[finalIdx1];
        const s2 = slotSymbols[finalIdx2];
        const s3 = slotSymbols[finalIdx3];

        if (finalIdx1 === finalIdx2 && finalIdx2 === finalIdx3) {
          const prize = s1.cubes;
          if (badge) badge.textContent = `🎉 JACKPOT +${prize}顆!`;
          if (resText) resText.textContent = `👑 恭喜三連線【${s1.name}】大滿貫！暴增 +${prize} 顆！`;
          window.labAudio.playVictoryFanfare();
          triggerLabShake();
          setGlobalSugarCubes(appState.globalSugarCubes + prize, { syncLadder: true });
          showToast('🎰 皇家 777 大滿貫！', `三顆【${s1.icon} ${s1.name}】連線！暴得 +${prize} 顆方糖！`, 'amber');
        } else if (finalIdx1 === finalIdx2 || finalIdx2 === finalIdx3 || finalIdx1 === finalIdx3) {
          const matchSym = finalIdx1 === finalIdx2 ? s1 : s3;
          const prize = 35;
          if (badge) badge.textContent = `✨ 雙連線 +${prize}顆`;
          if (resText) resText.textContent = `✨ 雙重【${matchSym.name}】連線！獲得 +${prize} 顆方糖！`;
          window.labAudio.playSugarDrop(4);
          setGlobalSugarCubes(appState.globalSugarCubes + prize, { syncLadder: true });
          showToast('🎰 雙連線中獎！', `抽中雙重【${matchSym.icon} ${matchSym.name}】，獲得 +${prize} 顆方糖！`, 'cyan');
        } else {
          const prize = 8;
          if (badge) badge.textContent = `🧊 安慰獎 +${prize}顆`;
          if (resText) resText.textContent = `差一點連線！果糖怪賞你 +${prize} 顆安慰方糖！`;
          window.labAudio.playSugarDrop(1);
          setGlobalSugarCubes(appState.globalSugarCubes + prize, { syncLadder: true });
        }
      }
    }, 65);
  }

  // --- 遊戲 3: 爆走果糖怪極速打擊戰 (Hyper-Reflex Monster Whack) ---
  const whackGame = {
    running: false,
    hits: 0,
    timeLeft: 20,
    activeHole: -1,
    activeType: null,
    timerId: null,
    popId: null
  };

  const whackTargets = [
    { icon: '🍯', name: '貪吃果糖怪', cubes: 15, isTrap: false },
    { icon: '👑', name: '黃金果糖王', cubes: 30, isTrap: false },
    { icon: '😈', name: '調皮爆糖怪', cubes: 20, isTrap: false },
    { icon: '🍵', name: '無糖綠茶刺客', cubes: -15, isTrap: true }
  ];

  function initMonsterWhackGrid() {
    const grid = document.getElementById('whack-monster-grid');
    if (!grid) return;
    grid.innerHTML = Array.from({ length: 9 }, (_, idx) => `
      <button id="whack-hole-${idx}"
        class="whack-hole-btn liquid-glass-btn rounded-xl flex items-center justify-center text-2xl h-full w-full select-none relative overflow-hidden"
        style="touch-action: manipulation;">
        <span class="opacity-20 text-sm">🕳️</span>
      </button>
    `).join('');

    // 支援 pointerdown 零延遲（0ms）即時擊打，徹底杜絕點擊不靈敏
    for (let i = 0; i < 9; i++) {
      const hole = document.getElementById(`whack-hole-${i}`);
      if (hole) {
        hole.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          whackMonsterHole(i);
        });
        hole.addEventListener('click', (e) => {
          e.preventDefault();
          whackMonsterHole(i);
        });
      }
    }
  }

  function startMonsterWhackGame() {
    if (whackGame.running) return;
    whackGame.running = true;
    whackGame.hits = 0;
    whackGame.timeLeft = 20;
    whackGame.lastHitTime = 0;

    const btn = document.getElementById('whack-start-btn');
    if (btn) btn.textContent = '⚡ 狂擊進行中！碰一下就得分！';
    updateWhackHud();
    window.labAudio.playBubble();

    whackGame.timerId = setInterval(() => {
      whackGame.timeLeft -= 1;
      updateWhackHud();
      if (whackGame.timeLeft <= 0) {
        endMonsterWhackGame();
      }
    }, 1000);

    const spawnNextMonster = () => {
      if (!whackGame.running) return;
      clearWhackHoles();
      const holeIdx = Math.floor(Math.random() * 9);
      const t = whackTargets[Math.floor(Math.random() * whackTargets.length)];
      whackGame.activeHole = holeIdx;
      whackGame.activeType = t;
      whackGame.recentHole = holeIdx;
      whackGame.recentType = t;

      const holeEl = document.getElementById(`whack-hole-${holeIdx}`);
      if (holeEl) {
        holeEl.innerHTML = `<span class="text-2xl sm:text-3xl animate-bounce inline-block pointer-events-none">${t.icon}</span>`;
        holeEl.style.borderColor = t.isTrap ? '#10B981' : '#F59E0B';
        holeEl.style.boxShadow = t.isTrap ? '0 0 16px rgba(16,185,129,0.5)' : '0 0 16px rgba(245,158,11,0.5)';
      }

      whackGame.popId = setTimeout(spawnNextMonster, 780);
    };

    spawnNextMonster();
  }

  function clearWhackHoles() {
    for (let i = 0; i < 9; i++) {
      const el = document.getElementById(`whack-hole-${i}`);
      if (el) {
        el.innerHTML = `<span class="opacity-20 text-sm">🕳️</span>`;
        el.style.borderColor = 'rgba(255,255,255,0.14)';
        el.style.boxShadow = 'none';
      }
    }
    // 保留最近 160ms 寬容判定，絕不吞指令
    setTimeout(() => {
      whackGame.recentHole = -1;
      whackGame.recentType = null;
    }, 160);
    whackGame.activeHole = -1;
    whackGame.activeType = null;
  }

  function whackMonsterHole(idx) {
    if (!whackGame.running) {
      startMonsterWhackGame();
      return;
    }

    const now = performance.now();
    if (now - (whackGame.lastHitTime || 0) < 60) return; // 60ms 物理防抖
    whackGame.lastHitTime = now;

    // 即時匹配或 160ms 寬容判定
    let matchedType = null;
    if (idx === whackGame.activeHole && whackGame.activeType) {
      matchedType = whackGame.activeType;
    } else if (idx === whackGame.recentHole && whackGame.recentType) {
      matchedType = whackGame.recentType;
    }

    if (!matchedType) return;

    const holeEl = document.getElementById(`whack-hole-${idx}`);
    if (matchedType.isTrap) {
      whackGame.hits = Math.max(0, whackGame.hits - 1);
      if (holeEl) {
        holeEl.innerHTML = `<span class="whack-score-pop font-mono text-sm font-black text-emerald-300">-15! 🍵</span>`;
      }
      if (window.labAudio && window.labAudio.playTone) {
        window.labAudio.playTone(160, 'sawtooth', 0.14, 0.14);
      }
    } else {
      whackGame.hits += 1;
      if (holeEl) {
        holeEl.innerHTML = `<span class="whack-score-pop font-mono text-sm font-black text-amber-300">+${matchedType.cubes}! 💥</span>`;
      }
      if (window.labAudio && window.labAudio.playMonsterHit) {
        window.labAudio.playMonsterHit();
      } else if (window.labAudio && window.labAudio.playJellySquish) {
        window.labAudio.playJellySquish();
      }
      setGlobalSugarCubes(appState.globalSugarCubes + matchedType.cubes, { syncLadder: false });
    }

    whackGame.activeHole = -1;
    whackGame.activeType = null;
    whackGame.recentHole = -1;
    whackGame.recentType = null;
    updateWhackHud();
  }

  function updateWhackHud() {
    const hud = document.getElementById('whack-hud-text');
    if (hud) {
      hud.textContent = `${whackGame.timeLeft}s ｜ 擊中 ${whackGame.hits} 次`;
    }
  }

  function endMonsterWhackGame() {
    whackGame.running = false;
    if (whackGame.timerId) clearInterval(whackGame.timerId);
    if (whackGame.popId) clearTimeout(whackGame.popId);
    clearWhackHoles();

    const btn = document.getElementById('whack-start-btn');
    if (btn) btn.textContent = '⚡ 再戰一局！啟動 20 秒極速連擊';
    window.labAudio.playVictoryFanfare();
    showToast('🔨 極速打擊結束！', `共成功擊中 ${whackGame.hits} 隻調皮果糖怪！`, 'fuchsia');
  }

  // 向下相容舊介面別名
  const resetQuantumReactor = toggleSugarCatcherGame;
  const stabilizeQuantumNode = whackMonsterHole;
  const distillCaramelDrop = spinFructoseSlotMachine;
  const adjustNeuralFrequency = () => {};
  const playNeuralResonanceChime = startMonsterWhackGame;

  function initPlaygroundApparatus() {
    initSugarCatcherArena();
    initMonsterWhackGrid();
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
        showToast(`🔊 極限海豚音慘叫 ${simDb} dB`, '聲波震碎玻璃！已自動換算 +15 顆方糖！', 'cyan');
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

    grid.innerHTML = list.map((item, idx) => {
      const lvObj = cubesToLevelObj(item.cubes);
      const lvNum = item.level !== undefined ? item.level : lvObj.level;
      const roastText = item.roast || lvObj.symptom || '認證全糖社死案例';
      const timeStr = item.timestamp || item.date || '最新';
      return `
        <div class="liquid-glass-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-2 flex-wrap mb-2">
              <div class="flex items-center gap-1.5">
                <span class="embossed-badge font-mono text-xs font-black px-2 py-0.5 rounded text-amber-300">#${idx + 1}</span>
                <span class="font-mono text-[11px] text-slate-400">${item.ticket}</span>
                <span class="text-[11px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">${item.category}</span>
              </div>
              <span class="font-mono text-[11px] text-slate-400">${timeStr}</span>
            </div>

            <div class="text-xs text-slate-300 mb-1.5">受測苦主：<strong class="text-white">${item.author}</strong></div>
            <p class="text-xs sm:text-sm text-slate-100 leading-relaxed embossed-well p-3 rounded-xl break-words">「${item.story}」</p>
            <p class="text-xs text-amber-300 mt-2 leading-relaxed break-words">💬 <strong>臨床評語：</strong>${roastText}</p>
          </div>

          <div class="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between gap-2">
            <div>
              <span class="font-mono text-base sm:text-lg font-extrabold text-amber-400">${item.cubes} 顆</span>
              <span class="font-mono text-[11px] text-cyan-300">(${item.cubes * 5}g / Lv.${lvNum})</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button onclick="window.LabApp.addSugarToHosItem('${item.id}', 1)"
                      class="liquid-glass-btn px-2.5 py-1.5 rounded-xl text-amber-200 font-mono text-xs font-bold">
                🧊 +1顆
              </button>
              <button onclick="window.LabApp.addSugarToHosItem('${item.id}', 12)"
                      class="liquid-glass-amber px-2.5 py-1.5 rounded-xl text-slate-950 font-mono text-xs font-black">
                +12全糖
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
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
  // FLUID DYNAMIC CURSOR & MASCOT EYE TRACKING (120fps 極速無延遲游標・零 DOM 負擔)
  // ========================================================================
  function initCustomFluidCursor() {
    const dot = document.getElementById('custom-cursor-dot');
    const ring = document.getElementById('custom-cursor-ring');
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    const onPointerMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // 核心光點與外環直接鎖定座標，完全不建立額外 DOM 節點，確保按鈕與捲動 120fps 絲滑順暢
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
      if (ringX < 0 || Math.hypot(mouseX - ringX, mouseY - ringY) > 160) {
        ringX = mouseX;
        ringY = mouseY;
      }
      ringX += (mouseX - ringX) * 0.78;
      ringY += (mouseY - ringY) * 0.78;
      ring.style.left = `${ringX.toFixed(1)}px`;
      ring.style.top = `${ringY.toFixed(1)}px`;
      updateMascotEyes(mouseX, mouseY);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    document.addEventListener('mouseover', (e) => {
      if (e.target && e.target.closest && e.target.closest('button, a, input, textarea, select, [role="button"], .card-3d-item, .cursor-pointer, .liquid-glass-btn')) {
        document.body.classList.add('cursor-is-hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target && e.target.closest && e.target.closest('button, a, input, textarea, select, [role="button"], .card-3d-item, .cursor-pointer, .liquid-glass-btn')) {
        document.body.classList.remove('cursor-is-hovering');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.add('cursor-is-clicking');
      // 僅在用戶從未手動關閉過 BGM、且尚未首次喚醒時才自動啟動
      if (!appState.bgmManualMuted && !appState.bgmFirstUnlocked && window.labAudio && !window.labAudio.bgmPlaying && appState.soundEnabled) {
        appState.bgmFirstUnlocked = true;
        window.labAudio.startBGM();
        const eqBars = document.getElementById('hud-eq-bars');
        if (eqBars) eqBars.classList.remove('eq-paused');
      }
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
    const distance = Math.min(6.5, Math.hypot(dx, dy) * 0.045);

    const pupilDx = Math.cos(angle) * distance;
    const pupilDy = Math.sin(angle) * distance;

    pupilLeft.style.transform = `translate(${pupilDx.toFixed(1)}px, ${pupilDy.toFixed(1)}px)`;
    pupilRight.style.transform = `translate(${pupilDx.toFixed(1)}px, ${pupilDy.toFixed(1)}px)`;
  }

  function toggleBgmMusic() {
    if (window.labAudio && window.labAudio.bgmPlaying) {
      appState.bgmManualMuted = true;
      window.labAudio.stopBGM();
      const eqBars = document.getElementById('hud-eq-bars');
      if (eqBars) {
        eqBars.classList.add('eq-paused');
      }
      showToast('背景環境音', '已完全關閉 BGM 🎵', 'cyan');
    } else if (window.labAudio) {
      appState.bgmManualMuted = false;
      window.labAudio.startBGM();
      const eqBars = document.getElementById('hud-eq-bars');
      if (eqBars) {
        eqBars.classList.remove('eq-paused');
      }
      showToast('背景環境音', '已開啟調皮搞笑 BGM 🎵', 'emerald');
    }
  }

  // ========================================================================
  // INITIALIZE ALL MODULES
  // ========================================================================
  function init() {
    loadPersistedData();
    initCustomFluidCursor();
    render3DCarouselCards();
    initLoginCosmicBackground();
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
    initPlaygroundApparatus();
    setQuestionCountMode(20);
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

  
  // 預留擴充與自訂題目功能
  function useReservedExample(index) {
    const ex = DATA.reservedExampleSlots && DATA.reservedExampleSlots[index];
    if (!ex) return;
    const input = document.getElementById('confession-textarea');
    if (input) {
      input.value = ex.text;
      onConfessionInputChanged();
    }
    showToast('📋 已載入範例', `已載入「${ex.label}」！前往第 3 頁可即時進行語意糖度分析。`, 'cyan');
  }

  function saveCustomQuestionFromModal() {
    const sceneInput = document.getElementById('new-q-scene');
    const titleInput = document.getElementById('new-q-title');
    const optA = document.getElementById('new-q-opt-a');
    const optB = document.getElementById('new-q-opt-b');
    const optC = document.getElementById('new-q-opt-c');
    const optD = document.getElementById('new-q-opt-d');

    const scene = sceneInput?.value.trim() || 'SCENE // 自訂擴充情境';
    const question = titleInput?.value.trim() || '';
    if (!question) {
      showToast('⚠️ 請輸入題目', '題目內容不能為空！', 'amber');
      return;
    }

    const newQ = {
      id: `custom_q_${Date.now()}`,
      step: (appState.activeQuestions ? appState.activeQuestions.length : 20) + 1,
      scene,
      question,
      options: [
        { label: 'A', text: optA?.value.trim() || '從容應對，淡定化解', cubes: 2, clinicalNote: '極高心理素質' },
        { label: 'B', text: optB?.value.trim() || '手忙腳亂，尷尬假笑', cubes: 10, clinicalNote: '日常少糖微死' },
        { label: 'C', text: optC?.value.trim() || '大聲轉移話題，拉朋友背鍋', cubes: 24, clinicalNote: '全糖爆發現場' },
        { label: 'D', text: optD?.value.trim() || '當場五體投地，宣布社會性退場', cubes: 55, clinicalNote: '焦糖核爆級毀滅' }
      ]
    };

    if (!appState.activeQuestions) appState.activeQuestions = [];
    appState.activeQuestions.push(newQ);
    appState.quizIndex = appState.activeQuestions.length - 1;
    toggleModal('add-question-modal', false);
    renderCalibrationSection();
    window.labAudio.playVictoryFanfare();
    showToast('✅ 新問題已加入題庫', `題庫已擴充至 ${appState.activeQuestions.length} 題！已切換至該題。`, 'emerald');
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
    randomBlindBoxSugar,
    randomDormBlindBoxSugar: randomBlindBoxSugar,
    triggerCreativeOverloadMode,
    emergencyGreenTeaFlush,
    selectBeverageStandard,
    selectLadderLevel,
    pulseArtInstallation,
    mintEmbossedSugar,
    adjustRefractometer,
    adjustCentrifugeRpm,
    spinCentrifugeExtract,
    setQuestionCountMode,
    chooseQuizOption,
    jumpToQuizStep,
    resetCalibrationQuiz,
    printQuizSummaryToReceipt,
    coolDownBrainWave,
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
    toggleSugarCatcherGame,
    spinFructoseSlotMachine,
    startMonsterWhackGame,
    whackMonsterHole,
    resetQuantumReactor,
    stabilizeQuantumNode,
    distillCaramelDrop,
    adjustNeuralFrequency,
    playNeuralResonanceChime,
    toggleMicSensor,
    filterHallOfShame,
    addSugarToHosItem,
    clickFructoseMonster,
    feedMascotSugar,
    tickleMascotBelly,
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
