import React, { useState, useRef, useEffect } from 'react';
import { ContentCard, MediaItem } from '../../types';
import { cn } from '../../lib/utils';
import { Image as ImageIcon, PlayCircle, BarChart2, Headphones, ArrowLeft, Play, Pause, Volume2 } from 'lucide-react';

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
        
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-black/40 border border-[var(--color-pharma-glass-border)] relative group z-10 w-full">
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
            <CustomAudioPlayer url={selectedItem.url} />
          )}
          
          {selectedItem.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-30">
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

function CustomAudioPlayer({ url }: { url: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  useEffect(() => {
    // Reset state when URL changes
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    setErrorMsg(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  }, [url]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setErrorMsg(null);
      // Using a direct play call fixes issues in Telegram webviews requiring user interaction
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          setErrorMsg(`خطأ التشغيل: ${error.name} - ${error.message}`);
          console.error("Audio playback error:", error);
          // Fallback for Telegram iOS
          audioRef.current?.load();
          audioRef.current?.play().then(() => {
            setIsPlaying(true);
          }).catch(e => {
            console.log("فشل التشغيل النهائي:", e);
          });
        });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioError = (e: any) => {
    const error = e.target.error;
    let msg = "حدث خطأ غير معروف";
    if (error) {
      switch (error.code) {
        case 1: msg = "تم إلغاء جلب الملف."; break;
        case 2: msg = "حدث خطأ في الشبكة."; break;
        case 3: msg = "حدث خطأ في فك تشفير الصوت."; break;
        case 4: msg = `الملف غير موجود (404) أو الرابط خطأ أو محظور (CORS).`; break;
      }
    }
    setErrorMsg(msg);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md p-6 relative z-20 flex flex-col items-center gap-6">
      {errorMsg && (
        <div className="w-full p-3 mb-2 text-sm text-red-100 bg-red-900/80 border border-red-500 rounded-lg text-center" dir="rtl">
          {errorMsg}
        </div>
      )}
      
      <div className="w-20 h-20 rounded-full bg-[var(--color-pharma-primary)]/10 flex items-center justify-center border border-[var(--color-pharma-primary)]/30">
        <Headphones className="w-10 h-10 text-[var(--color-pharma-primary)]" />
      </div>
      
      <div className="w-full space-y-4">
        <audio
          ref={audioRef}
          src={url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          onError={handleAudioError}
          preload="auto"
          playsInline
          crossOrigin="anonymous"
        />
        
        <div className="flex items-center gap-4 dir-ltr" dir="ltr">
          <span className="text-xs text-gray-400 font-mono w-10 text-right">
            {formatTime(progress)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={progress}
            onChange={handleSeek}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--color-pharma-primary)]"
          />
          <span className="text-xs text-gray-400 font-mono w-10">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex justify-center mt-2">
          <button
            onClick={togglePlay}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-[var(--color-pharma-primary)] text-black hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-black" />
            ) : (
              <Play className="w-6 h-6 fill-black ml-1" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
