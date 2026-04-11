import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sun, Wind, Battery } from 'lucide-react';
import JourneyForm from '../JourneyForm';

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <header className="mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-display font-bold text-ink-900 tracking-tight mb-4"
        >
          Powering the future, <br />
          <span className="text-brand-500">sustainably.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-ink-600 max-w-2xl"
        >
          IASTATKAI Energy provides cutting-edge renewable energy solutions for homes and businesses. 
          Transition to clean energy today and reduce your carbon footprint.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Sun, title: 'Solar Power', desc: 'High-efficiency photovoltaic panels for maximum energy generation.' },
          { icon: Wind, title: 'Wind Energy', desc: 'Compact urban wind turbines for continuous power supply.' },
          { icon: Battery, title: 'Energy Storage', desc: 'Smart battery systems to store your excess clean energy.' }
        ].map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (i * 0.1) }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mb-4">
              <feature.icon size={24} />
            </div>
            <h3 className="font-display font-semibold text-xl mb-2">{feature.title}</h3>
            <p className="text-ink-600 text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-ink-900 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div>
          <h2 className="font-display font-bold text-3xl mb-2">Ready to make the switch?</h2>
          <p className="text-slate-400 max-w-md">Get a free consultation and see how much you could save with IASTATKAI Energy solutions.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-medium flex items-center gap-2 transition-colors shrink-0"
        >
          Start your journey
          <ArrowRight size={20} />
        </button>
      </motion.div>

      <JourneyForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
