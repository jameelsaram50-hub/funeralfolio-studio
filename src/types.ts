
export interface MemorialData {
  id: string;
  name: string;
  dob: string;
  dod: string;
  serviceDetails: string;
  photoUrl: string | null;
  format: string;
  tagline?: string;
  notes?: string;
  obituaryType: "ready" | "guided" | "skip";
  obituaryText: string;
  orderOfService: string;
  poem: string;
  thankYouMessage: string;
  pallbearers: string;
  ushers: string;
  secondaryPhotoUrl: string;
  theme: string;
  themeId: string;
  createdAt: string;
  galleryPhotos?: string[];
  // Quiz New Fields
  birthPlace?: string;
  causeOfPassing?: string;
  parents?: string;
  precededBy?: string;
  survivors?: string;
  marriage?: string;
  education?: string;
  militaryService?: string;
  career?: string;
  organizations?: string;
  hobbies?: string;
  characteristics?: string;
  serviceDate?: string;
  serviceTime?: string;
  serviceVenue?: string;
  serviceAddress?: string;
  serviceLink?: string;
  isPrivate?: boolean;
  charityName?: string;
  donationLink?: string;
  memorialFund?: string;
  specialMessage?: string;
  userEmail?: string;
  posterSize?: string;
  posterMessage?: string;
  rsvpDetails?: string;
  thanksMessage?: string;
  lifeSummary?: string;
  officiant?: string;
  receptionDetails?: string;
  thanksSignature?: string;
  thanksCategory?: string;
  prayerSymbol?: string;
  posterLayoutSize?: string;
  obituaryBirth?: string;
  obituaryRelations?: string;
  obituaryCareer?: string;
  obituaryTone?: string;
  prayerTitle?: string;
  prayerText?: string;
  designPreviewUrl?: string;
  themeImage?: string;
}

export interface Tribute {
  id: string;
  author: string;
  message: string;
  date: string;
  type: 'MESSAGE' | 'CANDLE';
}

export type View = "LANDING" | "GALLERY" | "EDITOR" | "CHECKOUT" | "SUCCESS" | "MEMORIAL" | "RESOURCES";
export type PackageType = "DIGITAL" | "STANDARD" | "FULL";

// Editor.js JSON Block Data Schema
export interface EditorJsBlock {
  id?: string;
  type: string;
  data: Record<string, any>;
}

export interface EditorJsOutput {
  time?: number;
  blocks: EditorJsBlock[];
  version?: string;
}

export interface BlogPost {
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
  content: EditorJsOutput;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
