import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Clinic, Slide, Plan, MOCK_CLINICS, MOCK_SLIDES, MOCK_PLANS, ClinicStatus } from './mock-data';

interface AppState {
  clinics: Clinic[];
  slides: Slide[];
  plans: Plan[];
  
  // Actions Clinics
  addClinic: (clinic: Omit<Clinic, 'id' | 'created_at'>) => void;
  updateClinicStatus: (clinicId: string, status: ClinicStatus) => void;
  
  // Actions Slides
  addSlide: (slide: Omit<Slide, 'id' | 'created_at'>) => void;
  deleteSlide: (slideId: string) => void;
  toggleSlideStatus: (slideId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      clinics: MOCK_CLINICS,
      slides: MOCK_SLIDES,
      plans: MOCK_PLANS,
      
      addClinic: (clinicData) => {
        set((state) => ({
          clinics: [
            ...state.clinics, 
            { 
              ...clinicData, 
              id: `c${Date.now()}`, 
              created_at: new Date().toISOString() 
            }
          ]
        }));
      },
      
      updateClinicStatus: (clinicId, status) => {
        set((state) => ({
          clinics: state.clinics.map(c => c.id === clinicId ? { ...c, status } : c)
        }));
      },

      addSlide: (slideData) => {
        set((state) => ({
          slides: [
            ...state.slides, 
            { 
              ...slideData, 
              id: `s${Date.now()}`, 
              created_at: new Date().toISOString() 
            }
          ]
        }));
      },
      
      deleteSlide: (slideId) => {
        set((state) => ({
          slides: state.slides.filter(s => s.id !== slideId)
        }));
      },

      toggleSlideStatus: (slideId) => {
        set((state) => ({
          slides: state.slides.map(s => s.id === slideId ? { ...s, is_active: !s.is_active } : s)
        }));
      }
    }),
    {
      name: 'tv-player-storage', // Chave onde será salvo no LocalStorage
      partialize: (state) => ({ clinics: state.clinics, slides: state.slides }), // Não salva planos no cache para forçar a atualização
    }
  )
);
