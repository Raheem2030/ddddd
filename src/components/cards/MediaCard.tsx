import React, { useState } from 'react';
import { ContentCard, MediaItem } from '../../types';
import { cn } from '../../lib/utils';
import { Image as ImageIcon, PlayCircle, BarChart2, Headphones, ArrowLeft } from 'lucide-react';

interface MediaCardProps {
  data: ContentCard;
  hideWrapper?: boolean;
}

export function MediaCard({ data, hideWrapper }: MediaCardProps) {
  const items = data.items || [];
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(items.length === 1 ? items[0] : null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-6 h-6" />;
      case 'video': return <PlayCircle className="w-6 h-6" />;
      case 'audio': return <Headphones className="w-6 h-6" />;
      case 'diagram': return <BarChart2 className="w-6 h-6" />;
      default: return <ImageIcon className="w-6 h-6" />;
    }
  };

  const Content = selectedItem ? (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 border-b border-[var(--color-pharma-glass-border)] pb-4 z-10 relative">
          <h2 className="text-xl font-bold text-[var(--color-pharma-primary)] flex items-center gap-2">
            {getIcon(selectedItem.type)}
            {selectedItem.title}
          </h2>
          {items.length > 1 && (
            <button 
              onClick={() => setSelectedItem(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-black/40 border border-[var(--color-pharma-glass-border)] relative group z-10">
          {selectedItem.type === 'image' || selectedItem.type === 'diagram' ? (
            <img 
              src={selectedItem.url} 
              alt={selectedItem.title} 
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          ) : selectedItem.type === 'video' ? (
            <video 
              key={selectedItem.url}
              src={selectedItem.url} 
              controls 
              className="w-full h-full object-contain relative z-20"
              playsInline
            />
          ) : (
            <div className="w-full p-4 relative z-20">
              <audio 
                key={selectedItem.url}
                src={selectedItem.url}
                controls 
                className="w-full"
                preload="metadata"
                playsInline
                referrerPolicy="no-referrer"
              >
                متصفحك لا يدعم مشغل الصوت.
              </audio>
            </div>
          )}
          
          {selectedItem.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
              <p className="text-sm text-gray-200 text-center pointer-events-auto">{selectedItem.caption}</p>
            </div>
          )}
        </div>
      </div>
  ) : (
      <div className="w-full h-full flex flex-col z-10 relative">
        <h2 className="text-2xl font-bold mb-6 text-[var(--color-pharma-primary)] border-b border-[var(--color-pharma-glass-border)] pb-4 flex items-center gap-2">
          <ImageIcon className="w-6 h-6" />
          {data.title}
        </h2>
        
        <div className="flex-1 overflow-y-auto overscroll-y-contain hide-scrollbar space-y-4">
          {items.length > 0 ? items.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="w-full p-4 rounded-2xl border border-[var(--color-pharma-glass-border)] bg-white/5 hover:bg-white/10 transition-all flex items-center gap-4 group"
            >
              <div className="p-3 rounded-xl bg-[var(--color-pharma-primary)]/20 text-[var(--color-pharma-primary)] group-hover:scale-110 transition-transform">
                {getIcon(item.type)}
              </div>
              <div className="text-right flex-1">
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {item.type === 'image' ? 'صورة' : item.type === 'video' ? 'فيديو' : item.type === 'audio' ? 'صوت' : 'مخطط'}
                </p>
              </div>
            </button>
          )) : (
            <div className="flex-1 flex items-center justify-center relative mt-10">
              <p className="text-gray-500">لا يوجد وسائط لعرضها</p>
            </div>
          )}
        </div>
      </div>
  );

  if (hideWrapper) {
    return <div className="w-full h-full p-6">{Content}</div>;
  }

  return (
    <div className={cn(
      "glass-panel rounded-3xl p-6 w-full h-full flex flex-col relative",
      "border-t border-l border-opacity-20 border-white"
    )}>
       {Content}
    </div>
  );
}
