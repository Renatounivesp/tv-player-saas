export type ClinicStatus = 'active' | 'pending' | 'overdue' | 'blocked' | 'lifetime';
export type SlideType = 'image' | 'video' | 'text' | 'promo';
export type FrameStyle = 'none' | 'solid' | 'gradient' | 'neon' | 'minimal';

export interface Plan {
  id: string;
  name: string;
  price: number;
  max_slides: number; // -1 for unlimited
  allows_video: boolean;
}

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  manager_name: string;
  phone: string;
  email: string;
  logo_url?: string;
  primary_color: string;
  frame_style?: FrameStyle;
  status: ClinicStatus;
  plan_id: string;
  subscription_due_date: string;
  subscription_value: number;
  created_at: string;
}

export type SlideTransition = 'fade' | 'slideLeft' | 'slideRight' | 'slideUp' | 'zoom';

export interface Slide {
  id: string;
  clinic_id: string;
  type: SlideType;
  content_url?: string;
  text_content?: string;
  duration_seconds: number;
  order_index: number;
  is_active: boolean;
  transition?: SlideTransition;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

export const MOCK_PLANS: Plan[] = [
  {
    id: 'p_unico',
    name: 'Plano Ilimitado',
    price: 49.00,
    max_slides: -1,
    allows_video: true,
  }
];

export const MOCK_CLINICS: Clinic[] = [
  {
    id: 'c1',
    name: 'Clínica Sorriso',
    slug: 'clinica-sorriso',
    manager_name: 'Dr. João Silva',
    phone: '(11) 99999-9999',
    email: 'contato@clinicasorriso.com',
    logo_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=200&h=200&fit=crop',
    primary_color: '#0ea5e9', // Sky blue
    status: 'active',
    plan_id: 'p_unico',
    subscription_due_date: '2026-06-15T00:00:00Z',
    subscription_value: 49,
    created_at: '2026-01-10T00:00:00Z',
  },
  {
    id: 'c2',
    name: 'Odonto Vida',
    slug: 'odonto-vida',
    manager_name: 'Dra. Maria Fernanda',
    phone: '(11) 98888-8888',
    email: 'contato@odontovida.com',
    primary_color: '#10b981', // Emerald green
    status: 'overdue',
    plan_id: 'p_unico',
    subscription_due_date: '2026-05-10T00:00:00Z', // Vencida
    subscription_value: 29,
    created_at: '2026-03-20T00:00:00Z',
  }
];

export const MOCK_SLIDES: Slide[] = [
  {
    id: 's1',
    clinic_id: 'c1',
    type: 'image',
    content_url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1920&h=1080&fit=crop',
    duration_seconds: 5,
    order_index: 0,
    is_active: true,
    created_at: '2026-05-01T00:00:00Z',
  },
  {
    id: 's2',
    clinic_id: 'c1',
    type: 'promo',
    text_content: 'Clareamento Dental com 20% de desconto nesta semana! Agende já.',
    duration_seconds: 7,
    order_index: 1,
    is_active: true,
    created_at: '2026-05-02T00:00:00Z',
  },
  {
    id: 's3',
    clinic_id: 'c1',
    type: 'image',
    content_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1920&h=1080&fit=crop',
    duration_seconds: 5,
    order_index: 2,
    is_active: true,
    created_at: '2026-05-03T00:00:00Z',
  },
  {
    id: 's4',
    clinic_id: 'c2',
    type: 'text',
    text_content: 'Bem-vindo à Odonto Vida. Por favor, aguarde, logo você será atendido.',
    duration_seconds: 10,
    order_index: 0,
    is_active: true,
    created_at: '2026-05-01T00:00:00Z',
  }
];

// Helper functions para simular chamadas de API
export async function getClinicBySlug(slug: string): Promise<Clinic | null> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate latency
  return MOCK_CLINICS.find(c => c.slug === slug) || null;
}

export async function getSlidesByClinicId(clinicId: string): Promise<Slide[]> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate latency
  return MOCK_SLIDES.filter(s => s.clinic_id === clinicId).sort((a, b) => a.order_index - b.order_index);
}

export async function getAllClinics(): Promise<Clinic[]> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate latency
  return MOCK_CLINICS;
}
