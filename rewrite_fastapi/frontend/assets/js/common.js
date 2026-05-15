const LANGUAGE_STORAGE_KEY = "vidvoice_language";
const THEME_STORAGE_KEY = "vidvoice_theme";
let languageToggleInitialized = false;
let themeToggleInitialized = false;

const dictionaries = {
  en: {
    "common.back": "← Back",
    "common.save": "Save",
    "common.reset": "Reset",
    "common.open": "Open",
    "common.language": "Language",
    "common.theme": "Theme",
    "common.dark": "Dark",
    "common.profile": "Profile",
    "common.projects": "My Projects",
    "common.credits": "Credits / Usage",
    "common.settings": "Settings",
    "common.logout": "Log out",
    "common.start": "Start",
    "common.langToggle": "EN",
    "common.langToggleLabel": "Switch language",
    "nav.home": "Home",
    "nav.audio": "Audio",
    "nav.images": "Images",
    "nav.video": "Video",
    "hero.badge": "Text • Voice • Video",
    "hero.title": "Turn text into<br><span style=\"color:var(--primary)\">voice</span> and <span style=\"color:var(--accent)\">video</span>",
    "hero.copy": "Write or paste your text, translate it, generate a professional voiceover with ElevenLabs, add your images, and export a finished video — all in one place.",
    "hero.start": "Start generating",
    "hero.aiVoices": "AI Voices",
    "hero.translation": "Translation",
    "hero.videoExport": "Video Export",
    "preview.text": "\"Welcome to VidVoice — turn your text into voice and video in seconds...\"",
    "preview.voice": "VOICE",
    "preview.lang": "LANG",
    "preview.english": "English",
    "features.eyebrow": "What you can do",
    "features.title": "Everything in one workflow",
    "features.copy": "From raw text to a finished video — translate, voice, and compose without leaving the page.",
    "features.writeTitle": "Write text",
    "features.writeCopy": "Enter or paste any text. Works with both Ukrainian and English content.",
    "features.translateTitle": "Translate UA ↔ EN",
    "features.translateCopy": "Instantly translate between Ukrainian and English with one click.",
    "features.voiceTitle": "Generate voice",
    "features.voiceCopy": "Create studio-quality voiceovers powered by ElevenLabs text-to-speech.",
    "features.imagesTitle": "Upload images",
    "features.imagesCopy": "Drag and drop your images. Reorder them to match your story.",
    "features.videoTitle": "Compose video",
    "features.videoCopy": "Combine your audio and images into a clean, export-ready video.",
    "features.downloadTitle": "Download result",
    "features.downloadCopy": "Export your audio and video files in standard formats, ready to share.",
    "audio.step": "Step 1 – 2",
    "audio.title": "Write & Translate",
    "audio.copy": "Enter your text, optionally translate it, then choose a voice and generate.",
    "audio.yourText": "Your text",
    "audio.liveEditor": "Live editor",
    "audio.uploadText": "File",
    "audio.placeholder": "Enter your text here — in Ukrainian or English...",
    "audio.translate": "Translate",
    "audio.toEnglish": "Translate to English",
    "audio.toUkrainian": "Translate to Ukrainian",
    "audio.voice": "Voice (ElevenLabs)",
    "audio.generate": "Generate Voice",
    "audio.play": "Play",
    "audio.regenerate": "Regenerate",
    "audio.download": "Download Audio",
    "audio.ready": "Audio ready",
    "audio.orUpload": "or upload ready audio",
    "audio.drop": "Drop audio here or click to browse",
    "audio.formats": "MP3, WAV, M4A — multiple files supported",
    "audio.use": "Use",
    "audio.downloadShort": "Download",
    "audio.selectedVoice": "Selected voice",
    "audio.voiceSettings": "Voice settings",
    "audio.voiceSettingsCopy": "Fine tune the delivery before generation.",
    "audio.model": "Model",
    "audio.stability": "Stability",
    "audio.similarity": "Similarity",
    "audio.style": "Style",
    "audio.speed": "Speed",
    "audio.speakerBoost": "Speaker boost",
    "audio.generating": "Generating...",
    "images.step": "Step 3 – Images",
    "images.title": "Upload Images",
    "images.copy": "Upload images that will be combined with your audio into a video. Reorder as needed.",
    "images.drop": "Drop images here or click to browse",
    "images.formats": "PNG, JPG, WEBP — multiple files supported",
    "video.step": "Step 4 – Video",
    "video.title": "Compose Video",
    "video.copy": "Your images and generated audio will be combined into a single MP4 file.",
    "video.how": "How it works:",
    "video.howCopy": " A script combines your audio and images into a video — each image is displayed for an equal time slice. This is a simple composition, not AI generation.",
    "video.requirements": "Requirements:",
    "video.reqAudio": "Audio generated",
    "video.reqImages": "Images uploaded",
    "video.create": "Create Video",
    "video.ready": "Video Ready",
    "video.export": "{slides} slides • {format} export",
    "video.download": "Download MP4",
    "video.aspect": "Aspect ratio",
    "video.fit": "Image fit",
    "video.fitCover": "Fill frame",
    "video.fitContain": "Keep full image",
    "video.creating": "Creating video...",
    "workflow.eyebrow": "How it works",
    "workflow.title": "Six steps to finished content",
    "workflow.copy": "A clear, linear workflow from first word to final video file.",
    "workflow.writeCopy": "Enter your script in Ukrainian or English",
    "workflow.translateTitle": "Translate",
    "workflow.translateCopy": "Optional — switch language with one click",
    "workflow.voiceCopy": "ElevenLabs converts your text to audio",
    "workflow.imagesCopy": "Add and order the images for your video",
    "workflow.createTitle": "Create video",
    "workflow.createCopy": "Script composes audio + images into MP4",
    "workflow.downloadTitle": "Download",
    "workflow.downloadCopy": "Export audio and video to your device",
    "cta.ready": "Ready to start?",
    "cta.title": "Create your first video today",
    "cta.copy": "Write, translate, voice, compose — everything you need in one page.",
    "cta.button": "Start now",
    "footer.copy": "Text to voice to video. Translate, generate, compose — all in one page. Powered by ElevenLabs.",
    "footer.powered": "ELEVENLABS POWERED",
    "footer.product": "Product",
    "footer.project": "Project",
    "footer.features": "Features",
    "footer.workflow": "Workflow",
    "footer.made": "MADE WITH ELEVENLABS + FASTAPI",
    "footer.copyright": "VidVoice. Diploma Project.",
    "projects.account": "Account",
    "projects.title": "My Projects",
    "projects.search": "Search projects…",
    "projects.new": "+ New Project",
    "projects.scenes": "{count} scenes",
    "projects.created": "Created: {date}",
    "projects.updated": "Updated: {date}",
    "projects.newName": "New Project",
    "status.completed": "completed",
    "status.in_progress": "in progress",
    "status.draft": "draft",
    "profile.memberSince": "Member since",
    "profile.changePassword": "Change Password",
    "profile.name": "Name",
    "profile.projects": "Projects",
    "profile.audioGenerated": "Audio Generated",
    "profile.videosGenerated": "Videos Generated",
    "profile.creditsUsed": "Credits Used",
    "settings.app": "App",
    "settings.title": "Settings",
    "settings.defaultLanguage": "Default Language",
    "settings.english": "English",
    "settings.ukrainian": "Ukrainian",
    "settings.autoTranslate": "Auto-translate",
    "settings.preferredVoice": "Preferred Voice",
    "settings.videoExport": "Video & Export",
    "settings.autoSave": "Auto-save",
    "credits.title": "Credits & Usage",
    "credits.characterCredits": "Character Credits",
    "credits.provider": "ElevenLabs Text-to-Speech",
    "credits.usage": "Usage",
    "credits.used": "Characters Used",
    "credits.remaining": "Remaining",
    "credits.total": "Total Limit",
    "credits.history": "Usage History",
  },
  uk: {
    "common.back": "← Назад",
    "common.save": "Зберегти",
    "common.reset": "Скинути",
    "common.open": "Відкрити",
    "common.language": "Мова",
    "common.theme": "Тема",
    "common.dark": "Темна",
    "common.profile": "Профіль",
    "common.projects": "Мої проєкти",
    "common.credits": "Кредити / Використання",
    "common.settings": "Налаштування",
    "common.logout": "Вийти",
    "common.start": "Старт",
    "common.langToggle": "UA",
    "common.langToggleLabel": "Змінити мову",
    "nav.home": "Головна",
    "nav.audio": "Аудіо",
    "nav.images": "Зображення",
    "nav.video": "Відео",
    "hero.badge": "Текст • Голос • Відео",
    "hero.title": "Перетворюй текст на<br><span style=\"color:var(--primary)\">голос</span> і <span style=\"color:var(--accent)\">відео</span>",
    "hero.copy": "Напиши або встав текст, переклади його, створи професійну озвучку через ElevenLabs, додай зображення та експортуй готове відео — все в одному місці.",
    "hero.start": "Почати генерацію",
    "hero.aiVoices": "AI голоси",
    "hero.translation": "Переклад",
    "hero.videoExport": "Експорт відео",
    "preview.text": "\"Ласкаво просимо до VidVoice — перетворіть ваш текст на голос та відео за секунди...\"",
    "preview.voice": "ГОЛОС",
    "preview.lang": "МОВА",
    "preview.english": "Англійська",
    "features.eyebrow": "Що можна робити",
    "features.title": "Увесь процес в одному місці",
    "features.copy": "Від сирого тексту до готового відео — перекладай, озвучуй і збирай ролик, не виходячи зі сторінки.",
    "features.writeTitle": "Написати текст",
    "features.writeCopy": "Введи або встав будь-який текст. Підтримується український та англійський контент.",
    "features.translateTitle": "Переклад UA ↔ EN",
    "features.translateCopy": "Миттєво перекладай між українською та англійською одним кліком.",
    "features.voiceTitle": "Згенерувати голос",
    "features.voiceCopy": "Створюй студійну озвучку за допомогою ElevenLabs text-to-speech.",
    "features.imagesTitle": "Завантажити зображення",
    "features.imagesCopy": "Перетягни зображення та впорядкуй їх під свою історію.",
    "features.videoTitle": "Зібрати відео",
    "features.videoCopy": "Об'єднай аудіо й зображення в чисте відео, готове до експорту.",
    "features.downloadTitle": "Завантажити результат",
    "features.downloadCopy": "Експортуй аудіо та відео у стандартних форматах.",
    "audio.step": "Крок 1 – 2",
    "audio.title": "Текст і переклад",
    "audio.copy": "Введи текст, за потреби переклади його, потім обери голос і згенеруй озвучку.",
    "audio.yourText": "Твій текст",
    "audio.liveEditor": "Живий редактор",
    "audio.uploadText": "Файл",
    "audio.placeholder": "Введи текст тут — українською або англійською...",
    "audio.translate": "Переклад",
    "audio.toEnglish": "Перекласти англійською",
    "audio.toUkrainian": "Перекласти українською",
    "audio.voice": "Голос (ElevenLabs)",
    "audio.generate": "Згенерувати голос",
    "audio.play": "Відтворити",
    "audio.regenerate": "Перегенерувати",
    "audio.download": "Завантажити аудіо",
    "audio.ready": "Аудіо готове",
    "audio.orUpload": "або завантаж готове аудіо",
    "audio.drop": "Перетягни аудіо сюди або натисни для вибору",
    "audio.formats": "MP3, WAV, M4A — можна кілька файлів",
    "audio.use": "Використати",
    "audio.downloadShort": "Скачати",
    "audio.selectedVoice": "Обраний голос",
    "audio.voiceSettings": "Налаштування голосу",
    "audio.voiceSettingsCopy": "Точно налаштуй подачу перед генерацією.",
    "audio.model": "Модель",
    "audio.stability": "Стабільність",
    "audio.similarity": "Схожість",
    "audio.style": "Стиль",
    "audio.speed": "Швидкість",
    "audio.speakerBoost": "Підсилення голосу",
    "audio.generating": "Генеруємо...",
    "images.step": "Крок 3 – Зображення",
    "images.title": "Завантаження зображень",
    "images.copy": "Завантаж зображення, які будуть об'єднані з аудіо у відео. Порядок можна змінювати.",
    "images.drop": "Перетягни зображення сюди або натисни для вибору",
    "images.formats": "PNG, JPG, WEBP — можна кілька файлів",
    "video.step": "Крок 4 – Відео",
    "video.title": "Зібрати відео",
    "video.copy": "Твої зображення та згенероване аудіо будуть об'єднані в один MP4 файл.",
    "video.how": "Як це працює:",
    "video.howCopy": " Скрипт поєднує аудіо та зображення у відео — кожне зображення показується однаковий проміжок часу. Це проста композиція, не AI-генерація.",
    "video.requirements": "Вимоги:",
    "video.reqAudio": "Аудіо згенеровано",
    "video.reqImages": "Зображення завантажено",
    "video.create": "Створити відео",
    "video.ready": "Відео готове",
    "video.export": "{slides} слайдів • експорт {format}",
    "video.download": "Завантажити MP4",
    "video.aspect": "Формат кадру",
    "video.fit": "Поведінка зображень",
    "video.fitCover": "Заповнити кадр",
    "video.fitContain": "Показати повністю",
    "video.creating": "Створюємо відео...",
    "workflow.eyebrow": "Як це працює",
    "workflow.title": "Шість кроків до готового контенту",
    "workflow.copy": "Зрозумілий лінійний процес від першого слова до фінального відеофайлу.",
    "workflow.writeCopy": "Введи сценарій українською або англійською",
    "workflow.translateTitle": "Переклад",
    "workflow.translateCopy": "За бажанням — зміни мову одним кліком",
    "workflow.voiceCopy": "ElevenLabs перетворює текст на аудіо",
    "workflow.imagesCopy": "Додай і впорядкуй зображення для відео",
    "workflow.createTitle": "Створити відео",
    "workflow.createCopy": "Скрипт поєднує аудіо + зображення в MP4",
    "workflow.downloadTitle": "Завантажити",
    "workflow.downloadCopy": "Експортуй аудіо та відео на свій пристрій",
    "cta.ready": "Готовий почати?",
    "cta.title": "Створи перше відео сьогодні",
    "cta.copy": "Текст, переклад, голос, відео — все необхідне на одній сторінці.",
    "cta.button": "Почати зараз",
    "footer.copy": "Від тексту до голосу й відео. Перекладай, генеруй, збирай — все на одній сторінці. Працює з ElevenLabs.",
    "footer.powered": "НА БАЗІ ELEVENLABS",
    "footer.product": "Продукт",
    "footer.project": "Проєкт",
    "footer.features": "Функції",
    "footer.workflow": "Процес",
    "footer.made": "ЗРОБЛЕНО З ELEVENLABS + FASTAPI",
    "footer.copyright": "VidVoice. Дипломний проєкт.",
    "projects.account": "Акаунт",
    "projects.title": "Мої проєкти",
    "projects.search": "Пошук проєктів…",
    "projects.new": "+ Новий проєкт",
    "projects.scenes": "{count} сцен",
    "projects.created": "Створено: {date}",
    "projects.updated": "Оновлено: {date}",
    "projects.newName": "Новий проєкт",
    "status.completed": "завершено",
    "status.in_progress": "в роботі",
    "status.draft": "чернетка",
    "profile.memberSince": "Учасник з",
    "profile.changePassword": "Змінити пароль",
    "profile.name": "Ім'я",
    "profile.projects": "Проєкти",
    "profile.audioGenerated": "Згенеровано аудіо",
    "profile.videosGenerated": "Згенеровано відео",
    "profile.creditsUsed": "Використано кредитів",
    "settings.app": "Застосунок",
    "settings.title": "Налаштування",
    "settings.defaultLanguage": "Мова за замовчуванням",
    "settings.english": "Англійська",
    "settings.ukrainian": "Українська",
    "settings.autoTranslate": "Автопереклад",
    "settings.preferredVoice": "Бажаний голос",
    "settings.videoExport": "Відео та експорт",
    "settings.autoSave": "Автозбереження",
    "credits.title": "Кредити та використання",
    "credits.characterCredits": "Кредити символів",
    "credits.provider": "ElevenLabs Text-to-Speech",
    "credits.usage": "Використання",
    "credits.used": "Використано символів",
    "credits.remaining": "Залишилось",
    "credits.total": "Загальний ліміт",
    "credits.history": "Історія використання",
  },
};

