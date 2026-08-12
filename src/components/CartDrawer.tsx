import React, { useState } from 'react';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Send,
  Building2,
  Banknote,
  Smartphone,
  MapPin,
  Truck
} from 'lucide-react';
import { CartItem, CheckoutDetails, PaymentMethod, SiteConfig } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  saleType?: 'minorista' | 'mayorista';
  onToggleSaleType?: (type: 'minorista' | 'mayorista') => void;
  config: SiteConfig;
  onCompleteCheckout: (details: CheckoutDetails, total: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  config,
  onCompleteCheckout
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [shippingOption, setShippingOption] = useState<'coordinar_envio' | 'retirar_domicilio'>('coordinar_envio');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Transferencia');
  const [notes, setNotes] = useState('');

  // Total calculation (Clean total price without transfer discount or shipping cost)
  const total = items.reduce((acc, item) => {
    return acc + item.product.priceMinorista * item.quantity;
  }, 0);

  const handleConfirmAndSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !phone.trim()) {
      alert('Por favor ingresa tu Nombre y Teléfono para coordinar el pedido.');
      return;
    }

    const details: CheckoutDetails = {
      customerName,
      phone,
      email,
      address,
      city: '',
      postalCode: '',
      saleType: 'minorista',
      paymentMethod,
      notes,
      shippingOption
    };

    onCompleteCheckout(details, total);

    // Build structured WhatsApp message
    const itemsListText = items
      .map((item) => {
        const itemPrice = item.product.priceMinorista;
        return `• ${item.quantity}x ${item.product.name} - $${(itemPrice * item.quantity).toLocaleString('es-AR')}`;
      })
      .join('\n');

    const shippingText =
      shippingOption === 'retirar_domicilio'
        ? 'Retirar en domicilio (Parque Chacabuco)'
        : `Coordinar envío con el vendedor${address ? ` (Dirección: ${address})` : ''}`;

    const rawMessage = `✨ *NUEVO PEDIDO - TIENDA HOLÍSTICA* ✨
------------------------------------------
👤 *Cliente:* ${customerName}
📞 *Teléfono:* ${phone}
📧 *Email:* ${email || 'No especificado'}
🚚 *Forma de Entrega:* ${shippingText}
💳 *Forma de Pago:* ${paymentMethod}

📦 *DETALLE DE PRODUCTOS:*
${itemsListText}

------------------------------------------
💰 *PRECIO TOTAL:* $${total.toLocaleString('es-AR')}

${notes ? `📝 *Notas:* ${notes}\n` : ''}------------------------------------------
¡Hola Barmina! Quisiera confirmar este pedido. Muchas gracias.`;

    const encodedText = encodeURIComponent(rawMessage);
    const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#004080]/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#f5f1e9] shadow-2xl flex flex-col justify-between border-l border-[#004080]/20">
          {/* Header */}
          <div className="p-5 bg-[#004080] text-white flex items-center justify-between border-b border-[#002d5a]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#f5f1e9]" />
              <h3 className="font-serif font-bold text-lg text-white">
                {step === 'cart' ? 'Tu Carrito Holístico' : 'Finalizar Pedido'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {step === 'cart' ? (
              <>
                {/* Items List */}
                {items.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <ShoppingBag className="w-12 h-12 text-[#004080]/50 mx-auto" />
                    <p className="text-[#004080] font-serif font-bold text-lg">
                      Tu carrito está vacío
                    </p>
                    <p className="text-xs text-slate-600 max-w-xs mx-auto">
                      Agrega sahumerios, velas, difusores o humidificadores para comenzar tu experiencia holística.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => {
                      const itemPrice = item.product.priceMinorista;
                      return (
                        <div
                          key={item.product.id}
                          className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm"
                        >
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-xl shrink-0"
                          />
                          <div className="flex-1 min-w-0 space-y-1">
                            <h4 className="font-bold text-xs text-slate-900 truncate">
                              {item.product.name}
                            </h4>
                            <div className="text-xs font-bold text-[#004080]">
                              ${itemPrice.toLocaleString('es-AR')}{' '}
                              <span className="text-[10px] font-normal text-slate-500">c/u</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center bg-[#f5f1e9] rounded-lg border border-slate-300">
                                <button
                                  onClick={() =>
                                    onUpdateQuantity(item.product.id, item.quantity - 1)
                                  }
                                  className="w-6 h-6 flex items-center justify-center font-bold text-slate-800 text-xs hover:bg-slate-200 rounded-l"
                                >
                                  -
                                </button>
                                <span className="w-6 text-center text-xs font-bold text-slate-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    onUpdateQuantity(item.product.id, item.quantity + 1)
                                  }
                                  className="w-6 h-6 flex items-center justify-center font-bold text-slate-800 text-xs hover:bg-slate-200 rounded-r"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-slate-400 hover:text-red-700 p-1.5 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              /* Checkout Form Step */
              <form onSubmit={handleConfirmAndSendWhatsApp} className="space-y-4 text-xs">
                {/* Customer Info */}
                <div className="space-y-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-sm text-[#004080] border-b pb-1">
                    1. Tus Datos Personales
                  </h4>
                  <div>
                    <label className="block text-slate-800 font-semibold mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: María Laura González"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#f5f1e9]/50 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#004080] text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-800 font-semibold mb-1">
                      Teléfono WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej: 11 1234 5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#f5f1e9]/50 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#004080] text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-800 font-semibold mb-1">
                      Email (Opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="ejemplo@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#f5f1e9]/50 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#004080] text-slate-900"
                    />
                  </div>
                </div>

                {/* Shipping Selection */}
                <div className="space-y-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-sm text-[#004080] border-b pb-1">
                    2. Forma de Entrega / Envío
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => setShippingOption('coordinar_envio')}
                      className={`p-3 rounded-xl border text-left font-semibold transition-all flex items-center gap-3 ${
                        shippingOption === 'coordinar_envio'
                          ? 'border-[#004080] bg-[#004080]/10 text-[#004080]'
                          : 'border-slate-200 bg-[#f5f1e9]/40 text-slate-700 hover:bg-[#f5f1e9]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#004080]/10 flex items-center justify-center shrink-0">
                        <Truck className="w-4 h-4 text-[#004080]" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Coordinar envío con el vendedor</div>
                        <div className="text-[11px] text-slate-500 font-normal">
                          Nos contactamos por WhatsApp para definir el despacho
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShippingOption('retirar_domicilio')}
                      className={`p-3 rounded-xl border text-left font-semibold transition-all flex items-center gap-3 ${
                        shippingOption === 'retirar_domicilio'
                          ? 'border-[#004080] bg-[#004080]/10 text-[#004080]'
                          : 'border-slate-200 bg-[#f5f1e9]/40 text-slate-700 hover:bg-[#f5f1e9]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#004080]/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-[#004080]" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Retirar en domicilio</div>
                        <div className="text-[11px] text-slate-500 font-normal">
                          Retiro sin costo en Parque Chacabuco, CABA
                        </div>
                      </div>
                    </button>
                  </div>

                  {shippingOption === 'coordinar_envio' && (
                    <div className="space-y-2 pt-2 border-t border-slate-100 mt-2">
                      <label className="block text-slate-700 font-semibold text-[11px]">
                        Dirección de envío (Opcional):
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Av. Rivadavia 1234, CABA"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#f5f1e9]/50 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#004080] text-slate-900"
                      />
                    </div>
                  )}
                </div>

                {/* Mandatory Payment Method Selection */}
                <div className="space-y-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-sm text-[#004080] border-b pb-1">
                    3. Forma de Pago
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        id: 'Efectivo',
                        label: 'Efectivo',
                        desc: 'Abonas al momento de retirar o recibir',
                        icon: Banknote
                      },
                      {
                        id: 'Mercado Pago',
                        label: 'Mercado Pago',
                        desc: 'Dinero en cuenta, débito o crédito mediante link / QR',
                        icon: Smartphone
                      },
                      {
                        id: 'Transferencia',
                        label: 'Transferencia Bancaria',
                        desc: 'Recibirás nuestro CBU / Alias para realizar el pago',
                        icon: Building2
                      }
                    ].map((pm) => {
                      const Icon = pm.icon;
                      const selected = paymentMethod === pm.id;
                      return (
                        <label
                          key={pm.id}
                          onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                            selected
                              ? 'border-[#004080] bg-[#004080]/10 shadow-sm'
                              : 'border-slate-200 bg-[#f5f1e9]/40 hover:bg-[#f5f1e9]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={selected}
                              onChange={() => setPaymentMethod(pm.id as PaymentMethod)}
                              className="text-[#004080] focus:ring-[#004080]"
                            />
                            <Icon className="w-4 h-4 text-[#004080]" />
                            <div>
                              <div className="font-bold text-slate-900">{pm.label}</div>
                              <div className="text-[10px] text-slate-500">{pm.desc}</div>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="bg-white p-3 rounded-2xl border border-slate-200">
                  <label className="block text-slate-800 font-semibold mb-1">
                    Notas o Aclaraciones (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej: Preferencias de fragancias o detalles adicionales..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#f5f1e9]/50 border border-slate-300 text-slate-900 text-xs"
                  />
                </div>
              </form>
            )}
          </div>

          {/* Footer Totals & Checkout Button */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-slate-200 space-y-3 shadow-lg">
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between items-center text-base font-bold text-slate-900 font-serif">
                  <span>Precio Total:</span>
                  <span className="text-xl text-[#004080]">${total.toLocaleString('es-AR')}</span>
                </div>
              </div>

              {step === 'cart' ? (
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full py-3.5 px-6 bg-[#004080] hover:bg-[#002d5a] text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Continuar al Checkout</span>
                  <ArrowRight className="w-4 h-4 text-[#f5f1e9]" />
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleConfirmAndSendWhatsApp}
                    className="w-full py-3.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Send className="w-4 h-4 text-emerald-200" />
                    <span>Confirmar y Enviar Pedido a WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="w-full py-2 text-center text-xs font-semibold text-[#004080] hover:underline"
                  >
                    « Volver al Carrito
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
