'use client';

import { useState, useEffect } from 'react';
import { Clinic, Slide } from '@/lib/mock-data';
import { AnimatePresence, motion, Variants } from 'framer-motion';

const transitionVariants: Record<string, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideLeft: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  },
  slideRight: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 }
  },
  slideUp: {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -100 }
  },
  zoom: {
    initial: { opacity: 0, scale: 1.05 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  }
};

interface PlayerClientProps {
  clinic: Clinic;
  slides: Slide[];
}

export default function PlayerClient({ clinic, slides }: PlayerClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Slide Engine
  useEffect(() => {
    if (slides.length <= 1) return;

    const currentSlide = slides[currentIndex];
    
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, currentSlide.duration_seconds * 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, slides]);

  const slide = slides[currentIndex];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          variants={transitionVariants[slide.transition || 'fade']}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {slide.type === 'image' && slide.content_url && (
            <>
              {/* Premium Blurred Background */}
              <div 
                className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110"
                style={{ backgroundImage: `url(${slide.content_url})` }}
              />
              <img 
                src={slide.content_url} 
                alt="Slide" 
                className="relative z-10 w-full h-full object-contain p-2 md:p-0"
              />
            </>
          )}

          {slide.type === 'promo' && (
            <div 
              className="w-full h-full flex flex-col items-center justify-center p-12 text-center"
              style={{ backgroundColor: clinic.primary_color }}
            >
              <h1 className="text-white text-4xl md:text-6xl lg:text-8xl font-black mb-4 md:mb-8 leading-tight">
                {slide.text_content}
              </h1>
              <div className="bg-white text-gray-900 text-xl md:text-3xl font-bold py-3 md:py-4 px-6 md:px-8 rounded-full shadow-2xl animate-pulse">
                Aproveite agora!
              </div>
            </div>
          )}

          {slide.type === 'text' && (
            <div className="w-full h-full flex items-center justify-center p-16 bg-gradient-to-br from-gray-900 to-gray-800">
              <h1 className="text-white text-3xl md:text-5xl lg:text-7xl font-bold text-center leading-normal">
                {slide.text_content}
              </h1>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Floating Info (Logo and Clock) */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-8 flex justify-between items-start z-50 pointer-events-none drop-shadow-lg">
        {clinic.logo_url ? (
          <img 
            src={clinic.logo_url} 
            alt={clinic.name} 
            className="h-10 md:h-16 lg:h-24 object-contain bg-white/10 backdrop-blur-md p-2 rounded-xl"
          />
        ) : (
          <div 
            className="text-white font-black text-lg md:text-2xl lg:text-3xl tracking-tight bg-black/30 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-xl border border-white/10"
          >
            {clinic.name}
          </div>
        )}

        <div className="bg-black/40 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-xl border border-white/10 text-white text-right">
          <div className="text-xl md:text-2xl lg:text-3xl font-bold tracking-wider">
            {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-xs md:text-sm font-medium text-white/80">
            {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
          </div>
        </div>
      </div>

      {/* Frame Overlay */}
      {clinic.frame_style && clinic.frame_style !== 'none' && (
        <div 
          className={`absolute inset-0 z-50 pointer-events-none transition-all duration-1000 ${
            clinic.frame_style === 'solid' ? 'border-[16px] md:border-[32px]' :
            clinic.frame_style === 'minimal' ? 'border-[16px] md:border-[32px] rounded-[2rem] md:rounded-[4rem] m-2 md:m-6' :
            clinic.frame_style === 'neon' ? 'border-[8px] md:border-[16px]' :
            clinic.frame_style === 'gradient' ? 'border-[16px] md:border-[32px]' : ''
          }`}
          style={{
            borderColor: clinic.frame_style === 'gradient' ? 'transparent' : clinic.primary_color,
            boxShadow: clinic.frame_style === 'neon' ? `inset 0 0 60px ${clinic.primary_color}, 0 0 60px ${clinic.primary_color}` : 
                       clinic.frame_style === 'minimal' ? `0 0 0 9999px black` : 'none',
            borderImage: clinic.frame_style === 'gradient' ? `linear-gradient(135deg, ${clinic.primary_color} 0%, #000000 100%) 1` : 'none'
          }}
        />
      )}
    </div>
  );
}
