import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Meta from '../components/Meta';
import { 
  Heart, 
  CheckCircle2, 
  Printer, 
  Sparkles, 
  Star, 
  ChevronDown, 
  ArrowRight,
  BookOpen,
  Image as ImageIcon,
  Layers,
  Clock,
  Send
} from 'lucide-react';
import { TEMPLATES } from '../constants';
import { cn } from '../lib/utils';
import ProductWizard from '../components/ProductWizard';

const FAQ_ITEMS = [
  {
    question: "What size are standard funeral prayer cards?",
    answer: "Standard memorial prayer cards are pocket-sized at 2.5\" x 4.25\" (or 2.25\" x 4.25\"), designed specifically to fit comfortably in wallets, Bibles, and prayer books."
  },
  {
    question: "What prayers and poems can I include on the card?",
    answer: "Our editor includes a built-in library of 14 traditional and modern prayers and poems—including Psalm 23, The Lord's Prayer, Prayer of St. Francis, Do Not Stand at My Grave and Weep, Irish Blessing, and more—or you can write your own custom text."
  },
  {
    question: "Can I print multiple prayer cards on a single sheet of paper?",
    answer: "Yes! When you download your print-ready PDF, it is formatted for multi-up layout (8 cards per 8.5\" x 11\" Letter sheet) with precise cut marks for easy cutting at home or at a local print shop."
  },
  {
    question: "How do I add a photo of my loved one?",
    answer: "You can easily upload any portrait photo in our editor. The system automatically centers, frames, and applies high-resolution enhancement to ensure it prints crisply."
  },
  {
    question: "How quickly can I create and download my cards?",
    answer: "Most families finish their prayer cards in under 5 minutes and receive an instant 300 DPI PDF download ready for same-day printing."
  }
];

