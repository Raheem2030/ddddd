import React from 'react';
import { TextCardData } from '../../types';
import { cn } from '../../lib/utils';
import { FlaskConical, Atom, Pill, List, Flame, Hourglass, Image as ImageIcon, CheckCircle } from 'lucide-react';

interface TextCardProps {
  data: TextCardData;
}

export function TextCard({ data }: TextCardProps) {
  const getIcon = (iconName: string, colorClass: string) => {
    const props = { className: cn("w-6 h-6", colorClass) };
    switch (iconName) {
      case 'atom': return <Atom {...props} />;
      case 'capsule': return <Pill {...props} />;
      case 'list': return <List {...props} />;
      case 'flame': return <Flame {...props} />;
      case 'hourglass': return <Hourglass {...props} />;
      default: return <FlaskConical {...props} />;
    }
  };

  return (
    <div className={cn(
      "glass-panel rounded-3xl p-6 w-full h-full flex flex-col relative overflow-hidden",
      "border border-[#00F0FF]/30 shadow-[0_0_30px_rgba(0,240,255,0.1)] bg-[#0a0f1a]/60 backdrop-blur-2xl"
    )}>
      {/* Inner glow for the main card */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-[#00F0FF]/20 blur-2xl"></div>

      <h2 className="text-2xl font-bold mb-6 text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] border-b border-[#00F0FF]/20 pb-4 text-center">
        {data.title}
      </h2>
      
      <div className="flex-1 overflow-y-auto overscroll-y-contain hide-scrollbar pr-2">
        {data.subPanels ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
            {data.subPanels.map((panel, index) => {
              const isBlue = panel.color === 'blue';
              const borderColor = isBlue ? 'border-[#00F0FF]/40' : 'border-[#BC13FE]/40';
              const shadowColor = isBlue ? 'shadow-[inset_0_0_15px_rgba(0,240,255,0.15)]' : 'shadow-[inset_0_0_15px_rgba(188,19,254,0.15)]';
              const textColor = isBlue ? 'text-[#00F0FF]' : 'text-[#BC13FE]';
              const glowText = isBlue ? 'drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]' : 'drop-shadow-[0_0_5px_rgba(188,19,254,0.5)]';

              return (
                <div key={index} className={cn(
                  "rounded-2xl p-4 border bg-white/5 backdrop-blur-md flex flex-col gap-2 relative overflow-hidden",
                  borderColor, shadowColor
                )}>
                  {/* Subtle background glow for sub-panel */}
                  <div className={cn(
                    "absolute -right-4 -top-4 w-16 h-16 rounded-full blur-xl opacity-20",
                    isBlue ? "bg-[#00F0FF]" : "bg-[#BC13FE]"
                  )}></div>

                  <div className="flex items-center gap-3 z-10">
                    <div className={cn("p-2 rounded-xl bg-black/30 border", borderColor)}>
                      {getIcon(panel.icon, textColor)}
                    </div>
                    <h3 className={cn("font-bold text-lg", textColor, glowText)}>
                      {panel.title}
                    </h3>
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed z-10 mt-1">
                    {panel.content}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4 text-gray-200 text-lg leading-relaxed">
            {data.content?.map((paragraph, index) => (
              <div key={index} className="flex items-start gap-3">
                <FlaskConical className="w-5 h-5 mt-1 text-[var(--color-pharma-accent)] shrink-0" />
                <p>{paragraph}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Nav Bar inside TextCard */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Pill className="w-5 h-5 text-[#00F0FF] drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]" />
          <ImageIcon className="w-5 h-5 text-white/30" />
        </div>
        <span className="text-xs text-[#00F0FF]/70 font-medium tracking-wider">قسم الكبسولات</span>
      </div>
    </div>
  );
}
