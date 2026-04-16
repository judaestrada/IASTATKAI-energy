import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Truck, CheckCircle2, Clock, XCircle, ChevronRight, MapPin } from 'lucide-react';
import { useCart, Order } from '../../context/CartContext';

export default function Orders() {
  const { orders } = useCart();

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending_payment': return <Clock className="text-amber-500" />;
      case 'processing': return <Package className="text-blue-500" />;
      case 'shipped': return <Truck className="text-indigo-500" />;
      case 'delivered': return <CheckCircle2 className="text-emerald-500" />;
      case 'failed': return <XCircle className="text-red-500" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending_payment': return 'Pending Payment';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'failed': return 'Failed';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="p-6 md:p-10 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
          <Truck size={48} />
        </div>
        <h2 className="text-2xl font-display font-bold text-ink-900 mb-2">No active orders</h2>
        <p className="text-ink-600 mb-8 text-center max-w-md">
          Once you complete a checkout, your energy solutions will show up here for tracking.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold text-ink-900 mb-2">Order Tracking</h1>
        <p className="text-ink-600">Monitor your energy products and service installations.</p>
      </header>

      <div className="space-y-6">
        {orders.map((order, i) => (
          <motion.div 
            key={order.trackingId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">Tracking ID</p>
                <div className="font-mono text-lg font-bold text-ink-900">{order.trackingId}</div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">Date</p>
                  <p className="font-medium text-ink-900">
                    {new Date(order.date).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">Total</p>
                  <p className="font-medium text-ink-900">${order.total.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                  {getStatusIcon(order.status)}
                  <span className="font-bold text-sm text-ink-900 whitespace-nowrap">
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wider mb-4">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-ink-900 leading-tight">{item.name}</h4>
                        <p className="text-sm text-ink-600 mb-1 capitalize">{item.type} &middot; {item.category}</p>
                        <p className="text-sm font-medium">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-80 shrink-0">
                <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wider mb-4">Destination</h3>
                <div className="bg-slate-50 rounded-xl p-4 flex gap-3">
                  <MapPin className="text-brand-500 shrink-0" size={20} />
                  <div>
                    <p className="font-semibold text-ink-900">Installation Address</p>
                    <p className="text-sm text-ink-600 mt-1">
                      123 Green Energy Ln.<br />
                      Eco District, ED 90210
                    </p>
                  </div>
                </div>

                {order.status === 'failed' && (
                  <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
                    <p className="font-bold mb-1">Payment Failed</p>
                    <p>There was an issue processing your payment method. Please check your details and try again.</p>
                  </div>
                )}
                
                {order.status === 'processing' && (
                  <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-xl text-sm border border-blue-100">
                    <p className="font-bold mb-1">System Allocation in Progress</p>
                    <p>Your hardware is currently being prepared at our distribution center.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
