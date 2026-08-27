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

type EditableBlock = 'invitation-title' | 'name' | 'photo' | 'datetime' | 'location' | 'footer-message' | null;

const INVITATION_TITLE_PRESETS = [
  "Celebration of Life",
  "In Loving Memory",
  "Memorial Service",
  "Funeral Service",
  "Homegoing Celebration"
];

export default function InvitationEditor() {
  const { themeId } = useParams();
  const { memorialData, updateData } = useMemorial();
  const navigate = useNavigate();

  const [selectedBlock, setSelectedBlock] = useState<EditableBlock>(null);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);

  // Form States matching screenshots
  const [invitationTitle, setInvitationTitle] = useState(
    memorialData.tagline || "Celebration of Life"
  );
  const [serviceDate, setServiceDate] = useState(
    memorialData.serviceDate || "08/28/2026"
  );
  const [serviceTime, setServiceTime] = useState(
    memorialData.serviceTime || "11:00 AM"
  );
  const [venue, setVenue] = useState(
    memorialData.serviceVenue || "Grace Baptist Church"
  );
  const [address, setAddress] = useState(
    memorialData.serviceAddress || "456 Oak Avenue, Houston, TX"
  );
  const [footerMessage, setFooterMessage] = useState(
    memorialData.receptionDetails || "Reception to follow"
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedTemplate = TEMPLATES.find(t => t.id === normalizeThemeId(themeId)) || TEMPLATES[0];

  const handleTitleChange = (val: string) => {
    setInvitationTitle(val);
    updateData({ tagline: val });
  };

  const handleDateChange = (val: string) => {
    setServiceDate(val);
    updateData({ serviceDate: val });
  };

  const handleTimeChange = (val: string) => {
    setServiceTime(val);
    updateData({ serviceTime: val });
  };

  const handleVenueChange = (val: string) => {
    setVenue(val);
    updateData({ serviceVenue: val });
  };

  const handleAddressChange = (val: string) => {
    setAddress(val);
    updateData({ serviceAddress: val });
  };

  const handleFooterMessageChange = (val: string) => {
    setFooterMessage(val);
    updateData({ receptionDetails: val });
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
      format: 'Funeral Invitation Card (5" x 7")',
      theme: selectedTemplate.name,
      themeId: selectedTemplate.id,
      themeImage: selectedTemplate.image
    });
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col font-sans selection:bg-[#967440]/20 relative">
      <Meta 
        title={`Edit ${selectedTemplate.name} Funeral Invitation`} 
        description="Live WYSIWYG editor for celebration of life and funeral service announcement cards." 
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
            <p className="font-serif font-bold text-sm text-[#2c1810]">5" x 7" Service Card</p>
            <p className="text-[11px] text-gray-500">Elegant funeral & memorial ceremony announcement.</p>
          </div>
        </div>

        {/* Center: Live Interactive 5x7 Invitation Canvas (Exact match for Screenshots) */}
        <div className="lg:col-span-6 flex justify-center items-center w-full">
          <div id="invitation-canvas" className="relative w-full max-w-[340px] sm:max-w-[390px] aspect-[1/1.42] bg-white rounded-2xl shadow-[0_20px_60px_rgba(44,24,16,0.12)] border border-gray-100 overflow-hidden p-4 sm:p-8 flex flex-col justify-between select-none">
            
            {/* Single Full Theme Background Photo */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <img 
                src={selectedTemplate.image} 
                alt="" 
                className="w-full h-full object-cover opacity-25 mix-blend-multiply" 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/85 pointer-events-none" />
            </div>



            <div className="relative z-10 flex flex-col items-center justify-between h-full py-1 text-center space-y-2">
              
              {/* Block 1: Invitation Title (Exact Match for Screenshot 5) */}
              <div 
                onClick={() => setSelectedBlock('invitation-title')}
                className={cn(
                  "relative w-full max-w-[260px] py-1 px-3 rounded-lg border transition-all cursor-pointer",
                  selectedBlock === 'invitation-title' 
                    ? "border-[#8b6534] bg-[#8b6534]/5 shadow-xs" 
                    : "border-dashed border-gray-200 hover:border-[#8b6534]/50"
                )}
              >
                {selectedBlock === 'invitation-title' && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c4033] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                    Invitation title
                  </span>
                )}
                <p className="font-serif italic text-base sm:text-lg text-[#634832] font-medium tracking-wide">
                  {invitationTitle}
                </p>
                {/* Yellow Pointer on Right */}
                <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                  ◀
                </span>
              </div>

              {/* Block 2: Honoree Name (Exact Match for Screenshot 4) */}
              <div 
                onClick={() => setSelectedBlock('name')}
                className={cn(
                  "relative w-full max-w-[260px] py-0.5 px-3 rounded-lg border transition-all cursor-pointer",
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
                <h2 className="font-serif font-bold text-2xl sm:text-[26px] text-[#5c4033] tracking-tight">
                  {memorialData.name || 'Loved One'}
                </h2>
                {/* Yellow Pointer on Right */}
                <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                  ◀
                </span>
              </div>

              {/* Block 3: Framed Portrait Photo (Exact Match for Screenshots) */}
              <div 
                onClick={() => setSelectedBlock('photo')}
                className={cn(
                  "relative my-1 p-1 rounded-xl transition-all cursor-pointer",
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
                <div className="w-32 h-40 sm:w-36 sm:h-44 rounded-lg overflow-hidden border-2 border-[#8b6534]/40 bg-[#f4ece4] flex items-center justify-center relative">
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
                {/* Yellow Pointer on Right */}
                <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                  ◀
                </span>
              </div>

              {/* Lower Info Group (Date & Time, Location, Footer Message) */}
              <div className="w-full space-y-1.5 pt-1">
                
                {/* Block 4: Date & Time (Exact Match for Screenshot 3) */}
                <div 
                  onClick={() => setSelectedBlock('datetime')}
                  className={cn(
                    "relative w-full max-w-[280px] mx-auto py-1 px-3 rounded-lg border transition-all cursor-pointer",
                    selectedBlock === 'datetime' 
                      ? "border-[#8b6534] bg-[#8b6534]/5 shadow-xs" 
                      : "border-dashed border-gray-200 hover:border-[#8b6534]/50"
                  )}
                >
                  {selectedBlock === 'datetime' && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c4033] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      Date & time
                    </span>
                  )}
                  <p className="font-serif text-xs font-bold text-[#5c4033]">
                    {serviceDate} at {serviceTime}
                  </p>
                  {/* Yellow Pointer on Right */}
                  <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                    ◀
                  </span>
                </div>

                {/* Block 5: Location (Exact Match for Screenshot 2) */}
                <div 
                  onClick={() => setSelectedBlock('location')}
                  className={cn(
                    "relative w-full max-w-[280px] mx-auto py-1 px-3 rounded-lg border transition-all cursor-pointer",
                    selectedBlock === 'location' 
                      ? "border-[#8b6534] bg-[#8b6534]/5 shadow-xs" 
                      : "border-dashed border-gray-200 hover:border-[#8b6534]/50"
                  )}
                >
                  {selectedBlock === 'location' && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c4033] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      Location
                    </span>
                  )}
                  <p className="font-serif text-[11px] font-semibold text-[#5c4033] leading-tight">
                    {venue}
                  </p>
                  <p className="text-[10px] text-gray-500 font-sans leading-tight">
                    {address}
                  </p>
                  {/* Yellow Pointer on Right */}
                  <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                    ◀
                  </span>
                </div>

                {/* Block 6: Footer Message (Exact Match for Screenshot 1) */}
                <div 
                  onClick={() => setSelectedBlock('footer-message')}
                  className={cn(
                    "relative w-full max-w-[280px] mx-auto py-0.5 px-3 rounded-lg border transition-all cursor-pointer",
                    selectedBlock === 'footer-message' 
                      ? "border-[#8b6534] bg-[#8b6534]/5 shadow-xs" 
                      : "border-dashed border-gray-200 hover:border-[#8b6534]/50"
                  )}
                >
                  {selectedBlock === 'footer-message' && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c4033] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      Footer message
                    </span>
                  )}
                  <p className="font-serif italic text-[11px] text-[#7a5c43]">
                    {footerMessage}
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

        {/* Right Side: Contextual Block Inspector Matching Screenshots */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 min-h-[420px]">
            
            {/* INSPECTOR 1: Invitation Title Selected (Exact Match for Screenshot 5) */}
            {selectedBlock === 'invitation-title' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-base font-semibold text-[#2c1810]">
                    <Edit3 size={16} className="text-[#8b6534]" />
                    <span>Invitation title</span>
                  </div>
                  <button 
                    onClick={() => setSelectedBlock(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {INVITATION_TITLE_PRESETS.map((preset) => {
                    const isSelected = invitationTitle === preset;
                    return (
                      <button
                        key={preset}
                        onClick={() => handleTitleChange(preset)}
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
                  <div className="relative">
                    <input
                      type="text"
                      value={invitationTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:border-[#8b6534] outline-none pr-8"
                    />
                    {invitationTitle && (
                      <button 
                        onClick={() => handleTitleChange("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* INSPECTOR 2: Name Selected (Exact Match for Screenshot 4) */}
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
                    FULL NAME
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={memorialData.name || ''}
                      placeholder="e.g. Eleanor May Johnson"
                      onChange={(e) => updateData({ name: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-serif font-bold text-gray-800 focus:border-[#8b6534] outline-none pr-8"
                    />
                    {memorialData.name && (
                      <button 
                        onClick={() => updateData({ name: '' })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* INSPECTOR 3: Date & Time Selected (Exact Match for Screenshot 3) */}
            {selectedBlock === 'datetime' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-base font-semibold text-[#2c1810]">
                    <Edit3 size={16} className="text-[#8b6534]" />
                    <span>Date & time</span>
                  </div>
                  <button 
                    onClick={() => setSelectedBlock(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7a5c43] mb-1.5">
                      SERVICE DATE
                    </label>
                    <input
                      type="text"
                      value={serviceDate}
                      placeholder="MM/DD/YYYY"
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:border-[#8b6534] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7a5c43] mb-1.5">
                      TIME
                    </label>
                    <input
                      type="text"
                      value={serviceTime}
                      placeholder="e.g. 11:00 AM"
                      onChange={(e) => handleTimeChange(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:border-[#8b6534] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* INSPECTOR 4: Location Selected (Exact Match for Screenshot 2) */}
            {selectedBlock === 'location' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-base font-semibold text-[#2c1810]">
                    <Edit3 size={16} className="text-[#8b6534]" />
                    <span>Location</span>
                  </div>
                  <button 
                    onClick={() => setSelectedBlock(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7a5c43] mb-1.5">
                      VENUE
                    </label>
                    <input
                      type="text"
                      value={venue}
                      placeholder="e.g. Grace Baptist Church"
                      onChange={(e) => handleVenueChange(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:border-[#8b6534] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7a5c43] mb-1.5">
                      ADDRESS
                    </label>
                    <input
                      type="text"
                      value={address}
                      placeholder="e.g. 456 Oak Avenue, Houston, TX"
                      onChange={(e) => handleAddressChange(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:border-[#8b6534] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* INSPECTOR 5: Footer Message Selected (Exact Match for Screenshot 1) */}
            {selectedBlock === 'footer-message' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-base font-semibold text-[#2c1810]">
                    <Edit3 size={16} className="text-[#8b6534]" />
                    <span>Footer message</span>
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
                    FOOTER MESSAGE
                  </label>
                  <input
                    type="text"
                    value={footerMessage}
                    placeholder="e.g. Reception to follow"
                    onChange={(e) => handleFooterMessageChange(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:border-[#8b6534] outline-none"
                  />
                </div>
              </div>
            )}

            {/* INSPECTOR 6: Photo Selected */}
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
                      navigate(`/editor/invitation/${tmpl.id}`);
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
