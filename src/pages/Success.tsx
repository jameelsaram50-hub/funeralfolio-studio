import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Meta from '../components/Meta';
import { Check, Download, ExternalLink, Facebook, MessageCircle, Mail } from 'lucide-react';
import { useMemorial } from '../lib/MemorialContext';
import { cn } from '../lib/utils';
import { generateAuthenticMemorialPdf } from '../lib/designExporter';

export default function Success() {
  const navigate = useNavigate();
  const { memorialData, resetData } = useMemorial();
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Download started');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const memorialUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}`
    : 'https://funeralfolio.com';

  const shareOptions = [
    { 
      icon: Facebook, 
      label: 'Facebook', 
      color: 'bg-[#1877f2]',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(memorialUrl)}`, '_blank')
    },
    { 
      icon: MessageCircle, 
      label: 'WhatsApp', 
      color: 'bg-[#25d366]',
      action: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`In Loving Memory of ${memorialData.name || 'our loved one'}: ${memorialUrl}`)}`, '_blank')
    },
    { 
      icon: Mail, 
      label: 'Email', 
      color: 'bg-brand-secondary',
      action: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(`In Memory of ${memorialData.name || 'Loved One'}`)}&body=${encodeURIComponent(`Please visit the memorial collection honoring ${memorialData.name || 'Loved One'}:\n\n${memorialUrl}`)}`;
      }
    }
  ];

  const handleDone = () => {
    resetData();
    navigate('/');
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    setToastMessage('Downloading Print-Ready PDF (.pdf)...');
    setShowSaveToast(true);
    try {
      await generateAuthenticMemorialPdf(memorialData);
    } catch (e) {
      console.error('Download PDF error:', e);
    } finally {
      setIsDownloadingPdf(false);
      setTimeout(() => {
        setShowSaveToast(false);
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
      <Meta 
        title="Memorial Ready - Preservation Folder" 
        description="Your memorial collection has been processed. Access your high-resolution assets and preservation folder."
        canonical="https://funeralfolio.com/success"
      />
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.2, 1, 0.2, 1] }}
        className="max-w-2xl w-full text-center space-y-16"
      >
        <div className="relative inline-block">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="w-40 h-40 bg-brand-accent rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl relative z-10"
          >
             <Check size={72} className="text-white" strokeWidth={3} />
          </motion.div>
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-brand-accent rounded-[3rem] z-0"
          />
        </div>

        <div className="space-y-6">
          <div className="inline-block px-4 py-1.5 bg-brand-accent/5 rounded-full text-brand-accent text-[12px] font-bold uppercase tracking-wide border border-brand-accent/20">Legacy Preserved</div>
          <h1 className="text-6xl md:text-8xl font-serif text-brand-secondary tracking-tight leading-tight">Preservation Ready</h1>
          <p className="text-2xl text-brand-secondary/80 font-serif italic max-w-lg mx-auto leading-relaxed">
            The memorial collection for <span className="text-brand-secondary font-bold not-italic">{memorialData.name || 'Your Loved One'}</span> has been processed with care.
          </p>
        </div>

         <div className="bg-bg-main rounded-[4rem] p-12 max-w-lg mx-auto text-left border border-brand-accent/5 shadow-inner">
           <h4 className="text-[10px] uppercase font-bold text-brand-secondary/80 tracking-wide mb-8">Digital Safe & Assets</h4>
           <div className="space-y-6">
              {[
                "Archival-Grade PDF (Print Optimization)",
                "AI Restored Legacy Portrait",
                "Perpetual Hosted Memorial Domain",
                "Lifetime Revision Privileges"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-[11px] font-bold text-brand-secondary uppercase tracking-wide">
                   <div className="w-6 h-6 bg-brand-accent text-white rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-brand-accent/20">
                      <Check size={14} strokeWidth={3} />
                   </div>
                   {item}
                </div>
              ))}
           </div>
        </div>

        <div className="grid gap-4 max-w-lg mx-auto">
          {/* Primary Clean PDF Download Button */}
          <button 
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="w-full bg-brand-secondary text-white py-6 rounded-[2.5rem] font-serif font-bold text-xl shadow-2xl shadow-brand-secondary/20 hover:bg-black transition-all flex items-center justify-center gap-3 group cursor-pointer disabled:opacity-75"
          >
            <Download size={24} className="text-brand-accent transition-transform group-hover:-translate-y-1" />
            <span>{isDownloadingPdf ? "Generating PDF..." : "Download Print-Ready PDF"}</span>
          </button>
          
          <button 
            onClick={() => navigate('/prayer-cards')}
            className="w-full bg-white border border-brand-accent/20 text-brand-secondary py-4 rounded-[2.5rem] font-bold text-[11px] uppercase tracking-wide flex items-center justify-center gap-3 hover:bg-bg-main transition-all shadow-sm cursor-pointer"
          >
            Design Additional Cards <ExternalLink size={16} className="text-brand-accent" />
          </button>

          {showSaveToast && (
            <div 
              className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-brand-secondary text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-wide border border-white/10 backdrop-blur-md transition-all duration-500 ease-in-out"
            >
              <Check size={14} className="text-brand-accent animate-pulse" />
              {toastMessage}
            </div>
          )}

          <div className="pt-12 space-y-8">
             <div className="flex items-center gap-6 text-brand-accent/20">
                <div className="h-px flex-1 bg-brand-accent/20" />
                <span className="text-[9px] uppercase font-bold tracking-wide text-brand-secondary/80">Share with the Circle</span>
                <div className="h-px flex-1 bg-brand-accent/20" />
             </div>
             <div className="flex items-center justify-center gap-6">
                {shareOptions.map((opt, i) => (
                   <button 
                     key={i}
                     onClick={opt.action}
                     title={`Share via ${opt.label}`}
                     className={cn(
                       "w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 shadow-xl hover:shadow-2xl cursor-pointer",
                       opt.color
                     )}
                   >
                      <opt.icon size={28} />
                   </button>
                ))}
             </div>
          </div>
          
          <button 
            onClick={handleDone}
            className="text-brand-secondary/80 pt-12 font-bold text-[10px] uppercase tracking-wide hover:text-brand-accent transition-all pb-12"
          >
            Return to Studio
          </button>
        </div>
      </motion.div>
    </div>
  );
}
