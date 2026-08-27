import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Meta from '../components/Meta';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Sparkles, 
  BookOpen, 
  FileText, 
  ChevronRight,
  Edit3
} from 'lucide-react';
import { BLOG_POSTS } from './Blog';
import { blogPostService, BlogPostRecord } from '../lib/supabase';
import EditorJsRenderer from '../components/EditorJsRenderer';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      if (!slug) return;
      try {
        const fetched = await blogPostService.getBySlug(slug);
        if (fetched) {
          setPost({
            id: fetched.id,
            slug: fetched.slug,
            title: fetched.title,
            excerpt: fetched.excerpt,
            author: fetched.author,
            authorRole: fetched.author_role || (fetched as any).authorRole || 'Memorial Specialist',
            date: fetched.date,
            readTime: fetched.read_time || (fetched as any).readTime || '6 min read',
            category: fetched.category,
            featuredImage: fetched.featured_image || (fetched as any).featuredImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
            content: fetched.content,
          });
        } else {
          // Fallback to memory
          const fallback = BLOG_POSTS.find(p => p.slug === slug) || BLOG_POSTS[0];
          setPost(fallback);
        }
      } catch (e) {
        console.warn('Error fetching blog post:', e);
        const fallback = BLOG_POSTS.find(p => p.slug === slug) || BLOG_POSTS[0];
        setPost(fallback);
      } finally {
        setIsLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdfaf7] pt-32 pb-24 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#967440] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-serif text-gray-500">Loading memorial article...</p>
        </div>
      </div>
    );
  }

  const currentPost = post || BLOG_POSTS[0];

  // Extract headings for Table of Contents (E-E-A-T & Google Helpful Content)
  const tocHeadings: Array<{ id: string; text: string; level: number }> = [];
  const blocks = Array.isArray(currentPost.content) 
    ? currentPost.content 
    : (currentPost.content?.blocks || []);

  blocks.forEach((b: any) => {
    let text = '';
    let level = 2;
    if (b.type === 'header' || b.type === 'heading') {
      text = b.data?.text || (Array.isArray(b.content) ? b.content.map((c: any) => c.text).join('') : '');
      level = b.data?.level || b.props?.level || 2;
      if (text) {
        const cleanText = text.replace(/<[^>]*>?/gm, '').trim();
        const id = cleanText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        tocHeadings.push({ id, text: cleanText, level });
      }
    }
  });

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": currentPost.title,
    "description": currentPost.excerpt,
    "image": currentPost.featuredImage,
    "author": {
      "@type": "Person",
      "name": currentPost.author || "FuneralFolio Editorial Team",
      "jobTitle": currentPost.authorRole || "Memorial Specialist"
    },
    "publisher": {
      "@type": "Organization",
      "name": "FuneralFolio",
      "logo": {
        "@type": "ImageObject",
        "url": "https://funeralfolio.com/favicon.png"
      }
    },
    "datePublished": currentPost.date || "2026-08-23",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://funeralfolio.com/blog/${currentPost.slug}`
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf7] pb-32 font-sans pt-36 selection:bg-[#967440]/20">
      <Meta 
        title={`${currentPost.title} | FuneralFolio Resource`} 
        description={currentPost.excerpt}
        canonical={`https://funeralfolio.com/blog/${currentPost.slug}`}
        ogImage={currentPost.featuredImage}
        ogType="article"
        schema={articleSchema}
      />

      {/* Top Breadcrumb Bar */}
      <div className="max-w-4xl mx-auto px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/blog" className="hover:text-[#967440] flex items-center gap-1">
            <ArrowLeft size={12} />
            <span>All Articles</span>
          </Link>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-[#967440] font-bold uppercase tracking-wider">{currentPost.category}</span>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6">
        {/* Article Header Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-200 mb-8 space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#967440]/10 rounded-full text-[#967440] text-xs font-bold uppercase tracking-wider">
              <span>{currentPost.category} &bull; {currentPost.readTime}</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2c1810] tracking-tight leading-tight">
              {currentPost.title}
            </h1>

            {currentPost.excerpt && (
              <p className="text-base sm:text-lg text-gray-600 font-serif leading-relaxed italic border-l-2 border-[#967440]/40 pl-4">
                "{currentPost.excerpt}"
              </p>
            )}
          </div>

          {/* E-E-A-T Author & Reviewer Badge */}
          <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#2c1810] text-[#d2c2ad] flex items-center justify-center font-bold text-base">
                {currentPost.author ? currentPost.author[0] : 'F'}
              </div>
              <div>
                <p className="text-sm font-bold text-[#2c1810]">{currentPost.author}</p>
                <p className="text-[11px] text-gray-400">{currentPost.authorRole} &bull; Published {currentPost.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-[11px] font-semibold border border-emerald-100">
                <BookOpen size={12} className="text-emerald-600" />
                <span>Fact-Checked & Reviewed</span>
              </span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Article link copied to clipboard!");
                }}
                className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                title="Share Article"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Featured Image */}
          {currentPost.featuredImage && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-md">
              <img src={currentPost.featuredImage} alt={currentPost.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Table of Contents (E-E-A-T Navigation) */}
          {tocHeadings.length > 0 && (
            <div className="p-6 bg-[#FAF8F5] border border-[#967440]/20 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#967440]">
                <BookOpen size={14} />
                <span>Table of Contents</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 font-serif">
                {tocHeadings.map((heading, i) => (
                  <li key={i} className={heading.level === 3 ? "ml-4" : ""}>
                    <a 
                      href={`#${heading.id}`}
                      className="text-[#2C1810] hover:text-[#967440] hover:underline transition-colors flex items-center gap-2"
                    >
                      <span className="text-xs text-[#967440]/60 font-sans font-bold">{i + 1}.</span>
                      <span>{heading.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Clean Editor.js Block Rendering */}
          <div className="pt-4 border-t border-gray-100">
            <EditorJsRenderer content={currentPost.content} />
          </div>

          {/* Actionable Next Steps Box */}
          <div className="mt-12 p-8 rounded-2xl bg-[#2c1810] text-white space-y-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:space-y-0 shadow-lg">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#967440]">Next Steps</span>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">Create Your Custom Memorial Tribute</h3>
              <p className="text-xs text-[#d2c2ad] mt-1 max-w-md">
                Put these guidelines into practice with our pre-formatted, print-ready funeral programs, prayer cards, and invitations.
              </p>
            </div>
            <button
              onClick={() => navigate('/prayer-cards')}
              className="bg-[#967440] hover:bg-[#856535] text-white px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider whitespace-nowrap shadow-lg cursor-pointer transition-all shrink-0"
            >
              Start Free Preview
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
