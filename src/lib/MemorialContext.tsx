
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MemorialData, Tribute } from '../types';

interface MemorialContextType {
  memorialData: MemorialData;
  updateData: (updates: Partial<MemorialData>) => void;
  resetData: () => void;
  tributes: Tribute[];
  addTribute: (tribute: Omit<Tribute, 'id' | 'date'>) => void;
  setAllTributes: (tributes: Tribute[]) => void;
}

const initialData: MemorialData = {
  id: "j-k7my",
  name: "JOHN",
  dob: "",
  dod: "",
  serviceDetails: "",
  photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
  format: "card",
  obituaryType: "guided",
  obituaryText: "",
  orderOfService: "",
  poem: "",
  thankYouMessage: "The family wishes to express their deep appreciation for the many expressions of love, concern, and kindness shown to them during this hour of bereavement.",
  pallbearers: "",
  ushers: "",
  secondaryPhotoUrl: "",
  theme: "Cherry Blossoms",
  themeId: "cherry-blossoms",
  createdAt: new Date().toISOString(),
  galleryPhotos: [],
};

const MOCK_TRIBUTES: Tribute[] = [
  { id: '1', author: 'Sarah Miller', message: 'John was such a wonderful soul. He will be deeply missed by everyone who knew him.', date: 'May 12, 2026', type: 'MESSAGE' },
  { id: '2', author: 'David Wilson', message: 'Rest in peace, dear friend.', date: 'May 13, 2026', type: 'CANDLE' },
];

const MemorialContext = createContext<MemorialContextType | undefined>(undefined);

export function MemorialProvider({ children }: { children: ReactNode }) {
  const [memorialData, setMemorialData] = useState<MemorialData>(initialData);
  const [tributes, setTributes] = useState<Tribute[]>(MOCK_TRIBUTES);

  const updateData = (updates: Partial<MemorialData>) => {
    setMemorialData(prev => ({ ...prev, ...updates }));
  };

  const resetData = () => {
    setMemorialData(initialData);
    setTributes(MOCK_TRIBUTES);
  };

  const addTribute = (tribute: Omit<Tribute, 'id' | 'date'>) => {
    const newTribute: Tribute = {
      ...tribute,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
    setTributes(prev => [newTribute, ...prev]);
  };

  const setAllTributes = (newTributes: Tribute[]) => {
    setTributes(newTributes);
  };

  return (
    <MemorialContext.Provider value={{ memorialData, updateData, resetData, tributes, addTribute, setAllTributes }}>
      {children}
    </MemorialContext.Provider>
  );
}

export function useMemorial() {
  const context = useContext(MemorialContext);
  if (context === undefined) {
    throw new Error('useMemorial must be used within a MemorialProvider');
  }
  return context;
}
