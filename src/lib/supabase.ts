import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Banner, BlogPost, SiteConfig, Order, Subscriber, CategoryItem } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_BANNERS,
  INITIAL_BLOG_POSTS,
  INITIAL_SITE_CONFIG,
  INITIAL_CATEGORIES
} from '../data/initialData';

// Helper for localStorage keys
const STORAGE_KEYS = {
  SUPABASE_URL: 'barmina_supabase_url',
  SUPABASE_KEY: 'barmina_supabase_key',
  PRODUCTS: 'barmina_products_v1',
  CATEGORIES: 'barmina_categories_v1',
  BANNERS: 'barmina_banners_v1',
  BLOG: 'barmina_blog_v1',
  CONFIG: 'barmina_config_v1',
  ORDERS: 'barmina_orders_v1',
  SUBSCRIBERS: 'barmina_subscribers_v1'
};

export function getSupabaseCredentials() {
  const url =
    localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) ||
    ((import.meta as any).env?.VITE_SUPABASE_URL as string) ||
    'https://zhfjxzcwbwitleitzpzd.supabase.co';
  const key =
    localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY) ||
    ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) ||
    'sb_publishable_0K1zULonS7MQ8TY7VdmkfQ_Mm_Ga3Rd';
  return { url: url.trim(), key: key.trim() };
}

let credentials = getSupabaseCredentials();

export let supabase: SupabaseClient = createClient(credentials.url, credentials.key, {
  auth: { persistSession: true }
});

export function updateSupabaseCredentials(url: string, key: string) {
  const cleanUrl = url.trim();
  const cleanKey = key.trim();
  localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, cleanUrl);
  localStorage.setItem(STORAGE_KEYS.SUPABASE_KEY, cleanKey);
  credentials = { url: cleanUrl, key: cleanKey };
  supabase = createClient(cleanUrl, cleanKey, {
    auth: { persistSession: true }
  });
}

function getLocalData<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn(`Error reading localStorage for ${key}`, e);
  }
  return fallback;
}

