import { motion } from 'motion/react';
import { Leaf, TreePine, Car, Factory } from 'lucide-react';

export default function CO2() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold text-ink-900 mb-2">Your Environmental Impact</h1>
        <p className="text-ink-600">Track the CO2 emissions you've saved by using IASTATKAI Energy.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-2 bg-brand-900 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-600/30 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-brand-100 mb-2 font-medium">
              <Leaf size={20} />
              Total CO2 Saved
            </div>
            <div className="text-6xl md:text-8xl font-display font-bold mb-4 tracking-tighter">
              2,450 <span className="text-3xl md:text-4xl text-brand-400 font-medium">kg</span>
            </div>
            <p className="text-brand-100 max-w-sm">
              Since you installed your solar system in March 2025.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-center"
        >
          <h3 className="font-medium text-ink-600 mb-6">This month</h3>
          <div className="text-4xl font-display font-bold text-ink-900 mb-2">+142 kg</div>
          <div className="text-sm font-medium text-brand-600 bg-brand-50 inline-flex px-3 py-1 rounded-full w-fit">
            ↑ 12% vs last month
          </div>
        </motion.div>
      </div>

      <h3 className="text-xl font-display font-bold text-ink-900 mb-6">What does this mean?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: TreePine, value: '112', label: 'Trees planted', color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { icon: Car, value: '9,800', label: 'Miles not driven', color: 'text-blue-500', bg: 'bg-blue-50' },
          { icon: Factory, value: '2.5', label: 'Tons of coal saved', color: 'text-slate-500', bg: 'bg-slate-100' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (i * 0.1) }}
            className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-ink-900">{stat.value}</div>
              <div className="text-sm text-ink-600">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
