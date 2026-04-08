import { motion } from 'motion/react';
import { Trash2, ArrowRight, ShieldCheck } from 'lucide-react';

const CART_ITEMS = [
  {
    id: 1,
    name: 'Helios Pro Panel',
    category: 'Solar Panel',
    price: 450,
    quantity: 12,
    image: 'https://picsum.photos/seed/solar/100/100'
  },
  {
    id: 2,
    name: 'Smart Inverter V2',
    category: 'Inverter',
    price: 1200,
    quantity: 1,
    image: 'https://picsum.photos/seed/inverter/100/100'
  }
];

export default function Cart() {
  const subtotal = CART_ITEMS.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold text-ink-900 mb-2">Your Cart</h1>
        <p className="text-ink-600">Review your items before checkout.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {CART_ITEMS.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">{item.category}</div>
                <h3 className="font-display font-bold text-ink-900 truncate">{item.name}</h3>
                <div className="text-ink-600 text-sm">${item.price.toLocaleString()} each</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200">
                  <button className="w-8 h-8 flex items-center justify-center text-ink-600 hover:text-ink-900">-</button>
                  <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                  <button className="w-8 h-8 flex items-center justify-center text-ink-600 hover:text-ink-900">+</button>
                </div>
                <div className="font-bold text-ink-900 w-20 text-right">
                  ${(item.price * item.quantity).toLocaleString()}
                </div>
                <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-80 shrink-0"
        >
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-6">
            <h2 className="font-display font-bold text-xl text-ink-900 mb-6">Order Summary</h2>
            
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-ink-600">
                <span>Subtotal</span>
                <span className="font-medium text-ink-900">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-ink-600">
                <span>Estimated Tax</span>
                <span className="font-medium text-ink-900">${tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-ink-600">
                <span>Shipping</span>
                <span className="font-medium text-brand-600">Free</span>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="font-medium text-ink-900">Total</span>
                <span className="font-display font-bold text-2xl text-ink-900">${total.toLocaleString()}</span>
              </div>
            </div>

            <button className="w-full bg-brand-500 hover:bg-brand-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mb-4">
              Checkout
              <ArrowRight size={18} />
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={14} />
              Secure encrypted checkout
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
