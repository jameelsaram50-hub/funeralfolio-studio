import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

function BotanicalWreathLogo() {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className="w-10 h-10 shrink-0 text-[#8ba0a5]" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Outer subtle circular garland */}
      <circle cx="50" cy="50" r="43" stroke="#a0b5ba" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
      {/* Curved stems */}
      <path d="M50 84 C38 72, 34 50, 47 22 C49 18, 51 14, 52 10" stroke="#718c92" strokeWidth="2" />
      <path d="M50 84 C62 72, 66 50, 53 22" stroke="#718c92" strokeWidth="2" />
      {/* Left leaves */}
      <path d="M43 70 C33 68, 28 60, 31 54 C37 56, 41 62, 43 70 Z" fill="#8ba0a5" opacity="0.9" />
      <path d="M40 52 C28 50, 26 40, 30 34 C36 36, 39 44, 40 52 Z" fill="#8ba0a5" opacity="0.9" />
      <path d="M46 36 C36 30, 36 20, 42 16 C46 20, 47 28, 46 36 Z" fill="#8ba0a5" opacity="0.9" />
      {/* Right leaves */}
      <path d="M57 70 C67 68, 72 60, 69 54 C63 56, 59 62, 57 70 Z" fill="#8ba0a5" opacity="0.9" />
      <path d="M60 52 C72 50, 74 40, 70 34 C64 36, 61 44, 60 52 Z" fill="#8ba0a5" opacity="0.9" />
      <path d="M54 36 C64 30, 64 20, 58 16 C54 20, 53 28, 54 36 Z" fill="#8ba0a5" opacity="0.9" />
      {/* Top delicate blossom */}
      <path d="M50 18 C47 12, 50 7, 50 5 C50 7, 53 12, 50 18 Z" fill="#718c92" />
    </svg>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Obituary Writer', path: '/obituary-writer' },
    { name: 'Programs', path: '/funeral-programs' },
    { name: 'Posters', path: '/posters' },
    { name: 'Prayer Cards', path: '/prayer-cards' },
    { name: 'Funeral Invitations', path: '/funeral-invitations' },
    { name: 'Thank You Cards', path: '/thank-you-cards' },
    { name: 'Blogs', path: '/blog' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 font-sans">
      {/* Top Thin Olive-Brown Bar Matching Screenshot */}
      <div className="h-2 bg-[#443c2c] w-full" />

      {/* Main Navbar */}
      <nav className={cn(
        "bg-white/98 backdrop-blur-md border-b border-[#e9e3dc] transition-all duration-200 px-4 sm:px-8 lg:px-12",
        scrolled ? "py-2.5 shadow-sm" : "py-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
      )}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Logo with Botanical Wreath */}
          <Link to="/" className="flex items-center gap-3 group">
            <BotanicalWreathLogo />
            <span className="font-serif text-2xl sm:text-[26px] font-semibold text-[#523d2b] tracking-tight block leading-none group-hover:text-[#3d2c1e] transition-colors">
              FuneralFolio
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-7 2xl:gap-9">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className="text-[15px] font-medium text-[#5e4734] hover:text-[#967440] transition-colors py-1"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Medium Screen Navigation (lg to xl) */}
          <div className="hidden lg:flex xl:hidden items-center gap-3.5">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className="text-[13px] font-medium text-[#5e4734] hover:text-[#967440] transition-colors whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#523d2b] hover:bg-[#fdfaf7] rounded-xl cursor-pointer transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden bg-white border-t border-[#e9e3dc] mt-3 pt-3 pb-6 px-4 flex flex-col gap-2 shadow-xl lg:hidden max-h-[85vh] overflow-y-auto"
            >
              <div className="flex flex-col divide-y divide-gray-100">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="py-3 text-[15px] font-medium text-[#523d2b] hover:text-[#967440] hover:pl-2 transition-all"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}


