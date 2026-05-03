import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FlaskConical, CheckCircle2, XCircle, RotateCcw, Droplets } from 'lucide-react';

type UnknownCompound = 'Albumin' | 'Casein' | 'Gelatin' | 'Tyr' | 'Trp' | 'Phe' | 'Arg' | 'Cys' | 'Gly';

const UNKNOWNS: Record<UnknownCompound, { name: string; type: string }> = {
  Albumin: { name: 'ألبومين (Albumin)', type: 'بروتين' },
  Casein: { name: 'كازئين (Casein)', type: 'بروتين' },
  Gelatin: { name: 'جيلاتين (Gelatin)', type: 'بروتين' },
  Tyr: { name: 'تيروزين (Tyr)', type: 'حمض أميني عطري' },
  Trp: { name: 'تريبتوفان (Trp)', type: 'حمض أميني عطري' },
  Phe: { name: 'فينيل ألانين (Phe)', type: 'حمض أميني عطري' },
  Arg: { name: 'أرجنين (Arg)', type: 'حمض أميني غوانيدي' },
  Cys: { name: 'سيستيئين (Cys)', type: 'حمض أميني كبريتي' },
  Gly: { name: 'غلايسين (Gly)', type: 'حمض أميني لا قطبي' },
};

const TESTS = [
  { id: 'biuret', name: 'بايوريت (Biuret)' },
  { id: 'xanthoproteic', name: 'كزانتوبروتين (Xanthoproteic)' },
  { id: 'folin', name: 'فولن (Folin)' },
  { id: 'millon', name: 'ميلون (Millon)' },
  { id: 'hopkins_cole', name: 'هوبكنز-كول (Hopkins-Cole)' },
  { id: 'sakaguchi', name: 'ساكاغوشي (Sakaguchi)' }
];

interface TestAttempt {
  id: string; // unique
  testId: string;
  testName: string;
  resultText: string;
  colorClass: string;
}

