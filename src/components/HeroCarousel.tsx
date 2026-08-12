import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { Banner } from '../types';

interface HeroCarouselProps {
  banners: Banner[];
  onCtaClick?: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ banners, onCtaClick }) => {
  const activeBanners = banners.filter((b) => b.active).sort((a, b) => a.order - b.order);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] overflow-hidden bg-[#004080] text-white shadow-lg">
      {/* Background Image Slide */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        <img
          src={currentBanner.imageUrl}
          alt={currentBanner.title}
          className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#004080]/90 via-[#004080]/60 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="relative max-w-7xl mx-auto h-full px-6 sm:px-12 lg:px-16 flex flex-col justify-center items-start z-10">
        <div className="max-w-2xl space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 text-[#f5f1e9] text-xs sm:text-sm font-medium">
            <Sparkles className="w-4 h-4 text-[#f5f1e9] animate-spin-slow" />
            <span>Tienda Holística Barmina • Parque Chacabuco</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white tracking-wide drop-shadow-md">
            {currentBanner.title}
          </h1>

          <p className="text-[#f5f1e9]/90 text-sm sm:text-lg font-light leading-relaxed max-w-xl">
            {currentBanner.subtitle}
          </p>

          <div className="pt-3">
            <a
              href={currentBanner.ctaLink || '#productos'}
              onClick={onCtaClick}
              className="inline-flex items-center gap-2 bg-[#f5f1e9] hover:bg-white text-[#004080] font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{currentBanner.ctaText || 'Explorar Tienda'}</span>
              <ArrowRight className="w-4 h-4 text-[#004080]" />
            </a>
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#004080]/60 hover:bg-[#004080] text-white p-3 rounded-full backdrop-blur-sm transition-all border border-white/30 shadow-md"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#004080]/60 hover:bg-[#004080] text-white p-3 rounded-full backdrop-blur-sm transition-all border border-white/30 shadow-md"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  idx === currentIndex ? 'w-8 bg-[#f5f1e9]' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Ir a slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
