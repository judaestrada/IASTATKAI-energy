import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, Home, Building2, Factory, Zap, MapPin, Calendar } from 'lucide-react';

interface JourneyFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JourneyForm({ isOpen, onClose }: JourneyFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: 'residential',
    monthlyBill: '',
    roofType: '',
    address: '',
    preferredDate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink-900/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-ink-900 hover:bg-slate-100 rounded-full transition-all z-10"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row min-h-[500px]">
              {/* Sidebar Info */}
              <div className="md:w-1/3 bg-brand-500 p-8 text-white flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <Zap size={28} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-display font-bold mb-4">Start Your Journey</h2>
                  <p className="text-brand-100 text-sm leading-relaxed">
                    Provide us with some basic information about your energy needs, and our experts will create a custom proposal for you.
                  </p>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-xs font-medium text-brand-100 uppercase tracking-widest">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 1 ? 'bg-white text-brand-500 border-white' : 'border-brand-300'}`}>1</span>
                    Basic Info
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium text-brand-100 uppercase tracking-widest">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 2 ? 'bg-white text-brand-500 border-white' : 'border-brand-300'}`}>2</span>
                    Property
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium text-brand-100 uppercase tracking-widest">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 3 ? 'bg-white text-brand-500 border-white' : 'border-brand-300'}`}>3</span>
                    Requirements
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="flex-1 p-8 md:p-12">
                {isSuccess ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12 }}
                      className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6"
                    >
                      <CheckCircle2 size={48} />
                    </motion.div>
                    <h3 className="text-2xl font-display font-bold text-ink-900 mb-2">Request Received!</h3>
                    <p className="text-ink-600 mb-8">Thank you for starting your journey with IASTATKAI. Our team will contact you within 24 hours.</p>
                    <button 
                      onClick={onClose}
                      className="w-full py-4 bg-ink-900 text-white rounded-xl font-medium hover:bg-ink-800 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="h-full flex flex-col">
                    <div className="flex-1">
                      {step === 1 && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-4"
                        >
                          <h4 className="text-lg font-semibold text-ink-900 mb-4">Basic Information</h4>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                            <input 
                              required
                              type="text" 
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="John Doe"
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                            <input 
                              required
                              type="email" 
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="john@example.com"
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                            <input 
                              required
                              type="tel" 
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+1 (555) 000-0000"
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                            />
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-4"
                        >
                          <h4 className="text-lg font-semibold text-ink-900 mb-4">Property Details</h4>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { id: 'residential', icon: Home, label: 'Home' },
                              { id: 'commercial', icon: Building2, label: 'Office' },
                              { id: 'industrial', icon: Factory, label: 'Factory' }
                            ].map((type) => (
                              <button
                                key={type.id}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, propertyType: type.id }))}
                                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                                  formData.propertyType === type.id 
                                    ? 'border-brand-500 bg-brand-50 text-brand-600' 
                                    : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                                }`}
                              >
                                <type.icon size={24} className="mb-2" />
                                <span className="text-xs font-bold">{type.label}</span>
                              </button>
                            ))}
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Property Address</label>
                            <div className="relative">
                              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input 
                                required
                                type="text" 
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="123 Solar St, Energy City"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-4"
                        >
                          <h4 className="text-lg font-semibold text-ink-900 mb-4">Energy Requirements</h4>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Monthly Energy Bill ($)</label>
                            <input 
                              required
                              type="number" 
                              name="monthlyBill"
                              value={formData.monthlyBill}
                              onChange={handleInputChange}
                              placeholder="e.g. 150"
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Roof Type</label>
                            <select 
                              required
                              name="roofType"
                              value={formData.roofType}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all appearance-none"
                            >
                              <option value="">Select Roof Type</option>
                              <option value="flat">Flat Roof</option>
                              <option value="sloped">Sloped / Shingle</option>
                              <option value="metal">Metal</option>
                              <option value="tile">Tile</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Preferred Consultation Date</label>
                            <div className="relative">
                              <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input 
                                required
                                type="date" 
                                name="preferredDate"
                                value={formData.preferredDate}
                                onChange={handleInputChange}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="flex gap-3 mt-8">
                      {step > 1 && (
                        <button
                          type="button"
                          onClick={prevStep}
                          className="flex-1 py-4 border border-slate-200 text-ink-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                        >
                          Back
                        </button>
                      )}
                      {step < 3 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          className="flex-[2] py-4 bg-ink-900 text-white rounded-xl font-medium hover:bg-ink-800 transition-colors"
                        >
                          Continue
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-[2] py-4 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                          {isSubmitting ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            >
                              <Zap size={20} />
                            </motion.div>
                          ) : (
                            <>
                              Submit Request
                              <Send size={18} />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
