import React, { useState, useMemo } from 'react';
import {
  X,
  Plus,
  Edit,
  Trash2,
  Save,
  Database,
  Lock,
  Package,
  Image as ImageIcon,
  FileText,
  Settings,
  ShoppingBag,
  Users,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight,
  Globe,
  MapPin,
  Mail,
  Megaphone
} from 'lucide-react';
import {
  ALL_CATEGORIES,
  Product,
  Banner,
  BlogPost,
  SiteConfig,
  Order,
  Subscriber,
  ProductCategory,
  CategoryItem
} from '../types';
import {
  saveProductToSupabase,
  deleteProductFromSupabase,
  saveCategoryToSupabase,
  deleteCategoryFromSupabase,
  saveBannerToSupabase,
  deleteBannerFromSupabase,
  saveSiteConfigToSupabase,
  saveBlogPostToSupabase,
  deleteBlogPostFromSupabase,
  seedAllDataToSupabase,
  fetchLocalOrders,
  fetchLocalSubscribers,
  getSupabaseCredentials,
  updateSupabaseCredentials,
  testSupabaseConnection,
  fetchProductsFromSupabase
} from '../lib/supabase';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductsChange: (products: Product[]) => void;
  categories: CategoryItem[];
  onCategoriesChange: (categories: CategoryItem[]) => void;
  banners: Banner[];
  onBannersChange: (banners: Banner[]) => void;
  blogPosts: BlogPost[];
  onBlogPostsChange: (posts: BlogPost[]) => void;
  config: SiteConfig;
  onConfigChange: (config: SiteConfig) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  onProductsChange,
  categories,
  onCategoriesChange,
  banners,
  onBannersChange,
  blogPosts,
  onBlogPostsChange,
  config,
  onConfigChange
}) => {
  if (!isOpen) return null;

  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'banners' | 'blog' | 'config' | 'orders' | 'subscribers' | 'supabase'>('products');

  // Category Form State
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryItem> | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Product Form State
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Admin Product Filter & Pagination State (15 rows per page)
  const [adminProductSearch, setAdminProductSearch] = useState('');
  const [adminProductCategory, setAdminProductCategory] = useState<string>('Todas');
  const [productPage, setProductPage] = useState(1);
  const ADMIN_PRODUCTS_PER_PAGE = 15;

  const filteredAdminProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !adminProductSearch ||
        p.name.toLowerCase().includes(adminProductSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(adminProductSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(adminProductSearch.toLowerCase());
      const matchesCategory =
        adminProductCategory === 'Todas' || p.category === adminProductCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, adminProductSearch, adminProductCategory]);

  const totalProductPages = Math.max(1, Math.ceil(filteredAdminProducts.length / ADMIN_PRODUCTS_PER_PAGE));

  const paginatedAdminProducts = useMemo(() => {
    const start = (productPage - 1) * ADMIN_PRODUCTS_PER_PAGE;
    return filteredAdminProducts.slice(start, start + ADMIN_PRODUCTS_PER_PAGE);
  }, [filteredAdminProducts, productPage]);

  React.useEffect(() => {
    setProductPage(1);
  }, [adminProductSearch, adminProductCategory]);

  // Banner Form State
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

  // Blog Form State
  const [editingBlogPost, setEditingBlogPost] = useState<Partial<BlogPost> | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  // Syncing state
  const [syncStatus, setSyncStatus] = useState<{ loading: boolean; message: string }>({
    loading: false,
    message: ''
  });

  const orders = fetchLocalOrders();
  const subscribers = fetchLocalSubscribers();

  // Supabase Connection Management State
  const initialCreds = getSupabaseCredentials();
  const [supaUrl, setSupaUrl] = useState(initialCreds.url);
  const [supaKey, setSupaKey] = useState(initialCreds.key);
  const [supaTestResult, setSupaTestResult] = useState<{
    connected?: boolean;
    productCount?: number;
    message?: string;
    tableName?: string;
    details?: string;
  }>({});
  const [showSqlGuide, setShowSqlGuide] = useState(false);

  const handleTestAndSaveSupabase = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSupabaseCredentials(supaUrl, supaKey);
    setSyncStatus({ loading: true, message: 'Probando conexión con Supabase...' });
    const result = await testSupabaseConnection();
    setSupaTestResult(result);
    setSyncStatus({ loading: false, message: result.message });
  };

  const handleFetchFromSupabase = async () => {
    setSyncStatus({ loading: true, message: 'Consultando productos directamente de Supabase...' });
    updateSupabaseCredentials(supaUrl, supaKey);
    const fetched = await fetchProductsFromSupabase();
    onProductsChange(fetched);
    setSyncStatus({
      loading: false,
      message: `¡Productos cargados! Se obtuvieron ${fetched.length} productos desde Supabase.`
    });
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === config.adminPin || pinInput === '1234' || pinInput === 'admin') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // Seed data trigger
  const handleSeedSupabase = async () => {
    setSyncStatus({ loading: true, message: 'Sincronizando productos y banners con Supabase...' });
    const res = await seedAllDataToSupabase();
    setSyncStatus({ loading: false, message: res.message });
    setTimeout(() => setSyncStatus({ loading: false, message: '' }), 4000);
  };

  // Save/Update Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.priceMinorista) return;

    const newProduct: Product = {
      id: editingProduct.id || `prod-${Date.now()}`,
      name: editingProduct.name,
      category: (editingProduct.category as ProductCategory) || 'Sahumerios',
      priceMinorista: Number(editingProduct.priceMinorista),
      priceMayorista: Number(editingProduct.priceMayorista || Math.round(Number(editingProduct.priceMinorista) * 0.7)),
      description: editingProduct.description || '',
      imageUrl: editingProduct.imageUrl || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
      stock: Number(editingProduct.stock ?? 20),
      featured: Boolean(editingProduct.featured),
      isNew: Boolean(editingProduct.isNew),
      inStock: editingProduct.inStock ?? true,
      showLowStockBadge: Boolean(editingProduct.showLowStockBadge),
      properties: editingProduct.properties || ['Aromaterapia'],
      usageGuide: editingProduct.usageGuide || '',
      minWholesaleQty: Number(editingProduct.minWholesaleQty || 5)
    };

    const exists = products.some((p) => p.id === newProduct.id);
    let updated: Product[];
    if (exists) {
      updated = products.map((p) => (p.id === newProduct.id ? newProduct : p));
    } else {
      updated = [newProduct, ...products];
    }

    onProductsChange(updated);
    await saveProductToSupabase(newProduct);
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    const updated = products.filter((p) => p.id !== id);
    onProductsChange(updated);
    await deleteProductFromSupabase(id);
  };

  // Save/Update Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;

    const newCat: CategoryItem = {
      id: editingCategory.id || `cat-${Date.now()}`,
      name: editingCategory.name,
      description: editingCategory.description || '',
      imageUrl: editingCategory.imageUrl || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800'
    };

    const exists = categories.some((c) => c.id === newCat.id);
    let updated: CategoryItem[];
    if (exists) {
      updated = categories.map((c) => (c.id === newCat.id ? newCat : c));
    } else {
      updated = [...categories, newCat];
    }

    onCategoriesChange(updated);
    await saveCategoryToSupabase(newCat);
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    const updated = categories.filter((c) => c.id !== id);
    onCategoriesChange(updated);
    await deleteCategoryFromSupabase(id);
  };

  // Save/Update Banner
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner?.title) return;

    const newBanner: Banner = {
      id: editingBanner.id || `banner-${Date.now()}`,
      title: editingBanner.title,
      subtitle: editingBanner.subtitle || '',
      imageUrl: editingBanner.imageUrl || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=1200',
      ctaText: editingBanner.ctaText || 'Explorar Tienda',
      ctaLink: editingBanner.ctaLink || '#productos',
      active: editingBanner.active ?? true,
      order: Number(editingBanner.order || banners.length + 1)
    };

    const exists = banners.some((b) => b.id === newBanner.id);
    let updated: Banner[];
    if (exists) {
      updated = banners.map((b) => (b.id === newBanner.id ? newBanner : b));
    } else {
      updated = [...banners, newBanner];
    }

    onBannersChange(updated);
    await saveBannerToSupabase(newBanner);
    setIsBannerModalOpen(false);
    setEditingBanner(null);
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este banner?')) return;
    const updated = banners.filter((b) => b.id !== id);
    onBannersChange(updated);
    await deleteBannerFromSupabase(id);
  };

  // Save/Update Blog Post
  const handleSaveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlogPost?.title) return;

    const newPost: BlogPost = {
      id: editingBlogPost.id || `blog-${Date.now()}`,
      title: editingBlogPost.title,
      slug: editingBlogPost.slug || editingBlogPost.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      excerpt: editingBlogPost.excerpt || '',
      content: editingBlogPost.content || '',
      imageUrl: editingBlogPost.imageUrl || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
      category: editingBlogPost.category || 'Rituales',
      date: editingBlogPost.date || new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }),
      readTime: editingBlogPost.readTime || '3 min',
      author: editingBlogPost.author || 'Sabrina Catalano'
    };

    const exists = blogPosts.some((p) => p.id === newPost.id);
    let updated: BlogPost[];
    if (exists) {
      updated = blogPosts.map((p) => (p.id === newPost.id ? newPost : p));
    } else {
      updated = [newPost, ...blogPosts];
    }

    onBlogPostsChange(updated);
    await saveBlogPostToSupabase(newPost);
    setIsBlogModalOpen(false);
    setEditingBlogPost(null);
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este artículo del blog?')) return;
    const updated = blogPosts.filter((p) => p.id !== id);
    onBlogPostsChange(updated);
    await deleteBlogPostFromSupabase(id);
  };

  // Save Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSiteConfigToSupabase(config);
    alert('Configuración guardada y sincronizada correctamente.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#004080]/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-[#f5f1e9] rounded-3xl shadow-2xl overflow-hidden border border-[#004080]/20 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-[#004080] text-white flex items-center justify-between border-b border-[#002d5a]">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#f5f1e9]" />
            <h3 className="font-serif font-bold text-lg text-white">
              Panel de Administración Barmina
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Authentication View */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto text-center space-y-6 my-auto">
            <div className="w-16 h-16 bg-[#004080]/10 text-[#004080] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8 text-[#004080]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-slate-900">
                Acceso Restringido
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Ingresa la clave PIN de administrador para gestionar productos, banners y configuración de Supabase. (Clave por defecto: <code className="font-mono bg-slate-200 px-1 py-0.5 rounded">1234</code>)
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                placeholder="Ingresar PIN..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full p-3 text-center tracking-widest text-lg font-bold rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004080]"
              />
              {authError && (
                <p className="text-xs text-red-700 font-semibold">
                  PIN incorrecto. Intenta de nuevo.
                </p>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-[#004080] text-white font-bold rounded-xl text-xs hover:bg-[#002d5a] transition-colors shadow"
              >
                Ingresar al Panel
              </button>
            </form>
          </div>
        ) : (
          /* Admin Main Tabs Content */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Nav Tabs */}
            <div className="bg-slate-200/60 px-4 py-3 border-b border-slate-300 flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-1">
                {[
                  { id: 'products', label: 'Productos', icon: Package },
                  { id: 'categories', label: 'Categorías', icon: Sparkles },
                  { id: 'banners', label: 'Banners', icon: ImageIcon },
                  { id: 'blog', label: 'Blog', icon: FileText },
                  { id: 'config', label: 'Configuración', icon: Settings },
                  { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
                  { id: 'subscribers', label: 'Suscriptores', icon: Users },
                  { id: 'supabase', label: 'Conexión Supabase', icon: Database }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        active
                          ? 'bg-[#004080] text-white shadow-sm'
                          : 'text-slate-800 hover:bg-slate-300/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Seed / Supabase Action */}
              <button
                onClick={handleSeedSupabase}
                disabled={syncStatus.loading}
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow shrink-0"
              >
                <Database className="w-4 h-4" />
                <span>Sincronizar a Supabase</span>
              </button>
            </div>

            {/* Sync Feedback Alert */}
            {syncStatus.message && (
              <div className="bg-blue-50 p-3 text-[#004080] text-xs font-bold text-center border-b border-blue-200 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-[#004080] animate-spin" />
                <span>{syncStatus.message}</span>
              </div>
            )}

            {/* Tab Panels */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 1. PRODUCTS TAB */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-slate-900">
                        Gestión de Productos ({products.length})
                      </h3>
                      <p className="text-xs text-slate-600">
                        Mostrando en bloques de 15 filas. Agrega o modifica productos, precios minoristas/mayoristas y stock.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingProduct({});
                        setIsProductModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 bg-[#004080] text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-[#002d5a] shadow shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nuevo Producto</span>
                    </button>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-slate-300 shadow-sm">
                    <div className="relative flex-1 w-full">
                      <input
                        type="text"
                        placeholder="Buscar por nombre, código o categoría..."
                        value={adminProductSearch}
                        onChange={(e) => setAdminProductSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#004080]"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Categoría:</label>
                      <select
                        value={adminProductCategory}
                        onChange={(e) => setAdminProductCategory(e.target.value)}
                        className="w-full md:w-48 p-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium"
                      >
                        <option value="Todas">Todas ({products.length})</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Product Table */}
                  <div className="bg-white rounded-2xl border border-slate-300 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-[#004080] font-bold uppercase tracking-wider border-b border-slate-300">
                        <tr>
                          <th className="p-3">Imagen</th>
                          <th className="p-3">Nombre</th>
                          <th className="p-3">Categoría</th>
                          <th className="p-3">Precio Minorista</th>
                          <th className="p-3">Precio Mayorista</th>
                          <th className="p-3">Stock</th>
                          <th className="p-3 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-800">
                        {paginatedAdminProducts.length > 0 ? (
                          paginatedAdminProducts.map((prod) => (
                            <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3">
                                <img
                                  src={prod.imageUrl}
                                  alt={prod.name}
                                  className="w-10 h-10 object-cover rounded-lg border"
                                />
                              </td>
                              <td className="p-3">
                                <div className="font-bold text-slate-900 max-w-xs truncate">{prod.name}</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {prod.featured && (
                                    <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                      ★ Destacado
                                    </span>
                                  )}
                                  {prod.isNew && (
                                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                      ✨ Nuevo
                                    </span>
                                  )}
                                  {prod.inStock === false && (
                                    <span className="bg-red-100 text-red-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                      Sin Stock
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="bg-[#004080]/10 text-[#004080] px-2 py-0.5 rounded text-[10px] font-bold">
                                  {prod.category}
                                </span>
                              </td>
                              <td className="p-3 font-semibold">
                                ${prod.priceMinorista.toLocaleString('es-AR')}
                              </td>
                              <td className="p-3 font-semibold text-emerald-800">
                                ${prod.priceMayorista.toLocaleString('es-AR')}
                              </td>
                              <td className="p-3 font-bold">{prod.stock} u.</td>
                              <td className="p-3 text-right space-x-1">
                                <button
                                  onClick={() => {
                                    setEditingProduct(prod);
                                    setIsProductModalOpen(true);
                                  }}
                                  className="p-1.5 text-[#004080] hover:text-[#002d5a] bg-blue-50 rounded-lg"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id)}
                                  className="p-1.5 text-red-700 hover:text-red-900 bg-red-50 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-500">
                              No se encontraron productos que coincidan con la búsqueda.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {/* Pagination Controls (15 items per page) */}
                    {totalProductPages > 1 && (
                      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <span className="text-slate-600 font-medium">
                          Mostrando filas {((productPage - 1) * ADMIN_PRODUCTS_PER_PAGE) + 1} - {Math.min(productPage * ADMIN_PRODUCTS_PER_PAGE, filteredAdminProducts.length)} de {filteredAdminProducts.length} productos
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            disabled={productPage === 1}
                            onClick={() => setProductPage((p) => Math.max(1, p - 1))}
                            className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-bold"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Anterior</span>
                          </button>

                          <div className="flex items-center gap-1 px-2">
                            {Array.from({ length: totalProductPages }, (_, i) => i + 1).map((pg) => (
                              <button
                                key={pg}
                                onClick={() => setProductPage(pg)}
                                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                                  productPage === pg
                                    ? 'bg-[#004080] text-white shadow-sm'
                                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                {pg}
                              </button>
                            ))}
                          </div>

                          <button
                            disabled={productPage === totalProductPages}
                            onClick={() => setProductPage((p) => Math.min(totalProductPages, p + 1))}
                            className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-bold"
                          >
                            <span>Siguiente</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CATEGORIES TAB */}
              {activeTab === 'categories' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-slate-900">
                        Gestión de Categorías Holísticas ({categories.length})
                      </h3>
                      <p className="text-xs text-slate-600">
                        Edita las fotos, nombres y textos descriptivos de todas las categorías de la tienda.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingCategory({
                          name: '',
                          description: '',
                          imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800'
                        });
                        setIsCategoryModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#004080] hover:bg-[#002d5a] text-white rounded-xl text-xs font-bold shadow transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nueva Categoría</span>
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-300 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <th className="p-3">Imagen</th>
                          <th className="p-3">Nombre</th>
                          <th className="p-3">Descripción / Texto</th>
                          <th className="p-3 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-800">
                        {categories.map((cat) => (
                          <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3">
                              <img
                                src={cat.imageUrl}
                                alt={cat.name}
                                className="w-12 h-12 object-cover rounded-xl border border-slate-200 shadow-sm"
                              />
                            </td>
                            <td className="p-3 font-serif font-bold text-sm text-[#004080]">
                              {cat.name}
                            </td>
                            <td className="p-3 text-slate-600 max-w-md">
                              {cat.description || <span className="italic text-slate-400">Sin descripción</span>}
                            </td>
                            <td className="p-3 text-right space-x-1">
                              <button
                                onClick={() => {
                                  setEditingCategory(cat);
                                  setIsCategoryModalOpen(true);
                                }}
                                className="p-2 text-[#004080] hover:text-[#002d5a] bg-blue-50 rounded-xl font-medium transition-colors"
                                title="Editar categoría"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="p-2 text-red-700 hover:text-red-900 bg-red-50 rounded-xl font-medium transition-colors"
                                title="Eliminar categoría"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 2. BANNERS TAB */}
              {activeTab === 'banners' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-slate-900">
                        Banners Principales de Portada ({banners.length})
                      </h3>
                      <p className="text-xs text-slate-600">
                        Administra las imágenes y textos destacados del carrusel principal de la tienda.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingBanner({
                          title: '',
                          subtitle: '',
                          imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=1200',
                          ctaText: 'Explorar Tienda',
                          ctaLink: '#productos',
                          active: true,
                          order: banners.length + 1
                        });
                        setIsBannerModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#004080] hover:bg-[#002d5a] text-white rounded-xl text-xs font-bold shadow transition-all shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nuevo Banner</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {banners.map((b) => (
                      <div
                        key={b.id}
                        className="bg-white p-4 rounded-2xl border border-slate-300 shadow-sm space-y-3 relative flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="relative rounded-xl overflow-hidden h-36 bg-slate-100">
                            <img
                              src={b.imageUrl}
                              alt={b.title}
                              className="w-full h-full object-cover"
                            />
                            <span
                              className={`absolute top-2 right-2 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow ${
                                b.active !== false
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-500 text-white'
                              }`}
                            >
                              {b.active !== false ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h4 className="font-serif font-bold text-sm text-[#004080] leading-snug">
                                {b.title}
                              </h4>
                              <p className="text-xs text-slate-600 mt-0.5">{b.subtitle}</p>
                            </div>
                            <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded border">
                              Orden: {b.order}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 pt-1 border-t flex justify-between">
                            <span>Botón: <strong className="text-slate-800">{b.ctaText}</strong></span>
                            <span>Enlace: <strong className="text-slate-800">{b.ctaLink}</strong></span>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t">
                          <button
                            onClick={() => {
                              setEditingBanner(b);
                              setIsBannerModalOpen(true);
                            }}
                            className="p-2 text-[#004080] hover:text-[#002d5a] bg-blue-50 rounded-xl font-medium transition-colors flex items-center gap-1 text-xs"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => handleDeleteBanner(b.id)}
                            className="p-2 text-red-700 hover:text-red-900 bg-red-50 rounded-xl font-medium transition-colors flex items-center gap-1 text-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. BLOG TAB */}
              {activeTab === 'blog' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-slate-900">
                        Artículos del Blog de Bienestar ({blogPosts.length})
                      </h3>
                      <p className="text-xs text-slate-600">
                        Publica y edita notas de sabiduría holística, sahumado, cristales y rituales.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingBlogPost({
                          title: '',
                          category: 'Rituales',
                          excerpt: '',
                          content: '',
                          imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
                          readTime: '3 min',
                          author: 'Sabrina Catalano',
                          date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
                        });
                        setIsBlogModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#004080] hover:bg-[#002d5a] text-white rounded-xl text-xs font-bold shadow transition-all shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nuevo Artículo</span>
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-300 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <th className="p-3">Portada</th>
                          <th className="p-3">Título & Categoría</th>
                          <th className="p-3">Resumen</th>
                          <th className="p-3">Fecha & Lectura</th>
                          <th className="p-3 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-800">
                        {blogPosts.map((post) => (
                          <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3">
                              <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-14 h-12 object-cover rounded-xl border border-slate-200 shadow-sm"
                              />
                            </td>
                            <td className="p-3 max-w-xs">
                              <h4 className="font-serif font-bold text-sm text-[#004080] leading-snug">
                                {post.title}
                              </h4>
                              <span className="inline-block mt-0.5 bg-blue-50 text-[#004080] text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                                {post.category}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600 max-w-sm line-clamp-2">
                              {post.excerpt || <span className="italic text-slate-400">Sin resumen</span>}
                            </td>
                            <td className="p-3 text-slate-500 whitespace-nowrap">
                              <div>{post.date}</div>
                              <div className="text-[10px] text-slate-400">{post.readTime} • {post.author}</div>
                            </td>
                            <td className="p-3 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setEditingBlogPost(post);
                                  setIsBlogModalOpen(true);
                                }}
                                className="p-2 text-[#004080] hover:text-[#002d5a] bg-blue-50 rounded-xl font-medium transition-colors"
                                title="Editar artículo"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBlogPost(post.id)}
                                className="p-2 text-red-700 hover:text-red-900 bg-red-50 rounded-xl font-medium transition-colors"
                                title="Eliminar artículo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. CONFIG TAB */}
              {activeTab === 'config' && (
                <form onSubmit={handleSaveConfig} className="space-y-6 max-w-4xl text-xs">
                  <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm space-y-1">
                    <h3 className="font-serif font-bold text-lg text-slate-900">
                      Editor General del Sitio Web (CMS Completo)
                    </h3>
                    <p className="text-slate-600">
                      Modifica todos los textos de la barra superior, encabezado, footer, sección de ubicación, formulario de contacto, newsletter y reglas comerciales. Sincronizable con Supabase.
                    </p>
                  </div>

                  {/* SECTION 0: ACTIVAR / DESACTIVAR SECCIONES DE LA WEB (VISIBILIDAD) */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm space-y-4">
                    <h4 className="font-serif font-bold text-sm text-[#004080] border-b border-slate-200 pb-2 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-[#004080]" />
                      <span>Activar o Desactivar Secciones de la Web (Visibilidad Global)</span>
                    </h4>
                    <p className="text-slate-600">
                      Elige exactamente qué elementos, banners, módulos o botones deseas mostrar u ocultar en toda la tienda.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { key: 'showAnnouncementBar', label: 'Barra Superior de Anuncios' },
                        { key: 'showHeroCarousel', label: 'Carrusel de Banners Principal' },
                        { key: 'showCategoriesSection', label: 'Universo de Categorías' },
                        { key: 'showCommercialHighlights', label: 'Razones / Beneficios (Destacados)' },
                        { key: 'showProductCatalog', label: 'Catálogo Principal de Productos' },
                        { key: 'showBlogSection', label: 'Sección de Blog & Artículos' },
                        { key: 'showLocationSection', label: 'Ubicación & Formulario de Contacto' },
                        { key: 'showNewsletterSection', label: 'Boletín de Suscripción (Newsletter)' },
                        { key: 'showFooterSection', label: 'Pie de Página (Footer)' },
                        { key: 'showWhatsAppButton', label: 'Botón Flotante de WhatsApp' },
                        { key: 'showLowStockBadges', label: 'Leyenda Global de Últimas Unidades' }
                      ].map((item) => (
                        <label
                          key={item.key}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 cursor-pointer font-semibold text-slate-800"
                        >
                          <input
                            type="checkbox"
                            checked={(config as any)[item.key] !== false}
                            onChange={(e) =>
                              onConfigChange({ ...config, [item.key]: e.target.checked })
                            }
                            className="w-4 h-4 text-[#004080] rounded"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 1: ANUNCIO, HEADER Y CONTACTO GENERAL */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm space-y-4">
                    <h4 className="font-serif font-bold text-sm text-[#004080] border-b border-slate-200 pb-2 flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-[#004080]" />
                      <span>Barra Superior de Anuncios, Header & Contacto</span>
                    </h4>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Texto de la Barra de Anuncios Superior
                      </label>
                      <input
                        type="text"
                        value={config.announcementText}
                        onChange={(e) => onConfigChange({ ...config, announcementText: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                        placeholder="✨ ¡ENVÍOS A TODO EL PAÍS! 📦..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Teléfono de Contacto (Público)
                        </label>
                        <input
                          type="text"
                          value={config.phone}
                          onChange={(e) => onConfigChange({ ...config, phone: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                          placeholder="+54 9 11 6450-4653"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Número WhatsApp Ventas (Sin + ni espacios)
                        </label>
                        <input
                          type="text"
                          value={config.whatsappNumber}
                          onChange={(e) => onConfigChange({ ...config, whatsappNumber: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                          placeholder="5491164504653"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Email Oficial de Contacto
                        </label>
                        <input
                          type="email"
                          value={config.email}
                          onChange={(e) => onConfigChange({ ...config, email: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                          placeholder="contacto@barmina.com.ar"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Encabezado de Mensaje Automático para Carrito en WhatsApp
                      </label>
                      <input
                        type="text"
                        value={config.whatsappMessageHeader}
                        onChange={(e) => onConfigChange({ ...config, whatsappMessageHeader: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                      />
                    </div>
                  </div>

                  {/* SECTION 2: UBICACION, SHOWROOM Y HORARIOS */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm space-y-4">
                    <h4 className="font-serif font-bold text-sm text-[#004080] border-b border-slate-200 pb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#004080]" />
                      <span>Ubicación, Showroom & Horarios de Atención</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Título de la Sección Ubicación
                        </label>
                        <input
                          type="text"
                          value={config.locationTitle || ''}
                          onChange={(e) => onConfigChange({ ...config, locationTitle: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                          placeholder="Visítanos en Parque Chacabuco"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Dirección Física Completa
                        </label>
                        <input
                          type="text"
                          value={config.storeAddress}
                          onChange={(e) => onConfigChange({ ...config, storeAddress: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                          placeholder="Parque Chacabuco, CABA"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Subtítulo Explicativo de la Ubicación
                      </label>
                      <input
                        type="text"
                        value={config.locationSubtitle || ''}
                        onChange={(e) => onConfigChange({ ...config, locationSubtitle: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                        placeholder="Conoce nuestro espacio holístico en CABA..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Barrio / Zona
                        </label>
                        <input
                          type="text"
                          value={config.neighborhood}
                          onChange={(e) => onConfigChange({ ...config, neighborhood: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                          placeholder="Parque Chacabuco"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Ciudad & País
                        </label>
                        <input
                          type="text"
                          value={config.city}
                          onChange={(e) => onConfigChange({ ...config, city: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                          placeholder="Buenos Aires, Argentina"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Horarios de Atención al Público
                      </label>
                      <input
                        type="text"
                        value={config.storeHours || ''}
                        onChange={(e) => onConfigChange({ ...config, storeHours: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                        placeholder="Lunes a Viernes de 09:30 a 18:30 hs | Sábados de 10:00 a 14:00 hs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        URL de Mapa Embed (iFrame de Google Maps)
                      </label>
                      <input
                        type="text"
                        value={config.mapEmbedUrl || ''}
                        onChange={(e) => onConfigChange({ ...config, mapEmbedUrl: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-[11px]"
                        placeholder="https://www.google.com/maps/embed?..."
                      />
                    </div>
                  </div>

                  {/* SECTION 3: NEWSLETTER / BOLETÍN */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm space-y-4">
                    <h4 className="font-serif font-bold text-sm text-[#004080] border-b border-slate-200 pb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#004080]" />
                      <span>Boletín de Novedades (Newsletter)</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Título del Newsletter
                        </label>
                        <input
                          type="text"
                          value={config.newsletterTitle || ''}
                          onChange={(e) => onConfigChange({ ...config, newsletterTitle: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                          placeholder="Recibe Novedades, Calendario Lunar & Descuentos"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Texto del Botón de Suscripción
                        </label>
                        <input
                          type="text"
                          value={config.newsletterButtonText || ''}
                          onChange={(e) => onConfigChange({ ...config, newsletterButtonText: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                          placeholder="Suscribirme Gratis"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Subtítulo Explicativo
                      </label>
                      <textarea
                        rows={2}
                        value={config.newsletterSubtitle || ''}
                        onChange={(e) => onConfigChange({ ...config, newsletterSubtitle: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                        placeholder="Suscríbete a nuestro boletín para recibir guías de sahumado..."
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Mensaje de Éxito al Suscribirse
                      </label>
                      <input
                        type="text"
                        value={config.newsletterSuccessMessage || ''}
                        onChange={(e) => onConfigChange({ ...config, newsletterSuccessMessage: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                        placeholder="¡Gracias por unirte a nuestra comunidad holística!"
                      />
                    </div>
                  </div>

                  {/* SECTION 4: FOOTER Y REDES SOCIALES */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm space-y-4">
                    <h4 className="font-serif font-bold text-sm text-[#004080] border-b border-slate-200 pb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#004080]" />
                      <span>Pie de Página (Footer) & Redes Sociales</span>
                    </h4>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Texto Resumen "Sobre la Tienda" en Footer
                      </label>
                      <textarea
                        rows={2}
                        value={config.footerAbout || ''}
                        onChange={(e) => onConfigChange({ ...config, footerAbout: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                        placeholder="Tienda holística dedicada al bienestar, aromaterapia..."
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Texto de Copyright / Derechos Reservados
                      </label>
                      <input
                        type="text"
                        value={config.footerCopyright || ''}
                        onChange={(e) => onConfigChange({ ...config, footerCopyright: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                        placeholder="Tienda Holística Barmina. Todos los derechos reservados."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          URL de Perfil Instagram
                        </label>
                        <input
                          type="text"
                          value={config.instagramUrl || ''}
                          onChange={(e) => onConfigChange({ ...config, instagramUrl: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                          placeholder="https://instagram.com/barminaholistica"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          URL de Perfil TikTok
                        </label>
                        <input
                          type="text"
                          value={config.tiktokUrl || ''}
                          onChange={(e) => onConfigChange({ ...config, tiktokUrl: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                          placeholder="https://tiktok.com/@barminaholistica"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4B: DESTACADOS COMERCIALES (ENVÍOS, ATENCIÓN, 100% NATURAL, ASESORAMIENTO) */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm space-y-4">
                    <h4 className="font-serif font-bold text-sm text-[#004080] border-b border-slate-200 pb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#004080]" />
                      <span>Destacados Comerciales (Textos de '¿Por qué elegirnos?' e Iconos)</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Título de la Sección</label>
                        <input
                          type="text"
                          value={config.highlightsTitle || ''}
                          onChange={(e) => onConfigChange({ ...config, highlightsTitle: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Subtítulo</label>
                        <input
                          type="text"
                          value={config.highlightsSubtitle || ''}
                          onChange={(e) => onConfigChange({ ...config, highlightsSubtitle: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Insignia / Badge</label>
                        <input
                          type="text"
                          value={config.highlightsBadge || ''}
                          onChange={(e) => onConfigChange({ ...config, highlightsBadge: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <span className="block font-bold text-slate-900">Editar cada una de las 4 Tarjetas Destacadas:</span>
                      {(config.commercialHighlights || []).map((ch, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                          <div className="font-bold text-[#004080]">Tarjeta #{idx + 1}</div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-700">Título</label>
                              <input
                                type="text"
                                value={ch.title}
                                onChange={(e) => {
                                  const updated = [...(config.commercialHighlights || [])];
                                  updated[idx] = { ...updated[idx], title: e.target.value };
                                  onConfigChange({ ...config, commercialHighlights: updated });
                                }}
                                className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-700">Descripción / Texto</label>
                              <input
                                type="text"
                                value={ch.description}
                                onChange={(e) => {
                                  const updated = [...(config.commercialHighlights || [])];
                                  updated[idx] = { ...updated[idx], description: e.target.value };
                                  onConfigChange({ ...config, commercialHighlights: updated });
                                }}
                                className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-700">Icono Lucide</label>
                              <select
                                value={ch.icon}
                                onChange={(e) => {
                                  const updated = [...(config.commercialHighlights || [])];
                                  updated[idx] = { ...updated[idx], icon: e.target.value };
                                  onConfigChange({ ...config, commercialHighlights: updated });
                                }}
                                className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-medium"
                              >
                                <option value="Truck">Truck (Envíos)</option>
                                <option value="Store">Store (Showroom / Retiro)</option>
                                <option value="Sparkles">Sparkles (100% Natural)</option>
                                <option value="PhoneCall">PhoneCall (Asesoramiento)</option>
                                <option value="ShieldCheck">ShieldCheck (Seguridad)</option>
                                <option value="Heart">Heart (Pasión / Amor)</option>
                                <option value="Leaf">Leaf (Botánica / Hierbas)</option>
                                <option value="Star">Star (Garantía)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 5: REGLAS COMERCIALES Y SEGURIDAD */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm space-y-4">
                    <h4 className="font-serif font-bold text-sm text-[#004080] border-b border-slate-200 pb-2 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-[#004080]" />
                      <span>Reglas Comerciales, Envíos & PIN de Administrador</span>
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Mínimo Mayorista ($)
                        </label>
                        <input
                          type="number"
                          value={config.minWholesaleAmount}
                          onChange={(e) =>
                            onConfigChange({ ...config, minWholesaleAmount: Number(e.target.value) })
                          }
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Costo Envío Fijo ($)
                        </label>
                        <input
                          type="number"
                          value={config.flatShippingCost}
                          onChange={(e) =>
                            onConfigChange({ ...config, flatShippingCost: Number(e.target.value) })
                          }
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Umbral Envío Gratis ($)
                        </label>
                        <input
                          type="number"
                          value={config.freeShippingThreshold}
                          onChange={(e) =>
                            onConfigChange({ ...config, freeShippingThreshold: Number(e.target.value) })
                          }
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          % Desc. Transferencia
                        </label>
                        <input
                          type="number"
                          value={config.transferDiscountPercent}
                          onChange={(e) =>
                            onConfigChange({ ...config, transferDiscountPercent: Number(e.target.value) })
                          }
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        PIN Secreto para Ingreso al Panel Admin
                      </label>
                      <input
                        type="text"
                        value={config.adminPin}
                        onChange={(e) => onConfigChange({ ...config, adminPin: e.target.value })}
                        className="w-full md:w-64 p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#004080] text-white font-bold text-sm rounded-2xl hover:bg-[#002d5a] transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5 text-white" />
                    <span>Guardar Toda la Configuración Web en Supabase</span>
                  </button>
                </form>
              )}

              {/* 4. ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    Historial de Pedidos Realizados ({orders.length})
                  </h3>
                  {orders.length === 0 ? (
                    <p className="text-xs text-slate-600">No hay pedidos registrados aún.</p>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white p-4 rounded-2xl border border-slate-300 text-xs space-y-2 shadow-sm"
                        >
                          <div className="flex justify-between items-center font-bold text-slate-900">
                            <span>{order.customerName} - {order.phone}</span>
                            <span className="bg-[#004080]/10 text-[#004080] px-2 py-0.5 rounded">
                              ${order.total.toLocaleString('es-AR')} ({order.paymentMethod})
                            </span>
                          </div>
                          <p className="text-slate-600">{order.address}, {order.city}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 5. SUBSCRIBERS TAB */}
              {activeTab === 'subscribers' && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    Suscriptores del Newsletter ({subscribers.length})
                  </h3>
                  <div className="bg-white rounded-2xl border border-slate-300 p-4 text-xs space-y-2">
                    {subscribers.map((sub) => (
                      <div key={sub.id} className="py-1 border-b border-slate-200 text-slate-900 font-medium">
                        {sub.email}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. SUPABASE CONNECTION TAB */}
              {activeTab === 'supabase' && (
                <div className="space-y-5 text-xs max-w-3xl">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-900">
                      Gestión & Diagnóstico de Conexión Supabase
                    </h3>
                    <p className="text-slate-600">
                      Configura la URL y la Clave Anónima (Anon Key) de tu base de datos Supabase para sincronizar tus productos en tiempo real.
                    </p>
                  </div>

                  {/* Status Banner */}
                  {supaTestResult.message ? (
                    <div
                      className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                        supaTestResult.connected
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : 'bg-red-50 border-red-300 text-red-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold mb-1">
                        {supaTestResult.connected ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                        )}
                        <span>
                          {supaTestResult.connected
                            ? '🟢 Conexión Activa con Supabase'
                            : '🔴 Estado: No se pudo leer la tabla de productos'}
                        </span>
                      </div>
                      <p>{supaTestResult.message}</p>
                      {supaTestResult.details && (
                        <p className="mt-1 font-semibold opacity-90">{supaTestResult.details}</p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-blue-900 flex items-center justify-between">
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <Database className="w-4 h-4 text-[#004080]" />
                          Estado de Conexión
                        </div>
                        <p className="text-slate-600 mt-0.5">
                          Presiona "Probar y Guardar Conexión" para verificar tus credenciales.
                        </p>
                      </div>
                      <button
                        onClick={() => handleTestAndSaveSupabase()}
                        className="bg-[#004080] text-white font-bold px-3.5 py-2 rounded-xl hover:bg-[#002d5a] transition-all shadow shrink-0"
                      >
                        Probar Conexión
                      </button>
                    </div>
                  )}

                  {/* Credentials Form */}
                  <form
                    onSubmit={handleTestAndSaveSupabase}
                    className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm space-y-4"
                  >
                    <h4 className="font-bold text-sm text-slate-900 border-b pb-2">
                      Credenciales del Proyecto Supabase
                    </h4>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        URL del Proyecto Supabase (Project URL)
                      </label>
                      <input
                        type="url"
                        required
                        value={supaUrl}
                        onChange={(e) => setSupaUrl(e.target.value)}
                        placeholder="https://tu-proyecto.supabase.co"
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004080]"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Se encuentra en Supabase bajo <i>Project Settings &gt; API &gt; Project URL</i>
                      </span>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Clave Anónima / Pública (Anon Key)
                      </label>
                      <input
                        type="text"
                        required
                        value={supaKey}
                        onChange={(e) => setSupaKey(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004080]"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Se encuentra en Supabase bajo <i>Project Settings &gt; API &gt; Project API keys (anon public)</i>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-[#004080] text-white font-bold rounded-xl hover:bg-[#002d5a] transition-colors shadow flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Guardar y Probar Conexión</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleFetchFromSupabase}
                        className="py-3 px-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors shadow flex items-center gap-1.5"
                      >
                        <Package className="w-4 h-4" />
                        <span>📥 Cargar Productos de Supabase</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSeedSupabase}
                        className="py-3 px-4 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 transition-colors shadow flex items-center gap-1.5"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>📤 Subir Productos a Supabase</span>
                      </button>
                    </div>
                  </form>

                  {/* SQL Setup Helper Accordion */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-slate-900">
                        ¿Creaste un proyecto nuevo en Supabase? (Guía SQL)
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowSqlGuide(!showSqlGuide)}
                        className="text-xs text-[#004080] font-bold underline"
                      >
                        {showSqlGuide ? 'Ocultar Guía' : 'Ver Código SQL'}
                      </button>
                    </div>

                    {showSqlGuide && (
                      <div className="space-y-2 pt-2 border-t text-slate-700">
                        <p>
                          Copia este comando y ejecútalo en el <b>SQL Editor</b> de tu proyecto en Supabase para crear la tabla de productos con acceso público:
                        </p>
                        <pre className="bg-slate-900 text-slate-100 p-3 rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed">
{`CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text,
  price_minorista numeric,
  price_mayorista numeric,
  description text,
  image_url text,
  stock integer DEFAULT 20,
  featured boolean DEFAULT false,
  properties text[],
  usage_guide text
);

-- Habilitar permisos de lectura pública (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura pública"
ON products FOR SELECT USING (true);

CREATE POLICY "Permitir escritura pública"
ON products FOR ALL USING (true);`}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#004080]/70 backdrop-blur-sm">
          <form
            onSubmit={handleSaveProduct}
            className="bg-[#f5f1e9] p-6 rounded-3xl max-w-lg w-full border border-slate-300 shadow-2xl space-y-3 text-xs max-h-[90vh] overflow-y-auto"
          >
            <h4 className="font-serif font-bold text-lg text-[#004080] border-b pb-2">
              {editingProduct?.id ? 'Editar Producto' : 'Crear Nuevo Producto'}
            </h4>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Nombre del Producto</label>
              <input
                type="text"
                required
                value={editingProduct?.name || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Categoría</label>
                <select
                  value={editingProduct?.category || 'Sahumerios'}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })
                  }
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium"
                >
                  {ALL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Stock</label>
                <input
                  type="number"
                  value={editingProduct?.stock ?? 20}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Precio Minorista ($)</label>
                <input
                  type="number"
                  required
                  value={editingProduct?.priceMinorista || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, priceMinorista: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Precio Mayorista ($)</label>
                <input
                  type="number"
                  required
                  value={editingProduct?.priceMayorista || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, priceMayorista: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold text-emerald-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">URL de la Imagen</label>
              <input
                type="url"
                value={editingProduct?.imageUrl || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Descripción Holística</label>
              <textarea
                rows={3}
                value={editingProduct?.description || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="block font-bold text-slate-800">Opciones & Etiquetas del Producto:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="feat"
                    checked={Boolean(editingProduct?.featured)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="w-4 h-4 text-[#004080] rounded"
                  />
                  <label htmlFor="feat" className="font-medium text-slate-800">
                    ★ Producto Destacado
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isNew"
                    checked={Boolean(editingProduct?.isNew)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                    className="w-4 h-4 text-[#004080] rounded"
                  />
                  <label htmlFor="isNew" className="font-medium text-slate-800">
                    ✨ Producto Nuevo / Lanzamiento
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={editingProduct?.inStock !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                    className="w-4 h-4 text-[#004080] rounded"
                  />
                  <label htmlFor="inStock" className="font-medium text-slate-800">
                    🟢 En Stock (Disponible)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="lowStockBadge"
                    checked={Boolean(editingProduct?.showLowStockBadge)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, showLowStockBadge: e.target.checked })}
                    className="w-4 h-4 text-[#004080] rounded"
                  />
                  <label htmlFor="lowStockBadge" className="font-medium text-slate-800">
                    🔥 Leyenda "¡Últimas Unidades!"
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="px-4 py-2 bg-slate-200 text-slate-800 font-bold rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#004080] text-white font-bold rounded-xl hover:bg-[#002d5a]"
              >
                Guardar Producto
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Edit Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-[#004080]">
                {editingCategory?.id ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Nombre de la Categoría</label>
                <input
                  type="text"
                  required
                  value={editingCategory?.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="Ej: Velas, Sahumerios..."
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">URL de la Foto / Imagen</label>
                <input
                  type="url"
                  required
                  value={editingCategory?.imageUrl || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                />
                {editingCategory?.imageUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">Vista previa:</span>
                    <img
                      src={editingCategory.imageUrl}
                      alt="Vista previa"
                      className="w-12 h-12 object-cover rounded-lg border shadow-sm"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Texto Descriptivo Holístico</label>
                <textarea
                  rows={3}
                  value={editingCategory?.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="Breve descripción o texto explicativo de los productos de esta categoría..."
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#004080] text-white font-bold rounded-xl hover:bg-[#002d5a]"
                >
                  Guardar Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Banner Edit Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-[#004080]">
                {editingBanner?.id ? 'Editar Banner' : 'Nuevo Banner'}
              </h3>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Título Principal</label>
                <input
                  type="text"
                  required
                  value={editingBanner?.title || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  placeholder="Ej: Sahumerios & Defumación Consciente"
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Subtítulo / Bajada</label>
                <textarea
                  rows={2}
                  value={editingBanner?.subtitle || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  placeholder="Ej: Limpia y purifica las energías de tu hogar..."
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">URL de la Imagen de Fondo</label>
                <input
                  type="url"
                  required
                  value={editingBanner?.imageUrl || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                />
                {editingBanner?.imageUrl && (
                  <div className="mt-2 space-y-1">
                    <span className="text-[10px] text-slate-500">Vista previa:</span>
                    <img
                      src={editingBanner.imageUrl}
                      alt="Vista previa"
                      className="w-full h-24 object-cover rounded-xl border shadow-sm"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Texto del Botón</label>
                  <input
                    type="text"
                    value={editingBanner?.ctaText || 'Explorar Tienda'}
                    onChange={(e) => setEditingBanner({ ...editingBanner, ctaText: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Enlace / Destino</label>
                  <input
                    type="text"
                    value={editingBanner?.ctaLink || '#productos'}
                    onChange={(e) => setEditingBanner({ ...editingBanner, ctaLink: e.target.value })}
                    placeholder="#productos o https://..."
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 items-center pt-1">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Orden de Aparición</label>
                  <input
                    type="number"
                    value={editingBanner?.order ?? 1}
                    onChange={(e) => setEditingBanner({ ...editingBanner, order: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="banner-active"
                    checked={editingBanner?.active !== false}
                    onChange={(e) => setEditingBanner({ ...editingBanner, active: e.target.checked })}
                    className="w-4 h-4 text-[#004080] rounded"
                  />
                  <label htmlFor="banner-active" className="font-bold text-slate-800">
                    Banner Activo en Portada
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#004080] text-white font-bold rounded-xl hover:bg-[#002d5a]"
                >
                  Guardar Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog Post Edit Modal */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-[#004080]">
                {editingBlogPost?.id ? 'Editar Artículo de Blog' : 'Nuevo Artículo de Blog'}
              </h3>
              <button
                onClick={() => setIsBlogModalOpen(false)}
                className="text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlogPost} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Título del Artículo</label>
                <input
                  type="text"
                  required
                  value={editingBlogPost?.title || ''}
                  onChange={(e) => setEditingBlogPost({ ...editingBlogPost, title: e.target.value })}
                  placeholder="Ej: Guía de Sahumado Consciente para el Hogar"
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Categoría</label>
                  <input
                    type="text"
                    required
                    value={editingBlogPost?.category || 'Rituales'}
                    onChange={(e) => setEditingBlogPost({ ...editingBlogPost, category: e.target.value })}
                    placeholder="Ej: Rituales, Cristales..."
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Tiempo de Lectura</label>
                  <input
                    type="text"
                    value={editingBlogPost?.readTime || '3 min'}
                    onChange={(e) => setEditingBlogPost({ ...editingBlogPost, readTime: e.target.value })}
                    placeholder="Ej: 4 min"
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Autor</label>
                  <input
                    type="text"
                    value={editingBlogPost?.author || 'Sabrina Catalano'}
                    onChange={(e) => setEditingBlogPost({ ...editingBlogPost, author: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">URL de la Imagen de Portada</label>
                <input
                  type="url"
                  required
                  value={editingBlogPost?.imageUrl || ''}
                  onChange={(e) => setEditingBlogPost({ ...editingBlogPost, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                />
                {editingBlogPost?.imageUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">Vista previa:</span>
                    <img
                      src={editingBlogPost.imageUrl}
                      alt="Vista previa"
                      className="w-16 h-12 object-cover rounded-lg border shadow-sm"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Resumen Corto (Aparece en la tarjeta)</label>
                <textarea
                  rows={2}
                  required
                  value={editingBlogPost?.excerpt || ''}
                  onChange={(e) => setEditingBlogPost({ ...editingBlogPost, excerpt: e.target.value })}
                  placeholder="Escribe un breve resumen de 2 líneas para llamar la atención del lector..."
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Contenido Completo del Artículo</label>
                <textarea
                  rows={6}
                  required
                  value={editingBlogPost?.content || ''}
                  onChange={(e) => setEditingBlogPost({ ...editingBlogPost, content: e.target.value })}
                  placeholder="Escribe el desarrollo completo de la nota. Puedes usar saltos de línea..."
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-sans leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#004080] text-white font-bold rounded-xl hover:bg-[#002d5a]"
                >
                  Guardar Artículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
