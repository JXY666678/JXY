(() => {
  "use strict";

  const MODEL_URL = "/static/model/model.json";
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const STORAGE_KEY = "campusSortHistoryV1";
  const CATEGORY_ORDER = ["recyclable", "hazardous", "kitchen", "other"];

  const CATEGORIES = {
    recyclable: {
      name: "可回收物",
      icon: "recycle",
      bin: "蓝色 · 可回收物桶",
      confidenceTone: "recyclable",
      advice: [
        "清空瓶罐中的残留物，简单冲洗后晾干。",
        "纸箱、塑料瓶尽量压扁，节省回收空间。",
        "确认没有油污污染后，投入蓝色可回收物桶。",
      ],
    },
    hazardous: {
      name: "有害垃圾",
      icon: "hazard",
      bin: "红色 · 有害垃圾桶",
      confidenceTone: "hazardous",
      advice: [
        "不要拆解、挤压或加热，避免有害物质泄漏。",
        "用原包装或密封袋单独包裹，防止污染其他垃圾。",
        "投入红色有害垃圾桶；校园未配置时交至环保回收点。",
      ],
    },
    kitchen: {
      name: "厨余垃圾",
      icon: "kitchen",
      bin: "绿色 · 厨余垃圾桶",
      confidenceTone: "kitchen",
      advice: [
        "沥干汤汁和水分，减少异味与渗漏。",
        "去除塑料袋、牙签、餐具等非厨余杂物。",
        "投入绿色厨余垃圾桶，尽量使用可降解垃圾袋。",
      ],
    },
    other: {
      name: "其他垃圾",
      icon: "other",
      bin: "灰色 · 其他垃圾桶",
      confidenceTone: "other",
      advice: [
        "用垃圾袋密封，避免散落或污染周边环境。",
        "尖锐物品请先包裹，再投入垃圾桶。",
        "投入灰色其他垃圾桶，不要混入可回收物。",
      ],
    },
  };

  const TERM_GROUPS = {
    recyclable: [
      "water bottle", "pop bottle", "soda bottle", "beer bottle", "wine bottle", "bottlecap",
      "carton", "envelope", "comic book", "book jacket", "menu", "crossword puzzle", "binder",
      "notebook computer", "pencil box", "crate", "milk can", "can opener", "bucket", "barrel",
      "shopping basket", "bottle opener", "corkscrew", "spatula", "ladle", "strainer",
      "frying pan", "wok", "cleaver", "plate rack", "safe", "radiator", "mailbox",
      "laptop", "laptop computer", "desktop computer", "computer keyboard", "typewriter keyboard",
      "computer mouse", "monitor", "screen", "television", "cellular telephone", "dial telephone",
      "pay-phone", "modem", "radio", "cassette", "cassette player", "CD player", "tape player",
      "iPod", "hand-held computer", "remote control", "joystick", "printer", "photocopier",
      "projector", "loudspeaker", "microphone", "hard disc", "Polaroid camera", "reflex camera",
      "tripod", "lens cap", "torch", "refrigerator", "washing machine", "dishwasher", "microwave",
      "toaster", "vacuum", "electric fan", "space heater", "sewing machine", "lawn mower",
      "power drill", "stove", "Crock Pot", "Dutch oven", "waffle iron", "rotisserie", "espresso maker",
      "smoothing iron", "blow dryer", "table lamp", "lampshade", "analog clock", "digital clock",
      "wall clock", "stopwatch", "digital watch", "dining table", "desk", "folding chair",
      "rocking chair", "bookcase", "wardrobe", "chest", "crib", "studio couch", "park bench",
      "file cabinet", "china cabinet", "entertainment center", "bassinet", "cradle", "bicycle",
      "mountain bike", "tricycle", "unicycle", "motor scooter", "backpack", "purse", "wallet",
      "mailbag", "T-shirt", "sweatshirt", "jean", "cardigan", "suit", "gown", "kimono", "miniskirt",
      "maillot", "bikini", "brassiere", "sock", "mitten", "bathing cap", "shower cap", "bonnet",
      "cowboy hat", "sombrero", "trench coat", "fur coat", "poncho", "velvet", "wool", "quilt",
      "pillow", "bath towel", "handkerchief", "apron", "bib", "running shoe", "sandal", "Loafer",
      "clog", "cowboy boot", "potter's wheel",
    ],
    hazardous: [
      "pill bottle", "syringe", "paintbrush", "oil filter", "hair spray", "perfume", "face powder",
      "lipstick", "lotion", "beaker", "Petri dish", "lab coat", "barometer",
    ],
    kitchen: [
      "banana", "orange", "lemon", "fig", "pineapple", "jackfruit", "custard apple", "pomegranate",
      "strawberry", "Granny Smith", "head cabbage", "broccoli", "cauliflower", "zucchini",
      "spaghetti squash", "acorn squash", "butternut squash", "cucumber", "artichoke", "bell pepper",
      "cardoon", "mushroom", "corn", "acorn", "hay", "rapeseed", "daisy", "hip", "buckeye", "ear",
      "dough", "meat loaf", "pizza", "potpie", "burrito", "red wine", "espresso", "eggnog",
      "ice cream", "ice lolly", "French loaf", "bagel", "pretzel", "cheeseburger", "hotdog",
      "mashed potato", "guacamole", "consomme", "hot pot", "trifle", "chocolate sauce", "carbonara",
      "coho", "sturgeon", "gar", "lionfish", "puffer", "crab", "lobster", "crayfish",
    ],
    other: [
      "ashcan", "trash can", "garbage can", "dustbin", "trash barrel", "trash bin", "wastebin",
      "paper towel", "toilet tissue", "toilet paper", "bathroom tissue", "diaper", "nappy",
      "mask", "gasmask", "oxygen mask", "ski mask", "plastic bag", "packet", "Band Aid", "lighter",
      "matchstick", "candle", "broom", "mop", "dishrag", "dishcloth", "ballpoint", "rubber eraser",
      "pencil sharpener", "sunscreen", "toilet seat", "mousetrap", "balloon", "plate", "cup",
      "coffee mug", "soup bowl", "mixing bowl", "measuring cup", "teapot", "goblet", "beer glass",
      "pitcher", "water jug", "vase", "flowerpot", "washbasin", "tile roof", "stone wall", "mortar",
      "sunglasses", "sunglass", "umbrella", "doormat", "teddy", "basketball", "tennis ball",
      "ping-pong ball", "golf ball", "soccer ball", "volleyball", "ball",
    ],
  };

  const OBJECT_NAMES = [
    { test: /water bottle|pop bottle|soda bottle/i, name: "塑料水瓶" },
    { test: /beer bottle|wine bottle/i, name: "玻璃酒瓶" },
    { test: /bottlecap/i, name: "瓶盖" },
    { test: /carton/i, name: "纸盒" },
    { test: /envelope/i, name: "旧信封" },
    { test: /comic book|book jacket|menu/i, name: "旧书本" },
    { test: /binder/i, name: "旧文件夹" },
    { test: /pencil box/i, name: "旧笔袋" },
    { test: /notebook computer|laptop|desktop computer|hand-held computer/i, name: "旧电脑" },
    { test: /cellular telephone|dial telephone|pay-phone/i, name: "旧手机/电话" },
    { test: /computer keyboard|typewriter keyboard/i, name: "旧键盘" },
    { test: /computer mouse|joystick/i, name: "旧鼠标" },
    { test: /monitor|screen|television/i, name: "旧显示器" },
    { test: /printer|photocopier/i, name: "旧打印设备" },
    { test: /projector/i, name: "旧投影仪" },
    { test: /remote control/i, name: "旧遥控器" },
    { test: /refrigerator/i, name: "旧冰箱" },
    { test: /washing machine/i, name: "旧洗衣机" },
    { test: /dishwasher/i, name: "旧洗碗机" },
    { test: /microwave/i, name: "旧微波炉" },
    { test: /vacuum/i, name: "旧吸尘器" },
    { test: /electric fan/i, name: "旧电风扇" },
    { test: /space heater/i, name: "旧取暖器" },
    { test: /table lamp|lampshade/i, name: "旧台灯" },
    { test: /power drill/i, name: "旧电钻" },
    { test: /lawn mower/i, name: "旧割草机" },
    { test: /bicycle|mountain bike|tricycle/i, name: "旧自行车" },
    { test: /backpack/i, name: "旧背包" },
    { test: /purse|wallet/i, name: "旧钱包" },
    { test: /T-shirt|sweatshirt|jean|cardigan|suit|gown|kimono|skirt|coat|poncho/i, name: "旧衣物" },
    { test: /running shoe|sandal|Loafer|clog|cowboy boot/i, name: "旧鞋子" },
    { test: /dining table|desk/i, name: "旧书桌" },
    { test: /folding chair|rocking chair|chair/i, name: "旧椅子" },
    { test: /bookcase/i, name: "旧书架" },
    { test: /wardrobe/i, name: "旧衣柜" },
    { test: /studio couch|couch/i, name: "旧沙发" },
    { test: /pill bottle/i, name: "过期药瓶" },
    { test: /syringe/i, name: "废弃注射器" },
    { test: /paintbrush/i, name: "废油漆刷" },
    { test: /oil filter/i, name: "废机油滤芯" },
    { test: /hair spray/i, name: "废弃发胶罐" },
    { test: /perfume/i, name: "过期香水" },
    { test: /face powder|lipstick|lotion/i, name: "过期化妆品" },
    { test: /beaker|Petri dish|lab coat/i, name: "实验室废弃物" },
    { test: /banana/i, name: "香蕉皮" },
    { test: /orange|lemon|fig|pineapple|jackfruit|custard apple|pomegranate|strawberry|Granny Smith/i, name: "水果残渣" },
    { test: /cabbage|broccoli|cauliflower|zucchini|squash|cucumber|artichoke|bell pepper|cardoon|mushroom|corn/i, name: "蔬菜残渣" },
    { test: /hay|rapeseed|daisy|hip|buckeye|acorn|ear/i, name: "植物残枝" },
    { test: /pizza|potpie|burrito|red wine|espresso|eggnog|ice cream|ice lolly|French loaf|bagel|pretzel|cheeseburger|hotdog|mashed potato|guacamole|consomme|hot pot|trifle|chocolate sauce|carbonara|dough|meat loaf/i, name: "食物残渣" },
    { test: /coho|sturgeon|gar|lionfish|puffer|crab|lobster|crayfish/i, name: "水产残渣" },
    { test: /paper towel|toilet tissue|toilet paper|bathroom tissue/i, name: "用过的纸巾" },
    { test: /diaper|nappy|napkin/i, name: "一次性纸品" },
    { test: /(^|,\s*)mask(?:,|$)|gasmask|oxygen mask|ski mask/i, name: "一次性口罩" },
    { test: /plastic bag/i, name: "塑料袋" },
    { test: /packet/i, name: "零食包装袋" },
    { test: /plate|cup|coffee mug|soup bowl|mixing bowl|measuring cup|teapot|goblet|beer glass|pitcher|water jug/i, name: "陶瓷/玻璃餐具" },
    { test: /vase|flowerpot/i, name: "旧花盆/花瓶" },
    { test: /lighter|matchstick/i, name: "打火机/火柴" },
    { test: /candle/i, name: "蜡烛" },
    { test: /broom|mop|dishrag|dishcloth/i, name: "旧清洁工具" },
    { test: /ballpoint/i, name: "旧笔" },
    { test: /rubber eraser/i, name: "橡皮擦" },
    { test: /Band Aid/i, name: "用过的创可贴" },
    { test: /basketball|tennis ball|ping-pong ball|golf ball|soccer ball|volleyball|ball$/i, name: "旧球类" },
    { test: /umbrella/i, name: "旧雨伞" },
    { test: /sunglasses|sunglass/i, name: "旧太阳镜" },
    { test: /ashcan|trash can|garbage can|dustbin|trash barrel|trash bin|wastebin/i, name: "垃圾桶" },
    { test: /bucket|barrel|crate|shopping basket/i, name: "旧收纳容器" },
    { test: /frying pan|wok|spatula|ladle|strainer|can opener|corkscrew|cleaver/i, name: "旧金属厨具" },
    { test: /sock|mitten|bathing cap|shower cap|bath towel|handkerchief|apron|bib/i, name: "旧织物" },
    { test: /pillow|quilt/i, name: "旧床上用品" },
    { test: /radio|cassette|CD player|tape player|iPod|loudspeaker|microphone/i, name: "旧影音设备" },
    { test: /toaster|stove|Crock Pot|Dutch oven|waffle iron|rotisserie|espresso maker|smoothing iron|blow dryer/i, name: "旧小家电" },
    { test: /sewing machine/i, name: "旧缝纫机" },
    { test: /safe|radiator|mailbox/i, name: "旧金属制品" },
    { test: /analog clock|digital clock|wall clock|stopwatch|digital watch/i, name: "旧钟表" },
    { test: /park bench|file cabinet|china cabinet|entertainment center/i, name: "旧家具" },
  ];

  const CATEGORY_MATCHERS = CATEGORY_ORDER.map((category) => {
    const escaped = TERM_GROUPS[category]
      .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");
    return { category, regex: new RegExp(`\\b(?:${escaped})\\b`, "i") };
  });

  const dom = {};
  const state = {
    model: null,
    modelPromise: null,
    modelError: null,
    imageFile: null,
    imageURL: null,
    imageElement: null,
    sampleName: null,
    busy: false,
    result: null,
    lastRecordId: null,
    cameraStream: null,
    history: loadHistory(),
    toastTimer: null,
    hintTimer: null,
    classifyToken: 0,
  };

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheDom();
    if (!dom.dropzone) return;

    bindEvents();
    updateStats();
    renderHistory();
    loadModel();
  }

  function cacheDom() {
    const ids = [
      "enginePill", "engineText", "dropzone", "fileInput", "chooseFile", "openCamera", "previewPanel",
      "previewImage", "removeImage", "fileName", "fileMeta", "classifyBtn", "resultCard", "emptyState",
      "loadingState", "loadingHint", "resultContent", "errorState", "errorMessage", "retryBtn",
      "categoryHero", "categorySymbol", "binTag", "categoryName", "objectName", "objectEn",
      "confidenceBadge", "confidenceFill", "adviceTag", "adviceList", "altBars", "correctActions",
      "resetBtn", "scanOverlay", "statToday", "statRecyclable", "statHazardous", "statTotal",
      "historyEmpty", "historyList", "clearHistory", "cameraModal", "cameraBackdrop", "cameraVideo",
      "closeCamera", "cancelCamera", "takePhoto", "toast", "guideLink",
    ];
    ids.forEach((id) => {
      dom[id] = document.getElementById(id);
    });
  }

  function bindEvents() {
    dom.chooseFile.addEventListener("click", (event) => {
      event.stopPropagation();
      dom.fileInput.click();
    });

    dom.openCamera.addEventListener("click", (event) => {
      event.stopPropagation();
      openCamera();
    });

    dom.fileInput.addEventListener("change", () => {
      const file = dom.fileInput.files && dom.fileInput.files[0];
      dom.fileInput.value = "";
      if (file) setFile(file, { autoClassify: false });
    });

    dom.dropzone.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      dom.fileInput.click();
    });

    dom.dropzone.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        dom.fileInput.click();
      }
    });

    ["dragenter", "dragover"].forEach((type) => {
      dom.dropzone.addEventListener(type, (event) => {
        event.preventDefault();
        dom.dropzone.classList.add("is-dragging");
      });
    });

    ["dragleave", "drop"].forEach((type) => {
      dom.dropzone.addEventListener(type, (event) => {
        event.preventDefault();
        dom.dropzone.classList.remove("is-dragging");
      });
    });

    dom.dropzone.addEventListener("drop", (event) => {
      const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
      if (file) setFile(file, { autoClassify: false });
    });

    document.addEventListener("dragover", (event) => event.preventDefault());
    document.addEventListener("drop", (event) => event.preventDefault());

    dom.removeImage.addEventListener("click", resetPicker);
    dom.resetBtn.addEventListener("click", resetPicker);
    dom.retryBtn.addEventListener("click", resetPicker);
    dom.classifyBtn.addEventListener("click", () => classifyImage());

    document.querySelectorAll(".sample-item").forEach((button) => {
      button.addEventListener("click", () => useSample(button));
    });

    dom.clearHistory.addEventListener("click", clearHistory);

    dom.closeCamera.addEventListener("click", closeCamera);
    dom.cancelCamera.addEventListener("click", closeCamera);
    dom.cameraBackdrop.addEventListener("click", closeCamera);
    dom.takePhoto.addEventListener("click", takePhoto);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !dom.cameraModal.hidden) closeCamera();
    });

    window.addEventListener("pagehide", closeCamera);

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        document.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("is-active"));
        link.classList.add("is-active");
      });
    });
  }

  function setEngineStatus(status, text) {
    if (!dom.enginePill) return;
    dom.enginePill.dataset.state = status;
    dom.engineText.textContent = text;
  }

  async function loadModel() {
    if (!window.tf || !window.mobilenet) {
      state.modelError = new Error("TensorFlow.js 脚本未加载");
      setEngineStatus("error", "AI 引擎不可用");
      return;
    }

    try {
      setEngineStatus("loading", "AI 引擎加载中");
      state.model = await getModel();
      setEngineStatus("ready", "AI 引擎已就绪");
    } catch (error) {
      console.error("模型加载失败:", error);
      state.modelError = error;
      setEngineStatus("error", "AI 引擎加载失败");
    }
  }

  function getModel() {
    if (state.model) return Promise.resolve(state.model);
    if (state.modelPromise) return state.modelPromise;

    if (!window.tf || !window.mobilenet) {
      return Promise.reject(new Error("TensorFlow.js 或 MobileNet 脚本未加载"));
    }

    state.modelPromise = (async () => {
      if (window.tf && typeof tf.ready === "function") {
        await tf.ready();
      }
      const model = await window.mobilenet.load({
        version: 2,
        alpha: 1.0,
        modelUrl: MODEL_URL,
        inputRange: [0, 1],
      });
      return model;
    })()
      .then((model) => {
        state.model = model;
        state.modelError = null;
        setEngineStatus("ready", "AI 引擎已就绪");
        return model;
      })
      .catch((error) => {
        state.modelPromise = null;
        state.modelError = error;
        setEngineStatus("error", "AI 引擎加载失败");
        throw error;
      });

    return state.modelPromise;
  }

  function validateFile(file) {
    if (!file) return "没有读取到照片文件";
    if (!file.type || !file.type.startsWith("image/")) return "请选择 JPG、PNG 或 WebP 格式的图片";
    if (file.size > MAX_FILE_SIZE) return "照片超过 10 MB，请压缩后再试";
    return null;
  }

  async function setFile(file, options = {}) {
    if (state.busy) {
      showToast("正在识别中，请稍候");
      return;
    }

    const error = validateFile(file);
    if (error) {
      showToast(error);
      return;
    }

    const token = ++state.classifyToken;
    if (state.imageURL) URL.revokeObjectURL(state.imageURL);

    state.imageFile = file;
    state.imageURL = URL.createObjectURL(file);
    state.sampleName = options.sampleName || null;

    dom.previewImage.src = state.imageURL;
    dom.fileName.textContent = options.displayName || file.name || "已选择照片";
    dom.fileMeta.textContent = formatBytes(file.size);

    dom.dropzone.hidden = true;
    dom.previewPanel.hidden = false;
    dom.classifyBtn.disabled = false;
    dom.scanOverlay.classList.remove("is-visible");
    dom.resultCard.dataset.state = "empty";
    showPanel("emptyState");

    try {
      state.imageElement = await loadImage(state.imageURL);
    } catch (loadError) {
      console.error("图片读取失败:", loadError);
      showToast("图片读取失败，请换一张照片");
      resetPicker();
      return;
    }

    if (token !== state.classifyToken) return;

    if (options.autoClassify) {
      await classifyImage();
    }
  }

  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("图片无法解码"));
      image.src = url;
    });
  }

  function resetPicker() {
    state.classifyToken += 1;
    state.busy = false;
    state.imageFile = null;
    state.imageElement = null;
    state.sampleName = null;

    if (state.imageURL) {
      URL.revokeObjectURL(state.imageURL);
      state.imageURL = null;
    }

    if (state.hintTimer) {
      clearInterval(state.hintTimer);
      state.hintTimer = null;
    }

    dom.previewImage.removeAttribute("src");
    dom.previewPanel.hidden = true;
    dom.dropzone.hidden = false;
    dom.scanOverlay.classList.remove("is-visible");
    dom.classifyBtn.disabled = false;
    dom.resultCard.dataset.state = "empty";
    state.result = null;
    state.lastRecordId = null;
    showPanel("emptyState");
  }

  async function useSample(button) {
    if (state.busy) {
      showToast("正在识别中，请稍候");
      return;
    }

    const src = button.dataset.sample;
    const name = button.dataset.name || "示例物品";

    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const file = new File([blob], src.split("/").pop(), { type: blob.type || "image/jpeg" });
      await setFile(file, {
        autoClassify: true,
        displayName: name,
        sampleName: name,
      });
    } catch (error) {
      console.error("示例图片加载失败:", error);
      showToast("示例图片加载失败，请选择本地照片");
    }
  }

  async function classifyImage() {
    if (state.busy || !state.imageElement) {
      if (!state.imageElement) showToast("请先选择一张照片");
      return;
    }

    const token = state.classifyToken;
    state.busy = true;
    dom.classifyBtn.disabled = true;
    dom.scanOverlay.classList.add("is-visible");
    dom.resultCard.dataset.state = "loading";
    showPanel("loadingState");

    const loadHints = [
      "正在提取图像特征…",
      "正在比对物品类别…",
      "正在生成投放建议…",
    ];
    let hintIndex = 0;

    dom.loadingHint.textContent = state.model ? loadHints[0] : "首次识别，正在加载本地 AI 模型…";

    if (state.hintTimer) clearInterval(state.hintTimer);
    state.hintTimer = setInterval(() => {
      hintIndex = (hintIndex + 1) % loadHints.length;
      dom.loadingHint.textContent = state.model ? loadHints[hintIndex] : "本地模型加载中，请稍候…";
    }, 1100);

    try {
      const model = await getModel();
      if (token !== state.classifyToken) return;
      const predictions = await model.classify(state.imageElement, 8);
      if (token !== state.classifyToken) return;
      const assessment = assessPredictions(predictions, state.sampleName);
      const record = addHistory(assessment);

      state.result = { ...assessment, id: record.id, corrected: false };
      state.lastRecordId = record.id;
      renderResult(state.result);
      dom.resultCard.dataset.state = "result";
      showPanel("resultContent");

      if (window.innerWidth < 901) {
        window.setTimeout(() => {
          dom.resultCard.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 180);
      }
    } catch (error) {
      console.error("识别失败:", error);
      const message = state.modelError
        ? "本地 AI 模型加载失败。请确认模型文件完整，然后刷新页面重试。"
        : "识别过程中出现问题，请换一张照片或刷新页面后重试。";
      dom.errorMessage.textContent = message;
      dom.resultCard.dataset.state = "error";
      showPanel("errorState");
    } finally {
      state.busy = false;
      dom.classifyBtn.disabled = false;
      dom.scanOverlay.classList.remove("is-visible");
      if (state.hintTimer) {
        clearInterval(state.hintTimer);
        state.hintTimer = null;
      }
    }
  }

  function assessPredictions(predictions, sampleName) {
    const scores = { recyclable: 0, hazardous: 0, kitchen: 0, other: 0 };
    let matched = false;
    let bestObject = null;
    let bestObjectLabel = "";

    predictions.forEach((prediction) => {
      const label = String(prediction.className || "").toLowerCase();
      let labelCategory = null;

      CATEGORY_MATCHERS.forEach(({ category, regex }) => {
        if (regex.test(label)) {
          scores[category] += prediction.probability;
          labelCategory = labelCategory || category;
          matched = true;
        }
      });

      if (!bestObject) {
        const object = OBJECT_NAMES.find((item) => item.test.test(label));
        if (object) {
          bestObject = object.name;
          bestObjectLabel = shortLabel(prediction.className);
        }
      }

      if (!labelCategory) {
        scores.other += prediction.probability * 0.1;
      }
    });

    let category = "other";
    let confidence = 42;

    if (matched) {
      category = CATEGORY_ORDER.reduce((best, item) => (
        scores[item] > scores[best] ? item : best
      ), "other");

      const totalScore = CATEGORY_ORDER.reduce((sum, item) => sum + scores[item], 0);
      const share = totalScore > 0 ? scores[category] / totalScore : 0;
      const topProbability = predictions[0] ? predictions[0].probability : 0;
      confidence = Math.round((share * 0.55 + topProbability * 0.45) * 100);
      confidence = Math.min(94, Math.max(35, confidence));
    } else {
      category = "other";
      confidence = 42;
      scores.recyclable = 0.18;
      scores.hazardous = 0.12;
      scores.kitchen = 0.16;
      scores.other = 0.34;
    }

    const alternatives = buildAlternatives(scores, category);
    const topPrediction = predictions[0] ? shortLabel(predictions[0].className) : "";
    const objectName = bestObject || sampleName || "照片中的物品";
    const objectEn = bestObjectLabel || topPrediction;

    return {
      category,
      confidence,
      alternatives,
      object: objectName,
      objectEn,
      matched,
      topPrediction,
      sampleName,
    };
  }

  function buildAlternatives(scores, category) {
    const base = 0.02;
    const total = CATEGORY_ORDER.reduce((sum, item) => sum + scores[item], 0) + base * CATEGORY_ORDER.length;
    const values = {};
    CATEGORY_ORDER.forEach((item) => {
      values[item] = Math.round(((scores[item] + base) / total) * 100);
    });

    const diff = 100 - CATEGORY_ORDER.reduce((sum, item) => sum + values[item], 0);
    values[category] += diff;
    return values;
  }

  function shortLabel(label) {
    const text = String(label || "").split(",")[0].trim();
    return text || "未知物品";
  }

  function renderResult(result) {
    const category = CATEGORIES[result.category];
    const status = dom.resultContent.querySelector(".result-status");

    if (status) {
      status.innerHTML = `<svg class="icon"><use href="#icon-check"></use></svg>${result.matched ? "识别完成" : "建议人工确认"}`;
    }

    updateCategoryVisual(result.category);
    dom.objectName.textContent = result.object;
    dom.objectEn.textContent = result.objectEn ? ` · ${result.objectEn}` : "";
    dom.confidenceBadge.textContent = `匹配度 ${result.confidence}%`;
    dom.confidenceFill.style.width = "0%";
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        dom.confidenceFill.style.width = `${result.confidence}%`;
      });
    });

    dom.adviceList.innerHTML = "";
    category.advice.forEach((text) => {
      const item = document.createElement("li");
      item.textContent = text;
      dom.adviceList.appendChild(item);
    });
    dom.adviceTag.textContent = `${category.advice.length} 个步骤`;

    renderAlternatives(result.alternatives, result.category);
    renderCorrectActions(result.category);
  }

  function updateCategoryVisual(categoryId) {
    const category = CATEGORIES[categoryId];
    dom.categoryHero.dataset.category = categoryId;
    dom.categorySymbol.innerHTML = `<svg aria-hidden="true"><use href="#icon-${category.icon}"></use></svg>`;
    dom.binTag.textContent = category.bin;
    dom.categoryName.textContent = category.name;

    dom.adviceList.innerHTML = "";
    category.advice.forEach((text) => {
      const item = document.createElement("li");
      item.textContent = text;
      dom.adviceList.appendChild(item);
    });
    dom.adviceTag.textContent = `${category.advice.length} 个步骤`;
  }

  function renderAlternatives(values, activeCategory) {
    dom.altBars.innerHTML = "";
    CATEGORY_ORDER.forEach((categoryId) => {
      const category = CATEGORIES[categoryId];
      const row = document.createElement("div");
      row.className = "alt-row";
      row.dataset.category = categoryId;
      if (categoryId === activeCategory) row.classList.add("is-active");

      const label = document.createElement("span");
      label.textContent = category.name;

      const track = document.createElement("span");
      track.className = "alt-track";
      const fill = document.createElement("span");
      fill.style.width = `${values[categoryId]}%`;
      track.appendChild(fill);

      const value = document.createElement("span");
      value.className = "alt-value";
      value.textContent = `${values[categoryId]}%`;

      row.append(label, track, value);
      dom.altBars.appendChild(row);
    });
  }

  function renderCorrectActions(activeCategory) {
    dom.correctActions.innerHTML = "";
    CATEGORY_ORDER.forEach((categoryId) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "correct-btn";
      button.dataset.category = categoryId;
      button.textContent = CATEGORIES[categoryId].name;
      if (categoryId === activeCategory) button.classList.add("is-selected");
      button.addEventListener("click", () => correctCategory(categoryId));
      dom.correctActions.appendChild(button);
    });
  }

  function correctCategory(categoryId) {
    if (!state.result || !CATEGORIES[categoryId]) return;

    const changed = state.result.category !== categoryId;
    state.result.category = categoryId;
    state.result.corrected = true;

    updateCategoryVisual(categoryId);
    dom.confidenceBadge.textContent = "人工修正";
    dom.confidenceFill.style.width = "100%";

    dom.correctActions.querySelectorAll(".correct-btn").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.category === categoryId);
    });

    if (changed && state.lastRecordId) {
      const record = state.history.find((item) => item.id === state.lastRecordId);
      if (record) {
        record.category = categoryId;
        record.object = state.result.object;
        record.confidence = 100;
        record.corrected = true;
        persistHistory();
        renderHistory();
        updateStats();
      }
      showToast(`已修正为「${CATEGORIES[categoryId].name}」，识别记录已更新`);
    } else {
      showToast(`已确认为「${CATEGORIES[categoryId].name}」`);
    }
  }

  function showPanel(panelId) {
    ["emptyState", "loadingState", "resultContent", "errorState"].forEach((id) => {
      dom[id].hidden = id !== panelId;
    });
  }

  function addHistory(assessment) {
    const record = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      category: assessment.category,
      object: assessment.object,
      objectEn: assessment.objectEn,
      confidence: assessment.confidence,
      timestamp: Date.now(),
      corrected: false,
    };

    state.history.unshift(record);
    state.history = state.history.slice(0, 20);
    persistHistory();
    renderHistory();
    updateStats();
    return record;
  }

  function loadHistory() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item) => (
        item && typeof item === "object" && CATEGORIES[item.category] && typeof item.timestamp === "number"
      )).slice(0, 20);
    } catch (error) {
      return [];
    }
  }

  function persistHistory() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.history));
    } catch (error) {
      console.warn("识别记录保存失败:", error);
    }
  }

  function renderHistory() {
    dom.historyList.innerHTML = "";
    dom.historyEmpty.hidden = state.history.length > 0;
    dom.clearHistory.hidden = state.history.length === 0;

    state.history.slice(0, 8).forEach((record) => {
      const category = CATEGORIES[record.category];
      const item = document.createElement("li");
      item.className = "history-item";

      const dot = document.createElement("span");
      dot.className = "history-dot";
      dot.dataset.category = record.category;
      dot.innerHTML = `<svg aria-hidden="true"><use href="#icon-${category.icon}"></use></svg>`;

      const main = document.createElement("div");
      main.className = "history-main";
      const title = document.createElement("strong");
      title.textContent = record.object || record.objectEn || "照片中的物品";
      const time = document.createElement("small");
      time.textContent = `${formatTime(record.timestamp)}${record.corrected ? " · 已人工修正" : ""}`;
      main.append(title, time);

      const right = document.createElement("div");
      right.className = "history-right";
      const catName = document.createElement("span");
      catName.className = "history-cat";
      catName.textContent = category.name;
      const score = document.createElement("span");
      score.className = "history-score";
      score.textContent = record.corrected ? "已修正" : `匹配 ${record.confidence}%`;
      right.append(catName, score);

      item.append(dot, main, right);
      dom.historyList.appendChild(item);
    });
  }

  function updateStats() {
    const now = new Date();
    const todayCount = state.history.filter((record) => {
      const date = new Date(record.timestamp);
      return date.getFullYear() === now.getFullYear()
        && date.getMonth() === now.getMonth()
        && date.getDate() === now.getDate();
    }).length;

    dom.statToday.textContent = String(todayCount);
    dom.statRecyclable.textContent = String(state.history.filter((item) => item.category === "recyclable").length);
    dom.statHazardous.textContent = String(state.history.filter((item) => item.category === "hazardous").length);
    dom.statTotal.textContent = String(state.history.length);
  }

  function clearHistory() {
    if (state.history.length === 0) return;
    if (!window.confirm("确定清空全部识别记录吗？此操作不可撤销。")) return;
    state.history = [];
    state.lastRecordId = null;
    persistHistory();
    renderHistory();
    updateStats();
    showToast("识别记录已清空");
  }

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.getFullYear() === now.getFullYear()
      && date.getMonth() === now.getMonth()
      && date.getDate() === now.getDate();

    const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    if (isToday) return `今天 ${time}`;

    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    if (date.getFullYear() === yesterday.getFullYear()
      && date.getMonth() === yesterday.getMonth()
      && date.getDate() === yesterday.getDate()) {
      return `昨天 ${time}`;
    }

    return `${date.getMonth() + 1}月${date.getDate()}日 ${time}`;
  }

  function formatBytes(bytes) {
    if (!bytes) return "0 KB";
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  async function openCamera() {
    if (state.busy) {
      showToast("正在识别中，请稍候");
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast("当前浏览器无法直接调用相机，请选择本地照片");
      dom.fileInput.click();
      return;
    }

    dom.cameraModal.hidden = false;
    document.body.style.overflow = "hidden";
    dom.closeCamera.focus();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
      });
      state.cameraStream = stream;
      dom.cameraVideo.srcObject = stream;
      await dom.cameraVideo.play();
    } catch (error) {
      console.error("相机打开失败:", error);
      closeCamera();
      showToast("无法访问摄像头，请检查浏览器权限或改用文件上传");
    }
  }

  function closeCamera() {
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach((track) => track.stop());
      state.cameraStream = null;
    }
    if (dom.cameraVideo) {
      dom.cameraVideo.srcObject = null;
    }
    if (dom.cameraModal) {
      dom.cameraModal.hidden = true;
    }
    document.body.style.overflow = "";
  }

  function takePhoto() {
    if (!dom.cameraVideo.videoWidth) {
      showToast("相机还没有准备好，请稍候");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = dom.cameraVideo.videoWidth;
    canvas.height = dom.cameraVideo.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(dom.cameraVideo, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) {
        showToast("拍摄失败，请重试");
        return;
      }
      const file = new File([blob], `campus-photo-${Date.now()}.jpg`, { type: "image/jpeg" });
      closeCamera();
      setFile(file, { autoClassify: true });
    }, "image/jpeg", 0.92);
  }

  function showToast(message) {
    if (!dom.toast) return;
    dom.toast.textContent = message;
    dom.toast.classList.add("is-visible");
    if (state.toastTimer) clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => {
      dom.toast.classList.remove("is-visible");
    }, 3000);
  }
})();
