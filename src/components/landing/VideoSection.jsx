import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Film, Upload, Play, Loader2, Image, Music, MonitorPlay } from 'lucide-react';

const backgrounds = [
  { label: 'Abstract Dark', selected: true },
  { label: 'Gradient Flow', selected: false },
  { label: 'Minimal White', selected: false },
  { label: 'Custom Upload', selected: false },
];

export default function VideoSection() {
  const [rendering, setRendering] = useState(false);
  const [rendered, setRendered] = useState(false);

  const handleRender = () => {
    setRendering(true);
    setTimeout(() => {
      setRendering(false);
      setRendered(true);
    }, 2500);
  };

  return (
    <section id="video" className="relative py-28 lg:py-36">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 lg:mb-20"
        >
          <p className="text-sm font-body font-semibold text-primary uppercase tracking-widest mb-4">
            Video Generation
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-5">
            Bring your audio to life
          </h2>
          <p className="text-lg font-body text-muted-foreground leading-relaxed">
            Combine your generated voiceover with visuals to create stunning, export-ready videos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-6 lg:p-8">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Left - Controls */}
              <div className="space-y-6">
                {/* Audio attachment */}
                <div>
                  <label className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                    Audio Track
                  </label>
                  <div className="rounded-xl bg-secondary/50 border border-border/40 p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <Music className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body font-medium text-foreground truncate">generated_voiceover.mp3</p>
                      <p className="text-xs font-body text-muted-foreground">0:18 — Emma, Natural</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                  </div>
                </div>

                {/* Background visuals */}
                <div>
                  <label className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                    Background Visual
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {backgrounds.map((bg) => (
                      <div
                        key={bg.label}
                        className={`rounded-lg p-3 border cursor-pointer transition-all text-center ${
                          bg.selected
                            ? 'border-primary/60 bg-primary/10'
                            : 'border-border/40 bg-secondary/30 hover:border-border/60'
                        }`}
                      >
                        <p className="text-xs font-body font-medium text-foreground">{bg.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upload images */}
                <div>
                  <label className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                    Custom Images
                  </label>
                  <div className="rounded-xl border-2 border-dashed border-border/50 bg-secondary/20 p-6 text-center hover:border-primary/30 transition-colors cursor-pointer">
                    <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-body text-muted-foreground">
                      Drop images here or click to browse
                    </p>
                    <p className="text-xs font-body text-muted-foreground/60 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </div>

                {/* Render button */}
                <Button
                  onClick={handleRender}
                  disabled={rendering}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body font-semibold h-12 rounded-lg gap-2"
                >
                  {rendering ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Rendering Video...
                    </>
                  ) : (
                    <>
                      <Film className="w-4 h-4" />
                      Render Video
                    </>
                  )}
                </Button>
              </div>

              {/* Right - Preview */}
              <div>
                <label className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                  Preview
                </label>
                <div className="rounded-xl bg-secondary/50 border border-border/40 aspect-video flex items-center justify-center relative overflow-hidden">
                  {rendered ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5 flex flex-col items-center justify-center">
                      <MonitorPlay className="w-10 h-10 text-primary mb-3" />
                      <p className="text-sm font-body font-semibold text-foreground">Video Ready</p>
                      <p className="text-xs font-body text-muted-foreground mt-1">1920 × 1080 · 0:18</p>
                      <button className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-body font-semibold hover:bg-primary/90 transition-colors">
                        <Play className="w-3.5 h-3.5" />
                        Play Preview
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-full bg-secondary border border-border/40 flex items-center justify-center mx-auto mb-3">
                        <Image className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-body text-muted-foreground">
                        Video preview will appear here
                      </p>
                    </div>
                  )}
                </div>

                {rendered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex gap-3"
                  >
                    <button className="flex-1 rounded-lg bg-primary h-10 flex items-center justify-center text-sm font-body font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                      Download MP4
                    </button>
                    <button className="rounded-lg bg-secondary border border-border/40 h-10 px-5 flex items-center justify-center text-sm font-body font-medium text-foreground hover:bg-secondary/80 transition-colors">
                      Share
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}