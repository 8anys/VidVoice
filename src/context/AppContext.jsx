import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('vv_lang') || 'en');
  const [theme, setTheme] = useState(() => localStorage.getItem('vv_theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('vv_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('vv_theme', theme);
    const root = document.documentElement;
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  return (
    <AppContext.Provider value={{ language, setLanguage, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

// ─── i18n translations ────────────────────────────────────────────────────────
const translations = {
  en: {
    nav_home: 'Home', nav_audio: 'Audio', nav_video: 'Video', nav_about: 'About',
    login: 'Login', register: 'Register', start: 'Start',
    profile: 'Profile', my_projects: 'My Projects', credits: 'Credits / Usage',
    settings: 'Settings', logout: 'Logout', theme: 'Theme',
    lang_switch: 'Language',
    dark: 'Dark', light: 'Light', system: 'System',
    lang_en: 'English', lang_uk: 'Ukrainian', lang_ru: 'Russian',
    // Profile page
    profile_title: 'Profile', edit_profile: 'Edit Profile', change_password: 'Change Password',
    member_since: 'Member since', projects: 'Projects', audio_gen: 'Audio Generated', video_gen: 'Videos Generated',
    credits_used: 'Credits Used', name: 'Name', email: 'Email', save: 'Save', cancel: 'Cancel',
    // Projects page
    projects_title: 'My Projects', search_projects: 'Search projects…', new_project: 'New Project',
    sort_by: 'Sort by', filter: 'Filter', open: 'Open', status: 'Status', language: 'Language',
    scenes: 'Scenes', created: 'Created', updated: 'Updated',
    // Credits
    credits_title: 'Credits & Usage', chars_used: 'Characters Used', chars_remaining: 'Remaining', usage_pct: 'Usage',
    // Settings
    settings_title: 'Settings', default_lang: 'Default Language', preferred_voice: 'Preferred Voice',
    gen_quality: 'Generation Quality', export_format: 'Export Format', auto_save: 'Auto-save', auto_translate: 'Auto-translate',
  },
  uk: {
    nav_home: 'Головна', nav_audio: 'Аудіо', nav_video: 'Відео', nav_about: 'Про нас',
    login: 'Увійти', register: 'Реєстрація', start: 'Почати',
    profile: 'Профіль', my_projects: 'Мої проєкти', credits: 'Кредити / Використання',
    settings: 'Налаштування', logout: 'Вийти', theme: 'Тема',
    lang_switch: 'Мова',
    dark: 'Темна', light: 'Світла', system: 'Системна',
    lang_en: 'Англійська', lang_uk: 'Українська', lang_ru: 'Російська',
    profile_title: 'Профіль', edit_profile: 'Редагувати профіль', change_password: 'Змінити пароль',
    member_since: 'Учасник з', projects: 'Проєкти', audio_gen: 'Аудіо створено', video_gen: 'Відео створено',
    credits_used: 'Кредити використано', name: 'Ім\'я', email: 'Пошта', save: 'Зберегти', cancel: 'Скасувати',
    projects_title: 'Мої проєкти', search_projects: 'Пошук проєктів…', new_project: 'Новий проєкт',
    sort_by: 'Сортувати', filter: 'Фільтр', open: 'Відкрити', status: 'Статус', language: 'Мова',
    scenes: 'Сцени', created: 'Створено', updated: 'Оновлено',
    credits_title: 'Кредити та використання', chars_used: 'Символів використано', chars_remaining: 'Залишилось', usage_pct: 'Використання',
    settings_title: 'Налаштування', default_lang: 'Мова за замовчуванням', preferred_voice: 'Бажаний голос',
    gen_quality: 'Якість генерації', export_format: 'Формат експорту', auto_save: 'Авто-збереження', auto_translate: 'Авто-переклад',
  },
  ru: {
    nav_home: 'Главная', nav_audio: 'Аудио', nav_video: 'Видео', nav_about: 'О нас',
    login: 'Войти', register: 'Регистрация', start: 'Начать',
    profile: 'Профиль', my_projects: 'Мои проекты', credits: 'Кредиты / Использование',
    settings: 'Настройки', logout: 'Выйти', theme: 'Тема',
    lang_switch: 'Язык',
    dark: 'Тёмная', light: 'Светлая', system: 'Системная',
    lang_en: 'Английский', lang_uk: 'Украинский', lang_ru: 'Русский',
    profile_title: 'Профиль', edit_profile: 'Редактировать профиль', change_password: 'Сменить пароль',
    member_since: 'Участник с', projects: 'Проекты', audio_gen: 'Аудио создано', video_gen: 'Видео создано',
    credits_used: 'Кредиты использованы', name: 'Имя', email: 'Почта', save: 'Сохранить', cancel: 'Отмена',
    projects_title: 'Мои проекты', search_projects: 'Поиск проектов…', new_project: 'Новый проект',
    sort_by: 'Сортировать', filter: 'Фильтр', open: 'Открыть', status: 'Статус', language: 'Язык',
    scenes: 'Сцены', created: 'Создан', updated: 'Обновлён',
    credits_title: 'Кредиты и использование', chars_used: 'Символов использовано', chars_remaining: 'Осталось', usage_pct: 'Использование',
    settings_title: 'Настройки', default_lang: 'Язык по умолчанию', preferred_voice: 'Предпочтительный голос',
    gen_quality: 'Качество генерации', export_format: 'Формат экспорта', auto_save: 'Авто-сохранение', auto_translate: 'Авто-перевод',
  },
};

export const useT = () => {
  const { language } = useApp();
  return (key) => translations[language]?.[key] ?? translations.en[key] ?? key;
};