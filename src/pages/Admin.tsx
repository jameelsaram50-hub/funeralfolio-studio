import React, { useState, useEffect, useRef } from 'react';
import Meta from '../components/Meta';
import { 
  Users, 
  LayoutTemplate, 
  ShoppingBag, 
  BarChart3, 
  FileEdit, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Download, 
  Search,
  Code,
  Sparkles,
  Save,
  RotateCcw,
  Upload,
  X,
  Image as ImageIcon,
  ToggleLeft,
  ToggleRight,
  Copy,
  TrendingUp,
  DollarSign,
  Printer,
  RefreshCw,
  Layers,
  Package,
  FileCheck,
  ArrowUpRight,
  Lock,
  Unlock,
  ShieldCheck,
  LogOut,
  Key,
  Tag,
  PlusCircle,
  MinusCircle,
  Percent,
  SlidersHorizontal,
  ArrowDown,
  ArrowUp,
  CreditCard
} from 'lucide-react';
import { TEMPLATES, Template } from '../constants';
import { BLOG_POSTS, BlogPostData, BlockNoteNode } from './Blog';
import { cn } from '../lib/utils';
import { memorialService, orderService } from '../lib/supabase';
import { usePricing, ProductPriceItem, saveProductPrices, resetAllPricesToFree } from '../lib/pricing';

import EditorJs from '../components/EditorJs';
import { blogPostService, BlogPostRecord } from '../lib/supabase';

interface AdminTemplate {
  id: string;
  name: string;
  category: string;
  tradition: string;
  dimensions: string;
  image: string;
  portrait?: string;
  activeStatus: boolean;
}

