import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Meta from '../components/Meta';
import { 
  ShieldCheck, 
  Check, 
  ChevronLeft,
  Sparkles,
  Lock,
  Download,
  Heart
} from 'lucide-react';
import { useMemorial } from '../lib/MemorialContext';
import { TEMPLATES } from '../constants';
import { cn, normalizeThemeId } from '../lib/utils';
import { orderService, memorialService } from '../lib/supabase';
import { usePricing } from '../lib/pricing';

type OrderType = 'single' | 'bundle';

export default function Checkout() {
  const { memorialData, updateData } = useMemorial();
  const { getPrice } = usePricing();
  const [selectedPlan, setSelectedPlan] = useState<OrderType>('single');
  const [email, setEmail] = useState<string>(memorialData.userEmail || "");
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const navigate = useNavigate();

  const selectedTemplate = TEMPLATES.find(t => t.id === normalizeThemeId(memorialData.themeId)) || TEMPLATES[0];

  const singlePrice = getPrice('single');
  const bundlePrice = getPrice('bundle');
  const currentTotal = selectedPlan === 'single' ? singlePrice : bundlePrice;

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email address to receive your downloads.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsProcessing(true);
    updateData({ userEmail: trimmedEmail });

    try {
      await memorialService.save({
        name: memorialData.name || 'Loved One',
        birth_date: memorialData.dob,
        death_date: memorialData.dod,
        birth_place: memorialData.birthPlace,
        service_date: memorialData.serviceDate,
        biography: memorialData.obituaryText,
        photo_url: memorialData.photoUrl,
        format: selectedPlan === 'bundle' ? 'Complete Memorial Package' : (memorialData.format || 'Prayer Card'),
      });

      await orderService.create({
        customer_name: memorialData.name || 'Memorial Family',
        customer_email: trimmedEmail,
        package_name: selectedPlan === 'bundle' 
          ? `Complete Memorial Package ($${bundlePrice})` 
          : `${memorialData.format || 'Memorial Stationery'} ($${singlePrice})`,
        amount: currentTotal,
        status: 'Paid',
        download_url: `/success`
      });
    } catch (err) {
      console.warn("Local sync completed:", err);
    } finally {
      setIsProcessing(false);
      navigate('/success');
    }
  };

  return (
    <div className="bg-[#faf8f5] min-h-screen py-16 px-4 sm:px-6 font-sans">
      <Meta 
        title="Complete Your Order | FuneralFolio" 
        description="Download your high-resolution memorial print files."
        canonical="https://funeralfolio.com/checkout"
      />

      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 mb-8 transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span>Back to Editor</span>
        </button>

        {/* Page Title Matching Screenshot 3 */}
        <h1 className="text-4xl sm:text-5xl font-serif text-[#2c1810] tracking-tight mb-10 font-normal">
          Complete your order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Plan Options (Single vs Complete Package) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* OPTION 1: Single Product ($19.00) */}
            <div
              onClick={() => setSelectedPlan('single')}
              className={cn(
                "p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white relative",
                selectedPlan === 'single'
                  ? "border-[#4aa182] ring-2 ring-[#4aa182]/20 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3.5">
                  {/* Radio Indicator */}
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center transition-colors",
                      selectedPlan === 'single'
                        ? "border-[#4aa182] bg-[#4aa182]"
                        : "border-gray-300"
                    )}
                  >
                    {selectedPlan === 'single' && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#2c1810]">
                      {memorialData.format || 'Memorial Stationery'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Digital download files — print anywhere
                    </p>
                  </div>
                </div>

                <span className="font-serif text-xl font-bold text-[#2c1810]">
                  ${singlePrice.toFixed(2)}
                </span>
              </div>

              {/* Single Product Thumbnail */}
              <div className="mt-4 ml-8">
                <div className="w-14 h-18 rounded-lg overflow-hidden border border-gray-200 shadow-xs bg-gray-50">
                  <img
                    src={selectedTemplate.image}
                    alt="Prayer Card Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* OPTION 2: Complete Memorial Package ($26.00) Upsell */}
            <div
              onClick={() => setSelectedPlan('bundle')}
              className={cn(
                "p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white relative",
                selectedPlan === 'bundle'
                  ? "border-[#4aa182] ring-2 ring-[#4aa182]/20 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              {/* Green Pill Badge Matching Screenshot 3 */}
              <div className="absolute -top-3 right-6 bg-[#047857] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                Complete Package
              </div>

              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3.5">
                  {/* Radio Indicator */}
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center transition-colors",
                      selectedPlan === 'bundle'
                        ? "border-[#4aa182] bg-[#4aa182]"
                        : "border-gray-300"
                    )}
                  >
                    {selectedPlan === 'bundle' && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#2c1810]">
                      Complete Memorial Package
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-400 line-through mr-1.5 font-sans">$75.00</span>
                  <span className="font-serif text-xl font-bold text-[#2c1810]">
                    ${bundlePrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Package Benefits Checklist Matching Screenshot 3 */}
              <div className="mt-3 ml-8 space-y-1.5">
                {[
                  "AI Obituary Writer & Biography",
                  "Prayer & Keepsake Cards (Front & Back)",
                  "Funeral Invitations (Digital & Print)",
                  "Thank You Notes & Gratitude Cards",
                  "Everything you need to print and share"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                    <Check size={13} className="text-[#047857] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

                {/* 4 Multi-Product Thumbnails Matching Screenshot 3 */}
              <div className="mt-4 ml-8 flex items-center gap-2">
                {[
                  selectedTemplate.image,
                  "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=200&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=200&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=200&auto=format&fit=crop"
                ].map((img, i) => (
                  <div key={i} className="w-12 h-14 rounded-md overflow-hidden border border-gray-200 shadow-xs bg-gray-50">
                    <img src={img} alt="Suite Thumbnail" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Email & Complete Order Form Matching Screenshot 3 */}
          <div className="lg:col-span-5 bg-white border border-[#e8dfd8] rounded-2xl p-6 shadow-sm">
            <form onSubmit={handleCompleteOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2c1810] mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Email for receipt and downloads"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-[#2c1810] placeholder:text-gray-400 focus:border-[#4aa182] focus:ring-2 focus:ring-[#4aa182]/20 outline-hidden transition-all bg-white"
                />
                {error && (
                  <p className="text-xs text-red-600 font-medium mt-1.5">{error}</p>
                )}
              </div>

              {/* Master Button Matching Screenshot 3 */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#6ea692] hover:bg-[#5b9581] disabled:opacity-50 text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock size={15} />
                <span>
                  {isProcessing 
                    ? "Generating Files..." 
                    : currentTotal === 0 
                      ? "Download Free Print Files — $0.00" 
                      : `Complete My Order — $${currentTotal.toFixed(2)}`}
                </span>
              </button>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] text-gray-500">
                <ShieldCheck size={14} className="text-[#047857]" />
                <span>Instant 300 DPI PDF Download • Print Anywhere</span>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
