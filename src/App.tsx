import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { MemorialProvider } from './lib/MemorialContext';

// Eagerly loaded critical landing page
import Home from './pages/Home';

// Lazy loaded feature routes for fast initial page load (FCP & TTI)
const Gallery = lazy(() => import('./pages/Gallery'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Success = lazy(() => import('./pages/Success'));
const ObituaryWriter = lazy(() => import('./pages/ObituaryWriter'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Admin = lazy(() => import('./pages/Admin'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const ThankYouCards = lazy(() => import('./pages/ThankYouCards'));
const FuneralInvitations = lazy(() => import('./pages/FuneralInvitations'));
const PrayerCards = lazy(() => import('./pages/PrayerCards'));
const FuneralPrograms = lazy(() => import('./pages/FuneralPrograms'));
const MemorialPosters = lazy(() => import('./pages/MemorialPosters'));
const ProgramEditor = lazy(() => import('./pages/ProgramEditor'));
const InvitationEditor = lazy(() => import('./pages/InvitationEditor'));
const PrayerCardEditor = lazy(() => import('./pages/PrayerCardEditor'));
const ThankYouCardEditor = lazy(() => import('./pages/ThankYouCardEditor'));
const PosterEditor = lazy(() => import('./pages/PosterEditor'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function PageFallback() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 rounded-full border-3 border-[#967440]/20 border-t-[#967440] animate-spin mb-4" />
      <p className="text-xs font-serif text-[#967440] tracking-widest uppercase animate-pulse">
        Loading Memorial Suite...
      </p>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <MemorialProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            
            {/* Guides & Editor.js Blog */}
            <Route path="/blog" element={<Layout><Blog /></Layout>} />
            <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />

            {/* Memorial Stationery Product Catalog & Theme Detail Pages */}
            <Route path="/obituary-writer" element={<Layout><ObituaryWriter /></Layout>} />
            
            {/* Funeral Programs */}
            <Route path="/funeral-programs" element={<Layout><FuneralPrograms /></Layout>} />
            <Route path="/programs" element={<Layout><FuneralPrograms /></Layout>} />
            <Route path="/funeral-programs/:themeId" element={<Layout><ProductDetailPage productType="program" /></Layout>} />
            <Route path="/programs/:themeId" element={<Layout><ProductDetailPage productType="program" /></Layout>} />

            {/* Memorial Posters & Signs */}
            <Route path="/posters" element={<Layout><MemorialPosters /></Layout>} />
            <Route path="/memorial-posters" element={<Layout><MemorialPosters /></Layout>} />
            <Route path="/funeral-poster" element={<Navigate to="/posters" replace />} />
            <Route path="/posters/:themeId" element={<Layout><ProductDetailPage productType="poster" /></Layout>} />
            <Route path="/memorial-posters/:themeId" element={<Layout><ProductDetailPage productType="poster" /></Layout>} />
            <Route path="/funeral-poster/:themeId" element={<Layout><ProductDetailPage productType="poster" /></Layout>} />

            {/* Prayer Cards */}
            <Route path="/prayer-cards" element={<Layout><PrayerCards /></Layout>} />
            <Route path="/prayer-cards/:themeId" element={<Layout><ProductDetailPage productType="prayer" /></Layout>} />

            {/* Funeral Invitations */}
            <Route path="/funeral-invitations" element={<Layout><FuneralInvitations /></Layout>} />
            <Route path="/funeral-invitations/:themeId" element={<Layout><ProductDetailPage productType="invitation" /></Layout>} />

            {/* Thank You Cards */}
            <Route path="/thank-you-cards" element={<Layout><ThankYouCards /></Layout>} />
            <Route path="/funeral-thank-you-cards" element={<Navigate to="/thank-you-cards" replace />} />
            <Route path="/thank-you-cards/:themeId" element={<Layout><ProductDetailPage productType="thank-you" /></Layout>} />
            <Route path="/funeral-thank-you-cards/:themeId" element={<Layout><ProductDetailPage productType="thank-you" /></Layout>} />

            <Route path="/gallery" element={<Layout><Gallery /></Layout>} />

            {/* Redirects for removed tools */}
            <Route path="/start-quiz" element={<Navigate to="/obituary-writer" replace />} />
            <Route path="/eulogy-writer" element={<Navigate to="/obituary-writer" replace />} />
            <Route path="/photo-enhancer" element={<Navigate to="/obituary-writer" replace />} />
            <Route path="/video-maker" element={<Navigate to="/obituary-writer" replace />} />
            <Route path="/obituaries" element={<Navigate to="/obituary-writer" replace />} />
            <Route path="/obituaries/:memorialId" element={<Navigate to="/obituary-writer" replace />} />
            <Route path="/obit/:memorialId" element={<Navigate to="/obituary-writer" replace />} />
            <Route path="/memorial/:memorialId" element={<Navigate to="/obituary-writer" replace />} />
            <Route path="/accessibility" element={<Navigate to="/privacy" replace />} />

            {/* Specific Card & Program Editors & Checkout */}
            <Route path="/editor/program/:themeId" element={<ProgramEditor />} />
            <Route path="/editor/programs/:themeId" element={<ProgramEditor />} />
            <Route path="/editor/poster/:themeId" element={<PosterEditor />} />
            <Route path="/editor/posters/:themeId" element={<PosterEditor />} />
            <Route path="/editor/prayer/:themeId" element={<PrayerCardEditor />} />
            <Route path="/editor/invitation/:themeId" element={<InvitationEditor />} />
            <Route path="/editor/thank-you/:themeId" element={<ThankYouCardEditor />} />
            <Route path="/editor/:themeId" element={<Navigate to="/prayer-cards" replace />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />

            {/* Administration & Compliance */}
            <Route path="/admin" element={<Layout><Admin /></Layout>} />
            <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
            <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
            <Route path="/terms" element={<Layout><TermsOfService /></Layout>} />
            <Route path="/terms-of-service" element={<Layout><TermsOfService /></Layout>} />

            {/* Fallback */}
            <Route path="*" element={<Layout><Home /></Layout>} />
          </Routes>
        </Suspense>
      </Router>
    </MemorialProvider>
  );
}
