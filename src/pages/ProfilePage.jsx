import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, Mic, Film, Zap, Pencil, KeyRound, Camera, ArrowLeft, Check, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { useT } from '@/context/AppContext';
import { format } from 'date-fns';

const stats = [
  { icon: FolderOpen, labelKey: 'projects', value: 4, color: 'text-primary' },
  { icon: Mic, labelKey: 'audio_gen', value: 12, color: 'text-accent' },
  { icon: Film, labelKey: 'video_gen', value: 3, color: 'text-green-400' },
  { icon: Zap, labelKey: 'credits_used', value: '24,500', color: 'text-yellow-400' },
];

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const t = useT();
  const [editMode, setEditMode] = useState(false);
  const [pwMode, setPwMode] = useState(false);
  const [name, setName] = useState(user?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });

  const handleSaveName = async () => {
    setSaving(true);
    await updateProfile({ full_name: name });
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setEditMode(false);
    }, 1200);
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-10 lg:py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-6 lg:p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-2xl font-heading font-bold text-primary overflow-hidden">
                  {user?.avatar_url ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" /> : initials}
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-secondary border border-border/60 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <Camera className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                {editMode ? (
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 bg-secondary/60 border border-border/50 rounded-lg px-3 py-1.5 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder={t('name')}
                    />
                    <Button size="sm" onClick={handleSaveName} disabled={saving} className="h-8 gap-1">
                      {saved ? <Check className="w-3.5 h-3.5" /> : t('save')}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditMode(false)} className="h-8">
                      {t('cancel')}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="font-heading text-xl font-bold text-foreground">{user?.full_name || 'User'}</h1>
                    <button onClick={() => setEditMode(true)} className="text-muted-foreground hover:text-primary transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <p className="text-sm font-body text-muted-foreground flex items-center gap-1.5 mb-2">
                  <Mail className="w-3.5 h-3.5" />
                  {user?.email}
                </p>
                <p className="text-xs font-body text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {t('member_since')} {user?.created_date ? format(new Date(user.created_date), 'MMM d, yyyy') : '—'}
                </p>
              </div>

              <Button variant="outline" size="sm" onClick={() => setPwMode((o) => !o)} className="gap-2 border-border/50 text-xs flex-shrink-0">
                <KeyRound className="w-3.5 h-3.5" />
                {t('change_password')}
              </Button>
            </div>

            {pwMode && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-6 border-t border-border/40 space-y-3 overflow-hidden">
                {[
                  { key: 'current', placeholder: 'Current password' },
                  { key: 'next', placeholder: 'New password' },
                  { key: 'confirm', placeholder: 'Confirm new password' },
                ].map(({ key, placeholder }) => (
                  <input
                    key={key}
                    type="password"
                    placeholder={placeholder}
                    value={pw[key]}
                    onChange={(e) => setPw((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="w-full bg-secondary/60 border border-border/50 rounded-lg px-4 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                ))}
                <div className="flex gap-2">
                  <Button size="sm">{t('save')}</Button>
                  <Button size="sm" variant="ghost" onClick={() => setPwMode(false)}>
                    {t('cancel')}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map(({ icon: Icon, labelKey, value, color }) => (
              <div key={labelKey} className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 text-center hover:border-primary/30 transition-colors">
                <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
                <p className="font-heading text-xl font-bold text-foreground">{value}</p>
                <p className="text-xs font-body text-muted-foreground mt-1">{t(labelKey)}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
