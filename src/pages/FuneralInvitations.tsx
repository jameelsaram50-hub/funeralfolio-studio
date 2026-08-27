import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Meta from '../components/Meta';
import { 
  Share2, 
  CheckCircle2, 
  MapPin, 
  Printer, 
  Sparkles, 
  Heart, 
  Star, 
  ChevronDown, 
  ArrowRight,
  Send,
  CalendarCheck,
  Compass
} from 'lucide-react';
import { TEMPLATES } from '../constants';
import { cn } from '../lib/utils';
import ProductWizard from '../components/ProductWizard';

const FAQ_ITEMS = [
  {
    question: "What information should I include in a funeral invitation?",
    answer: "A complete funeral invitation includes the full name of the deceased, dates of birth and passing, the location, date and time of the service, details about the reception, and RSVP instructions for guests."
  },
  {
    question: "How do guests RSVP to digital invitations?",
    answer: "When you share the digital invitation link via text, email, or social media, guests can click the link and submit their RSVP response directly with one tap."
  },
  {
    question: "Can I print physical copies of the invitation?",
    answer: "Yes, every design includes an instant 300 DPI print-ready PDF download formatted in standard 5\" x 7\" card size for at-home or professional print shops (like Staples, FedEx Office, or Walgreens)."
  },
  {
    question: "How far in advance should funeral invitations be sent?",
    answer: "Funeral invitations are typically sent as soon as the service date and venue are confirmed—usually 3 to 7 days before the ceremony."
  },
  {
    question: "Can I include directions to the service?",
    answer: "Yes, you can specify the exact church or chapel venue name and physical street address so guests can navigate easily."
  }
];

