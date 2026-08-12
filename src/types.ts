export type ProductCategory =
  | 'Sahumerios'
  | 'Difusores'
  | 'Aromatizantes'
  | 'Velas'
  | 'Porta Sahumerios'
  | 'Accesorios'
  | 'Conos Cascada'
  | 'Esencias'
  | 'Esferas'
  | 'Hornillos y Sahumadores'
  | 'Humidificadores'
  | string;

export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export const ALL_CATEGORIES: string[] = [
  'Sahumerios',
  'Difusores',
  'Aromatizantes',
  'Velas',
  'Porta Sahumerios',
  'Accesorios',
  'Conos Cascada',
  'Esencias',
  'Esferas',
  'Hornillos y Sahumadores',
  'Humidificadores'
];

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  priceMinorista: number;
  priceMayorista: number;
  description: string;
  imageUrl: string;
  stock: number;
  featured?: boolean;
  isNew?: boolean;
  inStock?: boolean;
  showLowStockBadge?: boolean;
  properties?: string[]; // e.g. ["Limpieza Energética", "Calma", "Sándalo"]
  usageGuide?: string;
  minWholesaleQty?: number;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  saleType: 'minorista' | 'mayorista';
}

export type PaymentMethod =
  | 'Efectivo'
  | 'Mercado Pago'
  | 'Transferencia'
  | 'Transferencia Bancaria'
  | 'Tarjeta de Crédito/Débito';

export interface CheckoutDetails {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  saleType: 'minorista' | 'mayorista';
  paymentMethod: PaymentMethod;
  notes?: string;
  shippingOption: 'coordinar_envio' | 'retirar_domicilio' | 'correo' | 'local';
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  saleType: 'minorista' | 'mayorista';
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  paymentMethod: PaymentMethod;
  shippingCost: number;
  total: number;
  status: 'Pendiente' | 'Confirmado' | 'Enviado' | 'Completado';
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
  order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  imageUrl: string;
  readTime: string;
}

export interface SiteConfig {
  whatsappNumber: string;
  whatsappMessageHeader: string;
  storeAddress: string;
  neighborhood: string;
  city: string;
  phone: string;
  email: string;
  announcementText: string;
  minWholesaleAmount: number;
  flatShippingCost: number;
  freeShippingThreshold: number;
  transferDiscountPercent: number;
  adminPin: string;
  // Editable Website Section Fields
  storeHours?: string;
  mapEmbedUrl?: string;
  locationTitle?: string;
  locationSubtitle?: string;
  newsletterTitle?: string;
  newsletterSubtitle?: string;
  newsletterButtonText?: string;
  newsletterSuccessMessage?: string;
  footerAbout?: string;
  footerCopyright?: string;
  instagramUrl?: string;
  tiktokUrl?: string;

  // Global Section Visibility Toggles (Enable/Disable sections)
  showAnnouncementBar?: boolean;
  showHeroCarousel?: boolean;
  showCategoriesSection?: boolean;
  showCommercialHighlights?: boolean;
  showProductCatalog?: boolean;
  showBlogSection?: boolean;
  showLocationSection?: boolean;
  showNewsletterSection?: boolean;
  showFooterSection?: boolean;
  showWhatsAppButton?: boolean;
  showLowStockBadgeGlobal?: boolean;

  // Editable Highlights Section ("Envíos a todo el país", "Atención directa", etc.)
  highlightsTitle?: string;
  highlightsSubtitle?: string;
  highlightsBadge?: string;
  highlight1Title?: string;
  highlight1Desc?: string;
  highlight1Icon?: string;
  highlight2Title?: string;
  highlight2Desc?: string;
  highlight2Icon?: string;
  highlight3Title?: string;
  highlight3Desc?: string;
  highlight3Icon?: string;
  highlight4Title?: string;
  highlight4Desc?: string;
  highlight4Icon?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}
