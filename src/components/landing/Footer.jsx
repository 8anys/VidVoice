import React from 'react';

const navGroups = [
  {
    title: 'Product',
    links: [
      { label: 'Audio', href: '#audio-editor' },
      { label: 'Video', href: '#video' },
      { label: 'Features', href: '#features' },
      { label: 'Workflow', href: '#workflow' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'About', href: '#workflow' },
      { label: 'GitHub', href: '#' },
      { label: 'Documentation', href: '#' },
      { label: 'API', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-18">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          <div className="col-span-2 md:col-span-2">
            <a href="#hero" className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 bg-primary/20 border border-primary/40 flex items-center justify-center">
                <span className="font-pixel text-[6px] text-primary leading-none">VV</span>
              </div>
              <span className="font-heading text-lg font-bold text-foreground tracking-tight">
                Vid<span className="text-primary">Voice</span>
              </span>
            </a>
            <p className="text-sm font-body text-muted-foreground leading-relaxed max-w-xs mb-4">
              Text to voice to video. Translate, generate, compose — all in one page. Powered by ElevenLabs.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-primary/25 bg-primary/8">
              <div className="w-1.5 h-1.5 bg-green-400" />
              <span className="font-pixel text-[7px] text-muted-foreground">ELEVENLABS POWERED</span>
            </div>
          </div>

          {navGroups.map((group) => (
            <div key={group.title}>
              <h4 className="font-pixel text-[8px] text-primary mb-5 uppercase tracking-wider">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-body text-muted-foreground">© {new Date().getFullYear()} VidVoice. Diploma Project.</p>
          <p className="font-pixel text-[7px] text-muted-foreground/50">MADE WITH ELEVENLABS + REACT</p>
        </div>
      </div>
    </footer>
  );
}
