import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative py-28 lg:py-36">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden"
        >
          {/* Pixel grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[180px] bg-primary/8 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative px-8 py-16 lg:px-16 lg:py-24 text-center">
            <p className="font-pixel text-[9px] text-primary mb-6 uppercase tracking-widest">
              Ready to start?
            </p>
            <h2 className="font-heading text-4xl lg:text-6xl font-bold text-foreground tracking-tight mb-5">
              Create your first video today
            </h2>
            <p className="text-lg font-body text-muted-foreground leading-relaxed max-w-lg mx-auto mb-10">
              Write, translate, voice, compose — everything you need in one page.
            </p>
            <a href="#audio-editor">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-body font-semibold px-10 h-14 text-lg rounded-xl gap-2.5">
                Start now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}