export function getCurrentLanguage() {
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return saved === "uk" ? "uk" : "en";
}

export function setCurrentLanguage(language) {
  const nextLanguage = language === "uk" ? "uk" : "en";
  localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  applyTranslations();
  document.dispatchEvent(new CustomEvent("vidvoice:languagechange", { detail: { language: nextLanguage } }));
}

export function t(key, fallback = "") {
  const language = getCurrentLanguage();
  return dictionaries[language]?.[key] || dictionaries.en[key] || fallback || key;
}

export function formatTranslation(key, values = {}, fallback = "") {
  return t(key, fallback).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
}

export function applyTranslations(root = document) {
  const language = getCurrentLanguage();
  document.documentElement.lang = language === "uk" ? "uk" : "en";

  root.querySelectorAll("[data-i18n]").forEach((element) => {
    element.innerHTML = t(element.dataset.i18n, element.innerHTML);
  });

  root.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder, element.getAttribute("placeholder") || ""));
  });

  root.querySelectorAll("[data-i18n-title]").forEach((element) => {
    element.setAttribute("title", t(element.dataset.i18nTitle, element.getAttribute("title") || ""));
  });

  root.querySelectorAll("[data-language-badge]").forEach((element) => {
    element.textContent = language === "uk" ? "UA" : "EN";
  });

  root.querySelectorAll("[data-language-toggle-label]").forEach((element) => {
    element.textContent = t("common.langToggle");
    element.setAttribute("aria-label", t("common.langToggleLabel"));
    element.setAttribute("title", t("common.langToggleLabel"));
    element.classList.toggle("is-uk", language === "uk");
  });
}

