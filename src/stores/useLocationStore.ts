import { create } from 'zustand';

interface LocationState {
  selectedLocation: {
    regionId: number;
    regionName: string;
    subregionId?: number;
    subregionName?: string;
    displayName: string; // "서울" 또는 "서울 강남구"
  } | null;
  setSelectedLocation: (location: LocationState['selectedLocation']) => void;
  clearSelectedLocation: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  selectedLocation: null,
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  clearSelectedLocation: () => set({ selectedLocation: null }),
}));
