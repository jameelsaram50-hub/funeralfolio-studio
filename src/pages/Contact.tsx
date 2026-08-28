import React, { useState } from 'react';
import { motion } from 'motion/react';
import Meta from '../components/Meta';
import { 
  Mail, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Send,
  HelpCircle,
  BookOpen,
  FileText,
  Sparkles,
  Printer
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: 'editing',
    orderNumber: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const supportTopics = [
    { id: 'editing', label: 'Document Customization & Layout Help' },
    { id: 'printing', label: 'PDF Download, Bleed & Print Alignment' },
    { id: 'orders', label: 'Order Confirmation or Invoice' },
    { id: 'recovery', label: '30-Day Accidental Delete Data Recovery' },
    { id: 'general', label: 'General Inquiries & Feedback' }
  ];

  const faqs = [
    {
      q: "Can I print my funeral programs on a home printer?",
      a: "Yes. All downloaded PDF documents are formatted with standard paper sizing (8.5x11 inch Letter or A4) with built-in folding guides and high-resolution 300 DPI vector clarity."
    },
    {
      q: "How does the 'Everything Coordinated' feature work?",
      a: "Once you enter your loved one's biography, dates, and portraits in any editor, that data is securely saved in your memorial package. You can generate matching prayer cards, invitations, and thank you cards without retyping."
    },
    {
      q: "What if I accidentally delete my document or photo?",
      a: "All deleted files are held in an encrypted 30-day soft-delete quarantine. Send us a message with your account email or memorial name and our support team will restore it immediately."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', topic: 'editing', orderNumber: '', message: '' });
    }, 5000);
  };

  return (
    <div className="bg-[#fdfaf7] min-h-screen pt-36 pb-32 font-sans selection:bg-[#c5a059]/20">
      <Meta 
        title="Support & Help Center"
        description="Need assistance with your funeral programs, memorial cards, or print downloads? Contact our caring support team for prompt help."
        canonical="https://funeralfolio.com/contact"
        schema={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "FuneralFolio Help & Contact Center",
          "description": "Customer care and support desk for memorial stationery creation and printing."
        }}
      />

      {/* Header Banner */}
      <section className="bg-[#2c1810] text-[#f7f5f2] py-16 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#d2c2ad] text-xs font-bold uppercase tracking-wider border border-white/10">
            <HelpCircle size={14} className="text-[#c5a059]" />
            <span>Support & Help Desk</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium tracking-tight text-white">
            We Are Here to <span className="italic text-[#c5a059]">Help</span>
          </h1>
          <p className="text-base sm:text-lg text-[#d2c2ad]/80 max-w-2xl mx-auto leading-relaxed font-serif">
            Whether you need help formatting a booklet, printing at home, or recovering a saved draft, our support team is dedicated to assisting you with patience and care.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Quick Contact & Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center">
              <Mail size={22} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Direct Support Email</span>
            <h3 className="text-xl font-serif font-bold text-[#2c1810]">support@funeralfolio.com</h3>
            <p className="text-xs text-gray-600">Quick email responses for all document and design questions.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Printer size={22} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Print Guide</span>
            <h3 className="text-xl font-serif font-bold text-[#2c1810]">Home & Pro Printing</h3>
            <p className="text-xs text-gray-600">Recommendations for paper weight, folding, and local print shops.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Data Safety</span>
            <h3 className="text-xl font-serif font-bold text-[#2c1810]">30-Day Recovery</h3>
            <p className="text-xs text-gray-600">Accidentally deleted a draft? We can restore it from quarantine.</p>
          </div>
        </div>

        {/* Main Grid: Form + FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Support Form */}
          <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-gray-200">
            <div className="mb-8">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c5a059]">Send A Request</span>
              <h2 className="text-3xl font-serif font-bold text-[#2c1810]">How Can We Assist You?</h2>
              <p className="text-xs text-gray-500 mt-1">Please fill out this simple form and we will get back to you promptly.</p>
            </div>

            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#2c1810]">Message Received</h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Thank you. We have received your request and our support team will reply to <strong>{form.email}</strong> shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">Your Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      placeholder="e.g. Eleanor Davis"
                      className="w-full bg-[#fdfaf7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#c5a059] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      placeholder="eleanor@example.com"
                      className="w-full bg-[#fdfaf7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#c5a059] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">Topic</label>
                    <select
                      value={form.topic}
                      onChange={e => setForm({...form, topic: e.target.value})}
                      className="w-full bg-[#fdfaf7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#c5a059] outline-none"
                    >
                      {supportTopics.map(t => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">Order # or Memorial Name (Optional)</label>
                    <input 
                      type="text" 
                      value={form.orderNumber}
                      onChange={e => setForm({...form, orderNumber: e.target.value})}
                      placeholder="e.g. FF-9482 or John Smith"
                      className="w-full bg-[#fdfaf7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#c5a059] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">Message *</label>
                  <textarea 
                    rows={4}
                    required
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    placeholder="Describe how we can help you..."
                    className="w-full bg-[#fdfaf7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#c5a059] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2c1810] hover:bg-black text-[#d2c2ad] py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Send size={14} className="text-[#c5a059]" />
                  <span>Submit Support Request</span>
                </button>
              </form>
            )}
          </div>

          {/* Frequently Asked Questions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-gray-200 space-y-6">
              <div className="flex items-center gap-2">
                <HelpCircle size={20} className="text-[#c5a059]" />
                <h3 className="font-serif font-bold text-2xl text-[#2c1810]">Common Questions</h3>
              </div>

              <div className="space-y-5 divide-y divide-gray-100">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="pt-4 first:pt-0 space-y-1.5">
                    <h4 className="font-serif font-bold text-sm text-[#2c1810]">{faq.q}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-sans">{faq.a}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <Link 
                  to="/blog" 
                  className="text-xs font-bold uppercase tracking-wider text-[#c5a059] hover:text-[#2c1810] flex items-center gap-1.5 transition-colors"
                >
                  <BookOpen size={14} />
                  <span>Read our Guides & Advice &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
