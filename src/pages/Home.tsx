import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Meta from '../components/Meta';
import { 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Printer, 
  HeartHandshake, 
  BookOpen, 
  FileText, 
  ShieldCheck 
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://funeralfolio.com/#software",
        "name": "FuneralFolio",
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

  const products = [
    {
      title: "Obituary Writer",
      desc: "Thoughtful guidance to help you write a heartfelt, dignified life tribute in minutes.",
      icon: Sparkles,
      path: "/obituary-writer",
      tag: "AI Guided"
    },
    {
      title: "Funeral Programs",
      desc: "4-page bi-fold booklets with order of service, life story, and cherished photos.",
      icon: BookOpen,
      path: "/funeral-programs",
      tag: "Booklet"
    },
    {
      title: "Memorial Posters",
      desc: "Elegant 18x24\" and 24x36\" welcome signs and photo tribute boards for the service.",
      icon: Layers,
      path: "/posters",
      tag: "Easel Board"
    },
    {
      title: "Prayer Cards",
      desc: "Pocket-sized keepsake cards with portraits, comforting prayers, and blessings.",
      icon: HeartHandshake,
      path: "/prayer-cards",
      tag: "Keepsake"
    },
    {
      title: "Funeral Invitations",
      desc: "Graceful ceremony invitations with service times, location, and RSVP details.",
      icon: FileText,
      path: "/funeral-invitations",
      tag: "Invitation"
    },
    {
      title: "Thank You Cards",
      desc: "Heartfelt notes to thank family and friends for their sympathy and support.",
      icon: HeartHandshake,
      path: "/thank-you-cards",
      tag: "Gratitude"
    }
  ];

  const featuredThemes = [
    { id: "watercolor-roses", name: "Watercolor Roses", category: "Floral", image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800" },
    { id: "victorian-lace", name: "Victorian Lace", category: "Classic", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800" },
    { id: "mountain-serenity", name: "Mountain Serenity", category: "Nature", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800" },
    { id: "ocean-sunset", name: "Ocean Sunset", category: "Spiritual", image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=800" }
  ];

  return (
    <div className="flex flex-col bg-[#fdfaf7] selection:bg-[#967440]/20 font-sans min-h-screen">
      <Meta 
        title="Funeral Programs, Prayer Cards & Memorial Stationery | FuneralFolio" 
        description="Create personalized funeral programs, memorial prayer cards, tribute posters, and obituaries with ease and dignity."
        canonical="https://funeralfolio.com/"
        schema={homeSchema}
      />

      <main>
        {/* Hero Section */}
        <section className="pt-36 pb-24 px-6 border-b border-gray-200/60 bg-white">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fdfaf7] border border-[#967440]/20 text-[#2c1810] text-xs font-semibold">
                <Sparkles size={14} className="text-[#967440]" />
                <span>Thoughtful Memorial Stationery & Tributes</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#2c1810] leading-tight font-medium">
                Honor Their Legacy With <span className="italic text-[#967440]">Dignity</span>
              </h1>

              <p className="text-base sm:text-lg text-[#2c1810]/70 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                Create beautiful funeral programs, prayer cards, and heartfelt obituaries in minutes. Thoughtful, simple tools designed to help you remember with love.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button 
                  onClick={() => navigate('/obituary-writer')}
                  className="w-full sm:w-auto bg-[#2c1810] text-[#f7f5f2] px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Sparkles size={14} className="text-[#967440]" />
                  <span>Write An Obituary</span>
                  <ArrowRight size={14} />
                </button>
                <button 
                  onClick={() => navigate('/prayer-cards')}
                  className="w-full sm:w-auto bg-[#fdfaf7] text-[#2c1810] border border-gray-200 hover:border-[#967440] px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Browse Stationery
                </button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Printer size={14} className="text-[#967440]" />
                  <span>Print-Ready High-Res PDF</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#967440]" />
                  <span>Instant Free Preview</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800" 
                    alt="Memorial Document Example" 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-[#2c1810] text-[#f7f5f2] p-6 rounded-2xl shadow-xl hidden sm:block max-w-xs border border-[#967440]/30">
                  <p className="font-serif italic text-sm text-[#d2c2ad]">
                    "A graceful tribute and beautiful keepsake cards that honored her life and faith."
                  </p>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#967440] mt-2">— The Vance Family</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dedicated Stationery Products Grid */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#967440]">Memorial Stationery & Tributes</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#2c1810]">Designed For Remembrance</h2>
            <p className="text-sm text-[#2c1810]/70 font-sans leading-relaxed">
              Every design is crafted with care to help your family celebrate a cherished life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-[#967440]/40 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#fdfaf7] border border-gray-100 flex items-center justify-center text-[#967440] group-hover:bg-[#2c1810] group-hover:text-white transition-all shadow-xs">
                        <Icon size={22} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-100">
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-[#2c1810] group-hover:text-[#967440] transition-colors">{item.title}</h3>
                    <p className="text-xs text-gray-600 font-sans leading-relaxed">{item.desc}</p>
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#967440] group-hover:translate-x-1 transition-transform">
                    <span>Create Now</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Featured Themes Row */}
        <section className="py-20 px-6 bg-white border-y border-gray-200/60">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#967440]">Curated Designs</span>
                <h2 className="text-3xl font-serif text-[#2c1810]">Featured Themes</h2>
              </div>
              <Link 
                to="/prayer-cards" 
                className="text-xs font-bold uppercase tracking-wider text-[#2c1810] hover:text-[#967440] flex items-center gap-1 transition-colors"
              >
                <span>View All Designs</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredThemes.map((theme, i) => (
                <div 
                  key={i}
                  onClick={() => navigate('/prayer-cards')}
                  className="group cursor-pointer bg-[#fdfaf7] rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                    <img 
                      src={theme.image} 
                      alt={`${theme.name} Theme`}
                      loading="lazy"
                      decoding="async" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-5 text-center space-y-1">
                    <h3 className="font-serif font-bold text-lg text-[#2c1810] group-hover:text-[#967440] transition-colors">{theme.name}</h3>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{theme.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-20 px-6 bg-[#2c1810] text-[#f7f5f2]">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-serif font-medium text-white leading-tight">
              A Lasting Tribute For Those You Love
            </h2>
            <p className="text-sm sm:text-base text-[#d2c2ad] max-w-xl mx-auto leading-relaxed">
              Personalize with photos, heartfelt words, and prayers. Download high-resolution print files instantly.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => navigate('/obituary-writer')}
                className="bg-[#967440] hover:bg-[#856535] text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
              >
                Write An Obituary
              </button>
              <button 
                onClick={() => navigate('/funeral-programs')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Explore Funeral Programs
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
