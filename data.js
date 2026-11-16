/* ==========================================================================
   《全糖量測所：測測你的調皮不舒服程度》Fructose Absurdity Clinical Lab
   V3.0 Ultra-Detailed Edition — Complete Clinical Datasets (data.js)
   ========================================================================== */

window.FRUCTOSE_LAB_DATA = {
  // 0. 3D 環繞卡牌登入介面身份卡組 (6 張 3D 旋轉立體卡牌)
  loginIdentityCards: [
    {
      id: 'card-founder',
      code: 'ID-01 // FOUNDER',
      icon: '🥤',
      title: '全糖創始人真傳弟子',
      subtitle: '每日 60g / 12顆方糖基準持有者',
      initCubes: 12,
      perk: '初始自帶 12 顆方糖（正常人類理智臨界點）',
      accent: '#F59E0B',
      quote: '「你這白癡行為給幾顆方糖？」'
    },
    {
      id: 'card-dorm',
      code: 'ID-02 // DORM VICTIM',
      icon: '🩲',
      title: '男宿 404 號房苦主',
      subtitle: '半夜走廊與公共澡堂常客',
      initCubes: 8,
      perk: '男宿類題目與打蟑螂反應力自帶熟悉加成',
      accent: '#06B6D4',
      quote: '「只要臉盆遮住臉，裸奔的就是別人！」'
    },
    {
      id: 'card-grandma',
      code: 'ID-03 // GRANDMA SON',
      icon: '👵',
      title: '阿嬤認證榮譽孝孫',
      subtitle: '教授與系主任尊稱錯亂專家',
      initCubes: 50,
      perk: '初始直上 50 顆方糖（阿嬤孝孫級爆糖）',
      accent: '#EF4444',
      quote: '「教授早安…不對，阿嬤妳今天吃飽沒？」'
    },
    {
      id: 'card-dino',
      code: 'ID-04 // DINO DANCER',
      icon: '🦖',
      title: '科目三充氣恐龍戰神',
      subtitle: '肢體撲街與學餐劈腿藝術家',
      initCubes: 25,
      perk: '初始 25 顆雙倍全糖，自帶高度幽默抗體',
      accent: '#10B981',
      quote: '「就算在學餐滑倒，姿勢也要像街舞 Battle！」'
    },
    {
      id: 'card-library',
      code: 'ID-05 // AUDIO BOMBER',
      icon: '🎧',
      title: '圖書館藍牙斷線特務',
      subtitle: '自習室公放與群組錯頻製造機',
      initCubes: 15,
      perk: '數位廣播類社死因子自動精準偵測',
      accent: '#A855F7',
      quote: '「為什麼我的耳機沒聲音，全圖書館卻都在看我？」'
    },
    {
      id: 'card-monster',
      code: 'ID-06 // CHIEF JUDGE',
      icon: '🍯',
      title: '果糖怪首席臨床審判官',
      subtitle: 'LV.5 最高權限與高糖抗體擁有者',
      initCubes: 0,
      perk: '自動解鎖 LV.5 進階權限，從 0 顆無糖開始審判他人',
      accent: '#EC4899',
      quote: '「把你的朋友叫過來，今天我要幫全寢室測糖度！」'
    }
  ],

  // 0-B. 第二頁「問問題測糖度」專屬預留擴充卡槽（供之後隨時補上更多問題與例子）
  reservedQuestionSlots: [
    {
      slotId: 'SLOT-Q6',
      title: '【預留擴充題目卡槽 #06】之後可隨時新增您的自訂問題',
      placeholderDesc: '已為您預留專屬位置！您可隨時點擊下方「➕ 立即填入新題目」或在對話中把新題目例子交給我補上。',
      defaultOptions: ['微糖反應 (+3顆)', '半糖尷尬 (+8顆)', '全糖爆表 (+25顆)']
    },
    {
      slotId: 'SLOT-Q7',
      title: '【預留擴充題目卡槽 #07】專屬情境問答預留位',
      placeholderDesc: '支援設定題目描述、3~4 個不同方糖權重的選項，以及選完後的毒舌評語！',
      defaultOptions: ['冷靜裝沒事 (+1顆)', '當場社死 (+15顆)', '1L糖漿核爆 (+100顆)']
    }
  ],

  reservedExampleSlots: [
    {
      slotId: 'EX-SLOT-1',
      label: '📌 預留例子卡槽 A（待您補充新例子）',
      sampleText: '【預留例子位 A】之後您可以把想加的問問題例子告訴我，或直接點擊此處填入測試！'
    },
    {
      slotId: 'EX-SLOT-2',
      label: '📌 預留例子卡槽 B（待您補充新例子）',
      sampleText: '【預留例子位 B】專為後續擴充保留的快速範例膠囊位置！'
    },
    {
      slotId: 'EX-SLOT-3',
      label: '📌 預留例子卡槽 C（待您補充新例子）',
      sampleText: '【預留例子位 C】點擊即可直接帶入下方糖度測試問答框！'
    }
  ],

  // 0-C. 糖分過高創意特效：高血糖幻覺飛越彈幕詞庫
  hallucinationTexts: [
    '🚨 警告：體內果糖濃度過高，網站正在發生焦糖化地震！！',
    '👵 阿嬤站在你背後問你今天吃飽沒...',
    '🛢️ 一公升高果糖糖漿正在淹沒你的螢幕！！',
    '🦖 恐龍裝卡在男宿飲水機拔不出來啦！！',
    '🎧 你的藍牙耳機其實沒有連上！！全班都聽到了！！',
    '💉 快按上方「緊急注射無糖綠茶」停止網站搖晃！！'
  ],

  // 1. 市售手搖飲糖度基準對照表 (Module 2 Top Cards)
  beverageStandards: [
    {
      id: 'std-0',
      title: '無糖 (Sugar-Free)',
      grams: 0,
      cubes: 0,
      level: 0,
      bpm: 62,
      tag: 'SAFE // 絕對純潔',
      color: '#10B981',
      desc: '毫無波瀾、理智滿分。在圖書館連翻書都用氣音的模範大學生。'
    },
    {
      id: 'std-1',
      title: '微糖 (Quarter Sugar)',
      grams: 15,
      cubes: 3,
      level: 1,
      bpm: 78,
      tag: 'MILD // 微糖小尷尬',
      color: '#06B6D4',
      desc: '腳趾微微抓地，對著空氣揮手回禮後假裝伸懶腰抓頭。'
    },
    {
      id: 'std-2',
      title: '半糖 (Half Sugar)',
      grams: 30,
      cubes: 6,
      level: 2,
      bpm: 96,
      tag: 'WARN // 半糖空氣凝結',
      color: '#FBBF24',
      desc: '走錯教室坐了半節課，還舉手問教授為什麼今天講義長不一樣。'
    },
    {
      id: 'std-3',
      title: '少糖 (Less Sugar)',
      grams: 50,
      cubes: 10,
      level: 3,
      bpm: 118,
      tag: 'HIGH // 少糖社交危險',
      color: '#F59E0B',
      desc: '男宿走廊穿四角褲拿外送，結果房門自動反鎖進不去。'
    },
    {
      id: 'std-4',
      title: '全糖 (Full Sugar)',
      grams: 60,
      cubes: 12,
      level: 4,
      bpm: 152,
      tag: 'CRITICAL // 正常人類理智臨界點',
      color: '#EF4444',
      isCritical: true,
      desc: '【全糖創始人基準線】每日攝取 60g/12顆方糖！超過此線正式踏入非人類社死領域！'
    }
  ],

  // 2. 15 階果糖量測階梯 (Level 0 ~ Level 14 + 隱藏彩蛋 Level 15)
  // 完全對齊 V3.0 規格書定義之顆數、克數與經典案例
  fructoseLevels: [
    {
      level: 0,
      name: '無糖純潔態',
      cubes: 0,
      grams: 0,
      viscosity: '1.0 cP (純水態)',
      stamp: '純潔無糖',
      zone: 'PURE ZERO',
      color: 'from-emerald-400/70 to-cyan-500/80',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      symptom: '心如止水，社交防禦力 100%，連呼吸頻率都符合大學校規。',
      example: '準時交報告、早八坐第一排、點名喊「有」字正腔圓，零社死紀錄。',
      prescription: '無需解毒，建議偶爾去男宿串門子補充一點人間煙火氣。'
    },
    {
      level: 1,
      name: '微糖小尷尬',
      cubes: 3,
      grams: 15,
      viscosity: '1.8 cP (微甜態)',
      stamp: '微糖調皮',
      zone: 'MILD AWKWARD',
      color: 'from-cyan-400/75 to-teal-500/85',
      badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      symptom: '腳趾在鞋底微微抓地，但 3 秒內可透過推眼鏡或滑手機裝沒事。',
      example: '刷學生證進圖書館閘門逼不過，後面排了 5 個臭臉學長姐。',
      prescription: '喝一口溫開水，小聲嘀咕「這機器又壞了」即可全身而退。'
    },
    {
      level: 2,
      name: '半糖空氣凝結',
      cubes: 6,
      grams: 30,
      viscosity: '4.2 cP (半糖態)',
      stamp: '半糖凝結',
      zone: 'AIR FREEZE',
      color: 'from-teal-400/80 to-amber-300/85',
      badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
      symptom: '方圓三公尺內空氣瞬間安靜 3 秒，耳根溫度上升 1.5°C。',
      example: '買早餐時神遊，跟早餐店阿姨大聲說：「阿姨我要一杯大冰奶加蛋，內用外帶！」',
      prescription: '保持禮貌微笑付錢快步離開，這禮拜暫時改去隔壁巷子買早餐。'
    },
    {
      level: 3,
      name: '少糖社交危險',
      cubes: 10,
      grams: 50,
      viscosity: '12.5 cP (微稠態)',
      stamp: '少糖危險',
      zone: 'SOCIAL RISK',
      color: 'from-yellow-400/85 to-amber-500/90',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      symptom: '手心開始冒汗，腦中不斷重播剛剛發生的畫面。',
      example: '向迎面走來的正妹熱情揮手喊「嗨！」，結果對方直接略過你撲進你身後學長的懷裡。',
      prescription: '順勢把手舉高做成伸懶腰體操動作，假裝自己剛運動完。'
    },
    {
      level: 4,
      name: '全糖創始人臨界點',
      cubes: 12,
      grams: 60,
      viscosity: '28.5 cP (全糖標準)',
      stamp: '創始人認證',
      zone: 'FOUNDER THRESHOLD',
      color: 'from-amber-400/90 to-orange-500/95',
      badgeClass: 'bg-orange-500/25 text-orange-200 border-orange-400',
      symptom: '【正常人類理智臨界點】12 顆方糖滿載！大腦正式進入高果糖亢奮區間！',
      example: '在男宿走廊穿著充氣恐龍裝大跳科目三，結果恐龍尾巴卡在走廊飲水機拔不出來。',
      prescription: '請室友幫忙拍下影片留念，並飲用無糖烏龍茶 500ml 穩定血糖。'
    },
    {
      level: 5,
      name: '雙倍全糖亢奮',
      cubes: 25,
      grams: 125,
      viscosity: '75.0 cP (糖漿態)',
      stamp: '雙倍亢奮',
      zone: 'DOUBLE FULL',
      color: 'from-orange-500/90 to-red-500/90',
      badgeClass: 'bg-orange-600/30 text-orange-200 border-orange-500/60',
      symptom: '社死範圍擴散至全班！你的名字開始出現在同學的私聊視窗中。',
      example: '遠距連線早八大課忘記關麥克風，對著剛起床的室友用娃娃音大喊：「寶貝幫我拿內褲～」。',
      prescription: '立刻拔掉網路線假裝斷網，三週內上課全面戴口罩加漁夫帽。'
    },
    {
      level: 6,
      name: '結晶糖漿成精',
      cubes: 40,
      grams: 200,
      viscosity: '160 cP (結晶態)',
      stamp: '糖漿成精',
      zone: 'CRYSTAL SYRUP',
      color: 'from-orange-600/95 to-red-600/95',
      badgeClass: 'bg-red-500/25 text-red-200 border-red-500/50',
      symptom: '密閉空間生化級社死！腳趾已經在鞋底摳出三房兩廳。',
      example: '在擠滿 14 人的系館電梯裡放了一個濃烈無比的響屁，結果電梯突然故障卡在三樓五分鐘打不開。',
      prescription: '皺起眉頭率先捂住鼻子，用懷疑的眼神看向旁邊最壯的男同學。'
    },
    {
      level: 7,
      name: '阿嬤孝孫級爆糖',
      cubes: 50,
      grams: 250,
      viscosity: '280 cP (濃稠楓糖)',
      stamp: '孝感動天',
      zone: 'GRANDMA_CRIT',
      color: 'from-red-500 to-rose-600',
      badgeClass: 'bg-red-500/30 text-red-200 border-red-400',
      symptom: '靈魂出竅！你的尊嚴已經跟著阿嬤去廟裡拜拜了。',
      example: '期中報告上台太緊張，把台下最嚴格的大刀教授當面叫成「阿嬤」，還順口問她今天中午吃飽沒。',
      prescription: '每日服用無糖綠茶 3,000cc，下課主動幫教授提公事包並祝她長命百歲。'
    },
    {
      level: 8,
      name: '半升果糖重度患者',
      cubes: 85,
      grams: 425,
      viscosity: '650 cP (重度糖膏)',
      stamp: '重度調皮',
      zone: 'HALF LITER',
      color: 'from-red-600 to-rose-700',
      badgeClass: 'bg-rose-600/30 text-rose-200 border-rose-400',
      symptom: '男宿走廊公開處刑！方圓百公尺內無人敢直視你的雙眼。',
      example: '在男宿公共澡堂洗完澡發現忘記帶內褲，拿粉紅色小臉盆遮羞走回寢室，轉角撞見校長帶外賓巡房。',
      prescription: '立刻把臉盆移到臉上遮住五官——只要沒人認出你的臉，裸奔的就是別人！'
    },
    {
      level: 9,
      name: '高濃度蜂王漿坍塌',
      cubes: 150,
      grams: 750,
      viscosity: '1,800 cP (蜂王漿態)',
      stamp: '數位坍塌',
      zone: 'DIGITAL COLLAPSE',
      color: 'from-rose-600 via-red-600 to-amber-600',
      badgeClass: 'bg-rose-600/40 text-rose-100 border-rose-400',
      symptom: '突破百顆方糖警戒線！數位足跡已遭全系截圖永久備份。',
      example: '錄給曖昧對象的 45 秒油膩土味情話加親嘴音效語音，手滑錯頻發到 200 人必修課大群且超過收回時間。',
      prescription: '立刻在群組補發一句「抱歉帳號被盜，駭客還挺深情的」，死馬當活馬醫。'
    },
    {
      level: 10,
      name: '工業級焦糖核爆',
      cubes: 260,
      grams: 1300,
      viscosity: '4,500 cP (熔岩焦糖)',
      stamp: '焦糖核爆',
      zone: 'CARAMEL NUKE',
      color: 'from-red-600 via-amber-500 to-purple-700',
      badgeClass: 'bg-purple-600/35 text-purple-200 border-purple-400',
      symptom: '全院級實況災難！連隔壁系的學弟妹都在討論你的英勇事蹟。',
      example: '新生訓練代表上台致詞，褲子拉鍊完全沒拉露出海綿寶寶內褲，鞠躬時還把無線麥克風甩飛砸中校長頭頂。',
      prescription: '當場行五體投地大禮，並考慮申請海外交換學生避風頭一年。'
    },
    {
      level: 11,
      name: '男宿傳奇糖分黑洞',
      cubes: 420,
      grams: 2100,
      viscosity: '12,000 cP (黑洞糖膏)',
      stamp: '男宿傳奇',
      zone: 'DORM BLACKHOLE',
      color: 'from-purple-600 via-rose-600 to-red-700',
      badgeClass: 'bg-purple-600/45 text-purple-100 border-purple-300',
      symptom: '一人做事全棟陪葬！你的寢室門牌將被釘在男宿歷史恥辱柱上。',
      example: '半夜三點在男宿偷用高功率快煮鍋煮加辣加臭螺螄粉，濃煙直接觸發全棟火災警報，害 400 名男大生穿內褲在寒風中集合。',
      prescription: '在男宿大門口擺攤請全棟喝無糖青茶一週，負荊請罪。'
    },
    {
      level: 12,
      name: '史詩級糖尿病邊緣',
      cubes: 650,
      grams: 3250,
      viscosity: '35,000 cP (史詩結晶)',
      stamp: '史詩社死',
      zone: 'EPIC DIABETIC',
      color: 'from-fuchsia-600 via-red-600 to-amber-500',
      badgeClass: 'bg-fuchsia-600/45 text-fuchsia-100 border-fuchsia-300',
      symptom: '戀愛與社交雙重粉碎性骨折！心理陰影面積超過整個校總區。',
      example: '跟室友打賭輸了穿蕾絲女僕裝去校門口超商取貨，報末三碼時抬頭發現店員竟是自己暗戀三年的系花學姐。',
      prescription: '用最嬌羞的聲音對學姐說一句「主人您的包裹到了嗎」，用魔法打敗魔法。'
    },
    {
      level: 13,
      name: '亞臨界液態果糖海',
      cubes: 880,
      grams: 4400,
      viscosity: '78,000 cP (亞臨界態)',
      stamp: '果糖汪洋',
      zone: 'SUBCRITICAL SEA',
      color: 'from-amber-400 via-red-600 to-purple-800',
      badgeClass: 'bg-red-600/60 text-white border-amber-300',
      symptom: '萬人直播級物理毀滅！Dcard 熱門排行榜第一名將霸榜整整一個月。',
      example: '校慶晚會萬人直播現場上台耍帥翻跟斗，結果落地撲街直接把舞台主音響總電源線扯斷，全場瞬間陷入黑暗與死寂。',
      prescription: '躺在舞台地上直接假裝暈倒送醫，絕對不要在現場睜開眼睛。'
    },
    {
      level: 14,
      name: '終極一升高果糖糖漿',
      cubes: 1000,
      grams: 5000,
      viscosity: '99,999 cP (黏稠致死奇點)',
      stamp: '致死糖漿',
      zone: '1L HFCS APOCALYPSE',
      color: 'from-yellow-300 via-amber-500 to-red-600',
      badgeClass: 'bg-red-600 text-white border-yellow-300 shadow-[0_0_20px_#ef4444]',
      symptom: '【終極爆發 = 1L 高果糖糖漿】黏稠致死，全校集體社死！地球表面已無你的容身之處！',
      example: '全校畢業典禮致詞時手機誤連禮堂百萬級音響，向全校師生與家長直播自己昨晚錄製的「男宿抓蟑螂海豚音慘叫 + 對空氣告白練習」。',
      prescription: '【臨床放棄治療】建議立即搭乘 SpaceX 火箭移居火星，或繼任本所「全糖創始人・二代掌門」！'
    },
    {
      level: 15,
      name: '跨維度暗物質方糖結晶 (隱藏彩蛋)',
      cubes: 9999,
      grams: 49995,
      viscosity: '∞ cP (超時空暗物質態)',
      stamp: '暗物質神',
      zone: 'SECRET LEVEL 15',
      isSecret: true,
      color: 'from-fuchsia-400 via-purple-600 to-cyan-400',
      badgeClass: 'bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white border-white shadow-[0_0_25px_#d946ef]',
      symptom: '🌌【果糖怪暴走覺醒隱藏階級】你的調皮與荒謬已經突破三維宇宙物理定律，連黑洞都被你甜到蛀牙！',
      example: '連續餵食果糖怪 10 次觸發跨維度覺醒！你就是行走的高果糖宇宙奇點本人！',
      prescription: '宇宙級免死金牌核發！從今天起任何社死行為對你而言都只是無糖日常！'
    }
  ],

  // 3. 核心模組一：校園情境校準器 5 道動態兩難題 (Phase 4 完整規格)
  calibrationQuestions: [
    {
      id: 'q1',
      step: 1,
      scene: 'SCENE 01 // 圖書館自習室',
      question: '期末考週在安靜到連掉根針都聽得見的圖書館自習室，你點開一段影片，卻發現藍牙耳機根本沒連上，手機正以最大音量播放超羞恥動漫撒嬌語音...',
      options: [
        { label: 'A', text: '面不改色繼續看，還露出嚴肅作筆記的表情（只要我不尷尬，尷尬的就是別人）', cubes: 2, clinicalNote: '特務級厚臉皮！但對面同學已經憋笑到肩膀劇烈抽搐 (+2 顆)' },
        { label: 'B', text: '手忙腳亂狂按音量鍵，同時發出劇烈假咳嗽聲試圖蓋過動漫聲', cubes: 8, clinicalNote: '欲蓋彌彰！你的破音咳嗽與「歐尼醬～」完美結合成交響樂 (+8 顆)' },
        { label: 'C', text: '猛然站起來對整個自習室大喊「對不起這是我室友傳給我的！」，然後奪門而出', cubes: 15, clinicalNote: '全場 120 雙眼睛瞬間鎖定你的臉，連室友都隔空背鍋 (+15 顆)' },
        { label: 'D', text: '緊張到手滑把手機甩飛到隔壁桌學霸的咖啡杯裡，手機還在杯裡繼續唱完副歌', cubes: 28, clinicalNote: '水陸兩棲立體聲社死！直接達成圖書館年度傳奇成就 (+28 顆)' }
      ]
    },
    {
      id: 'q2',
      step: 2,
      scene: 'SCENE 02 // 男宿半夜走廊',
      question: '半夜 2:30 你只穿一件海綿寶寶四角褲走出男宿房間裝水，突然一隻巴掌大的「會飛美洲大蟑螂」張開翅膀朝你的臉直線衝刺！',
      options: [
        { label: 'A', text: '眼神一凜，空手接白刃或用藍白拖精準一擊必殺，深藏功與名', cubes: 0, clinicalNote: '無糖戰神！整層樓男大生都該出來拜你為義父 (+0 顆)' },
        { label: 'B', text: '發出短促的「嗚哇！」怪叫，以百米衝刺速度閃回房內鎖門', cubes: 4, clinicalNote: '微糖驚嚇，只有隔壁寢室熬夜打 LOL 的同學聽到你的嬌喘 (+4 顆)' },
        { label: 'C', text: '飆出超越帕華洛帝的高頻海豚音慘叫，並直接跳到剛走出門的室友身上無尾熊抱', cubes: 14, clinicalNote: '突破全糖創始人臨界點！整層樓 20 間房同時開門出來看你們抱在一起 (+14 顆)' },
        { label: 'D', text: '邊哭邊拿殺蟲劑對著走廊狂噴猛掃，結果煙霧直接觸發全棟男宿火災警鈴', cubes: 35, clinicalNote: '高果糖生化災難！全棟 400 人穿內褲陪你在操場吹冷風點名 (+35 顆)' }
      ]
    },
    {
      id: 'q3',
      step: 3,
      scene: 'SCENE 03 // 早八必修課堂',
      question: '早八必修課你剛趴下睡著 3 分鐘，突然被全系最兇的大刀教授點名回答問題，你驚醒站起來腦袋短路，脫口而出：',
      options: [
        { label: 'A', text: '「報告教授，這題的邏輯我還在推導，請容我再思考 30 秒。」', cubes: 1, clinicalNote: '危機處理教科書，連大刀教授都點了點頭 (+1 顆)' },
        { label: 'B', text: '大聲喊出：「有！阿姨我要一份薯餅蛋餅加起司，奶茶換大杯！」', cubes: 10, clinicalNote: '少糖夢遊！全班哄堂大笑，教授問你要不要順便幫他點一份 (+10 顆)' },
        { label: 'C', text: '親切地對著 60 歲男教授喊了一聲：「阿嬤早安！妳今天中午吃飽沒？」', cubes: 25, clinicalNote: '阿嬤孝孫級爆糖！你的學分已經跟著阿嬤去廟裡拜拜了 (+25 顆)' },
        { label: 'D', text: '不僅把教授叫成阿嬤，站起來時還踢翻桌上的全糖珍奶，珍珠精準滾到講台教授腳邊', cubes: 48, clinicalNote: '物理與精神雙重毀滅！直接預約明年重修搖滾區第一排 (+48 顆)' }
      ]
    },
    {
      id: 'q4',
      step: 4,
      scene: 'SCENE 04 // 系上大群組錯頻',
      question: '你在男宿把塑膠垃圾桶套在頭上扮演黑武士自拍，配文「笑死這堂課無聊到我想原地圓寂」，按下傳送後才發現...',
      options: [
        { label: 'A', text: '傳在只有自己的個人備忘錄群組裡', cubes: 0, clinicalNote: '安全過關，只有果糖怪知道你的中二靈魂 (+0 顆)' },
        { label: 'B', text: '傳在 4 人寢室群組，並在 2 秒內光速按下收回訊息', cubes: 3, clinicalNote: '太天真了，室友的截圖手速永遠比光速快 0.1 秒 (+3 顆)' },
        { label: 'C', text: '傳在有系主任與助教的 180 人「必修課正式公告大群」，而且因為網路卡住按不了收回', cubes: 22, clinicalNote: '數位公開處刑！系主任在下方回覆了一個「？」並將圖片設為群組置頂 (+22 顆)' },
        { label: 'D', text: '發在大群忘記收回，隔天上課助教開投影機示範群組操作時，你的黑武士大頭照直接放大在 300 吋巨幕上', cubes: 60, clinicalNote: '工業級焦糖核爆！從此你在系上的外號正式改名叫「圓寂黑武士」(+60 顆)' }
      ]
    },
    {
      id: 'q5',
      step: 5,
      scene: 'SCENE 05 // 學餐尖峰時刻',
      question: '中午 12:15 學餐擠滿三百人，你端著滾燙的麻婆豆腐飯走過暗戀對象那一桌旁，腳底突然踩到一灘油漬...',
      options: [
        { label: 'A', text: '核心肌群瞬間鎖死，滑出一段絲滑太空步穩住餐盤，一滴都沒灑', cubes: 2, clinicalNote: '全場誤以為你是熱舞社社長，帥度逆轉 (+2 顆)' },
        { label: 'B', text: '單膝跪地撐住地板，順勢對著空氣做出求婚姿勢化解尷尬', cubes: 9, clinicalNote: '雖然保住了豆腐，但暗戀對象以為你在對食堂阿姨求婚 (+9 顆)' },
        { label: 'C', text: '整個人華麗大劈腿滑行三公尺，麻婆豆腐在空中畫出完美彩虹蓋在自己頭頂', cubes: 26, clinicalNote: '學餐摩西分海！全場三百人同時安靜並爆出熱烈掌聲 (+26 顆)' },
        { label: 'D', text: '滑倒時本能伸手亂抓，直接把暗戀對象桌上的湯碗與外套一起扯下來陪葬', cubes: 55, clinicalNote: '史詩級連坐法社死！你的戀情還沒開始就直接入土為安 (+55 顆)' }
      ]
    }
  ],

  // 4. 核心模組二：AI 語意分析預設爆笑病歷膠囊 (Phase 5)
  presetConfessions: [
    {
      title: '👵 把教授叫成阿嬤 (PDF 經典)',
      text: '今天期中報告上台太緊張，我竟然當著全班 80 人的面把最嚴格的大刀教授叫成「阿嬤」，還順口問她今天中午吃飽沒、假牙有沒有戴好...'
    },
    {
      title: '🪣 男宿澡堂忘帶內褲遇校長',
      text: '在男宿公共澡堂洗完澡才發現忘記帶內褲，只好拿粉紅色小塑膠臉盆遮住下半身溜回房間，結果在走廊正中央遇到校長帶著外賓巡房...'
    },
    {
      title: '🍜 半夜煮螺螄粉觸發全棟火警',
      text: '半夜三點肚子餓在男宿房間偷煮加辣加臭螺螄粉，結果濃煙直接觸發全棟火災煙霧警報器，害全棟 400 個男大生只穿內褲在寒風中集合點名...'
    },
    {
      title: '💌 土味情話語音錯頻發大群',
      text: '原本錄給曖昧對象的 45 秒油膩土味情話加親嘴音效語音，手滑錯頻發到 200 人的系上必修課大群，而且洗澡出來發現已經超過收回時間了！'
    },
    {
      title: '👗 穿女僕裝取貨遇暗戀學姐',
      text: '跟室友打賭輸了穿蕾絲女僕裝去校門口超商取貨，報手機末三碼時一抬頭，發現今天值班的店員竟然是我暗戀三年的系花學姐...'
    },
    {
      title: '💨 客滿電梯放響屁還故障卡住',
      text: '搭教學大樓電梯嚴重超載塞滿 15 個人，裡面還有系主任，結果我不小心憋不住放出一段長達 6 秒的重低音連環響屁，下一秒電梯還突然故障卡住五分鐘！'
    }
  ],

  // 5. 即時羞恥語意因子正則偵測詞庫 (Real-Time Shame Factor Detector)
  shameFactors: [
    { id: 'f-grandma', name: '👵 尊稱錯亂孝孫因子', regex: /阿嬤|媽媽|爸爸|老公|老婆|寶貝|阿姨|阿公/g, addCubes: 32, badge: 'bg-amber-500/20 text-amber-300 border-amber-400/50' },
    { id: 'f-prof', name: '🎓 權威長輩暴擊因子', regex: /教授|系主任|校長|老師|院長|教官|宿管/g, addCubes: 22, badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50' },
    { id: 'f-dorm', name: '🩲 男宿肉體暴露因子', regex: /男宿|澡堂|內褲|裸奔|臉盆|四角褲|拉鍊|女僕/g, addCubes: 38, badge: 'bg-rose-500/20 text-rose-300 border-rose-400/50' },
    { id: 'f-digital', name: '📡 數位擴散核爆因子', regex: /大群|錯頻|收回|麥克風|直播|藍牙|耳機|最大聲|投影/g, addCubes: 35, badge: 'bg-purple-500/20 text-purple-300 border-purple-400/50' },
    { id: 'f-bio', name: '💨 生化氣味攻擊因子', regex: /放屁|響屁|螺螄粉|拉肚子|打嗝|火警|警報|臭/g, addCubes: 30, badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50' },
    { id: 'f-crush', name: '💔 戀愛粉碎骨折因子', regex: /暗戀|學姐|學姊|學長|系花|告白|情話|曖昧/g, addCubes: 36, badge: 'bg-pink-500/20 text-pink-300 border-pink-400/50' },
    { id: 'f-physical', name: '🤸 肢體撲街諧星因子', regex: /滑倒|劈腿|撲街|摔倒|恐龍|科目三|蟑螂|慘叫/g, addCubes: 24, badge: 'bg-orange-500/20 text-orange-300 border-orange-400/50' }
  ],

  // 6. 現場社死加乘因子勾選框 (4 Multipliers)
  sceneMultipliers: [
    { id: 'mult-crush', label: '💘 暗戀對象在場', multiplier: 1.5, desc: '心碎指數與羞恥度同步放大 1.5 倍' },
    { id: 'mult-crowd', label: '👥 超過50人目擊', multiplier: 1.8, desc: '大型公開處刑場域擴散 1.8 倍' },
    { id: 'mult-story', label: '📹 被拍成限動瘋傳', multiplier: 2.2, desc: '數位永久留存不可抹滅 2.2 倍' },
    { id: 'mult-sober', label: '😐 完全清醒沒喝醉', multiplier: 1.2, desc: '無法推託給酒精的純天然蠢事 1.2 倍' }
  ],

  // 7. Phase 6 擴充功能 A：男宿室友雙人 PK 擂台預設盲盒題庫
  pkRandomActs: [
    { text: '把室友的洗面乳當成牙膏刷了整整一個禮拜，還誇獎這牌子泡泡很多。', baseCubes: 38 },
    { text: '在圖書館自習室睡著流口水，醒來時對面正妹遞了一包衛生紙給我。', baseCubes: 45 },
    { text: '去買宵夜鹽酥雞跟老闆說「我要微辣不要辣」，老闆盯著我看了十秒。', baseCubes: 18 },
    { text: '早八點名時幫翹課的室友喊「有」，結果室友剛好從後門走進來跟教授對眼。', baseCubes: 72 },
    { text: '在男宿走廊穿恐龍裝跳科目三，結果頭套轉不回來直接撞進宿管室。', baseCubes: 115 },
    { text: '把要傳給女友的「寶貝親一個」傳給了指導教授，教授回傳「先交論文初稿」。', baseCubes: 168 },
    { text: '學餐端盤子滑倒大劈腿，貢丸直接飛進隔壁桌系主任的保溫杯裡一桿進洞。', baseCubes: 290 }
  ],

  // 8. 互動特調搖搖杯配料表 (Custom Boba Shaker Lab)
  bobaToppings: [
    { id: 'top-boba', name: '⚫ 黑糖波霸珍珠', cubes: 4, desc: '每嚼一顆就多回想一次社死畫面 (+4顆)' },
    { id: 'top-pudding', name: '🍮 統一布丁整顆', cubes: 6, desc: 'Q彈程度等同於你在學餐滑倒的姿勢 (+6顆)' },
    { id: 'top-taro', name: '🟣 手工小芋圓', cubes: 5, desc: '男宿宵夜必備高澱粉快樂因子 (+5顆)' },
    { id: 'top-syrup', name: '🍯 創始人雙倍果糖液', cubes: 18, desc: '直接注入靈魂的高濃度琥珀糖漿 (+18顆)' },
    { id: 'top-chili', name: '🌶️ 螺螄粉紅油特調', cubes: 45, desc: '暗黑料理界核武！喝完直接觸發火警 (+45顆)' }
  ],

  // 9. 全校社死榮譽榜預設名單 (Hall of Shame)
  initialHallOfShame: [
    {
      id: 'hos-101',
      ticket: 'LAB-1285160',
      author: '男宿三舍 404 室長',
      category: '尊稱錯亂',
      story: '期中報告上台太緊張，把台下最嚴格的大刀教授當面叫成「阿嬤」，還順口問她今天中午吃飽沒。',
      cubes: 50,
      grams: 250,
      level: 7,
      roast: '判決：50 顆方糖。你的尊嚴已經跟著阿嬤去廟裡拜拜了。',
      prescription: '每日服用無糖綠茶 3,000cc，並主動幫教授提公事包。',
      stamp: '孝感動天',
      timestamp: '10 分鐘前'
    },
    {
      id: 'hos-102',
      ticket: 'LAB-1285208',
      author: '澡堂臉盆戰神',
      category: '男宿暴露',
      story: '男宿公共澡堂洗完澡忘帶內褲，拿粉紅小臉盆遮羞走回房間，結果在走廊正中央遇到校長帶外賓巡房。',
      cubes: 85,
      grams: 425,
      level: 8,
      roast: '判決：85 顆方糖。那個塑膠臉盆承受了它這個年紀不該承受的光學遮蔽壓力。',
      prescription: '下次請直接把臉盆扣在頭上，保護臉部辨識比保護下半身更重要。',
      stamp: '重度調皮',
      timestamp: '28 分鐘前'
    },
    {
      id: 'hos-103',
      ticket: 'LAB-1285399',
      author: '半夜螺螄粉大廚',
      category: '生化危機',
      story: '半夜三點在男宿偷煮加辣加臭螺螄粉，濃煙直接觸發全棟火警，害 400 人穿內褲在寒風中集合點名。',
      cubes: 420,
      grams: 2100,
      level: 11,
      roast: '判決：420 顆方糖。一人煮粉全棟陪葬，你的房門已被列入男宿生化武器管制區。',
      prescription: '在男宿大廳擺攤請全棟喝無糖青茶一週贖罪。',
      stamp: '男宿傳奇',
      timestamp: '1 小時前'
    },
    {
      id: 'hos-104',
      ticket: 'LAB-1285777',
      author: '超商女僕取貨員',
      category: '戀愛粉碎',
      story: '打賭輸了穿蕾絲女僕裝去校門口超商取貨，報手機末三碼時發現店員竟是暗戀三年的系花學姐。',
      cubes: 650,
      grams: 3250,
      level: 12,
      roast: '判決：650 顆方糖。戀愛與尊嚴雙重粉碎性骨折，學姐連刷條碼的手都在抖。',
      prescription: '對學姐比個愛心喊「主人請刷條碼」，用魔法打敗魔法。',
      stamp: '史詩社死',
      timestamp: '2 小時前'
    }
  ],

  // 10. 果糖怪 4 大狀態機與彩蛋覺醒狀態
  monsterStates: [
    {
      id: 'm-pure',
      min: 0,
      max: 5,
      title: '純潔觀察態 (Lv.0-1)',
      color: '#10B981',
      quotes: [
        '嗶嗶—目前血液含糖量極低，你確定你是住在男宿的大學生嗎？',
        '全糖創始人說過：沒有社死過的大學生活，就像沒有珍珠的珍奶！',
        '快點我餵食方糖！連續點我 10 下會有跨維度隱藏彩蛋喔！'
      ]
    },
    {
      id: 'm-smirk',
      min: 6,
      max: 24,
      title: '竊笑加糖態 (Lv.2-4)',
      color: '#FBBF24',
      quotes: [
        '嘿嘿嘿…突破 12 顆方糖（全糖創始人基準線）囉！腳趾開始抓地了對吧？',
        '男宿觀察日記第 87 頁：人類在尷尬時會假裝看手機螢幕，即使螢幕根本沒亮。',
        '再多餵我幾顆方糖！我感覺體內的琥珀糖漿快要沸騰啦！'
      ]
    },
    {
      id: 'm-high',
      min: 25,
      max: 99,
      title: '狂喜爆糖態 (Lv.5-8)',
      color: '#F59E0B',
      quotes: [
        '太甜啦！！把教授叫成阿嬤？拿臉盆遮羞走走廊？這才是我要的高純度荒謬養分！',
        '警告！你體內的調皮不舒服指數已經可以養活三隻果糖怪了！',
        '再去左邊「室友雙人 PK 擂台」把你室友的蠢事也拖下水吧！'
      ]
    },
    {
      id: 'm-overload',
      min: 100,
      max: 999999,
      title: '1L 糖漿暴走態 (Lv.9-14)',
      color: '#EF4444',
      quotes: [
        '🚨 警報！警報！1公升高果糖糖漿傾倒中！全校集體社死奇點降臨！！',
        '天平已經被壓爆成 OVERLOAD: 9999.9g！快點頂部按鈕注射無糖綠茶清洗實驗室！',
        '恭喜晉升「全糖榮譽院士」！連外星人都收到你在男宿發瘋的腦波訊號了！'
      ]
    }
  ]
};
