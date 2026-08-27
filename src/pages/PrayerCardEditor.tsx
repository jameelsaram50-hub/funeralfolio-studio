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
  MessageSquare
} from 'lucide-react';
import { useMemorial } from '../lib/MemorialContext';
import { TEMPLATES } from '../constants';
import { cn, normalizeThemeId } from '../lib/utils';

type EditableBlock = 'cover-title' | 'photo' | 'name' | 'dates' | 'prayer' | null;

const COVER_TITLE_PRESETS = [
  "Forever in Our Hearts",
  "In Loving Memory",
  "In Remembrance",
  "Celebration of Life"
];

const PRAYER_LIBRARY = [
  {
    id: "do-not-stand",
    title: "Do Not Stand at My Grave and Weep",
    text: `Do not stand at my grave and weep,\nI am not there; I do not sleep.\nI am a thousand winds that blow,\nI am the diamond glints on snow,\nI am the sun on ripened grain,\nI am the gentle autumn rain.\n\nWhen you awaken in the morning's hush\nI am the swift uplifting rush\nof quiet birds in circled flight.\nI am the soft stars that shine at night.\n\nDo not stand at my grave and cry,\nI am not there; I did not die.`
  },
  {
    id: "psalm-23",
    title: "The 23rd Psalm",
    text: `The Lord is my shepherd; I shall not want.\nHe maketh me to lie down in green pastures:\nHe leadeth me beside the still waters.\nHe restoreth my soul:\nHe leadeth me in the paths of righteousness for His name's sake.\n\nYea, though I walk through the valley of the shadow of death,\nI will fear no evil: for Thou art with me;\nThy rod and Thy staff they comfort me.\n\nThou preparest a table before me in the presence of mine enemies:\nThou anointest my head with oil; my cup runneth over.\nSurely goodness and mercy shall follow me all the days of my life:\nAnd I will dwell in the house of the Lord for ever.`
  },
  {
    id: "lords-prayer",
    title: "The Lord's Prayer",
    text: `Our Father, who art in heaven,\nhallowed be thy name;\nthy kingdom come;\nthy will be done;\non earth as it is in heaven.\nGive us this day our daily bread.\nAnd forgive us our trespasses,\nas we forgive those who trespass against us.\nAnd lead us not into temptation;\nbut deliver us from evil.\nFor thine is the kingdom,\nthe power and the glory,\nfor ever and ever. Amen.`
  },
  {
    id: "st-francis",
    title: "Prayer of St. Francis",
    text: `Lord, make me an instrument of your peace:\nwhere there is hatred, let me sow love;\nwhere there is injury, pardon;\nwhere there is doubt, faith;\nwhere there is despair, hope;\nwhere there is darkness, light;\nwhere there is sadness, joy.\n\nO Divine Master, grant that I may not so much seek\nto be consoled as to console,\nto be understood as to understand,\nto be loved as to love.\nFor it is in giving that we receive,\nit is in pardoning that we are pardoned,\nand it is in dying that we are born to eternal life.`
  },
  {
    id: "eternal-rest",
    title: "Eternal Rest Prayer",
    text: `Eternal rest grant unto them, O Lord,\nand let perpetual light shine upon them.\nMay the souls of all the faithful departed,\nthrough the mercy of God,\nrest in peace.\nAmen.`
  },
  {
    id: "serenity",
    title: "Serenity Prayer",
    text: `God grant me the serenity\nto accept the things I cannot change;\ncourage to change the things I can;\nand wisdom to know the difference.\n\nLiving one day at a time;\nenjoying one moment at a time;\naccepting hardships as the pathway to peace;\ntaking, as He did, this sinful world\nas it is, not as I would have it;\ntrusting that He will make all things right\nif I surrender to His Will.`
  },
  {
    id: "ecclesiastes",
    title: "Ecclesiastes 3:1-8",
    text: `To every thing there is a season,\nand a time to every purpose under the heaven:\nA time to be born, and a time to die;\na time to plant, and a time to pluck up that which is planted;\nA time to weep, and a time to laugh;\na time to mourn, and a time to dance;\nA time to get, and a time to lose;\na time to keep, and a time to cast away;\nA time to love, and a time of peace.`
  },
  {
    id: "irish-blessing",
    title: "An Irish Blessing",
    text: `May the road rise up to meet you.\nMay the wind be always at your back.\nMay the sun shine warm upon your face;\nthe rains fall soft upon your fields\nand until we meet again,\nmay God hold you in the palm of His hand.`
  },
  {
    id: "old-irish-blessing",
    title: "Old Irish Blessing",
    text: `May love and laughter light your days,\nand warm your heart and home.\nMay good and faithful friends be yours,\nwherever you may roam.\nMay peace and plenty bless your world\nwith joy that long endures.\nMay all life's passing seasons\nbring the best to you and yours.`
  },
  {
    id: "death-is-nothing",
    title: "Death Is Nothing at All",
    text: `Death is nothing at all.\nIt does not count.\nI have only slipped away into the next room.\nNothing has happened.\nEverything remains exactly as it was.\nI am I, and you are you,\nand the old life that we lived so fondly together is untouched, unchanged.\nWhatever we were to each other, that we are still.`
  },
  {
    id: "crossing-the-bar",
    title: "Crossing the Bar",
    text: `Sunset and evening star,\nAnd one clear call for me!\nAnd may there be no moaning of the bar,\nWhen I put out to sea.\n\nTwilight and evening bell,\nAnd after that the dark!\nAnd may there be no sadness of farewell,\nWhen I embark;\n\nFor tho' from out our bourne of Time and Place\nThe flood may bear me far,\nI hope to see my Pilot face to face\nWhen I have crost the bar.`
  },
  {
    id: "remember-me",
    title: "Remember Me – Christina Rossetti",
    text: `Remember me when I am gone away,\nGone far away into the silent land;\nWhen you can no more hold me by the hand,\nNor I half turn to go yet turning stay.\n\nRemember me when no more day by day\nYou tell me of our future that you plann'd:\nOnly remember me; you understand\nIt will be late to counsel then or pray.\n\nYet if you should forget me for a while\nAnd afterwards remember, do not grieve.`
  },
  {
    id: "let-me-go",
    title: "Let Me Go",
    text: `When I come to the end of the road\nAnd the sun has set for me,\nI want no rites in a gloom-filled room,\nWhy cry for a soul set free?\n\nMiss me a little, but not too long,\nAnd not with your head bowed low.\nRemember the love that we once shared,\nMiss me, but let me go.`
  }
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 110 }, (_, i) => 2026 - i);

