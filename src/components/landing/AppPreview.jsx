import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, Volume2, Settings, Layers, Type } from 'lucide-react';

export default function AppPreview() {
  return (
    <section className="relative py-28 lg:py-36 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 lg:mb-20"
        >
          <p className="text-sm font-body font-semibold text-primary uppercase tracking-widest mb-4">Product Preview</p>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-5">A studio in your browser</h2>
          <p className="text-lg font-body text-muted-foreground leading-relaxed">
            Clean, focused, powerful. Everything you need — nothing you don&apos;t.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm overflow-hidden shadow-2xl shadow-primary/5">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-secondary/30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/50" />
                <div className="w-3 h-3 rounded-full bg-accent/50" />
                <div className="w-3 h-3 rounded-full bg-primary/30" />
              </div>
              <span className="text-xs font-body text-muted-foreground">VidVoice Studio v2.0</span>
              <div className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border/30">
              <div className="p-5 lg:p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Type className="w-4 h-4 text-primary" />
                  <span className="text-xs font-body font-semibold text-foreground uppercase tracking-wider">Script</span>
                </div>
                <div className="rounded-xl bg-secondary/50 border border-border/30 p-4 min-h-[140px]">
                  <p className="text-sm font-body text-muted-foreground leading-relaxed">
                    Introducing VidVoice — the fastest way to turn your ideas into professional audio and video content. Simply write your script, choose a voice, and let AI handle the rest.
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs font-body text-muted-foreground">
                  <span>248 characters</span>
                  <span>~18 sec audio</span>
                </div>
              </div>

              <div className="p-5 lg:p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Volume2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-body font-semibold text-foreground uppercase tracking-wider">Voice</span>
                </div>

                <div className="space-y-3">
                  {['Emma — Natural', 'James — Professional', 'Aria — Warm'].map((voice, i) => (
                    <div
                      key={voice}
                      className={`rounded-lg p-3 border cursor-pointer transition-all ${
                        i === 0 ? 'border-primary/50 bg-primary/10' : 'border-border/30 bg-secondary/30 hover:border-border/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-body font-medium text-foreground">{voice}</span>
                        {i === 0 && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider mb-2">Speed</p>
                    <div className="h-1.5 bg-border/50 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-primary rounded-full" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider mb-2">Pitch</p>
                    <div className="h-1.5 bg-border/50 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-primary rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 lg:p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-primary" />
                  <span className="text-xs font-body font-semibold text-foreground uppercase tracking-wider">Preview</span>
                </div>

                <div className="rounded-xl bg-secondary/60 border border-border/30 aspect-video flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center backdrop-blur-sm">
                    <Play className="w-5 h-5 text-primary ml-0.5" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                      <Pause className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                    <SkipForward className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 h-1 bg-border/50 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-primary rounded-full" />
                  </div>
                  <span className="text-xs font-body text-muted-foreground">0:06 / 0:18</span>
                </div>

                <div className="rounded-lg bg-primary h-10 flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                  <span className="text-sm font-body font-semibold text-primary-foreground">Generate Video</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[60%] h-16 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
