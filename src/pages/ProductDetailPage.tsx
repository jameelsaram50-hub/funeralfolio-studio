import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Meta from '../components/Meta';
import { 
  Star, 
  Sparkles, 
  Check, 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  QrCode, 
  Edit3, 
  ShieldCheck, 
  RotateCcw, 
  FileText,
  DollarSign,
  Heart
} from 'lucide-react';
import { TEMPLATES, Template } from '../constants';
import { cn, normalizeThemeId } from '../lib/utils';
import { useMemorial } from '../lib/MemorialContext';
import { usePricing } from '../lib/pricing';

export interface ProductDetailPageProps {
  productType: 'thank-you' | 'poster' | 'prayer' | 'invitation' | 'program';
}

const PRODUCT_CONFIGS = {
  'thank-you': {
    name: 'Funeral Thank You Cards',
    size: '6" x 4" thank you cards',
    specsSize: '6" x 4"',
    specsSides: 'one-sided',
    price: '$19',
    editorBase: '/editor/thank-you',
    catalogBase: '/thank-you-cards',
    testimonial: '“We were able to make warm, simple thank you cards without spending hours designing them.”',
    author: 'Brian T.',
    aspect: 'aspect-[1.5/1]',
    orientation: 'landscape'
  },
  'poster': {
    name: 'Memorial Poster & Sign',
    size: '18" x 24" & 24" x 36" welcome signs',
    specsSize: '18" x 24" or 24" x 36"',
    specsSides: 'single-sided easel board',
    price: '$24',
    editorBase: '/editor/poster',
    catalogBase: '/posters',
    testimonial: '“The poster looked magnificent on the easel at the entrance of the chapel. High resolution and vivid colors.”',
    author: 'David M.',
    aspect: 'aspect-[3/4]',
    orientation: 'portrait'
  },
  'prayer': {
    name: 'Funeral Prayer Cards',
    size: '2.5" x 4.25" keepsake prayer cards',
    specsSize: '2.5" x 4.25"',
    specsSides: 'double-sided (Front photo, Back prayer/poem)',
    price: '$19',
    editorBase: '/editor/prayer',
    catalogBase: '/prayer-cards',
    testimonial: '“The 14 prayer presets were wonderful. Everyone took one home to keep in their Bible or wallet.”',
    author: 'Sarah L.',
    aspect: 'aspect-[1/1.6]',
    orientation: 'portrait'
  },
  'invitation': {
    name: 'Funeral Invitations',
    size: '5" x 7" ceremony announcements',
    specsSize: '5" x 7"',
    specsSides: 'single-sided with RSVP details',
    price: '$19',
    editorBase: '/editor/invitation',
    catalogBase: '/funeral-invitations',
    testimonial: '“FuneralFolio made it so easy to create a beautiful invitation and share it instantly with everyone.”',
    author: 'Rachel C.',
    aspect: 'aspect-[1/1.42]',
    orientation: 'portrait'
  },
  'program': {
    name: 'Funeral Programs',
    size: '8.5" x 11" bifold service booklets',
    specsSize: '8.5" x 11" (folds to 5.5" x 8.5")',
    specsSides: '4-page bifold spread',
    price: '$29',
    editorBase: '/editor/program',
    catalogBase: '/funeral-programs',
    testimonial: '“The program editor was so intuitive. Printing was flawless at our local FedEx Office.”',
    author: 'Michael B.',
    aspect: 'aspect-[1/1.42]',
    orientation: 'portrait'
  }
};

type TabView = 'front' | 'website' | 'package' | 'print' | 'quick';

