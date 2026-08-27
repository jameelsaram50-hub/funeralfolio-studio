import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Meta from '../components/Meta';
import { 
  Download, 
  Camera, 
  Edit3, 
  Check, 
  BookOpen, 
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  Upload,
  Plus,
  Trash2,
  EyeOff,
  MessageCircle,
  Eye,
  ImageIcon
} from 'lucide-react';
import { useMemorial } from '../lib/MemorialContext';
import { TEMPLATES } from '../constants';
import { cn, normalizeThemeId } from '../lib/utils';

type EditableBlock = 
  | 'cover-title' 
  | 'photo' 
  | 'name' 
  | 'dates' 
  | 'service-details' 
  | 'order-of-service' 
  | 'obituary-section' 
  | 'poem-prayer' 
  | 'special-thanks' 
  | 'photo-collage' 
  | null;

type ProgramSide = 'cover' | 'inside' | 'back';

interface OrderItem {
  id: string;
  event: string;
  person: string;
}

const INITIAL_ORDER_ITEMS: OrderItem[] = [
  { id: '1', event: 'Processional', person: '' },
  { id: '2', event: 'Opening Prayer', person: '' },
  { id: '3', event: 'Hymn', person: '' },
  { id: '4', event: 'Scripture Reading', person: '' },
  { id: '5', event: 'Musical Selection', person: '' },
  { id: '6', event: 'Words of Remembrance', person: '' },
  { id: '7', event: 'Eulogy', person: '' },
  { id: '8', event: 'Closing Prayer', person: '' },
  { id: '9', event: 'Recessional', person: '' }
];

const COVER_TITLE_PRESETS = [
  "In Loving Memory",
  "Celebrating the Life of",
  "Celebration of Life",
  "In Remembrance",
  "Forever in Our Hearts",
  "Homegoing Celebration"
];

const QUICK_ORDER_TAGS = [
  "Welcome",
  "Obituary Reading",
  "Poem Reading",
  "Solo",
  "Acknowledgements",
  "Benediction"
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 110 }, (_, i) => 2026 - i);

