import { motion } from 'motion/react';
import { Calendar, ArrowUpRight } from 'lucide-react';

const RELEASES = [
  {
    id: 1,
    date: 'April 2, 2026',
    title: 'IASTATKAI Energy launches new ultra-efficient solar panel series',
    category: 'Product Launch',
    excerpt: 'Our new Helios Pro series achieves a record-breaking 24% efficiency rating in independent testing, setting a new standard for residential solar.'
  },
  {
    id: 2,
    date: 'March 15, 2026',
    title: 'Expansion into 5 new European markets',
    category: 'Company News',
    excerpt: 'We are thrilled to announce that IASTATKAI Energy products and services are now available in Germany, France, Spain, Italy, and the Netherlands.'
  },
  {
    id: 3,
    date: 'February 28, 2026',
    title: 'Q4 2025 Sustainability Report Released',
    category: 'Report',
    excerpt: 'Our community of users helped offset over 2 million tons of CO2 in 2025. Read the full breakdown of our environmental impact.'
  },
  {
    id: 4,
    date: 'January 10, 2026',
    title: 'Partnership with EcoBuild Homes announced',
    category: 'Partnership',
    excerpt: 'All new EcoBuild communities will feature IASTATKAI Energy solar and storage solutions as standard equipment starting this spring.'
  }
];

export default function Release() {
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold text-ink-900 mb-2">Press & Releases</h1>
        <p className="text-ink-600">The latest news, updates, and announcements from IASTATKAI Energy.</p>
      </header>

      <div className="space-y-6">
        {RELEASES.map((release, i) => (
          <motion.article 
            key={release.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-slate-100 text-ink-600 text-xs font-bold uppercase tracking-wider rounded-full">
                  {release.category}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                  <Calendar size={14} />
                  {release.date}
                </span>
              </div>
              <div className="hidden md:flex w-8 h-8 rounded-full bg-slate-50 items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                <ArrowUpRight size={16} />
              </div>
            </div>
            
            <h2 className="text-xl md:text-2xl font-display font-bold text-ink-900 mb-3 group-hover:text-brand-600 transition-colors">
              {release.title}
            </h2>
            <p className="text-ink-600 leading-relaxed">
              {release.excerpt}
            </p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
