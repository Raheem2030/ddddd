import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FlaskConical, Flame, Droplet, Snowflake, RotateCcw, CheckCircle2, XCircle, Info, Beaker, AlertTriangle } from 'lucide-react';

type TestType = 'biuret' | 'copper_carbonate' | 'ninhydrin' | 'xanthoproteic' | 'hopkins_cole' | 'millon' | 'sakaguchi' | 'folin';
type SampleType = 'protein' | 'amino_acid_general' | 'tyrosine' | 'tryptophan' | 'arginine' | 'cysteine';
type AmountType = 'drops_2' | 'drops_5' | 'drops_10' | 'ml_0_5' | 'ml_1' | 'ml_2' | 'ml_3' | 'ml_4' | 'powder';

interface TestResult {
  color: string;
  description: string;
  isPositive: boolean;
  explanation: string;
}

const SAMPLES: Record<SampleType, { name: string; type: 'protein' | 'amino_acid' }> = {
  protein: { name: 'محلول بروتيني (ألبومين)', type: 'protein' },
  amino_acid_general: { name: 'حمض أميني عام (غلايسين)', type: 'amino_acid' },
  tyrosine: { name: 'تيروزين (حمض حلقي)', type: 'amino_acid' },
  tryptophan: { name: 'تريبتوفان (يحوي زمرة أندول)', type: 'amino_acid' },
  arginine: { name: 'أرجنين (يحوي زمرة غوانيدين)', type: 'amino_acid' },
  cysteine: { name: 'سيستيئين (يحوي كبريت)', type: 'amino_acid' }
};

const REAGENTS: Record<string, { name: string, color: string }> = {
  naoh_10: { name: 'NaOH 10%', color: 'bg-white/40' },
  naoh_20: { name: 'NaOH 20%', color: 'bg-white/50' },
  naoh_2: { name: 'NaOH 2%', color: 'bg-white/30' },
  cuso4: { name: 'CuSO4 2%', color: 'bg-blue-400' },
  cu_co3: { name: 'كربونات النحاس', color: 'bg-teal-700' },
  ninhydrin: { name: 'كاشف ننهدرين', color: 'bg-yellow-100' },
  hno3: { name: 'HNO3 كثيف', color: 'bg-yellow-500/50' },
  hopkins: { name: 'كاشف هوبكنز كول', color: 'bg-white/20' },
  h2so4: { name: 'H2SO4 مركز', color: 'bg-white/10' },
  millon: { name: 'كاشف ميلون', color: 'bg-red-200/50' },
  alpha_naphthol: { name: 'ألفا نافتول', color: 'bg-purple-200/50' },
  nabro: { name: 'هيبوبروميت الصوديوم', color: 'bg-yellow-200/50' },
  lead_acetate: { name: 'خلات الرصاص', color: 'bg-gray-200/50' }
};

const AMOUNTS: Record<AmountType, string> = {
  drops_2: 'قطرتين',
  drops_5: '5 قطرات',
  drops_10: '10 قطرات',
  ml_0_5: '0.5 مل',
  ml_1: '1 مل',
  ml_2: '2 مل',
  ml_3: '3 مل',
  ml_4: '4 مل',
  powder: 'مسحوق (بضع ذرات)'
};

interface StepDef {
  action: 'add_sample' | 'add_reagent' | 'heat' | 'cool';
  reagentId?: string;
  amount?: AmountType;
  desc: string;
}

