
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Meta from '../components/Meta';
import { 
  Sparkles, ArrowRight, ChevronLeft, Plus, X, 
  Calendar, MapPin, Camera, User, Users, Heart, 
  GraduationCap, Briefcase, Award, Music, MessageSquare,
  Lock, Layout, Mail, Check, ExternalLink, Clock
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMemorial } from '../lib/MemorialContext';
import { cn, normalizeThemeId } from '../lib/utils';
import { TEMPLATES } from '../constants';
import { obituaryService, memorialService } from '../lib/supabase';

type StepId = number;

export default function ObituaryWriter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { memorialData, updateData } = useMemorial();
  
  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const totalSteps = 19;

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result && typeof result === 'string') {
          setFormData(prev => ({ ...prev, photoUrl: result }));
          updateData({ photoUrl: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const [formData, setFormData] = useState({
    name: memorialData.name || '',
    dob: memorialData.dob || '',
    dod: memorialData.dod || '',
    birthPlace: memorialData.birthPlace || '',
    photoUrl: memorialData.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    causeOfPassing: memorialData.causeOfPassing || '',
    parents: memorialData.parents || '',
    precededBy: memorialData.precededBy || '',
    survivors: memorialData.survivors || '',
    marriage: memorialData.marriage || '',
    education: memorialData.education || '',
    militaryService: memorialData.militaryService || '',
    career: memorialData.career || '',
    organizations: memorialData.organizations || '',
    hobbies: memorialData.hobbies || '',
    characteristics: memorialData.characteristics || '',
    isPrivate: memorialData.isPrivate || false,
    serviceDate: memorialData.serviceDate || '',
    serviceTime: memorialData.serviceTime || '',
    serviceVenue: memorialData.serviceVenue || '',
    serviceAddress: memorialData.serviceAddress || '',
    serviceLink: memorialData.serviceLink || '',
    charityName: memorialData.charityName || '',
    donationLink: memorialData.donationLink || '',
    memorialFund: memorialData.memorialFund || '',
    specialMessage: memorialData.specialMessage || '',
    email: memorialData.userEmail || '',
    selectedTheme: normalizeThemeId(memorialData.themeId)
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const nextStep = () => {
    setGenerationError(null);

    // Validate Name and Dates on Step 1
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        setGenerationError("Please enter your loved one's full name to personalize the obituary.");
        return;
      }
      const today = new Date();
      if (formData.dob) {
        const birthDate = new Date(formData.dob);
        if (birthDate > today) {
          setGenerationError("Birth date cannot be in the future.");
          return;
        }
      }
      if (formData.dod) {
        const deathDate = new Date(formData.dod);
        if (deathDate > today) {
          setGenerationError("Date of passing cannot be in the future.");
          return;
        }
      }
      if (formData.dob && formData.dod) {
        const birthDate = new Date(formData.dob);
        const deathDate = new Date(formData.dod);
        if (deathDate < birthDate) {
          setGenerationError("Date of passing cannot be earlier than birth date.");
          return;
        }
      }
    }

    // Validate Email on step 19 (the final step)
    if (currentStep === 19) {
      const email = formData.email.trim();
      if (!email) {
        setGenerationError("Please enter your email address to save your design.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setGenerationError("Please enter a valid email address.");
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleGenerate();
    }
  };

  const prevStep = () => {
    setGenerationError(null);
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
    else {
      if (location.state?.from) {
        navigate(-1);
      } else {
        navigate('/');
      }
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setGenerationError(null);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const prompt = `Write a beautiful, professional, and heartfelt obituary for a funeral program.
        Name: ${formData.name || "John"}.
        Important Facts:
        - Date of Birth: ${formData.dob}
        - Date of Passing: ${formData.dod}
        - Birthplace: ${formData.birthPlace}
        - Relationship: ${formData.marriage}
        - Children & Family: ${formData.survivors}
        - Preceded by: ${formData.precededBy}
        - Parents: ${formData.parents}
        - Education: ${formData.education}
        - Military Service: ${formData.militaryService}
        - Career: ${formData.career}
        - Organizations/Memberships: ${formData.organizations}
        - Hobbies & Passions: ${formData.hobbies}
        - Personal Traits: ${formData.characteristics}
        - Special Thanks/Message: ${formData.specialMessage}
        ${!formData.isPrivate ? `
        - Service Information:
          - Date: ${formData.serviceDate}
          - Time: ${formData.serviceTime}
          - Venue: ${formData.serviceVenue}
          - Address: ${formData.serviceAddress}
          - Link: ${formData.serviceLink}` : 'Note: The funeral service is private.'}
        - Memorial Donations: ${formData.charityName} ${formData.donationLink ? `(${formData.donationLink})` : ''} ${formData.memorialFund ? `(Memorial Fund: ${formData.memorialFund})` : ''}

        Tone: Compassionate, elegant, respectful, and celebratory.
        Length: Professional standard obituary length.
        Structure: Start with a strong opening about their passing, move into their life story, career, family, and end with service details and donation information.
        Important: Create a cohesive narrative. Do not use placeholders. Integrate all facts gracefully.`;

      let text = "";
      try {
        const res = await fetch("/api/generate-obituary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        if (res.ok) {
          const data = await res.json();
          text = data.text;
        }
      } catch (err) {
        console.warn("Server obituary generation fell back to structured synthesis:", err);
      }

      // If text wasn't generated by AI, create a comprehensive narrative from form data
      if (!text) {
        const parts: string[] = [];
        parts.push(`${formData.name || 'Our beloved'}, born ${formData.dob ? `on ${formData.dob}` : ''} ${formData.birthPlace ? `in ${formData.birthPlace}` : ''}, peacefully departed this life ${formData.dod ? `on ${formData.dod}` : ''}.`);
        
        if (formData.characteristics || formData.career || formData.education) {
          parts.push(`${formData.name} was deeply admired for being ${formData.characteristics || 'a pillar of strength, kindness, and devotion'}. ${formData.education ? `Educated at ${formData.education}, ` : ''}${formData.career ? `a fulfilling career was dedicated to ${formData.career}. ` : ''}${formData.militaryService ? `Proudly served in ${formData.militaryService}.` : ''}`);
        }

        if (formData.hobbies || formData.organizations) {
          parts.push(`Throughout life, great joy was found in ${formData.hobbies || 'spending time with loved ones'}${formData.organizations ? `, and active participation in ${formData.organizations}` : ''}.`);
        }

        if (formData.survivors || formData.precededBy || formData.parents) {
          parts.push(`Survived with everlasting love by ${formData.survivors || 'cherished family and friends'}.${formData.precededBy ? ` Reunited in peace with ${formData.precededBy}.` : ''}`);
        }

        if (formData.specialMessage) {
          parts.push(`"${formData.specialMessage}"`);
        }

        if (!formData.isPrivate && formData.serviceDate) {
          parts.push(`Funeral and memorial services will be held on ${formData.serviceDate} at ${formData.serviceTime || 'the designated hour'}, located at ${formData.serviceVenue || 'the chapel'}${formData.serviceAddress ? `, ${formData.serviceAddress}` : ''}.`);
        } else if (formData.isPrivate) {
          parts.push(`Private memorial arrangements have been entrusted to the family.`);
        }

        if (formData.charityName || formData.donationLink || formData.memorialFund) {
          parts.push(`In lieu of flowers, memorial contributions may be made in honor of ${formData.name} to ${formData.charityName || formData.memorialFund || 'the family memorial fund'}${formData.donationLink ? ` (${formData.donationLink})` : ''}.`);
        }

        text = parts.join("\n\n");
      }
      
      updateData({
        ...formData,
        obituaryText: text || "",
        poem: formData.specialMessage || "The Lord is my shepherd; I shall not want.\nHe maketh me to lie down in green pastures:\nHe leadeth me beside the still waters.\nHe restoreth my soul.",
        notes: `The family of ${formData.name || 'our loved one'} deeply appreciates your kind expressions of sympathy, prayers, and thoughtful support.`,
        obituaryType: 'guided',
        userEmail: formData.email,
        themeId: formData.selectedTheme,
        format: 'Complete Memorial Package'
      });

      // Persist to Supabase
      try {
        await memorialService.save({
          name: formData.name || 'Loved One',
          birth_date: formData.dob,
          death_date: formData.dod,
          birth_place: formData.birthPlace,
          service_date: formData.serviceDate,
          service_location: formData.serviceVenue,
          biography: text || "",
          photo_url: formData.photoUrl,
          theme_color: formData.selectedTheme,
        });

        await obituaryService.save({
          person_name: formData.name || 'Loved One',
          tone: 'Heartfelt & Celebrating Life',
          content: text || "",
          is_published: true,
        });
      } catch (err) {
        console.warn("Supabase local backup complete:", err);
      }
      
      const fromPage = location.state?.from || 'prayer';
      if (fromPage === 'invitation') {
        navigate(`/editor/invitation/${formData.selectedTheme}`);
      } else if (fromPage === 'thank-you') {
        navigate(`/editor/thank-you/${formData.selectedTheme}`);
      } else {
        navigate(`/editor/prayer/${formData.selectedTheme}`);
      }
    } catch (e: any) {
      console.error(e);
      setGenerationError(e.message || "An unexpected error occurred while generating the obituary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif text-[#2c1810]">Important dates</h2>
              <p className="text-[#967440]/70 font-medium">These dates help tell their story.</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-wide text-[#967440]">Loved One's Full Name</label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="e.g., John Smith"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-base focus:border-[#967440] outline-none transition-all placeholder:text-[#967440]/20"
                  />
                  <User className="absolute right-6 top-1/2 -translate-y-1/2 text-[#967440]/40 pointer-events-none" size={20} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-wide text-[#967440]">Date of Birth</label>
                <div className="relative">
                  <input 
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-lg focus:border-[#967440] outline-none transition-all"
                  />
                  <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-[#967440]/40 pointer-events-none" size={20} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-wide text-[#967440]">Date of Passing</label>
                <div className="relative">
                  <input 
                    type="date"
                    value={formData.dod}
                    onChange={(e) => handleInputChange('dod', e.target.value)}
                    className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-lg focus:border-[#967440] outline-none transition-all"
                  />
                  <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-[#967440]/40 pointer-events-none" size={20} />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif text-[#2c1810]">Where was {formData.name || 'John'} born?</h2>
              <p className="text-[#967440]/70 font-medium">Help us share their roots.</p>
            </div>
            <div className="relative">
              <input 
                type="text"
                placeholder="e.g., Pakistan"
                value={formData.birthPlace}
                onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-lg focus:border-[#967440] outline-none transition-all placeholder:text-[#967440]/20"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif text-[#2c1810]">Add a photo of {formData.name || 'John'}</h2>
              <p className="text-[#967440]/70 font-medium">A picture helps bring their memory to life.</p>
            </div>
            <div className="flex flex-col items-center gap-6">
              <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*" 
                 onChange={handlePhotoUpload} 
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-64 h-64 bg-black rounded-3xl overflow-hidden shadow-2xl relative cursor-pointer group"
              >
                <img src={formData.photoUrl || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                   <p className="text-white text-xs font-bold uppercase tracking-wide">Change Photo</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-[#967440] text-sm font-bold uppercase tracking-wide">
                 <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer">Change photo</button>
                 <button className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer">Adjust photo</button>
                 <button className="flex items-center gap-2 hover:opacity-70 transition-opacity text-[#967440]/60"><Sparkles size={16} /> Enhance photo</button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif text-[#2c1810]">How did {formData.name || 'John'} pass?</h2>
              <p className="text-[#967440]/70 font-medium">This is completely optional. Share only what feels right.</p>
            </div>
            <textarea 
              placeholder="e.g., peacefully at home, after a courageous battle with illness..."
              value={formData.causeOfPassing}
              onChange={(e) => handleInputChange('causeOfPassing', e.target.value)}
              className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-lg h-40 focus:border-[#967440] outline-none transition-all placeholder:text-[#967440]/20 resize-none"
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif text-[#2c1810]">Who were {formData.name || 'John'}'s parents?</h2>
              <p className="text-[#967440]/70 font-medium">This helps honor their roots and heritage.</p>
            </div>
            <div className="space-y-3">
               <input 
                  type="text"
                  placeholder="e.g., John and Mary Smith"
                  value={formData.parents}
                  onChange={(e) => handleInputChange('parents', e.target.value)}
                  className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-lg focus:border-[#967440] outline-none transition-all placeholder:text-[#967440]/20"
               />
               <p className="text-[10px] text-[#967440]/50 font-bold uppercase tracking-wide px-1">Enter the names of {formData.name || 'John'}'s parents, if known.</p>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif text-[#2c1810]">Who preceded {formData.name || 'John'} in death?</h2>
              <p className="text-[#967440]/70 font-medium">Family members who passed before them.</p>
            </div>
            <div className="space-y-3">
               <textarea 
                  placeholder="e.g., Parents John and Mary Smith; brother William; infant daughter Grace..."
                  value={formData.precededBy}
                  onChange={(e) => handleInputChange('precededBy', e.target.value)}
                  className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-lg h-40 focus:border-[#967440] outline-none transition-all placeholder:text-[#967440]/20 resize-none"
               />
               <p className="text-[10px] text-[#967440]/50 font-bold uppercase tracking-wide px-1">List family members who passed away before {formData.name || 'John'}, such as parents, siblings, spouse, or children.</p>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif text-[#2c1810]">Who survives {formData.name || 'John'}?</h2>
              <p className="text-[#967440]/70 font-medium">Those who will carry on their memory.</p>
            </div>
            <div className="space-y-6">
               <textarea 
                  placeholder="e.g., Wife Mary of 50 years; children John (Sarah) and Jane (Michael); siblings Robert and Elizabeth..."
                  value={formData.survivors}
                  onChange={(e) => handleInputChange('survivors', e.target.value)}
                  className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-lg h-40 focus:border-[#967440] outline-none transition-all placeholder:text-[#967440]/20 resize-none"
               />
               <div className="text-[10px] text-[#967440]/50 font-bold uppercase tracking-wide px-1 space-y-2">
                 <p>List surviving family members. A common order is:</p>
                 <ol className="space-y-1 pl-4 list-decimal">
                   <li>Spouse or partner</li>
                   <li>Children (and their spouses)</li>
                   <li>Siblings</li>
                   <li>Extended family</li>
                   <li>Close friends</li>
                 </ol>
               </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif text-[#2c1810]">Marriage & partnerships</h2>
              <p className="text-[#967440]/70 font-medium">Share about {formData.name || 'John'}'s significant relationships.</p>
            </div>
            <textarea 
              placeholder="Married Jane Smith on June 15, 1975 in Chicago. Together for 48 wonderful years, they raised three children and built a life filled with love and laughter."
              value={formData.marriage}
              onChange={(e) => handleInputChange('marriage', e.target.value)}
              className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-lg h-40 focus:border-[#967440] outline-none transition-all placeholder:text-[#967440]/20 resize-none"
            />
          </div>
        );
      case 9:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif text-[#2c1810]">Education</h2>
              <p className="text-[#967440]/70 font-medium">Schools, degrees, and academic achievements.</p>
            </div>
            <textarea 
              placeholder="Graduated from Lincoln High School in 1965. Earned a Bachelor's degree in Engineering from State University in 1969. Later completed an MBA from City College."
              value={formData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-lg h-40 focus:border-[#967440] outline-none transition-all placeholder:text-[#967440]/20 resize-none"
            />
          </div>
        );
      case 10:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif text-[#2c1810]">Military service</h2>
              <p className="text-[#967440]/70 font-medium">Honor {formData.name || 'John'}'s service to their country.</p>
            </div>
            <textarea 
              placeholder="Served in the U.S. Army from 1970-1974, reaching the rank of Sergeant. Stationed in Germany for two years. Received the Army Commendation Medal for meritorious service."
              value={formData.militaryService}
              onChange={(e) => handleInputChange('militaryService', e.target.value)}
              className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-lg h-40 focus:border-[#967440] outline-none transition-all placeholder:text-[#967440]/20 resize-none"
            />
          </div>
        );
      case 11:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif text-[#2c1810]">Career & employment</h2>
              <p className="text-[#967440]/70 font-medium">Jobs, careers, and professional accomplishments.</p>
            </div>
            <textarea 
              placeholder="Worked as a mechanical engineer at Ford Motor Company for 35 years, retiring in 2005. Known for mentoring young engineers and leading the team that designed the 1998 transmission system."
              value={formData.career}
              onChange={(e) => handleInputChange('career', e.target.value)}
              className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-lg h-40 focus:border-[#967440] outline-none transition-all placeholder:text-[#967440]/20 resize-none"
            />
          </div>
        );
      case 12:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif text-[#2c1810]">Organizations & memberships</h2>
              <p className="text-[#967440]/70 font-medium">Clubs, churches, and community groups.</p>
            </div>
            <textarea 
              placeholder="Active member of First Baptist Church for over 40 years. Longtime Rotary Club member and served as president in 1995. Volunteer firefighter for 15 years. Member of the American Legion."
              value={formData.organizations}
              onChange={(e) => handleInputChange('organizations', e.target.value)}
              className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-lg h-40 focus:border-[#967440] outline-none transition-all placeholder:text-[#967440]/20 resize-none"
            />
          </div>
        );
      case 13:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif text-[#2c1810]">Hobbies & interests</h2>
              <p className="text-[#967440]/70 font-medium">Passions and favorite pastimes.</p>
            </div>
            <textarea 
              placeholder="Avid fisherman who never missed opening day. Loved tending his vegetable garden and sharing tomatoes with neighbors. Enjoyed woodworking and built furniture for all his grandchildren."
              value={formData.hobbies}
              onChange={(e) => handleInputChange('hobbies', e.target.value)}
              className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-lg h-40 focus:border-[#967440] outline-none transition-all placeholder:text-[#967440]/20 resize-none"
            />
          </div>
        );
      case 14:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif text-[#2c1810]">Personal characteristics</h2>
              <p className="text-[#967440]/70 font-medium">What made {formData.name || 'John'} special and unique.</p>
            </div>
            <textarea 
              placeholder="Known for his quick wit and warm smile. Always ready with a joke to lighten the mood. Had a gift for making everyone feel welcome and valued. His kindness and generosity touched countless lives."
              value={formData.characteristics}
              onChange={(e) => handleInputChange('characteristics', e.target.value)}
              className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-lg h-40 focus:border-[#967440] outline-none transition-all placeholder:text-[#967440]/20 resize-none"
            />
          </div>
        );
      case 15:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-serif text-[#2c1810]">Service details</h2>
              <p className="text-[#967440]/70 font-medium">Where and when will people gather to remember {formData.name || 'John'}?</p>
            </div>
            <div className="space-y-6">
               <div className="bg-[#fcfafa] border-2 border-[#967440]/5 rounded-3xl p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-bold text-[#2c1810] text-sm">Is this a private funeral?</p>
                    <p className="text-xs text-[#967440]/60">Private services will not include location details in the obituary.</p>
                  </div>
                  <button 
                    onClick={() => handleInputChange('isPrivate', !formData.isPrivate)}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative flex items-center px-1",
                      formData.isPrivate ? "bg-[#967440]" : "bg-gray-200"
                    )}
                  >
                    <div className={cn("w-4 h-4 bg-white rounded-full transition-transform", formData.isPrivate && "translate-x-6")} />
                  </button>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wide text-[#967440]">Date</label>
                    <div className="relative">
                      <input 
                        type="date"
                        value={formData.serviceDate}
                        onChange={(e) => handleInputChange('serviceDate', e.target.value)}
                        className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-4 py-4 text-sm focus:border-[#967440] outline-none transition-all"
                      />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-[#967440]/40" size={16} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wide text-[#967440]">Time</label>
                    <div className="relative">
                      <input 
                        type="time"
                        value={formData.serviceTime}
                        onChange={(e) => handleInputChange('serviceTime', e.target.value)}
                        className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-4 py-4 text-sm focus:border-[#967440] outline-none transition-all"
                      />
                      <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-[#967440]/40" size={16} />
                    </div>
                  </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[11px] font-bold uppercase tracking-wide text-[#967440]">Venue Name</label>
                 <input 
                    type="text"
                    placeholder="e.g., St. Mary's Church"
                    value={formData.serviceVenue}
                    onChange={(e) => handleInputChange('serviceVenue', e.target.value)}
                    className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-sm focus:border-[#967440] outline-none transition-all"
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-[11px] font-bold uppercase tracking-wide text-[#967440]">Address</label>
                 <input 
                    type="text"
                    placeholder="123 Main St, City, State"
                    value={formData.serviceAddress}
                    onChange={(e) => handleInputChange('serviceAddress', e.target.value)}
                    className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-sm focus:border-[#967440] outline-none transition-all"
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-[11px] font-bold uppercase tracking-wide text-[#967440]">Online Streaming Link (optional)</label>
                 <input 
                    type="url"
                    placeholder="https://..."
                    value={formData.serviceLink}
                    onChange={(e) => handleInputChange('serviceLink', e.target.value)}
                    className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-sm focus:border-[#967440] outline-none transition-all"
                 />
                 <p className="text-[10px] text-[#967440]/50 font-bold leading-relaxed">Add a link if the service will be streamed online for those who cannot attend in person.</p>
               </div>
            </div>
          </div>
        );
      case 16:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif text-[#2c1810]">Memorial donations</h2>
              <p className="text-[#967440]/70 font-medium">Is there an organization {formData.name || 'John'} cared about?</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wide text-[#967440]">Charity Name</label>
                <input 
                  type="text"
                  placeholder="e.g., American Heart Association"
                  value={formData.charityName}
                  onChange={(e) => handleInputChange('charityName', e.target.value)}
                  className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-lg focus:border-[#967440] outline-none transition-all placeholder:text-[#967440]/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wide text-[#967440]">Donation Link (optional)</label>
                <input 
                  type="url"
                  placeholder="https://..."
                  value={formData.donationLink}
                  onChange={(e) => handleInputChange('donationLink', e.target.value)}
                  className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-lg focus:border-[#967440] outline-none transition-all placeholder:text-[#967440]/20"
                />
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wide text-[#967440]">Memorial Fund Name (optional)</label>
                  <input 
                    type="text"
                    placeholder="e.g., The John Smith Memorial Scholarship Fund"
                    value={formData.memorialFund}
                    onChange={(e) => handleInputChange('memorialFund', e.target.value)}
                    className="w-full bg-white border-2 border-[#967440]/10 rounded-2xl px-6 py-4 text-lg focus:border-[#967440] outline-none transition-all placeholder:text-[#967440]/20"
                  />
                  <p className="text-[10px] text-[#967440]/50 font-bold">If a memorial fund has been established in {formData.name || 'John'}'s name, enter it here.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 17:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif text-[#2c1810]">Any special message?</h2>
              <p className="text-[#967440]/70 font-medium">Thank caregivers, institutions, or include a meaningful quote.</p>
            </div>
            <div className="space-y-6">
              <textarea 
                placeholder='e.g., The family wishes to thank the staff at Memorial Hospital for their compassionate care. "Forever in our hearts."'
                value={formData.specialMessage}
                onChange={(e) => handleInputChange('specialMessage', e.target.value)}
                className="w-full bg-white border-2 border-[#967440]/10 rounded-[2.5rem] px-8 py-8 text-lg h-56 focus:border-[#967440] outline-none transition-all placeholder:text-[#967440]/30 resize-none font-medium leading-relaxed"
              />
              <p className="text-xs text-[#967440]/60 text-center leading-relaxed font-medium">Use this space to thank caregivers, hospice staff, medical institutions, or include a meaningful quote or final message.</p>
            </div>
          </div>
        );
      case 18:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif text-[#2c1810]">Choose a design for your memorial</h2>
              <p className="text-[#967440]/70 font-medium">Select a theme that best honors them.</p>
            </div>
            <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto px-2 custom-scrollbar">
              {TEMPLATES.map(template => (
                <button 
                  key={template.id}
                  onClick={() => handleInputChange('selectedTheme', template.id)}
                  className={cn(
                    "group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm transition-all",
                    formData.selectedTheme === template.id ? "ring-4 ring-[#967440] shadow-2xl scale-95" : "hover:scale-[1.02]"
                  )}
                >
                  <img src={template.image} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  {formData.selectedTheme === template.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[#967440] rounded-full flex items-center justify-center text-white">
                      <Check size={14} />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-center text-[10px] font-bold uppercase tracking-wide text-[#967440]/50">Can't decide? Skip this step and we'll pick the best match for you.</p>
          </div>
        );
      case 19:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif text-[#2c1810]">Almost there!</h2>
              <p className="text-[#967440]/70 font-medium">Enter your email so you can edit and manage your obituary.</p>
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-wide text-[#967440]">Email Address *</label>
                <input 
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-white border-2 border-[#967440]/30 rounded-2xl px-6 py-6 text-xl focus:border-[#967440] outline-none transition-all placeholder:text-[#967440]/20"
                />
              </div>
              
              <div className="bg-[#fcfafa] border border-[#967440]/10 rounded-2xl p-6 flex items-start gap-4">
                 <Lock className="text-[#967440] shrink-0" size={20} />
                 <p className="text-[#967440]/70 text-sm leading-relaxed font-bold">
                    Our obituary writer is powered by Google's advanced Gemini AI. We respect your privacy and never share your data.
                 </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf7] selection:bg-[#967440]/20 flex flex-col items-center justify-center px-4 sm:px-6 pt-36 pb-24">
      <Meta 
        title="AI Obituary Writer Studio" 
        description="Our AI-guided obituary writer helps you craft a beautiful, dignified, and professional tribute for your loved one in minutes with Google Gemini."
        canonical="https://funeralfolio.com/obituary-writer"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "FuneralFolio AI Obituary Writer",
          "applicationCategory": "WritingApplication",
          "operatingSystem": "Web",
          "description": "Guided AI assistant to write dignified obituaries and eulogies."
        }}
      />
      {/* Background Subtle elements could go here if needed to match landing */}
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[800px] bg-white rounded-[3rem] shadow-[0_50px_150px_rgba(44,24,16,0.08)] border border-[#2c1810]/5 overflow-hidden flex flex-col"
      >
        {/* Progress Bar Container */}
        <div className="px-16 pt-12 pb-6 space-y-4">
           <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-[#967440]/60">
              <p>Step {currentStep} of {totalSteps}</p>
              <p>{Math.round(progress)}% complete</p>
           </div>
           <div className="h-2.5 bg-[#967440]/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#967440]" 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
           </div>
        </div>

        {/* Content Area */}
        <div className="p-16 md:px-24 flex-1">
           <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {renderStep()}
                
                {generationError && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium"
                  >
                    <X className="shrink-0" size={18} />
                    {generationError}
                  </motion.div>
                )}
              </motion.div>
           </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="px-16 md:px-24 pb-16 flex items-center justify-between mt-auto">
           <button 
             onClick={prevStep}
             className="text-xs font-bold uppercase tracking-wide text-[#2c1810]/40 hover:text-[#967440] transition-colors"
           >
              Back
           </button>
           
           <div className="flex items-center gap-10">
              {currentStep !== 1 && currentStep !== totalSteps && (
                <button 
                  onClick={nextStep}
                  className="text-xs font-bold uppercase tracking-wide text-[#967440]/40 hover:text-[#967440] transition-colors"
                >
                   Skip
                </button>
              )}
              
              <button 
                onClick={nextStep}
                disabled={isGenerating}
                className={cn(
                  "bg-[#2c1810] text-[#d2c2ad] px-12 py-5 rounded-full font-bold text-xs uppercase tracking-wide flex items-center gap-3 shadow-2xl hover:bg-[#1a0f0a] hover:-translate-y-1 transition-all disabled:opacity-50",
                  currentStep === totalSteps && "px-14 py-6"
                )}
              >
                 {isGenerating ? (
                   <>Crafting... <div className="w-4 h-4 border-2 border-[#d2c2ad]/20 border-t-[#d2c2ad] rounded-full animate-spin" /></>
                 ) : (
                   currentStep === totalSteps ? 'Complete Obituary' : 'Continue'
                 )}
              </button>
           </div>
        </div>
      </motion.div>

      <p className="mt-8 text-[11px] font-bold uppercase tracking-wide text-[#967440]/40">Your information is saved automatically and never shared.</p>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f7f5f2;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #96744020;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #96744040;
        }
      `}</style>
    </div>
  );
}
