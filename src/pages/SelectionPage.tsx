import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronDown, ArrowLeft, BookOpen, Calendar, Layers, FlaskConical } from 'lucide-react';
import { Year, Semester, SubjectTypeFilter } from '../types';

export function SelectionPage() {
  const navigate = useNavigate();
  const [year, setYear] = useState<Year>('السنة الثانية');
  const [semester, setSemester] = useState<Semester>('الفصل الأول');
  const [type, setType] = useState<SubjectTypeFilter>('نظري');

  const years: Year[] = ['السنة الثانية', 'السنة الثالثة', 'السنة الرابعة', 'السنة الخامسة'];
  const semesters: Semester[] = ['الفصل الأول', 'الفصل الثاني'];
  const types: SubjectTypeFilter[] = ['نظري', 'عملي'];

  const handleContinue = () => {
    navigate(`/subjects?year=${encodeURIComponent(year)}&semester=${encodeURIComponent(semester)}&type=${encodeURIComponent(type)}`);
  };

  return (
    <div className="flex-1 flex flex-col p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-pharma-secondary)] rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-10 relative z-10"
      >
        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-[var(--color-pharma-primary)]" />
          اختر مسارك
        </h1>
        <p className="text-gray-400">حدد السنة والفصل الدراسي للبدء</p>
      </motion.div>

      <div className="flex-1 space-y-8 relative z-10">
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-3xl p-6 border border-white/10"
        >
          <label className="flex items-center gap-2 text-[var(--color-pharma-primary)] font-bold mb-4">
            <Calendar className="w-5 h-5" />
            السنة الدراسية
          </label>
          <div className="grid grid-cols-2 gap-3">
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`p-4 rounded-2xl text-sm font-bold transition-all duration-300 border ${
                  year === y
                    ? 'bg-[var(--color-pharma-primary)]/20 border-[var(--color-pharma-primary)] text-[var(--color-pharma-primary)] shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-3xl p-6 border border-white/10"
        >
          <label className="flex items-center gap-2 text-[var(--color-pharma-secondary)] font-bold mb-4">
            <Layers className="w-5 h-5" />
            الفصل الدراسي
          </label>
          <div className="grid grid-cols-2 gap-3">
            {semesters.map((s) => (
              <button
                key={s}
                onClick={() => setSemester(s)}
                className={`p-4 rounded-2xl text-sm font-bold transition-all duration-300 border ${
                  semester === s
                    ? 'bg-[var(--color-pharma-secondary)]/20 border-[var(--color-pharma-secondary)] text-[var(--color-pharma-secondary)] shadow-[0_0_15px_rgba(188,19,254,0.2)]'
                    : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-3xl p-6 border border-white/10"
        >
          <label className="flex items-center gap-2 text-[var(--color-pharma-accent)] font-bold mb-4">
            <FlaskConical className="w-5 h-5" />
            نوع المادة
          </label>
          <div className="grid grid-cols-2 gap-3">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`p-4 rounded-2xl text-sm font-bold transition-all duration-300 border ${
                  type === t
                    ? 'bg-[var(--color-pharma-accent)]/20 border-[var(--color-pharma-accent)] text-[var(--color-pharma-accent)] shadow-[0_0_15px_rgba(0,255,157,0.2)]'
                    : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.button
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={handleContinue}
        className="mt-8 relative z-10 w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[var(--color-pharma-primary)] to-[var(--color-pharma-secondary)] py-5 rounded-2xl font-bold text-white text-lg shadow-[0_10px_30px_rgba(0,240,255,0.3)] hover:shadow-[0_10px_40px_rgba(0,240,255,0.5)] transition-all duration-300"
      >
        <span>استعراض المواد</span>
        <ArrowLeft className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
