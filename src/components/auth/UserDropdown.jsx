import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, FolderOpen, Zap, Globe, Palette, Settings, LogOut,
  Sun, Moon, Monitor, ChevronRight, Check
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useApp, useT } from '@/context/AppContext';
import { Link } from 'react-router-dom';

const LANGS = [
  { code: 'en', flag: '🇬🇧', labelKey: 'lang_en' },
  { code: 'uk', flag: '🇺🇦', labelKey: 'lang_uk' },
  { code: 'ru', flag: '🇷🇺', labelKey: 'lang_ru' },
];

const THEMES = [
  { value: 'dark',   icon: Moon,    labelKey: 'dark' },
  { value: 'light',  icon: Sun,     labelKey: 'light' },
  { value: 'system', icon: Monitor, labelKey: 'system' },
];

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const { language, setLanguage, theme, setTheme } = useApp();
  const t = useT();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  const menuItems = [
    { icon: User,       labelKey: 'profile',     to: '/profile' },
    { icon: FolderOpen, labelKey: 'my_projects',  to: '/projects' },
    { icon: Zap,        labelKey: 'credits',      to: '/credits' },
  ];

  return (
    <div ref={ref} className="relative">
      {/* Avatar button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative w-9 h-9 rounded-full bg-primary/20 border-2 border-primary/40 hover:border-primary/70 flex items-center justify-center transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
      >
        {user?.avatar_url ? (
          <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="font-heading text-xs font-bold text-primary">{initials}</span>
        )}
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-background rounded-full" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-12 w-72 z-[100] rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* User header */}
            <div className="px-4 py-4 border-b border-border/40 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center overflow-hidden flex-shrink-0">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-heading text-sm font-bold text-primary">{initials}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-heading font-semibold text-foreground truncate">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs font-body text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>

            {/* Main items */}
            <div className="py-2 px-2">
              {menuItems.map(({ icon: Icon, labelKey, to }) => (
                <Link
                  key={labelKey}
                  to={to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-body text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-150 group"
                >
                  <Icon className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors" />
                  <span>{t(labelKey)}</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>

            <div className="mx-3 border-t border-border/30" />

            {/* Language switcher */}
            <div className="py-2 px-2">
              <button
                onClick={() => { setLangOpen(o => !o); setThemeOpen(false); }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-body text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-150 group"
              >
                <Globe className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors" />
                <span>{t('lang_switch')}</span>
                <span className="ml-auto text-xs text-primary font-medium uppercase">{language}</span>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-4 pr-1 pb-1 space-y-0.5">
                      {LANGS.map(({ code, flag, labelKey }) => (
                        <button
                          key={code}
                          onClick={() => { setLanguage(code); setLangOpen(false); }}
                          className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-body transition-colors ${
                            language === code ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                          }`}
                        >
                          <span>{flag}</span>
                          <span>{t(labelKey)}</span>
                          {language === code && <Check className="w-3 h-3 ml-auto" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Theme switcher */}
              <button
                onClick={() => { setThemeOpen(o => !o); setLangOpen(false); }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-body text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-150 group"
              >
                <Palette className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors" />
                <span>{t('theme')}</span>
                <span className="ml-auto text-xs text-primary font-medium capitalize">{t(theme)}</span>
              </button>
              <AnimatePresence>
                {themeOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-4 pr-1 pb-1 space-y-0.5">
                      {THEMES.map(({ value, icon: Icon, labelKey }) => (
                        <button
                          key={value}
                          onClick={() => { setTheme(value); setThemeOpen(false); }}
                          className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-body transition-colors ${
                            theme === value ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{t(labelKey)}</span>
                          {theme === value && <Check className="w-3 h-3 ml-auto" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Settings */}
              <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-body text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-150 group"
              >
                <Settings className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors" />
                <span>{t('settings')}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>

            <div className="mx-3 border-t border-border/30" />

            {/* Logout */}
            <div className="py-2 px-2">
              <button
                onClick={() => { setOpen(false); logout(); }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-body text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all duration-150 group"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('logout')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}