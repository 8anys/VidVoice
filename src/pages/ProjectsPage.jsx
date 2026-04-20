import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, FolderOpen, Plus, SortAsc, Filter, Calendar, Globe, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useT } from '@/context/AppContext';
import { format } from 'date-fns';

const MOCK_PROJECTS = [
  { id: 1, name: 'Product Launch Video', status: 'completed', language: 'EN', scenes: 5, created: '2026-03-10', updated: '2026-04-15' },
  { id: 2, name: 'Brand Story UA',       status: 'in_progress', language: 'UA', scenes: 8, created: '2026-04-01', updated: '2026-04-18' },
  { id: 3, name: 'Tutorial Series #1',   status: 'draft',      language: 'EN', scenes: 3, created: '2026-04-10', updated: '2026-04-10' },
  { id: 4, name: 'Promo Reel',           status: 'completed',  language: 'UA', scenes: 6, created: '2026-02-20', updated: '2026-03-05' },
];

const STATUS_COLORS = {
  completed:   'bg-green-500/15 text-green-400 border-green-500/30',
  in_progress: 'bg-primary/15 text-primary border-primary/30',
  draft:       'bg-border/50 text-muted-foreground border-border/50',
};

export default function ProjectsPage() {
  const t = useT();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('updated');

  const filtered = MOCK_PROJECTS
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b[sortKey]) - new Date(a[sortKey]));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-6 py-10 lg:py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="font-pixel text-[8px] text-primary mb-2 uppercase tracking-widest">Account</p>
              <h1 className="font-heading text-3xl font-bold text-foreground">{t('projects_title')}</h1>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-xl">
              <Plus className="w-4 h-4" />{t('new_project')}
            </Button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('search_projects')}
                className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border/40 rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <select
              value={sortKey}
              onChange={e => setSortKey(e.target.value)}
              className="px-4 py-2.5 bg-secondary/50 border border-border/40 rounded-xl text-sm font-body text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="updated">{t('sort_by')}: Updated</option>
              <option value="created">{t('sort_by')}: Created</option>
            </select>
          </div>

          {/* Projects list */}
          <div className="space-y-3">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary/30 hover:bg-card/80 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-5 h-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-heading text-base font-semibold text-foreground truncate">{project.name}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-body font-medium border ${STATUS_COLORS[project.status]}`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs font-body text-muted-foreground">
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{project.language}</span>
                    <span className="flex items-center gap-1"><Layers className="w-3 h-3" />{project.scenes} {t('scenes')}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{t('created')}: {format(new Date(project.created), 'MMM d, yyyy')}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{t('updated')}: {format(new Date(project.updated), 'MMM d, yyyy')}</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="flex-shrink-0 border-border/50 hover:border-primary/50 hover:bg-primary/10 text-sm gap-1.5 rounded-xl">
                  {t('open')}
                </Button>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground font-body text-sm">No projects found.</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}