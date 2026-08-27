import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables or project fallback
export const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://zpcgpdsydpzpfpheorkl.supabase.co';
export const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HaPvhliGNX3fuhXIznhk-g_887G2IZ1';

// Data types
export interface MemorialRecord {
  id: string;
  user_id?: string;
  name: string;
  birth_date?: string;
  death_date?: string;
  birth_place?: string;
  service_date?: string;
  service_location?: string;
  biography?: string;
  photo_url?: string;
  theme_color?: string;
  format?: string;
  status: 'Draft' | 'Active' | 'Soft-Deleted';
  created_at: string;
  updated_at?: string;
}

export interface ObituaryRecord {
  id: string;
  memorial_id?: string;
  user_id?: string;
  person_name: string;
  tone: string;
  faith?: string;
  content: string;
  is_published: boolean;
  created_at: string;
}

export interface CondolenceRecord {
  id: string;
  memorial_id: string;
  guest_name: string;
  message: string;
  relationship?: string;
  candle_lit?: boolean;
  created_at: string;
}

export interface OrderRecord {
  id: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  package_name: string;
  amount: number;
  status: 'Pending' | 'Paid' | 'In Production' | 'Shipped';
  tracking_number?: string;
  download_url?: string;
  created_at: string;
}

export interface BlogPostRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  author_role: string;
  date: string;
  read_time: string;
  category: string;
  featured_image: string;
  content: {
    time?: number;
    blocks: Array<{
      id?: string;
      type: string;
      data: Record<string, any>;
    }>;
    version?: string;
  };
  is_published: boolean;
  created_at: string;
  updated_at?: string;
}

// Check if credentials are actively configured
export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(SUPABASE_URL) &&
    Boolean(SUPABASE_ANON_KEY) &&
    !SUPABASE_ANON_KEY.includes('placeholder')
  );
};

// Lazy Supabase client initialization
let _supabase: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!_supabase && isSupabaseConfigured()) {
    try {
      _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      _supabase = null;
    }
  }
  return _supabase;
};

// -------------------------------------------------------------
// Database Helper Services (with offline / local fallback)
// -------------------------------------------------------------

// Local storage cache keys
const STORAGE_KEYS = {
  MEMORIALS: 'ff_memorials_cache',
  OBITUARIES: 'ff_obituaries_cache',
  CONDOLENCES: 'ff_condolences_cache',
  ORDERS: 'ff_orders_cache',
  BLOG_POSTS: 'ff_blog_posts_editorjs_cache',
};

// Helper to get local data
const getLocal = <T>(key: string, fallback: T[]): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

// Helper to set local data
const setLocal = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

