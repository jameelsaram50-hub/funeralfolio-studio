import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Meta from '../components/Meta';
import { 
  Download, 
  Camera, 
  Edit3, 
  Check, 
  Sparkles,
  X,
  ChevronDown,
  Upload,
  Frame
} from 'lucide-react';
import { useMemorial } from '../lib/MemorialContext';
import { TEMPLATES } from '../constants';
import { cn, normalizeThemeId } from '../lib/utils';

type EditableBlock = 'photo' | 'name' | 'dates' | null;

const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 110 }, (_, i) => 2026 - i);

export default function PosterEditor() {
  const { themeId } = useParams();
  const { memorialData, updateData } = useMemorial();
  const navigate = useNavigate();

  const [selectedBlock, setSelectedBlock] = useState<EditableBlock>('photo');
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [posterSize, setPosterSize] = useState<'18x24' | '24x36'>('18x24');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedTemplate = TEMPLATES.find(t => t.id === normalizeThemeId(themeId)) || TEMPLATES[0];

  // Helper to parse dates into month, day, year
  const parseDate = (dateStr?: string, defaultMonth = "April", defaultDay = 12, defaultYear = 1945) => {
    if (!dateStr) return { month: defaultMonth, day: defaultDay, year: defaultYear };
    const parts = dateStr.split(/[-/]/);
    if (parts.length === 3) {
      const y = parseInt(parts[0]) || defaultYear;
      const m = parseInt(parts[1]) ? MONTHS[parseInt(parts[1]) - 1] || defaultMonth : defaultMonth;
      const d = parseInt(parts[2]) || defaultDay;
      return { month: m, day: d, year: y };
    }
    return { month: defaultMonth, day: defaultDay, year: defaultYear };
  };

  const [dobState, setDobState] = useState(() => parseDate(memorialData.dob, "April", 12, 1945));
  const [dodState, setDodState] = useState(() => parseDate(memorialData.dod, "August", 19, 2026));

  const handleDobChange = (field: 'month' | 'day' | 'year', val: any) => {
    const updated = { ...dobState, [field]: val };
    setDobState(updated);
    const monthNum = String(MONTHS.indexOf(updated.month) + 1).padStart(2, '0');
    const dayNum = String(updated.day).padStart(2, '0');
    updateData({ dob: `${updated.year}-${monthNum}-${dayNum}` });
  };

  const handleDodChange = (field: 'month' | 'day' | 'year', val: any) => {
    const updated = { ...dodState, [field]: val };
    setDodState(updated);
    const monthNum = String(MONTHS.indexOf(updated.month) + 1).padStart(2, '0');
    const dayNum = String(updated.day).padStart(2, '0');
    updateData({ dod: `${updated.year}-${monthNum}-${dayNum}` });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          updateData({ photoUrl: event.target.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProceedToDownload = () => {
    updateData({ 
      format: `Memorial Poster (${posterSize === '18x24' ? '18"x24"' : '24"x36"'})`,
      theme: selectedTemplate.name,
      themeId: selectedTemplate.id,
      themeImage: selectedTemplate.image,
      posterSize: posterSize
    });
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col font-sans selection:bg-[#967440]/20">
      <Meta 
        title={`Edit ${selectedTemplate.name} Memorial Poster`} 
        description="Live WYSIWYG editor for memorial tribute welcome signs and easel boards." 
      />

      {/* Top Bar Matching Screenshot: "Watercolor Roses Change" + "Download" */}
      <header className="bg-white border-b border-[#e8dfd8] px-6 sm:px-12 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-serif text-[#2c1810] font-normal">
            {selectedTemplate.name}
          </h1>
          <button
            onClick={() => setIsThemePickerOpen(true)}
            className="text-xs font-semibold text-[#967440] hover:text-[#7d5f30] underline underline-offset-4 cursor-pointer transition-colors"
          >
            Change
          </button>
        </div>

        <button
          onClick={handleProceedToDownload}
          className="bg-[#8b6534] hover:bg-[#785429] text-white font-bold text-sm py-2.5 px-7 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <Download size={16} />
          <span>Download</span>
        </button>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Spacer / Size Badge */}
        <div className="lg:col-span-2 hidden lg:flex flex-col gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/70 space-y-2">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Display Format</span>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setPosterSize('18x24')}
                className={cn(
                  "w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                  posterSize === '18x24'
                    ? "bg-[#5c4033] text-white shadow-xs"
                    : "bg-[#fbf9f6] text-gray-700 hover:bg-gray-100"
                )}
              >
                18" x 24" Easel Board
              </button>

              <button
                onClick={() => setPosterSize('24x36')}
                className={cn(
                  "w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                  posterSize === '24x36'
                    ? "bg-[#5c4033] text-white shadow-xs"
                    : "bg-[#fbf9f6] text-gray-700 hover:bg-gray-100"
                )}
              >
                24" x 36" Large Display
              </button>
            </div>
          </div>
        </div>

        {/* Center: Live Interactive Memorial Poster Preview (Exact match for Screenshot) */}
        <div className="lg:col-span-6 flex justify-center items-center w-full">
          <div id="poster-canvas" className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-[1/1.5] bg-white rounded-2xl shadow-[0_20px_60px_rgba(44,24,16,0.12)] border border-gray-100 overflow-hidden p-4 sm:p-8 flex flex-col justify-between select-none">
            
            {/* Single Full Theme Background Photo */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <img 
                src={selectedTemplate.image} 
                alt="" 
                className="w-full h-full object-cover opacity-25 mix-blend-multiply" 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/85 pointer-events-none" />
            </div>



            <div className="relative z-10 flex flex-col items-center justify-center h-full py-4 text-center space-y-4">
              
              {/* Block 1: Large Framed Portrait Photo (Exact Match) */}
              <div 
                onClick={() => setSelectedBlock('photo')}
                className={cn(
                  "relative p-1 rounded-2xl transition-all cursor-pointer",
                  selectedBlock === 'photo' 
                    ? "ring-2 ring-[#8b6534] shadow-md" 
                    : "hover:ring-1 hover:ring-[#8b6534]/40"
                )}
              >
                {selectedBlock === 'photo' && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c4033] text-white text-[10px] font-bold px-3 py-0.5 rounded-full z-20 shadow-xs">
                    Photo
                  </span>
                )}
                <div className="w-48 h-64 sm:w-52 sm:h-72 rounded-xl overflow-hidden border-2 border-[#8b6534]/40 bg-[#f4ece4] flex items-center justify-center relative shadow-inner">
                  {memorialData.photoUrl ? (
                    <img 
                      src={memorialData.photoUrl} 
                      alt="Memorial Portrait" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 mb-2">
                        <span className="text-3xl">👤</span>
                      </div>
                    </div>
                  )}
                </div>
                {/* Yellow Pointer on Right */}
                <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                  ◀
                </span>
              </div>

              {/* Block 2: Loved One Name (Exact Match) */}
              <div 
                onClick={() => setSelectedBlock('name')}
                className={cn(
                  "relative w-full max-w-[300px] py-1.5 px-3 rounded-lg border transition-all cursor-pointer",
                  selectedBlock === 'name' 
                    ? "border-[#8b6534] bg-[#8b6534]/5 shadow-xs" 
                    : "border-dashed border-gray-200 hover:border-[#8b6534]/50"
                )}
              >
                {selectedBlock === 'name' && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c4033] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                    Name
                  </span>
                )}
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#5c4033] tracking-tight">
                  {memorialData.name || 'Loved One'}
                </h2>
                {/* Yellow Pointer on Right */}
                <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                  ◀
                </span>
              </div>

              {/* Block 3: Dates (Exact Match) */}
              <div 
                onClick={() => setSelectedBlock('dates')}
                className={cn(
                  "relative w-full max-w-[300px] py-1 px-3 rounded-lg border transition-all cursor-pointer",
                  selectedBlock === 'dates' 
                    ? "border-[#8b6534] bg-[#8b6534]/5 shadow-xs" 
                    : "border-dashed border-gray-200 hover:border-[#8b6534]/50"
                )}
              >
                {selectedBlock === 'dates' && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c4033] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                    Dates
                  </span>
                )}
                <p className="font-serif italic text-xs sm:text-sm text-[#7a5c43]">
                  {dobState.month} {dobState.day}, {dobState.year} – {dodState.month} {dodState.day}, {dodState.year}
                </p>
                {/* Yellow Pointer on Right */}
                <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                  ◀
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* Right Side: Contextual Block Inspector (Exact match for Screenshot) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 min-h-[420px]">
            
            {/* STATE 1: Photo Selected (Exact Match for User's Screenshot) */}
            {selectedBlock === 'photo' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-base font-semibold text-[#2c1810]">
                    <Edit3 size={16} className="text-[#8b6534]" />
                    <span>Photo</span>
                  </div>
                  <button 
                    onClick={() => setSelectedBlock(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  accept="image/*" 
                  className="hidden" 
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-[#8b6534] hover:bg-[#785429] text-white font-semibold text-sm py-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Upload size={18} />
                  <span>Upload a photo</span>
                </button>

                <p className="text-xs text-gray-400 font-sans leading-relaxed">
                  The photo is framed and sized automatically to match this theme. It carries across every product.
                </p>
              </div>
            )}

            {/* STATE 2: Name Selected */}
            {selectedBlock === 'name' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-base font-semibold text-[#2c1810]">
                    <Edit3 size={16} className="text-[#8b6534]" />
                    <span>Name</span>
                  </div>
                  <button 
                    onClick={() => setSelectedBlock(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a5c43]">
                    LOVED ONE'S NAME
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={memorialData.name || ''}
                      placeholder="e.g. Loved One"
                      onChange={(e) => updateData({ name: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-serif font-bold text-gray-800 focus:border-[#8b6534] outline-none pr-8"
                    />
                    {memorialData.name && (
                      <button 
                        onClick={() => updateData({ name: '' })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 font-sans">
                    The name is automatically styled in prominent serif typography on the easel poster.
                  </p>
                </div>
              </div>
            )}

            {/* STATE 3: Dates Selected */}
            {selectedBlock === 'dates' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-base font-semibold text-[#2c1810]">
                    <Edit3 size={16} className="text-[#8b6534]" />
                    <span>Dates</span>
                  </div>
                  <button 
                    onClick={() => setSelectedBlock(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700">Date of birth</label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={dobState.month}
                      onChange={(e) => handleDobChange('month', e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:border-[#8b6534] outline-none"
                    >
                      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>

                    <select
                      value={dobState.day}
                      onChange={(e) => handleDobChange('day', parseInt(e.target.value))}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:border-[#8b6534] outline-none"
                    >
                      {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>

                    <select
                      value={dobState.year}
                      onChange={(e) => handleDobChange('year', parseInt(e.target.value))}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:border-[#8b6534] outline-none"
                    >
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-gray-700">Date of passing</label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={dodState.month}
                      onChange={(e) => handleDodChange('month', e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:border-[#8b6534] outline-none"
                    >
                      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>

                    <select
                      value={dodState.day}
                      onChange={(e) => handleDodChange('day', parseInt(e.target.value))}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:border-[#8b6534] outline-none"
                    >
                      {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>

                    <select
                      value={dodState.year}
                      onChange={(e) => handleDodChange('year', parseInt(e.target.value))}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:border-[#8b6534] outline-none"
                    >
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STATE 4: Default Idle State */}
            {!selectedBlock && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#fbf9f6] flex items-center justify-center text-[#8b6534]">
                  <Edit3 size={24} />
                </div>
                <p className="text-sm font-sans text-[#7a5c43] max-w-xs leading-relaxed">
                  Select any block on the preview to edit it here. Everything stays aligned automatically.
                </p>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Theme Picker Modal */}
      <AnimatePresence>
        {isThemePickerOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="font-serif font-bold text-2xl text-[#2c1810]">
                  Select Design Theme
                </h3>
                <button
                  onClick={() => setIsThemePickerOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      setIsThemePickerOpen(false);
                      navigate(`/editor/poster/${tmpl.id}`);
                    }}
                    className={cn(
                      "group rounded-2xl overflow-hidden border transition-all text-left p-2 cursor-pointer",
                      selectedTemplate.id === tmpl.id
                        ? "border-[#8b6534] bg-[#8b6534]/5 shadow-md scale-[1.02]"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-2">
                      <img src={tmpl.image} alt={tmpl.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="font-serif font-bold text-xs text-[#2c1810] truncate">
                      {tmpl.name}
                    </p>
                    <p className="text-[10px] text-gray-400">{tmpl.category}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