export default function FuneralInvitations() {
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
        title="Custom Funeral Invitations & Memorial Announcements | FuneralFolio"
        description="Create and share elegant funeral invitations in minutes. Beautiful 5x7 inch print-ready PDFs and instant digital sharing."
        canonical="https://funeralfolio.com/funeral-invitations"
        schema={faqSchema}
      />

      <ProductWizard
        productType="invitation"
        productTitle="Start Your Funeral Invitation"
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSelectTheme={(themeId) => {
          setIsWizardOpen(false);
          navigate(`/editor/invitation/${themeId}`);
        }}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 space-y-24">
        
        {/* 1. HERO SECTION: Split Layout (Exact Match for Screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-serif font-normal text-4xl sm:text-5xl lg:text-[54px] text-[#2c1810] tracking-tight leading-[1.15]">
              Memorial & Funeral Invitations
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-sans leading-relaxed max-w-2xl">
              Invite family and friends with grace. Clearly share service dates, chapel locations, and reception details. Download print-ready 5x7" cards or share digitally with one click.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('explore-themes-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#8b6534] hover:bg-[#785429] text-white font-bold text-sm py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Browse Invitations</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[460px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop" 
                alt="Hands holding elegant memorial service invitations in church" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          </div>

        </div>

        {/* 2. EXPLORE OUR THEMES: 4-Column Card Gallery (Exact Match for Screenshot) */}
        <div id="explore-themes-grid" className="space-y-10 pt-6">
          <div className="text-center space-y-2">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#2c1810]">
              Explore Our Themes
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
              Browse our collection of themes with unique origins, colors, and typography for your funeral invitations.
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
                onClick={() => navigate(`/funeral-invitations/${tmpl.id}`)}
                className="group bg-white rounded-3xl p-3 border border-gray-200/80 hover:border-[#8b6534] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* 5x7 Invitation Card Mockup Canvas */}
                <div className="relative aspect-[1/1.42] bg-[#fdfaf7] rounded-2xl overflow-hidden border border-gray-100 p-3.5 flex flex-col justify-between items-center text-center select-none">
                  
                  {/* Single Full Theme Background Photo */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <img 
                      src={tmpl.image} 
                      alt="" 
                      className="w-full h-full object-cover opacity-25 mix-blend-multiply" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/85 pointer-events-none" />
                  </div>



                  {/* Card Content Snippet */}
                  <div className="relative z-10 w-full flex flex-col items-center justify-between h-full py-1">
                    <div>
                      <p className="font-serif italic text-[9px] text-[#634832]">
                        Celebration of Life
                      </p>
                      <h4 className="font-serif font-bold text-sm text-[#5c4033] tracking-tight mt-0.5">
                        Loved One
                      </h4>
                    </div>

                    {/* Circular / Framed Photo Box */}
                    <div className="w-16 h-20 rounded-md overflow-hidden border border-[#8b6534]/40 bg-[#f4ece4] shadow-inner my-1">
                      <img 
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    <div className="space-y-0.5 w-full">
                      <p className="font-serif text-[8px] font-bold text-[#5c4033]">
                        August 28, 2026 at 11:00 AM
                      </p>
                      <p className="text-[7px] text-gray-500 truncate px-2">
                        Grace Baptist Church • Houston, TX
                      </p>
                      <p className="font-serif italic text-[7px] text-[#7a5c43] pt-0.5">
                        Reception to follow
                      </p>
                    </div>
                  </div>

                  {/* Hover Customize Button Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 z-20">
                    <button className="w-full bg-[#8b6534] text-white py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider shadow-md">
                      Customize Invitation
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
            
            {/* Feature 1 */}
            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#8b6534]/10 text-[#8b6534] flex items-center justify-center mx-auto">
                <Send size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Instant Digital Sharing
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Share invitations instantly via email, text message, or social media. Reach everyone in minutes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#8b6534]/10 text-[#8b6534] flex items-center justify-center mx-auto">
                <CalendarCheck size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Easy RSVPs & Tracking
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Track RSVPs effortlessly with built-in RSVP functionality. Know your guest count without endless messages.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#8b6534]/10 text-[#8b6534] flex items-center justify-center mx-auto">
                <Compass size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Interactive Maps
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Interactive maps and directions ensure guests arrive at the venue easily and without confusion.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#8b6534]/10 text-[#8b6534] flex items-center justify-center mx-auto">
                <Printer size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Print-Ready Files
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Download high-quality PDFs for printing matching invitations to mail or hand out in person.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#8b6534]/10 text-[#8b6534] flex items-center justify-center mx-auto">
                <Sparkles size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Quick Customization
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Personalize text and photos in minutes with our intuitive editor. Everything formats automatically.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center space-y-3 p-6 rounded-3xl bg-[#fcfaf8] border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#8b6534]/10 text-[#8b6534] flex items-center justify-center mx-auto">
                <Heart size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                Thoughtfully Designed
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Coordinate your invitations with matching programs, prayer cards, and thank you notes.
              </p>
            </div>

          </div>
        </div>

        {/* 4. TESTIMONIAL CARD (Exact Match for Screenshot) */}
        <div className="max-w-4xl mx-auto bg-[#fdfaf7] rounded-3xl p-8 sm:p-12 text-center border border-gray-200/60 shadow-xs space-y-6">
          <div className="flex justify-center text-[#8b6534]">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={18} fill="currentColor" />
            ))}
          </div>
          <blockquote className="font-serif italic text-lg sm:text-xl text-[#2c1810] leading-relaxed max-w-2xl mx-auto">
            “With family scattered across the country, I needed a way to quickly notify everyone about my mother's service. FuneralFolio made it so easy to create a beautiful invitation and share it instantly. The RSVP feature helped us plan for the reception perfectly.”
          </blockquote>
          <div className="space-y-1">
            <p className="font-bold text-sm text-[#2c1810]">Rachel Chen</p>
            <p className="text-xs text-gray-500">Created for her mother's memorial service</p>
          </div>
        </div>

        {/* 5. BOTTOM CTA BANNER (Exact Match for Screenshot) */}
        <div className="max-w-4xl mx-auto bg-[#fdfaf7] rounded-3xl p-10 sm:p-14 text-center border border-gray-200/60 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#2c1810]">
            Ready to Invite Friends and Family?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            Create a customized invitation to honour your loved one, coordinate service details, and connect the friends and family whose lives they touched.
          </p>
          <button
            onClick={() => {
              const el = document.getElementById('explore-themes-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-[#8b6534] hover:bg-[#785429] text-white font-bold text-sm py-4 px-9 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Start Creating An Invitation</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 6. FREQUENTLY ASKED QUESTIONS (Accordion) */}
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