export default function ProgramEditor() {
  const { themeId } = useParams();
  const { memorialData, updateData } = useMemorial();
  const navigate = useNavigate();

  const [activeSide, setActiveSide] = useState<ProgramSide>('cover');
  const [selectedBlock, setSelectedBlock] = useState<EditableBlock>('dates');
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [formatType, setFormatType] = useState<'Booklet' | 'Bi-Fold' | 'Tri-Fold'>('Booklet');
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);

  // Edit Obituary Modal State (Screenshot 1)
  const [isObituaryModalOpen, setIsObituaryModalOpen] = useState(false);
  const [obituarySectionHeading, setObituarySectionHeading] = useState("Obituary");
  const [obituaryText, setObituaryText] = useState(
    memorialData.obituaryText || ""
  );

  // Order of Service State (Screenshots 2 & 4 of Inside)
  const [orderHeading, setOrderHeading] = useState("Order of Service");
  const [orderItems, setOrderItems] = useState<OrderItem[]>(INITIAL_ORDER_ITEMS);
  const [isOrderHidden, setIsOrderHidden] = useState(false);
  const [isFreeTextMode, setIsFreeTextMode] = useState(false);

  // Poem / Prayer State (Screenshot 3 of Inside)
  const [poemTitle, setPoemTitle] = useState("An Irish Blessing");
  const [poemText, setPoemText] = useState(
    memorialData.poem || "May the road rise to meet you.\nMay the wind be always at your back.\nMay the sun shine warm upon your face,\nthe rains fall soft upon your fields.\n\nAnd until we meet again,\nmay God hold you in the palm of His hand."
  );
  const [isPoemHidden, setIsPoemHidden] = useState(false);

  // Special Thanks State (Screenshots of Back)
  const [specialThanksHeading, setSpecialThanksHeading] = useState("Special Thanks");
  const [specialThanksMessage, setSpecialThanksMessage] = useState(
    "The family of our loved one extends heartfelt gratitude for your prayers, support, and kindness during this time."
  );
  const [isSpecialThanksHidden, setIsSpecialThanksHidden] = useState(false);

  // Back Photo Collage State (6 grid photos)
  const [backPhotos, setBackPhotos] = useState<string[]>([]);
  const [isPhotoCollageHidden, setIsPhotoCollageHidden] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const backCollageInputRef = useRef<HTMLInputElement>(null);
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

  const [coverTitle, setCoverTitle] = useState(memorialData.tagline || "In Loving Memory");
  const [serviceDetails, setServiceDetails] = useState(
    memorialData.serviceDetails || "Grace Baptist Church\n456 Oak Avenue, Houston, TX\nSaturday, 11:00 AM"
  );

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

  const handleCoverTitleChange = (val: string) => {
    setCoverTitle(val);
    updateData({ tagline: val });
  };

  const handleServiceDetailsChange = (val: string) => {
    setServiceDetails(val);
    updateData({ serviceDetails: val });
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

  const handleBackPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && backPhotos.length < 6) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          setBackPhotos([...backPhotos, event.target.result]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const moveOrderItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...orderItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newItems.length) {
      const temp = newItems[index];
      newItems[index] = newItems[targetIndex];
      newItems[targetIndex] = temp;
      setOrderItems(newItems);
    }
  };

  const deleteOrderItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const addOrderItem = (eventText = '') => {
    const newItem: OrderItem = {
      id: String(Date.now()),
      event: eventText,
      person: ''
    };
    setOrderItems([...orderItems, newItem]);
  };

  const updateOrderItem = (id: string, field: 'event' | 'person', value: string) => {
    setOrderItems(orderItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleProceedToDownload = () => {
    updateData({ 
      format: `Funeral Program (${formatType})`,
      theme: selectedTemplate.name,
      themeId: selectedTemplate.id,
      themeImage: selectedTemplate.image,
      obituaryText: obituaryText,
      poem: poemText
    });
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col font-sans selection:bg-[#967440]/20 relative">
      <Meta 
        title={`Edit ${selectedTemplate.name} Funeral Program`} 
        description="Live WYSIWYG editor for memorial order of service booklets." 
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
        
        {/* Left Side: Side Selector (Cover / Inside / Back) & Format Dropdown */}
        <div className="lg:col-span-2 flex lg:flex-col gap-3 justify-center lg:justify-start">
          <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-gray-200/70 flex lg:flex-col gap-1 w-full max-w-[200px]">
            {/* Cover Button */}
            <button
              onClick={() => {
                setActiveSide('cover');
                setSelectedBlock('dates');
              }}
              className={cn(
                "relative flex items-center justify-between px-5 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer",
                activeSide === 'cover'
                  ? "bg-[#5c4033] text-white font-semibold shadow-xs"
                  : "bg-transparent text-[#5c4033] hover:bg-[#faf8f5]"
              )}
            >
              <span>Cover</span>
              <span className={cn(
                "text-xs transition-colors",
                activeSide === 'cover' ? "text-[#d4af37]" : "text-[#e5a93c]"
              )}>
                ◀
              </span>
            </button>

            {/* Inside Button */}
            <button
              onClick={() => {
                setActiveSide('inside');
                setSelectedBlock('order-of-service');
              }}
              className={cn(
                "relative flex items-center justify-between px-5 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer",
                activeSide === 'inside'
                  ? "bg-[#5c4033] text-white font-semibold shadow-xs"
                  : "bg-transparent text-[#5c4033] hover:bg-[#faf8f5]"
              )}
            >
              <span>Inside</span>
              <span className={cn(
                "text-xs transition-colors",
                activeSide === 'inside' ? "text-[#d4af37]" : "text-[#e5a93c]"
              )}>
                ◀
              </span>
            </button>

            {/* Back Button */}
            <button
              onClick={() => {
                setActiveSide('back');
                setSelectedBlock('special-thanks');
              }}
              className={cn(
                "relative flex items-center justify-between px-5 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer",
                activeSide === 'back'
                  ? "bg-[#5c4033] text-white font-semibold shadow-xs"
                  : "bg-transparent text-[#5c4033] hover:bg-[#faf8f5]"
              )}
            >
              <span>Back</span>
              <span className={cn(
                "text-xs transition-colors",
                activeSide === 'back' ? "text-[#d4af37]" : "text-[#e5a93c]"
              )}>
                ◀
              </span>
            </button>
          </div>

          {/* Booklet Selector Dropdown */}
          <div className="relative w-full max-w-[200px]">
            <button
              onClick={() => setIsFormatDropdownOpen(!isFormatDropdownOpen)}
              className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 flex items-center justify-between text-sm font-medium text-[#5c4033] hover:border-[#967440] transition-colors shadow-xs cursor-pointer"
            >
              <span>{formatType}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            <AnimatePresence>
              {isFormatDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-20 space-y-1"
                >
                  {(['Booklet', 'Bi-Fold', 'Tri-Fold'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => {
                        setFormatType(fmt);
                        setIsFormatDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer",
                        formatType === fmt ? "bg-[#5c4033] text-white" : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {fmt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center: Live Interactive Canvas Card Preview */}
        <div className="lg:col-span-6 flex justify-center items-center">
          
          {/* SIDE 1: COVER PAGE */}
          {activeSide === 'cover' && (
            <div id="program-canvas" className="relative w-full max-w-[420px] aspect-[1/1.5] bg-white rounded-2xl shadow-[0_20px_60px_rgba(44,24,16,0.12)] border border-gray-100 overflow-hidden p-6 sm:p-8 flex flex-col justify-between select-none">
              
              {/* Single Full Theme Background Photo */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <img 
                  src={selectedTemplate.image} 
                  alt="" 
                  className="w-full h-full object-cover opacity-25 mix-blend-multiply" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/85 pointer-events-none" />
              </div>



              <div className="relative z-10 flex flex-col items-center justify-between h-full py-4 text-center">
                
                {/* Block 1: Cover Title */}
                <div 
                  onClick={() => setSelectedBlock('cover-title')}
                  className={cn(
                    "relative w-full max-w-[280px] py-1.5 px-3 rounded-lg border transition-all cursor-pointer",
                    selectedBlock === 'cover-title' 
                      ? "border-[#8b6534] bg-[#8b6534]/5 shadow-xs" 
                      : "border-dashed border-gray-200 hover:border-[#8b6534]/50"
                  )}
                >
                  {selectedBlock === 'cover-title' && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c4033] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      Cover title
                    </span>
                  )}
                  <p className="font-serif italic text-lg sm:text-xl text-[#634832] font-medium tracking-wide">
                    {coverTitle}
                  </p>
                  <span className="absolute -right-2.5 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                    ◀
                  </span>
                </div>

                {/* Block 2: Photo */}
                <div 
                  onClick={() => setSelectedBlock('photo')}
                  className={cn(
                    "relative my-2 p-1 rounded-xl transition-all cursor-pointer",
                    selectedBlock === 'photo' 
                      ? "ring-2 ring-[#8b6534] shadow-md" 
                      : "hover:ring-1 hover:ring-[#8b6534]/40"
                  )}
                >
                  {selectedBlock === 'photo' && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c4033] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full z-20 shadow-xs">
                      Photo
                    </span>
                  )}
                  <div className="w-36 h-44 sm:w-40 sm:h-48 rounded-lg overflow-hidden border-2 border-[#8b6534]/40 bg-[#f4ece4] flex items-center justify-center relative">
                    {memorialData.photoUrl ? (
                      <img 
                        src={memorialData.photoUrl} 
                        alt="Memorial Portrait" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 mb-1">
                          <span className="text-2xl">👤</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="absolute -right-2.5 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                    ◀
                  </span>
                </div>

                {/* Block 3: Name */}
                <div 
                  onClick={() => setSelectedBlock('name')}
                  className={cn(
                    "relative w-full max-w-[280px] py-1 px-3 rounded-lg border transition-all cursor-pointer",
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
                  <span className="absolute -right-2.5 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                    ◀
                  </span>
                </div>

                {/* Block 4: Dates */}
                <div 
                  onClick={() => setSelectedBlock('dates')}
                  className={cn(
                    "relative w-full max-w-[280px] py-1 px-3 rounded-lg border transition-all cursor-pointer",
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
                  <span className="absolute -right-2.5 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                    ◀
                  </span>
                </div>

                {/* Block 5: Service Details */}
                <div 
                  onClick={() => setSelectedBlock('service-details')}
                  className={cn(
                    "relative w-full max-w-[280px] py-1.5 px-3 rounded-lg border transition-all cursor-pointer",
                    selectedBlock === 'service-details' 
                      ? "border-[#8b6534] bg-[#8b6534]/5 shadow-xs" 
                      : "border-dashed border-gray-200 hover:border-[#8b6534]/50"
                  )}
                >
                  {selectedBlock === 'service-details' && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c4033] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      Service details
                    </span>
                  )}
                  <p className="text-[10px] sm:text-[11px] text-gray-600 font-sans whitespace-pre-line leading-relaxed">
                    {serviceDetails}
                  </p>
                  <span className="absolute -right-2.5 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                    ◀
                  </span>
                </div>

              </div>
            </div>
          )}

          {/* SIDE 2: INSIDE SPREAD */}
          {activeSide === 'inside' && (
            <div id="program-canvas" className="relative w-full max-w-[760px] aspect-[1.5/1] sm:aspect-[1.6/1] bg-white rounded-2xl shadow-[0_20px_60px_rgba(44,24,16,0.12)] border border-gray-100 overflow-hidden grid grid-cols-2 select-none">
              
              {/* Left Page (Page 2: Obituary) */}
              <div className="relative p-3 sm:p-8 flex flex-col justify-between border-r border-gray-100 bg-[#fdfaf7]/30 overflow-hidden">
                {/* Single Full Theme Background Photo */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <img 
                    src={selectedTemplate.image} 
                    alt="" 
                    className="w-full h-full object-cover opacity-15 mix-blend-multiply" 
                  />
                  <div className="absolute inset-0 bg-white/70 pointer-events-none" />
                </div>

                <div className="relative z-10 space-y-2 sm:space-y-3">
                  <div
                    onClick={() => setIsObituaryModalOpen(true)}
                    className="p-2 sm:p-3 rounded-xl border border-dashed border-gray-200 hover:border-[#8b6534] transition-all cursor-pointer group"
                  >
                    <h3 className="font-serif italic text-xs sm:text-base text-[#634832] font-semibold border-b border-[#967440]/20 pb-0.5 sm:pb-1 mb-1 sm:mb-2">
                      {obituarySectionHeading}
                    </h3>
                    <p className="text-[9px] sm:text-xs text-gray-500 font-serif leading-relaxed line-clamp-6">
                      {obituaryText || "Your obituary will appear here. Click to write or paste."}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 flex justify-center pt-1 sm:pt-2">
                  <button
                    onClick={() => setIsObituaryModalOpen(true)}
                    className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-[10px] sm:text-[11px] font-semibold text-[#5c4033] shadow-2xs inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus size={12} />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Right Page (Page 3: Order of Service & Poem) */}
              <div className="relative p-3 sm:p-8 flex flex-col justify-between bg-white overflow-hidden">
                {/* Single Full Theme Background Photo */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <img 
                    src={selectedTemplate.image} 
                    alt="" 
                    className="w-full h-full object-cover opacity-15 mix-blend-multiply" 
                  />
                  <div className="absolute inset-0 bg-white/70 pointer-events-none" />
                </div>

                <div className="relative z-10 space-y-3">
                  {/* Order of Service Block */}
                  {!isOrderHidden && (
                    <div
                      onClick={() => setSelectedBlock('order-of-service')}
                      className={cn(
                        "relative p-3 rounded-xl border transition-all cursor-pointer text-left",
                        selectedBlock === 'order-of-service'
                          ? "border-[#8b6534] bg-[#8b6534]/5 shadow-xs"
                          : "border-dashed border-gray-200 hover:border-[#8b6534]"
                      )}
                    >
                      {selectedBlock === 'order-of-service' && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c4033] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          Order of Service
                        </span>
                      )}
                      <h4 className="font-serif italic text-sm text-[#634832] font-semibold mb-1.5 text-center">
                        {orderHeading}
                      </h4>
                      <div className="space-y-0.5 text-[9px] text-gray-700 font-sans">
                        {orderItems.slice(0, 9).map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-0.5">
                            <span className="font-medium text-gray-800">{item.event}</span>
                            <span className="text-gray-400 text-[8px]">{item.person}</span>
                          </div>
                        ))}
                      </div>
                      <span className="absolute -left-2 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                        ◀
                      </span>
                      <span className="absolute -right-2 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                        ◀
                      </span>
                    </div>
                  )}

                  {/* Poem / Prayer Block */}
                  {!isPoemHidden && (
                    <div
                      onClick={() => setSelectedBlock('poem-prayer')}
                      className={cn(
                        "relative p-3 rounded-xl border transition-all cursor-pointer text-left",
                        selectedBlock === 'poem-prayer'
                          ? "border-[#8b6534] bg-[#8b6534]/5 shadow-xs"
                          : "border-dashed border-gray-200 hover:border-[#8b6534]"
                      )}
                    >
                      {selectedBlock === 'poem-prayer' && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c4033] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          Poem / Prayer
                        </span>
                      )}
                      <h4 className="font-serif italic text-xs text-[#634832] font-semibold mb-1">
                        {poemTitle}
                      </h4>
                      <p className="text-[8.5px] text-gray-600 font-serif italic whitespace-pre-line leading-tight">
                        {poemText}
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative z-10 flex justify-center pt-2">
                  <button
                    onClick={() => {
                      if (isPoemHidden) setIsPoemHidden(false);
                      else addOrderItem('Reflection');
                    }}
                    className="px-4 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-[11px] font-semibold text-[#5c4033] shadow-2xs inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus size={13} />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SIDE 3: BACK COVER (Exact Match for User's Screenshot) */}
          {activeSide === 'back' && (
            <div id="program-canvas" className="relative w-full max-w-[420px] aspect-[1/1.5] bg-white rounded-2xl shadow-[0_20px_60px_rgba(44,24,16,0.12)] border border-gray-100 overflow-hidden p-6 sm:p-8 flex flex-col justify-between select-none text-center">
              
              {/* Single Full Theme Background Photo */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <img 
                  src={selectedTemplate.image} 
                  alt="" 
                  className="w-full h-full object-cover opacity-25 mix-blend-multiply" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/85 pointer-events-none" />
              </div>



              <div className="relative z-10 flex flex-col justify-between h-full py-4 space-y-4">
                
                {/* Upper Photo Collage Section (Matching User's Screenshot Grid) */}
                {!isPhotoCollageHidden && (
                  <div 
                    onClick={() => setSelectedBlock('photo-collage')}
                    className={cn(
                      "relative p-3 rounded-2xl border transition-all cursor-pointer mx-auto w-full max-w-[290px]",
                      selectedBlock === 'photo-collage' 
                        ? "border-[#8b6534] bg-[#8b6534]/5 shadow-xs" 
                        : "border-dashed border-gray-200 hover:border-[#8b6534]/50"
                    )}
                  >
                    <div className="grid grid-cols-3 gap-1.5 aspect-[3/2] bg-[#fbf9f6] p-1.5 rounded-xl border border-gray-100">
                      {[0, 1, 2, 3, 4, 5].map((idx) => (
                        <div 
                          key={idx} 
                          className="rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative"
                        >
                          {backPhotos[idx] ? (
                            <img src={backPhotos[idx]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={14} className="text-gray-300" />
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Yellow Pointer on Right */}
                    <span className="absolute -right-2.5 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                      ◀
                    </span>
                  </div>
                )}

                {/* Middle Special Thanks Block (Matching User's Screenshot) */}
                {!isSpecialThanksHidden && (
                  <div 
                    onClick={() => setSelectedBlock('special-thanks')}
                    className={cn(
                      "relative p-4 rounded-xl border transition-all cursor-pointer mx-auto w-full max-w-[290px]",
                      selectedBlock === 'special-thanks' 
                        ? "border-[#8b6534] bg-[#8b6534]/5 shadow-xs" 
                        : "border-dashed border-gray-200 hover:border-[#8b6534]/50"
                    )}
                  >
                    {selectedBlock === 'special-thanks' && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c4033] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                        Special Thanks
                      </span>
                    )}
                    <h4 className="font-serif italic text-sm text-[#634832] font-semibold mb-1">
                      {specialThanksHeading}
                    </h4>
                    <p className="text-[10px] text-gray-600 font-sans leading-relaxed">
                      {specialThanksMessage}
                    </p>
                  </div>
                )}

                {/* Bottom + Add Button (Matching Screenshot) */}
                <div className="pt-2 flex justify-center">
                  <button
                    onClick={() => {
                      if (isSpecialThanksHidden) setIsSpecialThanksHidden(false);
                      else if (isPhotoCollageHidden) setIsPhotoCollageHidden(false);
                      else setSelectedBlock('photo-collage');
                    }}
                    className="px-5 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-[#5c4033] shadow-2xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Right Side: Contextual Block Inspector */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 min-h-[420px]">
            
            {/* STATE 1: Dates Selected */}
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

            {/* STATE 2: Service Details Selected */}
            {selectedBlock === 'service-details' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-base font-semibold text-[#2c1810]">
                    <Edit3 size={16} className="text-[#8b6534]" />
                    <span>Service details</span>
                  </div>
                  <button 
                    onClick={() => setSelectedBlock(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#7a5c43]">
                    SERVICE DETAILS (SHOWN UNDER THE DATES)
                  </label>
                  <textarea
                    rows={4}
                    value={serviceDetails}
                    onChange={(e) => handleServiceDetailsChange(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-xs font-sans text-gray-800 focus:border-[#8b6534] outline-none resize-none leading-relaxed"
                  />
                  <p className="text-[11px] text-gray-400 font-sans">
                    Each line is centered and auto-sized on the cover.
                  </p>
                </div>
              </div>
            )}

            {/* STATE 3: Cover Title Selected */}
            {selectedBlock === 'cover-title' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-base font-semibold text-[#2c1810]">
                    <Edit3 size={16} className="text-[#8b6534]" />
                    <span>Cover title</span>
                  </div>
                  <button 
                    onClick={() => setSelectedBlock(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {COVER_TITLE_PRESETS.map((preset) => {
                    const isSelected = coverTitle === preset;
                    return (
                      <button
                        key={preset}
                        onClick={() => handleCoverTitleChange(preset)}
                        className={cn(
                          "px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer",
                          isSelected
                            ? "bg-[#5c4033] text-white shadow-xs"
                            : "bg-white border border-gray-200 text-gray-700 hover:border-[#8b6534]"
                        )}
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a5c43]">
                    OR WRITE YOUR OWN
                  </label>
                  <input
                    type="text"
                    value={coverTitle}
                    onChange={(e) => handleCoverTitleChange(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:border-[#8b6534] outline-none"
                  />
                </div>
              </div>
            )}

            {/* STATE 4: Photo Selected */}
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

            {/* STATE 4.5: Name Selected */}
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
                    The name is automatically styled in prominent serif typography on the cover.
                  </p>
                </div>
              </div>
            )}

            {/* STATE 5: Order of Service Selected */}
            {selectedBlock === 'order-of-service' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-base font-semibold text-[#2c1810]">
                    <Edit3 size={16} className="text-[#8b6534]" />
                    <span>Order of Service</span>
                  </div>
                  <button 
                    onClick={() => setSelectedBlock(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a5c43]">
                    SECTION HEADING
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={orderHeading}
                      onChange={(e) => setOrderHeading(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:border-[#8b6534] outline-none pr-8"
                    />
                    {orderHeading && (
                      <button 
                        onClick={() => setOrderHeading('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-wider text-[#7a5c43] pt-2">
                  <span className="col-span-6 pl-6">WHAT HAPPENS</span>
                  <span className="col-span-6">BY WHOM (OPTIONAL)</span>
                </div>

                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                  {orderItems.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-1.5 group">
                      <div className="flex flex-col text-gray-400 shrink-0">
                        <button
                          disabled={index === 0}
                          onClick={() => moveOrderItem(index, 'up')}
                          className="hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronUp size={12} />
                        </button>
                        <button
                          disabled={index === orderItems.length - 1}
                          onClick={() => moveOrderItem(index, 'down')}
                          className="hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronDown size={12} />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={item.event}
                        placeholder="e.g. Eulogy"
                        onChange={(e) => updateOrderItem(item.id, 'event', e.target.value)}
                        className="w-1/2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:border-[#8b6534] outline-none"
                      />

                      <input
                        type="text"
                        value={item.person}
                        placeholder="e.g. Rev. Smith"
                        onChange={(e) => updateOrderItem(item.id, 'person', e.target.value)}
                        className="w-1/2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:border-[#8b6534] outline-none"
                      />

                      <button
                        onClick={() => deleteOrderItem(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1 shrink-0 cursor-pointer transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => addOrderItem('')}
                  className="text-xs font-bold text-[#8b6534] hover:text-[#785429] inline-flex items-center gap-1 cursor-pointer pt-1"
                >
                  <Plus size={14} />
                  <span>Add item</span>
                </button>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Tap to add:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_ORDER_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => addOrderItem(tag)}
                        className="px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50/70 hover:bg-white text-[11px] font-medium text-gray-700 hover:border-[#8b6534] transition-colors cursor-pointer"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setIsOrderHidden(true);
                      setSelectedBlock(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <EyeOff size={13} />
                    <span>Hide section</span>
                  </button>
                </div>
              </div>
            )}

            {/* STATE 6: Poem / Prayer Selected */}
            {selectedBlock === 'poem-prayer' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-base font-semibold text-[#2c1810]">
                    <Edit3 size={16} className="text-[#8b6534]" />
                    <span>Poem / Prayer</span>
                  </div>
                  <button 
                    onClick={() => setSelectedBlock(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a5c43]">
                    TITLE
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={poemTitle}
                      onChange={(e) => setPoemTitle(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:border-[#8b6534] outline-none pr-8"
                    />
                    {poemTitle && (
                      <button 
                        onClick={() => setPoemTitle('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a5c43]">
                    TEXT
                  </label>
                  <textarea
                    rows={7}
                    value={poemText}
                    onChange={(e) => {
                      setPoemText(e.target.value);
                      updateData({ poem: e.target.value });
                    }}
                    className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-xs font-serif italic text-gray-800 focus:border-[#8b6534] outline-none resize-none leading-relaxed"
                  />
                  <p className="text-[11px] text-gray-400 font-sans">
                    Text automatically resizes to fit the page — no design skills needed.
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setIsPoemHidden(true);
                      setSelectedBlock(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <EyeOff size={13} />
                    <span>Hide section</span>
                  </button>
                </div>
              </div>
            )}

            {/* STATE 7: Special Thanks Selected (Exact Match for Back Screenshot) */}
            {selectedBlock === 'special-thanks' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-base font-semibold text-[#2c1810]">
                    <Edit3 size={16} className="text-[#8b6534]" />
                    <span>Special Thanks</span>
                  </div>
                  <button 
                    onClick={() => setSelectedBlock(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* SECTION HEADING Input (Exact Match) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a5c43]">
                    SECTION HEADING
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={specialThanksHeading}
                      onChange={(e) => setSpecialThanksHeading(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:border-[#8b6534] outline-none pr-8"
                    />
                    {specialThanksHeading && (
                      <button 
                        onClick={() => setSpecialThanksHeading('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* MESSAGE Textarea (Exact Match) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a5c43]">
                    MESSAGE
                  </label>
                  <textarea
                    rows={6}
                    value={specialThanksMessage}
                    onChange={(e) => {
                      setSpecialThanksMessage(e.target.value);
                      updateData({ thankYouMessage: e.target.value });
                    }}
                    className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-xs font-sans text-gray-800 focus:border-[#8b6534] outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Hide Section Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setIsSpecialThanksHidden(true);
                      setSelectedBlock(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <EyeOff size={13} />
                    <span>Hide section</span>
                  </button>
                </div>
              </div>
            )}

            {/* STATE 8: Photo Collage Selected on Back Page */}
            {selectedBlock === 'photo-collage' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-base font-semibold text-[#2c1810]">
                    <Edit3 size={16} className="text-[#8b6534]" />
                    <span>Photo Collage</span>
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
                  ref={backCollageInputRef} 
                  onChange={handleBackPhotoUpload} 
                  accept="image/*" 
                  className="hidden" 
                />

                <div className="space-y-3">
                  <button
                    onClick={() => backCollageInputRef.current?.click()}
                    className="w-full bg-[#8b6534] hover:bg-[#785429] text-white font-semibold text-xs py-3.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Upload size={16} />
                    <span>Add Collage Photo ({backPhotos.length}/6)</span>
                  </button>

                  {backPhotos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      {backPhotos.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => setBackPhotos(backPhotos.filter((_, idx) => idx !== i))}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 text-white flex items-center justify-center transition-opacity"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                    Upload up to 6 memory photos to fill the keepsake photo grid on the back of the booklet.
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setIsPhotoCollageHidden(true);
                      setSelectedBlock(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <EyeOff size={13} />
                    <span>Hide section</span>
                  </button>
                </div>
              </div>
            )}

            {/* STATE 9: Default Idle State */}
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

      {/* EDIT OBITUARY MODAL */}
      <AnimatePresence>
        {isObituaryModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-3xl p-6 sm:p-10 max-w-3xl w-full shadow-2xl space-y-6 border border-gray-100"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="font-serif font-bold text-2xl text-[#2c1810]">
                  Edit Obituary
                </h3>
                <button
                  onClick={() => setIsObituaryModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7a5c43]">
                  SECTION HEADING
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={obituarySectionHeading}
                    onChange={(e) => setObituarySectionHeading(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:border-[#8b6534] outline-none pr-8"
                  />
                  {obituarySectionHeading && (
                    <button 
                      onClick={() => setObituarySectionHeading('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7a5c43]">
                  OBITUARY TEXT
                </label>
                <textarea
                  rows={8}
                  value={obituaryText}
                  placeholder="Paste or write the obituary here..."
                  onChange={(e) => {
                    setObituaryText(e.target.value);
                    updateData({ obituaryText: e.target.value });
                  }}
                  className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm font-serif text-gray-800 focus:border-[#8b6534] outline-none resize-none leading-relaxed placeholder:text-gray-400"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsObituaryModalOpen(false)}
                  className="bg-[#8b6534] hover:bg-[#785429] text-white font-bold text-sm px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Customer Support Button */}
      <button 
        onClick={() => navigate('/contact')}
        className="fixed bottom-6 right-6 z-40 bg-white border border-gray-200/90 text-[#5c4033] hover:text-[#8b6534] hover:border-[#8b6534]/50 px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl font-medium text-xs flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
      >
        <MessageCircle size={16} className="text-[#8b6534]" />
        <span>Customer Support</span>
      </button>

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
                      navigate(`/editor/program/${tmpl.id}`);
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
