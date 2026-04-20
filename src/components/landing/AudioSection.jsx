import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Volume2, Play, Loader2, Download } from 'lucide-react';

const voices = [
  { name: 'Emma', style: 'Natural' },
  { name: 'James', style: 'Professional' },
  { name: 'Aria', style: 'Warm' },
  { name: 'Marcus', style: 'Energetic' },
];

const styles = ['Conversational', 'Narration', 'News Anchor', 'Storytelling'];

export default function AudioSection() {
  const [selectedVoice, setSelectedVoice] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [text, setText] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!text.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  return (
    <section id="audio" className="relative py-28 lg:py-36">
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
            Audio Generation
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-5">
            Create voiceovers instantly
          </h2>
          <p className="text-lg font-body text-muted-foreground leading-relaxed">
            Type your script, pick a voice, and generate studio-quality audio in one click.
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
            {/* Text Input */}
            <div className="mb-6">
              <label className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                Your Script
              </label>
              <Textarea
                placeholder="Enter the text you want to convert to speech..."
                className="min-h-[120px] bg-secondary/50 border-border/40 text-foreground font-body placeholder:text-muted-foreground/60 resize-none rounded-xl"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <p className="text-xs font-body text-muted-foreground mt-2">{text.length} characters</p>
            </div>

            {/* Voice Selection */}
            <div className="mb-6">
              <label className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                Voice
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {voices.map((voice, i) => (
                  <button
                    key={voice.name}
                    onClick={() => setSelectedVoice(i)}
                    className={`rounded-xl p-3.5 border text-left transition-all ${
                      selectedVoice === i
                        ? 'border-primary/60 bg-primary/10'
                        : 'border-border/40 bg-secondary/30 hover:border-border/60'
                    }`}
                  >
                    <p className="text-sm font-body font-semibold text-foreground">{voice.name}</p>
                    <p className="text-xs font-body text-muted-foreground">{voice.style}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div className="mb-8">
              <label className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                Style
              </label>
              <div className="flex flex-wrap gap-2">
                {styles.map((style, i) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(i)}
                    className={`rounded-lg px-4 py-2 text-sm font-body font-medium transition-all ${
                      selectedStyle === i
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary/50 text-muted-foreground border border-border/40 hover:text-foreground'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate */}
            <div className="flex items-center gap-4">
              <Button
                onClick={handleGenerate}
                disabled={generating || !text.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-body font-semibold px-8 h-12 rounded-lg gap-2 flex-shrink-0"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    Generate Audio
                  </>
                )}
              </Button>
            </div>

            {/* Result */}
            {generated && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-8 rounded-xl bg-secondary/50 border border-border/40 p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-body font-semibold text-primary uppercase tracking-wider">
                    Generated Audio
                  </span>
                  <button className="flex items-center gap-1.5 text-xs font-body font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-primary/90 transition-colors">
                    <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                  </div>
                  <div className="flex-1 flex items-end gap-[2px] h-10">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-primary/40 rounded-full"
                        style={{ height: `${Math.random() * 80 + 20}%` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-body text-muted-foreground flex-shrink-0">0:18</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}