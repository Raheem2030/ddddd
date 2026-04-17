import React, { useRef, useEffect } from 'react';
import { ContentCard } from '../../types';
import { UnifiedCard } from './UnifiedCard';
import { CheckCircle2 } from 'lucide-react';

interface CardSwiperProps {
  cards: ContentCard[];
  onComplete?: () => void;
}

export function CardSwiper({ cards, onComplete }: CardSwiperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // We are going to group the flat card array by title.
  // Wait, no, we can keep the mapping exactly as before, but pass 'card' to UnifiedCard
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" dir="rtl">
      <div 
        ref={containerRef}
        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {cards.map((card, index) => {
          const progress = (index + 1) / cards.length;
          const circumference = 2 * Math.PI * 16; // r=16
          const strokeDashoffset = circumference - progress * circumference;

          return (
            <div 
              key={card.id || index.toString()} 
              className="w-full h-full shrink-0 snap-center flex items-center justify-center p-4 sm:p-6"
            >
              <div className="w-full max-w-sm h-[80vh] relative">
                <UnifiedCard data={card} />
                
                {/* Progress Indicator */}
                <div className="absolute top-6 left-6 z-50 flex items-center justify-center w-10 h-10 bg-[#0a0f1a]/80 rounded-full backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18" cy="18" r="16"
                      fill="none"
                      className="stroke-white/10"
                      strokeWidth="2"
                    />
                    <circle
                      cx="18" cy="18" r="16"
                      fill="none"
                      className="stroke-[#00F0FF] transition-all duration-300 ease-in-out"
                      strokeWidth="2"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="relative z-10 text-[11px] font-bold flex items-center justify-center" dir="ltr">
                    <span className="text-[#00F0FF]">{index + 1}</span>
                    <span className="mx-[2px] text-white/40 text-[9px]">/</span>
                    <span className="text-white/70">{cards.length}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Final Completion Slide */}
        <div className="w-full h-full shrink-0 snap-center flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-sm h-[80vh] glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center border-t border-l border-opacity-20 border-white">
            <div className="w-24 h-24 rounded-full bg-[#00FF9D]/20 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-[#00FF9D]" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">أحسنت!</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              لقد أتممت دراسة هذه الكبسولة بنجاح.
            </p>
            {onComplete && (
              <button 
                onClick={onComplete}
                className="w-full py-4 rounded-2xl bg-[var(--color-pharma-primary)] text-white font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg shadow-[var(--color-pharma-primary)]/30"
              >
                العودة للفصل
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
