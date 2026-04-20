import React from 'react';
import { motion } from 'framer-motion';
import { PenLine, Languages, Mic, ImagePlus, Film, Download } from 'lucide-react';

const steps = [
  { icon: PenLine,    num: '01', label: 'Write text',       desc: 'Enter your script in Ukrainian or English' },
  { icon: Languages,  num: '02', label: 'Translate',        desc: 'Optional — switch language with one click' },
  { icon: Mic,        num: '03', label: 'Generate voice',   desc: 'ElevenLabs converts your text to audio' },
  { icon: ImagePlus,  num: '04', label: 'Upload images',    desc: 'Add and order the images for your video' },
  { icon: Film,       num: '05', label: 'Create video',     desc: 'Script composes audio + images into MP4' },
  { icon: Download,   num: '06', label: 'Download',         desc: 'Export audio and video to your device' },
];

export default function Workflow() {
  return (
    <section id="workflow" className="relative py-28 lg:py-36">
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
            How it works
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-5">
            Six steps to finished content
          </h2>
          <p className="text-lg font-body text-muted-foreground leading-relaxed">
            A clear, linear workflow from first word to final video file.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 hover:border-primary/35 hover:bg-card/90 transition-all duration-300 flex gap-4"
            >
              {/* Step number + icon */}
              <div className="flex-shrink-0">
                <div className="relative w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-5 h-5 text-primary" />
                  <span className="absolute -top-2 -right-2 font-pixel text-[7px] text-primary bg-background border border-primary/30 px-1 py-0.5 leading-none">
                    {step.num}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-heading text-base font-semibold text-foreground mb-1">
                  {step.label}
                </h3>
                <p className="text-sm font-body text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}