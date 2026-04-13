/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, 
  Package, 
  Wrench, 
  Leaf, 
  Activity, 
  Newspaper, 
  ShoppingCart,
  Zap,
  Bot,
  AlertTriangle
} from 'lucide-react';

import { CartProvider } from './context/CartContext';
import HomeTab from './components/tabs/Home';
import ProductsTab from './components/tabs/Products';
import ServicesTab from './components/tabs/Services';
import CO2Tab from './components/tabs/CO2';
import SimulationTab from './components/tabs/Simulation';
import ReleaseTab from './components/tabs/Release';
import CartTab from './components/tabs/Cart';
import ExpertAgent from './components/agent/ExpertAgent';

type TabId = 'home' | 'products' | 'services' | 'co2' | 'simulation' | 'release' | 'cart';

interface TabDefinition {
  id: TabId;
  label: string;
  icon: React.ElementType;
  component: React.ElementType;
}

const TABS: TabDefinition[] = [
  { id: 'home', label: 'Home', icon: HomeIcon, component: HomeTab },
  { id: 'products', label: 'Products', icon: Package, component: ProductsTab },
  { id: 'services', label: 'Services', icon: Wrench, component: ServicesTab },
  { id: 'co2', label: 'CO2', icon: Leaf, component: CO2Tab },
  { id: 'simulation', label: 'Simulation', icon: Activity, component: SimulationTab },
  { id: 'release', label: 'Release', icon: Newspaper, component: ReleaseTab },
  { id: 'cart', label: 'Cart', icon: ShoppingCart, component: CartTab },
];

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isAgentOpen, setIsAgentOpen] = useState(false);

  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component || HomeTab;
  
  // Check if API key is missing
  // Vite injects process.env.GEMINI_API_KEY if configured in vite.config.ts, 
  // otherwise we check import.meta.env.VITE_GEMINI_API_KEY
  const isApiKeyMissing = !process.env.GEMINI_API_KEY && !import.meta.env.VITE_GEMINI_API_KEY;

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      {isApiKeyMissing && (
        <div className="bg-red-500 text-white px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 z-[100] relative w-full">
          <AlertTriangle size={16} className="shrink-0" />
          <span className="text-center">
            Configuration Error: <code className="bg-red-600 px-1 py-0.5 rounded">GEMINI_API_KEY</code> or <code className="bg-red-600 px-1 py-0.5 rounded">VITE_GEMINI_API_KEY</code> is missing from your .env file. The AI Expert features will not work.
          </span>
        </div>
      )}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <nav className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col sticky top-0 md:h-screen z-40 shrink-0">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <Zap size={24} />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl tracking-tight text-ink-900 leading-none">IASTATKAI</h1>
              <span className="text-brand-600 text-xs font-semibold tracking-widest uppercase">Energy</span>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto md:overflow-y-auto px-4 pb-4 md:pb-0 flex md:flex-col gap-1 hide-scrollbar">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap md:whitespace-normal relative ${
                    isActive 
                      ? 'text-brand-600 font-medium' 
                      : 'text-ink-600 hover:bg-slate-50 hover:text-ink-900'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-brand-50 rounded-xl border border-brand-100"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <Icon size={20} className={isActive ? 'text-brand-500' : 'text-slate-400'} />
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
          
          {/* Agent Button & User area at bottom of sidebar */}
          <div className="p-4 border-t border-slate-100 mt-auto flex flex-col gap-2">
            <button
              onClick={() => setIsAgentOpen(true)}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-ink-900 hover:bg-ink-800 text-white rounded-xl font-medium transition-colors shadow-sm group"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden border border-brand-400/30 group-hover:border-brand-400 transition-colors">
                <img 
                  src="/agent-icon.png" 
                  alt="" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span>IASTATKAI Expert</span>
            </button>
            
            <div className="hidden md:flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors mt-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium text-sm">
                JD
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-ink-900 truncate">Juan David</p>
                <p className="text-xs text-ink-600 truncate">Pro Member</p>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 relative overflow-hidden flex flex-col h-[calc(100vh-140px)] md:h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto"
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Floating Expert Agent */}
        <ExpertAgent 
          isOpen={isAgentOpen} 
          onClose={() => setIsAgentOpen(false)} 
          currentContext={TABS.find(t => t.id === activeTab)?.label || 'App'}
        />
      </div>
    </div>
  );
}
