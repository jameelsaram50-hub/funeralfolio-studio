import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Meta from '../components/Meta';
import { 
  Frame, 
  CheckCircle2, 
  Printer, 
  Sparkles, 
  Star, 
  ChevronDown, 
  ArrowRight,
  Image as ImageIcon,
  Layers,
  Heart,
  Clock,
  Send
} from 'lucide-react';
import { TEMPLATES } from '../constants';
import { cn } from '../lib/utils';
import ProductWizard from '../components/ProductWizard';

const FAQ_ITEMS = [
  {
    question: "What sizes are available for memorial posters?",
    answer: "Our memorial posters and welcome signs are formatted in high-resolution vector dimensions for standard 18\" x 24\" and 24\" x 36\" easel boards and foam core mounting."
  },
  {
    question: "Where can I print my memorial poster?",
    answer: "You can download your 300 DPI high-resolution PDF and submit it online or in person to any local store (Walgreens, CVS, Staples, Office Depot, FedEx, or Walmart Photo) for same-day poster printing and foam board mounting."
  },
  {
    question: "Can I include multiple photos on the memorial sign?",
    answer: "Yes, our memorial poster templates feature elegant single portrait layouts as well as multi-photo memory collages with customizable dates and quote tributes."
  },
  {
    question: "Does the poster design match other stationery?",
    answer: "Yes, every poster template coordinates perfectly with our funeral programs, prayer cards, invitations, and thank you cards for a unified tribute."
  },
  {
    question: "How quickly can I download the print-ready PDF?",
    answer: "Downloads are instant. As soon as you finish personalizing your poster in our editor, you can immediately download the 300 DPI print-ready PDF file."
  }
];

