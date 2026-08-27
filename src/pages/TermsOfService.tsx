import React from 'react';
import Meta from '../components/Meta';
import { ShieldCheck, FileText, CheckCircle2, HelpCircle } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#fdfaf7] pb-32 font-sans pt-36 selection:bg-[#967440]/20">
      <Meta 
        title="Terms of Service & Licensing Guarantees | FuneralFolio"
        description="FuneralFolio terms of service, commercial font licensing guarantees, print fulfillment standards, and money-back refund commitments."
        canonical="https://funeralfolio.com/terms"
      />

      <div className="max-w-4xl mx-auto px-6 pt-8 pb-12">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#967440]/10 rounded-full text-[#967440] text-xs font-bold uppercase tracking-wider border border-[#967440]/20">
            <FileText size={14} />
            <span>Service Terms & Clear Guarantees</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2c1810]">
            Terms of Service
          </h1>
          <p className="text-gray-600 font-serif text-sm sm:text-base max-w-2xl mx-auto">
            Clear, transparent terms governing the use of FuneralFolio design tools, PDF generation, physical print fulfillment, and digital memorial platforms.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-200 space-y-8 font-serif text-gray-800 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-[#2c1810] font-serif flex items-center gap-2">
              <CheckCircle2 size={20} className="text-[#967440]" />
              <span>1. Commercial Font & Asset Licensing Guarantee</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              All typography, decorative flourishes, borders, and spiritual iconography provided inside our visual editor are 100% commercially licensed and certified for high-resolution print embedding. You are granted perpetual rights to print and distribute your generated funeral booklets and memorial keepsakes without fear of copyright infringement.
            </p>
          </section>

          <section className="space-y-3 border-t border-gray-100 pt-6">
            <h2 className="text-2xl font-bold text-[#2c1810] font-serif">
              2. Print Fulfillment & Delivery Timelines
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              Orders placed with physical print-and-ship are routed to regional archival print partners. Standard turnaround is 24 hours for production, followed by guaranteed overnight or 2-day expedited courier delivery directly to your home, church, or funeral home venue.
            </p>
          </section>

          <section className="space-y-3 border-t border-gray-100 pt-6">
            <h2 className="text-2xl font-bold text-[#2c1810] font-serif">
              3. Guest Mode & Account Registration
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              Users may explore, customize, and preview all funeral stationery templates without creating an account upfront. Account creation or email verification is only prompted when you choose to save your cloud progress, invite family collaborators, or download print-ready files.
            </p>
          </section>

          <section className="space-y-3 border-t border-gray-100 pt-6">
            <h2 className="text-2xl font-bold text-[#2c1810] font-serif">
              4. 100% Compassionate Satisfaction Guarantee
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              If you encounter any formatting or print output defect that our technical directors cannot swiftly rectify before your service, we will issue an immediate 100% refund upon request.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