// 1. Memorials API
export const memorialService = {
  async getAll(): Promise<MemorialRecord[]> {
    const client = getSupabase();
    if (client) {
      const { data, error } = await client
        .from('memorials')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return getLocal<MemorialRecord>(STORAGE_KEYS.MEMORIALS, []);
  },

  async save(memorial: Partial<MemorialRecord>): Promise<MemorialRecord> {
    const newRecord: MemorialRecord = {
      id: memorial.id || `mem-${Date.now()}`,
      name: memorial.name || 'Untitled Memorial',
      birth_date: memorial.birth_date,
      death_date: memorial.death_date,
      birth_place: memorial.birth_place,
      service_date: memorial.service_date,
      service_location: memorial.service_location,
      biography: memorial.biography,
      photo_url: memorial.photo_url,
      theme_color: memorial.theme_color || '#1e293b',
      format: memorial.format || 'Bi-fold Program',
      status: memorial.status || 'Active',
      created_at: memorial.created_at || new Date().toISOString(),
    };

    const client = getSupabase();
    if (client) {
      const { data, error } = await client
        .from('memorials')
        .upsert(newRecord)
        .select()
        .single();
      if (!error && data) return data;
    }

    const current = getLocal<MemorialRecord>(STORAGE_KEYS.MEMORIALS, []);
    const filtered = current.filter((m) => m.id !== newRecord.id);
    setLocal(STORAGE_KEYS.MEMORIALS, [newRecord, ...filtered]);
    return newRecord;
  },

  async delete(id: string): Promise<boolean> {
    const client = getSupabase();
    if (client) {
      await client.from('memorials').delete().eq('id', id);
    }
    const current = getLocal<MemorialRecord>(STORAGE_KEYS.MEMORIALS, []);
    setLocal(STORAGE_KEYS.MEMORIALS, current.filter((m) => m.id !== id));
    return true;
  },
};

// 2. Obituaries API
export const obituaryService = {
  async getAll(): Promise<ObituaryRecord[]> {
    const client = getSupabase();
    if (client) {
      const { data, error } = await client
        .from('obituaries')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return getLocal<ObituaryRecord>(STORAGE_KEYS.OBITUARIES, []);
  },

  async save(record: Partial<ObituaryRecord>): Promise<ObituaryRecord> {
    const newRecord: ObituaryRecord = {
      id: record.id || `obit-${Date.now()}`,
      memorial_id: record.memorial_id,
      person_name: record.person_name || 'Loved One',
      tone: record.tone || 'Heartfelt & Celebrating Life',
      faith: record.faith || 'Non-religious / Secular',
      content: record.content || '',
      is_published: record.is_published ?? true,
      created_at: record.created_at || new Date().toISOString(),
    };

    const client = getSupabase();
    if (client) {
      const { data, error } = await client
        .from('obituaries')
        .upsert(newRecord)
        .select()
        .single();
      if (!error && data) return data;
    }

    const current = getLocal<ObituaryRecord>(STORAGE_KEYS.OBITUARIES, []);
    const filtered = current.filter((o) => o.id !== newRecord.id);
    setLocal(STORAGE_KEYS.OBITUARIES, [newRecord, ...filtered]);
    return newRecord;
  },
};

// 3. Condolences / Guestbook API
export const condolenceService = {
  async getByMemorial(memorialId: string): Promise<CondolenceRecord[]> {
    const client = getSupabase();
    if (client) {
      const { data, error } = await client
        .from('condolences')
        .select('*')
        .eq('memorial_id', memorialId)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    const all = getLocal<CondolenceRecord>(STORAGE_KEYS.CONDOLENCES, []);
    return all.filter((c) => c.memorial_id === memorialId || memorialId === 'default');
  },

  async add(record: Omit<CondolenceRecord, 'id' | 'created_at'>): Promise<CondolenceRecord> {
    const newRecord: CondolenceRecord = {
      ...record,
      id: `c-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    const client = getSupabase();
    if (client) {
      const { data, error } = await client
        .from('condolences')
        .insert(newRecord)
        .select()
        .single();
      if (!error && data) return data;
    }

    const current = getLocal<CondolenceRecord>(STORAGE_KEYS.CONDOLENCES, []);
    setLocal(STORAGE_KEYS.CONDOLENCES, [newRecord, ...current]);
    return newRecord;
  },
};

// 4. Orders API
export const orderService = {
  async getAll(): Promise<OrderRecord[]> {
    const client = getSupabase();
    if (client) {
      const { data, error } = await client
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return getLocal<OrderRecord>(STORAGE_KEYS.ORDERS, []);
  },

  async create(order: Omit<OrderRecord, 'id' | 'created_at'>): Promise<OrderRecord> {
    const newOrder: OrderRecord = {
      ...order,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString(),
    };

    const client = getSupabase();
    if (client) {
      const { data, error } = await client
        .from('orders')
        .insert(newOrder)
        .select()
        .single();
      if (!error && data) return data;
    }

    const current = getLocal<OrderRecord>(STORAGE_KEYS.ORDERS, []);
    setLocal(STORAGE_KEYS.ORDERS, [newOrder, ...current]);
    return newOrder;
  },
};

// 5. Blog Posts & Articles API (Editor.js Clean JSON Blocks with E-E-A-T Architecture)
export const DEFAULT_EDITORJS_POSTS: BlogPostRecord[] = [
  {
    id: 'how-to-create-a-funeral-program',
    slug: 'how-to-create-a-funeral-program',
    title: 'How to Create a Funeral Program: Step-by-Step Practical Guide',
    excerpt: 'A complete walkthrough on designing a dignified order of service booklet, comparing paper weights, organizing readings, and printing without last-minute stress.',
    author: 'Julia Eskin',
    author_role: 'Senior Memorial Director & Liturgical Counselor',
    date: 'August 14, 2026',
    read_time: '6 min read',
    category: 'Guides',
    featured_image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
    is_published: true,
    created_at: '2026-08-14T10:00:00Z',
    content: {
      time: 1723630000000,
      version: '2.30.8',
      blocks: [
        {
          id: 'b1',
          type: 'paragraph',
          data: {
            text: 'When preparing a memorial service, designing the funeral program is often one of the most personal tasks you will take on. This guide walks you through every step — from gathering photos to choosing paper weights — so you can create a lasting tribute without unnecessary stress.'
          }
        },
        {
          id: 'b2',
          type: 'quote',
          data: {
            text: 'A funeral program is more than a schedule of events; it is a tangible keepsake that family and friends hold in their hands and cherish for years to come.',
            caption: 'Bereavement Care Insight'
          }
        },
        {
          id: 'b3',
          type: 'header',
          data: {
            text: 'Key Elements of a 4-Page Funeral Program',
            level: 2
          }
        },
        {
          id: 'b4',
          type: 'paragraph',
          data: {
            text: 'Most traditional funeral programs follow a classic 4-page bi-fold structure (a single 8.5" x 11" sheet folded in half). Here is what belongs on each page:'
          }
        },
        {
          id: 'b5',
          type: 'list',
          data: {
            style: 'unordered',
            items: [
              '<b>Cover Page:</b> Full name, life dates (birth & passing), a clear portrait photo, and an opening scripture or meaningful quote.',
              '<b>Page 2 (The Obituary):</b> A thoughtful 200–400 word life story highlighting their family roots, career passions, hobbies, and surviving loved ones.',
              '<b>Page 3 (Order of Service):</b> The chronological flow of the ceremony including musical preludes, prayers, scripture readings, eulogies, and the benediction.',
              '<b>Back Cover:</b> Words of gratitude from the family, list of pallbearers, details for the reception/repast, and a memory photo collage.'
            ]
          }
        },
        {
          id: 'b6',
          type: 'header',
          data: {
            text: 'Choosing the Right Format & Paper Weight',
            level: 2
          }
        },
        {
          id: 'b7',
          type: 'paragraph',
          data: {
            text: 'Paper choice makes a noticeable difference in how the booklet feels in your guests’ hands. Here is a practical comparison of the most common options:'
          }
        },
        {
          id: 'b8',
          type: 'table',
          data: {
            withHeadings: true,
            content: [
              ['Format / Paper Stock', 'Best Used For', 'Sheet Size', 'Print Recommendation'],
              ['80 lb Matte Text', 'Standard Bi-Fold Booklets', '8.5" x 11"', 'Crisp photos, zero glare, easy folding'],
              ['100 lb Satin / Gloss', 'Full-Color Photo Programs', '8.5" x 11"', 'Vibrant color reproduction & rich portraits'],
              ['65 lb Cardstock', 'Single-Sheet Double-Sided', '8.5" x 11"', 'Sturdier feel, ideal for outdoor services'],
              ['8.5" x 14" Tri-Fold', 'Long Liturgical Services', '8.5" x 14"', 'Extra space for complete song lyrics & poems']
            ]
          }
        },
        {
          id: 'b9',
          type: 'header',
          data: {
            text: 'Step-by-Step Program Preparation Checklist',
            level: 2
          }
        },
        {
          id: 'b10',
          type: 'checklist',
          data: {
            items: [
              { text: 'Confirm the order of service events with your officiant or pastor', checked: true },
              { text: 'Select a high-resolution 300 DPI portrait photo for the front cover', checked: true },
              { text: 'Verify the spelling of all family members, pallbearers, and speakers', checked: false },
              { text: 'Gather 4 to 6 photos for the back cover memory collage', checked: false },
              { text: 'Download print-ready 300 DPI PDF and test print one sample copy at home', checked: false },
              { text: 'Order prints at least 24 to 48 hours before the service date', checked: false }
            ]
          }
        },
        {
          id: 'b11',
          type: 'header',
          data: {
            text: 'Next Steps: Begin Your Tribute',
            level: 2
          }
        },
        {
          id: 'b12',
          type: 'paragraph',
          data: {
            text: 'You do not need graphic design experience to create a beautiful funeral booklet. Explore our curated program templates to customize your layout online and download print-ready files instantly.'
          }
        }
      ]
    }
  },
  {
    id: 'how-to-write-a-meaningful-obituary',
    slug: 'how-to-write-a-meaningful-obituary',
    title: 'How to Write a Heartfelt Obituary with Dignity & Grace',
    excerpt: 'A compassionate guide to writing a memorable obituary, including opening announcements, biographical highlights, surviving relatives, and service information.',
    author: 'Julia Eskin',
    author_role: 'Memorial Historian & Writer',
    date: 'August 8, 2026',
    read_time: '5 min read',
    category: 'Writing',
    featured_image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1200&auto=format&fit=crop',
    is_published: true,
    created_at: '2026-08-08T11:00:00Z',
    content: {
      time: 1723110000000,
      version: '2.30.8',
      blocks: [
        {
          id: 'b1',
          type: 'paragraph',
          data: {
            text: 'Writing an obituary during a time of loss can feel daunting. You want to honor a full life in just a few paragraphs. This guide provides a simple, structured approach to help you write with clarity, warmth, and heartfelt accuracy.'
          }
        },
        {
          id: 'b2',
          type: 'header',
          data: {
            text: 'The 5 Core Sections of a Traditional Obituary',
            level: 2
          }
        },
        {
          id: 'b3',
          type: 'table',
          data: {
            withHeadings: true,
            content: [
              ['Section', 'What to Include', 'Example Phrasing'],
              ['1. The Announcement', 'Full name, age, city of residence, date of passing', '"Mary Jane Smith, 84, of Austin, Texas, passed away peacefully on August 10, 2026."'],
              ['2. Life & Education', 'Birth place, schooling, career, military honors', '"Born in Denver, Mary graduated from CU Boulder and dedicated 35 years to teaching elementary school."'],
              ['3. Passions & Legacy', 'Hobbies, character traits, volunteering, faith', '"Known for her vibrant garden, quick wit, and selfless devotion to community volunteering."'],
              ['4. Family Members', 'Preceded in death and surviving relatives', '"Survived by her devoted husband Robert, children Sarah and David, and four grandchildren."'],
              ['5. Service & Memorials', 'Date, time, location, reception, memorial fund', '"Services will be held Saturday at 11 AM at Grace Chapel. Memorial donations to the Hospice Fund."']
            ]
          }
        },
        {
          id: 'b4',
          type: 'header',
          data: {
            text: 'Common Questions & Practical Advice',
            level: 2
          }
        },
        {
          id: 'b5',
          type: 'quote',
          data: {
            text: 'Focus on what brought them genuine joy — their laughter, their favorite sayings, or their quiet kindness — rather than simply listing dates and awards.',
            caption: 'Writing from the Heart'
          }
        },
        {
          id: 'b6',
          type: 'checklist',
          data: {
            items: [
              { text: 'Check spelling of all family members, grandchildren, and in-laws', checked: true },
              { text: 'Confirm exact church or chapel street address and service time', checked: true },
              { text: 'Include specific charity or memorial fund details if requested', checked: false },
              { text: 'Have a family member review the draft before publishing online', checked: false }
            ]
          }
        },
        {
          id: 'b7',
          type: 'header',
          data: {
            text: 'Next Steps: Write Your Draft in Minutes',
            level: 2
          }
        },
        {
          id: 'b8',
          type: 'paragraph',
          data: {
            text: 'If you need help getting started, our guided AI obituary writer asks gentle step-by-step questions and crafts a polished, heartfelt draft ready for print and online sharing.'
          }
        }
      ]
    }
  },
  {
    id: 'meaningful-scriptures-and-poems',
    slug: 'meaningful-scriptures-and-poems',
    title: 'Comforting Scriptures & Poems for Funeral Cards and Programs',
    excerpt: 'A curated collection of biblical passages, traditional blessings, and classic memorial poetry for prayer cards, programs, and eulogies.',
    author: 'Father Thomas Sterling',
    author_role: 'Interfaith Chaplain & Counselor',
    date: 'August 10, 2026',
    read_time: '7 min read',
    category: 'Inspiration',
    featured_image: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1200&auto=format&fit=crop',
    is_published: true,
    created_at: '2026-08-10T14:30:00Z',
    content: {
      time: 1723290000000,
      version: '2.30.8',
      blocks: [
        {
          id: 'b1',
          type: 'paragraph',
          data: {
            text: 'Finding the right words to express grief and hope is never easy. Whether you are selecting a verse for a memorial prayer card or choosing a reading for the service, these timeless scriptures and poems offer peace and comfort.'
          }
        },
        {
          id: 'b2',
          type: 'header',
          data: {
            text: 'Beloved Biblical Scriptures',
            level: 2
          }
        },
        {
          id: 'b3',
          type: 'quote',
          data: {
            text: 'The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul.',
            caption: 'Psalm 23:1-3'
          }
        },
        {
          id: 'b4',
          type: 'quote',
          data: {
            text: 'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.',
            caption: 'John 14:27'
          }
        },
        {
          id: 'b5',
          type: 'header',
          data: {
            text: 'Traditional Secular & Remembrance Poetry',
            level: 2
          }
        },
        {
          id: 'b6',
          type: 'quote',
          data: {
            text: 'Do not stand at my grave and weep; I am not there, I do not sleep. I am a thousand winds that blow, I am the diamond glints on snow, I am the sunlight on ripened grain, I am the gentle autumn rain.',
            caption: 'Mary Elizabeth Frye (1932)'
          }
        },
        {
          id: 'b7',
          type: 'quote',
          data: {
            text: 'May the road rise up to meet you. May the wind be always at your back. May the sun shine warm upon your face; the rains fall soft upon your fields and until we meet again, may God hold you in the palm of His hand.',
            caption: 'Traditional Irish Blessing'
          }
        },
        {
          id: 'b8',
          type: 'header',
          data: {
            text: 'How to Choose the Right Verse for Your Card',
            level: 2
          }
        },
        {
          id: 'b9',
          type: 'table',
          data: {
            withHeadings: true,
            content: [
              ['Card Type', 'Recommended Text Length', 'Popular Choices'],
              ['Prayer Card (2.5x4.25")', '50 – 90 words', 'Psalm 23, Irish Blessing, Prayer of St. Francis'],
              ['Funeral Program Cover', '15 – 35 words', 'Short scripture, single poignant stanza'],
              ['Thank You Card (4x6")', '20 – 50 words', 'Words of appreciation & comfort'],
              ['Memorial Poster (18x24")', '10 – 25 words', 'Inspiring life motto or favorite quote']
            ]
          }
        },
        {
          id: 'b10',
          type: 'checklist',
          data: {
            items: [
              { text: 'Consider your loved one’s personal faith and spiritual preferences', checked: true },
              { text: 'Ensure the verse length fits comfortably within the card frame', checked: true },
              { text: 'Coordinate matching typography across your prayer cards and booklets', checked: false }
            ]
          }
        }
      ]
    }
  }
];

export const blogPostService = {
  async getAll(): Promise<BlogPostRecord[]> {
    const client = getSupabase();
    if (client) {
      const { data, error } = await client
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    }
    return getLocal<BlogPostRecord>(STORAGE_KEYS.BLOG_POSTS, DEFAULT_EDITORJS_POSTS);
  },

  async getBySlug(slug: string): Promise<BlogPostRecord | null> {
    const client = getSupabase();
    if (client) {
      const { data, error } = await client
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) return data;
    }
    const all = getLocal<BlogPostRecord>(STORAGE_KEYS.BLOG_POSTS, DEFAULT_EDITORJS_POSTS);
    return all.find((p) => p.slug === slug) || null;
  },

  async save(post: Partial<BlogPostRecord>): Promise<BlogPostRecord> {
    const slug = post.slug || (post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `post-${Date.now()}`);
    const newRecord: BlogPostRecord = {
      id: post.id || `post-${Date.now()}`,
      slug: slug,
      title: post.title || 'Untitled Article',
      excerpt: post.excerpt || '',
      author: post.author || 'FuneralFolio Editorial Team',
      author_role: post.author_role || 'Senior Memorial Specialist',
      date: post.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      read_time: post.read_time || '5 min read',
      category: post.category || 'Guides',
      featured_image: post.featured_image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
      content: post.content || { time: Date.now(), blocks: [], version: '2.30.8' },
      is_published: post.is_published ?? true,
      created_at: post.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const client = getSupabase();
    if (client) {
      const { data, error } = await client
        .from('blog_posts')
        .upsert(newRecord)
        .select()
        .single();
      if (!error && data) return data;
    }

    const current = getLocal<BlogPostRecord>(STORAGE_KEYS.BLOG_POSTS, DEFAULT_EDITORJS_POSTS);
    const filtered = current.filter((p) => p.id !== newRecord.id && p.slug !== newRecord.slug);
    setLocal(STORAGE_KEYS.BLOG_POSTS, [newRecord, ...filtered]);
    return newRecord;
  },

  async delete(id: string): Promise<boolean> {
    const client = getSupabase();
    if (client) {
      await client.from('blog_posts').delete().eq('id', id);
    }
    const current = getLocal<BlogPostRecord>(STORAGE_KEYS.BLOG_POSTS, DEFAULT_EDITORJS_POSTS);
    setLocal(STORAGE_KEYS.BLOG_POSTS, current.filter((p) => p.id !== id));
    return true;
  },
};

export interface TemplateRecord {
  id: string;
  title: string;
  category: string;
  tradition?: string;
  description?: string;
  thumbnail_url?: string;
  dimensions?: string;
  created_at?: string;
}

export const templateService = {
  async getAll(): Promise<TemplateRecord[]> {
    const client = getSupabase();
    if (client) {
      const { data, error } = await client
        .from('templates')
        .select('*')
        .order('title', { ascending: true });
      if (!error && data && data.length > 0) return data;
    }
    return [];
  },

  async save(record: Partial<TemplateRecord>): Promise<TemplateRecord> {
    const newRecord: TemplateRecord = {
      id: record.id || `tmpl-${Date.now()}`,
      title: record.title || 'Custom Template',
      category: record.category || 'Floral',
      tradition: record.tradition || 'Universal/Secular',
      description: record.description || '',
      thumbnail_url: record.thumbnail_url || 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop',
      dimensions: record.dimensions || '8.5" x 11" Bi-fold',
      created_at: record.created_at || new Date().toISOString(),
    };

    const client = getSupabase();
    if (client) {
      const { data, error } = await client
        .from('templates')
        .upsert(newRecord)
        .select()
        .single();
      if (!error && data) return data;
    }
    return newRecord;
  },

  async delete(id: string): Promise<boolean> {
    const client = getSupabase();
    if (client) {
      await client.from('templates').delete().eq('id', id);
      return true;
    }
    return false;
  }
};

