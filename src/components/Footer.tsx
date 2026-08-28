import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock,
  Sparkles,
  Heart,
  FileText,
  Printer,
  Compass,
  Settings
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0b0f15] text-[#fbf9f5] border-t border-[#c5a059]/20 font-sans relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-[#c5a059]/10 via-[#3b7a66]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 relative z-10">
        
        {/* Memorial Reverence Quote Banner */}
        <div className="text-center pb-12 mb-12 border-b border-white/10">
          <p className="font-serif italic text-lg sm:text-xl text-[#c5a059] max-w-2xl mx-auto leading-relaxed">
            "To live in hearts we leave behind is not to die."
          </p>
          <span className="text-xs uppercase tracking-widest text-slate-400 mt-2 block font-sans">
            — Thomas Campbell
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c5a059] to-[#b88f44] flex items-center justify-center text-white shadow-lg shadow-amber-900/20">
                <Heart size={20} className="fill-white/20" />
              </div>
              <div>
                <span className="font-serif font-bold text-2xl text-white tracking-tight block leading-none">FuneralFolio</span>
                <span className="text-[10px] uppercase tracking-widest text-[#c5a059] font-medium">Memorial Stationery Platform</span>
              </div>
            </div>
            <p className="text-sm text-slate-300/80 leading-relaxed max-w-sm">
              An empathetic memorial design studio. Craft timeless, print-ready funeral programs, prayer keepsake cards, and heartfelt life tributes with dignity.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <p className="flex items-center gap-2">
                <Printer size={15} className="text-[#c5a059]" />
                <span>Archival 300 DPI Print-Ready PDF Output</span>
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-[#3b7a66]" />
                <span>Zero Installation • Instant Browser Download</span>
              </p>
            </div>
          </div>

          {/* Col 2: Stationery Products */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#c5a059]">Stationery Formats</h4>
            <ul className="space-y-2 text-sm text-slate-300/80">
              <li><Link to="/funeral-programs" className="hover:text-white transition-colors">Funeral Programs (Bifold)</Link></li>
              <li><Link to="/posters" className="hover:text-white transition-colors">Memorial Posters & Signs</Link></li>
              <li><Link to="/prayer-cards" className="hover:text-white transition-colors">Prayer Keepsake Cards</Link></li>
              <li><Link to="/funeral-invitations" className="hover:text-white transition-colors">Ceremony Invitations</Link></li>
              <li><Link to="/thank-you-cards" className="hover:text-white transition-colors">Memorial Thank You Cards</Link></li>
            </ul>
          </div>

          {/* Col 3: AI Writing */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#c5a059]">AI Writing Studio</h4>
            <ul className="space-y-2 text-sm text-slate-300/80">
              <li>
                <Link to="/obituary-writer" className="hover:text-white transition-colors flex items-center gap-1.5 text-white font-medium">
                  <Sparkles size={14} className="text-[#c5a059]" />
                  <span>AI Obituary Writer</span>
                </Link>
              </li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Template Gallery</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Memorial Guides & Advice</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform & Support */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#c5a059]">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-300/80">
              <li><Link to="/about" className="hover:text-white transition-colors">About FuneralFolio</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Family Support</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li>
                <Link to="/admin" className="hover:text-[#c5a059] transition-colors flex items-center gap-1.5 text-slate-400">
                  <Settings size={13} />
                  <span>Admin Management</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} FuneralFolio Memorial Studio. Honoring legacies with grace.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
