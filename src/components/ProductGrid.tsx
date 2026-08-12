import React, { useState, useMemo } from 'react';
import { ALL_CATEGORIES, ProductCategory, Product, SiteConfig } from '../types';
import { ProductCard } from './ProductCard';
import { Sparkles, SlidersHorizontal, SearchX, CheckCircle, Tag } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  selectedCategory: ProductCategory | 'Todas';
  onSelectCategory: (cat: ProductCategory | 'Todas') => void;
  searchTerm: string;
  saleType?: 'minorista' | 'mayorista';
  onAddToCart: (product: Product, quantity: number) => void;
  onQuickView: (product: Product) => void;
  config: SiteConfig;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onAddToCart,
  onQuickView,
  config
}) => {
  if (config.showProductCatalog === false) return null;
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Reset preview limit when filter/category changes
  React.useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategory, searchTerm]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
        const matchesSearch =
          !searchTerm ||
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.properties?.some((prop) => prop.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const priceA = a.priceMinorista;
        const priceB = b.priceMinorista;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, searchTerm, sortBy]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  return (
    <section id="productos" className="py-12 bg-[#f5f1e9] min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#004080]/15">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#004080]">
              Catálogo Holístico
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#004080] mt-1">
              {selectedCategory === 'Todas' ? 'Todos los Productos' : selectedCategory}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'producto disponible' : 'productos disponibles'}
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[#004080] font-medium">
              <SlidersHorizontal className="w-4 h-4 text-[#004080]" />
              <span>Ordenar por:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#004080] shadow-sm"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name">Nombre (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Quick Filter Pills */}
        <div className="py-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onSelectCategory('Todas')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'Todas'
                ? 'bg-[#004080] text-white font-bold shadow-sm'
                : 'bg-white text-slate-800 hover:bg-[#004080]/10'
            }`}
          >
            Todas
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#004080] text-white font-bold shadow-sm'
                  : 'bg-white text-slate-800 hover:bg-[#004080]/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onQuickView={onQuickView}
                />
              ))}
            </div>

            {/* Load More Preview Controls */}
            {filteredProducts.length > visibleCount && (
              <div className="mt-10 text-center space-y-3">
                <p className="text-xs text-slate-600 font-medium">
                  Mostrando adelanto de <span className="font-bold text-[#004080]">{displayedProducts.length}</span> de <span className="font-bold text-[#004080]">{filteredProducts.length}</span> productos
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                    className="px-6 py-3 bg-white border-2 border-[#004080] text-[#004080] font-bold text-xs rounded-full hover:bg-[#004080] hover:text-white transition-all shadow-sm flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Cargar Más Productos</span>
                  </button>
                  <button
                    onClick={() => setVisibleCount(filteredProducts.length)}
                    className="px-6 py-3 bg-[#004080] text-white font-bold text-xs rounded-full hover:bg-[#002d5a] transition-all shadow-sm"
                  >
                    Ver Catálogo Completo ({filteredProducts.length})
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-inner max-w-md mx-auto my-8 p-8 space-y-4">
            <SearchX className="w-12 h-12 text-[#004080] mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#004080]">
              No encontramos productos
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              Intenta cambiar la búsqueda o seleccionar otra categoría para explorar nuestra tienda holística.
            </p>
            <button
              onClick={() => {
                onSelectCategory('Todas');
              }}
              className="bg-[#004080] text-white px-5 py-2.5 rounded-full font-bold text-xs shadow hover:bg-[#002d5a] transition-colors"
            >
              Ver Todo el Catálogo
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
