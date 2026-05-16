import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Microscope, Leaf, TestTube, Layers, Beaker, Zap } from 'lucide-react';

type TissueId = 'meristematic' | 'protective' | 'parenchyma' | 'connective' | 'vascular' | 'secretory';

interface Experiment {
  goal: string;
  plantAr: string;
  plantLa: string;
  family: string;
  part: string;
  medium: string;
}

interface TissueCategory {
  id: TissueId;
  title: string;
  icon: React.ReactNode;
  experiments: Experiment[];
}

const CATEGORIES: TissueCategory[] = [
  {
    id: 'meristematic',
    title: 'النسج الميرستيمية',
    icon: <Zap className="w-5 h-5" />,
    experiments: [
      {
        goal: 'الدراسة العملية للنسج النباتية القسومة الثانوية، ورسمها.',
        plantAr: 'الكوسا',
        plantLa: 'Cucurbita pepo',
        family: 'القرعية (Cucurbitaceae)',
        part: 'الساق (مقطع عرضي)',
        medium: 'الغليسرين بعد التلوين المضاعف'
      }
    ]
  },
  {
    id: 'protective',
    title: 'النسج الواقية والبشرة',
    icon: <Layers className="w-5 h-5" />,
    experiments: [
      {
        goal: 'دراسة البشرة والثغور (ثنائيات الفلقة).',
        plantAr: 'لسان الحمل السناني',
        plantLa: 'Plantago lanceolata',
        family: 'الحملية (Plantaginaceae)',
        part: 'البشرة السفلى للورقة',
        medium: 'الماء'
      },
      {
        goal: 'دراسة البشرة والثغور (أحاديات الفلقة النجيلية).',
        plantAr: 'الذرة الحلوة',
        plantLa: 'Zea mays',
        family: 'النجيلية (Poaceae, Graminaceae)',
        part: 'البشرة السفلى للورقة',
        medium: 'الماء'
      },
      {
        goal: 'دراسة البشرة والثغور (أحاديات الفلقة السوسنية).',
        plantAr: 'السوسن الألماني',
        plantLa: 'Iris germanica',
        family: 'السوسنية (Iridaceae)',
        part: 'البشرة السفلى للورقة',
        medium: 'الماء'
      },
      {
        goal: 'دراسة الأوبار اللامسة النجمية.',
        plantAr: 'الزيتون',
        plantLa: 'Olea europaea',
        family: 'الزيتونية (Oleaceae)',
        part: 'البشرة السفلى للورقة',
        medium: 'الماء'
      },
      {
        goal: 'دراسة الأوبار اللامسة الطويلة.',
        plantAr: 'العطرشية (الغرنوق)',
        plantLa: 'Pelargonium graveolens',
        family: 'الغرنوقية (Geraniaceae)',
        part: 'معلاق الورقة',
        medium: 'الماء'
      }
    ]
  },
  {
    id: 'parenchyma',
    title: 'النسج البرانشيمية والادخارية',
    icon: <Leaf className="w-5 h-5" />,
    experiments: [
      {
        goal: 'دراسة النسيج البرانشيمي الادخاري والصانعات عديمة اللون أو صانعات النشاء.',
        plantAr: 'البطاطا',
        plantLa: 'Solanum tuberosum',
        family: 'الباذنجانية (Solanaceae)',
        part: 'الساق الدرنية',
        medium: 'الماء أو اليود اليودي'
      },
      {
        goal: 'دراسة النسيج البرانشيمي الادخاري وبلورات سكر الإنولين.',
        plantAr: 'الأضاليا',
        plantLa: 'Dahlia variabilis',
        family: 'المركبة (Compositae, Asteraceae)',
        part: 'الدرنات الجذرية',
        medium: 'الغليسرين والكحول'
      },
      {
        goal: 'دراسة النسيج البرانشيمي الادخاري وبلورات سكر الهيسبيريدوزيد.',
        plantAr: 'البرتقال',
        plantLa: 'Citrus aurantium',
        family: 'السذابية (Rutaceae)',
        part: 'غلاف الثمرة (مقطع عرضي)',
        medium: 'الغليسرين والكحول'
      },
      {
        goal: 'دراسة النسيج البرانشيمي الادخاري وحبات الألورون.',
        plantAr: 'الخروع',
        plantLa: 'Ricinus communis',
        family: 'الإفوربية (Euphorbiaceae)',
        part: 'سويداء البذرة',
        medium: 'اليود اليودي'
      },
      {
        goal: 'دراسة الصانعات الخضراء وبلورات حماضات الكالسيوم الإبرية.',
        plantAr: 'المكحلة (حشيشة الفي)',
        plantLa: 'Tradescantia virginiana',
        family: 'الكوميلينية (Commelinaceae)',
        part: 'الساق (مقطع طولي)',
        medium: 'الماء'
      },
      {
        goal: 'دراسة حماضات الكالسيوم القنفذية ثلاثية الماء (Druses).',
        plantAr: 'اللبلاب (حبل المساكين)',
        plantLa: 'Hedra helix',
        family: 'الآرالية (Araliaceae)',
        part: 'عنق الورقة (مقطع عرضي)',
        medium: 'الماء'
      }
    ]
  },
  {
    id: 'connective',
    title: 'النسج الدعامية',
    icon: <TestTube className="w-5 h-5" />,
    experiments: [
      {
        goal: 'دراسة النسيج الكولنشيمي الزاوي.',
        plantAr: 'النعنع',
        plantLa: 'Mentha piperta',
        family: 'الشفوية (Labiatae, Lamiaceae)',
        part: 'الساق (مقطع عرضي)',
        medium: 'الماء'
      },
      {
        goal: 'دراسة النسيج الكولنشيمي الزاوي.',
        plantAr: 'الشوندر',
        plantLa: 'Beta vulgaris',
        family: 'السرمقية (Chenopodiaceae)',
        part: 'عنق الورقة',
        medium: 'الماء'
      },
      {
        goal: 'دراسة الكولنشيم الدائري.',
        plantAr: 'البقدونس',
        plantLa: 'Petroselinum sativa',
        family: 'الخيمية (Apiaceae, Umbelliferae)',
        part: 'الساق',
        medium: 'الماء'
      },
      {
        goal: 'دراسة الخلايا السيكلريدية.',
        plantAr: 'السفرجل',
        plantLa: 'Cydonia oblonga',
        family: 'الوردية (Rosaceae)',
        part: 'الثمرة',
        medium: 'الماء'
      },
      {
        goal: 'دراسة الخلايا السيكلريدية.',
        plantAr: 'الأجاص',
        plantLa: 'Pyrus communis',
        family: 'الوردية (Rosaceae)',
        part: 'الثمرة',
        medium: 'الماء'
      }
    ]
  },
  {
    id: 'vascular',
    title: 'النسج الناقلة',
    icon: <Microscope className="w-5 h-5" />,
    experiments: [
      {
        goal: 'ملاحظة ورسم الأوعية الخشبية الحلقية والحلزونية.',
        plantAr: 'قثاء الحمار',
        plantLa: 'Ecballium elaterium',
        family: 'القرعية (Cucurbitaceae)',
        part: 'الساق (مقطع طولي)',
        medium: 'الماء'
      },
      {
        goal: 'ملاحظة ورسم الأوعية الخشبية العريضة الشبكية.',
        plantAr: 'القريص المحرق',
        plantLa: 'Urtica urens',
        family: 'القراصية (Urticaceae)',
        part: 'الساق (مقطع طولي)',
        medium: 'الماء'
      }
    ]
  },
  {
    id: 'secretory',
    title: 'النسج المفرزة',
    icon: <Beaker className="w-5 h-5" />,
    experiments: [
      {
        goal: 'دراسة البلورات العنقودية (الأكياس المتحجرة).',
        plantAr: 'تين المطاط (الكاوتشوك)',
        plantLa: 'Ficus elastic',
        family: 'التوتية (Moraceae)',
        part: 'الورقة (العرق الوسطي)',
        medium: 'الماء'
      },
      {
        goal: 'دراسة الأوبار المفرزة اللاسعة (تحوي حمض النمل).',
        plantAr: 'القريص المحرق',
        plantLa: 'Urtica urens',
        family: 'القراصية (Urticaceae)',
        part: 'الساق',
        medium: 'الماء'
      },
      {
        goal: 'دراسة الأوبار المفرزة العطرية (قطرات المينتول).',
        plantAr: 'النعنع البلدي',
        plantLa: 'Mentha viridis',
        family: 'الشفوية (Lamiaceae, Labiatae)',
        part: 'الورقة',
        medium: 'الماء'
      },
      {
        goal: 'دراسة القنوات المفرزة للراتنج.',
        plantAr: 'الصنوبر البروتي',
        plantLa: 'Pinus Prutia',
        family: 'الصنوبرية (Pinaceae)',
        part: 'الورقة (مقطع عرضي)',
        medium: 'الغليسرين (بعد التلوين المضاعف)'
      },
      {
        goal: 'دراسة الأوعية اللبنية المتفاغمة.',
        plantAr: 'الخس',
        plantLa: 'Lactuca sativa',
        family: 'المركبة (Asteraceae, Compositae)',
        part: 'الجذر أو الساق',
        medium: 'اليود اليودي'
      },
      {
        goal: 'دراسة الأوعية اللبنية غير المتفاغمة.',
        plantAr: 'الثوم',
        plantLa: 'Allium sativum',
        family: 'الزنبقية (Liliaceae)',
        part: 'الفص',
        medium: 'اليود اليودي'
      }
    ]
  }
];

