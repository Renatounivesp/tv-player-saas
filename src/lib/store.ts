import { create } from 'zustand';
import { Clinic, Slide, Plan, ClinicStatus } from './mock-data';
import { supabase } from './supabase';

interface AppState {
  clinics: Clinic[];
  slides: Slide[];
  plans: Plan[];
  
  // Data Loading
  isLoading: boolean;
  fetchInitialData: () => Promise<void>;
  
  // Actions Clinics
  addClinicAsync: (clinic: Omit<Clinic, 'id' | 'created_at'>) => Promise<void>;
  updateClinicStatusAsync: (clinicId: string, status: ClinicStatus) => Promise<void>;
  
  // Actions Slides
  addSlideAsync: (slide: Omit<Slide, 'id' | 'created_at'>) => Promise<void>;
  deleteSlideAsync: (slideId: string) => Promise<void>;
  toggleSlideStatusAsync: (slideId: string) => Promise<void>;
}

export const useAppStore = create<AppState>()((set, get) => ({
  clinics: [],
  slides: [],
  plans: [],
  isLoading: true,
  
  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      const [clinicsRes, slidesRes, plansRes] = await Promise.all([
        supabase.from('clinics').select('*'),
        supabase.from('slides').select('*').order('order_index', { ascending: true }),
        supabase.from('plans').select('*')
      ]);

      if (clinicsRes.error) throw clinicsRes.error;
      if (slidesRes.error) throw slidesRes.error;
      if (plansRes.error) throw plansRes.error;

      set({
        clinics: clinicsRes.data as Clinic[],
        slides: slidesRes.data as Slide[],
        plans: plansRes.data as Plan[],
        isLoading: false
      });
    } catch (error) {
      console.error('Erro ao buscar dados do Supabase:', error);
      set({ isLoading: false });
    }
  },
  
  addClinicAsync: async (clinicData) => {
    const { data, error } = await supabase.from('clinics').insert([clinicData]).select().single();
    if (error) throw error;
    set((state) => ({ clinics: [...state.clinics, data as Clinic] }));
  },
  
  updateClinicStatusAsync: async (clinicId, status) => {
    const { data, error } = await supabase.from('clinics').update({ status }).eq('id', clinicId).select().single();
    if (error) throw error;
    set((state) => ({
      clinics: state.clinics.map(c => c.id === clinicId ? (data as Clinic) : c)
    }));
  },

  addSlideAsync: async (slideData) => {
    const { data, error } = await supabase.from('slides').insert([slideData]).select().single();
    if (error) throw error;
    set((state) => ({ slides: [...state.slides, data as Slide] }));
  },
  
  deleteSlideAsync: async (slideId) => {
    const { error } = await supabase.from('slides').delete().eq('id', slideId);
    if (error) throw error;
    set((state) => ({ slides: state.slides.filter(s => s.id !== slideId) }));
  },

  toggleSlideStatusAsync: async (slideId) => {
    const slide = get().slides.find(s => s.id === slideId);
    if (!slide) return;
    
    const { data, error } = await supabase
      .from('slides')
      .update({ is_active: !slide.is_active })
      .eq('id', slideId)
      .select()
      .single();
      
    if (error) throw error;
    set((state) => ({
      slides: state.slides.map(s => s.id === slideId ? (data as Slide) : s)
    }));
  }
}));
