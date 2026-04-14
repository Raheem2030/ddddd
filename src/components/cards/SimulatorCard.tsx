import React, { useState, useMemo } from 'react';
import { Activity, Droplet } from 'lucide-react';
import { SimulatorCardData } from '../../types';
import { cn } from '../../lib/utils';

// ثوابت المواد بناءً على المحاضرة
// الميل (Slope) = التركيز تقسيم انخفاض درجة الانجماد
const DRUGS_DATA: Record<string, { id: string, name: string, maxConc: number, slope: number }> = {
  resorcinol: { id: 'resorcinol', name: 'ريزوسين (Resorcinol)', maxConc: 30, slope: 25 / 0.4 },     // 62.5
  boric: { id: 'boric', name: 'حمض البور (Boric Acid)', maxConc: 15, slope: 10 / 0.28 },       // 35.71
  borax: { id: 'borax', name: 'بوراكس (Borax)', maxConc: 10, slope: 3 / 0.09 }            // 33.33
};

const NACL_SLOPE = 9 / 0.52; // ~17.307

interface SimulatorCardProps {
  data: SimulatorCardData;
}

export function SimulatorCard({ data }: SimulatorCardProps) {
  const [selectedDrugId, setSelectedDrugId] = useState('resorcinol');
  const [conc, setConc] = useState(25);

  const selectedDrug = DRUGS_DATA[selectedDrugId];

  // الحسابات الديناميكية
  const { currentDT, neededNaCl } = useMemo(() => {
    // 1. حساب انخفاض درجة الانجماد (ΔT)
    const dt = conc / selectedDrug.slope;
    
    // 2. حساب كلور الصوديوم اللازم (من الخط المعكوس)
    const neededDT = 0.52 - dt;
    const nacl = neededDT > 0 ? neededDT * NACL_SLOPE : 0;

    return { currentDT: dt, neededNaCl: nacl };
  }, [conc, selectedDrug]);

  const handleDrugChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDrug = DRUGS_DATA[e.target.value];
    setSelectedDrugId(newDrug.id);
    setConc(newDrug.maxConc / 2); // وضع القيمة في المنتصف افتراضياً
  };

  // --------------------------------------------------------
  // دوال الرسم البياني (SVG النقي ليكون خفيفاً جداً ولا يحتاج مكتبات)
  // --------------------------------------------------------
  const SVG_W = 400;
  const SVG_H = 260;
  const PAD_X = 45;
  const PAD_Y = 30;
  const INNER_W = SVG_W - PAD_X * 2;
  const INNER_H = SVG_H - PAD_Y * 2;

  const mapX = (x: number) => PAD_X + (x / 0.6) * INNER_W;
  const mapY = (y: number) => SVG_H - PAD_Y - (y / 30) * INNER_H;

  // حساب نهاية خط المادة الدوائية
  let endY = Math.min(30, 0.6 * selectedDrug.slope);
  let endX = endY / selectedDrug.slope;

  return (
    <div className={cn(
      "glass-panel rounded-3xl w-full h-full flex flex-col relative overflow-hidden",
      "border border-[#00F0FF]/30 shadow-[0_0_30px_rgba(0,240,255,0.1)] bg-[#0a0f1a]/60 backdrop-blur-2xl"
    )}>
      {/* Inner glow for the main card */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-[#00F0FF]/20 blur-2xl"></div>

      {/* رأس التطبيق */}
      <div className="bg-gradient-to-b from-[#00F0FF]/20 to-transparent text-white p-5 text-center shadow-md border-b border-[#00F0FF]/20">
        <Activity className="w-8 h-8 mx-auto mb-2 text-[#00F0FF]" />
        <h1 className="text-xl font-bold text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">{data.title}</h1>
        <p className="text-xs text-white/70 mt-1">الطريقة البيانية - صيدلانيات</p>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-y-contain hide-scrollbar p-5 space-y-5">
        
        {/* أدوات التحكم */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-bold text-white/90 mb-2">المادة الدوائية:</label>
            <select 
              value={selectedDrugId}
              onChange={handleDrugChange}
              className="w-full p-2.5 rounded-xl border border-white/20 bg-[#0a0f1a] text-white focus:ring-2 focus:ring-[#00F0FF] outline-none transition-all font-medium"
            >
              {Object.values(DRUGS_DATA).map(drug => (
                <option key={drug.id} value={drug.id}>{drug.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-white/90">التركيز (غ/كغ):</label>
              <span className="text-[#00F0FF] font-bold bg-[#00F0FF]/10 px-2 py-1 rounded-lg text-sm border border-[#00F0FF]/30">
                {conc.toFixed(1)}
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max={selectedDrug.maxConc} 
              step="0.5" 
              value={conc}
              onChange={(e) => setConc(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
            />
          </div>
        </div>

        {/* الرسم البياني التفاعلي */}
        <div className="bg-white/5 p-3 rounded-2xl border border-white/10 shadow-sm relative overflow-hidden">
          <h3 className="text-xs font-bold text-white/50 mb-2 text-center">الرسم البياني التفاعلي</h3>
          <div className="w-full overflow-hidden" style={{ aspectRatio: `${SVG_W}/${SVG_H}` }}>
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-full overflow-visible">
              
              {/* الشبكة الخلفية */}
              {[10, 20, 30].map(tick => (
                <line key={`y-grid-${tick}`} x1={PAD_X} y1={mapY(tick)} x2={SVG_W - PAD_X} y2={mapY(tick)} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              ))}
              {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6].map(tick => (
                <line key={`x-grid-${tick}`} x1={mapX(tick)} y1={PAD_Y} x2={mapX(tick)} y2={SVG_H - PAD_Y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              ))}

              {/* المحاور */}
              <line x1={PAD_X} y1={mapY(0)} x2={SVG_W - PAD_X + 10} y2={mapY(0)} stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              <line x1={PAD_X} y1={mapY(0)} x2={PAD_X} y2={PAD_Y - 10} stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              
              {/* تسميات المحاور */}
              {[10, 20, 30].map(tick => (
                <text key={`y-lbl-${tick}`} x={PAD_X - 10} y={mapY(tick)} fill="rgba(255,255,255,0.5)" fontSize="11" textAnchor="end" alignmentBaseline="middle" fontFamily="sans-serif">{tick}</text>
              ))}
              {[0.1, 0.3, 0.5].map(tick => (
                <text key={`x-lbl-${tick}`} x={mapX(tick)} y={SVG_H - PAD_Y + 18} fill="rgba(255,255,255,0.5)" fontSize="11" textAnchor="middle" fontFamily="sans-serif">{tick}</text>
              ))}
              <text x={SVG_W/2} y={SVG_H - 2} fill="rgba(255,255,255,0.7)" fontSize="12" fontWeight="bold" textAnchor="middle">انخفاض درجة الانجماد (ΔT)</text>
              <text x={12} y={SVG_H/2} fill="rgba(255,255,255,0.7)" fontSize="12" fontWeight="bold" textAnchor="middle" transform={`rotate(-90 12 ${SVG_H/2})`}>التركيز (غ/كغ)</text>

              {/* خط كلور الصوديوم (المعكوس) */}
              <line x1={mapX(0)} y1={mapY(9)} x2={mapX(0.52)} y2={mapY(0)} stroke="#00F0FF" strokeWidth="3" strokeLinecap="round" />
              <text x={mapX(0.52) - 10} y={mapY(0) - 10} fill="#00F0FF" fontSize="11" fontWeight="bold">NaCl</text>

              {/* خط المادة الدوائية */}
              <line x1={mapX(0)} y1={mapY(0)} x2={mapX(endX)} y2={mapY(endY)} stroke="#BC13FE" strokeWidth="3" strokeLinecap="round" />
              <text x={mapX(endX) - 10} y={mapY(endY) + 15} fill="#BC13FE" fontSize="11" fontWeight="bold">المادة</text>

              {/* خط الإسقاط العمودي */}
              <line 
                x1={mapX(currentDT)} y1={mapY(conc)} 
                x2={mapX(currentDT)} y2={mapY(neededNaCl > 0 ? neededNaCl : 0)} 
                stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="5,5" 
              />
              <line 
                x1={mapX(0)} y1={mapY(conc)} 
                x2={mapX(currentDT)} y2={mapY(conc)} 
                stroke="#BC13FE" strokeWidth="1" strokeDasharray="3,3" opacity="0.5"
              />

              {/* النقاط التفاعلية */}
              <circle cx={mapX(currentDT)} cy={mapY(conc)} r="6" fill="#BC13FE" className="transition-all duration-300" />
              <circle cx={mapX(currentDT)} cy={mapY(conc)} r="12" fill="#BC13FE" opacity="0.2" className="animate-pulse" />
              
              {neededNaCl > 0 && (
                <>
                  <line 
                    x1={mapX(0)} y1={mapY(neededNaCl)} 
                    x2={mapX(currentDT)} y2={mapY(neededNaCl)} 
                    stroke="#00FF9D" strokeWidth="1" strokeDasharray="3,3" opacity="0.5"
                  />
                  <circle cx={mapX(currentDT)} cy={mapY(neededNaCl)} r="6" fill="#00FF9D" className="transition-all duration-300" />
                  <circle cx={mapX(currentDT)} cy={mapY(neededNaCl)} r="12" fill="#00FF9D" opacity="0.2" />
                </>
              )}
            </svg>
          </div>
        </div>

        {/* بطاقات النتائج */}
        <div className="grid grid-cols-2 gap-3 pb-4">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 shadow-sm text-center flex flex-col items-center justify-center">
            <p className="text-[10px] text-white/60 font-bold mb-1">انخفاض درجة الانجماد (ΔT)</p>
            <p className="text-xl font-black text-[#BC13FE] tracking-tight">{currentDT.toFixed(3)}°</p>
          </div>
          
          <div className={cn(
            "p-3 rounded-2xl border shadow-sm text-center flex flex-col items-center justify-center transition-colors duration-300",
            neededNaCl > 0 ? 'bg-[#00FF9D]/10 border-[#00FF9D]/30' : 'bg-white/5 border-white/10'
          )}>
            <Droplet className={cn("w-5 h-5 mb-1", neededNaCl > 0 ? 'text-[#00FF9D]' : 'text-white/40')} />
            <p className={cn("text-[10px] font-bold mb-1", neededNaCl > 0 ? 'text-[#00FF9D]/80' : 'text-white/50')}>
              NaCl المضاف (غ/كغ)
            </p>
            <p className={cn("text-lg font-black tracking-tight", neededNaCl > 0 ? 'text-[#00FF9D]' : 'text-white/40')}>
              {neededNaCl > 0 ? neededNaCl.toFixed(3) : 'لا يحتاج'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
