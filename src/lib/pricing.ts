import { useState, useEffect } from 'react';

export interface ProductPriceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number; // in USD (default $0.00)
  unit: string;
}

export const DEFAULT_PRICES: Record<string, ProductPriceItem> = {
  'program': {
    id: 'program',
    name: 'Funeral Programs (8.5" x 11" Bi-fold)',
    category: 'Service Booklets',
    description: '4-page bifold memorial booklet with order of service, photos, and obituary.',
    price: 0, // Default $0 as requested
    unit: 'per template'
  },
  'prayer': {
    id: 'prayer',
    name: 'Funeral Prayer Cards (2.5" x 4.25")',
    category: 'Keepsake Cards',
    description: 'Double-sided keepsake prayer card with portrait and favorite scripture/hymn.',
    price: 0, // Default $0
    unit: 'per template'
  },
  'poster': {
    id: 'poster',
    name: 'Memorial Posters & Welcome Signs (18" x 24" / 24" x 36")',
    category: 'Large Format Prints',
    description: 'High-resolution celebration of life easel welcome sign.',
    price: 0, // Default $0
    unit: 'per template'
  },
  'invitation': {
    id: 'invitation',
    name: 'Funeral Invitations & Announcements (5" x 7")',
    category: 'Announcements',
    description: 'Ceremony announcement card with service details and RSVP information.',
    price: 0, // Default $0
    unit: 'per template'
  },
  'thank-you': {
    id: 'thank-you',
    name: 'Memorial Thank You Cards (6" x 4")',
    category: 'Gratitude Cards',
    description: 'Warm acknowledgment note with family thank you message and photo.',
    price: 0, // Default $0
    unit: 'per template'
  },
  'single': {
    id: 'single',
    name: 'Single Template PDF Download',
    category: 'Checkout Plans',
    description: 'Full high-resolution print-ready 300 DPI PDF download for one product.',
    price: 0, // Default $0
    unit: 'per single order'
  },
  'bundle': {
    id: 'bundle',
    name: 'Complete Memorial Suite (All-in-One Bundle)',
    category: 'Checkout Plans',
    description: 'Complete stationery suite: Programs + Prayer Cards + Posters + Invitations + Thank You.',
    price: 0, // Default $0
    unit: 'per complete package'
  }
};

const STORAGE_KEY = 'ff_product_pricing_v1';
const EVENT_KEY = 'ff_pricing_updated';

// Read prices from localStorage or fallback to default $0.00
export function getStoredPrices(): Record<string, ProductPriceItem> {
  if (typeof window === 'undefined') return DEFAULT_PRICES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PRICES;
    const parsed = JSON.parse(raw);
    const result: Record<string, ProductPriceItem> = { ...DEFAULT_PRICES };
    
    Object.keys(DEFAULT_PRICES).forEach(key => {
      if (parsed[key] && typeof parsed[key].price === 'number') {
        result[key] = {
          ...DEFAULT_PRICES[key],
          price: Math.max(0, parsed[key].price)
        };
      }
    });
    return result;
  } catch (e) {
    return DEFAULT_PRICES;
  }
}

// Get specific price as a numeric value
export function getProductPrice(id: string): number {
  const prices = getStoredPrices();
  return prices[id]?.price ?? 0;
}

// Format price with dollar sign or "Free"
export function formatProductPrice(id: string): string {
  const price = getProductPrice(id);
  if (price === 0) return 'Free ($0)';
  return `$${price.toFixed(2)}`;
}

// Save all updated prices
export function saveProductPrices(prices: Record<string, ProductPriceItem>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prices));
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: prices }));
  } catch (e) {
    console.error('Failed to save prices to localStorage:', e);
  }
}

// Update a single product price
export function updateProductPrice(id: string, newPrice: number): void {
  const current = getStoredPrices();
  if (current[id]) {
    current[id] = {
      ...current[id],
      price: Math.max(0, Number(newPrice) || 0)
    };
    saveProductPrices(current);
  }
}

// Reset all prices to $0.00
export function resetAllPricesToFree(): void {
  const reset: Record<string, ProductPriceItem> = {};
  Object.keys(DEFAULT_PRICES).forEach(k => {
    reset[k] = { ...DEFAULT_PRICES[k], price: 0 };
  });
  saveProductPrices(reset);
}

// React Hook to subscribe to real-time price updates
export function usePricing() {
  const [prices, setPrices] = useState<Record<string, ProductPriceItem>>(getStoredPrices);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setPrices(customEvent.detail);
      } else {
        setPrices(getStoredPrices());
      }
    };

    window.addEventListener(EVENT_KEY, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(EVENT_KEY, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    prices,
    getPrice: (id: string) => prices[id]?.price ?? 0,
    formatPrice: (id: string) => {
      const p = prices[id]?.price ?? 0;
      if (p === 0) return 'Free ($0)';
      return `$${p.toFixed(2)}`;
    },
    updatePrice: (id: string, newPrice: number) => {
      updateProductPrice(id, newPrice);
      setPrices(getStoredPrices());
    },
    saveAllPrices: (newPrices: Record<string, ProductPriceItem>) => {
      saveProductPrices(newPrices);
      setPrices(newPrices);
    },
    resetAllToFree: () => {
      resetAllPricesToFree();
      setPrices(getStoredPrices());
    }
  };
}
