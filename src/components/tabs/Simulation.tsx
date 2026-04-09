import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Sun, Zap, DollarSign, Building2, Factory, ArrowRightLeft, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';

const DEFAULT_CFE_RATES = {
  residential: 1.80, // Average MXN per kWh for residential (e.g., Tarifa 1, DAC is higher)
  commercial: 4.20, // Average MXN per kWh for commercial (e.g., PDBT/GDBT)
  industrial: 2.60  // Average MXN per kWh for industrial (e.g., GDMTO/GDMTH)
};

function AccordionItem({ title, children, isOpen, onClick }: { title: string, children: ReactNode, isOpen: boolean, onClick: () => void }) {
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      <button 
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
        onClick={onClick}
      >
        <span className="font-semibold text-ink-900">{title}</span>
        {isOpen ? <ChevronUp size={20} className="text-ink-500" /> : <ChevronDown size={20} className="text-ink-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6 pt-2 border-t border-slate-100 text-ink-600 text-sm leading-relaxed bg-slate-50/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Simulation() {
  const [cfeRates, setCfeRates] = useState(DEFAULT_CFE_RATES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [tariff, setTariff] = useState<'residential' | 'commercial' | 'industrial'>('commercial');
  const [consumption, setConsumption] = useState(2000); // kWh per month
  const [systemSize, setSystemSize] = useState(15); // kW
  const [sunlight, setSunlight] = useState(5.5); // hours
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleRefreshRates = async () => {
    setIsRefreshing(true);
    try {
      // Note: In a real production app, you would call your own backend proxy here.
      // Direct calls to the CFE ASPX page from the browser are blocked by CORS.
      // Simulating a network request delay:
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulating slightly updated rates from the "API"
      setCfeRates({
        residential: Number((1.80 + (Math.random() * 0.10 - 0.05)).toFixed(2)),
        commercial: Number((4.20 + (Math.random() * 0.15 - 0.05)).toFixed(2)),
        industrial: Number((2.60 + (Math.random() * 0.10 - 0.05)).toFixed(2))
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculations
  const rate = cfeRates[tariff];
  const monthlyGeneration = Math.round(systemSize * sunlight * 30);
  const excessEnergy = Math.max(0, monthlyGeneration - consumption);
  const selfConsumed = Math.min(monthlyGeneration, consumption);

  const monthlySavings = selfConsumed * rate;
  const monthlyRevenue = excessEnergy * rate; // Selling excess at normal rate as requested
  const totalAnnualBenefit = Math.round((monthlySavings + monthlyRevenue) * 12);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-ink-900 mb-2">CFE Grid Simulation</h1>
          <p className="text-ink-600">Calculate your savings and revenue from selling excess energy to the CFE grid in Mexico.</p>
        </div>
        <button 
          onClick={handleRefreshRates}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-ink-700 hover:text-brand-600 hover:border-brand-300 hover:shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin text-brand-500" : ""} />
          {isRefreshing ? "Fetching CFE Rates..." : "Refresh CFE Rates"}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center">
              <Calculator size={20} />
            </div>
            <h2 className="text-xl font-display font-bold text-ink-900">System Parameters</h2>
          </div>

          <div className="space-y-8">
            {/* Tariff Selector */}
            <div>
              <label className="font-medium text-ink-900 block mb-3">Service Type (CFE Tariff)</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setTariff('residential')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    tariff === 'residential' 
                      ? 'border-brand-500 bg-brand-50 text-brand-700' 
                      : 'border-slate-100 hover:border-slate-200 text-ink-600'
                  }`}
                >
                  <Home size={24} />
                  <span className="font-semibold">Residential</span>
                  <span className="text-xs opacity-80">~${cfeRates.residential.toFixed(2)} MXN/kWh</span>
                </button>
                <button
                  onClick={() => setTariff('commercial')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    tariff === 'commercial' 
                      ? 'border-brand-500 bg-brand-50 text-brand-700' 
                      : 'border-slate-100 hover:border-slate-200 text-ink-600'
                  }`}
                >
                  <Building2 size={24} />
                  <span className="font-semibold">Commercial</span>
                  <span className="text-xs opacity-80">~${cfeRates.commercial.toFixed(2)} MXN/kWh</span>
                </button>
                <button
                  onClick={() => setTariff('industrial')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    tariff === 'industrial' 
                      ? 'border-brand-500 bg-brand-50 text-brand-700' 
                      : 'border-slate-100 hover:border-slate-200 text-ink-600'
                  }`}
                >
                  <Factory size={24} />
                  <span className="font-semibold">Industrial</span>
                  <span className="text-xs opacity-80">~${cfeRates.industrial.toFixed(2)} MXN/kWh</span>
                </button>
              </div>
            </div>

            {/* Consumption Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-medium text-ink-900">Monthly Consumption</label>
                <span className="font-bold text-brand-600">{consumption.toLocaleString()} kWh</span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="20000" 
                step="100"
                value={consumption}
                onChange={(e) => setConsumption(Number(e.target.value))}
                className="w-full accent-brand-500"
              />
              <div className="flex justify-between text-xs text-ink-600 mt-1">
                <span>500 kWh</span>
                <span>20,000+ kWh</span>
              </div>
            </div>

            {/* System Size Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-medium text-ink-900">Solar System Size</label>
                <span className="font-bold text-brand-600">{systemSize} kW</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="100" 
                step="1"
                value={systemSize}
                onChange={(e) => setSystemSize(Number(e.target.value))}
                className="w-full accent-brand-500"
              />
              <div className="flex justify-between text-xs text-ink-600 mt-1">
                <span>5 kW</span>
                <span>100 kW</span>
              </div>
            </div>

            {/* Sunlight Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-medium text-ink-900">Peak Sunlight Hours / Day</label>
                <span className="font-bold text-brand-600">{sunlight} hrs</span>
              </div>
              <input 
                type="range" 
                min="3" 
                max="7" 
                step="0.1"
                value={sunlight}
                onChange={(e) => setSunlight(Number(e.target.value))}
                className="w-full accent-brand-500"
              />
              <div className="flex justify-between text-xs text-ink-600 mt-1">
                <span>3 hrs</span>
                <span>7 hrs</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-display font-bold text-ink-900 mb-4 px-2 mt-2">Tariff Information</h3>
          
          <AccordionItem 
            title="Residential Rates" 
            isOpen={openAccordion === 'residential'} 
            onClick={() => toggleAccordion('residential')}
          >
            <p><strong>Tarifa 1, 1A-1F:</strong> Standard residential rates with government subsidies for low consumption. Once the high consumption limit is exceeded, the user is moved to the DAC tariff.</p>
            <p className="mt-3"><strong>Tarifa DAC (De Alto Consumo):</strong> High consumption residential rate. This tariff loses all government subsidies and has a significantly higher cost per kWh. Solar is highly recommended for DAC users to drop back to subsidized rates.</p>
          </AccordionItem>
          
          <AccordionItem 
            title="Commercial Rates" 
            isOpen={openAccordion === 'commercial'} 
            onClick={() => toggleAccordion('commercial')}
          >
            <p><strong>PDBT (Pequeña Demanda Baja Tensión):</strong> For businesses with a maximum demand of up to 25 kW. Billed a flat rate per kWh without capacity charges.</p>
            <p className="mt-3"><strong>GDBT (Gran Demanda Baja Tensión):</strong> For businesses with a demand greater than 25 kW in low voltage. Includes both energy (kWh) and capacity (kW) charges.</p>
          </AccordionItem>

          <AccordionItem 
            title="Industrial Rates" 
            isOpen={openAccordion === 'industrial'} 
            onClick={() => toggleAccordion('industrial')}
          >
            <p><strong>GDMTO (Gran Demanda Media Tensión Ordinaria):</strong> For industrial users with demand over 25 kW in medium voltage, billed with a single energy rate regardless of the time of day.</p>
            <p className="mt-3"><strong>GDMTH (Gran Demanda Media Tensión Horaria):</strong> For large industrial users. Energy is billed at different rates depending on the time of day (Base, Intermediate, Peak). Solar is extremely effective at offsetting Peak and Intermediate consumption.</p>
          </AccordionItem>
        </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-5 bg-ink-900 p-6 md:p-8 rounded-3xl text-white flex flex-col relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Zap size={250} />
          </div>
          
          <h2 className="text-xl font-display font-bold mb-6 relative z-10">Financial Projection (MXN)</h2>
          
          <div className="space-y-4 relative z-10 flex-1">
            <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-3 text-brand-400 mb-1">
                <DollarSign size={18} />
                <span className="font-medium text-sm">Total Annual Benefit</span>
              </div>
              <div className="text-4xl font-display font-bold">${totalAnnualBenefit.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-2">Combined savings and CFE revenue</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="text-slate-400 text-xs mb-1">Monthly Savings</div>
                <div className="text-xl font-bold">${Math.round(monthlySavings).toLocaleString()}</div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="text-slate-400 text-xs mb-1">Monthly CFE Sales</div>
                <div className="text-xl font-bold text-emerald-400">${Math.round(monthlyRevenue).toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-white/5 p-5 rounded-2xl border border-white/5 mt-4">
              <div className="flex items-center gap-3 text-blue-400 mb-3">
                <ArrowRightLeft size={18} />
                <span className="font-medium text-sm">Energy Flow (Monthly)</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Generated</span>
                    <span className="text-white">{monthlyGeneration.toLocaleString()} kWh</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Exported to CFE</span>
                    <span className="text-emerald-400">{excessEnergy.toLocaleString()} kWh</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${Math.min(100, (excessEnergy / monthlyGeneration) * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button className="mt-6 bg-brand-500 hover:bg-brand-600 text-white w-full py-4 rounded-xl font-bold transition-colors relative z-10">
            Request CFE Interconnection Quote
          </button>
        </motion.div>
      </div>
    </div>
  );
}
