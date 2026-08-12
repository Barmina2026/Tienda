import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { addSubscriberToSupabase } from '../lib/supabase';
import { SiteConfig } from '../types';

interface NewsletterProps {
  config?: SiteConfig;
}

export const Newsletter: React.FC<NewsletterProps> = ({ config }) => {
  if (config && config.showNewsletterSection === false) return null;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    await addSubscriberToSupabase(email);
    setStatus('success');
    setEmail('');
  };

  return (
    <section className="py-14 bg-[#004080] text-[#f5f1e9] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 bg-[#002d5a] px-4 py-1.5 rounded-full border border-blue-400/30 text-xs font-bold text-[#f5f1e9]">
          <Sparkles className="w-4 h-4 text-[#f5f1e9] animate-pulse" />
          <span>Comunidad Holística Barmina</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          {config?.newsletterTitle || 'Recibe Novedades, Calendario Lunar & Descuentos'}
        </h2>

        <p className="text-[#f5f1e9]/80 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          {config?.newsletterSubtitle || 'Suscríbete a nuestro boletín para recibir guías de sahumado, consejos de aromaterapia y promociones exclusivas para tus compras holísticas.'}
        </p>

        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="email"
              required
              placeholder="Ingresa tu correo electrónico..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#002d5a] border border-blue-400/30 text-white placeholder-blue-200/60 text-xs focus:outline-none focus:ring-2 focus:ring-[#f5f1e9]"
            />
            <Mail className="w-4 h-4 text-[#f5f1e9] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 bg-[#f5f1e9] hover:bg-white text-[#004080] font-bold rounded-2xl text-xs transition-all shadow-md shrink-0 disabled:opacity-50"
          >
            {status === 'loading'
              ? 'Suscribiendo...'
              : status === 'success'
              ? '¡Suscrito con Éxito!'
              : (config?.newsletterButtonText || 'Suscribirme Gratis')}
          </button>
        </form>

        {status === 'success' && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#f5f1e9] font-medium animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{config?.newsletterSuccessMessage || '¡Gracias por unirte a nuestra comunidad holística!'}</span>
          </div>
        )}
      </div>
    </section>
  );
};
