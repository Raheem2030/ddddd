import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, PlayCircle, BookOpen, List } from 'lucide-react';
import { subjects, subjectContents } from '../data';
import { CardSwiper } from '../components/cards/CardSwiper';
import { Capsule } from '../types';

export function ChapterPage() {
  const { id, chapterId } = useParams<{ id: string; chapterId: string }>();
  const navigate = useNavigate();
  const [activeCapsule, setActiveCapsule] = useState<Capsule | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  const subject = subjects.find(s => s.id === id);
  const content = subjectContents[id || ''];
  const chapter = content?.chapters.find(c => c.id === chapterId);

  useEffect(() => {
    if (!subject || !chapter) {
      navigate(`/subject/${id}`);
    }
  }, [subject, chapter, id, navigate]);

  if (!subject || !chapter) return null;

  const handleStartStudy = (capsule: Capsule) => {
    if (capsule.cards.length > 0) {
      setActiveCardIndex(0);
      setActiveCapsule(capsule);
    } else {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert('المحتوى قيد الإعداد لهذه الكبسولة.');
      } else {
        alert('المحتوى قيد الإعداد لهذه الكبسولة.');
      }
    }
  };

  const handleStartFlashcards = (capsule: Capsule, flashcardCardId: string) => {
    const idx = capsule.cards.findIndex(c => c.id === flashcardCardId);
    if (idx !== -1) {
      setActiveCardIndex(idx);
      setActiveCapsule(capsule);
    }
  };

  if (activeCapsule) {
    return (
      <div className="fixed inset-0 z-50 bg-[#030508] flex flex-col overflow-hidden">
        {/* Swirling neon light leaks */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#BC13FE] rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#00F0FF] rounded-full mix-blend-screen filter blur-[150px] opacity-15"></div>
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-[#4A00E0] rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>

        <div className="p-4 flex items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-md relative z-10">
          <h2 className="text-lg font-bold text-[#00F0FF] drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">{activeCapsule.title}</h2>
          <button 
            onClick={() => setActiveCapsule(null)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="flex-1 relative z-10">
          <CardSwiper 
            cards={activeCapsule.cards} 
            initialIndex={activeCardIndex}
            onComplete={() => {
              if (window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred) {
                try {
                  window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                } catch (e) {
                  console.warn('HapticFeedback not supported', e);
                }
              }
              setActiveCapsule(null);
            }} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-full h-64 bg-gradient-to-b from-[var(--color-pharma-primary)]/20 to-transparent mix-blend-screen filter blur-[50px] opacity-30"></div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6 pb-2 relative z-10 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-black text-white mb-1">{chapter.title}</h1>
          <p className="text-[var(--color-pharma-primary)] text-sm font-medium">{subject.name}</p>
        </div>
        <button 
          onClick={() => navigate(`/subject/${id}`)}
          className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-gray-300" />
        </button>
      </motion.div>

      <div className="flex-1 overflow-y-auto hide-scrollbar p-6 relative z-10">
        <div className="space-y-6">
          {chapter.capsules.map((capsule, index) => {
            const flashcardCard = capsule.cards.find(c => c.type === 'flashcards');
            return (
              <motion.div
                key={capsule.id}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel rounded-3xl p-6 border border-[var(--color-pharma-primary)]/30 relative overflow-hidden group"
              >
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-[var(--color-pharma-primary)]/20 rounded-full blur-2xl group-hover:bg-[var(--color-pharma-primary)]/40 transition-all duration-500"></div>
                
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <PlayCircle className="w-6 h-6 text-[var(--color-pharma-primary)]" />
                  {capsule.title}
                </h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  {capsule.description || 'ابدأ جلسة التعلم المصغر الخاصة بك. تتضمن نصوص، وسائط، واختبارات تفاعلية.'}
                </p>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleStartStudy(capsule)}
                    className="w-full bg-gradient-to-r from-[var(--color-pharma-primary)] to-[var(--color-pharma-secondary)] py-4 rounded-2xl font-bold text-white shadow-[0_5px_20px_rgba(0,240,255,0.3)] hover:shadow-[0_5px_30px_rgba(0,240,255,0.5)] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    بدء الجلسة
                  </button>
                  
                  {flashcardCard && (
                    <button 
                      onClick={() => handleStartFlashcards(capsule, flashcardCard.id)}
                      className="w-full bg-blue-500/10 border border-blue-500/30 text-blue-400 py-3 rounded-2xl font-bold hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <List className="w-5 h-5" />
                      المصطلحات اللاتينية
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
