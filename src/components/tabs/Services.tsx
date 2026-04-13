import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plug, BatteryCharging, Droplets, Wrench, Activity, LineChart, ArrowRight, Maximize2, X, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const SERVICES = [
  {
    icon: Plug,
    title: 'Grid-Tied / On-Grid',
    desc: 'Connect your solar system directly to the utility grid to offset your energy costs and potentially earn credits for excess power.',
    features: ['Net metering integration', 'Grid synchronization', 'Seamless power switching'],
    image: '/grid-tied-family.jpg', // User will upload this to the public folder
    price: 2500
  },
  {
    icon: BatteryCharging,
    title: 'Off-Grid / Standalone',
    desc: 'Achieve total energy independence with a self-sustaining system, perfect for remote locations or complete grid autonomy.',
    features: ['Battery bank sizing', 'Backup generator integration', 'Smart load management'],
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800',
    price: 3500
  },
  {
    icon: Droplets,
    title: 'Solar Pumping',
    desc: 'Reliable and cost-effective water pumping solutions powered entirely by the sun, ideal for agriculture and remote water supply.',
    features: ['Deep well extraction', 'Surface water pumping', 'Automated flow control'],
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800',
    price: 1800
  },
  {
    icon: Wrench,
    title: 'Maintenance (O&M)',
    desc: 'Maximize the lifespan and efficiency of your energy assets with our comprehensive Operations and Maintenance programs.',
    features: ['Preventive inspections', 'Panel cleaning', '24/7 Performance monitoring'],
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
    price: 500
  },
  {
    icon: Activity,
    title: 'Power Factor Correction',
    desc: 'Improve your electrical system\'s efficiency, reduce utility penalties, and lower overall energy consumption.',
    features: ['Capacitor bank installation', 'Harmonic filtering', 'Load profiling'],
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    price: 1200
  },
  {
    icon: LineChart,
    title: 'Rate/Tariff Analysis',
    desc: 'Optimize your energy spending by analyzing your consumption patterns against complex utility rate structures.',
    features: ['Peak load shifting', 'Tariff optimization', 'ROI forecasting'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    price: 300
  }
];

export default function Services() {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % SERVICES.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + SERVICES.length) % SERVICES.length);

  const activeService = SERVICES[currentIndex];
  const ActiveIcon = activeService.icon;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <header className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-ink-900 mb-4">Expert Services</h1>
        <p className="text-ink-600 text-lg">
          Comprehensive energy solutions tailored to your specific needs, from grid integration to financial optimization.
        </p>
      </header>

      {/* Carousel Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden flex flex-col lg:flex-row min-h-[500px]">
        
        {/* Image Side */}
        <div 
          className="lg:w-1/2 relative h-64 lg:h-auto cursor-pointer group bg-slate-100 overflow-hidden"
          onClick={() => setSelectedImage(activeService.image)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeService.image}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              src={activeService.image}
              alt={activeService.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/20 transition-colors flex items-center justify-center z-10">
            <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" size={32} />
          </div>
        </div>

        {/* Content Side */}
        <div className="lg:w-1/2 p-8 md:p-12 flex flex-col relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeService.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <ActiveIcon size={28} />
                </div>
                <h3 className="font-display font-bold text-2xl md:text-3xl text-ink-900">{activeService.title}</h3>
              </div>
              
              <p className="text-ink-600 text-lg leading-relaxed mb-8">
                {activeService.desc}
              </p>

              <h4 className="text-xs font-bold text-ink-900 uppercase tracking-wider mb-4">Key Functions</h4>
              <ul className="space-y-3 mb-8">
                {activeService.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-base font-medium text-ink-700">
                    <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-sm text-ink-600 font-medium">Starting at</span>
                  <span className="font-display font-bold text-2xl text-ink-900">${activeService.price.toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => addToCart({
                    id: `srv-${currentIndex}`,
                    name: activeService.title,
                    category: 'Service',
                    type: 'service',
                    price: activeService.price,
                    image: activeService.image
                  })}
                  className="px-6 py-3 rounded-xl bg-brand-500 text-white flex items-center justify-center gap-2 hover:bg-brand-600 transition-colors font-bold shadow-sm shadow-brand-500/20"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-ink-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex gap-2">
              {SERVICES.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === currentIndex ? 'w-8 bg-brand-500' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button 
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-ink-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Image Viewer */}
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
