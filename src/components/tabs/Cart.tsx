import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trash2, ArrowRight, ShieldCheck, Package, Wrench, Search } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Cart() {
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'bank'>('card');
  const [trackingId, setTrackingId] = useState<string>('');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const displayedItems = cartItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setCheckoutStatus('processing');
    
    const generatedTrackingId = `IASTATKAI-${Math.floor(Math.random() * 1000000)}`;
    setTrackingId(generatedTrackingId);

    const orderPayload = {
      items: cartItems,
      totals: { subtotal, tax, total },
      paymentMethod,
      timestamp: new Date().toISOString(),
      status: 'pending_payment',
      trackingId: generatedTrackingId
    };
    
    console.log("Committing to IASTATKAI database:", orderPayload);
    
    // Simulate API call
    setTimeout(() => {
      setCheckoutStatus('success');
      setTimeout(() => {
        clearCart();
        setIsCheckingOut(false);
        setCheckoutStatus('idle');
      }, 3000);
    }, 1500);
  };

  if (cartItems.length === 0 && checkoutStatus === 'idle') {
    return (
      <div className="p-6 md:p-10 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
          <Package size={48} />
        </div>
        <h2 className="text-2xl font-display font-bold text-ink-900 mb-2">Your cart is empty</h2>
        <p className="text-ink-600 mb-8 text-center max-w-md">
          Looks like you haven't added any energy products or services to your cart yet.
        </p>
      </div>
    );
  }

  if (checkoutStatus === 'success') {
    return (
      <div className="p-6 md:p-10 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
        >
          <ShieldCheck size={48} />
        </motion.div>
        <h2 className="text-3xl font-display font-bold text-ink-900 mb-2">Payment Successful!</h2>
        <p className="text-ink-600 mb-8 text-center max-w-md">
          Your order for energy products and services has been confirmed. You will receive an email with the tracking and installation details shortly.
        </p>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center">
          <p className="text-sm text-ink-600 mb-1">Your Tracking ID</p>
          <p className="text-xl font-mono font-bold text-brand-600">{trackingId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <h1 className="text-3xl font-display font-bold text-ink-900">Your Cart</h1>
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search products or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
            />
          </div>
        </div>
        <p className="text-ink-600">Review your products and services before checkout.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {displayedItems.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
              <p className="text-ink-600">No items match your search.</p>
            </div>
          ) : (
            displayedItems.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 relative overflow-hidden"
              >
              {/* Type Indicator */}
              <div className={`absolute top-0 left-0 w-1 h-full ${item.type === 'product' ? 'bg-brand-500' : 'bg-blue-500'}`} />
              
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute bottom-1 right-1 bg-white/90 backdrop-blur p-1 rounded-md shadow-sm text-ink-900">
                  {item.type === 'product' ? <Package size={12} /> : <Wrench size={12} />}
                </div>
              </div>
              
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${item.type === 'product' ? 'bg-brand-50 text-brand-700' : 'bg-blue-50 text-blue-700'}`}>
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-500 capitalize">{item.type}</span>
                </div>
                <h3 className="font-display font-bold text-ink-900 truncate">{item.name}</h3>
                <div className="text-ink-600 text-sm">${item.price.toLocaleString()} each</div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 mt-4 sm:mt-0">
                <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center text-ink-600 hover:text-ink-900 hover:bg-slate-100 rounded-l-lg transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center text-ink-600 hover:text-ink-900 hover:bg-slate-100 rounded-r-lg transition-colors"
                  >
                    +
                  </button>
                </div>
                <div className="font-bold text-ink-900 w-20 text-right">
                  ${(item.price * item.quantity).toLocaleString()}
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
            ))
          )}
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
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="font-medium text-ink-900">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-ink-600">
                <span>Estimated Tax (8%)</span>
                <span className="font-medium text-ink-900">${tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-ink-600">
                <span>Shipping & Handling</span>
                <span className="font-medium text-brand-600">Free</span>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="font-medium text-ink-900">Total</span>
                <span className="font-display font-bold text-2xl text-ink-900">${total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-ink-900 mb-3">Payment Method</h3>
              <div className="space-y-2">
                <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="text-brand-500 focus:ring-brand-500" />
                  <span className="text-sm font-medium text-ink-900">Credit / Debit Card</span>
                </label>
                <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'paypal' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="payment" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} className="text-brand-500 focus:ring-brand-500" />
                  <span className="text-sm font-medium text-ink-900">PayPal</span>
                </label>
                <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'bank' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="payment" value="bank" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} className="text-brand-500 focus:ring-brand-500" />
                  <span className="text-sm font-medium text-ink-900">Bank Transfer</span>
                </label>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mb-4"
            >
              {checkoutStatus === 'processing' ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <>
                  Checkout
                  <ArrowRight size={18} />
                </>
              )}
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