export function getCurrentTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
}

export function setCurrentTheme(theme) {
  const nextTheme = theme === "light" ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme();
}

export function applyTheme() {
  const theme = getCurrentTheme();
  document.documentElement.dataset.theme = theme;

  document.querySelectorAll("[data-theme-toggle]").forEach((element) => {
    const isLight = theme === "light";
    element.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    element.setAttribute("title", isLight ? "Switch to dark theme" : "Switch to light theme");
    element.classList.toggle("is-light", isLight);
  });
}

function ensureLanguageToggle() {
  if (!languageToggleInitialized) {
    document.addEventListener("click", (event) => {
      const toggle = event.target.closest("[data-language-toggle-label]");
      if (!toggle) return;
      event.preventDefault();
      setCurrentLanguage(getCurrentLanguage() === "uk" ? "en" : "uk");
    });
    languageToggleInitialized = true;
  }

  const existingButton = document.getElementById("site-language-toggle");
  if (existingButton) return;

  const button = document.createElement("button");
  button.id = "site-language-toggle";
  button.type = "button";
  button.className = "language-toggle";
  button.dataset.languageToggleLabel = "true";

  document.body.appendChild(button);
}

function ensureThemeToggle() {
  if (!themeToggleInitialized) {
    document.addEventListener("click", (event) => {
      const toggle = event.target.closest("[data-theme-toggle]");
      if (!toggle) return;
      event.preventDefault();
      setCurrentTheme(getCurrentTheme() === "light" ? "dark" : "light");
    });
    themeToggleInitialized = true;
  }

  if (document.getElementById("site-theme-toggle")) return;

  const button = document.createElement("button");
  button.id = "site-theme-toggle";
  button.type = "button";
  button.className = "nav-theme-toggle theme-toggle-floating";
  button.dataset.themeToggle = "true";
  button.setAttribute("aria-label", "Toggle theme");
  button.setAttribute("title", "Toggle theme");

  const icon = document.createElement("span");
  icon.className = "theme-icon";
  icon.setAttribute("aria-hidden", "true");
  button.appendChild(icon);

  document.body.appendChild(button);
}

export function initI18n({ onChange } = {}) {
  ensureLanguageToggle();
  ensureThemeToggle();
  applyTheme();
  applyTranslations();

  if (onChange) {
    document.addEventListener("vidvoice:languagechange", (event) => {
      onChange(event.detail.language);
    });
  }
}

export function setYear() {
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
}

export function toggleHidden(element, hidden) {
  if (!element) return;
  element.classList.toggle("hidden", hidden);
}

export function createWaveMarkup(progress = 32) {
  return Array.from({ length: 60 })
    .map((_, index) => {
      const active = (index / 60) * 100 < progress ? "active" : "";
      const height = Math.sin(index * 0.35) * 45 + 50;
      return `<span class="${active}" style="height:${height}%"></span>`;
    })
    .join("");
}

