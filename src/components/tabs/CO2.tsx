import { motion } from 'motion/react';
import { Leaf, TreePine, Car, Factory, Lightbulb, Zap, Droplets, Recycle } from 'lucide-react';

export default function CO2() {
  const tips = [
    { icon: Lightbulb, title: "Switch to LEDs", desc: "LED bulbs use up to 90% less energy and last 25 times longer than traditional incandescent bulbs." },
    { icon: Zap, title: "Unplug idle electronics", desc: "Devices consume 'vampire power' even when turned off. Use smart power strips to cut the cord." },
    { icon: Droplets, title: "Wash clothes in cold water", desc: "Heating water accounts for 90% of the energy used by washing machines. Cold water saves energy and protects fabrics." },
    { icon: Recycle, title: "Optimize your thermostat", desc: "Adjusting your thermostat by just 2 degrees can save up to 10% on your heating and cooling carbon footprint." }
  ];

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

      <hr className="my-12 border-slate-200" />

      <div className="mb-12">
        <h3 className="text-2xl font-display font-bold text-ink-900 mb-8">What does this mean?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { icon: TreePine, value: '112', label: 'Trees planted', color: 'text-emerald-500', bg: 'bg-emerald-50', barColor: 'bg-emerald-500', progress: '75%' },
            { icon: Car, value: '9,800', label: 'Miles not driven', color: 'text-blue-500', bg: 'bg-blue-50', barColor: 'bg-blue-500', progress: '60%' },
            { icon: Factory, value: '2.5', label: 'Tons of coal saved', color: 'text-slate-500', bg: 'bg-slate-100', barColor: 'bg-slate-500', progress: '40%' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group"
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}
                >
                  <stat.icon size={28} />
                </motion.div>
                <div>
                  <div className="text-3xl font-display font-bold text-ink-900">{stat.value}</div>
                  <div className="text-sm font-medium text-ink-600">{stat.label}</div>
                </div>
              </div>
              
              {/* Animated Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: stat.progress }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.3 + (i * 0.2), ease: "easeOut" }}
                  className={`h-full rounded-full ${stat.barColor}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <hr className="my-12 border-slate-200" />

      <div>
        <h3 className="text-2xl font-display font-bold text-ink-900 mb-8">Tips for reducing CO2</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-5 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 text-brand-600 shadow-sm">
                <tip.icon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-ink-900 mb-2 text-lg">{tip.title}</h4>
                <p className="text-ink-600 leading-relaxed text-sm">
                  {tip.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
