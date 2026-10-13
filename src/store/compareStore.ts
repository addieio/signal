import { create } from "zustand";

// Minimal event shape for compare tray (full Event type imported at use site)
interface CompareEntry {
  id: string;
  title: string;
  slug: string;
}

interface CompareStore {
  selected: CompareEntry[];
  addEvent: (entry: CompareEntry) => void;
  removeEvent: (id: string) => void;
  clearCompare: () => void;
  isSelected: (id: string) => boolean;
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  selected: [],
  addEvent: (entry) => {
    const { selected } = get();
    if (selected.length >= 3 || selected.find((e) => e.id === entry.id)) return;
    set({ selected: [...selected, entry] });
  },
  removeEvent: (id) =>
    set({ selected: get().selected.filter((e) => e.id !== id) }),
  clearCompare: () => set({ selected: [] }),
  isSelected: (id) => get().selected.some((e) => e.id === id),
}));
