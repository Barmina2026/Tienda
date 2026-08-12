import React, { useState } from 'react';
import { X, ShoppingBag, Check, Sparkles, ShieldCheck, Heart, Info, Truck } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  saleType?: 'minorista' | 'mayorista';
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const price = product.priceMinorista;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#004080]/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-[#f5f1e9] rounded-3xl shadow-2xl overflow-hidden border border-[#004080]/20 max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-[#004080]/20 hover:bg-[#004080] text-slate-800 hover:text-white p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Section */}
        <div className="md:w-1/2 relative bg-white min-h-[260px] md:min-h-[380px]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-[#004080] text-white text-xs font-bold uppercase px-3 py-1 rounded-full shadow-md">
            {product.category}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto space-y-4">
          <div className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-[#004080] leading-snug">
              {product.name}
            </h2>

            {/* Price Display */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-[#004080] font-serif">
                ${price.toLocaleString('es-AR')}
              </span>
            </div>

            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Holistic Properties */}
            {product.properties && product.properties.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-bold text-[#004080] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#004080]" />
                  Propiedades Holísticas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.properties.map((prop, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-white text-slate-800 px-2.5 py-1 rounded-lg font-medium border border-slate-300"
                    >
                      {prop}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Usage Guide */}
            {product.usageGuide && (
              <div className="bg-white p-3 rounded-xl border border-slate-300 text-xs text-slate-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-[#004080]">
                  <Info className="w-3.5 h-3.5 text-[#004080]" />
                  Modo de Uso & Ritual
                </div>
                <p className="text-slate-600 leading-relaxed">{product.usageGuide}</p>
              </div>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="pt-4 border-t border-slate-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#004080]">Cantidad:</span>
              <div className="flex items-center bg-white rounded-xl border border-slate-300 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center font-bold text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-7 h-7 flex items-center justify-center font-bold text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={product.stock <= 0 || product.inStock === false}
              className={`w-full py-3 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
                added
                  ? 'bg-emerald-700 text-white'
                  : product.stock <= 0 || product.inStock === false
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#004080] hover:bg-[#002d5a] text-white active:scale-[0.98]'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5 text-white" />
                  <span>¡Agregado al Carrito!</span>
                </>
              ) : product.stock <= 0 || product.inStock === false ? (
                <span>Sin Stock Disponible</span>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 text-[#f5f1e9]" />
                  <span>Agregar {quantity} al Carrito</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-600 font-medium pt-1">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#004080]" /> Envíos a todo el país
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#004080]" /> Compra 100% Segura
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