export default function MemorialPosters() {
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
        title="Memorial Tribute Posters & Welcome Signs | FuneralFolio"
        description="Create dignified celebration of life posters, welcome signs, and photo tribute collages. Download instant 300 DPI print files for 18x24 and 24x36 boards."
        canonical="https://funeralfolio.com/posters"
        schema={faqSchema}
      />

      <ProductWizard
        productType="poster"
        productTitle="Start Your Memorial Poster"
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSelectTheme={(themeId) => {
          setIsWizardOpen(false);
          navigate(`/posters/${themeId}`);
        }}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 space-y-24">
        
        {/* 1. HERO SECTION: Split Layout (Exact Match for Invitations & Thank You Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-serif font-normal text-4xl sm:text-5xl lg:text-[54px] text-[#2c1810] tracking-tight leading-[1.15]">
              Memorial Posters & Welcome Signs
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-sans leading-relaxed max-w-2xl">
              Welcome family and guests with an elegant portrait tribute board. Formatted for standard 18x24" and 24x36" easel displays at chapels, churches, or celebration of life receptions.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('explore-themes-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#c5a059] hover:bg-[#785429] text-white font-bold text-sm py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Browse Poster Designs</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[460px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop" 
                alt="Memorial tribute poster displayed on easel at church reception" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          </div>

        </div>

        {/* 2. EXPLORE OUR THEMES: 4-Column Card Gallery (Click navigates to /posters/:themeId) */}
        <div id="explore-themes-grid" className="space-y-10 pt-6">
          <div className="text-center space-y-2">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#2c1810]">
              Explore Our Themes
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
              Browse our collection of themes with unique origins, colors, and typography for your memorial posters and welcome signs.
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
                onClick={() => navigate(`/posters/${tmpl.id}`)}
                className="group bg-white rounded-3xl p-3 border border-gray-200/80 hover:border-[#c5a059] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* 3:4 Poster Mockup Canvas */}
                <div className="relative aspect-[3/4] bg-[#fdfaf7] rounded-2xl overflow-hidden border border-gray-100 p-4 flex flex-col justify-between items-center text-center select-none">
                  
                  {/* Single Full Theme Background Photo */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <img 
                      src={tmpl.image} 
                      alt="" 
                      className="w-full h-full object-cover opacity-25 mix-blend-multiply" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/85 pointer-events-none" />
                  </div>



                  {/* Poster Content */}
                  <div className="relative z-10 w-full flex flex-col items-center justify-between h-full py-1">
                    <div>
                      <p className="font-serif italic text-[10px] text-[#634832]">
                        Celebration of Life
                      </p>
                      <h4 className="font-serif font-bold text-base text-[#5c4033] tracking-tight mt-0.5">
                        Loved One
                      </h4>
                    </div>

                    {/* Framed Large Portrait */}
                    <div className="w-24 h-32 rounded-lg overflow-hidden border-2 border-[#c5a059]/40 bg-[#f4ece4] shadow-md my-1.5">
                      <img 
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop" 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    <div className="space-y-0.5 w-full">
                      <p className="font-serif text-[9px] font-bold text-[#5c4033]">
                        1940 – 2026
                      </p>
                      <p className="text-[8px] text-gray-500 truncate px-2">
                        Forever in Our Hearts
                      </p>
                    </div>
                  </div>

                  {/* Hover Customize Button Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 z-20">
                    <button className="w-full bg-[#c5a059] text-white py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider shadow-md">
                      View Memorial Poster
                    </button>
                  </div>
                </div>

                {/* Footer Label */}
                <div className="px-2 pt-3 pb-1 flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-[#2c1810] group-hover:text-[#c5a059] transition-colors truncate">
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
              <div className="w-12 h-12 rounded-full bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center mx-auto">
                <Frame size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Easel & Welcome Board Ready
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Formatted in standard 18x24" and 24x36" dimensions for chapel entrances and celebration of life receptions.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center mx-auto">
                <ImageIcon size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                High-Definition Photo Clarity
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Enhanced rendering ensures your loved one's portrait looks crisp and vivid at large display scale.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center mx-auto">
                <Printer size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Same-Day Print Ready
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Download 300 DPI high-resolution PDFs ready for instant print at Walgreens, Staples, FedEx, or CVS.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center mx-auto">
                <Layers size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Coordinated Themes
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Harmonize with matching prayer cards, order of service booklets, invitations, and thank you notes.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center mx-auto">
                <Sparkles size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Quick Customization
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Personalize text and photos in minutes with our intuitive WYSIWYG editor. Everything stays aligned.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center mx-auto">
                <Heart size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Thoughtfully Designed
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Every template is created with sensitivity and respect, ensuring a dignified entrance presentation.
              </p>
            </div>

          </div>
        </div>

        {/* 4. TESTIMONIAL CARD */}
        <div className="max-w-4xl mx-auto bg-[#fdfaf7] rounded-3xl p-8 sm:p-12 text-center border border-gray-200/60 shadow-xs space-y-6">
          <div className="flex justify-center text-[#c5a059]">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={18} fill="currentColor" />
            ))}
          </div>
          <blockquote className="font-serif italic text-lg sm:text-xl text-[#2c1810] leading-relaxed max-w-2xl mx-auto">
            “The poster looked magnificent on the easel at the entrance of the chapel. High resolution, vivid colors, and so easy to print same-day at our local print shop.”
          </blockquote>
          <div className="space-y-1">
            <p className="font-bold text-sm text-[#2c1810]">David M.</p>
            <p className="text-xs text-gray-500">Created for his father's memorial service</p>
          </div>
        </div>

        {/* 5. BOTTOM CTA BANNER */}
        <div className="max-w-4xl mx-auto bg-[#fdfaf7] rounded-3xl p-10 sm:p-14 text-center border border-gray-200/60 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#2c1810]">
            Ready to Create a Memorial Poster?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            Select from our curated collection of easel tribute posters and welcome signs formatted in standard 18x24" and 24x36" sizes.
          </p>
          <button
            onClick={() => {
              const el = document.getElementById('explore-themes-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-[#c5a059] hover:bg-[#785429] text-white font-bold text-sm py-4 px-9 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Start Creating A Poster</span>
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
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-[#2c1810] hover:text-[#c5a059] transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown 
                      size={18} 
                      className={cn(
                        "shrink-0 text-gray-400 transition-transform duration-200",
                        isOpen && "rotate-180 text-[#c5a059]"
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
