import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { SiteConfig } from '../types';

interface LocationAndContactProps {
  config: SiteConfig;
}

export const LocationAndContact: React.FC<LocationAndContactProps> = ({ config }) => {
  if (config.showLocationSection === false) return null;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    // Direct inquiry via WhatsApp
    const text = encodeURIComponent(
      `✨ *CONSULTA DESDE LA WEB - BARMINA*\n\n👤 *Nombre:* ${name}\n📧 *Email:* ${
        email || 'No especificado'
      }\n\n💬 *Mensaje:* ${message}`
    );
    window.open(`https://wa.me/${config.whatsappNumber}?text=${text}`, '_blank');

    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 3000);
  };

  return (
    <section id="contacto" className="py-16 bg-[#f5f1e9] border-b border-[#004080]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Location Details & Interactive Map Preview */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#004080] bg-[#004080]/10 px-3 py-1 rounded-full border border-[#004080]/20">
                Ubicación & Showroom
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#004080] mt-3">
                {config.locationTitle || 'Visítanos en Parque Chacabuco'}
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                {config.locationSubtitle || 'Conoce nuestro espacio holístico en la Ciudad Autónoma de Buenos Aires. Atendemos consultas minoristas y mayoristas.'}
              </p>
            </div>

            <div className="space-y-4 bg-white p-6 rounded-3xl border border-[#004080]/15 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-[#004080]/10 rounded-xl flex items-center justify-center text-[#004080] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Dirección Física</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {config.storeAddress}
                  </p>
                  <span className="text-[11px] font-semibold text-[#004080] block mt-1">
                    {config.neighborhood || 'Parque Chacabuco'}, {config.city || 'Buenos Aires, Argentina'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-[#004080]/10 rounded-xl flex items-center justify-center text-[#004080] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">WhatsApp & Teléfono</h4>
                  <a
                    href={`https://wa.me/${config.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#004080] font-bold hover:underline block mt-0.5"
                  >
                    {config.phone} (Atención directa)
                  </a>
                  {config.email && (
                    <a href={`mailto:${config.email}`} className="text-[11px] text-slate-500 hover:underline block mt-0.5">
                      {config.email}
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-[#004080]/10 rounded-xl flex items-center justify-center text-[#004080] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Horarios de Atención</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {config.storeHours || 'Lunes a Viernes de 09:30 a 18:30 hs | Sábados de 10:00 a 14:00 hs'}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Map Embed */}
            <div className="rounded-3xl overflow-hidden shadow-md border border-[#004080]/20 h-64 relative bg-[#004080]/10">
              <iframe
                title="Ubicación Barmina Parque Chacabuco"
                src={config.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13133.090533355208!2d-58.4485573!3d-34.6290073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccb0ef18dbe15%3A0xb36f7eb54f3b20ed!2sParque%20Chacabuco%2C%20CABA!5e0!3m2!1ses!2sar!4v1690000000000!5m2!1ses!2sar"}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-3xl border border-[#004080]/15 shadow-lg space-y-6">
            <div>
              <span className="text-xs font-bold text-[#004080] uppercase tracking-widest">
                Escríbenos
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#004080] mt-1">
                ¿Tienes alguna duda o pedido especial?
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Completa el formulario y te responderemos al instante por WhatsApp o correo.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Tu Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sofía Peralta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004080]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Tu Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004080]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Consulta o Mensaje *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Quisiera información sobre compras mayoristas de sahumerios y velas de cera de soja..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004080]"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 px-6 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md ${
                  sent
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#004080] hover:bg-[#002d5a] text-white'
                }`}
              >
                {sent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>¡Mensaje Enviado a WhatsApp!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#f5f1e9]" />
                    <span>Enviar Consulta Directa</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
