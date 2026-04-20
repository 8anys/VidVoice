import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Workflow, Palette, FileOutput } from 'lucide-react';

const benefits = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate audio in seconds and video in under a minute. No waiting, no queues.',
  },
  {
    icon: Workflow,
    title: 'Simple Workflow',
    description: 'From script to finished file in five steps. No learning curve, no technical skills needed.',
  },
  {
    icon: Palette,
    title: 'Creative Control',
    description: 'Fine-tune every detail — voice, tone, pacing, visuals. Make it uniquely yours.',
  },
  {
    icon: FileOutput,
    title: 'Export-Ready',
    description: 'Download in standard formats optimized for social media, presentations, and ads.',
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="relative py-28 lg:py-36">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-body font-semibold text-primary uppercase tracking-widest mb-4">
              Why VidVoice
            </p>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-5">
              Built for creators who move fast
            </h2>
            <p className="text-lg font-body text-muted-foreground leading-relaxed mb-8">
              Whether you're a solo creator, a marketing team, or an agency — VidVoice gives you the tools to produce professional content at scale without the overhead.
            </p>

            <div className="flex items-center gap-6">
              <div>
                <p className="font-heading text-3xl font-bold text-foreground">50+</p>
                <p className="text-sm font-body text-muted-foreground">AI Voices</p>
              </div>
              <div className="w-px h-10 bg-border/50" />
              <div>
                <p className="font-heading text-3xl font-bold text-foreground">10x</p>
                <p className="text-sm font-body text-muted-foreground">Faster Workflow</p>
              </div>
              <div className="w-px h-10 bg-border/50" />
              <div>
                <p className="font-heading text-3xl font-bold text-foreground">4K</p>
                <p className="text-sm font-body text-muted-foreground">Video Export</p>
              </div>
            </div>
          </motion.div>

          {/* Right - Benefit Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 hover:border-primary/30 hover:bg-card/90 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-base font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm font-body text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}