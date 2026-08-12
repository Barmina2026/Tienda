import React, { useState, useEffect, useMemo } from 'react';
import {
  Product,
  Banner,
  BlogPost,
  SiteConfig,
  CartItem,
  ProductCategory,
  CheckoutDetails,
  Order,
  CategoryItem
} from './types';
import {
  fetchProductsFromSupabase,
  fetchCategoriesFromSupabase,
  fetchBannersFromSupabase,
  fetchBlogPostsFromSupabase,
  fetchSiteConfigFromSupabase,
  saveOrderToSupabase
} from './lib/supabase';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { CategoryCards } from './components/CategoryCards';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { CommercialHighlights } from './components/CommercialHighlights';
import { BlogSection } from './components/BlogSection';
import { LocationAndContact } from './components/LocationAndContact';
import { Newsletter } from './components/Newsletter';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { INITIAL_SITE_CONFIG, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BANNERS, INITIAL_BLOG_POSTS } from './data/initialData';

export default function App() {
  // Global Data States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [config, setConfig] = useState<SiteConfig>(INITIAL_SITE_CONFIG);

  // App UI States
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'Todas'>('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [saleType, setSaleType] = useState<'minorista' | 'mayorista'>('minorista');

  // Cart & Modals State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Load from Supabase on Mount & Listen for /admin extension
  useEffect(() => {
    const checkAdminRoute = () => {
      if (
        window.location.pathname.toLowerCase().includes('admin') ||
        window.location.hash === '#admin' ||
        window.location.search.toLowerCase().includes('admin')
      ) {
        setIsAdminOpen(true);
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);

    async function loadInitialData() {
      try {
        const [pData, catData, bData, blogData, cData] = await Promise.all([
          fetchProductsFromSupabase(),
          fetchCategoriesFromSupabase(),
          fetchBannersFromSupabase(),
          fetchBlogPostsFromSupabase(),
          fetchSiteConfigFromSupabase()
        ]);
        if (pData && pData.length > 0) setProducts(pData);
        if (catData && catData.length > 0) setCategories(catData);
        if (bData && bData.length > 0) setBanners(bData);
        if (blogData && blogData.length > 0) setBlogPosts(blogData);
        if (cData) setConfig(cData);
      } catch (err) {
        console.warn('Initial data load completed with local fallback:', err);
      }
    }
    loadInitialData();

    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
    };
  }, []);

  // Product Count per Category
  const productCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Cart Actions
  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      }
      return [...prev, { product, quantity, saleType }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCompleteCheckout = async (details: CheckoutDetails, total: number) => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
      customerName: details.customerName,
      phone: details.phone,
      email: details.email,
      address: details.address,
      city: details.city,
      saleType: details.saleType,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: details.saleType === 'mayorista' ? item.product.priceMayorista : item.product.priceMinorista
      })),
      paymentMethod: details.paymentMethod,
      shippingCost: details.shippingOption === 'local' ? 0 : config.flatShippingCost,
      total,
      status: 'Pendiente'
    };

    await saveOrderToSupabase(newOrder);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f5f1e9] text-slate-800 font-sans selection:bg-[#004080] selection:text-white flex flex-col justify-between">
      <div>
        {/* Top Announcement Bar */}
        <AnnouncementBar
          config={config}
          saleType={saleType}
          onToggleSaleType={setSaleType}
        />

        {/* Navigation Bar */}
        <Navbar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          saleType={saleType}
          onToggleSaleType={setSaleType}
          onOpenAdmin={() => setIsAdminOpen(true)}
          wishlistCount={0}
        />

        {/* Hero Banner Carousel */}
        <HeroCarousel
          banners={banners}
          config={config}
          onCtaClick={() => {
            const target = document.getElementById('productos');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Main Category Cards */}
        <CategoryCards
          categories={categories}
          config={config}
          onSelectCategory={setSelectedCategory}
          productCountByCategory={productCountByCategory}
        />

        {/* Product Catalog Grid */}
        <ProductGrid
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchTerm={searchTerm}
          saleType={saleType}
          onAddToCart={handleAddToCart}
          onQuickView={setQuickViewProduct}
          config={config}
        />

        {/* Commercial Highlights */}
        <CommercialHighlights config={config} onToggleSaleType={setSaleType} />

        {/* Holistic Blog Articles */}
        <BlogSection posts={blogPosts} config={config} />

        {/* Showroom Location & Contact */}
        <LocationAndContact config={config} />

        {/* Newsletter Subscription */}
        <Newsletter config={config} />
      </div>

      {/* Footer */}
      <Footer
        config={config}
        onSelectCategory={setSelectedCategory}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Modals & Slide-overs */}
      <ProductModal
        product={quickViewProduct}
        saleType={saleType}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        saleType={saleType}
        onToggleSaleType={setSaleType}
        config={config}
        onCompleteCheckout={handleCompleteCheckout}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onProductsChange={setProducts}
        categories={categories}
        onCategoriesChange={setCategories}
        banners={banners}
        onBannersChange={setBanners}
        blogPosts={blogPosts}
        onBlogPostsChange={setBlogPosts}
        config={config}
        onConfigChange={setConfig}
      />

      {/* Fixed WhatsApp Floating Action Button */}
      <WhatsAppButton config={config} />
    </div>
  );
}
