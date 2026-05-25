import { create } from 'zustand';
import { Clinic, Slide, Plan, ClinicStatus } from './mock-data';
import { createClient } from '@/utils/supabase/client';

interface AppState {
  clinics: Clinic[];
  slides: Slide[];
  plans: Plan[];
  
  // Data Loading
  isLoading: boolean;
  fetchInitialData: () => Promise<void>;
  fetchTvData: (slug: string) => Promise<void>;
  
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
    const supabase = createClient();
    set({ isLoading: true });
    try {
      // Pega o usuário logado atualmente
      const { data: { user } } = await supabase.auth.getUser();

      let clinicsQuery = supabase.from('clinics').select('*');
      
      // Se for o dono do sistema (usando o painel admin), talvez mostre todas.
      // Mas para a segurança do MVP, filtramos pela clínica que o usuário criou:
      if (user) {
        clinicsQuery = clinicsQuery.eq('user_id', user.id);
      }

      const [clinicsRes, plansRes] = await Promise.all([
        clinicsQuery,
        supabase.from('plans').select('*')
      ]);

      if (clinicsRes.error) throw clinicsRes.error;
      if (plansRes.error) throw plansRes.error;

      // Pegar os slides de todas as clínicas do usuário (normalmente é só 1 clínica)
      const clinicIds = clinicsRes.data ? clinicsRes.data.map(c => c.id) : [];
      let slidesRes: any = { data: [], error: null };
      
      if (clinicIds.length > 0) {
        slidesRes = await supabase.from('slides').select('*').in('clinic_id', clinicIds).order('order_index', { ascending: true });
        if (slidesRes.error) throw slidesRes.error;
      }

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
  
  fetchTvData: async (slug: string) => {
    const supabase = createClient();
    set({ isLoading: true });
    try {
      const { data: clinic, error: clinicError } = await supabase.from('clinics').select('*').eq('slug', slug).single();
      if (clinicError) throw clinicError;
      
      const { data: slides, error: slidesError } = await supabase.from('slides').select('*').eq('clinic_id', clinic.id).order('order_index', { ascending: true });
      if (slidesError) throw slidesError;
      
      set({
        clinics: [clinic],
        slides: slides as Slide[],
        isLoading: false
      });
    } catch (error) {
      console.error('Erro ao buscar dados da TV:', error);
      set({ isLoading: false });
    }
  },
  
  addClinicAsync: async (clinicData) => {
    const supabase = createClient();
    const { data, error } = await supabase.from('clinics').insert([clinicData]).select().single();
    if (error) throw error;
    set((state) => ({ clinics: [...state.clinics, data as Clinic] }));
  },
  
  updateClinicStatusAsync: async (clinicId, status) => {
    const supabase = createClient();
    const { data, error } = await supabase.from('clinics').update({ status }).eq('id', clinicId).select().single();
    if (error) throw error;
    set((state) => ({
      clinics: state.clinics.map(c => c.id === clinicId ? (data as Clinic) : c)
    }));
  },

  addSlideAsync: async (slideData) => {
    const supabase = createClient();
    const { data, error } = await supabase.from('slides').insert([slideData]).select().single();
    if (error) throw error;
    set((state) => ({ slides: [...state.slides, data as Slide] }));
  },
  
  deleteSlideAsync: async (slideId) => {
    const supabase = createClient();
    const { error } = await supabase.from('slides').delete().eq('id', slideId);
    if (error) throw error;
    set((state) => ({ slides: state.slides.filter(s => s.id !== slideId) }));
  },

  toggleSlideStatusAsync: async (slideId) => {
    const slide = get().slides.find(s => s.id === slideId);
    if (!slide) return;
    
    const supabase = createClient();
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