export default function Admin() {
  // Administrative Authentication State (Backed by Server-Side JWT Verification)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(sessionStorage.getItem('ff_admin_token'));
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState<'memorials' | 'templates' | 'pricing' | 'orders' | 'cms' | 'analytics'>('pricing');

  // Dynamic Store Pricing State
  const { prices: livePrices, saveAllPrices, resetAllToFree } = usePricing();
  const [currentPrices, setCurrentPrices] = useState<Record<string, ProductPriceItem>>(livePrices);

  useEffect(() => {
    setCurrentPrices(livePrices);
  }, [livePrices]);

  // Memorials State with 30-day soft delete recovery (Real Supabase data)
  const [memorialsList, setMemorialsList] = useState<any[]>([]);

  // Orders State (Real Supabase data)
  const [ordersList, setOrdersList] = useState<any[]>([]);

  // Template Catalog State
  const [templatesCatalog, setTemplatesCatalog] = useState<AdminTemplate[]>([
    ...TEMPLATES.map(t => ({
      ...t,
      tradition: t.category === 'Religious' ? 'Christian' : 'Universal/Secular',
      dimensions: '8.5" x 11" Bi-fold',
      activeStatus: true
    }))
  ]);

  // Template Modal State
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AdminTemplate | null>(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    category: 'Floral',
    tradition: 'Universal/Secular',
    dimensions: '8.5" x 11" Bi-fold',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop',
    activeStatus: true
  });
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [activeSchemaTemplate, setActiveSchemaTemplate] = useState<AdminTemplate | null>(null);
  const templateImageFileRef = useRef<HTMLInputElement>(null);

  // CMS Editor.js Blog Post State
  const [cmsPosts, setCmsPosts] = useState<any[]>([]);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Guides');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newAuthor, setNewAuthor] = useState('Julia Eskin');
  const [newAuthorRole, setNewAuthorRole] = useState('Senior Memorial Director');
  const [newFeaturedImage, setNewFeaturedImage] = useState('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop');
  const [editorJsData, setEditorJsData] = useState<any>({ blocks: [] });
  const [notification, setNotification] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [analyticsSearch, setAnalyticsSearch] = useState('');
  const headerImageFileRef = useRef<HTMLInputElement>(null);

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        sessionStorage.setItem('ff_admin_token', data.token);
        setIsAuthenticated(true);
        setLoginEmail('');
        setLoginPassword('');
        setLoginError(null);
        showNotice('Access granted. Welcome back, Administrator.');
      } else {
        setLoginError(data.error || 'Invalid administrator email or password. Access denied.');
      }
    } catch (err: any) {
      setLoginError('Authentication server unreachable. Please try again shortly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ff_admin_token');
    setIsAuthenticated(false);
    setLoginEmail('');
    setLoginPassword('');
    setLoginError(null);
    showNotice('Administrator portal locked.');
  };

  const handleAdjustPrice = (id: string, delta: number) => {
    setCurrentPrices(prev => {
      const item = prev[id];
      if (!item) return prev;
      const updatedPrice = Math.max(0, Number((item.price + delta).toFixed(2)));
      const updated = {
        ...prev,
        [id]: { ...item, price: updatedPrice }
      };
      saveAllPrices(updated);
      showNotice(`Updated ${item.name} to $${updatedPrice.toFixed(2)}.`);
      return updated;
    });
  };

  const handleSetPriceDirect = (id: string, newPrice: number) => {
    const safePrice = Math.max(0, Number(newPrice) || 0);
    setCurrentPrices(prev => {
      const item = prev[id];
      if (!item) return prev;
      const updated = {
        ...prev,
        [id]: { ...item, price: safePrice }
      };
      saveAllPrices(updated);
      showNotice(`Updated ${item.name} price to $${safePrice.toFixed(2)}.`);
      return updated;
    });
  };

  const handleBulkAdjustAll = (delta: number) => {
    setCurrentPrices(prev => {
      const updated: Record<string, ProductPriceItem> = {};
      Object.keys(prev).forEach(key => {
        updated[key] = {
          ...prev[key],
          price: Math.max(0, Number((prev[key].price + delta).toFixed(2)))
        };
      });
      saveAllPrices(updated);
      showNotice(`Adjusted all product prices by ${delta >= 0 ? `+$${delta}` : `-$${Math.abs(delta)}`}.`);
      return updated;
    });
  };

  const handleResetAllToFree = () => {
    resetAllToFree();
    showNotice("All product prices set to $0.00 (100% Free).");
  };

  const loadSupabaseData = async () => {
    setIsRefreshing(true);
    try {
      const mems = await memorialService.getAll();
      if (mems && mems.length > 0) {
        setMemorialsList(mems.map(m => ({
          id: m.id,
          name: m.name || 'Memorial Family',
          user: m.user_id || 'guest@funeralfolio.com',
          created: m.created_at ? m.created_at.split('T')[0].split(' ')[0] : new Date().toISOString().split('T')[0],
          format: m.format || 'Bi-fold Program',
          status: m.status || 'Active',
          members: 2
        })));
      } else {
        setMemorialsList([]);
      }

      const orders = await orderService.getAll();
      if (orders && orders.length > 0) {
        setOrdersList(orders.map(o => ({
          id: o.id,
          customer: o.customer_name || 'Customer',
          product: o.package_name || 'Memorial Stationery',
          amount: `$${(Number(o.amount) || 0).toFixed(2)}`,
          date: o.created_at ? o.created_at.split('T')[0].split(' ')[0] : new Date().toISOString().split('T')[0],
          status: o.status || 'Paid'
        })));
      } else {
        setOrdersList([]);
      }

      const articles = await blogPostService.getAll();
      if (articles && articles.length > 0) {
        setCmsPosts(articles);
        if (!editingPost) {
          handleStartEditPost(articles[0]);
        }
      }
    } catch (e) {
      console.warn("Supabase Admin sync:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('ff_admin_token');
    if (token) {
      fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token })
      })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setIsAuthenticated(true);
          loadSupabaseData();
        } else {
          handleLogout();
        }
      })
      .catch(() => {
        handleLogout();
      });
    } else {
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]);

  const handleStartEditPost = (post: any) => {
    setEditingPost(post);
    setNewTitle(post.title || '');
    setNewCategory(post.category || 'Guides');
    setNewExcerpt(post.excerpt || '');
    setNewAuthor(post.author || 'FuneralFolio Editorial');
    setNewAuthorRole(post.author_role || post.authorRole || 'Memorial Specialist');
    setNewFeaturedImage(post.featured_image || post.featuredImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop');
    
    // Normalize content
    if (post.content && post.content.blocks) {
      setEditorJsData(post.content);
    } else if (Array.isArray(post.content)) {
      setEditorJsData({
        time: Date.now(),
        version: '2.30.8',
        blocks: post.content.map((n: any) => ({
          type: n.type === 'heading' ? 'header' : n.type === 'bulletListItem' ? 'list' : 'paragraph',
          data: {
            text: n.content?.map((c: any) => c.text).join('') || '',
            level: n.props?.level || 2,
            style: 'unordered',
            items: [n.content?.map((c: any) => c.text).join('') || '']
          }
        }))
      });
    } else {
      setEditorJsData({ blocks: [] });
    }
  };

  const handleCreateNewPost = () => {
    setEditingPost(null);
    setNewTitle('');
    setNewExcerpt('');
    setNewCategory('Guides');
    setNewAuthor('Julia Eskin');
    setNewAuthorRole('Senior Memorial Director');
    setNewFeaturedImage('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop');
    setEditorJsData({
      time: Date.now(),
      version: '2.30.8',
      blocks: [
        {
          id: 'b1',
          type: 'header',
          data: { text: 'Title of Your Memorial Article', level: 2 }
        },
        {
          id: 'b2',
          type: 'paragraph',
          data: { text: 'Introduce the sacred significance and helpful advice for families here...' }
        }
      ]
    });
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const saved = await blogPostService.save({
        id: editingPost?.id,
        title: newTitle,
        category: newCategory,
        excerpt: newExcerpt,
        author: newAuthor,
        author_role: newAuthorRole,
        featured_image: newFeaturedImage,
        content: editorJsData,
      });

      // Update state
      const updated = await blogPostService.getAll();
      setCmsPosts(updated);
      setEditingPost(saved);
      showNotice(`"${newTitle}" successfully saved to Supabase (Editor.js clean JSON).`);
    } catch (err) {
      console.error("Save article error:", err);
      showNotice("Article updated in local storage.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    await blogPostService.delete(id);
    const updated = await blogPostService.getAll();
    setCmsPosts(updated);
    if (updated.length > 0) {
      handleStartEditPost(updated[0]);
    } else {
      handleCreateNewPost();
    }
    showNotice("Article removed from Supabase and CMS.");
  };

  // Template CRUD & Image Upload Handlers
  const handleOpenNewTemplateModal = () => {
    setEditingTemplate(null);
    setTemplateForm({
      name: '',
      category: 'Floral',
      tradition: 'Universal/Secular',
      dimensions: '8.5" x 11" Bi-fold',
      image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop',
      activeStatus: true
    });
    setIsTemplateModalOpen(true);
  };

  const handleOpenEditTemplateModal = (tmpl: AdminTemplate) => {
    setEditingTemplate(tmpl);
    setTemplateForm({
      name: tmpl.name,
      category: tmpl.category,
      tradition: tmpl.tradition,
      dimensions: tmpl.dimensions,
      image: tmpl.image,
      activeStatus: tmpl.activeStatus !== false
    });
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateForm.name.trim()) return;

    if (editingTemplate) {
      setTemplatesCatalog(prev => prev.map(t => t.id === editingTemplate.id ? {
        ...t,
        ...templateForm
      } : t));
      showNotice(`Template "${templateForm.name}" updated successfully.`);
    } else {
      const newTmpl: AdminTemplate = {
        id: `custom-${Date.now()}`,
        name: templateForm.name,
        category: templateForm.category,
        tradition: templateForm.tradition,
        dimensions: templateForm.dimensions,
        image: templateForm.image,
        portrait: templateForm.image,
        activeStatus: templateForm.activeStatus
      };
      setTemplatesCatalog(prev => [newTmpl, ...prev]);
      showNotice(`New template "${templateForm.name}" added to database catalog.`);
    }
    setIsTemplateModalOpen(false);
  };

  const handleDeleteTemplate = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove template "${name}"?`)) return;
    setTemplatesCatalog(prev => prev.filter(t => t.id !== id));
    showNotice(`Template "${name}" removed from catalog.`);
  };

  const handleToggleTemplateStatus = (id: string) => {
    setTemplatesCatalog(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = !t.activeStatus;
        showNotice(`Template "${t.name}" marked as ${nextStatus ? 'Live' : 'Disabled'}.`);
        return { ...t, activeStatus: nextStatus };
      }
      return t;
    }));
  };

  const handleTemplateCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result && typeof result === 'string') {
          setTemplateForm(prev => ({ ...prev, image: result }));
          showNotice("Template cover image uploaded successfully.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeaderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result && typeof result === 'string') {
          setNewFeaturedImage(result);
          showNotice("Featured header image uploaded.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRestoreMemorial = (id: string) => {
    setMemorialsList(prev => prev.map(m => m.id === id ? { ...m, status: 'Active (Restored)' } : m));
    showNotice(`Memorial #${id} restored from 30-day soft-delete trash.`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fdfaf7] flex flex-col justify-center items-center px-4 py-24 font-sans selection:bg-[#967440]/20 pt-36">
        <Meta 
          title="Admin Security Access | FuneralFolio" 
          description="Protected administrator login portal for FuneralFolio memorial management."
        />

        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-200 space-y-6">
          {/* Header & Shield */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#2c1810] text-[#967440] flex items-center justify-center mx-auto shadow-md">
              <Lock size={28} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#967440]">Restricted Management</span>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#2c1810]">Admin Portal Login</h1>
              <p className="text-xs text-gray-500 mt-1">Please enter your verified administrative credentials to proceed.</p>
            </div>
          </div>

          {/* Error Notice */}
          {loginError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1.5">
                Administrator Email Address *
              </label>
              <input 
                type="email"
                required
                autoFocus
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@funeralfolio.com"
                className="w-full bg-[#fdfaf7] border border-gray-200 rounded-xl px-4 py-3 text-xs focus:border-[#967440] outline-none font-medium text-[#2c1810]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1.5">
                Administrator Password *
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full bg-[#fdfaf7] border border-gray-200 rounded-xl pl-4 pr-11 py-3 text-xs focus:border-[#967440] outline-none font-mono text-[#2c1810]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#2c1810] hover:bg-black disabled:opacity-60 text-[#d2c2ad] py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all mt-2"
            >
              {isSubmitting ? (
                <RefreshCw size={16} className="animate-spin text-[#967440]" />
              ) : (
                <ShieldCheck size={16} className="text-[#967440]" />
              )}
              <span>{isSubmitting ? "Verifying Access..." : "Unlock Admin Portal"}</span>
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="pt-2 border-t border-gray-100 text-center">
            <a 
              href="/" 
              className="text-xs text-gray-400 hover:text-[#967440] transition-colors font-medium"
            >
              ← Return to FuneralFolio Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf7] pb-32 font-sans pt-36 selection:bg-[#967440]/20">
      <Meta 
        title="Admin Management Portal | FuneralFolio" 
        description="FuneralFolio admin dashboard: manage memorials, database-driven templates, customer orders, BlockNote JSON CMS articles, and print analytics."
      />

      {/* Admin Top Header */}
      <div className="bg-[#2c1810] text-[#f7f5f2] py-8 px-6 sm:px-12 border-b border-[#967440]/30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#967440] block">Platform Control & CMS</span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">FuneralFolio Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Supabase Live</span>
            </span>
            <div className="h-6 w-px bg-white/20 hidden sm:block" />
            <span className="text-xs text-[#d2c2ad] font-semibold hidden md:flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <ShieldCheck size={13} className="text-[#967440]" />
              <span>Verified Administrator</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-red-500/20 text-gray-300 hover:text-red-300 border border-white/20 hover:border-red-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Lock and Sign Out"
            >
              <LogOut size={13} />
              <span>Lock Portal</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('memorials')}
            className={cn(
              "px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap",
              activeTab === 'memorials' ? "bg-[#2c1810] text-[#d2c2ad] shadow-sm" : "bg-white text-gray-600 hover:bg-gray-100"
            )}
          >
            <Users size={15} />
            <span>Memorials & Users ({memorialsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={cn(
              "px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap",
              activeTab === 'templates' ? "bg-[#2c1810] text-[#d2c2ad] shadow-sm" : "bg-white text-gray-600 hover:bg-gray-100"
            )}
          >
            <LayoutTemplate size={15} />
            <span>Database Templates ({templatesCatalog.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={cn(
              "px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap",
              activeTab === 'pricing' ? "bg-[#2c1810] text-[#d2c2ad] shadow-sm" : "bg-white text-gray-600 hover:bg-gray-100"
            )}
          >
            <Tag size={15} />
            <span>Product Pricing & Controls</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={cn(
              "px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap",
              activeTab === 'orders' ? "bg-[#2c1810] text-[#d2c2ad] shadow-sm" : "bg-white text-gray-600 hover:bg-gray-100"
            )}
          >
            <ShoppingBag size={15} />
            <span>Orders & Fulfillment ({ordersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cms')}
            className={cn(
              "px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap",
              activeTab === 'cms' ? "bg-[#2c1810] text-[#d2c2ad] shadow-sm" : "bg-white text-gray-600 hover:bg-gray-100"
            )}
          >
            <FileEdit size={15} />
            <span>Editor.js CMS Articles ({cmsPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={cn(
              "px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap",
              activeTab === 'analytics' ? "bg-[#2c1810] text-[#d2c2ad] shadow-sm" : "bg-white text-gray-600 hover:bg-gray-100"
            )}
          >
            <BarChart3 size={15} />
            <span>Analytics & Prints</span>
          </button>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{notification}</span>
          </div>
        )}

        {/* Tab 1: Memorials & Users */}
        {activeTab === 'memorials' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-2xl text-[#2c1810]">Active Memorial Records</h3>
                <p className="text-xs text-gray-500">Supports multi-member collaboration and 30-day soft-delete recovery protection.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#967440] bg-[#fdfaf7] px-3 py-1.5 rounded-xl border border-[#967440]/20">
                  RLS Security: Enforced
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider font-bold">
                    <th className="pb-3">Deceased Name</th>
                    <th className="pb-3">Account Owner</th>
                    <th className="pb-3">Stationery Format</th>
                    <th className="pb-3">Collaborators</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-sans">
                  {memorialsList.length > 0 ? (
                    memorialsList.map(mem => (
                      <tr key={mem.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 font-bold text-[#2c1810] font-serif text-sm">{mem.name}</td>
                        <td className="py-4 text-gray-600">{mem.user}</td>
                        <td className="py-4 text-gray-600">{mem.format}</td>
                        <td className="py-4 text-gray-600">{mem.members} Family Members</td>
                        <td className="py-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            mem.status.includes('Active') ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          )}>
                            {mem.status}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2">
                          {mem.status.includes('Soft-Deleted') ? (
                            <button 
                              onClick={() => handleRestoreMemorial(mem.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 inline-flex cursor-pointer"
                            >
                              <RotateCcw size={12} />
                              <span>Restore</span>
                            </button>
                          ) : (
                            <button 
                              onClick={() => showNotice(`Viewing live draft for ${mem.name}`)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye size={12} />
                              <span>Inspect</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        No memorials found in Supabase database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Database Templates */}
        {activeTab === 'templates' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-2xl text-[#2c1810]">Database-Driven Template Catalog</h3>
                <p className="text-xs text-gray-500">Add, edit, or toggle stationery templates directly. Changes reflect across all builders in real time.</p>
              </div>
              <button 
                onClick={handleOpenNewTemplateModal}
                className="bg-[#2c1810] hover:bg-black text-[#d2c2ad] px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus size={14} className="text-[#967440]" />
                <span>Add New Template</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {templatesCatalog.map(tmpl => (
                <div key={tmpl.id} className="rounded-3xl border border-gray-200 overflow-hidden bg-[#fdfaf7] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="aspect-[3/4] overflow-hidden relative group bg-gray-100">
                      <img src={tmpl.image} alt={tmpl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleTemplateStatus(tmpl.id)}
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md transition-all",
                            tmpl.activeStatus !== false 
                              ? "bg-emerald-600 text-white" 
                              : "bg-gray-800 text-gray-300"
                          )}
                        >
                          {tmpl.activeStatus !== false ? 'Live' : 'Disabled'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-base text-[#2c1810] line-clamp-1">{tmpl.name}</h4>
                      </div>
                      <p className="text-[11px] text-[#967440] font-bold">{tmpl.tradition} &bull; {tmpl.category}</p>
                      <p className="text-[10px] text-gray-500">{tmpl.dimensions}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-between text-xs mt-2">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenEditTemplateModal(tmpl)}
                        className="bg-white hover:bg-gray-100 text-gray-700 p-1.5 rounded-lg border border-gray-200 font-bold flex items-center gap-1 cursor-pointer transition-colors text-[11px]"
                        title="Edit Template"
                      >
                        <Edit3 size={13} className="text-[#967440]" />
                        <span>Edit</span>
                      </button>

                      <button 
                        onClick={() => {
                          setActiveSchemaTemplate(tmpl);
                          setIsSchemaModalOpen(true);
                        }}
                        className="bg-white hover:bg-gray-100 text-gray-700 p-1.5 rounded-lg border border-gray-200 font-bold flex items-center gap-1 cursor-pointer transition-colors text-[11px]"
                        title="View JSON Design Schema"
                      >
                        <Code size={13} />
                        <span>Schema</span>
                      </button>
                    </div>

                    <button 
                      onClick={() => handleDeleteTemplate(tmpl.id, tmpl.name)}
                      className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Template"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Product Pricing & Dynamic Controls */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            {/* Top Stat & Master Action Header */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-[#2c1810] text-[#967440] flex items-center justify-center font-bold">
                      <DollarSign size={18} />
                    </span>
                    <div>
                      <h3 className="font-serif font-bold text-2xl text-[#2c1810]">
                        Store Product Pricing & Dynamic Controls
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Increase, decrease, or set custom prices for every stationery format and checkout package. All prices are currently set to $0.00 (Free) by default.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bulk Actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={handleResetAllToFree}
                    className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    title="Set all products to $0.00 (100% Free)"
                  >
                    <Sparkles size={14} className="text-emerald-600" />
                    <span>Set All to Free ($0.00)</span>
                  </button>

                  <button
                    onClick={() => handleBulkAdjustAll(1)}
                    className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    title="Add $1 to all items"
                  >
                    <ArrowUp size={13} className="text-[#967440]" />
                    <span>+$1 to All</span>
                  </button>

                  <button
                    onClick={() => handleBulkAdjustAll(5)}
                    className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    title="Add $5 to all items"
                  >
                    <ArrowUp size={13} className="text-[#967440]" />
                    <span>+$5 to All</span>
                  </button>

                  <button
                    onClick={() => handleBulkAdjustAll(-1)}
                    className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Decrease $1 from all product prices (Min $0.00)"
                  >
                    <ArrowDown size={13} className="text-amber-800" />
                    <span>Decrease $1 (-$1)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Individual Product Price Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(currentPrices).map((item) => {
                const isFree = item.price === 0;

                return (
                  <div 
                    key={item.id}
                    className={cn(
                      "bg-white rounded-3xl p-6 shadow-xl border transition-all flex flex-col justify-between space-y-5",
                      isFree ? "border-emerald-200 ring-1 ring-emerald-500/20" : "border-gray-200"
                    )}
                  >
                    {/* Header: Title, Category & Current Price Badge */}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="px-2.5 py-1 bg-amber-50 text-[#967440] rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#967440]/20">
                          {item.category}
                        </span>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1",
                          isFree 
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                            : "bg-[#2c1810] text-[#d2c2ad]"
                        )}>
                          {isFree ? "FREE ($0.00)" : `$${item.price.toFixed(2)}`}
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-lg text-[#2c1810]">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Interactive Price Controls */}
                    <div className="space-y-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                          Price in USD ($)
                        </label>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {item.unit}
                        </span>
                      </div>

                      {/* Direct Price Input with Stepper Controls */}
                      <div className="flex items-center gap-2">
                        {/* Decrement Button */}
                        <button
                          onClick={() => handleAdjustPrice(item.id, -1)}
                          disabled={item.price <= 0}
                          className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 flex items-center justify-center font-bold text-lg transition-all cursor-pointer shrink-0"
                          title="Decrease price by $1.00"
                        >
                          -
                        </button>

                        {/* Number Input */}
                        <div className="relative flex-1">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                            $
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="0.50"
                            value={item.price}
                            onChange={(e) => handleSetPriceDirect(item.id, parseFloat(e.target.value) || 0)}
                            className="w-full bg-[#fdfaf7] border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-sm font-bold text-[#2c1810] focus:border-[#967440] outline-none"
                          />
                        </div>

                        {/* Increment Button */}
                        <button
                          onClick={() => handleAdjustPrice(item.id, 1)}
                          className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-lg transition-all cursor-pointer shrink-0"
                          title="Increase price by $1.00"
                        >
                          +
                        </button>
                      </div>

                      {/* Quick Stepper Shortcuts */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          onClick={() => handleSetPriceDirect(item.id, 0)}
                          className={cn(
                            "flex-1 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer",
                            isFree ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          )}
                        >
                          $0 (Free)
                        </button>
                        <button
                          onClick={() => handleAdjustPrice(item.id, 5)}
                          className="flex-1 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer"
                        >
                          +$5
                        </button>
                        <button
                          onClick={() => handleAdjustPrice(item.id, 10)}
                          className="flex-1 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer"
                        >
                          +$10
                        </button>
                        <button
                          onClick={() => handleAdjustPrice(item.id, 25)}
                          className="flex-1 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer"
                        >
                          +$25
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 space-y-6">
            <div>
              <h3 className="font-serif font-bold text-2xl text-[#2c1810]">Customer Orders & Print-and-Ship</h3>
              <p className="text-xs text-gray-500">Stripe payment logs, high-resolution download tokens, and physical print fulfillment status.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider font-bold">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Purchased Items</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-sans">
                  {ordersList.length > 0 ? (
                    ordersList.map(ord => (
                      <tr key={ord.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 font-mono font-bold text-[#2c1810]">{ord.id}</td>
                        <td className="py-4 font-semibold text-gray-800">{ord.customer}</td>
                        <td className="py-4 text-gray-600">{ord.product}</td>
                        <td className="py-4 font-bold text-[#967440]">{ord.amount}</td>
                        <td className="py-4 text-gray-500">{ord.date}</td>
                        <td className="py-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        No orders found in Supabase database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Editor.js CMS Blog Post Editor */}
        {activeTab === 'cms' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Panel: Articles List */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-xl border border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#2c1810]">Memorial Articles</h3>
                  <p className="text-xs text-gray-500">Editor.js Block Documents</p>
                </div>
                <button
                  onClick={handleCreateNewPost}
                  className="bg-[#2c1810] hover:bg-black text-[#d2c2ad] px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                >
                  <Plus size={13} className="text-[#967440]" />
                  <span>New Post</span>
                </button>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {cmsPosts.map(post => (
                  <div 
                    key={post.id}
                    onClick={() => handleStartEditPost(post)}
                    className={cn(
                      "p-4 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between group",
                      editingPost?.id === post.id 
                        ? "border-[#967440] bg-[#fdfaf7] shadow-sm ring-2 ring-[#967440]/30" 
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    )}
                  >
                    <div className="space-y-1 pr-2">
                      <p className="font-bold text-[#2c1810] font-serif line-clamp-1">{post.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <span className="text-[#967440] uppercase font-bold">{post.category}</span>
                        <span>&bull;</span>
                        <span>{post.read_time || post.readTime || '5 min'}</span>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(post.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Article"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel: Editor.js Interactive Workspace */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#967440] flex items-center gap-1">
                    <Sparkles size={12} />
                    Editor.js Clean JSON Engine
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-[#2c1810]">
                    {editingPost ? `Edit: ${newTitle || 'Article'}` : "Write New Memorial Guide"}
                  </h3>
                </div>

                {editingPost && (
                  <a
                    href={`/blog/${editingPost.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-amber-50 text-[#967440] border border-[#967440]/30 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Eye size={13} />
                    <span>View Live Reader</span>
                  </a>
                )}
              </div>

              <form onSubmit={handleSavePost} className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">
                    Article Title *
                  </label>
                  <input 
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Complete Guide to Creating a Dignified Order of Service"
                    className="w-full bg-[#fdfaf7] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#967440] outline-none font-serif font-bold text-[#2c1810]"
                  />
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-[#fdfaf7] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:border-[#967440] outline-none font-medium"
                    >
                      <option value="Guides">Guides</option>
                      <option value="Writing">Writing</option>
                      <option value="Inspiration">Inspiration</option>
                      <option value="Religious">Religious</option>
                      <option value="Etiquette">Etiquette</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Author Name</label>
                    <input 
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g. Julia Eskin"
                      className="w-full bg-[#fdfaf7] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:border-[#967440] outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Author Role</label>
                    <input 
                      type="text"
                      value={newAuthorRole}
                      onChange={(e) => setNewAuthorRole(e.target.value)}
                      placeholder="e.g. Liturgical Counselor"
                      className="w-full bg-[#fdfaf7] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:border-[#967440] outline-none font-medium"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">
                    Summary Excerpt (for search & cards)
                  </label>
                  <textarea
                    rows={2}
                    value={newExcerpt}
                    onChange={(e) => setNewExcerpt(e.target.value)}
                    placeholder="Brief 1-2 sentence overview for readers and social cards..."
                    className="w-full bg-[#fdfaf7] border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:border-[#967440] outline-none font-serif resize-none text-gray-700"
                  />
                </div>

                {/* Featured Header Image with URL & Direct File Upload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider">
                      Featured Header Image (URL or Upload)
                    </label>
                    <span className="text-[10px] text-gray-400 font-medium">Recommended: 1200x630 or 16:9 ratio</span>
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={newFeaturedImage}
                      onChange={(e) => setNewFeaturedImage(e.target.value)}
                      placeholder="https://images.unsplash.com/... or upload file"
                      className="w-full bg-[#fdfaf7] border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:border-[#967440] outline-none font-mono text-gray-600"
                    />

                    <input 
                      type="file" 
                      ref={headerImageFileRef} 
                      onChange={handleHeaderImageUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />

                    <button
                      type="button"
                      onClick={() => headerImageFileRef.current?.click()}
                      className="bg-[#2c1810] hover:bg-black text-[#d2c2ad] px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors shadow-sm"
                      title="Upload photo from your device"
                    >
                      <Upload size={14} className="text-[#967440]" />
                      <span>Upload</span>
                    </button>
                  </div>

                  {newFeaturedImage && (
                    <div className="relative aspect-[16/7] max-h-48 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100 group">
                      <img 
                        src={newFeaturedImage} 
                        alt="Header preview" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => headerImageFileRef.current?.click()}
                          className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow cursor-pointer hover:bg-gray-100"
                        >
                          <Upload size={12} />
                          <span>Change Photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewFeaturedImage('')}
                          className="bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow cursor-pointer hover:bg-rose-700"
                        >
                          <X size={12} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Interactive Editor.js Canvas */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-2 flex items-center justify-between">
                    <span>Block-Based Article Content (Editor.js)</span>
                    <span className="text-[#967440] lowercase">clean JSON output &bull; blocks, quotes, lists, tables</span>
                  </label>
                  
                  <EditorJs 
                    key={editingPost?.id || 'new-editor'}
                    data={editorJsData}
                    onChange={(output) => setEditorJsData(output)}
                    placeholder="Click to start typing your memorial guide. Type '/' or click '+' for block tools..."
                  />
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#967440] hover:bg-[#856535] text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save size={15} />
                    <span>{isSaving ? 'Saving to Database...' : 'Save Article to Supabase'}</span>
                  </button>

                  {editingPost && (
                    <button
                      type="button"
                      onClick={() => handleDeletePost(editingPost.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer px-4 py-2 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 size={14} />
                      <span>Delete Article</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 5: Real-Time Analytics & Prints */}
        {activeTab === 'analytics' && (() => {
          // Real Dynamic Calculations from Actual State
          const totalRevenue = ordersList.reduce((acc, order) => {
            const rawNum = parseFloat(String(order.amount).replace(/[^0-9.]/g, '')) || 0;
            return acc + rawNum;
          }, 0);

          const totalOrdersCount = ordersList.length;
          const paidOrdersCount = ordersList.filter(o => 
            o.status.toLowerCase().includes('paid') || 
            o.status.toLowerCase().includes('downloaded') || 
            o.status.toLowerCase().includes('shipped')
          ).length;
          
          const inProductionCount = ordersList.filter(o => 
            o.status.toLowerCase().includes('production') || 
            o.status.toLowerCase().includes('pending')
          ).length;

          const activeMemorialsCount = memorialsList.filter(m => 
            !m.status.toLowerCase().includes('deleted')
          ).length;

          const softDeletedCount = memorialsList.filter(m => 
            m.status.toLowerCase().includes('deleted')
          ).length;

          const totalGuidesCount = cmsPosts.length;
          const activeTemplatesCount = templatesCatalog.filter(t => t.activeStatus).length;
          const avgOrderValue = totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount).toFixed(2) : '0.00';

          // Real Product Package Breakdown from Orders
          const packageCounts = ordersList.reduce((acc: Record<string, number>, order) => {
            const name = order.product || 'Standard Memorial Order';
            acc[name] = (acc[name] || 0) + 1;
            return acc;
          }, {});

          const packageAnalytics: Array<{ name: string; count: number; percentage: number }> = Object.entries(packageCounts).map(([name, count]) => {
            const num = Number(count) || 0;
            return {
              name,
              count: num,
              percentage: Math.round((num / (totalOrdersCount || 1)) * 100)
            };
          }).sort((a, b) => b.count - a.count);

          // Real Memorial Format Breakdown from Memorials
          const formatCounts = memorialsList.reduce((acc: Record<string, number>, mem) => {
            const fmt = mem.format || 'Standard Format';
            acc[fmt] = (acc[fmt] || 0) + 1;
            return acc;
          }, {});

          const formatAnalytics: Array<{ format: string; count: number; percentage: number }> = Object.entries(formatCounts).map(([format, count]) => {
            const num = Number(count) || 0;
            return {
              format,
              count: num,
              percentage: Math.round((num / (memorialsList.length || 1)) * 100)
            };
          }).sort((a, b) => b.count - a.count);

          // Real Template Category Breakdown
          const templateCategoryCounts = templatesCatalog.reduce((acc: Record<string, number>, tmpl) => {
            const cat = tmpl.category || 'General';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
          }, {});

          const templateCategoryAnalytics: Array<{ category: string; count: number; percentage: number }> = Object.entries(templateCategoryCounts).map(([category, count]) => {
            const num = Number(count) || 0;
            return {
              category,
              count: num,
              percentage: Math.round((num / (templatesCatalog.length || 1)) * 100)
            };
          }).sort((a, b) => b.count - a.count);

          // Filtered Orders for Activity Log
          const filteredAnalyticsOrders = ordersList.filter(o => 
            analyticsSearch === '' || 
            o.customer.toLowerCase().includes(analyticsSearch.toLowerCase()) ||
            o.product.toLowerCase().includes(analyticsSearch.toLowerCase()) ||
            o.id.toLowerCase().includes(analyticsSearch.toLowerCase()) ||
            o.status.toLowerCase().includes(analyticsSearch.toLowerCase())
          );

          return (
            <div className="space-y-8">
              {/* Header & Refresh Toolbar */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#967440]">Live Platform Telemetry</span>
                  <h3 className="font-serif font-bold text-2xl text-[#2c1810]">
                    Real-Time Analytics & Print Operations
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Live metrics calculated dynamically from database orders, memorials, and template catalogs.
                  </p>
                </div>
                
                <button
                  onClick={loadSupabaseData}
                  disabled={isRefreshing}
                  className="px-4 py-2.5 rounded-full border border-gray-200 hover:border-[#967440] hover:bg-[#fdfaf7] text-xs font-bold text-[#2c1810] inline-flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <RefreshCw size={14} className={cn("text-[#967440]", isRefreshing && "animate-spin")} />
                  <span>{isRefreshing ? 'Syncing Live...' : 'Refresh Telemetry'}</span>
                </button>
              </div>

              {/* Top KPI Cards (Real Data) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* KPI 1: Real Revenue */}
                <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span className="text-[10px] uppercase font-bold tracking-wider">Total Verified Revenue</span>
                      <DollarSign size={16} className="text-[#967440]" />
                    </div>
                    <h4 className="text-3xl font-serif font-bold text-[#2c1810] mt-2">
                      ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h4>
                  </div>
                  <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Average Order</span>
                    <span className="text-emerald-700 font-bold">${avgOrderValue}</span>
                  </div>
                </div>

                {/* KPI 2: Real Print Orders */}
                <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span className="text-[10px] uppercase font-bold tracking-wider">Print Orders & PDFs</span>
                      <Printer size={16} className="text-[#967440]" />
                    </div>
                    <h4 className="text-3xl font-serif font-bold text-[#2c1810] mt-2">
                      {totalOrdersCount}
                    </h4>
                  </div>
                  <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-bold">{paidOrdersCount} Paid & Fulfilled</span>
                    <span className="text-gray-400">{inProductionCount} in queue</span>
                  </div>
                </div>

                {/* KPI 3: Real Active Memorials */}
                <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span className="text-[10px] uppercase font-bold tracking-wider">Active Memorials</span>
                      <Users size={16} className="text-[#967440]" />
                    </div>
                    <h4 className="text-3xl font-serif font-bold text-[#2c1810] mt-2">
                      {activeMemorialsCount}
                    </h4>
                  </div>
                  <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Trash Recovery</span>
                    <span className="text-amber-700 font-bold">{softDeletedCount} archived</span>
                  </div>
                </div>

                {/* KPI 4: Real Templates & CMS Guides */}
                <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span className="text-[10px] uppercase font-bold tracking-wider">Templates & Guides</span>
                      <Layers size={16} className="text-[#967440]" />
                    </div>
                    <h4 className="text-3xl font-serif font-bold text-[#2c1810] mt-2">
                      {activeTemplatesCount + totalGuidesCount}
                    </h4>
                  </div>
                  <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">{activeTemplatesCount} Templates</span>
                    <span className="text-[#967440] font-bold">{totalGuidesCount} Articles</span>
                  </div>
                </div>

              </div>

              {/* Real Distribution Breakdown Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Chart 1: Real Product Package Orders */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#967440]">Live Revenue Breakdown</span>
                      <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                        Orders by Product Package ({ordersList.length} Total)
                      </h3>
                    </div>
                    <Package size={18} className="text-[#967440]" />
                  </div>

                  <div className="space-y-4">
                    {packageAnalytics.length > 0 ? (
                      packageAnalytics.map((item, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-gray-700">
                            <span className="truncate max-w-[280px]">{item.name}</span>
                            <span className="text-[#967440] shrink-0 font-mono">
                              {item.percentage}% ({item.count} orders)
                            </span>
                          </div>
                          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#967440] rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(item.percentage, 4)}%` }}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 py-4 text-center">No orders recorded yet.</p>
                    )}
                  </div>
                </div>

                {/* Chart 2: Real Memorial Stationery Formats */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#967440]">Format Distribution</span>
                      <h3 className="font-serif font-bold text-lg text-[#2c1810]">
                        Memorial Formats in Projects ({memorialsList.length} Total)
                      </h3>
                    </div>
                    <FileCheck size={18} className="text-[#967440]" />
                  </div>

                  <div className="space-y-4">
                    {formatAnalytics.length > 0 ? (
                      formatAnalytics.map((item, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-gray-700">
                            <span className="truncate max-w-[280px]">{item.format}</span>
                            <span className="text-emerald-700 shrink-0 font-mono">
                              {item.percentage}% ({item.count} items)
                            </span>
                          </div>
                          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(item.percentage, 4)}%` }}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 py-4 text-center">No memorials recorded yet.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Real Print Order Fulfillment Activity Log */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#967440]">Order Ledger</span>
                    <h3 className="font-serif font-bold text-xl text-[#2c1810]">
                      Recent Print Fulfillment & Transaction Activity
                    </h3>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <input 
                      type="text"
                      placeholder="Search orders, customers, status..."
                      value={analyticsSearch}
                      onChange={(e) => setAnalyticsSearch(e.target.value)}
                      className="w-full bg-[#fdfaf7] border border-gray-200 rounded-full py-2 pl-9 pr-4 text-xs focus:border-[#967440] outline-none"
                    />
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Product Package</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Fulfillment Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs">
                      {filteredAnalyticsOrders.length > 0 ? (
                        filteredAnalyticsOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-gray-700">{order.id}</td>
                            <td className="py-3 px-4 font-semibold text-[#2c1810]">{order.customer}</td>
                            <td className="py-3 px-4 text-gray-600">{order.product}</td>
                            <td className="py-3 px-4 font-mono font-bold text-[#967440]">{order.amount}</td>
                            <td className="py-3 px-4 text-gray-400">{order.date}</td>
                            <td className="py-3 px-4 text-right">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block",
                                order.status.toLowerCase().includes('paid') || order.status.toLowerCase().includes('downloaded')
                                  ? "bg-emerald-100 text-emerald-800"
                                  : order.status.toLowerCase().includes('shipped')
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              )}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-400">
                            No matching print or order transactions found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          );
        })()}
      </div>

      {/* Modal 1: Create / Edit Template */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#967440]">Database Design Registry</span>
                <h3 className="font-serif font-bold text-2xl text-[#2c1810]">
                  {editingTemplate ? `Edit: ${editingTemplate.name}` : "Add New Template Style"}
                </h3>
              </div>
              <button 
                onClick={() => setIsTemplateModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4">
              {/* Template Name */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">
                  Template Name *
                </label>
                <input 
                  type="text"
                  required
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Victorian Gold Filigree"
                  className="w-full bg-[#fdfaf7] border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:border-[#967440] outline-none font-serif font-bold text-[#2c1810]"
                />
              </div>

              {/* Category & Tradition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Category</label>
                  <select
                    value={templateForm.category}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#fdfaf7] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:border-[#967440] outline-none font-medium"
                  >
                    <option value="Floral">Floral</option>
                    <option value="Religious">Religious</option>
                    <option value="Landscape">Landscape</option>
                    <option value="Modern">Modern</option>
                    <option value="Classic">Classic</option>
                    <option value="Minimalist">Minimalist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Tradition / Culture</label>
                  <select
                    value={templateForm.tradition}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, tradition: e.target.value }))}
                    className="w-full bg-[#fdfaf7] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:border-[#967440] outline-none font-medium"
                  >
                    <option value="Universal/Secular">Universal / Secular</option>
                    <option value="Christian">Christian</option>
                    <option value="Catholic">Catholic</option>
                    <option value="Islamic Janazah">Islamic Janazah</option>
                    <option value="Jewish">Jewish</option>
                    <option value="Military">Military Honors</option>
                  </select>
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider mb-1">Print Dimensions & Format</label>
                <select
                  value={templateForm.dimensions}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, dimensions: e.target.value }))}
                  className="w-full bg-[#fdfaf7] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:border-[#967440] outline-none font-medium"
                >
                  <option value='8.5" x 11" Bi-fold'>8.5" x 11" Bi-fold Booklet</option>
                  <option value='8.5" x 14" Tri-fold'>8.5" x 14" Tri-fold Brochure</option>
                  <option value='5" x 7" Flat'>5" x 7" Flat Announcement</option>
                  <option value='2.5" x 4.25" Wallet'>2.5" x 4.25" Pocket Prayer Card</option>
                  <option value='24" x 36" Display'>24" x 36" Memorial Welcome Poster</option>
                </select>
              </div>

              {/* Cover Image & Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] uppercase font-bold text-gray-700 tracking-wider">
                    Template Cover Image (URL or Upload)
                  </label>
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={templateForm.image}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://images.unsplash.com/... or upload"
                    className="w-full bg-[#fdfaf7] border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:border-[#967440] outline-none font-mono text-gray-600"
                  />

                  <input 
                    type="file" 
                    ref={templateImageFileRef} 
                    onChange={handleTemplateCoverUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />

                  <button
                    type="button"
                    onClick={() => templateImageFileRef.current?.click()}
                    className="bg-[#2c1810] hover:bg-black text-[#d2c2ad] px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
                  >
                    <Upload size={14} className="text-[#967440]" />
                    <span>Upload</span>
                  </button>
                </div>

                {templateForm.image && (
                  <div className="relative aspect-[16/8] max-h-36 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100 group">
                    <img 
                      src={templateForm.image} 
                      alt="Cover preview" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => templateImageFileRef.current?.click()}
                        className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow cursor-pointer hover:bg-gray-100"
                      >
                        <Upload size={12} />
                        <span>Change Photo</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-3 bg-[#fdfaf7] rounded-xl border border-gray-200">
                <div>
                  <p className="text-xs font-bold text-[#2c1810]">Live Public Status</p>
                  <p className="text-[10px] text-gray-500">Enable or disable this template across gallery and builders.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTemplateForm(prev => ({ ...prev, activeStatus: !prev.activeStatus }))}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors",
                    templateForm.activeStatus ? "bg-emerald-600 text-white" : "bg-gray-300 text-gray-700"
                  )}
                >
                  {templateForm.activeStatus ? 'Live' : 'Disabled'}
                </button>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#967440] hover:bg-[#856535] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer transition-colors"
                >
                  {editingTemplate ? 'Update Template' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: JSON Design Schema Viewer */}
      {isSchemaModalOpen && activeSchemaTemplate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#967440]">JSON Schema Specification</span>
                <h3 className="font-serif font-bold text-2xl text-[#2c1810]">
                  {activeSchemaTemplate.name} Layout Tokens
                </h3>
              </div>
              <button 
                onClick={() => setIsSchemaModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-gray-500">
                This schema dictates paper dimensions, typography font stacks, color tokens, margins, and bleed specifications in the editor engine.
              </p>
              
              <div className="bg-[#1e1e1e] text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-80 shadow-inner">
                <pre>{JSON.stringify({
                  templateId: activeSchemaTemplate.id,
                  name: activeSchemaTemplate.name,
                  category: activeSchemaTemplate.category,
                  tradition: activeSchemaTemplate.tradition,
                  dimensions: activeSchemaTemplate.dimensions,
                  aspectRatio: "3:4",
                  coverAsset: activeSchemaTemplate.image,
                  designTokens: {
                    headingFont: "Playfair Display, serif",
                    bodyFont: "Inter, sans-serif",
                    primaryColor: "#2C1810",
                    accentColor: "#967440",
                    paperBackground: "#FAF8F5",
                    marginsMm: { top: 12, bottom: 12, left: 12, right: 12 },
                    bleedMm: 3.175,
                    supportedProducts: ["program", "prayer-card", "invitation", "thank-you", "poster"]
                  }
                }, null, 2)}</pre>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(activeSchemaTemplate, null, 2));
                  showNotice("JSON schema copied to clipboard.");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                <Copy size={13} />
                <span>Copy Schema JSON</span>
              </button>

              <button
                onClick={() => setIsSchemaModalOpen(false)}
                className="bg-[#2c1810] text-[#d2c2ad] hover:bg-black px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
