/* ==========================================================================
   《全糖量測所：測測你的調皮不舒服程度》Fructose Absurdity Clinical Lab
   V5.1 Extreme Minimalist & Visual Edition — Data Library (data.js)
   文字大幅精簡 50% 以上：保留精準數據與犀利笑梗
   ========================================================================== */

window.FRUCTOSE_LAB_DATA = {
  // 0. 3D 環繞卡牌登入介面卡組 (極簡版)
  loginIdentityCards: [
    {
      id: 'card-founder',
      code: 'ID-01 // FOUNDER',
      icon: '🥤',
      title: '全糖真傳弟子',
      subtitle: '60g / 12顆方糖基準',
      initCubes: 12,
      perk: '初始 12 顆（理智臨界點）',
      accent: '#F59E0B',
      quote: '「這白癡行為給幾顆？」'
    },
    {
      id: 'card-dorm',
      code: 'ID-02 // DORM 404',
      icon: '🩲',
      title: '男宿 404 苦主',
      subtitle: '走廊與公共澡堂常客',
      initCubes: 8,
      perk: '男宿題自帶抗體加成',
      accent: '#06B6D4',
      quote: '「臉盆遮臉，裸奔的就是別人！」'
    },
    {
      id: 'card-grandma',
      code: 'ID-03 // GRANDMA',
      icon: '👵',
      title: '阿嬤認證孝孫',
      subtitle: '稱謂錯亂專家',
      initCubes: 50,
      perk: '初始 50 顆（孝孫級爆糖）',
      accent: '#EF4444',
      quote: '「教授早安…阿嬤妳吃飽沒？」'
    },
    {
      id: 'card-dino',
      code: 'ID-04 // DINO',
      icon: '🦖',
      title: '恐龍裝科目三戰神',
      subtitle: '肢體諧星藝術家',
      initCubes: 25,
      perk: '初始 25 顆雙倍全糖抗體',
      accent: '#10B981',
      quote: '「在學餐跌倒也要像街舞！」'
    },
    {
      id: 'card-library',
      code: 'ID-05 // AUDIO',
      icon: '🎧',
      title: '耳機斷線特務',
      subtitle: '公放與錯頻製造機',
      initCubes: 15,
      perk: '數位廣播社死精準偵測',
      accent: '#A855F7',
      quote: '「全自習室都在看我…」'
    },
    {
      id: 'card-monster',
      code: 'ID-06 // JUDGE',
      icon: '🍯',
      title: '果糖怪首席審判官',
      subtitle: '最高權限無糖審判',
      initCubes: 0,
      perk: '解鎖 LV.5 權限，從 0 顆審判他人',
      accent: '#EC4899',
      quote: '「把朋友叫來，幫他量糖度！」'
    }
  ],

  // 0-B. 預留問題與例子卡槽（供隨時擴充）
  reservedQuestionSlots: [
    {
      slotId: 'SLOT-Q6',
      title: '【預留問題 #06】隨時補充',
      placeholderDesc: '專屬預留位，可點擊填入新題目或隨時告訴我。',
      defaultOptions: ['微糖 (+3顆)', '半糖 (+8顆)', '爆糖 (+25顆)']
    },
    {
      slotId: 'SLOT-Q7',
      title: '【預留問題 #07】情境問答位',
      placeholderDesc: '支援題幹、選項與毒舌評語。',
      defaultOptions: ['裝沒事 (+1顆)', '當場社死 (+15顆)', '1L核爆 (+100顆)']
    }
  ],

  reservedExampleSlots: [
    {
      slotId: 'EX-SLOT-1',
      label: '📌 預留例子 A',
      sampleText: '【預留例子 A】點此直接填入測試！'
    },
    {
      slotId: 'EX-SLOT-2',
      label: '📌 預留例子 B',
      sampleText: '【預留例子 B】後續快速擴充位。'
    },
    {
      slotId: 'EX-SLOT-3',
      label: '📌 預留例子 C',
      sampleText: '【預留例子 C】點擊帶入問答框。'
    }
  ],

  // 0-C. 糖分過高彈幕詞庫 (精簡版)
  hallucinationTexts: [
    '🚨 警告：糖分過高！全站焦糖化地震中！',
    '👵 阿嬤出現在你背後問你吃飽沒...',
    '🛢️ 1L 高果糖糖漿淹沒螢幕！',
    '🦖 恐龍裝卡在飲水機拔不出來！',
    '🎧 耳機沒連上！動漫撒嬌聲公放中！',
    '💉 點「注射無糖綠茶」停止晃動！'
  ],

  // 1. 手搖飲糖度基準 (極簡版)
  beverageStandards: [
    {
      id: 'std-0',
      title: '無糖 (0%)',
      grams: 0,
      cubes: 0,
      level: 0,
      bpm: 62,
      tag: 'SAFE // 純潔',
      color: '#10B981',
      desc: '理智滿分，連呼吸都符合校規。'
    },
    {
      id: 'std-1',
      title: '微糖 (25%)',
      grams: 15,
      cubes: 3,
      level: 1,
      bpm: 78,
      tag: 'MILD // 小尷尬',
      color: '#06B6D4',
      desc: '腳趾抓地，假裝伸懶腰看天空。'
    },
    {
      id: 'std-2',
      title: '半糖 (50%)',
      grams: 30,
      cubes: 6,
      level: 2,
      bpm: 96,
      tag: 'WARN // 空氣凝結',
      color: '#FBBF24',
      desc: '走錯教室坐了半節課還舉手。'
    },
    {
      id: 'std-3',
      title: '少糖 (70%)',
      grams: 50,
      cubes: 10,
      level: 3,
      bpm: 118,
      tag: 'HIGH // 社交危險',
      color: '#F59E0B',
      desc: '四角褲拿外送被鎖在門外。'
    },
    {
      id: 'std-4',
      title: '全糖 (100%)',
      grams: 60,
      cubes: 12,
      level: 4,
      bpm: 152,
      tag: 'CRITICAL // 創始人極限',
      color: '#EF4444',
      isCritical: true,
      desc: '【理智臨界點】超過此線進入社死領域！'
    }
  ],

  // 2. 15 階果糖階梯 (極簡版，字數砍半)
  fructoseLevels: [
    {
      level: 0,
      name: '無糖純潔態',
      cubes: 0,
      grams: 0,
      viscosity: '1.0 cP',
      stamp: '純潔無糖',
      zone: 'PURE ZERO',
      color: 'from-emerald-400/70 to-cyan-500/80',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      symptom: '心如止水，防禦力滿分。',
      example: '早八坐第一排，零社死紀錄。',
      prescription: '無需解毒，建議去男宿沾沾人間煙火。'
    },
    {
      level: 1,
      name: '微糖小尷尬',
      cubes: 3,
      grams: 15,
      viscosity: '1.8 cP',
      stamp: '微糖調皮',
      zone: 'MILD AWKWARD',
      color: 'from-cyan-400/75 to-teal-500/85',
      badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      symptom: '腳趾抓地，3秒內滑手機裝沒事。',
      example: '圖書館閘門逼不過被後排看。',
      prescription: '小聲嘀咕「機器又壞了」閃人。'
    },
    {
      level: 2,
      name: '半糖空氣凝結',
      cubes: 6,
      grams: 30,
      viscosity: '4.2 cP',
      stamp: '半糖凝結',
      zone: 'AIR FREEZE',
      color: 'from-teal-400/80 to-amber-300/85',
      badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
      symptom: '空氣安靜 3 秒，耳根微熱。',
      example: '「阿姨我要大冰奶加蛋，內用外帶！」',
      prescription: '微笑付錢快步走，換一家買。'
    },
    {
      level: 3,
      name: '少糖社交危險',
      cubes: 10,
      grams: 50,
      viscosity: '12.5 cP',
      stamp: '少糖危險',
      zone: 'SOCIAL RISK',
      color: 'from-yellow-400/85 to-amber-500/90',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      symptom: '手心冒汗，腦內不斷倒帶。',
      example: '熱情揮手，對方直接撲向身後學長。',
      prescription: '順勢伸懶腰假裝在做伸展操。'
    },
    {
      level: 4,
      name: '全糖創始人臨界點',
      cubes: 12,
      grams: 60,
      viscosity: '28.5 cP',
      stamp: '創始人認證',
      zone: 'FOUNDER THRESHOLD',
      color: 'from-amber-400/90 to-orange-500/95',
      badgeClass: 'bg-orange-500/25 text-orange-200 border-orange-400',
      symptom: '【人類理智極限】12顆方糖滿載！',
      example: '恐龍裝跳科目三卡在飲水機。',
      prescription: '請室友拍照留念，喝無糖烏龍茶。'
    },
    {
      level: 5,
      name: '雙倍全糖亢奮',
      cubes: 25,
      grams: 125,
      viscosity: '75.0 cP',
      stamp: '雙倍亢奮',
      zone: 'DOUBLE FULL',
      color: 'from-orange-500/90 to-red-500/90',
      badgeClass: 'bg-orange-600/30 text-orange-200 border-orange-500/60',
      symptom: '社死擴散！全班群組開始熱議。',
      example: '遠距大課忘關麥喊：「寶貝幫我拿內褲～」',
      prescription: '立刻拔網線裝斷線，戴口罩上課。'
    },
    {
      level: 6,
      name: '結晶糖漿成精',
      cubes: 40,
      grams: 200,
      viscosity: '160 cP',
      stamp: '糖漿成精',
      zone: 'CRYSTAL SYRUP',
      color: 'from-orange-600/95 to-red-600/95',
      badgeClass: 'bg-red-500/25 text-red-200 border-red-500/50',
      symptom: '生化級社死，摳出三房兩廳。',
      example: '客滿電梯放響屁，下一秒電梯卡住。',
      prescription: '率先捂鼻子並皺眉看向最壯同學。'
    },
    {
      level: 7,
      name: '阿嬤孝孫級爆糖',
      cubes: 50,
      grams: 250,
      viscosity: '280 cP',
      stamp: '孝感動天',
      zone: 'GRANDMA_CRIT',
      color: 'from-red-500 to-rose-600',
      badgeClass: 'bg-red-500/30 text-red-200 border-red-400',
      symptom: '尊嚴隨阿嬤去廟裡拜拜了。',
      example: '報告時對著大刀教授喊：「阿嬤早安！」',
      prescription: '每日服綠茶三千CC，下課幫教授提包。'
    },
    {
      level: 8,
      name: '半升果糖重度患者',
      cubes: 85,
      grams: 425,
      viscosity: '650 cP',
      stamp: '重度調皮',
      zone: 'HALF LITER',
      color: 'from-red-600 to-rose-700',
      badgeClass: 'bg-rose-600/30 text-rose-200 border-rose-400',
      symptom: '男宿公開處刑，無人敢直視。',
      example: '粉紅臉盆遮羞回寢，撞見校長帶賓客。',
      prescription: '把臉盆移到臉上——沒人認出你就沒裸奔！'
    },
    {
      level: 9,
      name: '蜂王漿坍塌',
      cubes: 150,
      grams: 750,
      viscosity: '1,800 cP',
      stamp: '數位坍塌',
      zone: 'DIGITAL COLLAPSE',
      color: 'from-rose-600 via-red-600 to-amber-600',
      badgeClass: 'bg-rose-600/40 text-rose-100 border-rose-400',
      symptom: '破百方糖！已被全系截圖備份。',
      example: '土味情話親嘴語音錯頻發200人大群。',
      prescription: '補一句「帳號被盜，駭客挺深情的」。'
    },
    {
      level: 10,
      name: '工業級焦糖核爆',
      cubes: 260,
      grams: 1300,
      viscosity: '4,500 cP',
      stamp: '焦糖核爆',
      zone: 'CARAMEL NUKE',
      color: 'from-red-600 via-amber-500 to-purple-700',
      badgeClass: 'bg-purple-600/35 text-purple-200 border-purple-400',
      symptom: '全院級災難，學弟妹都在聊。',
      example: '上台致詞露四角褲，麥克風砸中校長。',
      prescription: '當場五體投地，申請出國交換避風頭。'
    },
    {
      level: 11,
      name: '男宿糖分黑洞',
      cubes: 420,
      grams: 2100,
      viscosity: '12,000 cP',
      stamp: '男宿傳奇',
      zone: 'DORM BLACKHOLE',
      color: 'from-purple-600 via-rose-600 to-red-700',
      badgeClass: 'bg-purple-600/45 text-purple-100 border-purple-300',
      symptom: '一人闖禍，全棟陪葬！',
      example: '半夜煮加臭螺螄粉觸發火警，400人寒風集合。',
      prescription: '請全宿喝無糖青茶一週負荊請罪。'
    },
    {
      level: 12,
      name: '史詩級糖尿病邊緣',
      cubes: 650,
      grams: 3250,
      viscosity: '35,000 cP',
      stamp: '史詩社死',
      zone: 'EPIC DIABETIC',
      color: 'from-fuchsia-600 via-red-600 to-amber-500',
      badgeClass: 'bg-fuchsia-600/45 text-fuchsia-100 border-fuchsia-300',
      symptom: '戀愛粉碎！陰影面積覆蓋校區。',
      example: '穿女僕裝超商取貨，店員是暗戀系花。',
      prescription: '嬌羞說句「主人包裹到了嗎」用魔法打敗魔法。'
    },
    {
      level: 13,
      name: '亞臨界果糖海',
      cubes: 880,
      grams: 4400,
      viscosity: '78,000 cP',
      stamp: '果糖汪洋',
      zone: 'SUBCRITICAL SEA',
      color: 'from-amber-400 via-red-600 to-purple-800',
      badgeClass: 'bg-red-600/60 text-white border-amber-300',
      symptom: '萬人直播撲街，霸榜 Dcard 一整月。',
      example: '校慶翻跟斗扯斷總電源，全場陷入黑暗。',
      prescription: '躺在地上裝暈送醫，千萬別睜開眼。'
    },
    {
      level: 14,
      name: '終極 1L 糖漿',
      cubes: 1000,
      grams: 5000,
      viscosity: '99,999 cP',
      stamp: '致死糖漿',
      zone: '1L HFCS APOCALYPSE',
      color: 'from-yellow-300 via-amber-500 to-red-600',
      badgeClass: 'bg-red-600 text-white border-yellow-300 shadow-[0_0_20px_#ef4444]',
      symptom: '【1L高果糖糖漿】致死黏稠，全體社死！',
      example: '畢典手機誤連禮堂音響，公放抓蟑螂海豚音。',
      prescription: '放棄治療，移居火星或繼任本所掌門。'
    },
    {
      level: 15,
      name: '暗物質方糖 (彩蛋)',
      cubes: 9999,
      grams: 49995,
      viscosity: '∞ cP',
      stamp: '暗物質神',
      zone: 'SECRET LEVEL 15',
      isSecret: true,
      color: 'from-fuchsia-400 via-purple-600 to-cyan-400',
      badgeClass: 'bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white border-white shadow-[0_0_25px_#d946ef]',
      symptom: '🌌【覺醒】突破三維物理，黑洞都被甜到蛀牙！',
      example: '連擊果糖怪 10 次解鎖！高果糖宇宙奇點！',
      prescription: '核發免死金牌！任何社死都只是無糖日常。'
    }
  ],

  // 3. 校園情境測驗題 (極簡版，字數砍半)
  calibrationQuestions: [
    {
      id: 'q1',
      step: 1,
      scene: 'SCENE 01 // 圖書館自習室',
      question: '自習室安靜無聲，手機耳機沒連上，直接最大音量公放羞恥動漫撒嬌聲...',
      options: [
        { label: 'A', text: '面不改色繼續做筆記（假裝不是我）', cubes: 2, clinicalNote: '厚臉皮！對面同學憋笑抽搐 (+2顆)' },
        { label: 'B', text: '狂按音量鍵 + 劇烈假咳嗽掩蓋', cubes: 8, clinicalNote: '破音咳嗽配「歐尼醬～」合奏 (+8顆)' },
        { label: 'C', text: '大喊「這室友傳的！」奪門而出', cubes: 15, clinicalNote: '百雙眼睛鎖定，室友隔空背鍋 (+15顆)' },
        { label: 'D', text: '手滑把手機甩進學霸咖啡杯繼續唱', cubes: 28, clinicalNote: '水陸立體聲社死成就達成 (+28顆)' }
      ]
    },
    {
      id: 'q2',
      step: 2,
      scene: 'SCENE 02 // 男宿半夜走廊',
      question: '半夜穿四角褲裝水，一隻巴掌大飛天蟑螂直撲你的臉！',
      options: [
        { label: 'A', text: '藍白拖精準一擊必殺', cubes: 0, clinicalNote: '無糖戰神！整層樓拜你為義父 (+0顆)' },
        { label: 'B', text: '怪叫一聲，百米衝刺回房反鎖', cubes: 4, clinicalNote: '隔壁打遊戲都聽見你的嬌喘 (+4顆)' },
        { label: 'C', text: '海豚音慘叫，無尾熊抱住開門室友', cubes: 14, clinicalNote: '破全糖臨界！全層開門圍觀 (+14顆)' },
        { label: 'D', text: '殺蟲劑狂噴觸發全棟火警鈴', cubes: 35, clinicalNote: '生化浩劫！全棟內褲冷風集合 (+35顆)' }
      ]
    },
    {
      id: 'q3',
      step: 3,
      scene: 'SCENE 03 // 早八必修課堂',
      question: '睡著被大刀教授突擊點名，驚醒脫口而出：',
      options: [
        { label: 'A', text: '「報告教授，邏輯推導中請等30秒。」', cubes: 1, clinicalNote: '危機教科書，教授點頭放過 (+1顆)' },
        { label: 'B', text: '「阿姨我要大冰奶加蛋，內用！」', cubes: 10, clinicalNote: '少糖夢遊！全班爆笑問可代購嗎 (+10顆)' },
        { label: 'C', text: '「阿嬤早安！今天中午吃飽沒？」', cubes: 25, clinicalNote: '孝孫爆糖！學分跟阿嬤去拜拜 (+25顆)' },
        { label: 'D', text: '叫阿嬤還踢翻全糖珍奶滾到講台', cubes: 48, clinicalNote: '身心雙毀滅！預約明年第一排 (+48顆)' }
      ]
    },
    {
      id: 'q4',
      step: 4,
      scene: 'SCENE 04 // 大群組錯頻',
      question: '垃圾桶套頭自拍配文「這課無聊到想圓寂」，傳完才發現：',
      options: [
        { label: 'A', text: '傳在自己的個人備忘錄裡', cubes: 0, clinicalNote: '安全過關，僅果糖怪知曉 (+0顆)' },
        { label: 'B', text: '傳在4人群，2秒內光速收回', cubes: 3, clinicalNote: '室友截圖永遠比光速快0.1秒 (+3顆)' },
        { label: 'C', text: '傳在有系主任的180人必修大群', cubes: 22, clinicalNote: '系主任回「？」並設為置頂 (+22顆)' },
        { label: 'D', text: '助教上課投影機直接全螢幕公放', cubes: 60, clinicalNote: '焦糖核爆！從此稱號「圓寂武士」(+60顆)' }
      ]
    },
    {
      id: 'q5',
      step: 5,
      scene: 'SCENE 05 // 學餐尖峰時刻',
      question: '端麻婆豆腐走過暗戀對象身旁，腳踩油漬：',
      options: [
        { label: 'A', text: '太空步滑行穩住餐盤，一滴不漏', cubes: 2, clinicalNote: '全場誤以為是熱舞社長 (+2顆)' },
        { label: 'B', text: '單膝跪地做出求婚姿勢化解', cubes: 9, clinicalNote: '暗戀對象以為你跟食堂阿姨求婚 (+9顆)' },
        { label: 'C', text: '大劈腿滑行，豆腐精準蓋在自己頭頂', cubes: 26, clinicalNote: '學餐摩西分海！全場起立鼓掌 (+26顆)' },
        { label: 'D', text: '亂抓扯翻暗戀對象的湯與外套陪葬', cubes: 55, clinicalNote: '史詩連坐！戀情尚未開始先入土 (+55顆)' }
      ]
    }
  ],

  // 4. 經典例子膠囊 (極簡版)
  presetConfessions: [
    {
      title: '👵 把教授叫成阿嬤',
      text: '上台報告太緊張，當全班面把大刀男教授叫「阿嬤」，還問假牙戴好沒。'
    },
    {
      title: '🪣 澡堂忘帶內褲遇校長',
      text: '洗完澡忘帶內褲，拿粉紅小臉盆遮下半身回寢，轉角遇校長帶外賓巡查。'
    },
    {
      title: '🍜 煮螺螄粉觸發全棟火警',
      text: '半夜偷煮加臭螺螄粉觸發火警，400個男大生穿內褲吹冷風集合點名。'
    },
    {
      title: '💌 土味情話錯頻發大群',
      text: '錄給曖昧對象的親嘴語音錯頻發到200人必修課大群，過時無法收回。'
    },
    {
      title: '👗 女僕裝取貨遇暗戀學姐',
      text: '打賭輸了穿蕾絲女僕裝去超商取貨，超商店員竟然是暗戀三年的系花。'
    },
    {
      title: '💨 客滿電梯放響屁卡住',
      text: '15人客滿電梯裡放連環重低音響屁，下一秒電梯故障直接卡住5分鐘。'
    }
  ],

  // 5. 羞恥語意因子 (極簡版)
  shameFactors: [
    { id: 'f-grandma', name: '👵 稱謂錯亂', regex: /阿嬤|媽媽|爸爸|老公|老婆|寶貝|阿姨|阿公/g, addCubes: 32, badge: 'bg-amber-500/20 text-amber-300 border-amber-400/50' },
    { id: 'f-prof', name: '🎓 權威暴擊', regex: /教授|系主任|校長|老師|院長|教官|宿管/g, addCubes: 22, badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50' },
    { id: 'f-dorm', name: '🩲 肉體暴露', regex: /男宿|澡堂|內褲|裸奔|臉盆|四角褲|拉鍊|女僕/g, addCubes: 38, badge: 'bg-rose-500/20 text-rose-300 border-rose-400/50' },
    { id: 'f-digital', name: '📡 數位擴散', regex: /大群|錯頻|收回|麥克風|直播|藍牙|耳機|最大聲|投影/g, addCubes: 35, badge: 'bg-purple-500/20 text-purple-300 border-purple-400/50' },
    { id: 'f-bio', name: '💨 生化氣味', regex: /放屁|響屁|螺螄粉|拉肚子|打嗝|火警|警報|臭/g, addCubes: 30, badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50' },
    { id: 'f-crush', name: '💔 戀愛粉碎', regex: /暗戀|學姐|學姊|學長|系花|告白|情話|曖昧/g, addCubes: 36, badge: 'bg-pink-500/20 text-pink-300 border-pink-400/50' },
    { id: 'f-physical', name: '🤸 肢體撲街', regex: /滑倒|劈腿|撲街|摔倒|恐龍|科目三|蟑螂|慘叫/g, addCubes: 24, badge: 'bg-orange-500/20 text-orange-300 border-orange-400/50' }
  ],

  // 6. 現場社死加乘因子 (極簡版)
  sceneMultipliers: [
    { id: 'mult-crush', label: '💘 暗戀對象在場', multiplier: 1.5, desc: '心碎加成 x1.5' },
    { id: 'mult-crowd', label: '👥 超過50人目擊', multiplier: 1.8, desc: '公開處刑 x1.8' },
    { id: 'mult-story', label: '📹 被拍成限動', multiplier: 2.2, desc: '數位留存 x2.2' },
    { id: 'mult-sober', label: '😐 清醒沒喝醉', multiplier: 1.2, desc: '無法甩鍋 x1.2' }
  ],

  // 7. PK 擂台題庫 (極簡版)
  pkRandomActs: [
    { text: '把室友洗面乳當牙膏刷了一週，還誇泡泡很多。', baseCubes: 38 },
    { text: '自習室睡到流口水，對面正妹默默遞衛生紙。', baseCubes: 45 },
    { text: '買宵夜跟老闆說「微辣不要辣」，老闆看我十秒。', baseCubes: 18 },
    { text: '幫翹課室友喊「有」，室友剛好走進後門跟教授對眼。', baseCubes: 72 },
    { text: '穿恐龍裝跳科目三，頭套卡住直接撞進宿管室。', baseCubes: 115 },
    { text: '「寶貝親一個」傳給指導教授，教授回「先交論文初稿」。', baseCubes: 168 },
    { text: '學餐跌倒大劈腿，貢丸飛進系主任保溫杯一桿進洞。', baseCubes: 290 }
  ],

  // 8. 搖搖杯配料表 (極簡版)
  bobaToppings: [
    { id: 'top-boba', name: '⚫ 黑糖波霸', cubes: 4, desc: '回味社死 (+4顆)' },
    { id: 'top-pudding', name: '🍮 統一布丁', cubes: 6, desc: '學餐滑倒Q彈 (+6顆)' },
    { id: 'top-taro', name: '🟣 手工芋圓', cubes: 5, desc: '男宿澱粉快樂 (+5顆)' },
    { id: 'top-syrup', name: '🍯 雙倍果糖液', cubes: 18, desc: '琥珀注入靈魂 (+18顆)' },
    { id: 'top-chili', name: '🌶️ 螺螄粉紅油', cubes: 45, desc: '觸發火警警報 (+45顆)' }
  ],

  // 9. 社死榮譽榜預設 (極簡版)
  initialHallOfShame: [
    {
      id: 'hos-101',
      ticket: 'LAB-1285160',
      author: '404 室長',
      category: '尊稱錯亂',
      story: '上台太緊張把大刀男教授叫「阿嬤」，還順口問吃飽沒。',
      cubes: 50,
      grams: 250,
      levelObj: { name: '阿嬤孝孫級爆糖', badgeClass: 'bg-red-500/30 text-red-200 border-red-400' },
      date: '2026/11/16 11:20',
      upvotes: 42
    },
    {
      id: 'hos-102',
      ticket: 'LAB-2041920',
      author: '外文系苦主',
      category: '數位擴散',
      story: '土味情話加親嘴音效語音手滑發到200人必修大群。',
      cubes: 150,
      grams: 750,
      levelObj: { name: '蜂王漿坍塌', badgeClass: 'bg-rose-600/40 text-rose-100 border-rose-400' },
      date: '2026/11/16 09:45',
      upvotes: 89
    },
    {
      id: 'hos-103',
      ticket: 'LAB-3141592',
      author: '男宿廚神',
      category: '生化氣味',
      story: '半夜煮加臭螺螄粉觸發火警，400人穿內褲寒風集合點名。',
      cubes: 420,
      grams: 2100,
      levelObj: { name: '男宿糖分黑洞', badgeClass: 'bg-purple-600/45 text-purple-100 border-purple-300' },
      date: '2026/11/15 23:30',
      upvotes: 126
    }
  ],

  // 10. 吉祥物「果糖怪」即時狀態與簡短金句
  monsterStates: [
    {
      id: 'm-pure',
      min: 0,
      max: 5,
      title: '純潔觀察態 (Lv.0-1)',
      color: '#10B981',
      quotes: [
        '含糖量極低，你確定你住男宿嗎？',
        '沒社死過的大學，就像沒珍珠的珍奶！',
        '點我餵糖！連擊 10 下解鎖隱藏彩蛋！'
      ]
    },
    {
      id: 'm-smirk',
      min: 6,
      max: 24,
      title: '竊笑加糖態 (Lv.2-4)',
      color: '#FBBF24',
      quotes: [
        '破 12 顆方糖（全糖臨界）！腳趾抓地了？',
        '人類尷尬時會假裝看沒亮的螢幕。',
        '多餵我幾顆！體內糖漿要沸騰啦！'
      ]
    },
    {
      id: 'm-high',
      min: 25,
      max: 99,
      title: '狂喜爆糖態 (Lv.5-8)',
      color: '#F59E0B',
      quotes: [
        '太甜了！叫教授阿嬤？臉盆遮羞？這就對了！',
        '你的調皮指數可以養活三隻果糖怪！',
        '去第 3 頁把室友蠢事也拖下水 PK 吧！'
      ]
    },
    {
      id: 'm-overload',
      min: 100,
      max: 999999,
      title: '1L 糖漿暴走態 (Lv.9-14)',
      color: '#EF4444',
      quotes: [
        '🚨 1L 糖漿傾倒！全站果凍大地震！！',
        '天平爆表！快點頂部「注射無糖綠茶」！',
        '恭喜晉升全糖院士！全校都收到訊號了！'
      ]
    }
  ]
};
