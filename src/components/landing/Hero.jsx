import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import PixelBackground from './PixelBackground';

const PixelCorner = ({ className }) => (
  <div className={`absolute w-5 h-5 pointer-events-none ${className}`}>
    <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/50" />
    <div className="absolute top-0 left-0 w-[2px] h-full bg-primary/50" />
  </div>
);

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <PixelBackground />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full py-16 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2 border border-primary/30 bg-primary/10">
              <span className="font-pixel text-[7px] text-primary leading-none">BETA</span>
              <div className="w-px h-3 bg-primary/30" />
              <span className="text-xs font-body font-medium text-primary/80">Text • Voice • Video</span>
            </div>

            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-foreground">
              Turn text into
              <br />
              <span className="text-primary">voice</span>{' '}
              and <span className="text-accent">video</span>
            </h1>

            <p className="text-lg lg:text-xl font-body text-muted-foreground leading-relaxed max-w-lg">
              Write or paste your text, translate it, generate a professional voiceover with ElevenLabs, add your images, and export a finished video — all in one place.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#audio-editor">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-body font-semibold px-8 h-12 text-base rounded-lg gap-2">
                  Start generating
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <a href="#workflow">
                <Button
                  variant="outline"
                  className="border-border/60 bg-secondary/30 hover:bg-secondary/60 text-foreground font-body font-semibold px-8 h-12 text-base rounded-lg gap-2"
                >
                  <Play className="w-4 h-4" />
                  Try demo
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-6 pt-2">
              {[
                { value: '50+', label: 'AI Voices' },
                { value: 'UA↔EN', label: 'Translation' },
                { value: 'MP4', label: 'Video Export' },
              ].map((stat, i) => (
                <React.Fragment key={stat.label}>
                  {i > 0 && <div className="w-px h-8 bg-border/50" />}
                  <div>
                    <p className="font-pixel text-[10px] text-primary">{stat.value}</p>
                    <p className="text-xs font-body text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 lg:p-7 shadow-2xl shadow-primary/5">
              <PixelCorner className="top-2 left-2" />
              <PixelCorner className="top-2 right-2 rotate-90" />

              <div className="flex items-center gap-2 mb-5">
                <div className="w-2.5 h-2.5 bg-destructive/60" />
                <div className="w-2.5 h-2.5 bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 bg-primary/50" />
                <div className="ml-auto font-pixel text-[7px] text-muted-foreground">VidVoice Studio</div>
              </div>

              <div className="rounded-xl bg-secondary/60 border border-border/40 p-4 mb-4">
                <p className="text-sm font-body text-muted-foreground leading-relaxed">
                  &quot;Ласкаво просимо до VidVoice — перетворіть ваш текст на голос та відео за секунди...&quot;
                </p>
                <div className="mt-3 flex gap-2">
                  <div className="h-6 px-2 bg-primary/20 border border-primary/30 flex items-center">
                    <span className="font-pixel text-[6px] text-primary">UA→EN</span>
                  </div>
                  <div className="h-6 px-2 bg-secondary border border-border/40 flex items-center">
                    <span className="font-pixel text-[6px] text-muted-foreground">EN→UA</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg bg-secondary/40 border border-border/30 p-3">
                  <p className="text-[9px] font-pixel text-muted-foreground mb-1">VOICE</p>
                  <p className="text-sm font-body font-medium text-foreground">Rachel</p>
                </div>
                <div className="rounded-lg bg-secondary/40 border border-border/30 p-3">
                  <p className="text-[9px] font-pixel text-muted-foreground mb-1">LANG</p>
                  <p className="text-sm font-body font-medium text-foreground">English</p>
                </div>
              </div>

              <div className="rounded-xl bg-secondary/40 border border-border/30 p-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-primary flex items-center justify-center flex-shrink-0">
                    <Play className="w-3 h-3 text-primary-foreground ml-0.5" />
                  </div>
                  <div className="flex-1 flex items-end gap-px h-7">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-primary/50"
                        style={{ height: `${Math.sin(i * 0.4) * 40 + 50}%` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-body text-muted-foreground">0:32</span>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 bg-primary h-10 flex items-center justify-center rounded-lg">
                  <span className="text-sm font-body font-semibold text-primary-foreground">Generate Voice</span>
                </div>
                <div className="bg-secondary border border-border/40 h-10 px-4 flex items-center justify-center rounded-lg">
                  <span className="text-sm font-body font-semibold text-foreground">Export</span>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/12 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/8 rounded-full blur-xl pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
