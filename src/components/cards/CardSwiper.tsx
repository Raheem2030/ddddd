import React, { useRef, useEffect } from 'react';
import { ContentCard } from '../../types';
import { TextCard } from './TextCard';
import { MediaCard } from './MediaCard';
import { InteractiveCard } from './InteractiveCard';
import { CheckCircle2 } from 'lucide-react';

interface CardSwiperProps {
  cards: ContentCard[];
  onComplete?: () => void;
}

export function CardSwiper({ cards, onComplete }: CardSwiperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" dir="rtl">
      <div 
        ref={containerRef}
        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {cards.map((card, index) => (
          <div 
            key={card.id} 
            className="w-full h-full shrink-0 snap-center flex items-center justify-center p-4 sm:p-6"
          >
            <div className="w-full max-w-sm h-[80vh] relative">
              {card.type === 'text' && <TextCard data={card} />}
              {card.type === 'media' && <MediaCard data={card} />}
              {card.type === 'interactive' && <InteractiveCard data={card} />}
            </div>
          </div>
        ))}

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