export function Pharmacognosy1SummaryPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<TissueId>('meristematic');

  const selectedData = CATEGORIES.find(c => c.id === activeCategory);

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
          <h1 className="font-bold text-lg text-emerald-400">تجميعات عقاقير 1 عملي</h1>
          <p className="text-xs text-gray-400">
            ملخص التطبيقات العملية للنسج الستة
          </p>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 mt-4 overflow-hidden">
        
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-1/4 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl whitespace-nowrap transition-all duration-300 shadow-sm ${
                activeCategory === category.id 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${activeCategory === category.id ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                {category.icon}
              </div>
              <span className="font-bold">{category.title}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="w-full lg:w-3/4 pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gradient-to-l from-emerald-900/10 to-transparent mb-6">
                <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 shadow-lg shrink-0">
                  {selectedData?.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedData?.title}</h2>
                  <p className="text-sm text-gray-400">جميع التطبيقات العملية الخاصة بهذا النسيج</p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {selectedData?.experiments.map((exp, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="glass-panel bg-white/5 border border-white/10 p-5 rounded-3xl hover:border-emerald-500/30 transition-colors shadow-lg"
                  >
                    <h3 className="font-bold text-emerald-300 text-base mb-4 flex items-start gap-2 leading-relaxed">
                      <span className="bg-emerald-500/20 text-emerald-400 w-6 h-6 rounded-md flex items-center justify-center text-sm shrink-0 mt-0.5">{idx + 1}</span>
                      {exp.goal}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex flex-col bg-black/30 p-3 rounded-2xl border border-white/5">
                        <span className="text-xs text-gray-500 font-bold mb-1">النبات المدروس</span>
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-sm">{exp.plantAr}</span>
                          <span className="text-xs text-emerald-200/50 font-mono mt-0.5">{exp.plantLa}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black/30 p-3 rounded-2xl border border-white/5">
                          <span className="text-xs text-gray-500 font-bold mb-1 block">الفصيلة</span>
                          <span className="text-sm font-semibold text-gray-300 block">{exp.family}</span>
                        </div>
                        <div className="bg-black/30 p-3 rounded-2xl border border-white/5">
                          <span className="text-xs text-gray-500 font-bold mb-1 block">الجزء المدروس</span>
                          <span className="text-sm font-semibold text-emerald-200 block">{exp.part}</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-emerald-900/30 to-transparent border border-emerald-500/20 p-3 rounded-2xl">
                        <span className="text-xs text-emerald-500/70 font-bold mb-1 flex items-center gap-1">الوسط المستخدم</span>
                        <span className="text-sm font-bold text-emerald-400" title={exp.medium}>{exp.medium}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
      </main>
    </div>
  );
}
