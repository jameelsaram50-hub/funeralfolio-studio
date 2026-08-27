import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Meta from '../components/Meta';
import { 
  BookOpen, 
  Clock, 
  User, 
  ArrowRight, 
  Search, 
  Sparkles, 
  Heart, 
  Tag, 
  Calendar,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';

import { blogPostService, BlogPostRecord, DEFAULT_EDITORJS_POSTS } from '../lib/supabase';

export type BlockNoteNode = any;

export interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  category: string;
  featuredImage: string;
  content: any;
}

export const BLOG_POSTS: BlogPostData[] = DEFAULT_EDITORJS_POSTS.map(p => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  author: p.author,
  authorRole: p.author_role || 'Senior Memorial Specialist',
  date: p.date,
  readTime: p.read_time,
  category: p.category,
  featuredImage: p.featured_image,
  content: p.content
}));

export default function Blog() {
  const [posts, setPosts] = useState<any[]>(BLOG_POSTS);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function loadPosts() {
      try {
        const fetched = await blogPostService.getAll();
        if (fetched && fetched.length > 0) {
          // Normalize field names
          const normalized = fetched.map(p => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            author: p.author,
            authorRole: p.author_role || (p as any).authorRole || 'Memorial Specialist',
            date: p.date,
            readTime: p.read_time || (p as any).readTime || '5 min read',
            category: p.category,
            featuredImage: p.featured_image || (p as any).featuredImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
            content: p.content,
          }));
          setPosts(normalized);
        }
      } catch (e) {
        console.warn('Could not load blog posts:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadPosts();
  }, []);

  const categories = ['All', 'Guides', 'Writing', 'Inspiration', 'Religious', 'Etiquette'];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#fdfaf7] pb-32 font-sans pt-36 selection:bg-[#967440]/20">
      <Meta 
        title="Memorial Resources, Guides & Bereavement Articles | FuneralFolio" 
        description="Comprehensive guides on funeral program design, obituary writing, Islamic Janazah etiquette, Christian order of service hymns, and grief support."
        canonical="https://funeralfolio.com/blog"
      />

      {/* Hero Header */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#967440]/10 rounded-full text-[#967440] text-xs font-bold uppercase tracking-wider mb-4 border border-[#967440]/20">
          <BookOpen size={14} />
          <span>Knowledge & Grief Support Guides</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2c1810] tracking-tight">
          Guidance for Meaningful Remembrance
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-serif leading-relaxed">
          Expert articles, etiquette advice, liturgy outlines, and practical step-by-step tutorials to guide you and your family through every step of memorial preparation.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search memorial articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#fdfaf7] border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:border-[#967440] outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                  selectedCategory === cat 
                    ? "bg-[#2c1810] text-[#d2c2ad]" 
                    : "bg-[#fdfaf7] hover:bg-gray-100 text-gray-600"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post Card */}
        {filteredPosts.length > 0 && selectedCategory === 'All' && !search && (
          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-200 mb-12 grid grid-cols-1 lg:grid-cols-12 group">
            <div className="lg:col-span-6 aspect-[16/10] lg:aspect-auto overflow-hidden">
              <img 
                src={filteredPosts[0].featuredImage} 
                alt={`${filteredPosts[0].title} - FuneralFolio Resource`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-[#967440] tracking-wider">
                  <span className="px-2.5 py-0.5 bg-[#967440]/10 rounded-full">{filteredPosts[0].category}</span>
                  <span>&bull;</span>
                  <span>Featured Editorial</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2c1810] group-hover:text-[#967440] transition-colors leading-snug">
                  <Link to={`/blog/${filteredPosts[0].slug}`}>
                    {filteredPosts[0].title}
                  </Link>
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 font-serif leading-relaxed">
                  {filteredPosts[0].excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#2c1810] text-white flex items-center justify-center text-xs font-bold">
                    {filteredPosts[0].author[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2c1810]">{filteredPosts[0].author}</p>
                    <p className="text-[10px] text-gray-400">{filteredPosts[0].date} &bull; {filteredPosts[0].readTime}</p>
                  </div>
                </div>

                <Link 
                  to={`/blog/${filteredPosts[0].slug}`}
                  className="bg-[#2c1810] hover:bg-black text-[#d2c2ad] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span>Read Article</span>
                  <ArrowRight size={13} className="text-[#967440]" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <article 
              key={post.id}
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-gray-200 transition-all flex flex-col group"
            >
              <Link to={`/blog/${post.slug}`} className="aspect-[16/10] overflow-hidden block">
                <img 
                  src={post.featuredImage} 
                  alt={`${post.title} Guide Thumbnail`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </Link>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#967440] tracking-wider">
                    <span>{post.category}</span>
                    <span className="text-gray-400 font-normal">{post.readTime}</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#2c1810] group-hover:text-[#967440] transition-colors leading-snug">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-gray-600 font-serif line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>{post.author}</span>
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="text-[#967440] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 hover:underline"
                  >
                    <span>Read</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
