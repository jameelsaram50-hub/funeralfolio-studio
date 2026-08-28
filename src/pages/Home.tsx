import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
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
  Feather
} from 'lucide-react';
import { TEMPLATES } from '../constants';

export default function Home() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://funeralfolio.com/#software",
        "name": "FuneralFolio Memorial Studio",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web, Android",
        "description": "Cross-platform memorial document creation platform for designing print-ready funeral programs, prayer cards, invitations, and thank you cards.",
        "url": "https://funeralfolio.com/",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    ]
  };

  const productSuite = [
    {
      title: "Funeral Programs",
      subtitle: "8.5\" x 11\" Bi-fold Booklet",
      desc: "4-page ceremonial keepsake booklet with order of service, life story, photo collage, and family tributes.",
      icon: BookOpen,
      path: "/funeral-programs",
      badge: "Most Popular",
      color: "from-amber-500/20 to-amber-600/5",
      accent: "#c5a059"
    },
    {
      title: "Prayer Keepsake Cards",
      subtitle: "2.5\" x 4.25\" Double-Sided",
      desc: "Laminated keepsake cards featuring treasured portraits, scripture, favorite poems, and sacred blessings.",
      icon: HeartHandshake,
      path: "/prayer-cards",
      badge: "Memorial Classic",
      color: "from-emerald-500/20 to-emerald-600/5",
      accent: "#3b7a66"
    },
    {
      title: "Memorial Posters",
      subtitle: "18\" x 24\" & 24\" x 36\" Easel Signs",
      desc: "Stunning high-resolution celebration of life easel signs and photo display boards for service entrances.",
      icon: Layers,
      path: "/posters",
      badge: "Easel Print",
      color: "from-blue-500/20 to-blue-600/5",
      accent: "#4a7c9d"
    },
    {
      title: "Ceremony Invitations",
      subtitle: "5\" x 7\" Announcement Cards",
      desc: "Graceful memorial announcements with ceremony schedule, live stream details, and RSVP instructions.",
      icon: FileText,
      path: "/funeral-invitations",
      badge: "Service Details",
      color: "from-purple-500/20 to-purple-600/5",
      accent: "#8b6da4"
    },
    {
      title: "Memorial Thank You Cards",
      subtitle: "6\" x 4\" Gratitude Notes",
      desc: "Heartfelt notes acknowledging flowers, donations, condolences, and comforting gestures from loved ones.",
      icon: Heart,
      path: "/thank-you-cards",
      badge: "Family Gratitude",
      color: "from-rose-500/20 to-rose-600/5",
      accent: "#b06d79"
    },
    {
      title: "AI Obituary Writer",
      subtitle: "Empathetic Life Story Studio",
      desc: "Step-by-step guidance powered by Gemini AI that crafts deeply personalized, moving tributes in minutes.",
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
    <div className="flex flex-col bg-[#f7f5f0] text-[#0f1520] selection:bg-[#c5a059]/20 font-sans min-h-screen">
      <Meta 
        title="FuneralFolio | Dignified Funeral Programs, Prayer Cards & Memorial Studio" 
        description="Craft timeless memorial stationery, 4-page funeral programs, prayer keepsake cards, and heartfelt AI obituaries with reverence and ease."
        canonical="https://funeralfolio.com/"
        schema={homeSchema}
      />

      <main className="space-y-24 sm:space-y-32">
        
        {/* Hero Section */}
        <section className="relative pt-36 sm:pt-44 pb-20 sm:pb-28 px-4 sm:px-8 overflow-hidden">
          {/* Luminous Ambient Background Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[500px] bg-gradient-to-b from-[#c5a059]/15 via-[#3b7a66]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
            
            {/* Left Hero Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-7 text-center lg:text-left"
            >
              {/* Dignified Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#c5a059]/30 text-[#0f1520] text-xs font-semibold shadow-xs">
                <Sparkles size={14} className="text-[#c5a059]" />
                <span className="tracking-wide">Honoring Every Cherished Life Story</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#0f1520] leading-[1.15] font-bold tracking-tight">
                Craft Timeless Keepsakes for the Ones Who <span className="italic text-[#c5a059] font-normal">Shaped Your World</span>
              </h1>

              {/* Compassionate Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans font-normal">
                Thoughtful, calming design tools created to help grieving families personalize beautiful funeral programs, keepsake prayer cards, and heartfelt tributes with grace and simplicity.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button 
                  onClick={() => navigate('/funeral-programs')}
                  className="w-full sm:w-auto btn-gold-luxury px-8 py-4 rounded-full font-semibold text-sm flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <BookOpen size={17} />
                  <span>Design Memorial Program</span>
                </button>

                <button 
                  onClick={() => navigate('/obituary-writer')}
                  className="w-full sm:w-auto btn-sage-serene px-8 py-4 rounded-full font-semibold text-sm flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Sparkles size={17} />
                  <span>Write AI Obituary</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <Printer size={16} className="text-[#c5a059]" />
                  <span>300 DPI Archival Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#3b7a66]" />
                  <span>Instant PDF Download</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#c5a059]" />
                  <span>100% Free Standard Access</span>
                </div>
              </div>
            </motion.div>

            {/* Right Interactive Preview Showcase */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Floating Card Stack */}
                <div className="relative p-3 rounded-3xl bg-gradient-to-b from-white/90 to-white/60 backdrop-blur-xl border border-amber-900/10 shadow-[0_25px_60px_-15px_rgba(15,21,32,0.15)]">
                  
                  {/* Card Header Preview */}
                  <div className="rounded-2xl overflow-hidden relative aspect-[4/5] bg-slate-900">
                    <img 
                      src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop" 
                      alt="Memorial Program Template Preview" 
                      className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white text-center">
                      <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold mb-1">
                        In Loving Memory Of
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
                        Eleanor Vance Sterling
                      </h3>
                      <p className="text-xs text-white/80 font-sans tracking-wide">
                        1942 — 2026 • Celebration of Eternal Life
                      </p>
                      
                      <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-white/90">
                        <span className="italic font-serif">"Forever in Our Hearts"</span>
                        <Link 
                          to="/editor/program/watercolor-roses"
                          className="bg-[#c5a059] hover:bg-[#d4af37] text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1"
                        >
                          <span>Customize</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Floating Micro Badge */}
                  <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md border border-amber-900/10 px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#3b7a66] flex items-center justify-center">
                      <Printer size={16} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-800 leading-tight">Print Ready</p>
                      <p className="text-[10px] text-slate-500">Standard 8.5" x 11" Bifold</p>
                    </div>
                  </div>

                  {/* Floating Micro Badge 2 */}
                  <div className="absolute -top-3 -right-3 bg-white/95 backdrop-blur-md border border-amber-900/10 px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2">
                    <Sparkles size={14} className="text-[#c5a059]" />
                    <span className="text-[11px] font-semibold text-slate-700">AI Obituary Sync</span>
                  </div>

                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* Stationery Product Suite Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-[#c5a059] font-bold font-sans">
              Comprehensive Memorial Formats
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0f1520]">
              Everything Needed for a Dignified Service
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              From pocket keepsake prayer cards to large welcome easel posters, customize complete matching suites effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {productSuite.map((product, idx) => {
              const Icon = product.icon;
              return (
                <motion.div
                  key={product.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="luxury-card p-7 flex flex-col justify-between group hover:border-[#c5a059]/40 relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${product.color} rounded-bl-full pointer-events-none`} />

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110 duration-300"
                        style={{ backgroundColor: product.accent }}
                      >
                        <Icon size={22} />
                      </div>
                      <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {product.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-xl text-[#0f1520] group-hover:text-[#3b7a66] transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-xs text-[#c5a059] font-medium mt-0.5 font-sans">
                        {product.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {product.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between relative z-10">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                      Free Download
                    </span>
                    <Link
                      to={product.path}
                      className="text-xs font-bold text-[#0f1520] group-hover:text-[#c5a059] flex items-center gap-1.5 transition-colors"
                    >
                      <span>Explore Designs</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Featured Template Gallery Showcase */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#c5a059] font-bold font-sans">
                Curated Design Themes
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0f1520] mt-1">
                Handcrafted Memorial Styles
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Floral', 'Classic', 'Nature', 'Spiritual'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    activeCategory === cat 
                      ? 'bg-[#0f1520] text-white shadow-xs' 
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
                className="luxury-card overflow-hidden group flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                  <img 
                    src={template.image} 
                    alt={template.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <Link 
                      to={`/editor/program/${template.id}`}
                      className="w-full btn-gold-luxury py-2.5 rounded-xl text-xs font-semibold text-center shadow-lg"
                    >
                      Customize Program
                    </Link>
                  </div>
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 shadow-xs">
                    {template.category}
                  </span>
                </div>

                <div className="p-4 bg-white flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#0f1520]">
                      {template.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-sans">
                      All Formats Available
                    </p>
                  </div>
                  <Link 
                    to={`/editor/prayer/${template.id}`}
                    className="text-xs font-bold text-[#3b7a66] hover:text-[#2d6a4f] transition-colors"
                  >
                    Prayer Card →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0f1520] hover:text-[#c5a059] uppercase tracking-wider py-2 px-6 rounded-full border border-slate-300 hover:border-[#c5a059] bg-white transition-all shadow-xs"
            >
              <span>View All 40+ Memorial Themes</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* Empathetic AI Story Studio Highlight */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#0b0f15] via-[#131b26] to-[#0b0f15] text-white p-8 sm:p-14 relative overflow-hidden border border-[#c5a059]/20 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#c5a059]/15 to-transparent rounded-bl-full pointer-events-none blur-2xl" />

            <div className="grid lg:grid-cols-12 gap-10 items-center relative z-10">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-[#c5a059]/30 text-[#d4af37] text-xs font-semibold">
                  <Sparkles size={14} />
                  <span>Gemini Empathetic Writing Assistant</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
                  When Words Are Difficult to Find, We Help You Begin.
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                  Our respectful AI interviewer gently prompts you for life milestones, cherished memories, signature quirks, and beloved stories—weaving them into a deeply moving eulogy and obituary.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <Feather size={20} className="text-[#c5a059] mb-2" />
                    <h4 className="font-bold text-sm text-white">Heartfelt & Dignified</h4>
                    <p className="text-xs text-slate-400 mt-1">Poetic, gentle, and respectful tone options.</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <Clock size={20} className="text-[#3b7a66] mb-2" />
                    <h4 className="font-bold text-sm text-white">Finished in Minutes</h4>
                    <p className="text-xs text-slate-400 mt-1">No blank page anxiety during difficult days.</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <Download size={20} className="text-[#c5a059] mb-2" />
                    <h4 className="font-bold text-sm text-white">1-Click Program Sync</h4>
                    <p className="text-xs text-slate-400 mt-1">Directly populates your funeral booklet.</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/obituary-writer"
                    className="inline-flex items-center gap-2 btn-gold-luxury px-8 py-3.5 rounded-full font-bold text-sm"
                  >
                    <span>Start AI Guided Obituary</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Right Sample Card Preview */}
              <div className="lg:col-span-5">
                <div className="bg-white/10 backdrop-blur-xl border border-white/15 p-6 rounded-2xl shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs uppercase tracking-wider text-[#c5a059] font-bold">Sample Life Tribute</span>
                    <span className="text-[10px] text-slate-400 bg-white/10 px-2 py-0.5 rounded-full">Christian / Comforting</span>
                  </div>
                  <p className="font-serif italic text-sm text-slate-200 leading-relaxed">
                    "Eleanor walked through life with an open heart and gentle grace. Whether tending to her beloved roses or sharing Sunday tea with grandchildren, her warmth illuminated every room..."
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Generated in 45 seconds</span>
                    <span className="text-[#c5a059] font-semibold">Ready for Print Booklets</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Simple Steps to Honor a Loved One */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-widest text-[#3b7a66] font-bold font-sans">
              Simple & Peaceful Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0f1520]">
              From Memories to High-Resolution Print
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Select Format & Theme", desc: "Choose from 40+ matching designs across programs, prayer cards, posters, and invitations." },
              { step: "02", title: "Add Words & Photos", desc: "Easily upload portraits, customize hymns, scripture, and order of service events." },
              { step: "03", title: "AI Story Enhancer", desc: "Use our caring assistant to refine obituaries and comforting family notes." },
              { step: "04", title: "Print-Ready 300 DPI PDF", desc: "Instant high-resolution download optimized for home printers or professional print shops." }
            ].map((st, i) => (
              <div key={st.step} className="luxury-card p-6 relative flex flex-col justify-between">
                <div>
                  <span className="font-serif font-bold text-3xl text-[#c5a059]/40 block mb-3">
                    {st.step}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#0f1520] mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {st.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-[#3b7a66] font-semibold">
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
