import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, BarChart2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useT } from '@/context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TOTAL = 100000;
const USED  = 24500;
const PCT   = Math.round((USED / TOTAL) * 100);

const HISTORY = [
  { month: 'Jan', chars: 2100 },
  { month: 'Feb', chars: 3800 },
  { month: 'Mar', chars: 5200 },
  { month: 'Apr', chars: 13400 },
];

export default function CreditsPage() {
  const t = useT();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-10 lg:py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="font-pixel text-[8px] text-primary mb-2 uppercase tracking-widest">ElevenLabs</p>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-8">{t('credits_title')}</h1>

          {/* Main usage card */}
          <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-6 lg:p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-heading font-semibold text-foreground">Character Credits</p>
                <p className="text-xs font-body text-muted-foreground">ElevenLabs Text-to-Speech</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-2xl font-heading font-bold text-foreground">{PCT}%</p>
                <p className="text-xs font-body text-muted-foreground">{t('usage_pct')}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-secondary/60 rounded-full overflow-hidden mb-4">
              <motion.div
                className={`h-full rounded-full ${PCT > 80 ? 'bg-red-500' : PCT > 50 ? 'bg-yellow-400' : 'bg-primary'}`}
                initial={{ width: 0 }}
                animate={{ width: `${PCT}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: t('chars_used'),      value: USED.toLocaleString(),           color: 'text-primary' },
                { label: t('chars_remaining'), value: (TOTAL - USED).toLocaleString(), color: 'text-green-400' },
                { label: 'Total Limit',        value: TOTAL.toLocaleString(),           color: 'text-muted-foreground' },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-xl bg-secondary/40 border border-border/30 p-4 text-center">
                  <p className={`font-heading text-lg font-bold ${color}`}>{value}</p>
                  <p className="text-xs font-body text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Usage history */}
          <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart2 className="w-4 h-4 text-primary" />
              <p className="text-sm font-heading font-semibold text-foreground">Usage History</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={HISTORY} barSize={28}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontFamily: 'var(--font-body)' }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontFamily: 'var(--font-body)', fontSize: 12 }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                  cursor={{ fill: 'hsl(var(--secondary) / 0.4)' }}
                />
                <Bar dataKey="chars" radius={[6, 6, 0, 0]}>
                  {HISTORY.map((_, i) => (
                    <Cell key={i} fill={i === HISTORY.length - 1 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.4)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}