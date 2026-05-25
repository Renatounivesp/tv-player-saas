import { create } from 'zustand';
import { Clinic, Slide, Plan, Ticker, ClinicStatus } from './mock-data';
import { createClient } from '@/utils/supabase/client';

interface AppState {
  clinics: Clinic[];
  slides: Slide[];
  plans: Plan[];
  tickers: Ticker[];
  
  // Data Loading
  isLoading: boolean;
  fetchInitialData: () => Promise<void>;
  fetchTvData: (slug: string) => Promise<void>;
  
  // Actions Clinics
  addClinicAsync: (clinic: Omit<Clinic, 'id' | 'created_at'>) => Promise<void>;
  updateClinicStatusAsync: (clinicId: string, status: ClinicStatus) => Promise<void>;
  updateClinicSettingsAsync: (clinicId: string, updates: Partial<Clinic>) => Promise<void>;
  
  // Actions Slides
  addSlideAsync: (slide: Omit<Slide, 'id' | 'created_at'>) => Promise<void>;
  updateSlideAsync: (slideId: string, updates: Partial<Slide>) => Promise<void>;
  updateSlidesOrderAsync: (orderedSlides: Slide[]) => Promise<void>;
  deleteSlideAsync: (slideId: string) => Promise<void>;
  toggleSlideStatusAsync: (slideId: string) => Promise<void>;
  
  // Actions Tickers
  addTickerAsync: (ticker: Omit<Ticker, 'id' | 'created_at'>) => Promise<void>;
  updateTickerAsync: (tickerId: string, updates: Partial<Ticker>) => Promise<void>;
  updateTickersOrderAsync: (orderedTickers: Ticker[]) => Promise<void>;
  deleteTickerAsync: (tickerId: string) => Promise<void>;
  toggleTickerStatusAsync: (tickerId: string) => Promise<void>;
}

export const useAppStore = create<AppState>()((set, get) => ({
  clinics: [],
  slides: [],
  plans: [],
  tickers: [],
  isLoading: true,
  
  fetchInitialData: async () => {
    const supabase = createClient();
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();

      let clinicsQuery = supabase.from('clinics').select('*');
      
      if (user) {
        clinicsQuery = clinicsQuery.eq('user_id', user.id);
      }

      const [clinicsRes, plansRes] = await Promise.all([
        clinicsQuery,
        supabase.from('plans').select('*')
      ]);

      if (clinicsRes.error) throw clinicsRes.error;
      if (plansRes.error) throw plansRes.error;

      const clinicIds = clinicsRes.data ? clinicsRes.data.map(c => c.id) : [];
      let slidesRes: any = { data: [], error: null };
      let tickersRes: any = { data: [], error: null };
      
      if (clinicIds.length > 0) {
        [slidesRes, tickersRes] = await Promise.all([
          supabase.from('slides').select('*').in('clinic_id', clinicIds).order('order_index', { ascending: true }),
          supabase.from('tickers').select('*').in('clinic_id', clinicIds).order('order_index', { ascending: true })
        ]);
        if (slidesRes.error) throw slidesRes.error;
        if (tickersRes.error) throw tickersRes.error;
      }

      set({
        clinics: clinicsRes.data as Clinic[],
        slides: slidesRes.data as Slide[],
        plans: plansRes.data as Plan[],
        tickers: tickersRes.data as Ticker[],
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

      const { data: tickers, error: tickersError } = await supabase.from('tickers').select('*').eq('clinic_id', clinic.id).order('order_index', { ascending: true });
      if (tickersError) throw tickersError;
      
      set({
        clinics: [clinic],
        slides: slides as Slide[],
        tickers: tickers as Ticker[],
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

  updateClinicSettingsAsync: async (clinicId, updates) => {
    const supabase = createClient();
    const { data, error } = await supabase.from('clinics').update(updates).eq('id', clinicId).select().single();
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

  updateSlideAsync: async (slideId, updates) => {
    const supabase = createClient();
    const { data, error } = await supabase.from('slides').update(updates).eq('id', slideId).select().single();
    if (error) throw error;
    set((state) => ({
      slides: state.slides.map(s => s.id === slideId ? (data as Slide) : s)
    }));
  },

  updateSlidesOrderAsync: async (orderedSlides) => {
    const supabase = createClient();
    set({ slides: orderedSlides });

    const updates = orderedSlides.map(slide => ({
      id: slide.id,
      clinic_id: slide.clinic_id,
      order_index: slide.order_index,
      duration_seconds: slide.duration_seconds,
      is_active: slide.is_active,
      type: slide.type
    }));
    
    const { error } = await supabase.from('slides').upsert(updates);
    if (error) {
      console.error('Failed to save slide order', error);
    }
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
  },

  addTickerAsync: async (tickerData) => {
    const supabase = createClient();
    const { data, error } = await supabase.from('tickers').insert([tickerData]).select().single();
    if (error) throw error;
    set((state) => ({ tickers: [...state.tickers, data as Ticker] }));
  },

  updateTickerAsync: async (tickerId, updates) => {
    const supabase = createClient();
    const { data, error } = await supabase.from('tickers').update(updates).eq('id', tickerId).select().single();
    if (error) throw error;
    set((state) => ({
      tickers: state.tickers.map(t => t.id === tickerId ? (data as Ticker) : t)
    }));
  },

  updateTickersOrderAsync: async (orderedTickers) => {
    const supabase = createClient();
    set({ tickers: orderedTickers });

    const updates = orderedTickers.map(t => ({
      id: t.id,
      clinic_id: t.clinic_id,
      order_index: t.order_index,
      text_content: t.text_content,
      is_active: t.is_active
    }));
    
    const { error } = await supabase.from('tickers').upsert(updates);
    if (error) console.error('Failed to save ticker order', error);
  },

  deleteTickerAsync: async (tickerId) => {
    const supabase = createClient();
    const { error } = await supabase.from('tickers').delete().eq('id', tickerId);
    if (error) throw error;
    set((state) => ({ tickers: state.tickers.filter(t => t.id !== tickerId) }));
  },

  toggleTickerStatusAsync: async (tickerId) => {
    const supabase = createClient();
    const ticker = get().tickers.find(t => t.id === tickerId);
    if (!ticker) return;
    
    const { data, error } = await supabase
      .from('tickers')
      .update({ is_active: !ticker.is_active })
      .eq('id', tickerId)
      .select()
      .single();
    if (error) throw error;
    set((state) => ({
      tickers: state.tickers.map(t => t.id === tickerId ? (data as Ticker) : t)
    }));
  }
}));
