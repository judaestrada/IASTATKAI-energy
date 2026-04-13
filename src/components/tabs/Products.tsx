import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';

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

const ProductCard: React.FC<{ product: any, index: number }> = ({ product, index }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm group flex flex-col"
    >
      <div className="relative h-48 overflow-hidden bg-slate-100 shrink-0">
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
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display font-semibold text-lg text-ink-900">{product.name}</h3>
          <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
            <Star size={14} fill="currentColor" />
            {product.rating}
          </div>
        </div>
        <p className="text-ink-600 text-sm mb-4 line-clamp-2">{product.desc}</p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <span className="font-bold text-xl text-ink-900">{product.price}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 h-9">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-full flex items-center justify-center text-ink-600 hover:text-ink-900 hover:bg-slate-100 rounded-l-lg transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center font-medium text-sm">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-full flex items-center justify-center text-ink-600 hover:text-ink-900 hover:bg-slate-100 rounded-r-lg transition-colors"
              >
                +
              </button>
            </div>
            <button 
              onClick={() => {
                addToCart({
                  id: `prod-${product.id}`,
                  name: product.name,
                  category: product.category,
                  type: 'product',
                  price: parseInt(product.price.replace(/[^0-9]/g, ''), 10),
                  image: product.image,
                  quantity: quantity
                });
                setQuantity(1);
              }}
              className="px-3 py-2 h-9 rounded-lg bg-brand-500 text-white flex items-center justify-center gap-1.5 hover:bg-brand-600 transition-colors font-medium text-sm shadow-sm shadow-brand-500/20"
            >
              <ShoppingCart size={14} />
              Add
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Products() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-ink-900 mb-2">Our Products</h1>
          <p className="text-ink-600">High-performance hardware for your energy independence.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', 'Solar', 'Wind', 'Storage', 'Protection'].map(filter => (
            <button key={filter} className="px-4 py-2 rounded-full text-sm font-medium border border-slate-200 hover:border-brand-500 hover:text-brand-600 transition-colors">
              {filter}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </div>
  );
}
