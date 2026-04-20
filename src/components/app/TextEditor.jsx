import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Languages, Loader2, ChevronDown, Mic } from 'lucide-react';

const voices = [
  { id: 'rachel', label: 'Rachel', style: 'Calm & Clear' },
  { id: 'clyde', label: 'Clyde', style: 'Strong & Warm' },
  { id: 'domi', label: 'Domi', style: 'Confident' },
  { id: 'bella', label: 'Bella', style: 'Soft & Natural' },
  { id: 'josh', label: 'Josh', style: 'Deep & Steady' },
  { id: 'arnold', label: 'Arnold', style: 'Authoritative' },
];

const PixelLabel = ({ children }) => (
  <span className="font-pixel text-[8px] text-primary uppercase tracking-wider">{children}</span>
);

export default function TextEditor({ onGenerate }) {
  const [text, setText] = useState('');
  const [translating, setTranslating] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(voices[0]);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const handleTranslate = (dir) => {
    if (!text.trim()) return;
    setTranslating(dir);
    setTimeout(() => {
      // Simulate translation
      const mock =
        dir === 'toEN'
          ? 'Welcome to VidVoice — transform your text into voice and video in seconds.'
          : 'Ласкаво просимо до VidVoice — перетворіть ваш текст на голос та відео за секунди.';
      setText(mock);
      setTranslating(null);
    }, 1400);
  };

  const handleGenerate = () => {
    if (!text.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      if (onGenerate) onGenerate({ text, voice: selectedVoice });
    }, 2200);
  };

  return (
    <section id="audio-editor" className="relative py-20 lg:py-28">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <PixelLabel>Step 1 – 2</PixelLabel>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground tracking-tight mt-3 mb-2">
            Write & Translate
          </h2>
          <p className="text-base font-body text-muted-foreground">
            Enter your text, optionally translate it, then choose a voice and generate.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-6 lg:p-8 space-y-6"
        >
          {/* Textarea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <PixelLabel>Your text</PixelLabel>
              <span className="text-xs font-body text-muted-foreground">{text.length} chars</span>
            </div>
            <Textarea
              placeholder="Enter your text here — in Ukrainian or English..."
              className="min-h-[160px] bg-secondary/50 border-border/40 text-foreground font-body placeholder:text-muted-foreground/50 resize-none rounded-xl text-base leading-relaxed"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          {/* Translate buttons */}
          <div>
            <div className="mb-2">
              <PixelLabel>Translate</PixelLabel>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => handleTranslate('toEN')}
                disabled={!!translating || !text.trim()}
                className="border-border/50 bg-secondary/30 hover:bg-secondary/60 text-foreground font-body gap-2 h-10"
              >
                {translating === 'toEN' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Languages className="w-4 h-4 text-primary" />
                )}
                Translate to English
              </Button>
              <Button
                variant="outline"
                onClick={() => handleTranslate('toUA')}
                disabled={!!translating || !text.trim()}
                className="border-border/50 bg-secondary/30 hover:bg-secondary/60 text-foreground font-body gap-2 h-10"
              >
                {translating === 'toUA' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Languages className="w-4 h-4 text-primary" />
                )}
                Translate to Ukrainian
              </Button>
            </div>
          </div>

          {/* Voice selection */}
          <div>
            <div className="mb-2">
              <PixelLabel>Voice (ElevenLabs)</PixelLabel>
            </div>
            <div className="relative">
              <button
                onClick={() => setVoiceOpen(!voiceOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-secondary/50 border border-border/40 hover:border-primary/40 transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-body font-semibold text-foreground">{selectedVoice.label}</p>
                  <p className="text-xs font-body text-muted-foreground">{selectedVoice.style}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${voiceOpen ? 'rotate-180' : ''}`} />
              </button>

              {voiceOpen && (
                <div className="absolute top-full mt-1 left-0 right-0 z-20 rounded-xl bg-card border border-border/60 shadow-xl shadow-black/30 overflow-hidden">
                  {voices.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => { setSelectedVoice(v); setVoiceOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/60 transition-colors text-left ${
                        selectedVoice.id === v.id ? 'bg-primary/10' : ''
                      }`}
                    >
                      <div>
                        <p className="text-sm font-body font-medium text-foreground">{v.label}</p>
                        <p className="text-xs font-body text-muted-foreground">{v.style}</p>
                      </div>
                      {selectedVoice.id === v.id && (
                        <div className="w-2 h-2 bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Generate button */}
          <Button
            onClick={handleGenerate}
            disabled={generating || !text.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body font-semibold h-13 text-base rounded-xl gap-2"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating voice...
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                Generate Voice
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}