import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Meta from '../components/Meta';
import { 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  BookOpen, 
  Printer, 
  Eye, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  const corePillars = [
    {
      icon: Layers,
      title: "Everything Coordinated",
      desc: "Enter your loved one's details, dates, life story, and photos once. Our system coordinates all funeral programs, cards, invites, and online memorials effortlessly."
    },
    {
      icon: Printer,
      title: "Print-Ready Precision",
      desc: "Every document is generated with exact print bleed, safety margins, embedded commercial typography, and crisp 300 DPI resolution for flawless home or professional printing."
    },
    {
      icon: Eye,
      title: "Universal Accessibility",
      desc: "Designed to WCAG 2.1 AA accessibility standards with large tap targets, high contrast ratios, screen-reader compatibility, and generous whitespace for stressed families."
    },
    {
      icon: Lock,
      title: "Compassionate Data Privacy",
      desc: "Your family's memories are never monetized or sold to third parties. We provide 30-day accidental-delete recovery and 1-click complete data export archives."
    }
  ];

  const stationeryShowcase = [
    {
      title: "AI Obituary Writer",
      desc: "Guided life story generator that crafts personalized, heartfelt tributes and obituaries in minutes.",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
      path: "/obituary-writer"
    },
    {
      title: "Prayer & Keepsake Cards",
      desc: "Pocket-sized remembrance cards with sacred prayers, meaningful poetry, and portrait memories.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
      path: "/prayer-cards"
    },
    {
      title: "Invitations & Thank You Cards",
      desc: "Coordinated announcement stationery and heartfelt acknowledgement cards for attendees.",
      image: "https://images.unsplash.com/photo-1516528387618-afa90b13e000?auto=format&fit=crop&q=80&w=800",
      path: "/funeral-invitations"
    }
  ];

  return (
    <div className="bg-[#fdfaf7] min-h-screen pt-36 pb-32 font-sans selection:bg-[#967440]/20">
      <Meta 
        title="About Our Memorial Document Platform"
        description="FuneralFolio empowers families to create beautiful, print-ready funeral programs, prayer cards, invitations, and digital memorials with dignity and ease."
        canonical="https://funeralfolio.com/about"
        schema={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About FuneralFolio Memorial Document Platform",
          "description": "Empowering families to create coordinated funeral stationery and digital memorials."
        }}
      />

      {/* Hero Section */}
      <section className="bg-[#2c1810] text-[#f7f5f2] py-20 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#d2c2ad] text-xs font-bold uppercase tracking-wider border border-white/10">
            <Sparkles size={14} className="text-[#967440]" />
            <span>Honoring Lives With Dignity</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-medium tracking-tight text-white leading-[1.1]">
            Honoring Life Stories With <span className="italic text-[#967440]">Dignity</span> & Ease
          </h1>
          <p className="text-base sm:text-xl text-[#d2c2ad]/80 max-w-2xl mx-auto leading-relaxed font-serif">
            We make creating funeral stationery simple and thoughtful, so families can focus on remembering and comforting each other.
          </p>
        </div>
      </section>

      {/* Mission & Purpose */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#967440]">Our Mission</span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#2c1810] leading-tight">
              A Gentle Way to Create Memorial Keepsakes
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              When a family loses a loved one, organizing memorial programs, eulogies, and tribute cards can feel overwhelming. Complicated software and impersonal tools only add to the stress.
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              FuneralFolio was created to give families peace of mind. With gentle guided prompts, elegant design templates, and instant print downloads, we help you celebrate your loved one's story with dignity and grace.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
              <div>
                <span className="text-3xl font-serif font-bold text-[#967440]">40+</span>
                <p className="text-xs text-gray-500 font-medium">Curated Themes</p>
              </div>
              <div>
                <span className="text-3xl font-serif font-bold text-[#967440]">5,000+</span>
                <p className="text-xs text-gray-500 font-medium">Families Supported</p>
              </div>
              <div>
                <span className="text-3xl font-serif font-bold text-[#967440]">300 DPI</span>
                <p className="text-xs text-gray-500 font-medium">Print Quality</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800" 
                alt="Memorial keepsake stationery" 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-xs hidden sm:block">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck size={20} className="text-[#967440]" />
                <span className="font-bold text-xs text-[#2c1810]">High-Resolution Prints</span>
              </div>
              <p className="text-[11px] text-gray-500">Every design is formatted with crisp typography and artwork ready for home or local print shops.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="bg-white py-24 px-6 border-y border-gray-100">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#967440]">Our Principles</span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#2c1810]">Thoughtful Design for Families</h2>
            <p className="text-sm text-gray-600">
              Created to minimize stress, honor privacy, and deliver lasting keepsakes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {corePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="bg-[#fdfaf7] rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#967440]/10 text-[#967440] flex items-center justify-center">
                    <Icon size={24} />
                  </div>
                  <h4 className="font-serif font-bold text-xl text-[#2c1810]">{pillar.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Suite Showcase */}
      <section className="max-w-7xl mx-auto px-6 py-24 space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#967440]">Coordinated Suite</span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#2c1810]">Everything in One Place</h2>
          <p className="text-sm text-gray-600">
            Create complete memorial packages from a single dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stationeryShowcase.map((prod, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate(prod.path)}
              className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 flex flex-col justify-between cursor-pointer group hover:shadow-xl transition-all"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img src={prod.image} alt={prod.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6 space-y-2">
                <h4 className="font-serif font-bold text-xl text-[#2c1810] group-hover:text-[#967440] transition-colors">{prod.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{prod.desc}</p>
                <div className="pt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#967440]">
                  <span>Explore Designs</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="bg-[#2c1810] rounded-[3rem] p-10 sm:p-14 text-center text-white space-y-6 shadow-2xl">
          <h3 className="text-3xl sm:text-4xl font-serif font-bold">Start Creating Your Memorial Documents</h3>
          <p className="text-sm text-[#d2c2ad] max-w-lg mx-auto leading-relaxed">
            No account required to start. Explore templates, write obituaries, and customize designs at your own pace.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/gallery')}
              className="bg-[#967440] hover:bg-[#856535] text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
            >
              Browse 100+ Templates
            </button>
            <button
              onClick={() => navigate('/obituary-writer')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <span>AI Obituary Writer</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
