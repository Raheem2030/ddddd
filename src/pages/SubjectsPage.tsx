import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Book, FlaskConical, Beaker } from 'lucide-react';
import { subjects } from '../data';
import { Year, Semester, SubjectTypeFilter } from '../types';

export function SubjectsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const year = searchParams.get('year') as Year || 'السنة الثانية';
  const semester = searchParams.get('semester') as Semester || 'الفصل الأول';
  const type = searchParams.get('type') as SubjectTypeFilter || 'نظري';

  const filteredSubjects = useMemo(() => {
    if (!subjects || !Array.isArray(subjects)) return [];
    return subjects.filter(s => s.year === year && s.semester === semester && s.type.includes(type));
  }, [year, semester, type]);

  const getIconForType = (type: string) => {
    if (type.includes('عملي') && type.includes('نظري')) return <FlaskConical className="w-5 h-5" />;
    if (type.includes('عملي')) return <Beaker className="w-5 h-5" />;
    return <Book className="w-5 h-5" />;
  };

  return (
    <div className="flex-1 flex flex-col p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--color-pharma-accent)] rounded-full mix-blend-screen filter blur-[100px] opacity-10"></div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 relative z-10 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-2">
            <Book className="w-6 h-6 text-[var(--color-pharma-primary)]" />
            المواد الدراسية
          </h1>
          <p className="text-gray-400 text-sm">{year} - {semester} - {type}</p>
        </div>
        <button 
          onClick={() => navigate('/select')}
          className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-gray-300" />
        </button>
      </motion.div>

      <div className="flex-1 overflow-y-auto hide-scrollbar relative z-10 space-y-4 pb-10">
        {filteredSubjects.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p>لا توجد مواد مسجلة حالياً لهذه الفترة.</p>
          </div>
        ) : (
          filteredSubjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/subject/${subject.id}`, { state: { search: location.search } })}
              className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-[var(--color-pharma-primary)]/50 cursor-pointer transition-all duration-300 group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-pharma-primary)]/20 to-[var(--color-pharma-secondary)]/20 flex items-center justify-center text-[var(--color-pharma-primary)] group-hover:scale-110 transition-transform">
                  {getIconForType(subject.type)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-[var(--color-pharma-primary)] transition-colors">
                    {subject.name}
                  </h3>
                </div>
              </div>
              <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-[var(--color-pharma-primary)] group-hover:-translate-x-1 transition-all" />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
