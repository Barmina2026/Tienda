import React from 'react';
import {
  Truck,
  Store,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  PackageCheck,
  Heart,
  Award,
  Leaf,
  Star,
  CheckCircle2,
  LucideIcon
} from 'lucide-react';
import { SiteConfig } from '../types';

interface CommercialHighlightsProps {
  config: SiteConfig;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Truck,
  Store,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  PackageCheck,
  Heart,
  Award,
  Leaf,
  Star,
  CheckCircle2
};

export const CommercialHighlights: React.FC<CommercialHighlightsProps> = ({ config }) => {
  if (config.showCommercialHighlights === false) return null;

  const badge = config.highlightsBadge || '¿Por Qué Elegirnos?';
  const title = config.highlightsTitle || 'Calidad, Energía & Compromiso Holístico';
  const subtitle =
    config.highlightsSubtitle ||
    'Atendemos a nuestros clientes en todo el país con productos cuidadosamente seleccionados.';

  const items = [
    {
      title: config.highlight1Title || 'Envíos a Todo el País',
      desc:
        config.highlight1Desc ||
        'Despachamos rápidamente a todas las provincias por Correo Argentino, Andreani y mensajería.',
      iconName: config.highlight1Icon || 'Truck'
    },
    {
      title: config.highlight2Title || 'Atención Directa',
      desc:
        config.highlight2Desc ||
        'Insumos de primera línea para armonizar tu hogar o negocio con envíos rápidos.',
      iconName: config.highlight2Icon || 'Store'
    },
    {
      title: config.highlight3Title || '100% Natural & Artesanal',
      desc:
        config.highlight3Desc ||
        'Ingredientes puros, resinas naturales, aceites esenciales concentrados y cera de soja.',
      iconName: config.highlight3Icon || 'Sparkles'
    },
    {
      title: config.highlight4Title || 'Asesoramiento Personalizado',
      desc:
        config.highlight4Desc ||
        `Te asesoramos por WhatsApp (${config.phone}) para elegir las fragancias e insumos ideales.`,
      iconName: config.highlight4Icon || 'PhoneCall'
    }
  ];

  return (
    <section className="py-12 bg-[#004080] text-[#f5f1e9] relative overflow-hidden border-t border-b border-[#002d5a]">
      {/* Subtle background glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          {badge && (
            <span className="text-xs font-bold uppercase tracking-widest text-[#f5f1e9] bg-[#002d5a] px-3 py-1 rounded-full border border-blue-500/30">
              {badge}
            </span>
          )}
          {title && (
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-[#f5f1e9]/80 text-sm">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => {
            const IconComponent = ICON_MAP[item.iconName] || Sparkles;
            return (
              <div
                key={index}
                className="bg-[#002d5a]/60 backdrop-blur-md p-6 rounded-3xl border border-blue-500/30 hover:border-blue-400/50 transition-all space-y-3"
              >
                <div className="w-12 h-12 bg-[#004080] rounded-2xl flex items-center justify-center text-[#f5f1e9] shadow-inner">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-[#f5f1e9]/80 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

