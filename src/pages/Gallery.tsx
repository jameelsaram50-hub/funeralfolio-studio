import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  X, 
  BookOpen, 
  Mail, 
  HeartHandshake, 
  ImageIcon, 
  Layers, 
  ArrowRight, 
  Check, 
  Eye, 
  SlidersHorizontal,
  ChevronRight,
  Printer
} from 'lucide-react';
import { TEMPLATES, Template } from '../constants';
import { useMemorial } from '../lib/MemorialContext';
import { cn } from '../lib/utils';
import Meta from '../components/Meta';

type ProductType = 'program' | 'prayer' | 'invitation' | 'thank-you' | 'poster';

interface ProductConfig {
  id: ProductType;
  label: string;
  badge: string;
  aspectClass: string;
  tagline: string;
  description: string;
  editorRoute: (themeId: string) => string;
}

const PRODUCT_CONFIGS: Record<ProductType, ProductConfig> = {
  program: {
    id: 'program',
    label: 'Funeral Programs',
    badge: '8.5x11" Bi-Fold Booklet',
    aspectClass: 'aspect-[1/1.4]',
    tagline: 'Order of Service Booklets',
    description: '4-page keepsake booklets with cover tribute, order of service, scripture readings, hymns, and pallbearers.',
    editorRoute: (themeId) => `/editor/program/${themeId}`
  },
  poster: {
    id: 'poster',
    label: 'Memorial Posters',
    badge: '18x24" & 24x36" Display Board',
    aspectClass: 'aspect-[3/4]',
    tagline: 'Tribute Posters & Welcome Signs',
    description: 'Large-format easel welcome boards with portrait tribute and life dates for ceremony entrance.',
    editorRoute: (themeId) => `/editor/poster/${themeId}`
  },
  prayer: {
    id: 'prayer',
    label: 'Prayer Cards',
    badge: '2.5x4.25" Keepsake Card',
    aspectClass: 'aspect-[2.5/4.25]',
    tagline: 'Memorial & Keepsake Cards',
    description: 'Pocket-sized remembrance cards with portrait, Psalm 23, traditional prayers, or commemorative poems.',
    editorRoute: (themeId) => `/editor/prayer/${themeId}`
  },
  invitation: {
    id: 'invitation',
    label: 'Invitations',
    badge: '5x7" Service Announcement',
    aspectClass: 'aspect-[5/7]',
    tagline: 'Funeral & Memorial Invitations',
    description: 'Elegant 5x7 announcement cards to inform family and friends of service times, location, and reception.',
    editorRoute: (themeId) => `/editor/invitation/${themeId}`
  },
  'thank-you': {
    id: 'thank-you',
    label: 'Thank You Cards',
    badge: '4x6" Note Card',
    aspectClass: 'aspect-[6/4.2]',
    tagline: 'Condolence Thank You Cards',
    description: 'Heartfelt acknowledgement notes expressing gratitude for prayers, flowers, condolences, and support.',
    editorRoute: (themeId) => `/editor/thank-you/${themeId}`
  }
};

