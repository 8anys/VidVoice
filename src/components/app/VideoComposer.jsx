import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Film, Download, Play, Loader2, Info, CheckCircle2 } from 'lucide-react';

const PixelLabel = ({ children }) => (
  <span className="font-pixel text-[8px] text-primary uppercase tracking-wider">{children}</span>
);

export default function VideoComposer({ hasAudio, images }) {
  const [composing, setComposing] = useState(false);
  const [done, setDone] = useState(false);
  const [preview, setPreview] = useState(false);

  const canCompose = hasAudio && images.length > 0;

  const handleCompose = () => {
    if (!canCompose) return;
    setComposing(true);
    setDone(false);
    setTimeout(() => {
      setComposing(false);
      setDone(true);
    }, 2800);
  };

  return (
    <section id="video" className="relative py-20 lg:py-28">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <PixelLabel>Step 5 - Video</PixelLabel>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground tracking-tight mt-3 mb-2">Compose Video</h2>
          <p className="text-base font-body text-muted-foreground">
            Your images and generated audio will be combined into a single MP4 file.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-6 lg:p-8"
        >
          <div className="flex gap-3 mb-6 rounded-xl bg-secondary/50 border border-border/30 p-4">
            <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm font-body text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">How it works:</span> A script combines your audio and images into a video — each image is displayed for an equal time slice. This is a simple composition, not AI generation.
            </p>
          </div>

          <div className="mb-6 space-y-2">
            <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-3">Requirements</p>
            {[
              { label: 'Audio generated', met: hasAudio },
              { label: `Images uploaded (${images.length})`, met: images.length > 0 },
            ].map((req) => (
              <div key={req.label} className="flex items-center gap-2.5">
                <div className={`w-4 h-4 flex items-center justify-center ${req.met ? 'text-green-400' : 'text-muted-foreground/40'}`}>
                  {req.met ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-3 h-3 border border-current rounded-full" />}
                </div>
                <span className={`text-sm font-body ${req.met ? 'text-foreground' : 'text-muted-foreground'}`}>{req.label}</span>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Button
                onClick={handleCompose}
                disabled={composing || !canCompose}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-40 text-primary-foreground font-body font-semibold h-12 rounded-xl gap-2"
              >
                {composing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Composing...
                  </>
                ) : (
                  <>
                    <Film className="w-4 h-4" />
                    Create Video
                  </>
                )}
              </Button>

              {done && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <Button className="w-full bg-secondary hover:bg-secondary/80 border border-border/50 text-foreground font-body font-semibold h-12 rounded-xl gap-2">
                    <Download className="w-4 h-4" />
                    Download MP4
                  </Button>
                </motion.div>
              )}
            </div>

            <div className="rounded-xl bg-secondary/50 border border-border/30 aspect-video flex items-center justify-center relative overflow-hidden">
              {composing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="font-pixel text-[8px] text-primary">COMPOSING...</p>
                  <div className="w-32 h-1 bg-border/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '90%' }}
                      transition={{ duration: 2.4, ease: 'easeInOut' }}
                    />
                  </div>
                </div>
              )}

              {done && !composing && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5 flex flex-col items-center justify-center"
                  >
                    <Film className="w-9 h-9 text-primary mb-2" />
                    <p className="font-heading text-sm font-semibold text-foreground">Video Ready</p>
                    <p className="text-xs font-body text-muted-foreground mt-1">{images.length} slides • audio included</p>
                    <button
                      onClick={() => setPreview(!preview)}
                      className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-body font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      Play Preview
                    </button>
                  </motion.div>
                </AnimatePresence>
              )}

              {!composing && !done && (
                <div className="text-center opacity-50">
                  <Film className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-body text-muted-foreground">Preview will appear here</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
