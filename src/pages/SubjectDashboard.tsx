import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, BookOpen, Layers, CheckCircle, PlayCircle, FileText, BrainCircuit, BotMessageSquare, ArrowLeft, FlaskConical } from 'lucide-react';
import { subjects, subjectContents } from '../data';
import { AiAssistant } from '../components/AiAssistant';

export function SubjectDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'study' | 'resources' | 'quizzes' | 'ai'>('study');

  const subject = subjects.find(s => s.id === id);
  const content = subjectContents[id || ''];

  useEffect(() => {
    if (!subject) {
      navigate('/select');
    }
  }, [subject, navigate]);

  if (!subject) return null;

  const search = location.state?.search || `?year=${encodeURIComponent(subject.year)}&semester=${encodeURIComponent(subject.semester)}&type=نظري`;

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
          <h1 className="text-2xl font-black text-white mb-1">{subject.name}</h1>
          <p className="text-[var(--color-pharma-primary)] text-sm font-medium">{subject.year} - {subject.semester}</p>
        </div>
        <button 
          onClick={() => navigate(`/subjects${search}`)}
          className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-gray-300" />
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="px-6 relative z-10 mt-4">
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('study')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'study' 
                ? 'bg-[var(--color-pharma-primary)] text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'resources' 
                ? 'bg-[var(--color-pharma-secondary)] text-white shadow-[0_0_15px_rgba(188,19,254,0.4)]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'quizzes' 
                ? 'bg-[var(--color-pharma-accent)] text-black shadow-[0_0_15px_rgba(0,255,157,0.4)]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
              activeTab === 'ai' 
                ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BotMessageSquare className="w-4 h-4" />
            <span className="text-[9px] opacity-80 leading-none">(قريباً...)</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar p-6 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'study' && (
            <motion.div
              key="study"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                {content?.chapters.length ? (
                  content.chapters.map((chapter) => (
                    <button 
                      key={chapter.id}
                      onClick={() => navigate(`/subject/${subject.id}/chapter/${chapter.id}`)}
                      className="w-full text-right glass-panel rounded-3xl p-6 border border-[var(--color-pharma-primary)]/30 relative overflow-hidden group cursor-pointer hover:border-[var(--color-pharma-primary)] transition-all duration-300 block"
                    >
                      <div className="absolute -right-10 -top-10 w-32 h-32 bg-[var(--color-pharma-primary)]/10 rounded-full blur-2xl group-hover:bg-[var(--color-pharma-primary)]/30 transition-all duration-500"></div>
                      
                      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-[var(--color-pharma-primary)]" />
                        {chapter.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {chapter.description || 'استعرض الكبسولات المعرفية الخاصة بهذا الفصل.'}
                      </p>
                      
                      <div className="mt-4 flex items-center gap-2 text-[var(--color-pharma-primary)] text-sm font-bold">
                        <span>عرض الكبسولات</span>
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center text-gray-500 mt-10">
                    <p>المحتوى قيد الإعداد لهذه المادة.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'resources' && (
            <motion.div
              key="resources"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="space-y-4"
            >
              {content?.resources && content.resources.length > 0 ? (
                content.resources.map((resource) => (
                  <div key={resource.id} className="glass-panel rounded-2xl p-5 border border-white/10 flex items-center gap-4 hover:border-[var(--color-pharma-secondary)]/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-pharma-secondary)]/20 flex items-center justify-center text-[var(--color-pharma-secondary)] shrink-0">
                      {resource.type === 'pdf' ? <FileText className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{resource.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        {resource.size ? `${resource.size} • ` : ''}
                        {resource.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 mt-10">
                  <p>لا توجد ملفات أو مصادر متاحة حالياً.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'quizzes' && (
            <motion.div
              key="quizzes"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="space-y-4"
            >
              {content?.quizzes && content.quizzes.length > 0 ? (
                content.quizzes.map((quiz) => (
                  <button 
                    key={quiz.id} 
                    onClick={() => {
                      if (quiz.path) {
                        navigate(quiz.path);
                      }
                    }}
                    className="w-full text-right glass-panel rounded-2xl p-5 border border-white/10 flex items-center justify-between hover:border-[var(--color-pharma-accent)]/50 transition-colors cursor-pointer block"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--color-pharma-accent)]/20 flex items-center justify-center text-[var(--color-pharma-accent)] shrink-0">
                        {quiz.type === 'simulator' ? <FlaskConical className="w-6 h-6" /> : <BrainCircuit className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{quiz.title}</h4>
                        {quiz.type === 'simulator' ? (
                          <p className="text-xs text-[var(--color-pharma-accent)] mt-1">مخبر افتراضي تفاعلي</p>
                        ) : (
                          <p className="text-xs text-gray-400 mt-1">{quiz.questionCount} سؤال • {quiz.durationMinutes} دقيقة</p>
                        )}
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-gray-300 whitespace-nowrap">
                      {quiz.status === 'not_started' ? 'لم يبدأ' : quiz.status === 'in_progress' ? 'قيد الإنجاز' : 'مكتمل'}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center text-gray-500 mt-10">
                  <p>لا توجد اختبارات متاحة حالياً.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-center p-6 mt-10"
            >
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                <BotMessageSquare className="w-12 h-12 text-white/50" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">المساعد الذكي قريباً</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                نعمل على تطوير مساعد ذكي مخصص لمادة {subject.name} للإجابة على جميع استفساراتك وشرح المفاهيم المعقدة.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
