import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plug, BatteryCharging, Droplets, Wrench, Activity, LineChart, ArrowRight, Maximize2, X } from 'lucide-react';

const SERVICES = [
  {
    icon: Plug,
    title: 'Grid-Tied / On-Grid',
    desc: 'Connect your solar system directly to the utility grid to offset your energy costs and potentially earn credits for excess power.',
    features: ['Net metering integration', 'Grid synchronization', 'Seamless power switching'],
    image: '/grid-tied-photo.jpg' // User will upload this to the public folder
  },
  {
    icon: BatteryCharging,
    title: 'Off-Grid / Standalone',
    desc: 'Achieve total energy independence with a self-sustaining system, perfect for remote locations or complete grid autonomy.',
    features: ['Battery bank sizing', 'Backup generator integration', 'Smart load management']
  },
  {
    icon: Droplets,
    title: 'Solar Pumping',
    desc: 'Reliable and cost-effective water pumping solutions powered entirely by the sun, ideal for agriculture and remote water supply.',
    features: ['Deep well extraction', 'Surface water pumping', 'Automated flow control']
  },
  {
    icon: Wrench,
    title: 'Maintenance (O&M)',
    desc: 'Maximize the lifespan and efficiency of your energy assets with our comprehensive Operations and Maintenance programs.',
    features: ['Preventive inspections', 'Panel cleaning', '24/7 Performance monitoring']
  },
  {
    icon: Activity,
    title: 'Power Factor Correction',
    desc: 'Improve your electrical system\'s efficiency, reduce utility penalties, and lower overall energy consumption.',
    features: ['Capacitor bank installation', 'Harmonic filtering', 'Load profiling']
  },
  {
    icon: LineChart,
    title: 'Rate/Tariff Analysis',
    desc: 'Optimize your energy spending by analyzing your consumption patterns against complex utility rate structures.',
    features: ['Peak load shifting', 'Tariff optimization', 'ROI forecasting']
  }
];

export default function Services() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-ink-900 mb-4">Expert Services</h1>
        <p className="text-ink-600 text-lg">
          Comprehensive energy solutions tailored to your specific needs, from grid integration to financial optimization.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {SERVICES.map((service, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-5 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <service.icon size={28} />
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl mb-2 text-ink-900">{service.title}</h3>
                <p className="text-ink-600 leading-relaxed">{service.desc}</p>
              </div>
            </div>

            {service.image && (
              <div 
                className="mb-6 rounded-2xl overflow-hidden h-48 relative border border-slate-100 cursor-pointer group"
                onClick={() => setSelectedImage(service.image!)}
              >
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/20 transition-colors flex items-center justify-center">
                  <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" size={32} />
                </div>
              </div>
            )}
            
            <div className="mt-auto">
              <h4 className="text-xs font-bold text-ink-900 uppercase tracking-wider mb-3">Key Functions</h4>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm font-medium text-ink-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className="w-full px-6 py-3 rounded-xl border-2 border-slate-100 hover:border-brand-500 hover:text-brand-600 font-medium transition-colors flex items-center justify-center gap-2">
                Learn More
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/90 p-4 md:p-10 backdrop-blur-sm cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImage}
              alt="Full screen view"
              className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-ink-900/50 hover:bg-ink-900/80 rounded-full p-2 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
