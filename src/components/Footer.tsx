import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Mail, 
  ShieldCheck, 
  Lock,
  Eye,
  Settings,
  Sparkles
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#2c1810] text-[#f7f5f2] border-t border-[#967440]/30 font-sans selection:bg-[#967440]/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#967440] flex items-center justify-center text-white shadow-sm">
                <Leaf size={22} />
              </div>
              <span className="font-serif font-bold text-2xl text-white tracking-tight">FuneralFolio</span>
            </div>
            <p className="text-xs text-[#d2c2ad] leading-relaxed max-w-sm font-serif">
              A caring memorial stationery platform. Create personalized funeral programs, prayer cards, ceremony invitations, and heartfelt life tributes with ease and dignity.
            </p>
            <div className="pt-2 text-[11px] text-white/60 space-y-1.5">
              <p className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#967440]" />
                <span>High-Resolution Print-Ready PDF Downloads</span>
              </p>
              <p className="flex items-center gap-2">
                <Lock size={14} className="text-[#967440]" />
                <span>Secure & Encrypted Checkout</span>
              </p>
            </div>
          </div>

          {/* Col 2: Stationery Products */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#967440] uppercase tracking-wider">Memorial Stationery</h4>
            <ul className="space-y-2 text-xs text-[#d2c2ad]">
              <li><Link to="/funeral-programs" className="hover:text-white transition-colors">Funeral Programs & Booklets</Link></li>
              <li><Link to="/posters" className="hover:text-white transition-colors">Memorial Posters & Signs</Link></li>
              <li><Link to="/prayer-cards" className="hover:text-white transition-colors">Prayer & Keepsake Cards</Link></li>
              <li><Link to="/funeral-invitations" className="hover:text-white transition-colors">Funeral Invitations</Link></li>
              <li><Link to="/thank-you-cards" className="hover:text-white transition-colors">Thank You Cards</Link></li>
            </ul>
          </div>

          {/* Col 3: AI Writing */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#967440] uppercase tracking-wider">AI Obituary</h4>
            <ul className="space-y-2 text-xs text-[#d2c2ad]">
              <li><Link to="/obituary-writer" className="hover:text-white transition-colors flex items-center gap-1 text-white font-medium">
                <Sparkles size={12} className="text-[#967440]" />
                <span>AI Obituary Writer</span>
              </Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Obituary Writing Guides</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform & Support */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#967440] uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs text-[#d2c2ad]">
              <li><Link to="/blog" className="hover:text-white transition-colors">Memorial Blog & Guides</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Help & Support</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors flex items-center gap-1 text-[#967440] font-bold">
                <Settings size={12} />
                <span>Admin Dashboard</span>
              </Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} FuneralFolio Memorial Document Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
