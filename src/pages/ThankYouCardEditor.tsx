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
  Upload,
  MessageSquare
} from 'lucide-react';
import { useMemorial } from '../lib/MemorialContext';
import { TEMPLATES } from '../constants';
import { cn, normalizeThemeId } from '../lib/utils';

type EditableBlock = 'card-title' | 'message' | 'signature' | 'photo' | null;

const CARD_TITLE_PRESETS = [
  "Thank You",
  "With Heartfelt Thanks",
  "With Gratitude",
  "In Loving Appreciation",
  "Forever Grateful"
];

const MESSAGE_PRESETS = [
  "The family acknowledges with deep appreciation your kind expression of sympathy.",
  "Your thoughtfulness and support during our time of loss meant more than words can say. Thank you for your kindness.",
  "We are deeply grateful for your prayers, love, and support. Your kindness will always be remembered.",
  "Thank you for your kindness, prayers, and support during this difficult time. As we remember our loved one, your support has brought us comfort. We are deeply grateful for your presence and love."
];

export default function ThankYouCardEditor() {
  const { themeId } = useParams();
  const { memorialData, updateData } = useMemorial();
  const navigate = useNavigate();

  const [selectedBlock, setSelectedBlock] = useState<EditableBlock>(null);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);

  const [cardTitle, setCardTitle] = useState(memorialData.thanksCategory || "Thank You");
  const [messageText, setMessageText] = useState(
    memorialData.thanksMessage || MESSAGE_PRESETS[3]
  );
  const [signatureText, setSignatureText] = useState(
    memorialData.thanksSignature || "The Family"
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedTemplate = TEMPLATES.find(t => t.id === normalizeThemeId(themeId)) || TEMPLATES[0];

  const handleCardTitleChange = (val: string) => {
    setCardTitle(val);
    updateData({ thanksCategory: val });
  };

  const handleMessageChange = (val: string) => {
    setMessageText(val);
    updateData({ thanksMessage: val });
  };

  const handleSignatureChange = (val: string) => {
    setSignatureText(val);
    updateData({ thanksSignature: val });
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
      format: 'Thank You Note Card (4" x 6")',
      theme: selectedTemplate.name,
      themeId: selectedTemplate.id,
      themeImage: selectedTemplate.image,
      thankYouMessage: messageText,
      thanksSignature: signatureText
    });
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col font-sans selection:bg-[#967440]/20 relative">
      <Meta 
        title={`Edit ${selectedTemplate.name} Thank You Card`} 
        description="Live WYSIWYG editor for condolence and memorial thank you cards." 
      />

      {/* Top Header Matching Screenshot: "Watercolor Roses Change" + "Download" */}
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
        
        {/* Left Spacer for Balances */}
        <div className="lg:col-span-2 hidden lg:flex flex-col gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/70 space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Stationery Format</span>
            <p className="font-serif font-bold text-sm text-[#2c1810]">4" x 6" Flat Card</p>
            <p className="text-[11px] text-gray-500">Premium cardstock note of condolence gratitude.</p>
          </div>
        </div>

        {/* Center: Live Interactive Landscape 4x6 Card Canvas (Exact match for Screenshot) */}
        <div className="lg:col-span-6 flex justify-center items-center">
          <div id="thank-you-canvas" className="relative w-full max-w-[540px] aspect-[1.5/1] bg-white rounded-2xl shadow-[0_20px_60px_rgba(44,24,16,0.12)] border border-gray-100 overflow-hidden p-6 sm:p-8 flex items-center justify-center select-none">
            
            {/* Single Full Theme Background Photo */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <img 
                src={selectedTemplate.image} 
                alt="" 
                className="w-full h-full object-cover opacity-25 mix-blend-multiply" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/60 to-white/85 pointer-events-none" />
            </div>



            {/* Inner Content Grid */}
            <div className="relative z-10 w-full max-w-[440px] flex items-center justify-between gap-4 px-2">
              
              {/* Left: Circular Framed Portrait Photo (Exact Match for Screenshot) */}
              <div 
                onClick={() => setSelectedBlock('photo')}
                className={cn(
                  "relative shrink-0 p-1 rounded-full transition-all cursor-pointer",
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
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#8b6534] bg-[#f4ece4] flex items-center justify-center relative shadow-inner">
                  {memorialData.photoUrl ? (
                    <img 
                      src={memorialData.photoUrl} 
                      alt="Memorial Portrait" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 mb-1">
                        <span className="text-xl">👤</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Card Title, Gratitude Message, Signature Blocks */}
              <div className="flex-1 flex flex-col items-center text-center space-y-1.5 min-w-0">
                
                {/* Block 1: Card Title (Exact Match for Screenshot 3) */}
                <div 
                  onClick={() => setSelectedBlock('card-title')}
                  className={cn(
                    "relative w-full py-0.5 px-3 rounded-lg border transition-all cursor-pointer",
                    selectedBlock === 'card-title' 
                      ? "border-[#8b6534] bg-[#8b6534]/5 shadow-xs" 
                      : "border-dashed border-gray-200 hover:border-[#8b6534]/50"
                  )}
                >
                  {selectedBlock === 'card-title' && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c4033] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      Card title
                    </span>
                  )}
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#5c4033] tracking-tight">
                    {cardTitle}
                  </h3>
                  {/* Yellow Pointer on Right */}
                  <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                    ◀
                  </span>
                </div>

                {/* Block 2: Message (Exact Match for Screenshot 2) */}
                <div 
                  onClick={() => setSelectedBlock('message')}
                  className={cn(
                    "relative w-full p-2 rounded-lg border transition-all cursor-pointer",
                    selectedBlock === 'message' 
                      ? "border-[#8b6534] bg-[#8b6534]/5 shadow-xs" 
                      : "border-dashed border-gray-200 hover:border-[#8b6534]/50"
                  )}
                >
                  {selectedBlock === 'message' && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c4033] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      Message
                    </span>
                  )}
                  <p className="font-serif text-[11px] sm:text-xs text-[#5c4033] leading-relaxed line-clamp-4">
                    {messageText}
                  </p>
                  {/* Yellow Pointer on Right */}
                  <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                    ◀
                  </span>
                </div>

                {/* Block 3: Signature (Exact Match for Screenshot 1) */}
                <div 
                  onClick={() => setSelectedBlock('signature')}
                  className={cn(
                    "relative w-full py-0.5 px-3 rounded-lg border transition-all cursor-pointer",
                    selectedBlock === 'signature' 
                      ? "border-[#8b6534] bg-[#8b6534]/5 shadow-xs" 
                      : "border-dashed border-gray-200 hover:border-[#8b6534]/50"
                  )}
                >
                  {selectedBlock === 'signature' && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c4033] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      Signature
                    </span>
                  )}
                  <p className="font-serif italic text-xs text-[#7a5c43]">
                    {signatureText}
                  </p>
                  {/* Yellow Pointer on Right */}
                  <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                    ◀
                  </span>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Right Side: Contextual Block Inspector (Exact match for Screenshot 1, 2, 3) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 min-h-[420px]">
            
            {/* INSPECTOR 1: Card Title Selected (Exact Match for Screenshot 3) */}
            {selectedBlock === 'card-title' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-base font-semibold text-[#2c1810]">
                    <Edit3 size={16} className="text-[#8b6534]" />
                    <span>Card title</span>
                  </div>
                  <button 
                    onClick={() => setSelectedBlock(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {CARD_TITLE_PRESETS.map((preset) => {
                    const isSelected = cardTitle === preset;
                    return (
                      <button
                        key={preset}
                        onClick={() => handleCardTitleChange(preset)}
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
                    value={cardTitle}
                    onChange={(e) => handleCardTitleChange(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:border-[#8b6534] outline-none"
                  />
                </div>
              </div>
            )}

            {/* INSPECTOR 2: Message Selected (Exact Match for Screenshot 2) */}
            {selectedBlock === 'message' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-base font-semibold text-[#2c1810]">
                    <Edit3 size={16} className="text-[#8b6534]" />
                    <span>Message</span>
                  </div>
                  <button 
                    onClick={() => setSelectedBlock(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {MESSAGE_PRESETS.map((preset, idx) => {
                    const isSelected = messageText === preset;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleMessageChange(preset)}
                        className={cn(
                          "w-full text-left p-3 rounded-2xl border text-xs font-sans transition-all cursor-pointer leading-relaxed",
                          isSelected
                            ? "border-[#8b6534] bg-[#8b6534]/5 shadow-xs"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        )}
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a5c43]">
                    OR WRITE YOUR OWN
                  </label>
                  <textarea
                    rows={4}
                    value={messageText}
                    onChange={(e) => handleMessageChange(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-2xl p-3.5 text-xs font-sans text-gray-800 focus:border-[#8b6534] outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* INSPECTOR 3: Signature Selected (Exact Match for Screenshot 1) */}
            {selectedBlock === 'signature' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-base font-semibold text-[#2c1810]">
                    <Edit3 size={16} className="text-[#8b6534]" />
                    <span>Signature</span>
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
                    SIGNATURE
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={signatureText}
                      placeholder="e.g. The Family"
                      onChange={(e) => handleSignatureChange(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:border-[#8b6534] outline-none pr-8"
                    />
                    {signatureText && (
                      <button 
                        onClick={() => handleSignatureChange("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* INSPECTOR 4: Photo Selected */}
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

            {/* Default Idle State */}
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

      {/* Floating Support Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => navigate('/contact')}
          className="bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold py-3 px-5 rounded-full shadow-lg border border-gray-200 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
        >
          <MessageSquare size={16} className="text-[#8b6534]" />
          <span>Customer Support</span>
        </button>
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
                      navigate(`/editor/thank-you/${tmpl.id}`);
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