function setLocalData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing localStorage for ${key}`, e);
  }
}

// Diagnostics & Connection Status
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  productCount: number;
  message: string;
  tableName?: string;
  details?: string;
}> {
  try {
    // 1. Try 'products'
    let { data, error } = await supabase.from('products').select('*');
    let tableFound = 'products';

    if (error) {
      // 2. Try Spanish table name 'productos'
      const res2 = await supabase.from('productos').select('*');
      if (!res2.error) {
        data = res2.data;
        error = null;
        tableFound = 'productos';
      }
    }

    if (error) {
      return {
        connected: false,
        productCount: 0,
        message: `Error al consultar Supabase: ${error.message} (Código ${error.code || 'N/A'})`,
        details: error.hint || error.details || 'Verifica que la URL y la Anon Key sean correctas y que la tabla "products" o "productos" exista.'
      };
    }

    return {
      connected: true,
      productCount: data?.length || 0,
      tableName: tableFound,
      message: `Conexión exitosa a Supabase (Tabla '${tableFound}'). Se encontraron ${data?.length || 0} productos.`
    };
  } catch (err: any) {
    return {
      connected: false,
      productCount: 0,
      message: `Error de conexión: ${err?.message || 'No se pudo contactar al servidor de Supabase.'}`
    };
  }
}

// ----------------------------------------------------
// PRODUCTS
// ----------------------------------------------------
export async function fetchProductsFromSupabase(): Promise<Product[]> {
  try {
    // Try 'products' table first
    let { data, error } = await supabase.from('products').select('*');

    // Fallback to 'productos' if 'products' returned an error or was empty
    if ((error || !data || data.length === 0)) {
      const resSpanish = await supabase.from('productos').select('*');
      if (!resSpanish.error && resSpanish.data && resSpanish.data.length > 0) {
        data = resSpanish.data;
        error = null;
      }
    }

    if (!error && data && data.length > 0) {
      const formatted: Product[] = data.map((item: any) => {
        const minoristaPrice = Number(
          item.priceMinorista ??
            item.precio_minorista ??
            item.price_minorista ??
            item.precio_venta ??
            item.price ??
            item.precio ??
            0
        );
        const mayoristaPrice = Number(
          item.priceMayorista ??
            item.precio_mayorista ??
            item.price_mayorista ??
            Math.round(minoristaPrice * 0.7)
        );

        return {
          id: item.id?.toString() || `prod-${Math.random()}`,
          name: item.name || item.nombre || item.title || item.titulo || 'Producto Holístico',
          category: item.category || item.categoria || item.type || 'Sahumerios',
          priceMinorista: minoristaPrice,
          priceMayorista: mayoristaPrice,
          description: item.description || item.descripcion || item.detalle || '',
          imageUrl:
            item.imageUrl ||
            item.imagen_url ||
            item.image_url ||
            item.image ||
            item.imagen ||
            'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
          stock: Number(item.stock ?? item.cantidad ?? 20),
          featured: Boolean(item.featured ?? item.destacado ?? false),
          properties: Array.isArray(item.properties)
            ? item.properties
            : Array.isArray(item.propiedades)
            ? item.propiedades
            : typeof item.propiedades === 'string'
            ? item.propiedades.split(',').map((s: string) => s.trim())
            : ['Aromaterapia'],
          usageGuide: item.usageGuide || item.guia_uso || item.uso || '',
          minWholesaleQty: Number(item.minWholesaleQty || 5)
        };
      });

      setLocalData(STORAGE_KEYS.PRODUCTS, formatted);
      return formatted;
    }
  } catch (err) {
    console.warn('Supabase products fetch error:', err);
  }
  return getLocalData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
}

export async function saveProductToSupabase(product: Product): Promise<boolean> {
  // Update local cache
  const local = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const existsIndex = local.findIndex((p) => p.id === product.id);
  let updatedList: Product[];
  if (existsIndex >= 0) {
    updatedList = [...local];
    updatedList[existsIndex] = product;
  } else {
    updatedList = [product, ...local];
  }
  setLocalData(STORAGE_KEYS.PRODUCTS, updatedList);

  // Try saving to Supabase
  try {
    const payload = {
      id: product.id,
      name: product.name,
      category: product.category,
      priceMinorista: product.priceMinorista,
      priceMayorista: product.priceMayorista,
      price_minorista: product.priceMinorista,
      price_mayorista: product.priceMayorista,
      description: product.description,
      imageUrl: product.imageUrl,
      image_url: product.imageUrl,
      stock: product.stock,
      featured: product.featured,
      properties: product.properties,
      usageGuide: product.usageGuide
    };
    
    // Try products table
    const { error } = await supabase.from('products').upsert(payload);
    if (error) {
      // Try productos table
      await supabase.from('productos').upsert(payload);
    }
    return true;
  } catch (err) {
    console.warn('Could not sync product directly to Supabase:', err);
    return false;
  }
}

export async function deleteProductFromSupabase(id: string): Promise<boolean> {
  const local = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const updatedList = local.filter((p) => p.id !== id);
  setLocalData(STORAGE_KEYS.PRODUCTS, updatedList);

  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      await supabase.from('productos').delete().eq('id', id);
    }
    return true;
  } catch (err) {
    console.warn('Could not delete product from Supabase:', err);
    return false;
  }
}

// ----------------------------------------------------
// CATEGORIES
// ----------------------------------------------------
export async function fetchCategoriesFromSupabase(): Promise<CategoryItem[]> {
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (!error && data && data.length > 0) {
      const formatted: CategoryItem[] = data.map((item: any) => ({
        id: item.id?.toString() || `cat-${Math.random()}`,
        name: item.name || item.nombre || 'Categoría',
        description: item.description || item.descripcion || '',
        imageUrl: item.imageUrl || item.imagen_url || item.image_url || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800'
      }));
      setLocalData(STORAGE_KEYS.CATEGORIES, formatted);
      return formatted;
    }
  } catch (err) {
    console.warn('Supabase categories fetch error:', err);
  }
  return getLocalData(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
}

export async function saveCategoryToSupabase(category: CategoryItem): Promise<boolean> {
  const local = getLocalData<CategoryItem[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  const existsIndex = local.findIndex((c) => c.id === category.id);
  let updatedList: CategoryItem[];
  if (existsIndex >= 0) {
    updatedList = [...local];
    updatedList[existsIndex] = category;
  } else {
    updatedList = [...local, category];
  }
  setLocalData(STORAGE_KEYS.CATEGORIES, updatedList);

  try {
    const payload = {
      id: category.id,
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
      imagen_url: category.imageUrl
    };
    await supabase.from('categories').upsert(payload);
    return true;
  } catch (err) {
    console.warn('Could not sync category to Supabase:', err);
    return false;
  }
}

export async function deleteCategoryFromSupabase(id: string): Promise<boolean> {
  const local = getLocalData<CategoryItem[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  const updatedList = local.filter((c) => c.id !== id);
  setLocalData(STORAGE_KEYS.CATEGORIES, updatedList);

  try {
    await supabase.from('categories').delete().eq('id', id);
    return true;
  } catch (err) {
    console.warn('Could not delete category from Supabase:', err);
    return false;
  }
}

// ----------------------------------------------------
// BANNERS
// ----------------------------------------------------
export async function fetchBannersFromSupabase(): Promise<Banner[]> {
  try {
    const { data, error } = await supabase.from('banners').select('*');
    if (!error && data && data.length > 0) {
      const formatted: Banner[] = data.map((b: any) => ({
        id: b.id?.toString() || `banner-${Math.random()}`,
        title: b.title || b.titulo || '',
        subtitle: b.subtitle || b.subtitulo || '',
        imageUrl: b.imageUrl || b.imagen_url || '',
        ctaText: b.ctaText || b.texto_boton || 'Ver Más',
        ctaLink: b.ctaLink || b.enlace || '#productos',
        active: b.active ?? true,
        order: Number(b.order || 1)
      }));
      setLocalData(STORAGE_KEYS.BANNERS, formatted);
      return formatted;
    }
  } catch (err) {
    console.warn('Supabase banners fetch fallback:', err);
  }
  return getLocalData(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
}

export async function saveBannerToSupabase(banner: Banner): Promise<boolean> {
  const local = getLocalData<Banner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
  const existsIndex = local.findIndex((b) => b.id === banner.id);
  let updatedList: Banner[];
  if (existsIndex >= 0) {
    updatedList = [...local];
    updatedList[existsIndex] = banner;
  } else {
    updatedList = [...local, banner];
  }
  setLocalData(STORAGE_KEYS.BANNERS, updatedList);

  try {
    const payload = {
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.imageUrl,
      imagen_url: banner.imageUrl,
      ctaText: banner.ctaText,
      ctaLink: banner.ctaLink,
      active: banner.active,
      order: banner.order
    };
    await supabase.from('banners').upsert(payload);
    return true;
  } catch (err) {
    console.warn('Could not sync banner to Supabase:', err);
    return false;
  }
}

export async function deleteBannerFromSupabase(id: string): Promise<boolean> {
  const local = getLocalData<Banner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
  const updatedList = local.filter((b) => b.id !== id);
  setLocalData(STORAGE_KEYS.BANNERS, updatedList);

  try {
    await supabase.from('banners').delete().eq('id', id);
    return true;
  } catch (err) {
    console.warn('Could not delete banner from Supabase:', err);
    return false;
  }
}

// ----------------------------------------------------
// SITE CONFIGURATION (Includes REST Endpoint)
// ----------------------------------------------------
export async function fetchSiteConfigFromSupabase(): Promise<SiteConfig> {
  const creds = getSupabaseCredentials();
  const configEndpoint = `${creds.url.replace(/\/$/, '')}/rest/v1/configuracion`;
  try {
    // Check REST endpoint specifically specified in prompt: https://zhfjxzcwbwitleitzpzd.supabase.co/rest/v1/configuracion
    const res = await fetch(configEndpoint, {
      headers: {
        apikey: creds.key,
        Authorization: `Bearer ${creds.key}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const conf = data[0];
        const merged: SiteConfig = {
          whatsappNumber: conf.whatsappNumber || conf.whatsapp_number || INITIAL_SITE_CONFIG.whatsappNumber,
          whatsappMessageHeader: conf.whatsappMessageHeader || INITIAL_SITE_CONFIG.whatsappMessageHeader,
          storeAddress: conf.storeAddress || conf.direccion || INITIAL_SITE_CONFIG.storeAddress,
          neighborhood: conf.neighborhood || INITIAL_SITE_CONFIG.neighborhood,
          city: conf.city || INITIAL_SITE_CONFIG.city,
          phone: conf.phone || INITIAL_SITE_CONFIG.phone,
          email: conf.email || INITIAL_SITE_CONFIG.email,
          announcementText: conf.announcementText || conf.texto_anuncio || INITIAL_SITE_CONFIG.announcementText,
          minWholesaleAmount: Number(conf.minWholesaleAmount || INITIAL_SITE_CONFIG.minWholesaleAmount),
          flatShippingCost: Number(conf.flatShippingCost || INITIAL_SITE_CONFIG.flatShippingCost),
          freeShippingThreshold: Number(conf.freeShippingThreshold || INITIAL_SITE_CONFIG.freeShippingThreshold),
          transferDiscountPercent: Number(conf.transferDiscountPercent || INITIAL_SITE_CONFIG.transferDiscountPercent),
          adminPin: conf.adminPin || INITIAL_SITE_CONFIG.adminPin,
          storeHours: conf.storeHours || INITIAL_SITE_CONFIG.storeHours,
          mapEmbedUrl: conf.mapEmbedUrl || INITIAL_SITE_CONFIG.mapEmbedUrl,
          locationTitle: conf.locationTitle || INITIAL_SITE_CONFIG.locationTitle,
          locationSubtitle: conf.locationSubtitle || INITIAL_SITE_CONFIG.locationSubtitle,
          newsletterTitle: conf.newsletterTitle || INITIAL_SITE_CONFIG.newsletterTitle,
          newsletterSubtitle: conf.newsletterSubtitle || INITIAL_SITE_CONFIG.newsletterSubtitle,
          newsletterButtonText: conf.newsletterButtonText || INITIAL_SITE_CONFIG.newsletterButtonText,
          newsletterSuccessMessage: conf.newsletterSuccessMessage || INITIAL_SITE_CONFIG.newsletterSuccessMessage,
          footerAbout: conf.footerAbout || INITIAL_SITE_CONFIG.footerAbout,
          footerCopyright: conf.footerCopyright || INITIAL_SITE_CONFIG.footerCopyright,
          instagramUrl: conf.instagramUrl || INITIAL_SITE_CONFIG.instagramUrl,
          tiktokUrl: conf.tiktokUrl || INITIAL_SITE_CONFIG.tiktokUrl,

          // Toggles
          showAnnouncementBar: conf.showAnnouncementBar !== undefined ? conf.showAnnouncementBar : INITIAL_SITE_CONFIG.showAnnouncementBar,
          showHeroCarousel: conf.showHeroCarousel !== undefined ? conf.showHeroCarousel : INITIAL_SITE_CONFIG.showHeroCarousel,
          showCategoriesSection: conf.showCategoriesSection !== undefined ? conf.showCategoriesSection : INITIAL_SITE_CONFIG.showCategoriesSection,
          showCommercialHighlights: conf.showCommercialHighlights !== undefined ? conf.showCommercialHighlights : INITIAL_SITE_CONFIG.showCommercialHighlights,
          showProductCatalog: conf.showProductCatalog !== undefined ? conf.showProductCatalog : INITIAL_SITE_CONFIG.showProductCatalog,
          showBlogSection: conf.showBlogSection !== undefined ? conf.showBlogSection : INITIAL_SITE_CONFIG.showBlogSection,
          showLocationSection: conf.showLocationSection !== undefined ? conf.showLocationSection : INITIAL_SITE_CONFIG.showLocationSection,
          showNewsletterSection: conf.showNewsletterSection !== undefined ? conf.showNewsletterSection : INITIAL_SITE_CONFIG.showNewsletterSection,
          showFooterSection: conf.showFooterSection !== undefined ? conf.showFooterSection : INITIAL_SITE_CONFIG.showFooterSection,
          showWhatsAppButton: conf.showWhatsAppButton !== undefined ? conf.showWhatsAppButton : INITIAL_SITE_CONFIG.showWhatsAppButton,
          showLowStockBadgeGlobal: conf.showLowStockBadgeGlobal !== undefined ? conf.showLowStockBadgeGlobal : INITIAL_SITE_CONFIG.showLowStockBadgeGlobal,

          // Highlights
          highlightsBadge: conf.highlightsBadge || INITIAL_SITE_CONFIG.highlightsBadge,
          highlightsTitle: conf.highlightsTitle || INITIAL_SITE_CONFIG.highlightsTitle,
          highlightsSubtitle: conf.highlightsSubtitle || INITIAL_SITE_CONFIG.highlightsSubtitle,
          highlight1Title: conf.highlight1Title || INITIAL_SITE_CONFIG.highlight1Title,
          highlight1Desc: conf.highlight1Desc || INITIAL_SITE_CONFIG.highlight1Desc,
          highlight1Icon: conf.highlight1Icon || INITIAL_SITE_CONFIG.highlight1Icon,
          highlight2Title: conf.highlight2Title || INITIAL_SITE_CONFIG.highlight2Title,
          highlight2Desc: conf.highlight2Desc || INITIAL_SITE_CONFIG.highlight2Desc,
          highlight2Icon: conf.highlight2Icon || INITIAL_SITE_CONFIG.highlight2Icon,
          highlight3Title: conf.highlight3Title || INITIAL_SITE_CONFIG.highlight3Title,
          highlight3Desc: conf.highlight3Desc || INITIAL_SITE_CONFIG.highlight3Desc,
          highlight3Icon: conf.highlight3Icon || INITIAL_SITE_CONFIG.highlight3Icon,
          highlight4Title: conf.highlight4Title || INITIAL_SITE_CONFIG.highlight4Title,
          highlight4Desc: conf.highlight4Desc || INITIAL_SITE_CONFIG.highlight4Desc,
          highlight4Icon: conf.highlight4Icon || INITIAL_SITE_CONFIG.highlight4Icon
        };
        setLocalData(STORAGE_KEYS.CONFIG, merged);
        return merged;
      }
    }
  } catch (err) {
    console.warn('Rest configuracion fetch error:', err);
  }
  const localConf = getLocalData<SiteConfig>(STORAGE_KEYS.CONFIG, INITIAL_SITE_CONFIG);
  return { ...INITIAL_SITE_CONFIG, ...localConf };
}

