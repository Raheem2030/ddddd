import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { FlaskConical, ArrowLeft } from 'lucide-react';

export function WelcomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 -left-10 w-40 h-40 bg-[var(--color-pharma-primary)] rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 -right-10 w-40 h-40 bg-[var(--color-pharma-secondary)] rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mb-12"
      >
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[var(--color-pharma-primary)] to-[var(--color-pharma-secondary)] rounded-3xl p-1 shadow-[0_0_40px_rgba(0,240,255,0.4)] rotate-12 hover:rotate-0 transition-all duration-500">
          <div className="w-full h-full bg-[var(--color-pharma-bg)] rounded-[22px] flex items-center justify-center">
            <FlaskConical className="w-16 h-16 text-[var(--color-pharma-primary)]" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10 space-y-4"
      >
        <h1 className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-pharma-primary)] to-[var(--color-pharma-accent)]">
          PharmaDeck
        </h1>
        <p className="text-lg text-gray-300 max-w-[280px] mx-auto leading-relaxed">
          منصتك الذكية لتعلم الصيدلة بأسلوب الكبسولات المعرفية.
        </p>
      </motion.div>

      <motion.button
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        onClick={() => navigate('/select')}
        className="mt-16 relative z-10 group flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-[var(--color-pharma-primary)]/50 px-8 py-4 rounded-full backdrop-blur-md transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]"
      >
        <span className="text-xl font-bold text-white">ابدأ رحلتك</span>
        <ArrowLeft className="w-6 h-6 text-[var(--color-pharma-primary)] group-hover:-translate-x-2 transition-transform" />
      </motion.button>
    </div>
  );
}