export function BiochemUnknownLabPage() {
  const navigate = useNavigate();
  
  const [currentUnknown, setCurrentUnknown] = useState<UnknownCompound>('Albumin');
  const [history, setHistory] = useState<TestAttempt[]>([]);
  const [tubeColor, setTubeColor] = useState('bg-white/10');
  const [guessState, setGuessState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [wrongGuess, setWrongGuess] = useState<string | null>(null);

  // Initialize with a random unknown
  const startNewUnknown = () => {
    const keys = Object.keys(UNKNOWNS) as UnknownCompound[];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    setCurrentUnknown(randomKey);
    setHistory([]);
    setTubeColor('bg-white/10');
    setGuessState('idle');
    setWrongGuess(null);
  };

  useEffect(() => {
    startNewUnknown();
  }, []);

  const runTest = (testId: string) => {
    if (guessState === 'correct') return;

    let color = '';
    let text = '';

    switch(testId) {
      case 'biuret':
        if (['Albumin', 'Casein', 'Gelatin'].includes(currentUnknown)) { color = 'bg-purple-600'; text = 'معقد بنفسجي (+)'; }
        else { color = 'bg-blue-500'; text = 'أزرق (-)'; }
        break;
        
      case 'xanthoproteic':
        if (['Albumin', 'Casein', 'Tyr', 'Trp', 'Phe'].includes(currentUnknown)) { color = 'bg-orange-500'; text = 'برتقالي (+)'; }
        else { color = 'bg-yellow-200'; text = 'أصفر / سلبي (-)'; }
        break;
        
      case 'folin':
        if (['Albumin', 'Cys'].includes(currentUnknown)) { color = 'bg-stone-900'; text = 'راسب أسود (+)'; }
        else { color = 'bg-white/20'; text = 'سلبي (-)'; }
        break;
        
      case 'sakaguchi':
        if (currentUnknown === 'Arg') { color = 'bg-red-800'; text = 'أحمر غامق (+)'; }
        else { color = 'bg-white/20'; text = 'سلبي (-)'; }
        break;
        
      case 'millon':
        if (currentUnknown === 'Tyr') { color = 'bg-red-600'; text = 'أحمر (+)'; }
        else { color = 'bg-white/20'; text = 'سلبي (-)'; }
        break;
        
      case 'hopkins_cole':
        if (currentUnknown === 'Trp') { color = 'bg-fuchsia-600'; text = 'بنفسجي محمر (+)'; }
        else { color = 'bg-white/20'; text = 'سلبي (-)'; }
        break;
    }

    setTubeColor(color);
    
    const testName = TESTS.find(t => t.id === testId)?.name || testId;
    
    // add to history if not exactly the last one to avoid spam
    if (history.length === 0 || history[history.length - 1].testId !== testId) {
      setHistory(prev => [...prev, { id: Math.random().toString(), testId, testName, resultText: text, colorClass: color }]);
    }
  };

  const handleGuess = (compKey: UnknownCompound) => {
    if (guessState === 'correct') return;
    
    if (compKey === currentUnknown) {
      setGuessState('correct');
      setWrongGuess(null);
    } else {
      setGuessState('wrong');
      setWrongGuess(UNKNOWNS[compKey].name);
      setTimeout(() => setGuessState('idle'), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white flex flex-col" dir="rtl">
      {/* Header */}
      <header className="p-4 border-b border-white/10 flex items-center gap-4 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-bold text-lg text-[#00F0FF]">اختبار كشف المجهول</h1>
          <p className="text-xs text-gray-400">
            مخبر افتراضي لتمييز الحموض الأمينية والبروتينات
          </p>
        </div>
      </header>

      <main className="flex-1 p-4 w-full flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto mt-4 overflow-hidden">
        
        {/* Left/Top Column: Visualization and Test buttons */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col items-center justify-center flex-1 min-h-[300px] relative overflow-hidden bg-black/40">
            <h2 className="absolute top-4 right-6 font-bold text-gray-300">مادة مجهولة</h2>
            
            {/* The Tube */}
            <div className="relative z-10 flex flex-col items-center mt-8">
              <div className="w-24 h-48 border-[6px] border-white/20 rounded-b-full rounded-t-sm relative overflow-hidden bg-white/5 backdrop-blur-sm shadow-[inset_0_0_30px_rgba(255,255,255,0.05)]">
                {/* Liquid */}
                <motion.div 
                  className={`absolute bottom-0 left-0 w-full transition-colors duration-500 h-3/4 ${tubeColor}`}
                  layout
                >
                  <div className="absolute top-0 left-0 w-full h-3 bg-white/30 rounded-full blur-[1px]"></div>
                </motion.div>
              </div>
            </div>

            {guessState === 'correct' && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex flex-col items-center justify-center z-20"
              >
                <div className="bg-green-900/80 border border-green-500 p-6 rounded-2xl text-center shadow-2xl">
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">إجابة صحيحة!</h3>
                  <p className="text-green-200 uppercase mb-4">المادة المجهولة هي: {UNKNOWNS[currentUnknown].name}</p>
                  <button 
                    onClick={startNewUnknown}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-xl transition-colors shadow-lg"
                  >
                    اختبار مجهول جديد
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-white/10">
            <h3 className="font-bold mb-3 text-sm text-gray-400">إجراء الكواشف (انقر للإضافة للأنبوب)</h3>
            <div className="grid grid-cols-2 gap-2">
              {TESTS.map(test => (
                <button
                  key={test.id}
                  onClick={() => runTest(test.id)}
                  disabled={guessState === 'correct'}
                  className="bg-white/5 hover:bg-white/10 disabled:opacity-50 border border-white/10 rounded-xl p-3 flex items-center gap-2 transition-colors text-right"
                >
                  <Droplets className="w-4 h-4 text-[#00F0FF] shrink-0" />
                  <span className="text-sm font-semibold">{test.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right/Bottom Column: History & Guessing */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          
          {/* Guessing Box */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-[#BC13FE]">حدد المادة المجهولة</h2>
              <button 
                onClick={startNewUnknown}
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors bg-white/5 px-3 py-1 rounded-lg"
              >
                <RotateCcw className="w-4 h-4" /> تغيير المجهول
              </button>
            </div>
            
            <AnimatePresence mode="wait">
              {guessState === 'wrong' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }}
                  className="mb-4 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <XCircle className="w-5 h-5 shrink-0" />
                  إجابة خاطئة! المادة المجهولة ليست {wrongGuess}. استمر بالتجارب!
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(Object.keys(UNKNOWNS) as UnknownCompound[]).map(compKey => (
                <button
                  key={compKey}
                  disabled={guessState === 'correct'}
                  onClick={() => handleGuess(compKey)}
                  className={`p-4 rounded-xl border transition-all text-right group relative overflow-hidden ${
                    guessState === 'correct' && compKey === currentUnknown 
                      ? 'bg-green-500/20 border-green-500' // the answer after correctness
                      : 'bg-white/5 border-white/10 hover:bg-[#BC13FE]/20 hover:border-[#BC13FE]/50 disabled:opacity-50'
                  }`}
                >
                  <div className={`absolute top-0 right-0 w-1 h-full transition-colors ${
                    guessState === 'correct' && compKey === currentUnknown ? 'bg-green-500' : 'bg-transparent group-hover:bg-[#BC13FE]'
                  }`}></div>
                  <h3 className="font-bold text-white relative z-10">{UNKNOWNS[compKey].name}</h3>
                  <p className="text-xs text-gray-400 mt-1 relative z-10">{UNKNOWNS[compKey].type}</p>
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 flex-1 flex flex-col min-h-[300px]">
            <h2 className="font-bold text-lg mb-4 text-gray-200">سجل الكواشف والنتائج</h2>
            
            {history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <FlaskConical className="w-12 h-12 mb-3 opacity-20" />
                <p>قم بإضافة الكواشف لملاحظة النتائج وتحديد المجهول</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                <AnimatePresence initial={false}>
                  {history.map((attempt) => (
                    <motion.div
                      key={attempt.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-gray-400 block mb-1">الكاشف المضاف</span>
                        <span className="font-bold text-[#00F0FF]">{attempt.testName}</span>
                      </div>
                      <div className="text-left flex items-center gap-3">
                        <div>
                          <span className="text-xs font-bold text-gray-400 block mb-1">النتيجة المُلاحظة</span>
                          <span className={`font-bold ${attempt.resultText.includes('-') ? 'text-gray-400' : 'text-white'}`}>
                            {attempt.resultText}
                          </span>
                        </div>
                        <div className={`w-8 h-8 rounded-full border border-white/20 shadow-inner ${attempt.colorClass}`} />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
