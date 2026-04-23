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
  User,
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
import OrdersTab from './components/tabs/Orders';
import ExpertWidget from './components/ExpertWidget';

import { AuthProvider, useAuth } from './context/AuthContext';
import ProfileTab from './components/tabs/Profile';
import AdminTab from './components/tabs/Admin';

type TabId = 'home' | 'products' | 'services' | 'co2' | 'simulation' | 'release' | 'cart' | 'orders' | 'profile' | 'admin';

interface TabDefinition {
  id: TabId;
  label: string;
  icon: React.ElementType;
  component: React.ElementType;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
}

const TABS: TabDefinition[] = [
  { id: 'home', label: 'Home', icon: HomeIcon, component: HomeTab },
  { id: 'products', label: 'Products', icon: Package, component: ProductsTab },
  { id: 'services', label: 'Services', icon: Wrench, component: ServicesTab },
  { id: 'co2', label: 'CO2', icon: Leaf, component: CO2Tab },
  { id: 'simulation', label: 'Simulation', icon: Activity, component: SimulationTab },
  { id: 'release', label: 'Release', icon: Newspaper, component: ReleaseTab },
  { id: 'cart', label: 'Cart', icon: ShoppingCart, component: CartTab },
  { id: 'orders', label: 'Orders', icon: Package, component: OrdersTab, requiresAuth: true },
  { id: 'profile', label: 'Profile', icon: User, component: ProfileTab, requiresAuth: true },
  { id: 'admin', label: 'Admin', icon: AlertTriangle, component: AdminTab, requiresAdmin: true },
];

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const { currentUser, userProfile, isAuthReady, authError, clearAuthError, loginWithGoogle, logout } = useAuth();

  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component || HomeTab;
  
  // Check if API key is missing
  // Vite injects process.env.GEMINI_API_KEY if configured in vite.config.ts, 
  // otherwise we check import.meta.env.VITE_GEMINI_API_KEY
  const isApiKeyMissing = !process.env.GEMINI_API_KEY && !import.meta.env.VITE_GEMINI_API_KEY;

  return (
    <div className="min-h-screen flex flex-col bg-paper">
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
              // Hide tabs if they require auth and user is unauthenticated
              if (tab.requiresAuth && !currentUser) return null;
              // Hide tabs if they require admin and user is not an admin
              if (tab.requiresAdmin && userProfile?.role !== 'admin') return null;

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
          
          {/* User area at bottom of sidebar */}
          <div className="p-4 border-t border-slate-100 mt-auto flex flex-col gap-2">
            {!isAuthReady ? (
              <div className="text-sm text-slate-500 text-center py-2 animate-pulse">Loading...</div>
            ) : currentUser && userProfile ? (
              <div className="hidden md:flex flex-col gap-3 mt-2">
                <div 
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => setActiveTab('profile')}
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex flex-shrink-0 items-center justify-center font-medium text-sm">
                    {userProfile.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-ink-900 truncate">{userProfile.name}</p>
                    <p className="text-xs text-ink-600 truncate capitalize">{userProfile.role} Member</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-xs text-slate-500 hover:text-red-500 transition-colors text-left px-4"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="mt-2 px-2">
                <button
                  onClick={loginWithGoogle}
                  className="w-full flex items-center gap-2 justify-center py-2.5 bg-ink-900 text-white rounded-lg text-sm font-medium hover:bg-ink-800 transition-colors"
                >
                  Log In with Google
                </button>
              </div>
            )}
            {/* Show auth error if any */}
            {authError && (
              <div className="mt-2 bg-red-50 text-red-600 text-xs p-3 rounded-lg flex gap-2 items-start relative">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span className="flex-1">{authError}</span>
                <button 
                  onClick={clearAuthError}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                >
                  &times;
                </button>
              </div>
            )}
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
              className="flex-1 overflow-y-auto relative"
            >
              {activeTab === 'cart' ? (
                <ActiveComponent onNavigateToOrders={() => setActiveTab('orders')} />
              ) : (
                <ActiveComponent />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <ExpertWidget />
    </div>
  );
}
