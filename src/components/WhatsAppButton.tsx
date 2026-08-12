import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SiteConfig } from '../types';

interface WhatsAppButtonProps {
  config: SiteConfig;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ config }) => {
  if (config.showWhatsAppButton === false) return null;
  const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
    '✨ Hola Barmina Tienda Holística, quisiera realizar una consulta...'
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center gap-2 group border-2 border-white/80 animate-bounce-slow"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-xs font-bold pl-0 group-hover:pl-1">
        Consultar por WhatsApp
      </span>
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#f5f1e9] rounded-full border-2 border-white animate-ping" />
    </a>
  );
};
