import React from 'react';
import { ALL_CATEGORIES, ProductCategory, CategoryItem, SiteConfig } from '../types';

interface CategoryCardsProps {
  onSelectCategory: (category: ProductCategory) => void;
  productCountByCategory: Record<string, number>;
  categories?: CategoryItem[];
  config?: SiteConfig;
}

// Fallback images
const FALLBACK_IMAGES: Record<string, string> = {
  Sahumerios: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600',
  Difusores: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=600',
  Aromatizantes: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&q=80&w=600',
  Velas: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600',
  'Porta Sahumerios': 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=600',
  Accesorios: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=600',
  'Conos Cascada': 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=600'
};

export const CategoryCards: React.FC<CategoryCardsProps> = ({
  onSelectCategory,
  productCountByCategory,
  categories,
  config
}) => {
  if (config && config.showCategoriesSection === false) return null;
  const displayCategories: { name: string; description: string; imageUrl: string }[] =
    categories && categories.length > 0
      ? categories
      : ALL_CATEGORIES.map((catName) => ({
          name: catName,
          description: 'Encuentra productos seleccionados para esta categoría.',
          imageUrl:
            FALLBACK_IMAGES[catName] ||
            'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600'
        }));

  return (
    <section className="py-12 bg-[#f5f1e9] border-b border-[#004080]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#004080] bg-[#004080]/10 px-3 py-1 rounded-full border border-[#004080]/20">
            Nuestros Universos Holísticos
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#004080] mt-3">
            Explora por Categoría
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Encuentra los elementos ideales para tus rituales de limpieza energizantes, meditación y bienestar del hogar.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4 sm:gap-6">
          {displayCategories.map((item) => {
            const count = productCountByCategory[item.name] || 0;
            return (
              <button
                key={item.name}
                onClick={() => {
                  onSelectCategory(item.name);
                  const target = document.getElementById('productos');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative flex flex-col justify-end overflow-hidden rounded-2xl h-52 sm:h-60 bg-[#004080] shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left border border-[#004080]/20"
              >
                {/* Image background */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover filter brightness-[0.75] group-hover:scale-110 group-hover:brightness-[0.6] transition-all duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#004080] via-[#004080]/40 to-transparent" />

                {/* Content */}
                <div className="relative p-4 z-10 space-y-1">
                  <span className="inline-block text-[10px] uppercase font-bold text-[#f5f1e9] bg-[#004080]/80 px-2 py-0.5 rounded border border-white/30">
                    {count} {count === 1 ? 'producto' : 'productos'}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#f5f1e9] transition-colors leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-[#f5f1e9]/80 line-clamp-2 leading-tight">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
