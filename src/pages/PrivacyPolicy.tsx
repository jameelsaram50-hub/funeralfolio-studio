import React, { useState } from 'react';
import Meta from '../components/Meta';
import { ShieldCheck, Download, Trash2, Lock, FileText, CheckCircle2, Heart } from 'lucide-react';

export default function PrivacyPolicy() {
  const [exported, setExported] = useState(false);

  const handleExportData = () => {
    setExported(true);
    setTimeout(() => setExported(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#fdfaf7] pb-32 font-sans pt-36 selection:bg-[#967440]/20">
      <Meta 
        title="Data Privacy, Trust & Bereavement Data Policy | FuneralFolio"
        description="Our solemn commitment to protecting sensitive bereavement data: 30-day soft-delete protection, full data export, zero advertising tracking, and end-to-end encryption."
        canonical="https://funeralfolio.com/privacy"
      />

      <div className="max-w-4xl mx-auto px-6 pt-8 pb-12">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#967440]/10 rounded-full text-[#967440] text-xs font-bold uppercase tracking-wider border border-[#967440]/20">
            <Lock size={14} />
            <span>Sensitive Data Protection Commitment</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2c1810]">
            Privacy, Trust & Sacred Remembrance
          </h1>
          <p className="text-gray-600 font-serif text-sm sm:text-base max-w-2xl mx-auto">
            At FuneralFolio, we understand that handling the stories, photos, and family records of deceased loved ones requires the highest ethical and technological care.
          </p>
        </div>

        {/* 1-Click Export Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#967440]">
              <Download size={14} />
              <span>Full Data Portability</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[#2c1810] mt-1">Download All Your Memorial Data (.ZIP)</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-md">
              Export all original uploaded photos, document JSON layouts, eulogies, and guestbook condolences at any time with one click.
            </p>
          </div>
          <button
            onClick={handleExportData}
            className="bg-[#2c1810] hover:bg-black text-[#d2c2ad] px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 whitespace-nowrap shadow-md cursor-pointer transition-all"
          >
            {exported ? (
              <>
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Export Package Ready!</span>
              </>
            ) : (
              <>
                <Download size={14} className="text-[#967440]" />
                <span>Export My Archive</span>
              </>
            )}
          </button>
        </div>

        {/* Core Principles */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-200 space-y-8 font-serif text-gray-800 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-[#2c1810] font-serif flex items-center gap-2">
              <ShieldCheck size={22} className="text-[#967440]" />
              <span>1. 30-Day Soft-Delete Protection (Anti-Accidental Loss)</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              Grieving families are often making decisions under immense emotional strain. If you accidentally delete a memorial page, document, or photo gallery, our system holds your records in an encrypted 30-day recovery quarantine before permanent scrubbing. You can restore your data at any time during this period by contacting our director support.
            </p>
          </section>

          <section className="space-y-3 border-t border-gray-100 pt-6">
            <h2 className="text-2xl font-bold text-[#2c1810] font-serif">
              2. Zero Commercial Data Sharing or Third-Party Ads
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              We will never sell, rent, or monetize your family's personal stories, names, dates, or obituary text to data brokers, ad networks, or social media tracking pixels. Our revenue model relies strictly on transparent digital template purchases, premium document tools, and high-resolution printing.
            </p>
          </section>

          <section className="space-y-3 border-t border-gray-100 pt-6">
            <h2 className="text-2xl font-bold text-[#2c1810] font-serif">
              3. Guestbook & Tribute Wall Content Moderation
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              Public condolence messages and virtual candle notes undergo automated spam and sensitive word filtering to protect families from trolling or insensitive commentary. Memorial administrators retain absolute authority to hide or remove any guestbook entry immediately.
            </p>
          </section>

          <section className="space-y-3 border-t border-gray-100 pt-6">
            <h2 className="text-2xl font-bold text-[#2c1810] font-serif">
              4. Payment Security & Stripe Encryption
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              FuneralFolio does not store full credit card numbers or banking credentials on our servers. All financial transactions are processed directly through Stripe’s Level-1 PCI-DSS compliant payment gateways with 256-bit SSL encryption.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