const TESTS: Record<TestType, { name: string; steps: StepDef[] }> = {
  biuret: {
    name: 'تفاعل بايوريت',
    steps: [
      { action: 'add_sample', amount: 'ml_1', desc: 'إضافة 1 مل من العينة' },
      { action: 'add_reagent', reagentId: 'naoh_10', amount: 'ml_1', desc: 'إضافة 1 مل NaOH 10%' },
      { action: 'add_reagent', reagentId: 'cuso4', amount: 'drops_5', desc: 'إضافة 5 قطرات CuSO4' }
    ]
  },
  copper_carbonate: {
    name: 'تفاعل كربونات النحاس',
    steps: [
      { action: 'add_sample', amount: 'ml_1', desc: 'إضافة 1 مل من العينة' },
      { action: 'add_reagent', reagentId: 'cu_co3', amount: 'powder', desc: 'إضافة مسحوق كربونات النحاس' },
      { action: 'heat', desc: 'تسخين حتى الغليان' }
    ]
  },
  ninhydrin: {
    name: 'تفاعل الننهدرين',
    steps: [
      { action: 'add_sample', amount: 'ml_1', desc: 'إضافة 1 مل من العينة' },
      { action: 'add_reagent', reagentId: 'ninhydrin', amount: 'drops_10', desc: 'إضافة 10 قطرات ننهدرين' },
      { action: 'heat', desc: 'تسخين لمدة دقيقتين' }
    ]
  },
  xanthoproteic: {
    name: 'تفاعل الكسانتوبروتين',
    steps: [
      { action: 'add_sample', amount: 'ml_1', desc: 'إضافة 1 مل من العينة' },
      { action: 'add_reagent', reagentId: 'hno3', amount: 'ml_0_5', desc: 'إضافة 0.5 مل HNO3 كثيف' },
      { action: 'heat', desc: 'تسخين حتى الغليان' },
      { action: 'cool', desc: 'تبريد الأنبوب' },
      { action: 'add_reagent', reagentId: 'naoh_2', amount: 'ml_0_5', desc: 'إضافة 0.5 مل NaOH 2%' }
    ]
  },
  hopkins_cole: {
    name: 'تفاعل هوبكنز كول',
    steps: [
      { action: 'add_sample', amount: 'ml_1', desc: 'إضافة 1 مل من العينة' },
      { action: 'add_reagent', reagentId: 'hopkins', amount: 'ml_3', desc: 'إضافة 3 مل كاشف هوبكنز كول' },
      { action: 'add_reagent', reagentId: 'h2so4', amount: 'ml_4', desc: 'إضافة 4 مل H2SO4 مركز' }
    ]
  },
  millon: {
    name: 'تفاعل ميلون',
    steps: [
      { action: 'add_sample', amount: 'ml_2', desc: 'إضافة 2 مل من العينة' },
      { action: 'add_reagent', reagentId: 'millon', amount: 'ml_1', desc: 'إضافة 1 مل كاشف ميلون' },
      { action: 'heat', desc: 'تسخين بحذر' }
    ]
  },
  sakaguchi: {
    name: 'تفاعل ساكاغوشي',
    steps: [
      { action: 'add_sample', amount: 'ml_1', desc: 'إضافة 1 مل من العينة' },
      { action: 'add_reagent', reagentId: 'alpha_naphthol', amount: 'drops_2', desc: 'إضافة قطرتين ألفا نافتول' },
      { action: 'add_reagent', reagentId: 'nabro', amount: 'ml_1', desc: 'إضافة 1 مل هيبوبروميت الصوديوم' }
    ]
  },
  folin: {
    name: 'تفاعل فولن',
    steps: [
      { action: 'add_sample', amount: 'ml_2', desc: 'إضافة 2 مل من العينة' },
      { action: 'add_reagent', reagentId: 'naoh_20', amount: 'ml_1', desc: 'إضافة 1 مل NaOH 20%' },
      { action: 'heat', desc: 'تسخين حتى الغليان' },
      { action: 'add_reagent', reagentId: 'lead_acetate', amount: 'drops_5', desc: 'إضافة قطرات خلات الرصاص' }
    ]
  }
};