export default function Gallery() {
  const { updateData, memorialData } = useMemorial();
  const navigate = useNavigate();
  const location = useLocation();

  const initialProduct: ProductType = 
    (location.state?.for as ProductType) || 
    (location.state?.type as ProductType) || 
    'prayer';

  const [productType, setProductType] = useState<ProductType>(
    PRODUCT_CONFIGS[initialProduct] ? initialProduct : 'prayer'
  );
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [showWelcomeBack, setShowWelcomeBack] = useState(!!location.state?.fromWriter);

  // Standard memorial categories explicitly mapped and ordered
  const categories = useMemo(() => {
    const rawCategories = Array.from(new Set(TEMPLATES.map(t => t.category)));
    const orderedCategories = ['All', 'Floral', 'Modern', 'Classic', 'Nature', 'Religious'];
    const combined = ['All', ...orderedCategories.filter(c => c !== 'All' && rawCategories.includes(c)), ...rawCategories.filter(c => !orderedCategories.includes(c))];
    return Array.from(new Set(combined));
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: TEMPLATES.length };
    TEMPLATES.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter(t => {
      const matchesFilter = filter === 'All' || t.category.toLowerCase() === filter.toLowerCase();
      const matchesSearch = search.trim() === '' || 
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const currentConfig = PRODUCT_CONFIGS[productType];

  const handleSelectTemplate = (template: Template) => {
    updateData({ 
      theme: template.name, 
      themeId: template.id 
    });

    if (location.state?.isChangingTheme) {
      const productFor = location.state.for;
      if (productFor === 'memorial' || productFor === 'poster') {
        navigate(`/editor/poster/${template.id}`);
      } else if (productFor) {
        navigate(`/editor/${productFor}/${template.id}`);
      } else {
        navigate(currentConfig.editorRoute(template.id));
      }
    } else {
      navigate(currentConfig.editorRoute(template.id));
    }
  };

  return (
    <div className="bg-[#fdfaf7] min-h-screen pb-32 font-sans selection:bg-[#967440]/20">
      <Meta 
        title="Memorial Themes Gallery & Template Catalog" 
        description="Browse our collection of 40+ print-ready funeral programs, prayer cards, invitations, thank you cards, and memorial posters."
        canonical="https://funeralfolio.com/gallery"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "FuneralFolio Memorial Template Gallery",
          "description": "Comprehensive catalog of funeral stationery templates and themes."
        }}
      />

      {/* Optional Welcome Back banner from AI Writer */}
      <AnimatePresence>
        {showWelcomeBack && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#2c1810] text-[#d2c2ad] overflow-hidden sticky top-12 z-30 shadow-md"
          >
            <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-[#967440] rounded-full flex items-center justify-center text-white shrink-0">
                  <Sparkles size={14} />
                </div>
                <p className="text-xs sm:text-sm font-serif">
                  Tribute content for <span className="text-white font-bold">{memorialData.name || 'your loved one'}</span> is loaded. Choose a coordinated theme below to enter the editor.
                </p>
              </div>
              <button 
                onClick={() => setShowWelcomeBack(false)} 
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Product Switcher */}
      <header className="bg-white pt-36 pb-12 px-6 border-b border-gray-200/70">
        <div className="max-w-6xl mx-auto space-y-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fdfaf7] border border-[#967440]/20 text-[#2c1810] text-xs font-semibold">
            <Sparkles size={13} className="text-[#967440]" />
            <span>Coordinated Memorial Document Collection</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#2c1810] font-medium tracking-tight">
              Memorial <span className="text-[#967440] italic">Template Gallery</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto font-sans leading-relaxed">
              Every design is available across all stationery formats. Select a product format and style category below to preview your exact layout.
            </p>
          </div>

          {/* Product Type Tabs */}
          <div className="pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center justify-center gap-1.5">
              <Layers size={13} className="text-[#967440]" />
              <span>Select Stationery Format</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {(Object.keys(PRODUCT_CONFIGS) as ProductType[]).map((typeKey) => {
                const config = PRODUCT_CONFIGS[typeKey];
                const isActive = productType === typeKey;
                return (
                  <button
                    key={typeKey}
                    id={`tab-product-${typeKey}`}
                    onClick={() => setProductType(typeKey)}
                    className={cn(
                      "px-5 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2",
                      isActive 
                        ? "bg-[#2c1810] text-[#d2c2ad] border-[#2c1810] shadow-md scale-[1.02]" 
                        : "bg-[#fdfaf7] text-[#2c1810]/70 border-gray-200 hover:border-[#967440]/50 hover:bg-white"
                    )}
                  >
                    <span>{config.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#967440]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Product Summary Banner */}
          <motion.div 
            key={productType}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#fdfaf7] border border-[#967440]/20 rounded-2xl p-4 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-left"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#967440]">{currentConfig.tagline}</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-gray-200 font-semibold text-gray-500">{currentConfig.badge}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{currentConfig.description}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold shrink-0 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
              <Printer size={13} />
              <span>300 DPI Print-Ready</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Filter & Search Bar */}
      <section className="bg-white border-b border-gray-200/70 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-1 shrink-0 flex items-center gap-1">
              <SlidersHorizontal size={12} />
              <span>Theme:</span>
            </span>
            {categories.map((cat) => {
              const isActive = filter.toLowerCase() === cat.toLowerCase();
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  id={`filter-category-${cat.toLowerCase()}`}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5",
                    isActive
                      ? "bg-[#967440] text-white shadow-xs"
                      : "bg-[#fdfaf7] text-gray-600 hover:text-[#2c1810] border border-gray-200 hover:border-gray-300"
                  )}
                >
                  <span>{cat}</span>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full",
                    isActive ? "bg-white/25 text-white" : "bg-gray-200/70 text-gray-500"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="gallery-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by theme name or keyword..."
              className="w-full pl-9 pr-8 py-2 bg-[#fdfaf7] border border-gray-200 rounded-xl text-xs outline-none focus:border-[#967440] focus:bg-white transition-all font-sans"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Template Grid */}
      <main className="max-w-7xl mx-auto px-6 pt-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-medium text-gray-500">
            Showing <strong className="text-[#2c1810]">{filteredTemplates.length}</strong> {filter !== 'All' ? `${filter} ` : ''}{currentConfig.label.toLowerCase()} templates
          </p>
          <div className="flex items-center gap-2 text-xs text-[#967440] font-semibold">
            <span>Click any design to open the editor</span>
          </div>
        </div>

        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTemplates.map((template, idx) => (
              <motion.div
                key={`${productType}-${template.id}`}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: (idx % 8) * 0.03 }}
                className="group bg-white rounded-2xl border border-gray-200/80 hover:border-[#967440]/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Product-Specific Visual Card Preview */}
                <div 
                  className="p-4 bg-[#fdfaf7] border-b border-gray-100 cursor-pointer relative"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className={cn(
                    "relative w-full rounded-xl overflow-hidden shadow-sm border border-gray-200/70 transition-transform duration-300 group-hover:scale-[1.02]",
                    currentConfig.aspectClass
                  )}>
                    {/* Background Artwork */}
                    <img 
                      src={template.image} 
                      alt={template.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Format-Specific Dynamic Overlays */}
                    {productType === 'prayer' && (
                      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-transparent to-[#2c1810]/90 flex flex-col justify-between p-2.5 text-center">
                        <div className="pt-1">
                          <div className="w-11 h-11 mx-auto rounded-full overflow-hidden border-2 border-white shadow-sm mb-1">
                            <img 
                              src={memorialData.photoUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"} 
                              alt="Portrait"
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h4 className="font-serif text-[10px] font-bold text-[#2c1810] leading-tight">
                            {memorialData.name || "Eleanor Vance"}
                          </h4>
                          <p className="text-[7px] text-gray-600 font-semibold">1940 – 2026</p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-xs p-1.5 rounded text-[7px] font-serif text-gray-700 italic leading-snug">
                          "The Lord is my shepherd; I shall not want..."
                        </div>

                        <div className="text-[7px] font-bold uppercase tracking-widest text-[#d2c2ad]">
                          Pocket Keepsake Card
                        </div>
                      </div>
                    )}

                    {productType === 'invitation' && (
                      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-[#2c1810]/80 flex flex-col justify-between p-3 text-center">
                        <div className="pt-1">
                          <p className="text-[8px] uppercase tracking-widest font-bold text-[#967440]">Funeral Announcement</p>
                          <h4 className="font-serif text-[11px] font-bold text-[#2c1810] mt-0.5 leading-tight">
                            Celebration of Life
                          </h4>
                        </div>

                        <div className="bg-white/85 backdrop-blur-xs p-2 rounded-lg border border-white/50 text-[8px] space-y-0.5 text-gray-700">
                          <p className="font-serif font-bold text-[#2c1810] text-[9px]">{memorialData.name || "Eleanor Vance"}</p>
                          <p className="text-gray-500">Saturday, 2:00 PM</p>
                          <p className="text-gray-500 truncate">Grace Memorial Chapel</p>
                        </div>

                        <div className="text-[7px] text-white font-medium bg-[#2c1810]/70 py-1 rounded">
                          5x7" Announcement Card
                        </div>
                      </div>
                    )}

                    {productType === 'thank-you' && (
                      <div className="absolute inset-0 bg-white/85 flex flex-col justify-between p-3.5 text-center border-4 border-white/50">
                        <div className="pt-1">
                          <span className="text-[8px] font-bold uppercase tracking-widest text-[#967440]">Acknowledgment</span>
                          <h4 className="font-serif text-xs font-bold text-[#2c1810] mt-1">With Sincere Gratitude</h4>
                        </div>

                        <p className="text-[8px] font-serif italic text-gray-600 leading-tight px-1">
                          "The family of {memorialData.name || 'Eleanor Vance'} deeply appreciates your kind expressions of sympathy..."
                        </p>

                        <div className="text-[7px] text-gray-400 uppercase tracking-wider">
                          4x6" Folded Note Card
                        </div>
                      </div>
                    )}

                    {/* Quick Preview Hover Action */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate(template);
                        }}
                        className="bg-white/90 hover:bg-white text-[#2c1810] p-2 rounded-full shadow-lg transition-transform hover:scale-110"
                        title="Preview All Formats"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Footer Details */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#2c1810] group-hover:text-[#967440] transition-colors leading-tight">
                        {template.name}
                      </h3>
                      <p className="text-[11px] font-medium text-gray-400 mt-0.5">
                        {template.category} • {currentConfig.badge}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                    <button
                      type="button"
                      id={`btn-customize-${template.id}`}
                      onClick={() => handleSelectTemplate(template)}
                      className="w-full bg-[#2c1810] hover:bg-black text-[#f7f5f2] py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                    >
                      <span>Customize {currentConfig.label.slice(0, -1)}</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-200/70 max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <Search size={20} />
            </div>
            <h3 className="text-xl font-serif text-[#2c1810] font-bold">No matching themes found</h3>
            <p className="text-xs text-gray-500">
              Try adjusting your search terms or clearing category filters to view all available designs.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setFilter('All');
              }}
              className="bg-[#2c1810] text-[#d2c2ad] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-black transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Quick Multi-Format Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 overflow-hidden relative space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#967440]">{previewTemplate.category} Theme</span>
                  <h3 className="text-2xl font-serif font-bold text-[#2c1810]">{previewTemplate.name}</h3>
                </div>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-gray-200 shadow-md">
                  <img 
                    src={previewTemplate.image} 
                    alt={previewTemplate.name} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4 text-left">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    This theme includes coordinated typography, ornamental borders, and print-ready dimensions across all 5 memorial document formats.
                  </p>

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Choose Format to Open:</span>
                    <div className="grid grid-cols-1 gap-2">
                      {(Object.keys(PRODUCT_CONFIGS) as ProductType[]).map((typeKey) => {
                        const cfg = PRODUCT_CONFIGS[typeKey];
                        return (
                          <button
                            key={typeKey}
                            onClick={() => {
                              setProductType(typeKey);
                              handleSelectTemplate(previewTemplate);
                            }}
                            className="w-full p-3 rounded-xl border border-gray-200 hover:border-[#967440] hover:bg-[#fdfaf7] transition-all flex items-center justify-between text-left group cursor-pointer"
                          >
                            <div>
                              <p className="text-xs font-bold text-[#2c1810] group-hover:text-[#967440]">{cfg.label}</p>
                              <p className="text-[10px] text-gray-500">{cfg.badge}</p>
                            </div>
                            <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-1 group-hover:text-[#967440] transition-all" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Obituary Callout */}
      <section className="max-w-5xl mx-auto px-6 mt-20">
        <div className="bg-[#2c1810] text-[#f7f5f2] rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#967440]/20 text-[#d2c2ad] text-xs font-bold">
            <Sparkles size={13} className="text-[#967440]" />
            <span>AI Writing Suite</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-medium text-white max-w-xl mx-auto">
            Need Help Composing an Obituary?
          </h2>
          <p className="text-xs sm:text-sm text-[#d2c2ad] max-w-lg mx-auto leading-relaxed">
            Answer simple questions about your loved one’s story and let our AI Obituary Writer craft a beautiful, print-ready tribute.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/obituary-writer')}
              className="bg-[#967440] hover:bg-[#856535] text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Open AI Obituary Writer
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