export default function PrayerCardEditor() {
  const { themeId } = useParams();
  const { memorialData, updateData } = useMemorial();
  const navigate = useNavigate();

  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [selectedBlock, setSelectedBlock] = useState<EditableBlock>(null);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);

  // Cover Title State
  const [coverTitle, setCoverTitle] = useState(memorialData.tagline || "Forever in Our Hearts");

  // Prayer / Poem State
  const [selectedPrayerTitle, setSelectedPrayerTitle] = useState(memorialData.prayerTitle || "Do Not Stand at My Grave and Weep");
  const [prayerText, setPrayerText] = useState(
    memorialData.prayerText || PRAYER_LIBRARY[0].text
  );

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

  const handleCoverTitleChange = (val: string) => {
    setCoverTitle(val);
    updateData({ tagline: val });
  };

  const handlePrayerPresetSelect = (title: string) => {
    setSelectedPrayerTitle(title);
    const matched = PRAYER_LIBRARY.find(p => p.title === title);
    if (matched) {
      setPrayerText(matched.text);
      updateData({ prayerTitle: matched.title, prayerText: matched.text });
    } else {
      updateData({ prayerTitle: title });
    }
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
      format: 'Pocket Prayer Card (2.5" x 4.25")',
      theme: selectedTemplate.name,
      themeId: selectedTemplate.id,
      themeImage: selectedTemplate.image,
      prayerTitle: selectedPrayerTitle,
      prayerText: prayerText
    });
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col font-sans selection:bg-[#967440]/20 relative">
      <Meta 
        title={`Edit ${selectedTemplate.name} Prayer Card`} 
        description="Live WYSIWYG editor for memorial pocket prayer cards and keepsake cards." 
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
        
        {/* Left Side: Front / Back Side Switcher Matching Screenshot */}
        <div className="lg:col-span-2 flex lg:flex-col gap-2 justify-center lg:justify-start">
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-200/70 w-full flex lg:flex-col gap-1.5">
            <button
              onClick={() => {
                setActiveSide('front');
                if (selectedBlock === 'prayer') setSelectedBlock(null);
              }}
              className={cn(
                "relative w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between",
                activeSide === 'front'
                  ? "bg-[#5c4033] text-white shadow-xs"
                  : "bg-transparent text-gray-700 hover:bg-gray-50"
              )}
            >
              <span>Front</span>
              <span className="text-[#e5a93c] text-xs">◀</span>
            </button>

            <button
              onClick={() => {
                setActiveSide('back');
                setSelectedBlock('prayer');
              }}
              className={cn(
                "relative w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between",
                activeSide === 'back'
                  ? "bg-[#5c4033] text-white shadow-xs"
                  : "bg-transparent text-gray-700 hover:bg-gray-50"
              )}
            >
              <span>Back</span>
              <span className="text-[#e5a93c] text-xs">◀</span>
            </button>
          </div>
        </div>

        {/* Center: Live Interactive Canvas Card Preview */}
        <div className="lg:col-span-6 flex justify-center items-center w-full">
          
          {/* SIDE 1: FRONT OF PRAYER CARD */}
          {activeSide === 'front' && (
            <div id="prayer-card-canvas" className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-[1/1.5] bg-white rounded-2xl shadow-[0_20px_60px_rgba(44,24,16,0.12)] border border-gray-100 overflow-hidden p-4 sm:p-7 flex flex-col justify-between select-none">
              
              {/* Single Full Theme Background Photo */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <img 
                  src={selectedTemplate.image} 
                  alt="" 
                  className="w-full h-full object-cover opacity-25 mix-blend-multiply" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/85 pointer-events-none" />
              </div>



              <div className="relative z-10 flex flex-col items-center justify-between h-full py-2 text-center">
                
                {/* Block 1: Framed Photo (Exact match for Screenshot 3 & 5) */}
                <div 
                  onClick={() => setSelectedBlock('photo')}
                  className={cn(
                    "relative mt-2 p-1 rounded-xl transition-all cursor-pointer",
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

                {/* Content Group (Cover Title, Name, Dates) */}
                <div className="w-full space-y-2 mt-auto pb-2">
                  {/* Block 2: Cover Title (Exact Match for Screenshot 5) */}
                  <div 
                    onClick={() => setSelectedBlock('cover-title')}
                    className={cn(
                      "relative w-full max-w-[280px] mx-auto py-1 px-3 rounded-lg border transition-all cursor-pointer",
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
                    <h3 className="font-serif text-lg sm:text-xl text-[#5c4033] font-normal tracking-wide">
                      {coverTitle}
                    </h3>
                    {/* Yellow Pointer on Right */}
                    <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                      ◀
                    </span>
                  </div>

                  {/* Block 3: Honoree Name (Exact Match for Screenshot 3 & 5) */}
                  <div 
                    onClick={() => setSelectedBlock('name')}
                    className={cn(
                      "relative w-full max-w-[280px] mx-auto py-0.5 px-3 rounded-lg border transition-all cursor-pointer",
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
                    <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#5c4033] tracking-tight">
                      {memorialData.name || 'Loved One'}
                    </h2>
                    {/* Yellow Pointer on Right */}
                    <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                      ◀
                    </span>
                  </div>

                  {/* Block 4: Life Dates (Exact Match for Screenshot 3 & 5) */}
                  <div 
                    onClick={() => setSelectedBlock('dates')}
                    className={cn(
                      "relative w-full max-w-[280px] mx-auto py-0.5 px-3 rounded-lg border transition-all cursor-pointer",
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
                    <p className="font-serif italic text-xs text-[#7a5c43]">
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
          )}

          {/* SIDE 2: BACK OF PRAYER CARD (Exact match for Screenshot 1, 2, 4) */}
          {activeSide === 'back' && (
            <div id="prayer-card-canvas" className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-[1/1.5] bg-white rounded-2xl shadow-[0_20px_60px_rgba(44,24,16,0.12)] border border-gray-100 overflow-hidden p-4 sm:p-7 flex flex-col justify-between select-none">
              
              {/* Single Full Theme Background Photo */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <img 
                  src={selectedTemplate.image} 
                  alt="" 
                  className="w-full h-full object-cover opacity-25 mix-blend-multiply" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/85 pointer-events-none" />
              </div>



              <div className="relative z-10 flex flex-col items-center justify-center h-full py-4 text-center">
                
                {/* Poem Title Header on Canvas */}
                <div 
                  onClick={() => setSelectedBlock('prayer')}
                  className="cursor-pointer mb-2"
                >
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#5c4033] leading-snug">
                    {selectedPrayerTitle}
                  </h3>
                </div>

                {/* Poem / Prayer Text Box (Exact Match for Screenshot 1 & 4) */}
                <div 
                  onClick={() => setSelectedBlock('prayer')}
                  className={cn(
                    "relative w-full p-4 rounded-xl border transition-all cursor-pointer max-h-[300px] overflow-y-auto scrollbar-none",
                    selectedBlock === 'prayer' 
                      ? "border-[#8b6534] bg-[#8b6534]/5 shadow-xs" 
                      : "border-dashed border-gray-200 hover:border-[#8b6534]/50"
                  )}
                >
                  {selectedBlock === 'prayer' && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5c4033] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      Prayer
                    </span>
                  )}

                  <p className="font-serif italic text-xs sm:text-[13px] text-[#5c4033] whitespace-pre-line leading-relaxed text-center">
                    {prayerText || "Click here to choose or write a poem or prayer for the reverse side."}
                  </p>

                  {/* Yellow Pointer on Right */}
                  <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-[#e5a93c] text-xs">
                    ◀
                  </span>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Right Side: Contextual Block Inspector Matching Screenshots */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 min-h-[420px]">
            
            {/* INSPECTOR 1: Cover Title Selected (Exact Match for Screenshot 5) */}
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

            {/* INSPECTOR 2: Photo Selected */}
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

            {/* INSPECTOR 3: Name Selected */}
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
                    The name is automatically styled in prominent serif typography on the card.
                  </p>
                </div>
              </div>
            )}

            {/* INSPECTOR 4: Dates Selected */}
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

            {/* INSPECTOR 5: Prayer / Poem Selected (Exact Match for Screenshot 1, 2, 4) */}
            {selectedBlock === 'prayer' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-base font-semibold text-[#2c1810]">
                    <Edit3 size={16} className="text-[#8b6534]" />
                    <span>Prayer</span>
                  </div>
                  <button 
                    onClick={() => setSelectedBlock(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Dropdown Library Selector (Exact Match for Screenshot 1 & 4) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a5c43]">
                    CHOOSE A PRAYER OR POEM
                  </label>
                  <select
                    value={selectedPrayerTitle}
                    onChange={(e) => handlePrayerPresetSelect(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 focus:border-[#8b6534] outline-none font-medium"
                  >
                    <option value="Browse the library...">Browse the library...</option>
                    {PRAYER_LIBRARY.map((item) => (
                      <option key={item.id} value={item.title}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a5c43]">
                    TITLE
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedPrayerTitle === "Browse the library..." ? "" : selectedPrayerTitle}
                      placeholder="e.g. A Poem for Grandma"
                      onChange={(e) => {
                        setSelectedPrayerTitle(e.target.value);
                        updateData({ prayerTitle: e.target.value });
                      }}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:border-[#8b6534] outline-none pr-8"
                    />
                    {selectedPrayerTitle && selectedPrayerTitle !== "Browse the library..." && (
                      <button 
                        onClick={() => {
                          setSelectedPrayerTitle("");
                          updateData({ prayerTitle: "" });
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Text Area */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7a5c43]">
                    TEXT
                  </label>
                  <textarea
                    rows={8}
                    value={prayerText}
                    onChange={(e) => {
                      setPrayerText(e.target.value);
                      updateData({ prayerText: e.target.value });
                    }}
                    placeholder="Write or paste your prayer or poem text here..."
                    className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-xs font-sans text-gray-800 focus:border-[#8b6534] outline-none resize-none leading-relaxed"
                  />
                  <p className="text-[11px] text-gray-400 font-sans">
                    Text automatically resizes to fit the page — no design skills needed.
                  </p>
                </div>
              </div>
            )}

            {/* Default Idle State (Exact Match for Screenshot 3) */}
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

      {/* Floating Support Button Matching Screenshot 2 & 4 */}
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
                      navigate(`/editor/prayer/${tmpl.id}`);
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
