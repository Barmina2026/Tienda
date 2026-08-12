import React from 'react';
import { Sparkles, Phone } from 'lucide-react';
import { SiteConfig } from '../types';

interface AnnouncementBarProps {
  config: SiteConfig;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ config }) => {
  if (config.showAnnouncementBar === false) return null;
  return (
    <div className="bg-[#004080] text-[#f5f1e9] text-xs sm:text-sm py-2 px-4 shadow-inner border-b border-[#002d5a]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Main Text Message */}
        <div className="flex items-center gap-2 text-center md:text-left overflow-hidden">
          <Sparkles className="w-4 h-4 text-[#f5f1e9] shrink-0 animate-pulse" />
          <span className="font-medium tracking-wide truncate">
            {config.announcementText}
          </span>
        </div>

        {/* Right Contact Link */}
        <div className="flex items-center gap-4 text-xs shrink-0">
          <a
            href={`https://wa.me/${config.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors font-medium"
          >
            <Phone className="w-3.5 h-3.5 text-[#f5f1e9]" />
            <span>Consultas: {config.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
