import React, { useState, useRef } from 'react';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { ALL_CATEGORIES, ProductCategory, CategoryItem } from '../types';

interface NavbarProps {
  selectedCategory: ProductCategory | 'Todas';
  onSelectCategory: (cat: ProductCategory | 'Todas') => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  categories?: CategoryItem[];
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  cartCount,
  onOpenCart,
  categories
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoUrl =
    'https://dcdn-us.mitiendanube.com/stores/007/559/575/themes/common/logo-8203784068678672232-1776122306-91b71bfeb080803c1a41aa5b86d255f61776122306-480-0.webp';

  const categoryList = categories && categories.length > 0
    ? categories.map((c) => c.name)
    : ALL_CATEGORIES;

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelectCategory('Todas');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#f5f1e9]/95 backdrop-blur-md border-b border-[#004080]/15 shadow-sm transition-all">
      {/* Upper Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile menu trigger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#004080] p-2 hover:bg-[#004080]/10 rounded-lg transition-colors"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Official Logo Only (Without Barmina Text) */}
          <div className="flex-shrink-0 flex items-center">
            <a
              href="#"
              onClick={handleLogoClick}
              className="flex items-center group cursor-pointer"
              title="Ir al inicio"
            >
              <img
                src={logoUrl}
                alt="Logo Tienda Holística"
                className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </a>
          </div>

          {/* Search Bar - Desktop & Tablet */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <input
              type="text"
              placeholder="Buscar sahumerios, difusores, velas, esencias..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/90 border border-slate-300 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004080] focus:border-transparent transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-[#004080] absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#004080] hover:underline font-semibold"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Cart Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-[#004080] hover:bg-[#002d5a] text-white px-4 py-2.5 rounded-full shadow-md transition-all transform hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5 text-[#f5f1e9]" />
              <span className="font-semibold text-sm hidden sm:inline">Carrito</span>
              {cartCount > 0 && (
                <span className="bg-[#f5f1e9] text-[#004080] font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-slate-300 text-slate-800 text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#004080]"
            />
            <Search className="w-3.5 h-3.5 text-[#004080] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Categories Desktop Bar */}
      <nav className="hidden lg:block bg-[#004080]/5 border-t border-[#004080]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto py-2.5 no-scrollbar scroll-smooth gap-1">
            <button
              onClick={() => onSelectCategory('Todas')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'Todas'
                  ? 'bg-[#004080] text-white shadow'
                  : 'text-[#004080] hover:bg-[#004080]/10'
              }`}
            >
              ✨ Todos los Productos
            </button>

            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#004080] text-white font-semibold shadow-sm'
                    : 'text-slate-700 hover:text-[#004080] hover:bg-[#004080]/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#004080]/10 bg-[#f5f1e9] px-4 py-4 space-y-3 shadow-xl">
          <div className="flex justify-between items-center pb-2 border-b border-[#004080]/15">
            <span className="text-xs font-bold uppercase tracking-wider text-[#004080]">
              Categorías Holísticas
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#004080] p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 max-h-72 overflow-y-auto pr-1">
            <button
              onClick={() => {
                onSelectCategory('Todas');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === 'Todas'
                  ? 'bg-[#004080] text-white'
                  : 'bg-white text-[#004080] hover:bg-[#004080]/10'
              }`}
            >
              ✨ Ver Todo
            </button>
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all truncate ${
                  selectedCategory === cat
                    ? 'bg-[#004080] text-white font-bold'
                    : 'bg-white text-slate-800 hover:bg-[#004080]/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
