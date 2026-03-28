import React, { useState } from 'react';
import { InteractiveCardData } from '../../types';
import { cn } from '../../lib/utils';
import { CheckCircle2, XCircle, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InteractiveCardProps {
  data: InteractiveCardData;
}

export function InteractiveCard({ data }: InteractiveCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowExplanation(true);
    
    // Optional: Haptic feedback
    if (window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred) {
      try {
        const type = index === data.correctOptionIndex ? 'success' : 'error';
        window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
      } catch (e) {
        console.warn('HapticFeedback not supported', e);
      }
    }
  };

  return (
    <div className={cn(
      "glass-panel rounded-3xl p-6 w-full h-full flex flex-col",
      "border-t border-l border-opacity-20 border-white overflow-y-auto hide-scrollbar overscroll-y-contain"
    )}>
      <div className="flex items-center gap-3 mb-6 border-b border-[var(--color-pharma-glass-border)] pb-4">
        <BrainCircuit className="w-6 h-6 text-[var(--color-pharma-accent)]" />
        <h2 className="text-xl font-bold text-[var(--color-pharma-primary)]">
          {data.title}
        </h2>
      </div>
      
      <div className="flex-1 flex flex-col">
        <p className="text-lg text-white mb-8 font-medium leading-relaxed">
          {data.question}
        </p>

        <div className="space-y-3 mb-6">
          {data.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = index === data.correctOptionIndex;
            const showStatus = selectedOption !== null;

            let buttonClass = "w-full text-right p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ";
            
            if (!showStatus) {
              buttonClass += "border-white/10 bg-white/5 hover:bg-white/10 text-gray-200";
            } else if (isCorrect) {
              buttonClass += "border-[#00FF9D] bg-[#00FF9D]/10 text-white";
            } else if (isSelected && !isCorrect) {
              buttonClass += "border-[#FF3B30] bg-[#FF3B30]/10 text-white";
            } else {
              buttonClass += "border-white/5 bg-transparent text-gray-500 opacity-50";
            }

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={selectedOption !== null}
                className={buttonClass}
              >
                <span className="relative z-10 flex items-center justify-between">
                  <span>{option}</span>
                  {showStatus && isCorrect && <CheckCircle2 className="w-5 h-5 text-[#00FF9D]" />}
                  {showStatus && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-[#FF3B30]" />}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mt-auto p-4 rounded-2xl border",
                selectedOption === data.correctOptionIndex 
                  ? "bg-[#00FF9D]/10 border-[#00FF9D]/30" 
                  : "bg-[#FF3B30]/10 border-[#FF3B30]/30"
              )}
            >
              <h4 className={cn(
                "font-bold mb-2",
                selectedOption === data.correctOptionIndex ? "text-[#00FF9D]" : "text-[#FF3B30]"
              )}>
                {selectedOption === data.correctOptionIndex ? 'إجابة صحيحة!' : 'إجابة خاطئة'}
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {data.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
