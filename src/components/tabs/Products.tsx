import { motion } from 'motion/react';
import { ShoppingCart, Star } from 'lucide-react';

const PRODUCTS = [
  {
    id: 1,
    name: 'AeroBlade X1',
    category: 'Wind Turbine',
    price: '$3,499',
    rating: 4.8,
    image: 'https://picsum.photos/seed/wind/400/300',
    desc: 'Ultra-quiet residential wind turbine with 2kW output.'
  },
  {
    id: 2,
    name: 'Helios Pro Panel',
    category: 'Solar Panel',
    price: '$450',
    rating: 4.9,
    image: 'https://picsum.photos/seed/solar/400/300',
    desc: '400W monocrystalline solar panel with 22% efficiency.'
  },
  {
    id: 3,
    name: 'PowerCell Home',
    category: 'Battery Storage',
    price: '$5,200',
    rating: 4.7,
    image: 'https://picsum.photos/seed/battery/400/300',
    desc: '10kWh smart home battery system with app monitoring.'
  },
  {
    id: 4,
    name: 'Smart Inverter V2',
    category: 'Inverter',
    price: '$1,200',
    rating: 4.6,
    image: 'https://picsum.photos/seed/inverter/400/300',
    desc: 'Hybrid inverter for seamless grid and battery integration.'
  },
  {
    id: 5,
    name: 'VOGAR VR-Series',
    category: 'Voltage Regulator',
    price: '$850',
    rating: 4.9,
    image: 'https://picsum.photos/seed/regulator/400/300',
    desc: 'High-precision industrial voltage regulator by VOGAR, engineered in Mexico for maximum protection.'
  },
  {
    id: 6,
    name: 'VOGAR UPS-Elite',
    category: 'UPS Systems',
    price: '$1,450',
    rating: 4.8,
    image: 'https://picsum.photos/seed/ups/400/300',
    desc: 'Professional Uninterruptible Power Supply by VOGAR. Reliable backup for critical infrastructure.'
  }
];

export default function Products() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-ink-900 mb-2">Our Products</h1>
          <p className="text-ink-600">High-performance hardware for your energy independence.</p>
        </div>
        <div className="flex gap-2">
          {['All', 'Solar', 'Wind', 'Storage', 'Protection'].map(filter => (
            <button key={filter} className="px-4 py-2 rounded-full text-sm font-medium border border-slate-200 hover:border-brand-500 hover:text-brand-600 transition-colors">
              {filter}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((product, i) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm group"
          >
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-semibold text-ink-900">
                {product.category}
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-display font-semibold text-lg text-ink-900">{product.name}</h3>
                <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                  <Star size={14} fill="currentColor" />
                  {product.rating}
                </div>
              </div>
              <p className="text-ink-600 text-sm mb-4 line-clamp-2">{product.desc}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-bold text-xl text-ink-900">{product.price}</span>
                <button className="w-10 h-10 rounded-full bg-slate-100 text-ink-900 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors">
                  <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
