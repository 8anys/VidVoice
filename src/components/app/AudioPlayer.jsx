import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Pause, Download, RefreshCw, Volume2 } from 'lucide-react';

const PixelLabel = ({ children }) => (
  <span className="font-pixel text-[8px] text-primary uppercase tracking-wider">{children}</span>
);

export default function AudioPlayer({ generated, voiceMeta, onRegenerate }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(32); // mock %

  if (!generated) return null;

  return (
    <AnimatePresence>
      <motion.section
        id="audio-player"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative py-10"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="mb-6">
            <PixelLabel>Step 3 – Audio result</PixelLabel>
            <h2 className="font-heading text-2xl lg:text-3xl font-bold text-foreground tracking-tight mt-3">
              Generated Audio
            </h2>
          </div>

          <div className="rounded-2xl border border-primary/25 bg-card/70 backdrop-blur-sm p-6 lg:p-8">
            {/* Voice info */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-primary/15 border border-primary/25 flex items-center justify-center rounded-lg">
                <Volume2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-body font-semibold text-foreground">
                  {voiceMeta?.voice?.label || 'Rachel'} — ElevenLabs
                </p>
                <p className="text-xs font-body text-muted-foreground truncate max-w-xs">
                  "{voiceMeta?.text?.slice(0, 60) || 'Your generated voiceover'}..."
                </p>
              </div>
              <div className="ml-auto">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Waveform + controls */}
            <div className="rounded-xl bg-secondary/50 border border-border/30 p-4 mb-5">
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => setPlaying(!playing)}
                  className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg hover:bg-primary/90 transition-colors flex-shrink-0"
                >
                  {playing
                    ? <Pause className="w-4 h-4 text-primary-foreground" />
                    : <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                  }
                </button>
                <div className="flex-1 flex items-end gap-px h-10">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 transition-colors ${
                        (i / 60) * 100 < progress ? 'bg-primary' : 'bg-primary/25'
                      }`}
                      style={{ height: `${Math.sin(i * 0.35) * 45 + 50}%` }}
                    />
                  ))}
                </div>
                <span className="text-xs font-body text-muted-foreground flex-shrink-0">0:32</span>
              </div>

              {/* Progress bar */}
              <div
                className="w-full h-1 bg-border/50 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setProgress(((e.clientX - rect.left) / rect.width) * 100);
                }}
              >
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={onRegenerate}
                variant="outline"
                className="border-border/50 bg-secondary/30 hover:bg-secondary/60 text-foreground font-body gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-body gap-2">
                <Download className="w-4 h-4" />
                Download Audio
              </Button>
            </div>
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}