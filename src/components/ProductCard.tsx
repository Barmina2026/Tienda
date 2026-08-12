import React, { useState } from 'react';
import { Eye, ShoppingBag, Check, Sparkles, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  saleType?: 'minorista' | 'mayorista';
  onAddToCart: (product: Product, quantity: number) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView
}) => {
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const currentPrice = product.priceMinorista;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#004080]/15 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#f5f1e9]/60">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          <span className="bg-[#004080]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-white/20">
            {product.category}
          </span>
          {product.featured && (
            <span className="bg-[#f5f1e9] text-[#004080] border border-[#004080]/20 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Destacado
            </span>
          )}
          {product.isNew && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow-sm">
              ✨ Nuevo
            </span>
          )}
          {product.inStock === false && (
            <span className="bg-red-600 text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow-sm">
              Sin Stock
            </span>
          )}
        </div>

        {/* Quick View Floating Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute right-3 top-3 bg-white/90 hover:bg-[#004080] hover:text-white text-[#004080] p-2 rounded-full shadow-md transition-all opacity-90 sm:opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90"
          title="Vista Rápida"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Stock Alert / Últimas Unidades Badge */}
        {product.inStock !== false &&
          product.stock > 0 &&
          (product.showLowStockBadge || (product.stock <= 5 && product.showLowStockBadge !== false)) && (
            <div className="absolute bottom-2 left-2 right-2 bg-[#004080]/85 text-white text-[10px] font-bold px-2 py-1 rounded-lg text-center backdrop-blur-sm">
              ¡Últimas {product.stock} unidades disponibles!
            </div>
          )}
      </div>

      {/* Product Body Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-serif font-bold text-slate-900 text-base group-hover:text-[#004080] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Properties Pills */}
          {product.properties && product.properties.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.properties.slice(0, 2).map((prop, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-[#004080]/10 text-[#004080] px-2 py-0.5 rounded-md font-medium"
                >
                  {prop}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Buy Actions */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium block">
                Precio:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-[#004080] font-serif">
                  ${currentPrice.toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          </div>

          {/* Add to cart action */}
          <button
            onClick={handleAdd}
            disabled={product.stock <= 0 || product.inStock === false}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
              added
                ? 'bg-emerald-700 text-white'
                : (product.stock <= 0 || product.inStock === false)
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#004080] hover:bg-[#002d5a] text-white active:scale-[0.98]'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>¡Agregado!</span>
              </>
            ) : (product.stock <= 0 || product.inStock === false) ? (
              <span>Sin Stock Disponible</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#f5f1e9]" />
                <span>Agregar al Carrito</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
