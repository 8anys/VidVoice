import React from 'react';
import { motion } from 'framer-motion';
import { PenLine, Languages, Mic, ImagePlus, Film, Download } from 'lucide-react';

const features = [
  {
    icon: PenLine,
    pixel: '01',
    title: 'Write text',
    description: 'Enter or paste any text. Works with both Ukrainian and English content.',
  },
  {
    icon: Languages,
    pixel: '02',
    title: 'Translate UA ⇄ EN',
    description: 'Instantly translate between Ukrainian and English with one click.',
  },
  {
    icon: Mic,
    pixel: '03',
    title: 'Generate voice',
    description: 'Create studio-quality voiceovers powered by ElevenLabs text-to-speech.',
  },
  {
    icon: ImagePlus,
    pixel: '04',
    title: 'Upload images',
    description: 'Drag and drop your images. Reorder them to match your story.',
  },
  {
    icon: Film,
    pixel: '05',
    title: 'Compose video',
    description: 'Combine your audio and images into a clean, export-ready video.',
  },
  {
    icon: Download,
    pixel: '06',
    title: 'Download result',
    description: 'Export your audio and video files in standard formats, ready to share.',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-28 lg:py-36">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 lg:mb-20"
        >
          <p className="font-pixel text-[9px] text-primary uppercase tracking-widest mb-5">
            What you can do
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-5">
            Everything in one workflow
          </h2>
          <p className="text-lg font-body text-muted-foreground leading-relaxed">
            From raw text to a finished video — translate, voice, and compose without leaving the page.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-7 hover:border-primary/35 hover:bg-card/90 transition-all duration-300 overflow-hidden"
            >
              {/* Pixel index in corner */}
              <span className="absolute top-4 right-4 font-pixel text-[8px] text-border/80 group-hover:text-primary/40 transition-colors">
                {feature.pixel}
              </span>

              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm font-body text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Pixel bottom border accent */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/40 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}