export default function PrayerCards() {
  const navigate = useNavigate();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_ITEMS.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <div className="bg-white min-h-screen pt-28 pb-32 font-sans selection:bg-[#967440]/20">
      <Meta 
        title="Memorial Prayer Cards & Holy Keepsake Cards | FuneralFolio"
        description="Design personalized 2.5x4.25 inch funeral prayer cards and memorial cards. Includes 14 prayer presets, photo upload, and instant print-ready multi-up PDF download."
        canonical="https://funeralfolio.com/prayer-cards"
        schema={faqSchema}
      />

      <ProductWizard
        productType="prayer"
        productTitle="Start Your Prayer Card"
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSelectTheme={(themeId) => {
          setIsWizardOpen(false);
          navigate(`/prayer-cards/${themeId}`);
        }}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 space-y-24">
        
        {/* 1. HERO SECTION: Split Layout (Exact Match for Invitations & Thank You Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-serif font-normal text-4xl sm:text-5xl lg:text-[54px] text-[#2c1810] tracking-tight leading-[1.15]">
              Cherished Keepsake Prayer Cards
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-sans leading-relaxed max-w-2xl">
              Pocket-sized memorial cards featuring favorite portraits, scripture, blessings, or commemorative poetry. A tender keepsake for family and friends to carry always.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('explore-themes-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#8b6534] hover:bg-[#785429] text-white font-bold text-sm py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Browse Prayer Cards</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[460px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800" 
                alt="Hands holding memorial keepsake prayer cards during church ceremony" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          </div>

        </div>

        {/* 2. EXPLORE OUR THEMES: 4-Column Card Gallery (Click navigates to /prayer-cards/:themeId) */}
        <div id="explore-themes-grid" className="space-y-10 pt-6">
          <div className="text-center space-y-2">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#2c1810]">
              Explore Our Themes
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
              Browse our collection of themes with unique designs, floral borders, and typography for your funeral prayer cards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {TEMPLATES.map((tmpl, idx) => (
              <motion.div
                key={tmpl.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 4) * 0.04 }}
                onClick={() => navigate(`/prayer-cards/${tmpl.id}`)}
                className="group bg-white rounded-3xl p-3 border border-gray-200/80 hover:border-[#8b6534] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* 2.5:4.25 Pocket Prayer Card Mockup Canvas */}
                <div className="relative aspect-[1/1.6] bg-[#fdfaf7] rounded-2xl overflow-hidden border border-gray-100 p-3 flex flex-col justify-between items-center text-center select-none">
                  
                  {/* Single Full Theme Background Photo */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <img 
                      src={tmpl.image} 
                      alt="" 
                      className="w-full h-full object-cover opacity-25 mix-blend-multiply" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/85 pointer-events-none" />
                  </div>



                  {/* Prayer Card Content */}
                  <div className="relative z-10 w-full flex flex-col items-center justify-between h-full py-1">
                    <div>
                      <p className="font-serif italic text-[8px] text-[#634832]">
                        Forever in Our Hearts
                      </p>
                      <h4 className="font-serif font-bold text-xs text-[#5c4033] tracking-tight mt-0.5">
                        Loved One
                      </h4>
                    </div>

                    {/* Framed Oval / Rectangular Portrait */}
                    <div className="w-16 h-20 rounded-md overflow-hidden border border-[#8b6534]/40 bg-[#f4ece4] shadow-xs my-1">
                      <img 
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    <div className="space-y-0.5 w-full">
                      <p className="font-serif text-[8px] font-bold text-[#5c4033]">
                        1940 – 2026
                      </p>
                      <p className="font-serif italic text-[7px] text-[#7a5c43]">
                        Psalm 23
                      </p>
                    </div>
                  </div>

                  {/* Hover Customize Button Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 z-20">
                    <button className="w-full bg-[#8b6534] text-white py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider shadow-md">
                      View Prayer Card
                    </button>
                  </div>
                </div>

                {/* Footer Label */}
                <div className="px-2 pt-3 pb-1 flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-[#2c1810] group-hover:text-[#8b6534] transition-colors truncate">
                    {tmpl.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-gray-400">
                    {tmpl.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3. WHY FAMILIES CHOOSE FUNERALFOLIO (6 Features Grid) */}
        <div className="space-y-12 pt-12 border-t border-gray-100">
          <div className="text-center space-y-2">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#2c1810]">
              Why Families Choose FuneralFolio
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            
            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#8b6534]/10 text-[#8b6534] flex items-center justify-center mx-auto">
                <Heart size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Meaningful Keepsake
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                A tangible token of remembrance that family and friends will preserve in their Bibles and wallets for years.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#8b6534]/10 text-[#8b6534] flex items-center justify-center mx-auto">
                <BookOpen size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Library of 14 Prayers & Poems
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Choose from Psalm 23, Lord's Prayer, St. Francis, Irish Blessing, and more with 1-click text insertion.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#8b6534]/10 text-[#8b6534] flex items-center justify-center mx-auto">
                <ImageIcon size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                High-Resolution Photos
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Automatic photo enhancement and vector borders guarantee crisp, vivid printing.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#8b6534]/10 text-[#8b6534] flex items-center justify-center mx-auto">
                <Printer size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Multi-Up Print-Ready PDF
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Specially formatted with 8 cards per standard Letter sheet and cutting guides for at-home or pro printing.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#8b6534]/10 text-[#8b6534] flex items-center justify-center mx-auto">
                <Layers size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Coordinated Stationery
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Seamlessly match your prayer cards with programs, posters, invitations, and thank you notes.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#8b6534]/10 text-[#8b6534] flex items-center justify-center mx-auto">
                <Clock size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Ready in 5 Minutes
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Quick, compassionate customizer with Front & Back card preview and instant downloads.
              </p>
            </div>

          </div>
        </div>

        {/* 4. TESTIMONIAL CARD */}
        <div className="max-w-4xl mx-auto bg-[#fdfaf7] rounded-3xl p-8 sm:p-12 text-center border border-gray-200/60 shadow-xs space-y-6">
          <div className="flex justify-center text-[#8b6534]">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={18} fill="currentColor" />
            ))}
          </div>
          <blockquote className="font-serif italic text-lg sm:text-xl text-[#2c1810] leading-relaxed max-w-2xl mx-auto">
            “The prayer cards turned out breathtakingly beautiful. The built-in Psalm 23 and portrait photo were so easy to set up, and printing at our local shop took only an hour.”
          </blockquote>
          <div className="space-y-1">
            <p className="font-bold text-sm text-[#2c1810]">Sarah L.</p>
            <p className="text-xs text-gray-500">Created for her grandmother's celebration of life</p>
          </div>
        </div>

        {/* 5. BOTTOM CTA BANNER */}
        <div className="max-w-4xl mx-auto bg-[#fdfaf7] rounded-3xl p-10 sm:p-14 text-center border border-gray-200/60 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#2c1810]">
            Ready to Create Memorial Prayer Cards?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            Select from our curated collection of keepsake prayer cards with front and back customization.
          </p>
          <button
            onClick={() => {
              const el = document.getElementById('explore-themes-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-[#8b6534] hover:bg-[#785429] text-white font-bold text-sm py-4 px-9 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Start Creating Prayer Cards</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 6. FREQUENTLY ASKED QUESTIONS */}
        <div className="max-w-3xl mx-auto space-y-8 pt-4">
          <div className="text-center space-y-2">
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#2c1810]">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-[#2c1810] hover:text-[#8b6534] transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown 
                      size={18} 
                      className={cn(
                        "shrink-0 text-gray-400 transition-transform duration-200",
                        isOpen && "rotate-180 text-[#8b6534]"
                      )} 
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
