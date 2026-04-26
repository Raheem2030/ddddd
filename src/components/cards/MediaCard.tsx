import React, { useState } from 'react';
import { ContentCard, MediaItem } from '../../types';
import { cn } from '../../lib/utils';
import { Image as ImageIcon, PlayCircle, BarChart2, Headphones, ArrowLeft, ExternalLink } from 'lucide-react';

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
            <div className="w-full relative z-20 p-4">
              <AudioPlayer url={selectedItem.url} />
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

function AudioPlayer({ url }: { url: string }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadAudio = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Fetch failed');
      const blob = await response.blob();
      setBlobUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Error fetching audio:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6 flex flex-col items-center gap-4 bg-black/40 rounded-2xl border border-white/5 backdrop-blur-md">
      {blobUrl ? (
        <div className="w-full flex justify-center flex-col items-center gap-4">
          <audio
            src={blobUrl}
            controls
            autoPlay
            playsInline
            className="w-full"
          />
        </div>
      ) : (
        <div className="text-center space-y-4">
          <Headphones className="w-12 h-12 mx-auto text-[var(--color-pharma-primary)] opacity-80" />
          <div>
            <p className="text-base font-bold text-gray-200">مقطع صوتي</p>
            <p className="text-sm text-gray-400 mt-2 max-w-[280px] mx-auto text-center leading-relaxed">
              لضمان عمل الصوت داخل تطبيق تيليجرام، يرجى الضغط على زر التحميل أدناه.
            </p>
          </div>
          
          <button
            onClick={loadAudio}
            disabled={loading}
            className="mx-auto bg-[var(--color-pharma-primary)] text-black font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity min-w-[180px]"
          >
            {loading ? (
              <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
            ) : (
              <PlayCircle className="w-5 h-5" />
            )}
            {loading ? 'جاري التحميل...' : 'تحميل وتشغيل'}
          </button>
          
          {error && (
             <p className="text-red-400 text-xs">تعذر التحميل المباشر، يرجى الفتح في المتصفح الخارجي.</p>
          )}
        </div>
      )}
      
      <a 
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex items-center gap-2 text-sm text-[var(--color-pharma-primary)] hover:opacity-80 transition-opacity bg-white/5 py-2 px-6 rounded-full border border-[var(--color-pharma-primary)]/30"
      >
        <ExternalLink className="w-4 h-4" />
        فتح في المتصفح الخارجي
      </a>
    </div>
  );
}
