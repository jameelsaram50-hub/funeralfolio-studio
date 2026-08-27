
export interface Template {
  id: string;
  name: string;
  image: string;
  category: string;
}

export const TEMPLATES: Template[] = [
  { id: "watercolor-roses", name: "Watercolor Roses", image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop", category: "Floral" },
  { id: "ocean-sunset", name: "Ocean Sunset", image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=800&auto=format&fit=crop", category: "Modern" },
  { id: "victorian-lace", name: "Victorian Lace", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop", category: "Classic" },
  { id: "cherry-blossoms", name: "Cherry Blossoms", image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=800&auto=format&fit=crop", category: "Floral" },
  { id: "mountain-serenity", name: "Mountain Serenity", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop", category: "Nature" },
  { id: "sacred-cross", name: "Sacred Cross", image: "https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=800&auto=format&fit=crop", category: "Religious" },
  { id: "autumn-leaves", name: "Autumn Leaves", image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=800&auto=format&fit=crop", category: "Nature" },
  { id: "wisteria-garden", name: "Wisteria Garden", image: "https://images.unsplash.com/photo-1516528387618-afa90b13e000?q=80&w=800&auto=format&fit=crop", category: "Floral" },
  { id: "serene-cloud-lake", name: "Serene Cloud Lake", image: "https://images.unsplash.com/photo-1439853949127-fa647821eba0?q=80&w=800&auto=format&fit=crop", category: "Nature" },
  { id: "monochrome-botanical", name: "Monochrome Botanical", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800&auto=format&fit=crop", category: "Classic" },
  { id: "blue-eucalyptus", name: "Blue Eucalyptus Grace", image: "https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?q=80&w=800&auto=format&fit=crop", category: "Floral" },
  { id: "seafoam-serenity", name: "Seafoam Serenity", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop", category: "Modern" },
  { id: "golden-meadow", name: "Golden Meadow Arch", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop", category: "Nature" },
  { id: "peaceful-meadow", name: "Peaceful Meadow", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop", category: "Nature" },
  { id: "lavender-serenity", name: "Lavender Serenity", image: "https://images.unsplash.com/photo-1471958680802-1345a694ba6d?q=80&w=800&auto=format&fit=crop", category: "Floral" },
  { id: "floral-serenity", name: "Floral Serenity", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800&auto=format&fit=crop", category: "Floral" },
  { id: "iris-serenity", name: "Iris Serenity", image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=800&auto=format&fit=crop", category: "Floral" },
  { id: "lemon-grove", name: "Lemon Grove", image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop", category: "Nature" },
  { id: "nocturne-skies", name: "Nocturne Skies", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop", category: "Modern" },
  { id: "misty-horizon", name: "Misty Horizon", image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=800&auto=format&fit=crop", category: "Nature" },
  { id: "amethyst-remembrance", name: "Amethyst Remembrance", image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=800&auto=format&fit=crop", category: "Modern" },
  { id: "marble-serenity", name: "Marble Serenity", image: "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?q=80&w=800&auto=format&fit=crop", category: "Modern" },
  { id: "serene-remembrance", name: "Serene Remembrance", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop", category: "Nature" },
  { id: "verdant-vista", name: "Verdant Vista", image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=800&auto=format&fit=crop", category: "Nature" },
  { id: "sunset-serenity", name: "Sunset Serenity", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop", category: "Nature" },
  { id: "rose-garden", name: "Rose Garden", image: "https://images.unsplash.com/photo-1496062031456-07b8f162a322?q=80&w=800&auto=format&fit=crop", category: "Floral" },
  { id: "subtle-path", name: "A Subtle Glowing Path", image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800&auto=format&fit=crop", category: "Nature" },
  { id: "mountain-lake", name: "A Peaceful Mountain Lake", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop", category: "Nature" },
  { id: "rustic-remembrance", name: "Rustic Remembrance", image: "https://images.unsplash.com/photo-1445510861639-5651173bc5d5?q=80&w=800&auto=format&fit=crop", category: "Classic" },
  { id: "magnolia-serenity", name: "Magnolia Serenity", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop", category: "Floral" },
  { id: "lily-cross", name: "Lily Cross Memorial", image: "https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=800&auto=format&fit=crop", category: "Religious" },
  { id: "lavender-remembrance", name: "Lavender Remembrance", image: "https://images.unsplash.com/photo-1471958680802-1345a694ba6d?q=80&w=800&auto=format&fit=crop", category: "Floral" },
  { id: "skyward-serenity", name: "Skyward Serenity", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop", category: "Nature" },
  { id: "golden-serenity", name: "Golden Serenity", image: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=800&auto=format&fit=crop", category: "Modern" },
  { id: "crimson-sunset", name: "Crimson Sunset", image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=800&auto=format&fit=crop", category: "Nature" },
  { id: "twilight-mountains", name: "Twilight Mountains", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop", category: "Nature" },
  { id: "delicate-watercolor", name: "A Delicate Watercolor", image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop", category: "Classic" },
  { id: "blue-blossom", name: "Blue Blossom Chintz", image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=800&auto=format&fit=crop", category: "Floral" },
  { id: "bright-red-watercolor", name: "Bright Red Watercolor", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800&auto=format&fit=crop", category: "Floral" },
  { id: "white-roses", name: "White Roses", image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop", category: "Floral" }
];

export interface ObituarySummary {
  name: string;
  dates: string;
  posted: string;
}

export const RECENT_OBITUARIES: ObituarySummary[] = [
  { name: "Bailey Marie Bryce", dates: "October 31, 1997 – May 3, 2026", posted: "Posted May 15, 2026" },
  { name: "Michael Watson", dates: "November 8, 1959 – May 5, 2026", posted: "Posted May 15, 2026" },
  { name: "Lennie Small", dates: "February 5, 1930 – October 21, 1963", posted: "Posted May 15, 2026" },
  { name: "Dorothy Y. Brady", dates: "August 9, 1957 – May 8, 2026", posted: "Posted May 15, 2026" },
  { name: "William (Bill) J Tidswell Jr", dates: "November 24, 1959 – May 6, 2026", posted: "Posted May 15, 2026" },
  { name: "Tracie Renee Reinert", dates: "December 13, 1971 – April 13, 2026", posted: "Posted May 15, 2026" },
  { name: "Tyrese Blackman", dates: "May 23, 1995 – May 1, 2026", posted: "Posted May 15, 2026" },
  { name: "Bobby Ray Edmondson", dates: "August 7, 1958 – May 12, 2026", posted: "Posted May 15, 2026" },
  { name: "Norman E. Dierkes", dates: "July 1, 1949 – May 14, 2026", posted: "Posted May 15, 2026" },
  { name: "Kere Hedrick", dates: "July 21, 1971 – October 10, 2025", posted: "Posted May 15, 2026" },
  { name: "Paul Yates", dates: "November 8, 1955 – May 13, 2026", posted: "Posted May 15, 2026" }
];


export interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

export const ARTICLES: Article[] = [
  {
    id: "funeral-slideshow",
    title: "Funeral Slideshow: How to Create a Moving Photo Tribute",
    excerpt: "Helpful guides and articles for planning memorial services and honoring loved ones",
    author: "Julia Eskin",
    date: "March 31, 2026",
    image: "https://images.unsplash.com/photo-1492176273113-2d51f47b23b0?q=80&w=1200&auto=format&fit=crop",
    category: "Guides"
  },
  {
    id: "obituary-mother",
    title: "Example of Obituary for Mother",
    excerpt: "Heartfelt obituary examples for a mother, with templates and writing guidance to help you honor...",
    author: "Julia Eskin",
    date: "March 10, 2026",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop",
    category: "Examples"
  },
  {
    id: "obituary-father",
    title: "Obituary Quotes for Father",
    excerpt: "A collection of meaningful obituary quotes for fathers, from heartfelt and traditional to short and...",
    author: "Julia Eskin",
    date: "March 5, 2026",
    image: "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?q=80&w=800&auto=format&fit=crop",
    category: "Quotes"
  },
  {
    id: "thank-you-notes-loss",
    title: "Examples of Thank You Notes After Loss",
    excerpt: "Helpful templates and examples for writing thank you notes to friends and family after a loss.",
    author: "FuneralFolio Team",
    date: "April 6, 2025",
    image: "https://images.unsplash.com/photo-1520004434532-668416a08753?q=80&w=800&auto=format&fit=crop",
    category: "Etiquette"
  },
  {
    id: "funeral-text-examples",
    title: "Funeral Text Examples: Creating Meaningful Tributes",
    excerpt: "Choose from a variety of funeral text examples to create a tribute that truly honors your loved one.",
    author: "FuneralFolio Team",
    date: "April 5, 2025",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800&auto=format&fit=crop",
    category: "Guides"
  },
  {
    id: "memorial-thanks-tips",
    title: "10 Tips for Writing Memorial Service Thank You Notes",
    excerpt: "Practical advice on how to express your gratitude during a difficult time with these 10 simple tips.",
    author: "FuneralFolio Team",
    date: "April 4, 2025",
    image: "https://images.unsplash.com/photo-1516528387618-afa90b13e000?q=80&w=800&auto=format&fit=crop",
    category: "Etiquette"
  },
  {
    id: "funeral-prayer-guidance",
    title: "Prayer for a Funeral Program: Examples & Guidance",
    excerpt: "Find comfort and inspiration with our collection of prayers and guidance for your funeral program.",
    author: "FuneralFolio Team",
    date: "April 3, 2025",
    image: "https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=800&auto=format&fit=crop",
    category: "Religious"
  },
  {
    id: "how-to-thank-you-cards",
    title: "How to Create Meaningful Thank U Cards for Funerals",
    excerpt: "A step-by-step guide to creating cards that convey your heartfelt thanks to friends and family.",
    author: "Julia Eskin",
    date: "April 2, 2025",
    image: "https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?q=80&w=800&auto=format&fit=crop",
    category: "Guides"
  },
  {
    id: "design-struggles-templates",
    title: "Struggling with Funeral Program Design? Easy Templates That Comfort and Honor",
    excerpt: "Discover how easy it can be to design a beautiful program with our professionally designed templates.",
    author: "Julia Eskin",
    date: "February 23, 2025",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
    category: "Design"
  },
  {
    id: "personalized-memorial-legacy",
    title: "Creating a Personalized Memorial: Honoring Your Loved One's Legacy",
    excerpt: "Learn how to create a memorial that truly reflects the unique life and legacy of your loved one.",
    author: "Julia Eskin",
    date: "February 22, 2025",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop",
    category: "Inspiration"
  },
  {
    id: "thoughtful-itinerary",
    title: "Creating a Thoughtful Funeral Itinerary: A Guide to Honoring Your Loved One",
    excerpt: "A comprehensive guide to planning a meaningful itinerary for a funeral or memorial service.",
    author: "Julia Eskin",
    date: "February 21, 2025",
    image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=800&auto=format&fit=crop",
    category: "Guides"
  },
  {
    id: "printed-thanks-gratitude",
    title: "Printed Funeral Thank You Cards: A Thoughtful Way to Express Gratitude",
    excerpt: "Explore the benefits of printed thank you cards and how they can help you express your thanks clearly.",
    author: "Julia Eskin",
    date: "February 20, 2025",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=800&auto=format&fit=crop",
    category: "Etiquette"
  }
];
