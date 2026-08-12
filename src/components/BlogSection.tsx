import React, { useState } from 'react';
import { BlogPost, SiteConfig } from '../types';
import { BookOpen, Clock, ArrowRight, X, Sparkles, User } from 'lucide-react';

interface BlogSectionProps {
  posts: BlogPost[];
  config?: SiteConfig;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts, config }) => {
  if (config && config.showBlogSection === false) return null;
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <section id="blog" className="py-16 bg-[#f5f1e9] border-b border-[#004080]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#004080] bg-[#004080]/10 px-3 py-1 rounded-full border border-[#004080]/20">
            Sabiduría Holística & Guías
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#004080] mt-3">
            Blog & Artículos de Bienestar
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Aprende sobre sahumado consciente, el poder de los cuarzos, aceites esenciales e intencionado de velas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group bg-white rounded-3xl overflow-hidden border border-[#004080]/15 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden bg-[#f5f1e9]">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#004080]/90 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full backdrop-blur-sm">
                  {post.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#004080]" />
                      {post.readTime}
                    </span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-[#004080] transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-2 flex items-center text-xs font-bold text-[#004080] gap-1">
                  <span>Leer Artículo Completo</span>
                  <ArrowRight className="w-4 h-4 text-[#004080] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Blog Article Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#004080]/60 backdrop-blur-sm animate-fade-in">
          <div
            className="relative w-full max-w-3xl bg-[#f5f1e9] rounded-3xl shadow-2xl overflow-hidden border border-[#004080]/20 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-[#004080] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#f5f1e9]" />
                <span className="font-serif font-bold text-sm text-white">
                  {selectedPost.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1.5 text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                className="w-full h-64 object-cover rounded-2xl shadow-sm"
              />

              <div className="space-y-2">
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#004080]" />
                    {selectedPost.author}
                  </span>
                  <span>•</span>
                  <span>{selectedPost.date}</span>
                  <span>•</span>
                  <span>{selectedPost.readTime} de lectura</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#004080] leading-tight">
                  {selectedPost.title}
                </h2>
              </div>

              <div className="max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line pt-2 border-t border-slate-300">
                {selectedPost.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 text-center">
              <button
                onClick={() => setSelectedPost(null)}
                className="bg-[#004080] text-white px-6 py-2.5 rounded-full font-bold text-xs shadow hover:bg-[#002d5a] transition-colors"
              >
                Cerrar Artículo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
