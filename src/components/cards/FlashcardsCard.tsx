import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ContentCard } from '../../types';
import { Volume2 } from 'lucide-react';

interface FlashcardsCardProps {
  data: ContentCard;
  hideWrapper?: boolean;
}

export function FlashcardsCard({ data, hideWrapper }: FlashcardsCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const terms = data.terms || [];

  if (terms.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        لا توجد مصطلحات
      </div>
    );
  }

  const handleNext = () => {
    if (currentIndex < terms.length - 1) {
      setFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex - 1), 150);
    }
  };

  const currentTerm = terms[currentIndex];

  const content = (
    <div className="flex flex-col h-full items-center justify-center p-6 w-full">
      <div className="text-blue-400 font-bold mb-4">{currentIndex + 1} / {terms.length}</div>
      <div 
        className="relative w-full h-[60%] lg:h-[70%] cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div
          className="w-full h-full relative transition-transform duration-500"
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div 
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center rounded-3xl border border-blue-500/30 bg-blue-500/10 p-6 backdrop-blur-md"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <h3 className="font-bold text-white text-3xl md:text-5xl text-center" dir="rtl">{currentTerm.arabic}</h3>
            {currentTerm.audioUrl && (
              <div className="mt-6 flex flex-col items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if ('speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                      const msg = new SpeechSynthesisUtterance(currentTerm.arabic);
                      msg.lang = 'ar-SA';
                      window.speechSynthesis.speak(msg);
                    } else {
                      const audio = new Audio(currentTerm.audioUrl);
                      audio.play().catch(err => console.error('Audio playback failed:', err));
                    }
                  }}
                  className="bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/40 text-[#00F0FF] rounded-full p-4 flex items-center justify-center transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                  title="استمع للفظ"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>
            )}
            <p className="text-gray-400 mt-6 absolute bottom-6 text-sm">انقر للقلب</p>
          </div>
          
          <div 
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center rounded-3xl border border-blue-400/50 bg-blue-400/20 p-6 backdrop-blur-md"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            {(currentTerm.latin || currentTerm.english) && (
              <p className="text-[#00F0FF] font-mono text-center font-bold text-2xl md:text-4xl mb-4" dir="ltr">{currentTerm.latin || currentTerm.english}</p>
            )}
            {currentTerm.description && (
              <p className="text-gray-200 text-lg text-center" dir="rtl">{currentTerm.description}</p>
            )}
            {currentTerm.audioUrl && (
              <div className="mt-8 flex flex-col items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if ('speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                      const textToRead = currentTerm.latin || currentTerm.english || '';
                      if (textToRead) {
                        const msg = new SpeechSynthesisUtterance(textToRead);
                        msg.lang = 'en-US';
                        window.speechSynthesis.speak(msg);
                      }
                    } else {
                      const audio = new Audio(currentTerm.audioUrl);
                      audio.play().catch(err => console.error('Audio playback failed:', err));
                    }
                  }}
                  className="bg-blue-400/20 hover:bg-blue-400/40 border border-blue-400/40 text-[#00F0FF] rounded-full p-4 flex items-center justify-center transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                  title="استمع للفظ"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
                <p className="text-xs text-blue-300/70 mt-1">استمع للفظ</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-between w-full mt-8 max-w-sm gap-4">
        <button 
          onClick={handleNext}
          disabled={currentIndex === terms.length - 1}
          className="px-6 py-3 rounded-xl font-bold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#00F0FF]/20 transition-all flex-1"
        >
          التالي
        </button>
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-6 py-3 rounded-xl font-bold bg-white/5 text-white border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all flex-1"
        >
          السابق
        </button>
      </div>
    </div>
  );

  if (hideWrapper) {
    return content;
  }

  return (
    <div className="w-full h-full glass-panel rounded-3xl overflow-hidden flex flex-col items-center justify-center border border-white/10 relative">
      {content}
    </div>
  );
}
