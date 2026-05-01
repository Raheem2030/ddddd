import React from 'react';
import { ContentCard } from '../../types';
import { cn } from '../../lib/utils';
import { FlaskConical, Atom, Pill, List, Flame, Hourglass, Image as ImageIcon, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';

interface TextCardProps {
  data: ContentCard;
  hideWrapper?: boolean;
}

export function TextCard({ data, hideWrapper }: TextCardProps) {
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

  const Content = (
    <>
      <h2 className="text-2xl font-bold mb-6 text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] border-b border-[#00F0FF]/20 pb-4 text-center px-12 z-10 relative">
        {data.title}
      </h2>
      
      <div className="flex-1 overflow-y-auto overscroll-y-contain hide-scrollbar pr-2 z-10 relative">
        {data.content && (
          <div className="text-gray-200 text-lg leading-relaxed mb-6 markdown-body" dir="rtl">
              <ReactMarkdown 
                remarkPlugins={[remarkMath, remarkGfm]} 
                rehypePlugins={[rehypeKatex]}
                components={{ 
                  table: ({node, ...props}) => <div className="w-full overflow-x-auto mb-4 border border-[#00F0FF]/15 rounded-lg"><table {...props} className="m-0 min-w-full" /></div>,
                  th: ({node, ...props}) => <th {...props}><div className="min-w-[150px]">{props.children}</div></th>,
                  td: ({node, ...props}) => <td {...props}><div className="min-w-[150px]">{props.children}</div></td>
                }}
              >
              {data.content.join('\n').replace(/• /g, '- ').replace(/•/g, '- ')}
            </ReactMarkdown>
          </div>
        )}

        {data.subPanels && (
          <div className={cn(
            "grid gap-4 pb-4",
            data.subPanels.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
          )}>
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
                    <div className={cn("p-2 rounded-xl bg-black/30 border shrink-0", borderColor)}>
                      {getIcon(panel.icon, textColor)}
                    </div>
                    <div className={cn("font-bold text-lg flex-1 min-w-0 break-words", textColor, glowText)}>
                      <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]} components={{ p: React.Fragment }}>
                        {panel.title}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <div className="text-white/90 text-sm leading-relaxed z-10 mt-1 markdown-body break-words" dir="rtl">
                    <ReactMarkdown 
                      remarkPlugins={[remarkMath, remarkGfm]} 
                      rehypePlugins={[rehypeKatex]}
                      components={{ 
                        table: ({node, ...props}) => <div className="w-full overflow-x-auto mb-4 border border-[#00F0FF]/15 rounded-lg"><table {...props} className="m-0 min-w-full" /></div>,
                        th: ({node, ...props}) => <th {...props}><div className="min-w-[150px]">{props.children}</div></th>,
                        td: ({node, ...props}) => <td {...props}><div className="min-w-[150px]">{props.children}</div></td>
                      }}
                    >
                      {panel.content.replace(/• /g, '- ').replace(/•/g, '- ')}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );

  if (hideWrapper) {
    return <div className="w-full h-full flex flex-col p-6">{Content}</div>;
  }

  return (
    <div className={cn(
      "glass-panel rounded-3xl p-6 w-full h-full flex flex-col relative overflow-hidden",
      "border border-[#00F0FF]/30 shadow-[0_0_30px_rgba(0,240,255,0.1)] bg-[#0a0f1a]/60 backdrop-blur-2xl"
    )}>
      {/* Inner glow for the main card */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-[#00F0FF]/20 blur-2xl"></div>

      {Content}
    </div>
  );
}