export default function ProductDetailPage({ productType }: ProductDetailPageProps) {
  const { themeId } = useParams();
  const navigate = useNavigate();
  const { updateData } = useMemorial();
  const { getPrice, formatPrice } = usePricing();

  const config = PRODUCT_CONFIGS[productType] || PRODUCT_CONFIGS['thank-you'];
  const dynamicPrice = getPrice(productType);
  const formattedDynamicPrice = formatPrice(productType);

  const initialTemplate = TEMPLATES.find(t => t.id === normalizeThemeId(themeId)) || 
    (productType === 'thank-you' ? TEMPLATES.find(t => t.id === 'autumn-leaves') : null) ||
    TEMPLATES[0];

  const [activeTemplate, setActiveTemplate] = useState<Template>(initialTemplate);
  const [activeTabView, setActiveTabView] = useState<TabView>('front');

  useEffect(() => {
    if (themeId) {
      const match = TEMPLATES.find(t => t.id === normalizeThemeId(themeId));
      if (match) {
        setActiveTemplate(match);
      }
    }
  }, [themeId]);

  const handleSelectTemplate = (tmpl: Template) => {
    setActiveTemplate(tmpl);
    updateData({ theme: tmpl.name, themeId: tmpl.id });
    navigate(`${config.catalogBase}/${tmpl.id}`, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevTemplate = () => {
    const currentIndex = TEMPLATES.findIndex(t => t.id === activeTemplate.id);
    const prevIndex = (currentIndex - 1 + TEMPLATES.length) % TEMPLATES.length;
    handleSelectTemplate(TEMPLATES[prevIndex]);
  };

  const handleNextTemplate = () => {
    const currentIndex = TEMPLATES.findIndex(t => t.id === activeTemplate.id);
    const nextIndex = (currentIndex + 1) % TEMPLATES.length;
    handleSelectTemplate(TEMPLATES[nextIndex]);
  };

  const handleScrollCarousel = (direction: 'left' | 'right') => {
    const container = document.getElementById('related-themes-carousel');
    if (container) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${activeTemplate.name} ${config.name} Template`,
    "image": activeTemplate.image,
    "description": `Customizable ${activeTemplate.name} ${config.size} template. Instant high-resolution print-ready PDF with matching stationery.`,
    "brand": {
      "@type": "Brand",
      "name": "FuneralFolio"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://funeralfolio.com${config.catalogBase}/${activeTemplate.id}`,
      "priceCurrency": "USD",
      "price": dynamicPrice.toString(),
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2027-12-31"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "319",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <div className="bg-[#fcfaf8] min-h-screen pt-28 pb-32 font-sans selection:bg-[#967440]/20">
      <Meta 
        title={`${activeTemplate.name} ${config.name} Template | FuneralFolio`}
        description={`Customize and download the ${activeTemplate.name} ${config.size} template. Instant print-ready PDF download with matching stationery.`}
        canonical={`https://funeralfolio.com${config.catalogBase}/${activeTemplate.id}`}
        ogImage={activeTemplate.image}
        schema={productSchema}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Main Product Display Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Main Card Preview Canvas + 5 Thumbnails */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Card Frame Showcase */}
            <div className="relative aspect-[1.15/1] sm:aspect-[1.48/1] min-h-[290px] sm:min-h-[400px] bg-white rounded-3xl overflow-hidden shadow-[0_15px_45px_rgba(44,24,16,0.08)] border border-[#e8dfd8] flex items-center justify-center p-3 sm:p-8 select-none group">
              
              {/* Top-Left Tag */}
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-[#2c1810]/75 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow-xs">
                  {config.name}
                </span>
              </div>

              {/* Prev / Next Chevrons on Canvas */}
              <button
                onClick={handlePrevTemplate}
                className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all z-20 cursor-pointer"
                title="Previous Template"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={handleNextTemplate}
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all z-20 cursor-pointer"
                title="Next Template"
              >
                <ChevronRight size={18} />
              </button>

              {/* Main Card View: Landscape or Portrait */}
              {activeTabView === 'front' && (
                <div className={cn(
                  "relative bg-white rounded-2xl overflow-hidden border border-[#967440]/20 flex items-center justify-center p-4 sm:p-6",
                  config.orientation === 'landscape' ? "w-full h-full max-h-[340px]" : "h-full max-h-[350px] max-w-[240px] sm:max-w-[300px] aspect-[1/1.42]"
                )}>
                  {/* Single Full Theme Background Photo */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <img 
                      src={activeTemplate.image} 
                      alt="" 
                      className="w-full h-full object-cover opacity-25 mix-blend-multiply" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/85 pointer-events-none" />
                  </div>



                  {/* Inner Content Display */}
                  {config.orientation === 'landscape' ? (
                    <div className="relative z-10 w-full max-w-[420px] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                      <div className="shrink-0">
                        <div className="w-18 h-18 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 sm:border-3 border-[#8b6534] bg-[#f4ece4] shadow-md">
                          <img 
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" 
                            alt="Memorial Portrait" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </div>
                      <div className="flex-1 text-center space-y-1 sm:space-y-1.5">
                        <h3 className="font-serif font-bold text-xl sm:text-[26px] text-[#782828] tracking-tight">
                          Thank You
                        </h3>
                        <p className="font-serif text-[10px] sm:text-xs text-[#6e3b3b] leading-relaxed">
                          The family acknowledges with deep appreciation your kind expression of sympathy.
                        </p>
                        <p className="font-serif italic text-[11px] sm:text-xs text-[#8c4b4b] pt-0.5 sm:pt-1">
                          The Family of Sample Memorial
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative z-10 flex flex-col items-center justify-between h-full py-1.5 sm:py-2 text-center">
                      <div>
                        <p className="font-serif italic text-[10px] sm:text-xs text-[#634832]">In Loving Memory</p>
                        <h3 className="font-serif font-bold text-sm sm:text-lg text-[#5c4033] tracking-tight mt-0.5">
                          Loved One
                        </h3>
                      </div>
                      <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 border-[#8b6534]/40 bg-[#f4ece4] shadow-inner my-1 sm:my-2">
                        <img 
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" 
                          alt="" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-serif text-[9px] sm:text-[10px] font-bold text-[#5c4033]">1940 – 2026</p>
                        <p className="text-[8px] sm:text-[9px] text-gray-500">Grace Memorial Chapel</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Website Mockup View */}
              {activeTabView === 'website' && (
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop" 
                    alt="Online Memorial Website View" 
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              )}

              {/* Package View */}
              {activeTabView === 'package' && (
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  <img 
                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop" 
                    alt="Complete Memorial Stationery Suite" 
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              )}

              {/* Print View */}
              {activeTabView === 'print' && (
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  <img 
                    src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800&auto=format&fit=crop" 
                    alt="Printed Stationery on Desk" 
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              )}

              {/* Quick & Easy View */}
              {activeTabView === 'quick' && (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-3 bg-[#fdfaf7] rounded-xl">
                  <div className="w-14 h-14 rounded-full bg-[#967440]/10 text-[#967440] flex items-center justify-center">
                    <Sparkles size={28} />
                  </div>
                  <h4 className="font-serif font-bold text-xl text-[#2c1810]">Quick & Easy AI Customizer</h4>
                  <p className="text-xs text-gray-600 max-w-sm leading-relaxed">
                    Personalize your {config.name.toLowerCase()} in under 5 minutes with assisted wording and instant high-res downloads.
                  </p>
                </div>
              )}
            </div>

            {/* 5 Thumbnails Row */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3 pt-1">
              
              <button
                onClick={() => setActiveTabView('front')}
                className={cn(
                  "p-1.5 rounded-2xl bg-white border transition-all text-center space-y-1 cursor-pointer",
                  activeTabView === 'front' 
                    ? "border-[#8b6534] ring-2 ring-[#8b6534]/20 shadow-sm" 
                    : "border-gray-200 hover:border-gray-300 opacity-75 hover:opacity-100"
                )}
              >
                <div className="aspect-[1.4/1] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 p-1 flex items-center justify-center">
                  <span className="text-[9px] font-serif font-bold text-[#782828] truncate">{activeTemplate.name}</span>
                </div>
                <span className="block text-[10px] font-bold text-gray-700 truncate">{config.name.split(' ')[0]}</span>
              </button>

              <button
                onClick={() => setActiveTabView('website')}
                className={cn(
                  "p-1.5 rounded-2xl bg-white border transition-all text-center space-y-1 cursor-pointer",
                  activeTabView === 'website' 
                    ? "border-[#8b6534] ring-2 ring-[#8b6534]/20 shadow-sm" 
                    : "border-gray-200 hover:border-gray-300 opacity-75 hover:opacity-100"
                )}
              >
                <div className="aspect-[1.4/1] rounded-xl overflow-hidden bg-gray-100">
                  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=150&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
                </div>
                <span className="block text-[10px] font-bold text-gray-700">Website</span>
              </button>

              <button
                onClick={() => setActiveTabView('package')}
                className={cn(
                  "p-1.5 rounded-2xl bg-white border transition-all text-center space-y-1 cursor-pointer",
                  activeTabView === 'package' 
                    ? "border-[#8b6534] ring-2 ring-[#8b6534]/20 shadow-sm" 
                    : "border-gray-200 hover:border-gray-300 opacity-75 hover:opacity-100"
                )}
              >
                <div className="aspect-[1.4/1] rounded-xl overflow-hidden bg-gray-100">
                  <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=150&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
                </div>
                <span className="block text-[10px] font-bold text-gray-700">Package</span>
              </button>

              <button
                onClick={() => setActiveTabView('print')}
                className={cn(
                  "p-1.5 rounded-2xl bg-white border transition-all text-center space-y-1 cursor-pointer",
                  activeTabView === 'print' 
                    ? "border-[#8b6534] ring-2 ring-[#8b6534]/20 shadow-sm" 
                    : "border-gray-200 hover:border-gray-300 opacity-75 hover:opacity-100"
                )}
              >
                <div className="aspect-[1.4/1] rounded-xl overflow-hidden bg-gray-100">
                  <img src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=150&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
                </div>
                <span className="block text-[10px] font-bold text-gray-700">Print</span>
              </button>

              <button
                onClick={() => setActiveTabView('quick')}
                className={cn(
                  "p-1.5 rounded-2xl bg-white border transition-all text-center space-y-1 cursor-pointer",
                  activeTabView === 'quick' 
                    ? "border-[#8b6534] ring-2 ring-[#8b6534]/20 shadow-sm" 
                    : "border-gray-200 hover:border-gray-300 opacity-75 hover:opacity-100"
                )}
              >
                <div className="aspect-[1.4/1] rounded-xl overflow-hidden bg-[#fdfaf7] border border-gray-100 flex flex-col items-center justify-center text-[#967440]">
                  <span className="text-[8px] uppercase font-bold tracking-tight">Quick & Easy</span>
                </div>
                <span className="block text-[10px] font-bold text-gray-700">Quick</span>
              </button>

            </div>

          </div>

          {/* RIGHT COLUMN: Product Title, Rating, Price Card, CTA, Features & Details */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Title & Reviews */}
            <div className="space-y-1.5">
              <h1 className="font-serif font-normal text-3xl sm:text-4xl text-[#2c1810] tracking-tight leading-tight">
                {activeTemplate.name} {config.name} Template
              </h1>
              <p className="text-xs text-gray-500 font-medium">{config.size}</p>
              
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center text-[#967440]">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-800">4.8</span>
                <span className="text-xs text-gray-500 underline underline-offset-2 cursor-pointer">
                  319 reviews
                </span>
              </div>
            </div>

            {/* Price Selection Card */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                  <span className="text-[8px] font-serif font-bold text-[#782828] truncate">{activeTemplate.name}</span>
                </div>
                <span className="text-sm font-serif font-bold text-[#2c1810]">
                  {config.name}
                </span>
              </div>
              <span className="text-2xl font-serif font-bold text-[#2c1810]">{formattedDynamicPrice}</span>
            </div>

            {/* Big Brown Primary CTA Button */}
            <button
              onClick={() => {
                updateData({ theme: activeTemplate.name, themeId: activeTemplate.id });
                navigate(`${config.editorBase}/${activeTemplate.id}`);
              }}
              className="w-full bg-[#8b6534] hover:bg-[#785429] text-white font-bold text-base py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer text-center block"
            >
              Customize this template
            </button>

            {/* Green Checkmarks & Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 pt-2 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-[#10b981]">🪄</span>
                <span>Customize online in minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#10b981]">✍️</span>
                <span>Guided obituary writer</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#10b981]">📄</span>
                <span>Print-ready PDF downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#10b981]">📱</span>
                <span>Printable QR code</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#10b981]">🖨️</span>
                <span>Print at <strong>FedEx Office</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#10b981]">🌐</span>
                <span>Online memorial page with guestbook</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#10b981]">🔄</span>
                <span>Unlimited edits</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#10b981]">🛡️</span>
                <span>100% satisfaction guarantee</span>
              </div>
              <div className="sm:col-span-2 flex items-center gap-2">
                <span className="text-[#10b981]">💰</span>
                <span>Save compared with funeral home pricing</span>
              </div>
            </div>

            {/* Print Provider Logos */}
            <div className="pt-2 flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all text-xs text-gray-400">
              <span className="font-bold text-[11px] tracking-wider text-gray-600">STAPLES</span>
              <span className="font-bold text-[11px] tracking-wider text-gray-600">FedEx Office</span>
              <span className="font-bold text-[11px] tracking-wider text-gray-600">Office DEPOT</span>
              <span className="font-bold text-[11px] tracking-wider text-gray-600">Walgreens</span>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-6 text-xs text-gray-700">
              
              {/* Section 1: Print Anywhere */}
              <div className="space-y-1.5">
                <h4 className="font-serif font-bold text-sm text-[#2c1810]">Print Anywhere</h4>
                <p className="text-gray-600 leading-relaxed">
                  Download your designs as print-ready PDFs and print at Staples, FedEx Office, Office Depot, Local Printer.
                </p>
                <p className="text-gray-500 flex items-center gap-1.5 pt-0.5">
                  <span>🖨️</span>
                  <span>Or print at home • Professional quality guaranteed</span>
                </p>
              </div>

              {/* Section 2: Quick & Easy */}
              <div className="space-y-1.5">
                <h4 className="font-serif font-bold text-sm text-[#2c1810]">Quick & Easy</h4>
                <p className="text-gray-600 leading-relaxed">
                  Most families complete their memorial package in under 30 minutes. Our AI helps write the obituary. Just answer a few questions.
                </p>
              </div>

              {/* Section 3: Specifications */}
              <div className="space-y-1.5">
                <h4 className="font-serif font-bold text-sm text-[#2c1810]">Specifications</h4>
                <p className="font-semibold text-gray-800">{config.name}</p>
                <ul className="space-y-1 text-gray-600 list-disc list-inside">
                  <li>Size: {config.specsSize}</li>
                  <li>Sides: {config.specsSides}</li>
                  <li>Format: PDF/JPG download</li>
                </ul>
              </div>

              {/* Section 4: What Families Say */}
              <div className="space-y-2.5 bg-white p-5 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#2c1810]">What Families Say</h4>
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-[#967440]">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-gray-800">4.8 · 319 reviews</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 space-y-1.5">
                  <div className="flex text-[#967440]">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} size={11} fill="currentColor" />
                    ))}
                  </div>
                  <p className="font-serif italic text-xs text-gray-700 leading-relaxed">
                    {config.testimonial}
                  </p>
                  <p className="text-[11px] font-bold text-gray-800">— {config.author}</p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM SECTION: Related Themes Slider / Carousel */}
        <div className="mt-24 pt-12 border-t border-gray-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-2xl text-[#2c1810]">
                Related Themes
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Explore similar looks with {config.name} previews pre-selected.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScrollCarousel('left')}
                className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-gray-400 text-gray-700 flex items-center justify-center shadow-xs transition-all cursor-pointer"
                title="Scroll Left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => handleScrollCarousel('right')}
                className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-gray-400 text-gray-700 flex items-center justify-center shadow-xs transition-all cursor-pointer"
                title="Scroll Right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div 
            id="related-themes-carousel"
            className="flex items-center gap-4 overflow-x-auto pb-6 pt-2 scrollbar-none scroll-smooth"
          >
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className={cn(
                  "shrink-0 w-44 sm:w-48 bg-white rounded-2xl p-2 border transition-all text-left group cursor-pointer",
                  activeTemplate.id === tmpl.id
                    ? "border-[#8b6534] ring-2 ring-[#8b6534]/20 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                )}
              >
                <div className="relative aspect-[1.5/1] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-2 p-1.5 flex items-center justify-center">
                  <img 
                    src={tmpl.image} 
                    alt={tmpl.name} 
                    className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="relative z-10 flex items-center justify-center gap-1.5 w-full px-1">
                    <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-[#8b6534]">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <span className="font-serif font-bold text-[9px] text-[#782828] truncate">
                      {tmpl.name}
                    </span>
                  </div>
                </div>

                <p className="font-serif font-bold text-xs text-[#2c1810] truncate group-hover:text-[#8b6534] transition-colors">
                  {tmpl.name}
                </p>
                <p className="text-[10px] text-gray-400">
                  {tmpl.category}
                </p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
