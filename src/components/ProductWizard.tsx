import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, ArrowRight, ArrowLeft, Check, Sparkles, X, User } from 'lucide-react';
import { TEMPLATES } from '../constants';
import { useMemorial } from '../lib/MemorialContext';
import { cn } from '../lib/utils';

interface ProductWizardProps {
  productType: 'prayer' | 'invitation' | 'thank-you' | 'program' | 'poster';
  productTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectTheme: (themeId: string) => void;
}

export default function ProductWizard({
  productType,
  productTitle,
  isOpen,
  onClose,
  onSelectTheme,
}: ProductWizardProps) {
  const { memorialData, updateData } = useMemorial();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState(memorialData.name || '');
  const [dob, setDob] = useState(memorialData.dob || '');
  const [dod, setDod] = useState(memorialData.dod || '');
  const [photoUrl, setPhotoUrl] = useState(memorialData.photoUrl || '');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const categories = ['All', 'Floral', 'Classic', 'Modern', 'Nature', 'Religious'];

  const filteredTemplates = TEMPLATES.filter(
    (t) => selectedCategory === 'All' || t.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  const getTitle = () => {
    if (productTitle) return productTitle;
    if (productType === 'prayer') return 'Start Your Prayer Card';
    if (productType === 'invitation') return 'Start Your Funeral Invitation';
    if (productType === 'thank-you') return 'Start Your Thank You Card';
    if (productType === 'program') return 'Start Your Funeral Program';
    if (productType === 'poster') return 'Start Your Memorial Poster';
    return 'Start Your Memorial Stationery';
  };

  const handleNextStep = () => {
    updateData({
      name: name.trim() || 'Loved One',
      dob,
      dod,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    });
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhotoUrl(result);
        updateData({ photoUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectTheme = (themeId: string) => {
    updateData({
      name: name.trim() || 'Loved One',
      dob,
      dod,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
      themeId,
    });
    onSelectTheme(themeId);
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]"
      >
        {/* Header Bar */}
        <div className="relative pt-8 pb-4 px-6 text-center border-b border-gray-100 bg-[#fdfaf7]">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <h2 className="text-3xl sm:text-4xl font-serif text-[#2c1810] font-medium tracking-tight">
            {getTitle()}
          </h2>

          {/* 3-Step Progress Indicator Matching Screenshot 1 */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {/* Step 1: Name */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                  step === 1
                    ? 'bg-[#967440] text-white ring-4 ring-[#967440]/20'
                    : step > 1
                    ? 'bg-[#2c1810] text-[#d2c2ad]'
                    : 'bg-gray-100 text-gray-400'
                )}
              >
                {step > 1 ? <Check size={16} /> : '1'}
              </div>
              <span className={cn('text-[11px] font-semibold', step === 1 ? 'text-[#967440]' : 'text-gray-500')}>
                Name
              </span>
            </div>

            <div className={cn('w-12 h-0.5 rounded transition-all', step > 1 ? 'bg-[#2c1810]' : 'bg-gray-200')} />

            {/* Step 2: Photo */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                  step === 2
                    ? 'bg-[#967440] text-white ring-4 ring-[#967440]/20'
                    : step > 2
                    ? 'bg-[#2c1810] text-[#d2c2ad]'
                    : 'bg-gray-100 text-gray-400'
                )}
              >
                {step > 2 ? <Check size={16} /> : '2'}
              </div>
              <span className={cn('text-[11px] font-semibold', step === 2 ? 'text-[#967440]' : 'text-gray-500')}>
                Photo
              </span>
            </div>

            <div className={cn('w-12 h-0.5 rounded transition-all', step === 3 ? 'bg-[#967440]' : 'bg-gray-200')} />

            {/* Step 3: Theme */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                  step === 3
                    ? 'bg-[#967440] text-white ring-4 ring-[#967440]/20'
                    : 'bg-gray-100 text-gray-400'
                )}
              >
                3
              </div>
              <span className={cn('text-[11px] font-semibold', step === 3 ? 'text-[#967440]' : 'text-gray-500')}>
                Theme
              </span>
            </div>
          </div>
        </div>

        {/* Wizard Content Body */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {/* STEP 1: Empathetic Name Prompt */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-xl mx-auto space-y-8 text-center py-4"
              >
                <p className="text-gray-600 text-base sm:text-lg font-sans leading-relaxed">
                  Tell us who you're creating this for, then we'll personalize each theme preview.
                </p>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && name.trim()) handleNextStep();
                      }}
                      placeholder="Who are we remembering today?"
                      className="w-full text-center text-xl sm:text-2xl font-serif py-5 px-6 rounded-2xl border-2 border-[#967440]/40 focus:border-[#967440] focus:ring-4 focus:ring-[#967440]/10 outline-hidden bg-[#fdfaf7] text-[#2c1810] placeholder:text-gray-400/80 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleNextStep}
                    disabled={!name.trim()}
                    className="w-full sm:w-auto min-w-[200px] bg-[#967440] hover:bg-[#856535] disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <span>Continue</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Photo & Optional Dates */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-xl mx-auto space-y-6 text-center py-2"
              >
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#2c1810]">
                    Add a portrait of {name || 'your loved one'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload a favorite photo. You can easily adjust or crop it in the editor.
                  </p>
                </div>

                {/* Photo Preview & Dropzone */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#967440]/30 shadow-xl bg-gray-50 group">
                    <img
                      src={
                        photoUrl ||
                        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop'
                      }
                      alt="Memorial Portrait Preview"
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                      <Camera size={22} />
                      <span className="text-[10px] font-bold mt-1">Change</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>

                  <label className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#fdfaf7] border border-[#967440]/40 text-[#2c1810] text-xs font-bold uppercase tracking-wider hover:bg-[#f5efe6] transition-colors cursor-pointer">
                    <Camera size={14} className="text-[#967440]" />
                    <span>Upload Photo</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                {/* Optional Dates */}
                <div className="grid grid-cols-2 gap-4 text-left pt-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                      Birth Date (Optional)
                    </label>
                    <input
                      type="text"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      placeholder="e.g. April 12, 1945"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-[#2c1810] focus:border-[#967440] focus:ring-1 focus:ring-[#967440] outline-hidden bg-[#fdfaf7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                      Date of Passing (Optional)
                    </label>
                    <input
                      type="text"
                      value={dod}
                      onChange={(e) => setDod(e.target.value)}
                      placeholder="e.g. August 19, 2026"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-[#2c1810] focus:border-[#967440] focus:ring-1 focus:ring-[#967440] outline-hidden bg-[#fdfaf7]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={handleNextStep}
                    className="bg-[#967440] hover:bg-[#856535] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-7 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Choose Design Theme</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Personalized Theme Selection Grid */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-xl font-serif font-bold text-[#2c1810]">
                    Select a theme for {name}'s {productType === 'prayer' ? 'Prayer Card' : productType === 'invitation' ? 'Invitation' : 'Thank You Card'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Click any design to open the Live Customization Editor.
                  </p>
                </div>

                {/* Category Pills */}
                <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        'px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
                        selectedCategory === cat
                          ? 'bg-[#2c1810] text-[#f7f5f2] shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Personalized Theme Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[460px] overflow-y-auto pr-1">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleSelectTheme(template.id)}
                      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:border-[#967440] hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      <div className="relative aspect-[2.5/4.1] bg-gray-50 overflow-hidden">
                        {/* Background Artwork */}
                        <img
                          src={template.image}
                          alt={template.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

                        {/* Personalized Dynamic Card Face */}
                        <div className="absolute inset-0 p-3 flex flex-col items-center justify-between text-center bg-gradient-to-b from-white/90 via-white/30 to-black/40">
                          <p className="font-serif text-[8px] font-bold text-[#2c1810] tracking-wider uppercase">
                            In Loving Memory
                          </p>

                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                            <img
                              src={
                                photoUrl ||
                                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop'
                              }
                              alt={name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/40 shadow-xs max-w-full">
                            <h5 className="font-serif text-[10px] font-bold text-[#2c1810] truncate">
                              {name || 'Loved One'}
                            </h5>
                          </div>
                        </div>

                        {/* Hover Overlay Button */}
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                          <button className="w-full bg-[#967440] text-white py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider shadow-sm">
                            Customize Card
                          </button>
                        </div>
                      </div>

                      <div className="p-2.5 text-center bg-white border-t border-gray-100">
                        <h4 className="font-serif text-xs font-bold text-[#2c1810] truncate group-hover:text-[#967440] transition-colors">
                          {template.name}
                        </h4>
                        <span className="text-[8px] uppercase tracking-widest text-gray-400 font-semibold">
                          {template.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
