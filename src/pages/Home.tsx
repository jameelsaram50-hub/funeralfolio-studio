import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Meta from '../components/Meta';
import { 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Printer, 
  HeartHandshake, 
  BookOpen, 
  FileText, 
  ShieldCheck,
  CheckCircle2,
  Heart,
  Calendar,
  Compass,
  Download,
  Clock,
  Feather,
  RotateCw,
  Eye,
  ChevronRight
} from 'lucide-react';
import { TEMPLATES } from '../constants';

export default function Home() {
  const navigate = useNavigate();
  const [activeFormat, setActiveFormat] = useState<'program' | 'prayer' | 'poster' | 'invitation' | 'thank-you'>('program');
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://funeralfolio.com/#software",
        "name": "FuneralFolio Futuristic Memorial Studio",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web, Android, iOS",
        "description": "Next-generation memorial stationery creation studio for designing 300 DPI print-ready funeral programs, prayer cards, posters, invitations, and heartfelt obituaries.",
        "url": "https://funeralfolio.com/",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    ]
  };

  const previewFormats = {
    program: {
      title: "Funeral Program Booklet",
      tag: "8.5\" x 11\" Bifold (4 Pages)",
      desc: "Order of service, beloved photos, obituary life story, and pallbearer tributes.",
      frontImg: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop",
      backImg: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=800&auto=format&fit=crop",
      frontLabel: "Cover & Order of Service",
      backLabel: "Life Story & Photo Collage",
      editorPath: "/editor/program/watercolor-roses",
      hubPath: "/funeral-programs"
    },
    prayer: {
      title: "Keepsake Prayer Card",
      tag: "2.5\" x 4.25\" Pocket Laminate",
      desc: "Double-sided treasured memorial card with portrait, sacred prayer, and custom blessing.",
      frontImg: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
      backImg: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
      frontLabel: "Portrait Tribute Front",
      backLabel: "Favorite Scripture / Psalm",
      editorPath: "/editor/prayer/cherry-blossoms",
      hubPath: "/prayer-cards"
    },
    poster: {
      title: "Celebration of Life Poster",
      tag: "18\" x 24\" / 24\" x 36\" Easel Sign",
      desc: "Stunning entrance welcome board honoring their smile and legacy for the ceremony.",
      frontImg: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
      backImg: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop",
      frontLabel: "High-Res Easel Welcome Board",
      backLabel: "Photo Memory Montage",
      editorPath: "/editor/poster/mountain-serenity",
      hubPath: "/posters"
    },
    invitation: {
      title: "Ceremony Invitation",
      tag: "5\" x 7\" Announcement Card",
      desc: "Elegantly formatted service details, live stream link, and reception RSVP card.",
      frontImg: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=800&auto=format&fit=crop",
      backImg: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
      frontLabel: "Memorial Announcement",
      backLabel: "Location & Stream Details",
      editorPath: "/editor/invitation/ocean-sunset",
      hubPath: "/funeral-invitations"
    },
    'thank-you': {
      title: "Family Thank You Note",
      tag: "6\" x 4\" Gratitude Card",
      desc: "Warm personal acknowledgment to express heartfelt gratitude for sympathy and support.",
      frontImg: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop",
      backImg: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=800&auto=format&fit=crop",
      frontLabel: "Cover Gratitude Tribute",
      backLabel: "Personal Message Note",
      editorPath: "/editor/thank-you/watercolor-roses",
      hubPath: "/thank-you-cards"
    }
  };

  const currentPreview = previewFormats[activeFormat];

  const productSuite = [
    {
      title: "Funeral Programs",
      dimensions: "8.5\" x 11\" Bi-fold Booklet",
      desc: "4-page ceremonial booklet with order of service, life story, and photo memory collage.",
      icon: BookOpen,
      path: "/funeral-programs",
      badge: "Flagship Format",
      color: "from-amber-500/20 to-amber-600/5",
      accent: "#c5a059"
    },
    {
      title: "Prayer Keepsake Cards",
      dimensions: "2.5\" x 4.25\" Keepsake",
      desc: "Double-sided pocket memorial cards with portraits, comforting prayers, and blessings.",
      icon: HeartHandshake,
      path: "/prayer-cards",
      badge: "Pocket Keepsake",
      color: "from-emerald-500/20 to-emerald-600/5",
      accent: "#2d6a4f"
    },
    {
      title: "Memorial Welcome Signs",
      dimensions: "18\" x 24\" & 24\" x 36\"",
      desc: "High-resolution celebration of life easel posters and memory photo display boards.",
      icon: Layers,
      path: "/posters",
      badge: "Easel Print",
      color: "from-blue-500/20 to-blue-600/5",
      accent: "#3b7a66"
    },
    {
      title: "Ceremony Invitations",
      dimensions: "5\" x 7\" Flat Cards",
      desc: "Graceful ceremony announcements with schedule, map location, and RSVP details.",
      icon: FileText,
      path: "/funeral-invitations",
      badge: "Service Details",
      color: "from-purple-500/20 to-purple-600/5",
      accent: "#8b6da4"
    },
    {
      title: "Memorial Thank You Cards",
      dimensions: "6\" x 4\" Gratitude Cards",
      desc: "Heartfelt notes to thank family and friends for their sympathy, flowers, and support.",
      icon: Heart,
      path: "/thank-you-cards",
      badge: "Family Gratitude",
      color: "from-rose-500/20 to-rose-600/5",
      accent: "#b06d79"
    },
    {
      title: "AI Obituary Story Studio",
      dimensions: "Empathetic Life Story Assistant",
      desc: "Guided conversational prompts powered by Gemini AI that craft moving tributes in minutes.",
      icon: Sparkles,
      path: "/obituary-writer",
      badge: "AI Powered",
      color: "from-amber-400/20 to-emerald-500/10",
      accent: "#c5a059"
    }
  ];

  const filteredTemplates = activeCategory === 'All' 
    ? TEMPLATES.slice(0, 8) 
    : TEMPLATES.filter(t => t.category === activeCategory).slice(0, 8);

  return (
    <div className="flex flex-col bg-[#f7f5f0] text-[#080c14] selection:bg-[#c5a059]/25 font-sans min-h-screen">
      <Meta 
        title="FuneralFolio | Futuristic Memorial Studio & 300 DPI Print Stationery" 
        description="Design high-resolution funeral programs, keepsake prayer cards, easel posters, and heartfelt AI obituaries in a tranquil, next-generation studio."
        canonical="https://funeralfolio.com/"
        schema={homeSchema}
      />

      <main className="space-y-24 sm:space-y-36">
        
        {/* HERO SECTION: Futuristic Twilight Sanctuary */}
        <section className="relative pt-36 sm:pt-44 pb-20 sm:pb-32 px-4 sm:px-8 overflow-hidden bg-gradient-to-b from-[#080c14] via-[#101726] to-[#f7f5f0] text-white">
          
          {/* Ambient Celestial Light Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] sm:w-[1200px] h-[600px] bg-gradient-to-b from-[#c5a059]/18 via-[#2d6a4f]/12 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-10 items-center relative z-10">
            
            {/* Left Hero Content */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-7 text-center lg:text-left"
            >
              {/* Dignified Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-[#c5a059]/40 text-[#d4af37] text-xs font-semibold shadow-xl">
                <Sparkles size={14} />
                <span className="tracking-wide">Next-Gen Memorial Design Studio</span>
              </div>

              {/* Main Cinematic Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-serif text-white leading-[1.12] font-bold tracking-tight">
                Honoring Cherished Legacies With <span className="italic text-[#d4af37] font-normal">Modern Grace</span>
              </h1>

              {/* Compassionate Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans font-light">
                A comforting sanctuary designed for grieving families. Personalize print-ready 4-page programs, keepsake prayer cards, and heartfelt AI tributes with effortless reverence.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button 
                  onClick={() => navigate('/funeral-programs')}
                  className="w-full sm:w-auto btn-gold-luxury px-9 py-4 rounded-full font-semibold text-sm flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <BookOpen size={18} />
                  <span>Explore Memorial Programs</span>
                </button>

                <button 
                  onClick={() => navigate('/obituary-writer')}
                  className="w-full sm:w-auto btn-sage-serene px-9 py-4 rounded-full font-semibold text-sm flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Sparkles size={18} />
                  <span>Write AI Obituary Free</span>
                </button>
              </div>

              {/* Verified Trust Strip */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <Printer size={15} className="text-[#c5a059]" />
                  <span>300 DPI Archival CMYK</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#10b981]" />
                  <span>Instant Browser PDF</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-[#c5a059]" />
                  <span>100% Free Standard Access</span>
                </div>
              </div>
            </motion.div>

            {/* Right Live 3D Format Previewer */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="sanctuary-glass-dark p-6 rounded-3xl space-y-5 border border-[#c5a059]/30 shadow-2xl">
                
                {/* Format Switcher Pills */}
                <div className="flex items-center justify-between gap-1 bg-white/10 p-1 rounded-2xl overflow-x-auto no-scrollbar">
                  {[
                    { id: 'program', label: 'Program' },
                    { id: 'prayer', label: 'Prayer Card' },
                    { id: 'poster', label: 'Poster' },
                    { id: 'invitation', label: 'Invitation' },
                    { id: 'thank-you', label: 'Thank You' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setActiveFormat(f.id as any);
                        setIsFlipped(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                        activeFormat === f.id 
                          ? 'bg-[#c5a059] text-white shadow-md' 
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Live Card Showcase with Flip Animation */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-inner group">
                  <img 
                    src={isFlipped ? currentPreview.backImg : currentPreview.frontImg} 
                    alt={currentPreview.title}
                    className="w-full h-full object-cover opacity-90 transition-all duration-700 group-hover:scale-105"
                  />

                  {/* Top Overlay Badge */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#d4af37] border border-amber-500/20">
                      {isFlipped ? currentPreview.backLabel : currentPreview.frontLabel}
                    </span>
                    <button
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                    >
                      <RotateCw size={12} />
                      <span>Flip Side</span>
                    </button>
                  </div>

                  {/* Bottom Info Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[10px] text-[#c5a059] uppercase tracking-widest font-semibold">
                      {currentPreview.tag}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white mb-1">
                      {currentPreview.title}
                    </h3>
                    <p className="text-xs text-slate-300 mb-4 font-sans line-clamp-2">
                      {currentPreview.desc}
                    </p>

                    <div className="flex items-center gap-3">
                      <Link 
                        to={currentPreview.editorPath}
                        className="flex-1 btn-gold-luxury py-2.5 rounded-xl text-xs font-bold text-center shadow-lg flex items-center justify-center gap-1.5"
                      >
                        <span>Open in Studio</span>
                        <ArrowRight size={14} />
                      </Link>
                      <Link 
                        to={currentPreview.hubPath}
                        className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                      >
                        Browse All
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Subtext info */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span className="flex items-center gap-1.5">
                    <Printer size={13} className="text-[#c5a059]" />
                    <span>Auto 2-Sided Printing Alignment</span>
                  </span>
                  <span className="text-[#10b981] font-semibold">Free High-Res PDF</span>
                </div>

              </div>
            </motion.div>

          </div>
        </section>

        {/* 6 PRODUCT PILLARS: Modern Cosmic Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-[#c5a059] font-bold font-sans">
              Curated Stationery Suite
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#080c14]">
              Everything Needed for a Sacred Service
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-sans">
              Each stationery piece is crafted with exact print margins, balanced typography, and matching theme elements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {productSuite.map((product, idx) => {
              const Icon = product.icon;
              return (
                <motion.div
                  key={product.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="cosmic-card p-8 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${product.color} rounded-bl-full pointer-events-none`} />

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <div 
                        className="w-13 h-13 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110 duration-300"
                        style={{ backgroundColor: product.accent }}
                      >
                        <Icon size={24} />
                      </div>
                      <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {product.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-2xl text-[#080c14] group-hover:text-[#2d6a4f] transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-xs text-[#c5a059] font-semibold mt-1 font-sans">
                        {product.dimensions}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                      {product.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between relative z-10">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md">
                      Free Download
                    </span>
                    <Link
                      to={product.path}
                      className="text-xs sm:text-sm font-bold text-[#080c14] group-hover:text-[#c5a059] flex items-center gap-1.5 transition-colors"
                    >
                      <span>Explore Formats</span>
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CURATED THEME ARCHIVE: Filterable Luxury Gallery */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#c5a059] font-bold font-sans">
                Handcrafted Themes
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#080c14] mt-1">
                40+ Coordinated Memorial Styles
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Floral', 'Classic', 'Nature', 'Spiritual'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeCategory === cat 
                      ? 'bg-[#080c14] text-white shadow-md' 
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div 
                key={template.id}
                className="cosmic-card overflow-hidden group flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                  <img 
                    src={template.image} 
                    alt={template.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <Link 
                      to={`/editor/program/${template.id}`}
                      className="w-full btn-gold-luxury py-2.5 rounded-xl text-xs font-bold text-center shadow-lg"
                    >
                      Customize Program
                    </Link>
                  </div>
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
                    {template.category}
                  </span>
                </div>

                <div className="p-4 bg-white flex items-center justify-between border-t border-slate-50">
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#080c14]">
                      {template.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-sans">
                      Matching Suite Ready
                    </p>
                  </div>
                  <Link 
                    to={`/editor/prayer/${template.id}`}
                    className="text-xs font-bold text-[#2d6a4f] hover:text-[#1b4332] transition-colors"
                  >
                    Prayer Card →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#080c14] hover:text-[#c5a059] uppercase tracking-wider py-3 px-8 rounded-full border border-slate-300 hover:border-[#c5a059] bg-white transition-all shadow-xs"
            >
              <span>Explore Complete 40+ Design Archive</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* EMPATHETIC AI STORY STUDIO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#080c14] via-[#101726] to-[#080c14] text-white p-8 sm:p-14 relative overflow-hidden border border-[#c5a059]/25 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#c5a059]/15 to-transparent rounded-bl-full pointer-events-none blur-3xl" />

            <div className="grid lg:grid-cols-12 gap-10 items-center relative z-10">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#c5a059]/30 text-[#d4af37] text-xs font-semibold">
                  <Sparkles size={14} />
                  <span>Gemini Empathetic Story Studio</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
                  When Words Are Difficult, We Guide Every Thought.
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-sans font-light">
                  Our compassionate assistant gently walks you through cherished memories, signature quirks, and beloved stories—weaving them into a deeply moving life story tribute.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <Feather size={20} className="text-[#c5a059] mb-2" />
                    <h4 className="font-bold text-sm text-white">Poetic & Dignified</h4>
                    <p className="text-xs text-slate-400 mt-1">Gentle, secular, or faith-based tones.</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <Clock size={20} className="text-[#10b981] mb-2" />
                    <h4 className="font-bold text-sm text-white">Ready in Minutes</h4>
                    <p className="text-xs text-slate-400 mt-1">Zero pressure or blank page anxiety.</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <Download size={20} className="text-[#c5a059] mb-2" />
                    <h4 className="font-bold text-sm text-white">1-Click Booklet Sync</h4>
                    <p className="text-xs text-slate-400 mt-1">Populates your funeral program.</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/obituary-writer"
                    className="inline-flex items-center gap-2 btn-gold-luxury px-8 py-3.5 rounded-full font-bold text-sm"
                  >
                    <span>Start Guided AI Obituary</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Sample Live Output Preview */}
              <div className="lg:col-span-5">
                <div className="bg-white/10 backdrop-blur-2xl border border-white/15 p-6 rounded-2xl shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs uppercase tracking-wider text-[#c5a059] font-bold">Empathetic Life Tribute</span>
                    <span className="text-[10px] text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">Christian / Comforting</span>
                  </div>
                  <p className="font-serif italic text-sm text-slate-200 leading-relaxed">
                    "Eleanor walked through life with an open heart and gentle grace. Whether tending to her beloved roses or sharing Sunday tea with grandchildren, her warmth illuminated every room..."
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Generated in 45 seconds</span>
                    <span className="text-[#c5a059] font-semibold">Print Booklet Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 SIMPLE STEPS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-[#2d6a4f] font-bold font-sans">
              Simple & Dignified Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#080c14]">
              From Memories to High-Resolution Print
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Select Format & Theme", desc: "Choose from 40+ matching designs across programs, prayer cards, posters, and invitations." },
              { step: "02", title: "Add Words & Photos", desc: "Easily upload portraits, customize hymns, scripture, and order of service events." },
              { step: "03", title: "AI Story Enhancer", desc: "Use our caring assistant to refine obituaries and comforting family notes." },
              { step: "04", title: "Print-Ready 300 DPI PDF", desc: "Instant high-resolution download optimized for home printers or professional print shops." }
            ].map((st) => (
              <div key={st.step} className="cosmic-card p-7 relative flex flex-col justify-between">
                <div>
                  <span className="font-serif font-bold text-3xl text-[#c5a059]/40 block mb-3">
                    {st.step}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#080c14] mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {st.desc}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-[#2d6a4f] font-semibold">
                  <CheckCircle2 size={13} />
                  <span>Always Free Access</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