export async function saveSiteConfigToSupabase(config: SiteConfig): Promise<boolean> {
  setLocalData(STORAGE_KEYS.CONFIG, config);
  const creds = getSupabaseCredentials();
  const configEndpoint = `${creds.url.replace(/\/$/, '')}/rest/v1/configuracion`;
  try {
    const res = await fetch(configEndpoint, {
      method: 'POST',
      headers: {
        apikey: creds.key,
        Authorization: `Bearer ${creds.key}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates'
      },
      body: JSON.stringify([{ id: 1, ...config }])
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

// ----------------------------------------------------
// BLOG
// ----------------------------------------------------
export async function fetchBlogPostsFromSupabase(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase.from('blog_posts').select('*');
    if (!error && data && data.length > 0) {
      const formatted: BlogPost[] = data.map((b: any) => ({
        id: b.id?.toString() || `blog-${Math.random()}`,
        title: b.title || b.titulo || '',
        slug: b.slug || (b.title || '').toLowerCase().replace(/[^a-z0-9]/g, '-'),
        excerpt: b.excerpt || b.resumen || '',
        content: b.content || b.contenido || '',
        category: b.category || b.categoria || 'Rituales',
        author: b.author || b.autor || 'Sabrina Catalano',
        date: b.date || b.fecha || new Date().toLocaleDateString('es-AR'),
        imageUrl: b.imageUrl || b.imagen_url || b.image_url || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
        readTime: b.readTime || b.read_time || b.tiempo_lectura || '3 min'
      }));
      setLocalData(STORAGE_KEYS.BLOG, formatted);
      return formatted;
    }
  } catch (err) {
    console.warn('Supabase blog fetch fallback:', err);
  }
  return getLocalData(STORAGE_KEYS.BLOG, INITIAL_BLOG_POSTS);
}

export async function saveBlogPostToSupabase(post: BlogPost): Promise<boolean> {
  const local = getLocalData<BlogPost[]>(STORAGE_KEYS.BLOG, INITIAL_BLOG_POSTS);
  const existsIndex = local.findIndex((p) => p.id === post.id);
  let updatedList: BlogPost[];
  if (existsIndex >= 0) {
    updatedList = [...local];
    updatedList[existsIndex] = post;
  } else {
    updatedList = [post, ...local];
  }
  setLocalData(STORAGE_KEYS.BLOG, updatedList);

  try {
    const payload = {
      id: post.id,
      title: post.title,
      slug: post.slug || post.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.imageUrl,
      image_url: post.imageUrl,
      category: post.category,
      date: post.date,
      readTime: post.readTime,
      read_time: post.readTime,
      author: post.author
    };
    await supabase.from('blog_posts').upsert(payload);
    return true;
  } catch (err) {
    console.warn('Could not sync blog post to Supabase:', err);
    return false;
  }
}

export async function deleteBlogPostFromSupabase(id: string): Promise<boolean> {
  const local = getLocalData<BlogPost[]>(STORAGE_KEYS.BLOG, INITIAL_BLOG_POSTS);
  const updatedList = local.filter((p) => p.id !== id);
  setLocalData(STORAGE_KEYS.BLOG, updatedList);

  try {
    await supabase.from('blog_posts').delete().eq('id', id);
    return true;
  } catch (err) {
    console.warn('Could not delete blog post from Supabase:', err);
    return false;
  }
}

// ----------------------------------------------------
// ORDERS & SUBSCRIBERS
// ----------------------------------------------------
export async function saveOrderToSupabase(order: Order): Promise<boolean> {
  const localOrders = getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
  setLocalData(STORAGE_KEYS.ORDERS, [order, ...localOrders]);

  try {
    await supabase.from('orders').insert([order]);
    return true;
  } catch (err) {
    return false;
  }
}

export function fetchLocalOrders(): Order[] {
  return getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
}

export async function addSubscriberToSupabase(email: string): Promise<boolean> {
  const subscribers = getLocalData<Subscriber[]>(STORAGE_KEYS.SUBSCRIBERS, []);
  if (subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
    return true; // Already subscribed
  }
  const newSub: Subscriber = {
    id: `sub-${Date.now()}`,
    email,
    subscribedAt: new Date().toISOString()
  };
  setLocalData(STORAGE_KEYS.SUBSCRIBERS, [newSub, ...subscribers]);

  try {
    await supabase.from('subscribers').insert([{ email, subscribed_at: newSub.subscribedAt }]);
  } catch (e) {
    // Ignore error
  }
  return true;
}

export function fetchLocalSubscribers(): Subscriber[] {
  return getLocalData<Subscriber[]>(STORAGE_KEYS.SUBSCRIBERS, []);
}

// ----------------------------------------------------
// SEED INITIAL DATA TO SUPABASE
// ----------------------------------------------------
export async function seedAllDataToSupabase(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Seed products
    for (const p of INITIAL_PRODUCTS) {
      await supabase.from('products').upsert(p);
    }
    // 2. Seed banners
    for (const b of INITIAL_BANNERS) {
      await supabase.from('banners').upsert(b);
    }
    // 3. Seed config to REST
    await saveSiteConfigToSupabase(INITIAL_SITE_CONFIG);

    // 4. Seed blog posts
    for (const blog of INITIAL_BLOG_POSTS) {
      await supabase.from('blog_posts').upsert(blog);
    }

    return { success: true, message: '¡Datos iniciales sincronizados con éxito en Supabase!' };
  } catch (e: any) {
    return { success: false, message: `Nota de sincronización: ${e?.message || 'Sincronizado localmente con éxito.'}` };
  }
}
