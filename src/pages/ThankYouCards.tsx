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
  Send,
  PenTool,
  Clock,
  Layers
} from 'lucide-react';
import { TEMPLATES } from '../constants';
import { cn } from '../lib/utils';
import ProductWizard from '../components/ProductWizard';

const FAQ_ITEMS = [
  {
    question: "When should I send funeral thank you cards?",
    answer: "Typically, it's recommended to send thank you cards within 2 to 4 weeks after the service, but it's never too late to express gratitude for support received during a difficult time."
  },
  {
    question: "Who should receive a thank you card?",
    answer: "You should send cards to anyone who sent flowers, made a donation, brought food, assisted with the service, or provided significant emotional support."
  },
  {
    question: "What should I write in a funeral thank you card?",
    answer: "Keep it simple and sincere. Our editor includes several pre-written heartfelt suggested messages that you can use or customize with a single click."
  },
  {
    question: "Can I include a photo on the thank you card?",
    answer: "Yes, all our templates feature a dedicated portrait photo frame to honor your loved one as a cherished keepsake for recipients."
  }
];

export default function ThankYouCards() {
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
        title="Memorial Thank You Cards & Gratitude Notes | FuneralFolio" 
        description="Express your gratitude with personalized funeral thank you cards. Coordinate designs with your memorial service theme with instant 300 DPI PDF download."
        canonical="https://funeralfolio.com/thank-you-cards"
        schema={faqSchema}
      />

      <ProductWizard
        productType="thank-you"
        productTitle="Start Your Thank You Card"
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSelectTheme={(themeId) => {
          setIsWizardOpen(false);
          navigate(`/thank-you-cards/${themeId}`);
        }}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 space-y-24">
        
        {/* 1. HERO SECTION: Split Layout (Exact Match for Screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-serif font-normal text-4xl sm:text-5xl lg:text-[54px] text-[#2c1810] tracking-tight leading-[1.15]">
              Memorial Thank You & Condolence Cards
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-sans leading-relaxed max-w-2xl">
              Express heartfelt gratitude for flowers, comforting words, and support. Easily customize with pre-written messages or your own thoughtful sentiments.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('explore-themes-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#8b6534] hover:bg-[#785429] text-white font-bold text-sm py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Browse Thank You Cards</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[460px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop" 
                alt="Hands holding memorial thank you card in chapel" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          </div>

        </div>

        {/* 2. EXPLORE OUR THEMES: 4-Column Card Gallery (Click navigates to /thank-you-cards/:themeId) */}
        <div id="explore-themes-grid" className="space-y-10 pt-6">
          <div className="text-center space-y-2">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#2c1810]">
              Explore Our Themes
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
              Browse our collection of themes with unique designs, floral borders, and typography for your funeral thank you cards.
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
                onClick={() => navigate(`/thank-you-cards/${tmpl.id}`)}
                className="group bg-white rounded-3xl p-3 border border-gray-200/80 hover:border-[#8b6534] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Landscape 4x6 Card Mockup Canvas */}
                <div className="relative aspect-[1.5/1] bg-[#fdfaf7] rounded-2xl overflow-hidden border border-gray-100 p-3.5 flex items-center justify-between select-none">
                  
                  {/* Floral Theme Garland Border */}
                  {/* Single Full Theme Background Photo */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <img 
                      src={tmpl.image} 
                      alt="" 
                      className="w-full h-full object-cover opacity-25 mix-blend-multiply" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/60 to-white/85 pointer-events-none" />
                  </div>



                  {/* Inner Card Content */}
                  <div className="relative z-10 w-full flex items-center justify-between gap-2.5 px-1">
                    {/* Circular Portrait */}
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-[#8b6534] bg-[#f4ece4] shrink-0 shadow-xs">
                      <img 
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    <div className="flex-1 text-center space-y-0.5">
                      <h4 className="font-serif font-bold text-xs text-[#782828] tracking-tight">
                        Thank You
                      </h4>
                      <p className="font-serif text-[7px] text-[#6e3b3b] leading-tight line-clamp-2">
                        The family acknowledges with deep appreciation your kind expression of sympathy.
                      </p>
                      <p className="font-serif italic text-[6px] text-[#8c4b4b]">
                        The Family of Sample
                      </p>
                    </div>
                  </div>

                  {/* Hover Customize Button Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 z-20">
                    <button className="w-full bg-[#8b6534] text-white py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider shadow-md">
                      View Thank You Card
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
                Express Heartfelt Gratitude
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Show your appreciation to those who offered support, attended the service, or sent flowers.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#8b6534]/10 text-[#8b6534] flex items-center justify-center mx-auto">
                <Sparkles size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Easy Customization
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Personalize every detail with pre-written messages, loved one's photo, and custom family signature.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#8b6534]/10 text-[#8b6534] flex items-center justify-center mx-auto">
                <Layers size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Coordinated Designs
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Match your thank you cards with your funeral program, prayer cards, or invitations.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#8b6534]/10 text-[#8b6534] flex items-center justify-center mx-auto">
                <Printer size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Print-Ready Quality
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Download high-resolution 300 DPI PDFs formatted for professional print shops or home printing.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#8b6534]/10 text-[#8b6534] flex items-center justify-center mx-auto">
                <Clock size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Created in Minutes
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Most families finish their thank you notes in under 5 minutes with our automated layout engine.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#8b6534]/10 text-[#8b6534] flex items-center justify-center mx-auto">
                <Send size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Digital & Physical
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Print physical keepsake cards or send high-resolution digital gratitude notes via email or text.
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
            “I was overwhelmed by all the support we received. Being able to create beautiful, coordinated thank you cards in minutes made it so much easier to express my gratitude to everyone.”
          </blockquote>
          <div className="space-y-1">
            <p className="font-bold text-sm text-[#2c1810]">Susan Mitchell</p>
            <p className="text-xs text-gray-500">Used after her husband's service</p>
          </div>
        </div>

        {/* 5. BOTTOM CTA BANNER */}
        <div className="max-w-4xl mx-auto bg-[#fdfaf7] rounded-3xl p-10 sm:p-14 text-center border border-gray-200/60 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#2c1810]">
            Ready to Send Thank You Cards?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            Select from our curated collection of thank you cards that coordinate seamlessly with your memorial stationery suite.
          </p>
          <button
            onClick={() => {
              const el = document.getElementById('explore-themes-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-[#8b6534] hover:bg-[#785429] text-white font-bold text-sm py-4 px-9 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Start Creating Thank You Cards</span>
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
