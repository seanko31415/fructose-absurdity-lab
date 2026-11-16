/* ==========================================================================
   《全糖量測所：測測你的調皮不舒服程度》Fructose Absurdity Clinical Lab
   V5.2 Luxury Edition — High-Tech Datasets (data.js)
   - 移除所有男宿設定，改為全情境社交/校園/職場/公共生活
   - 選項文字完全隱藏糖度（測驗最後才統整揭曉）
   - 支援 20題 / 30題 / 50題 / 100題 擴充題庫
   - 全新升級：量子裂變反應爐、超低溫焦糖提煉儀、神經元音頻調諧儀
   ========================================================================== */

window.FRUCTOSE_LAB_DATA = {
  // 0. 3D 環繞浮動卡牌身份卡組 (無男宿、超精緻)
  loginIdentityCards: [
    {
      id: 'card-founder',
      code: 'ID-01 // FOUNDER',
      icon: '🥤',
      title: '全糖真傳弟子',
      subtitle: '每日 60g / 12顆方糖標準',
      initCubes: 12,
      perk: '初始 12 顆（理智臨界）',
      accent: '#F59E0B',
      quote: '「這白癡行為給幾顆？」'
    },
    {
      id: 'card-stealth',
      code: 'ID-02 // STEALTH',
      icon: '🕶️',
      title: '社恐潛行特務',
      subtitle: '公共場合低調生存專家',
      initCubes: 8,
      perk: '社交尷尬自動減速緩衝',
      accent: '#06B6D4',
      quote: '「只要我不尷尬，尷尬的就是別人。」'
    },
    {
      id: 'card-grandma',
      code: 'ID-03 // GRANDMA',
      icon: '👵',
      title: '認證榮譽孝孫',
      subtitle: '長輩稱謂錯亂大師',
      initCubes: 50,
      perk: '初始 50 顆（孝孫級爆糖）',
      accent: '#EF4444',
      quote: '「教授早安…阿嬤妳吃飽沒？」'
    },
    {
      id: 'card-dino',
      code: 'ID-04 // DINO',
      icon: '🦖',
      title: '肢體諧星戰神',
      subtitle: '撲街也能跳成街舞',
      initCubes: 25,
      perk: '雙倍全糖搞笑抗體',
      accent: '#10B981',
      quote: '「在學餐跌倒也要有節奏感！」'
    },
    {
      id: 'card-audio',
      code: 'ID-05 // AUDIO',
      icon: '🎧',
      title: '藍牙斷線特務',
      subtitle: '自習室公放與錯頻機',
      initCubes: 15,
      perk: '數位擴散社死高靈敏度',
      accent: '#A855F7',
      quote: '「耳機沒連上，全場都在看我…」'
    },
    {
      id: 'card-judge',
      code: 'ID-06 // JUDGE',
      icon: '🍯',
      title: '首席臨床審判官',
      subtitle: '最高權限無糖審判',
      initCubes: 0,
      perk: 'LV.5 最高權限，精準判定他人',
      accent: '#EC4899',
      quote: '「把朋友叫來，幫他量糖度！」'
    }
  ],

  // 1. 手搖飲糖度基準
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
      desc: '理智滿分，連翻書都用氣音。'
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
      desc: '走錯教室坐了半節課還舉手提問。'
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
      desc: '熱情揮手打招呼，對方直接略過。'
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
      desc: '【理智臨界點】12顆方糖滿載！'
    }
  ],

  // 2. 15 階果糖階梯
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
      prescription: '無需解毒，建議沾沾人間煙火。'
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
      example: '熱情揮手，對方直接撲向身後朋友。',
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
      example: '穿著恐龍裝跳舞卡在走廊門口。',
      prescription: '拍照留念，喝無糖烏龍茶。'
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
      symptom: '社死擴散！全班私訊開始熱議。',
      example: '遠距大課忘關麥喊出超羞恥日常密語。',
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
      prescription: '率先捂鼻子並皺眉看向最壯同行者。'
    },
    {
      level: 7,
      name: '認證孝孫級爆糖',
      cubes: 50,
      grams: 250,
      viscosity: '280 cP',
      stamp: '孝感動天',
      zone: 'GRANDMA_CRIT',
      color: 'from-red-500 to-rose-600',
      badgeClass: 'bg-red-500/30 text-red-200 border-red-400',
      symptom: '尊嚴隨阿嬤去廟裡拜拜了。',
      example: '報告時對著大刀教授喊：「阿嬤早安！」',
      prescription: '每日服綠茶三千CC，下課幫教授提公事包。'
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
      symptom: '大廳公開處刑，無人敢直視。',
      example: '粉紅臉盆遮羞回寢，撞見校長帶外賓巡查。',
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
      example: '土味情話親嘴語音錯頻發200人必修大群。',
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
      example: '上台致詞褲子拉鍊沒拉，麥克風砸中校長。',
      prescription: '當場五體投地，申請出國交換避風頭。'
    },
    {
      level: 11,
      name: '傳奇糖分黑洞',
      cubes: 420,
      grams: 2100,
      viscosity: '12,000 cP',
      stamp: '傳奇黑洞',
      zone: 'BLACKHOLE',
      color: 'from-purple-600 via-rose-600 to-red-700',
      badgeClass: 'bg-purple-600/45 text-purple-100 border-purple-300',
      symptom: '一人闖禍，全棟陪葬！',
      example: '半夜煮加臭料理觸發火警，400人寒風集合。',
      prescription: '請全場喝無糖青茶一週負荊請罪。'
    },
    {
      level: 12,
      name: '史詩級社死邊緣',
      cubes: 650,
      grams: 3250,
      viscosity: '35,000 cP',
      stamp: '史詩社死',
      zone: 'EPIC DIABETIC',
      color: 'from-fuchsia-600 via-red-600 to-amber-500',
      badgeClass: 'bg-fuchsia-600/45 text-fuchsia-100 border-fuchsia-300',
      symptom: '戀愛粉碎！陰影面積覆蓋整個校區。',
      example: '打賭輸穿女僕裝取貨，店員是暗戀系花。',
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
      symptom: '萬人直播撲街，霸榜熱門一整月。',
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
      example: '畢典手機誤連禮堂百萬音響，公放抓狂告白。',
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

  // 3. 核心題庫母體（嚴格隱藏選項中的方糖顆數，最後才統一計算！）
  // 支援 20題 / 30題 / 50題 / 100題 動態題庫
  baseQuestionPool: [
    {
      id: 'bq1',
      scene: 'SCENE 01 // 圖書館自習室',
      question: '期末自習室安靜到連根針掉地都聽得見，你點開影片，藍牙耳機沒連上，直接最大音量公放羞恥動漫撒嬌聲：',
      options: [
        { label: 'A', text: '面不改色繼續做筆記，假裝聲音不是我的', cubes: 2, note: '強大心理素質，但對面同學已憋笑抽搐' },
        { label: 'B', text: '手忙腳亂狂按音量鍵，發出劇烈假咳嗽掩飾', cubes: 8, note: '破音咳嗽與「歐尼醬」完美交響' },
        { label: 'C', text: '起立大喊「這室友傳的！」奪門而出', cubes: 15, note: '全場百雙眼睛鎖定，室友隔空背鍋' },
        { label: 'D', text: '手滑把手機甩進學霸咖啡杯裡繼續公放', cubes: 28, note: '水陸立體聲社死傳奇成就達成' }
      ]
    },
    {
      id: 'bq2',
      scene: 'SCENE 02 // 走廊轉角',
      question: '深夜走廊裝水，一隻巴掌大的會飛美洲大蟑螂張開翅膀直線朝你臉上衝刺：',
      options: [
        { label: 'A', text: '眼神一凝，脫下拖鞋精準一擊必殺', cubes: 0, note: '無糖戰神！在場所有人拜你為義父' },
        { label: 'B', text: '怪叫一聲，百米衝刺閃回房內反鎖', cubes: 4, note: '微糖驚嚇，只有隔壁聽見嬌喘' },
        { label: 'C', text: '海豚音慘叫，無尾熊抱住剛開門的朋友', cubes: 14, note: '突破全糖臨界！整層開門圍觀抱抱' },
        { label: 'D', text: '殺蟲劑狂噴猛掃觸發走廊煙霧火警', cubes: 35, note: '生化浩劫！全棟寒風吹冷風點名' }
      ]
    },
    {
      id: 'bq3',
      scene: 'SCENE 03 // 早八課堂',
      question: '早八必修課睡著被大刀教授點名，驚醒站起來脫口而出：',
      options: [
        { label: 'A', text: '「報告教授，邏輯推導中請容我思考30秒。」', cubes: 1, note: '危機處理典範，教授點頭認可' },
        { label: 'B', text: '「阿姨我要大冰奶加蛋，內用！」', cubes: 10, note: '少糖夢遊！教授問可不可以幫代購' },
        { label: 'C', text: '「阿嬤早安！妳今天中午吃飽沒？」', cubes: 25, note: '孝孫爆糖！學分跟阿嬤去廟裡拜拜' },
        { label: 'D', text: '叫阿嬤還踢翻全糖珍奶一路滾到講台腳邊', cubes: 48, note: '身心雙重毀滅！預約明年第一排' }
      ]
    },
    {
      id: 'bq4',
      scene: 'SCENE 04 // 數位社群大群',
      question: '垃圾桶套頭自拍配文「這課無聊到想圓寂」，按下發送才發現：',
      options: [
        { label: 'A', text: '發在自己的個人私人備忘錄裡', cubes: 0, note: '安全過關，僅果糖怪知曉' },
        { label: 'B', text: '發在好友4人群，2秒內光速收回', cubes: 3, note: '朋友截圖永遠比光速快0.1秒' },
        { label: 'C', text: '發在有系主任的180人必修大群無法收回', cubes: 22, note: '系主任回覆問號並將圖片置頂' },
        { label: 'D', text: '助教上課開投影機時直接放大在300吋巨幕', cubes: 60, note: '焦糖核爆！從此稱號圓寂武士' }
      ]
    },
    {
      id: 'bq5',
      scene: 'SCENE 05 // 熱門學餐',
      question: '端麻婆豆腐走過暗戀對象身旁，腳底踩到油漬失去重心：',
      options: [
        { label: 'A', text: '太空步滑行穩住餐盤，一滴不漏', cubes: 2, note: '全場誤以為是熱舞社長帥氣登場' },
        { label: 'B', text: '單膝跪地做出求婚姿勢化解尷尬', cubes: 9, note: '暗戀對象以為你在跟打飯阿姨求婚' },
        { label: 'C', text: '大劈腿滑行三公尺，豆腐精準扣在自己頭頂', cubes: 26, note: '摩西分海！全場三百人起立鼓掌' },
        { label: 'D', text: '亂抓扯翻暗戀對象的熱湯與外套陪葬', cubes: 55, note: '史詩連坐！戀情尚未開始先入土' }
      ]
    },
    {
      id: 'bq6',
      scene: 'SCENE 06 // 健身房更衣室',
      question: '在健身房更衣室吹頭髮，突然發現全身鏡裡反射著旁邊教練驚訝的表情：',
      options: [
        { label: 'A', text: '從容關掉吹風機，點頭致意離場', cubes: 1, note: '無懈可擊的紳士風度' },
        { label: 'B', text: '發現自己褲子穿反，迅速轉身整理', cubes: 8, note: '教練默默轉移視線' },
        { label: 'C', text: '拿著吹風機對著空氣假裝麥克風高歌副歌', cubes: 16, note: '被當成健身房表演型人格' },
        { label: 'D', text: '轉身滑倒直接撞進置物櫃整個人卡住', cubes: 34, note: '叫來三位巡場教練一起拔你出來' }
      ]
    },
    {
      id: 'bq7',
      scene: 'SCENE 07 // 高級咖啡廳',
      question: '在文青咖啡廳點單，店員問「冰塊甜度怎麼調整？」，你神遊中脫口而出：',
      options: [
        { label: 'A', text: '「正常冰微糖，謝謝。」', cubes: 0, note: '日常純潔操作' },
        { label: 'B', text: '「加一匙胡椒，少蔥多辣！」', cubes: 7, note: '店員笑著問要不要加酸菜' },
        { label: 'C', text: '「只要店員笑一個，我都覺得甜！」', cubes: 20, note: '油膩土味暴擊！全咖啡廳瞬間冷場' },
        { label: 'D', text: '付錢拿悠遊卡在熱拿鐵杯蓋上連刷三次逼逼逼', cubes: 38, note: '整排排隊客人屏住呼吸看你刷咖啡' }
      ]
    },
    {
      id: 'bq8',
      scene: 'SCENE 08 // 電梯密閉空間',
      question: '客滿 12 人的公司電梯緩慢上升，肚子突傳一陣雷鳴般的滾動聲：',
      options: [
        { label: 'A', text: '氣沉丹田，用意志力鎖死括約肌', cubes: 2, note: '成功化解危機於無形' },
        { label: 'B', text: '放出微弱氣聲，立刻低頭看手機', cubes: 8, note: '後方同事默默拉高衣領' },
        { label: 'C', text: '長達 4 秒重低音響屁，全場無人敢動', cubes: 24, note: '空氣凝固！樓層數字跳得比一世紀還慢' },
        { label: 'D', text: '放屁後電梯突然故障卡在樓層間整整十分鐘', cubes: 65, note: '生化封閉空間！所有人共同經歷人生走馬燈' }
      ]
    },
    {
      id: 'bq9',
      scene: 'SCENE 09 // 跨年晚會',
      question: '萬人跨年倒數最後 3 秒「3、2、1！」，大家都在相擁歡呼，你興奮舉起雙手：',
      options: [
        { label: 'A', text: '和同行朋友碰杯慶祝新年快樂', cubes: 1, note: '溫馨滿分無社死' },
        { label: 'B', text: '揮手打翻了隔壁陌生人的爆米花桶', cubes: 9, note: '新年第一秒就忙著在地上撿爆米花' },
        { label: 'C', text: '把旁邊穿羽絨衣的陌生大叔抱住親了一口', cubes: 32, note: '大叔老婆在旁邊眼神充滿殺氣' },
        { label: 'D', text: '跳躍落地直接踩裂舞台總控制線煙火啞火', cubes: 80, note: '全場萬人瞪大眼睛盯著你' }
      ]
    },
    {
      id: 'bq10',
      scene: 'SCENE 10 // 線上會議報告',
      question: '百人遠距線上大會輪到你分享螢幕，你按下「共用整個螢幕」的那一刻：',
      options: [
        { label: 'A', text: '精準切換到準備好的乾淨簡報頁面', cubes: 0, note: '專業滿分操作' },
        { label: 'B', text: '跳出網購「生髮水與脫毛膏」購物車視窗', cubes: 12, note: '總監輕咳一聲提醒換頁' },
        { label: 'C', text: '視窗停在自己搜尋「如何假裝工作很忙」頁面', cubes: 25, note: '全螢幕截圖立刻出現在主管私訊群' },
        { label: 'D', text: '公放背景音樂是「戀愛告白模擬音檔」大音量播放', cubes: 58, note: '會議室百人共同見證你的少女心' }
      ]
    }
  ],

  // 4. 羞恥語意因子
  shameFactors: [
    { id: 'f-grandma', name: '👵 稱謂錯亂', regex: /阿嬤|媽媽|爸爸|老公|老婆|寶貝|阿姨|阿公/g, addCubes: 32, badge: 'bg-amber-500/20 text-amber-300 border-amber-400/50' },
    { id: 'f-prof', name: '🎓 權威暴擊', regex: /教授|系主任|校長|老師|院長|主管|經理|老闆/g, addCubes: 22, badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50' },
    { id: 'f-cloth', name: '👗 穿著失誤', regex: /女僕|反穿|拉鍊|衣服|睡衣|拖鞋|短褲/g, addCubes: 28, badge: 'bg-rose-500/20 text-rose-300 border-rose-400/50' },
    { id: 'f-digital', name: '📡 數位擴散', regex: /大群|錯頻|收回|麥克風|直播|藍牙|耳機|最大聲|投影|截圖/g, addCubes: 35, badge: 'bg-purple-500/20 text-purple-300 border-purple-400/50' },
    { id: 'f-bio', name: '💨 生化反應', regex: /放屁|響屁|打嗝|拉肚子|味道|氣味|臭/g, addCubes: 30, badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50' },
    { id: 'f-crush', name: '💔 戀愛粉碎', regex: /暗戀|學姐|學姊|學長|告白|情話|曖昧|男神|女神/g, addCubes: 36, badge: 'bg-pink-500/20 text-pink-300 border-pink-400/50' },
    { id: 'f-physical', name: '🤸 肢體諧星', regex: /滑倒|劈腿|跌倒|摔倒|恐龍|科目三|撞門|卡住/g, addCubes: 24, badge: 'bg-orange-500/20 text-orange-300 border-orange-400/50' }
  ],

  // 5. 現場加乘因子
  sceneMultipliers: [
    { id: 'mult-crush', label: '💘 暗戀對象在場', multiplier: 1.5, desc: '心碎加成 x1.5' },
    { id: 'mult-crowd', label: '👥 超過50人目擊', multiplier: 1.8, desc: '公開處刑 x1.8' },
    { id: 'mult-story', label: '📹 被錄成限動瘋傳', multiplier: 2.2, desc: '數位留存 x2.2' },
    { id: 'mult-sober', label: '😐 完全清醒沒喝醉', multiplier: 1.2, desc: '無法甩鍋 x1.2' }
  ],

  // 6. 經典例子膠囊
  presetConfessions: [
    {
      title: '👵 把主管叫成阿嬤',
      text: '晨會報告太緊張，當全部門面把最嚴格的主管叫「阿嬤」，還順口問早點吃了沒。'
    },
    {
      title: '💌 土味情話錯頻發大群',
      text: '錄給曖昧對象的親嘴語音手滑錯頻發到公司200人公告大群，超過時間無法收回。'
    },
    {
      title: '👗 穿女僕裝取貨遇暗戀對象',
      text: '打賭輸了穿蕾絲女僕裝去超商取貨，抬頭發現店員竟然是暗戀三年的同學。'
    },
    {
      title: '💨 客滿電梯放響屁故障',
      text: '12人客滿電梯裡放連環重低音響屁，下一秒電梯突然卡住停了整整五分鐘。'
    },
    {
      title: '☕ 咖啡杯刷悠遊卡連刷三次',
      text: '超商買咖啡拿悠遊卡對著熱拿鐵杯蓋連刷三次喊「怎麼沒扣款」，店員看呆。'
    },
    {
      title: '🦖 恐龍裝跳舞卡在旋轉門',
      text: '穿充氣恐龍裝耍帥跳舞，結果尾巴卡在大樓旋轉門裡整個人動彈不得。'
    }
  ],

  // 7. PK 擂台題庫 (無男宿、高級社交情境)
  pkRandomActs: [
    { text: '把洗面乳當牙膏刷了一整週，還向朋友誇獎這款泡沫很綿密。', baseCubes: 38 },
    { text: '自習室睡到口水流成地圖，對面陌生人默默遞了一包衛生紙。', baseCubes: 45 },
    { text: '買宵夜跟老闆說「微辣不要辣」，老闆放下鏟子盯著我看了十秒。', baseCubes: 18 },
    { text: '幫翹課朋友喊「有」，朋友剛好推門走進來跟主管對眼四目相交。', baseCubes: 72 },
    { text: '穿恐龍裝跳街舞，頭套卡住直接撞進警衛室保全大叔的懷裡。', baseCubes: 115 },
    { text: '「寶貝親一個」錯傳給指導教授，教授回訊「請先交初稿」。', baseCubes: 168 },
    { text: '學餐端盤跌倒大劈腿，貢丸飛進隔壁桌系主任的保溫杯裡一桿進洞。', baseCubes: 290 }
  ],

  // 8. 全新升級：遊樂場高級設備資料
  // 遊戲 1: 量子果糖裂變反應爐 (Quantum Fructose Molecular Reactor)
  // 遊戲 2: 超低溫焦糖提煉儀 (Cryogenic Caramel Distiller)
  // 遊戲 3: 神經元腦波音頻調諧儀 (Neural Resonance Synthesizer)
  playgroundLabModules: {
    reactor: {
      name: '量子果糖裂變反應爐',
      desc: '點擊調諧能量節點，穩定果糖分子晶格，防止超載融毀！'
    },
    distiller: {
      name: '全息超低溫焦糖提煉儀',
      desc: '精準調控雷射蒸餾溫度與分子流速，提煉 99.9% 琥珀結晶！'
    },
    neural: {
      name: '神經元腦波音頻調諧儀',
      desc: '實時頻譜合成器，調諧社交羞恥腦電波，重構心靈頻率！'
    }
  },

  // 9. 榮譽榜預設
  initialHallOfShame: [
    {
      id: 'hos-101',
      ticket: 'LAB-1285160',
      author: '實習組長',
      category: '稱謂錯亂',
      story: '上台太緊張把嚴肅主管叫「阿嬤」，還順口問吃飽沒。',
      cubes: 50,
      grams: 250,
      levelObj: { name: '認證孝孫級爆糖', badgeClass: 'bg-red-500/30 text-red-200 border-red-400' },
      date: '2026/11/16 11:20',
      upvotes: 68
    },
    {
      id: 'hos-102',
      ticket: 'LAB-2041920',
      author: '數位迷途者',
      category: '數位擴散',
      story: '土味情話親嘴語音手滑發到200人正式公告大群。',
      cubes: 150,
      grams: 750,
      levelObj: { name: '蜂王漿坍塌', badgeClass: 'bg-rose-600/40 text-rose-100 border-rose-400' },
      date: '2026/11/16 09:45',
      upvotes: 112
    },
    {
      id: 'hos-103',
      ticket: 'LAB-3141592',
      author: '深夜廚神',
      category: '生化氣味',
      story: '半夜煮加臭重口味料理觸發大樓火警，全員寒風集合點名。',
      cubes: 420,
      grams: 2100,
      levelObj: { name: '傳奇糖分黑洞', badgeClass: 'bg-purple-600/45 text-purple-100 border-purple-300' },
      date: '2026/11/15 23:30',
      upvotes: 185
    }
  ],

  // 10. 吉祥物狀態
  monsterStates: [
    {
      id: 'm-pure',
      min: 0,
      max: 5,
      title: '純潔觀察態 (Lv.0-1)',
      color: '#10B981',
      quotes: [
        '含糖量極低，你確定你生活在地球嗎？',
        '沒社死過的人生，就像沒珍珠的珍奶！',
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
        '突破 12 顆方糖（全糖臨界）！腳趾抓地了？',
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
        '太甜了！叫主管阿嬤？咖啡刷悠遊卡？這就對了！',
        '你的調皮指數可以養活三隻果糖怪！',
        '去第 3 頁把朋友蠢事也拖下水 PK 吧！'
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
        '恭喜晉升全糖院士！全宇宙都收到訊號了！'
      ]
    }
  ]
};
