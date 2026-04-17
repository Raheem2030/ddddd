import React, { useState } from 'react';
import { ContentCard } from '../../types';
import { AlignRight, Image as ImageIcon, Video, Mic, Edit3, FlaskConical, Link2 } from 'lucide-react';
import { TextCard } from './TextCard';
import { MediaCard } from './MediaCard';
import { InteractiveCard } from './InteractiveCard';
import { SimulatorCard } from './SimulatorCard';

interface UnifiedCardProps {
  data: ContentCard;
}

type TabType = 'text' | 'image' | 'video' | 'audio' | 'interactive' | 'simulator';

export function UnifiedCard({ data }: UnifiedCardProps) {
  // Determine available tabs based on provided data
  const availableTabs: { type: TabType; icon: React.ReactNode; label: string }[] = [];
  
  if (data.content || data.subPanels || data.type === 'text') {
    availableTabs.push({ type: 'text', icon: <Link2 className="w-5 h-5" />, label: 'نص' }); // The image shows a link icon highlighted for text, wait, let's use AlignRight
    // Actually the image shows a link icon, an image icon. Let's use Link2 for text? Or AlignRight. AlignRight is better for text.
    // Actually I'll use Link2 just to match the screenshot if that was text, but let's use a clear one.
  }
  
  if (data.items?.some(i => i.type === 'image' || i.type === 'diagram') || (data.type === 'media' && !data.items?.some(i => i.type !== 'image' && i.type !== 'diagram'))) {
    availableTabs.push({ type: 'image', icon: <ImageIcon className="w-5 h-5" />, label: 'صورة' });
  }
  
  if (data.items?.some(i => i.type === 'video')) {
    availableTabs.push({ type: 'video', icon: <Video className="w-5 h-5" />, label: 'فيديو' });
  }

  if (data.items?.some(i => i.type === 'audio')) {
    availableTabs.push({ type: 'audio', icon: <Mic className="w-5 h-5" />, label: 'صوت' });
  }
  
  if (data.question || data.options || data.type === 'interactive') {
    availableTabs.push({ type: 'interactive', icon: <Edit3 className="w-5 h-5" />, label: 'تفاعلي' });
  }
  
  if (data.simulatorId || data.type === 'simulator') {
    availableTabs.push({ type: 'simulator', icon: <FlaskConical className="w-5 h-5" />, label: 'مخبر' });
  }

  // Ensure at least one tab exists
  if (availableTabs.length === 0 && data.type) {
     if (data.type === 'media') availableTabs.push({ type: 'image', icon: <ImageIcon className="w-5 h-5" />, label: 'صور' });
     else availableTabs.push({ type: data.type as TabType, icon: <AlignRight className="w-5 h-5" />, label: 'نص' });
  }

  // Set initial tab based on the original designated type (or first available)
  let initialTab = availableTabs.find(t => t.type === data.type)?.type || availableTabs[0]?.type || 'text';
  if (data.type === 'media' && !availableTabs.find(t => t.type === 'media')) {
      initialTab = availableTabs.find(t => ['image', 'video', 'audio'].includes(t.type))?.type || 'image';
  }

  const [activeTab, setActiveTab] = useState<TabType>(initialTab as TabType);

  return (
    <div className="w-full h-full flex flex-col relative rounded-[2.5rem] bg-[#0a0f1a]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300">
      
      {/* Dynamic Background Glow based on active tab */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-4 blur-2xl transition-all duration-500 ${
        activeTab === 'text' ? 'bg-[#00F0FF]/20' : 
        activeTab === 'image' || activeTab === 'video' || activeTab === 'audio' ? 'bg-[#BC13FE]/20' : 
        activeTab === 'interactive' ? 'bg-[#00FF9D]/20' : 'bg-[#00F0FF]/20'
      }`}></div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 relative z-10 w-full overflow-hidden">
        {activeTab === 'text' && <TextCard data={data} hideWrapper={true} />}
        {activeTab === 'image' && <MediaCard data={{...data, items: data.items?.filter(i => i.type === 'image' || i.type === 'diagram') || []}} hideWrapper={true} />}
        {activeTab === 'video' && <MediaCard data={{...data, items: data.items?.filter(i => i.type === 'video') || []}} hideWrapper={true} />}
        {activeTab === 'audio' && <MediaCard data={{...data, items: data.items?.filter(i => i.type === 'audio') || []}} hideWrapper={true} />}
        {activeTab === 'interactive' && <InteractiveCard data={data} hideWrapper={true} />}
        {activeTab === 'simulator' && <SimulatorCard data={data} hideWrapper={true} />}
      </div>

      {/* Bottom Bar: Tab Navigation */}
      <div className="p-3 bg-[#0a0f1a] border-t border-[var(--color-pharma-glass-border)] z-20 flex items-center justify-between pb-4">
        
        {/* Right Side: Tab Icons (in Arabic RTL this is left side typically or right? We use dir="rtl" above so flex-row will place them right-to-left) */}
        {/* Let's layout: Left side (text "قسم الكبسولات"), Right side (Icons) */}
        
        <div className="text-[#00F0FF]/60 text-xs font-bold px-2 tracking-wider">
          قسم الكبسولات
        </div>

        <div className="flex items-center gap-1 bg-white/5 rounded-2xl p-1 backdrop-blur-sm border border-white/5">
          {availableTabs.map((tab) => {
            const isActive = activeTab === tab.type;
            
            // Tab Color Theme
            let activeColor = "text-[#00F0FF] bg-[#00F0FF]/20";
            let shadowColor = "shadow-[0_0_15px_rgba(0,240,255,0.4)]";
            if (['image', 'video', 'audio'].includes(tab.type)) {
              activeColor = "text-[#BC13FE] bg-[#BC13FE]/20";
              shadowColor = "shadow-[0_0_15px_rgba(188,19,254,0.4)]";
            } else if (tab.type === 'interactive') {
              activeColor = "text-[#00FF9D] bg-[#00FF9D]/20";
              shadowColor = "shadow-[0_0_15px_rgba(0,255,157,0.4)]";
            }

            return (
              <button
                key={tab.type}
                onClick={() => setActiveTab(tab.type)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? `${activeColor} ${shadowColor}` 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                title={tab.label}
              >
                {/* For text we'll use a link icon if that's what user prefers, but AlignRight is safer. The user screenshot had Link. Let's use Link2 and Image. */}
                {tab.type === 'text' ? <Link2 className="w-5 h-5" /> : tab.icon}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
