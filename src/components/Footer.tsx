import React from 'react';
import { ALL_CATEGORIES, ProductCategory, SiteConfig, CategoryItem } from '../types';
import { MapPin, Phone, Mail } from 'lucide-react';

interface FooterProps {
  config: SiteConfig;
  onSelectCategory: (cat: ProductCategory | 'Todas') => void;
  onOpenAdmin: () => void;
  categories?: CategoryItem[];
}

export const Footer: React.FC<FooterProps> = ({ config, onSelectCategory, categories }) => {
  if (config.showFooterSection === false) return null;

  const logoUrl =
    'https://dcdn-us.mitiendanube.com/stores/007/559/575/themes/common/logo-8203784068678672232-1776122306-91b71bfeb080803c1a41aa5b86d255f61776122306-480-0.webp';

  const categoryList = categories && categories.length > 0
    ? categories.map((c) => c.name)
    : ALL_CATEGORIES;

  return (
    <footer className="bg-[#002d5a] text-[#f5f1e9] text-xs border-t border-[#004080] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <a href="#" onClick={(e) => { e.preventDefault(); onSelectCategory('Todas'); }}>
                <img
                  src={logoUrl}
                  alt="Logo Tienda Holística"
                  className="h-12 w-auto object-contain cursor-pointer"
                  title="Ir al inicio"
                />
              </a>
            </div>
            <p className="text-[#f5f1e9]/80 leading-relaxed">
              {config.footerAbout || 'Tienda holística dedicada al bienestar, aromaterapia y armonización de espacios. Envíos a todo el país y atención personalizada.'}
            </p>
            <div className="space-y-1.5 text-[#f5f1e9]/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#f5f1e9] shrink-0" />
                <span>{config.storeAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#f5f1e9] shrink-0" />
                <a href={`https://wa.me/${config.whatsappNumber}`} className="hover:underline">
                  {config.phone}
                </a>
              </div>
              {config.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#f5f1e9] shrink-0" />
                  <a href={`mailto:${config.email}`} className="hover:underline">
                    {config.email}
                  </a>
                </div>
              )}
            </div>

            {/* Social Links: Instagram & TikTok */}
            {(config.instagramUrl || config.tiktokUrl) && (
              <div className="pt-2 flex items-center gap-3">
                {config.instagramUrl && (
                  <a
                    href={config.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#004080] hover:bg-[#003060] text-white px-3.5 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-colors border border-blue-400/30"
                  >
                    <span>Instagram</span>
                  </a>
                )}
                {config.tiktokUrl && (
                  <a
                    href={config.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#004080] hover:bg-[#003060] text-white px-3.5 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-colors border border-blue-400/30"
                  >
                    <span>TikTok</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Categories Grid Column 1 */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white border-b border-blue-400/30 pb-1">
              Categorías Holísticas
            </h4>
            <ul className="space-y-1.5 text-[#f5f1e9]/80">
              {categoryList.slice(0, 6).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Grid Column 2 */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white border-b border-blue-400/30 pb-1">
              Más Productos
            </h4>
            <ul className="space-y-1.5 text-[#f5f1e9]/80">
              {categoryList.slice(6).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white border-b border-blue-400/30 pb-1">
              Información Comercial
            </h4>
            <ul className="space-y-2 text-[#f5f1e9]/80">
              <li>✨ Envíos a todo el país (Correo & Mensajería)</li>
              <li>🌿 Productos artesanales y naturales</li>
              <li>💳 Mercado Pago, Transferencia (10% OFF), Tarjetas, Efectivo</li>
              <li>📍 Atención y retiro en Parque Chacabuco, CABA</li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-8 border-t border-blue-400/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#f5f1e9]/70 gap-4">
          <p>© {new Date().getFullYear()} {config.footerCopyright || 'Tienda Holística Barmina. Todos los derechos reservados.'}</p>
          <div className="flex items-center gap-1">
            <span>Diseñado con luz & armonía en Parque Chacabuco, Buenos Aires</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
