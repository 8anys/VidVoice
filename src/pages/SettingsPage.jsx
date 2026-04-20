import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Mic, Sliders, Film, Download, Save, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useT, useApp } from '@/context/AppContext';

const Section = ({ icon: Icon, title, children }) => (
  <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 mb-4">
    <div className="flex items-center gap-2 mb-5">
      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <h2 className="font-heading text-base font-semibold text-foreground">{title}</h2>
    </div>
    {children}
  </div>
);

const Row = ({ label, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-border/30 last:border-0">
    <span className="text-sm font-body text-muted-foreground">{label}</span>
    <div className="sm:min-w-[180px]">{children}</div>
  </div>
);

const StyledSelect = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    className="w-full px-3 py-2 bg-secondary/60 border border-border/40 rounded-lg text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
  >
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 ${checked ? 'bg-primary' : 'bg-secondary'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

export default function SettingsPage() {
  const t = useT();
  const { language, setLanguage } = useApp();
  const [settings, setSettings] = useState({
    voice: 'rachel',
    quality: 'high',
    exportFormat: 'mp4',
    autoSave: true,
    autoTranslate: false,
  });

  const set = (k, v) => setSettings(s => ({ ...s, [k]: v }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 py-10 lg:py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="font-pixel text-[8px] text-primary mb-2 uppercase tracking-widest">App</p>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-8">{t('settings_title')}</h1>

          <Section icon={Globe} title={t('default_lang')}>
            <Row label={t('default_lang')}>
              <StyledSelect value={language} onChange={setLanguage} options={[
                { value: 'en', label: 'English' },
                { value: 'uk', label: 'Українська' },
                { value: 'ru', label: 'Русский' },
              ]} />
            </Row>
            <Row label={t('auto_translate')}>
              <div className="flex justify-end"><Toggle checked={settings.autoTranslate} onChange={v => set('autoTranslate', v)} /></div>
            </Row>
          </Section>

          <Section icon={Mic} title={t('preferred_voice')}>
            <Row label={t('preferred_voice')}>
              <StyledSelect value={settings.voice} onChange={v => set('voice', v)} options={[
                { value: 'rachel', label: 'Rachel — Calm & Clear' },
                { value: 'clyde',  label: 'Clyde — Strong & Warm' },
                { value: 'bella',  label: 'Bella — Soft & Natural' },
                { value: 'josh',   label: 'Josh — Deep & Steady' },
              ]} />
            </Row>
            <Row label={t('gen_quality')}>
              <StyledSelect value={settings.quality} onChange={v => set('quality', v)} options={[
                { value: 'high',   label: 'High (slower)' },
                { value: 'medium', label: 'Medium' },
                { value: 'low',    label: 'Low (fastest)' },
              ]} />
            </Row>
          </Section>

          <Section icon={Film} title="Video & Export">
            <Row label={t('export_format')}>
              <StyledSelect value={settings.exportFormat} onChange={v => set('exportFormat', v)} options={[
                { value: 'mp4',  label: 'MP4 (H.264)' },
                { value: 'webm', label: 'WebM (VP9)' },
                { value: 'mov',  label: 'MOV (ProRes)' },
              ]} />
            </Row>
            <Row label={t('auto_save')}>
              <div className="flex justify-end"><Toggle checked={settings.autoSave} onChange={v => set('autoSave', v)} /></div>
            </Row>
          </Section>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" className="gap-2 border-border/50"><RefreshCw className="w-4 h-4" />Reset</Button>
            <Button className="bg-primary hover:bg-primary/90 gap-2"><Save className="w-4 h-4" />{t('save')}</Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}