export function BiochemSimulatorPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'setup' | 'lab'>('setup');
  const [selectedSample, setSelectedSample] = useState<SampleType | null>(null);
  const [selectedTest, setSelectedTest] = useState<TestType | null>(null);
  
  // Lab State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [tubeLevel, setTubeLevel] = useState(10); // percentage
  const [tubeColor, setTubeColor] = useState('bg-white/10');
  const [mistake, setMistake] = useState<string | null>(null);
  const [result, setResult] = useState<TestResult | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  
  // Modals
  const [showAmountModal, setShowAmountModal] = useState<{type: 'sample' | 'reagent', id?: string} | null>(null);

  const startLab = () => {
    if (selectedSample && selectedTest) {
      setPhase('lab');
      resetLab();
    }
  };

  const resetLab = () => {
    setCurrentStepIndex(0);
    setTubeLevel(10);
    setTubeColor('bg-white/10');
    setMistake(null);
    setResult(null);
    setActiveAction(null);
  };

  const handleAction = (action: 'add_sample' | 'add_reagent' | 'heat' | 'cool', reagentId?: string, amount?: AmountType) => {
    if (mistake || result) return;

    const test = TESTS[selectedTest!];
    const expectedStep = test.steps[currentStepIndex];

    setActiveAction(action);
    setTimeout(() => setActiveAction(null), 1000);

    // Validate Action
    let isCorrect = true;
    let errorMsg = '';

    if (expectedStep.action !== action) {
      isCorrect = false;
      errorMsg = `إجراء خاطئ! كان يجب عليك: ${expectedStep.desc}`;
    } else if (action === 'add_reagent' && expectedStep.reagentId !== reagentId) {
      isCorrect = false;
      errorMsg = `مادة خاطئة! كان يجب عليك إضافة: ${REAGENTS[expectedStep.reagentId!].name}`;
    } else if ((action === 'add_sample' || action === 'add_reagent') && expectedStep.amount !== amount) {
      isCorrect = false;
      errorMsg = `كمية خاطئة! الكمية الصحيحة هي: ${AMOUNTS[expectedStep.amount!]}`;
    }

    if (!isCorrect) {
      setMistake(errorMsg);
      setTubeColor('bg-red-500/50');
      return;
    }

    // Success! Update visuals
    if (action === 'add_sample' || action === 'add_reagent') {
      setTubeLevel(prev => Math.min(prev + 15, 90));
      if (action === 'add_reagent') {
        // Mix colors roughly
        setTubeColor(REAGENTS[reagentId!].color);
      } else {
        setTubeColor('bg-white/20'); // Sample color
      }
    } else if (action === 'heat') {
      setTubeColor(prev => prev.replace('/50', '/80').replace('/20', '/40')); // Make it more intense
    }

    // Advance step
    if (currentStepIndex + 1 >= test.steps.length) {
      // Finished!
      setTimeout(() => {
        calculateResult(selectedSample!, selectedTest!);
      }, 1000);
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const calculateResult = (sample: SampleType, test: TestType) => {
    let res: TestResult = {
      color: 'bg-blue-200/20',
      description: 'لا يوجد تفاعل مميز (سلبي)',
      isPositive: false,
      explanation: 'لم يحدث التفاعل المطلوب مع هذا الكاشف.'
    };

    const isProtein = SAMPLES[sample].type === 'protein';

    switch (test) {
      case 'biuret':
        if (isProtein) {
          res = { color: 'bg-purple-500', description: 'لون بنفسجي', isPositive: true, explanation: 'تتفاعل كبريتات النحاس مع الروابط الببتيدية في البروتين.' };
        } else {
          res = { color: 'bg-blue-500', description: 'لون أزرق', isPositive: false, explanation: 'لا توجد روابط ببتيدية كافية، يبقى لون النحاس الأزرق.' };
        }
        break;
      case 'copper_carbonate':
        if (!isProtein) {
          res = { color: 'bg-blue-800', description: 'لون أزرق غامق', isPositive: true, explanation: 'تتفاعل الزمرة الكربوكسيلية والأمينية الحرة مع النحاس.' };
        }
        break;
      case 'ninhydrin':
        res = { color: 'bg-indigo-600', description: 'لون أزرق بنفسجي', isPositive: true, explanation: 'يتفاعل الننهدرين مع الزمرة الأمينية الحرة.' };
        break;
      case 'xanthoproteic':
        if (sample === 'tyrosine' || sample === 'tryptophan' || isProtein) {
          res = { color: 'bg-orange-500', description: 'لون برتقالي/أصفر', isPositive: true, explanation: 'تحدث نترجة للحلقة العطرية.' };
        }
        break;
      case 'hopkins_cole':
        if (sample === 'tryptophan' || isProtein) {
          res = { color: 'bg-fuchsia-600', description: 'حلقة بنفسجية محمرة', isPositive: true, explanation: 'تتفاعل زمرة الأندول مع حمض الغلايوكسيليك.' };
        }
        break;
      case 'millon':
        if (sample === 'tyrosine' || isProtein) {
          res = { color: 'bg-red-600', description: 'لون أحمر قرميدي', isPositive: true, explanation: 'يتفاعل التيروزين مع أملاح الزئبق.' };
        }
        break;
      case 'sakaguchi':
        if (sample === 'arginine' || isProtein) {
          res = { color: 'bg-red-800', description: 'لون أحمر غامق', isPositive: true, explanation: 'تتفاعل زمرة الغوانيدين مع ألفا نافتول.' };
        }
        break;
      case 'folin':
        if (sample === 'cysteine' || isProtein) {
          res = { color: 'bg-stone-900', description: 'راسب أسود', isPositive: true, explanation: 'يتشكل كبريتيد الرصاص (PbS) الأسود.' };
        }
        break;
    }

    setTubeColor(res.color);
    setResult(res);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white flex flex-col" dir="rtl">
      {/* Header */}
      <header className="p-4 border-b border-white/10 flex items-center gap-4 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <button 
          onClick={() => phase === 'lab' ? setPhase('setup') : navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-bold text-lg text-[#00F0FF]">المخبر الافتراضي التفاعلي</h1>
          <p className="text-xs text-gray-400">
            {phase === 'setup' ? 'تجهيز التجربة' : `${TESTS[selectedTest!].name} - ${SAMPLES[selectedSample!].name}`}
          </p>
        </div>
      </header>

      {phase === 'setup' ? (
        <main className="flex-1 p-4 w-full flex flex-col gap-6 max-w-2xl mx-auto mt-4">
          <div className="glass-panel rounded-2xl p-5 border border-white/10">
            <h2 className="font-bold mb-4 text-[#00F0FF]">1. اختر التفاعل المطلوب</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.entries(TESTS) as [TestType, typeof TESTS[TestType]][]).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTest(key)}
                  className={`p-3 rounded-xl text-sm font-bold text-right transition-all ${
                    selectedTest === key ? 'bg-[#00F0FF] text-black' : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  {data.name}
                </button>
              ))}
            </div>
          </div>

          <div className={`glass-panel rounded-2xl p-5 border transition-colors ${!selectedTest ? 'opacity-50 pointer-events-none border-white/10' : 'border-white/10'}`}>
            <h2 className="font-bold mb-4 text-[#BC13FE]">2. اختر العينة المجهولة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.entries(SAMPLES) as [SampleType, typeof SAMPLES[SampleType]][]).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setSelectedSample(key)}
                  className={`p-3 rounded-xl text-sm font-bold text-right transition-all ${
                    selectedSample === key ? 'bg-[#BC13FE] text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  {data.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startLab}
            disabled={!selectedSample || !selectedTest}
            className="w-full py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#00F0FF] to-[#BC13FE] text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            دخول المخبر
          </button>
        </main>
      ) : (
        <main className="flex-1 flex flex-col relative overflow-hidden">
          
          {/* Progress / Instructions */}
          <div className="bg-black/40 p-4 border-b border-white/10 flex flex-col items-center justify-center text-center z-10">
            {result ? (
              <h2 className="text-green-400 font-bold text-lg">اكتمل التفاعل!</h2>
            ) : mistake ? (
              <h2 className="text-red-400 font-bold text-lg">فشلت التجربة</h2>
            ) : (
              <>
                <h2 className="text-white font-bold mb-1">الخطوة {currentStepIndex + 1} من {TESTS[selectedTest!].steps.length}</h2>
                <p className="text-sm text-gray-400">ما هو الإجراء التالي الصحيح؟</p>
              </>
            )}
          </div>

          {/* Lab Bench Area */}
          <div className="flex-1 relative flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
            
            {/* The Tube */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-20 h-56 border-4 border-white/30 rounded-b-full rounded-t-sm relative overflow-hidden bg-white/5 backdrop-blur-md shadow-[inset_0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 ${activeAction === 'heat' ? 'shadow-[0_10px_50px_rgba(255,100,0,0.3)] border-orange-500/50' : ''}`}>
                {/* Liquid */}
                <motion.div 
                  className={`absolute bottom-0 left-0 w-full transition-colors duration-1000 ${tubeColor}`}
                  animate={{ height: `${tubeLevel}%` }}
                  transition={{ type: 'spring', bounce: 0.4 }}
                >
                  <div className="absolute top-0 left-0 w-full h-3 bg-white/30 rounded-full blur-[1px]"></div>
                  
                  {/* Boiling bubbles */}
                  {activeAction === 'heat' && (
                    <div className="absolute inset-0 flex items-end justify-around pb-2 opacity-50">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    </div>
                  )}
                </motion.div>
                <div className="absolute top-2 bottom-4 left-2 w-3 bg-white/20 rounded-full blur-[2px]"></div>
              </div>

              {/* Action Animations */}
              <AnimatePresence>
                {(activeAction === 'add_sample' || activeAction === 'add_reagent') && (
                  <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: -10 }} exit={{ opacity: 0 }} className="absolute -top-12 text-[#00F0FF]">
                    <Droplet className="w-8 h-8 animate-bounce" />
                  </motion.div>
                )}
                {activeAction === 'heat' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -bottom-12 text-orange-500">
                    <Flame className="w-10 h-10 animate-pulse" />
                  </motion.div>
                )}
                {activeAction === 'cool' && (
                  <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center text-blue-300">
                    <Snowflake className="w-16 h-16 animate-spin-slow opacity-50" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Result / Mistake Overlay */}
          <AnimatePresence>
            {mistake && (
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-32 left-4 right-4 bg-red-900/90 border border-red-500 rounded-2xl p-4 backdrop-blur-md z-20 shadow-2xl">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
                  <div>
                    <h3 className="font-bold text-white mb-1">خطأ في التجربة!</h3>
                    <p className="text-red-200 text-sm">{mistake}</p>
                    <button onClick={resetLab} className="mt-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" /> إعادة التجربة
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-32 left-4 right-4 bg-black/80 border border-[#00F0FF]/30 rounded-2xl p-5 backdrop-blur-xl z-20 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${result.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {result.isPositive ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                      النتيجة: <span className={result.isPositive ? 'text-green-400' : 'text-red-400'}>{result.description}</span>
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">{result.explanation}</p>
                    <button onClick={resetLab} className="bg-[#00F0FF]/20 text-[#00F0FF] hover:bg-[#00F0FF]/30 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" /> تجربة أخرى
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tools Panel (Bottom) */}
          <div className={`bg-black/60 border-t border-white/10 p-4 pb-6 transition-opacity ${mistake || result ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
              {/* Sample Button */}
              <button 
                onClick={() => setShowAmountModal({ type: 'sample' })}
                className="shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 min-w-[80px]"
              >
                <FlaskConical className="w-6 h-6 text-[#BC13FE]" />
                <span className="text-[10px] font-bold">العينة</span>
              </button>

              <div className="w-px bg-white/10 mx-1 shrink-0"></div>

              {/* Reagents */}
              {Object.entries(REAGENTS).map(([id, data]) => (
                <button 
                  key={id}
                  onClick={() => setShowAmountModal({ type: 'reagent', id })}
                  className="shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 min-w-[80px]"
                >
                  <Droplet className={`w-6 h-6 ${data.color.replace('bg-', 'text-').replace('/50','').replace('/40','').replace('/30','').replace('/20','').replace('/10','')}`} />
                  <span className="text-[10px] font-bold text-center leading-tight">{data.name}</span>
                </button>
              ))}

              <div className="w-px bg-white/10 mx-1 shrink-0"></div>

              {/* Actions */}
              <button 
                onClick={() => handleAction('heat')}
                className="shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 min-w-[80px]"
              >
                <Flame className="w-6 h-6 text-orange-500" />
                <span className="text-[10px] font-bold text-orange-500">تسخين</span>
              </button>
              <button 
                onClick={() => handleAction('cool')}
                className="shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 min-w-[80px]"
              >
                <Snowflake className="w-6 h-6 text-blue-400" />
                <span className="text-[10px] font-bold text-blue-400">تبريد</span>
              </button>
            </div>
          </div>

          {/* Amount Selection Modal */}
          <AnimatePresence>
            {showAmountModal && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setShowAmountModal(null)}
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                  className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-5 w-full max-w-sm shadow-2xl"
                  onClick={e => e.stopPropagation()}
                >
                  <h3 className="font-bold text-lg mb-4 text-center">
                    اختر الكمية لـ {showAmountModal.type === 'sample' ? 'العينة' : REAGENTS[showAmountModal.id!].name}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.entries(AMOUNTS) as [AmountType, string][]).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => {
                          if (showAmountModal.type === 'sample') {
                            handleAction('add_sample', undefined, key);
                          } else {
                            handleAction('add_reagent', showAmountModal.id, key);
                          }
                          setShowAmountModal(null);
                        }}
                        className="p-3 bg-white/5 hover:bg-[#00F0FF]/20 hover:text-[#00F0FF] rounded-xl text-sm font-bold transition-colors border border-white/5 hover:border-[#00F0FF]/50"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setShowAmountModal(null)}
                    className="w-full mt-4 p-3 text-gray-400 hover:text-white text-sm font-bold"
                  >
                    إلغاء
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      )}
    </div>
  );
}
