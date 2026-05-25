'use client';

import { useState, useEffect } from 'react';
import { Clinic, Slide, Ticker } from '@/lib/mock-data';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Cloud, Sun, CloudRain, CloudLightning, Snowflake } from 'lucide-react';

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
  tickers?: Ticker[];
}

export default function PlayerClient({ clinic, slides, tickers = [] }: PlayerClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Weather state
  const [weather, setWeather] = useState<{ temp: number, code: number } | null>(null);

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

  // Weather Engine
  useEffect(() => {
    if (!clinic.show_weather) return;

    const fetchWeather = async () => {
      try {
        // 1. Get Lat/Lng from IP
        const geoRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
        const geoData = await geoRes.json();
        const { latitude, longitude } = geoData;

        // 2. Get Weather
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherRes.json();
        
        setWeather({
          temp: Math.round(weatherData.current_weather.temperature),
          code: weatherData.current_weather.weathercode
        });
      } catch (error) {
        console.error('Failed to fetch weather', error);
      }
    };

    fetchWeather();
    // Update every 30 minutes
    const timer = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(timer);
  }, [clinic.show_weather]);

  const slide = slides[currentIndex];

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />;
    if (code >= 1 && code <= 48) return <Cloud className="w-6 h-6 md:w-8 md:h-8 text-gray-300" />;
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />;
    if (code >= 71 && code <= 77) return <Snowflake className="w-6 h-6 md:w-8 md:h-8 text-white" />;
    if (code >= 95 && code <= 99) return <CloudLightning className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />;
    return <Sun className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />;
  };

  const tickersText = tickers.length > 0 ? tickers.map(t => t.text_content).join('  ✦  ') : null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          white-space: nowrap;
          will-change: transform;
        }
      `}</style>

      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          variants={transitionVariants[clinic.default_transition || 'fade']}
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
        {clinic.show_logo !== false && (
          clinic.logo_url ? (
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
          )
        )}

        <div className="flex flex-col items-end gap-3 ml-auto">
          {clinic.show_clock !== false && (
            <div className="bg-black/40 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-xl border border-white/10 text-white text-right">
              <div className="text-xl md:text-2xl lg:text-3xl font-bold tracking-wider">
                {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-xs md:text-sm font-medium text-white/80">
                {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
              </div>
            </div>
          )}

          {clinic.show_weather && weather && (
            <div className="bg-black/40 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-xl border border-white/10 text-white flex items-center gap-3">
              {getWeatherIcon(weather.code)}
              <div className="text-xl md:text-2xl lg:text-3xl font-bold">
                {weather.temp}°C
              </div>
            </div>
          )}
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

      {/* Ticker / Letreiro Overlay */}
      {tickersText && (
        <div 
          className="absolute bottom-0 left-0 w-full z-[60] bg-black/80 backdrop-blur-md border-t border-white/20 py-3 overflow-hidden flex items-center"
          style={{ 
            borderTopColor: clinic.primary_color 
          }}
        >
          <div className="animate-marquee inline-block text-white text-2xl font-semibold tracking-wide">
            {tickersText}
          </div>
        </div>
      )}
    </div>
  );
}
