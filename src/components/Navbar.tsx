import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

function CelestialWreathLogo() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-md" />
      <svg 
        viewBox="0 0 100 100" 
        className="w-9 h-9 shrink-0 relative text-[#c5a059]" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="50" cy="50" r="42" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
        <path d="M50 82 C38 70, 34 48, 47 22 C49 18, 51 14, 52 10" stroke="#3b7a66" strokeWidth="2.2" />
        <path d="M50 82 C62 70, 66 48, 53 22" stroke="#3b7a66" strokeWidth="2.2" />
        <path d="M43 68 C33 66, 28 58, 31 52 C37 54, 41 60, 43 68 Z" fill="#c5a059" opacity="0.9" />
        <path d="M40 50 C28 48, 26 38, 30 32 C36 34, 39 42, 40 50 Z" fill="#c5a059" opacity="0.9" />
        <path d="M46 34 C36 28, 36 18, 42 14 C46 18, 47 26, 46 34 Z" fill="#c5a059" opacity="0.9" />
        <path d="M57 68 C67 66, 72 58, 69 52 C63 54, 59 60, 57 68 Z" fill="#c5a059" opacity="0.9" />
        <path d="M60 50 C72 48, 74 38, 70 32 C64 34, 61 42, 60 50 Z" fill="#c5a059" opacity="0.9" />
        <path d="M54 34 C64 28, 64 18, 58 14 C54 18, 53 26, 54 34 Z" fill="#c5a059" opacity="0.9" />
        <circle cx="50" cy="12" r="3" fill="#d4af37" />
      </svg>
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Obituary Writer', path: '/obituary-writer', badge: 'AI' },
    { name: 'Programs', path: '/funeral-programs' },
    { name: 'Posters', path: '/posters' },
    { name: 'Prayer Cards', path: '/prayer-cards' },
    { name: 'Funeral Invitations', path: '/funeral-invitations' },
    { name: 'Thank You Cards', path: '/thank-you-cards' },
    { name: 'Blogs', path: '/blog' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans">
      {/* Top Ethereal Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-[#3b7a66] via-[#c5a059] to-[#3b7a66] w-full" />

      {/* Floating Glassmorphic Container */}
      <div className={cn(
        "max-w-7xl mx-auto transition-all duration-300",
        scrolled ? "pt-2 px-3 sm:px-6" : "pt-3 px-4 sm:px-8"
      )}>
        <nav className={cn(
          "rounded-2xl transition-all duration-300 border px-4 sm:px-6 py-3 flex items-center justify-between",
          scrolled 
            ? "bg-white/90 backdrop-blur-xl border-amber-900/10 shadow-[0_10px_35px_-10px_rgba(15,21,32,0.08)]" 
            : "bg-white/80 backdrop-blur-md border-amber-900/10 shadow-[0_4px_20px_-2px_rgba(15,21,32,0.04)]"
        )}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <CelestialWreathLogo />
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold text-[#0f1520] tracking-tight group-hover:text-[#3b7a66] transition-colors leading-none">
                FuneralFolio
              </span>
              <span className="text-[10px] font-sans uppercase tracking-widest text-[#c5a059] font-semibold mt-0.5">
                Memorial Studio
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={cn(
                    "relative px-3.5 py-1.5 rounded-full text-[14px] font-medium transition-all duration-200 flex items-center gap-1.5",
                    isActive 
                      ? "text-[#0f1520] font-semibold bg-amber-500/10" 
                      : "text-slate-600 hover:text-[#0f1520] hover:bg-black/5"
                  )}
                >
                  {link.name}
                  {link.badge && (
                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-tight shadow-xs">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/obituary-writer"
              className="btn-gold-luxury px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2"
            >
              <Sparkles size={15} />
              <span>Write with AI</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#0f1520] hover:bg-black/5 rounded-xl cursor-pointer transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden bg-white/95 backdrop-blur-2xl border border-amber-900/10 rounded-2xl mt-2 p-4 shadow-2xl lg:hidden flex flex-col gap-1"
            >
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link 
                    key={link.name} 
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "py-2.5 px-3.5 rounded-xl text-[15px] font-medium transition-all flex items-center justify-between",
                      isActive ? "bg-amber-500/10 text-[#0f1520] font-semibold" : "text-slate-700 hover:bg-black/5"
                    )}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="pt-3 mt-2 border-t border-gray-100">
                <Link
                  to="/obituary-writer"
                  onClick={() => setIsOpen(false)}
                  className="w-full btn-gold-luxury py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  <span>Start AI Obituary Writer</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
