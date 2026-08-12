import { Product, Banner, BlogPost, SiteConfig, CategoryItem } from '../types';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    name: 'Sahumerios',
    description: 'Resinas puras, varillas artesanales y defumación para la armonización energética.',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cat-2',
    name: 'Difusores',
    description: 'Difusores de varillas de ratán con fragancias delicadas e intensas para el hogar.',
    imageUrl: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cat-3',
    name: 'Aromatizantes',
    description: 'Aromatizantes textiles y ambientales con atomizador para frescura inmediata.',
    imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cat-4',
    name: 'Velas',
    description: 'Velas artesanales 100% cera de soja con cuarzos naturales y flores secas.',
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cat-5',
    name: 'Porta Sahumerios',
    description: 'Tablas talladas en madera sustentable y cuencos cerámicos para sahumar.',
    imageUrl: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cat-6',
    name: 'Accesorios',
    description: 'Pinzas para sahumado, carbones vegetales y accesorios ceremoniales.',
    imageUrl: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cat-7',
    name: 'Conos Cascada',
    description: 'Conos de humo inverso para fuentes de cascada con aroma envolvente.',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cat-8',
    name: 'Esencias',
    description: 'Aceites esenciales concentrados para hornillos y humidificadores.',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cat-9',
    name: 'Esferas',
    description: 'Bolas defumadoras místicas con incienso y mirra para limpieza profunda.',
    imageUrl: 'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cat-10',
    name: 'Hornillos y Sahumadores',
    description: 'Hornillos cerámicos artesanales y sahumadores tradicionales con mango.',
    imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cat-11',
    name: 'Humidificadores',
    description: 'Humidificadores ultrasónicos con luces LED para cromoterapia.',
    imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&q=80&w=800'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Sahumerios Sagrada Madre - Resinas Naturales',
    category: 'Sahumerios',
    priceMinorista: 2800,
    priceMayorista: 1950,
    description: 'Sahumerios ecológicos y 100% artesanales elaborados con resinas puras, carbón vegetal e hierbas sagradas. Ideales para sahumado de ambientes y meditación profunda.',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
    stock: 45,
    featured: true,
    properties: ['Limpieza Energética', 'Resina Pura', 'Paz & Armonía'],
    usageGuide: 'Encender la punta del varillo con fósforo de madera, dejar arder durante unos segundos y soplar suavemente la llama. Colocar en un porta sahumerio.',
    minWholesaleQty: 10
  },
  {
    id: 'prod-2',
    name: 'Sahumerios Dhoop Conos de Sándalo Sagrado',
    category: 'Sahumerios',
    priceMinorista: 2200,
    priceMayorista: 1500,
    description: 'Varillas y conos espesos de fragancia Sándalo místico. Actúa sobre el chakra corona promoviendo la concentración y la relajación.',
    imageUrl: 'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&q=80&w=800',
    stock: 60,
    featured: false,
    properties: ['Sándalo Dulce', 'Chakra Corona', 'Meditación'],
    usageGuide: 'Usar en espacios ventilados durante tus rituales matutinos.',
    minWholesaleQty: 10
  },
  {
    id: 'prod-3',
    name: 'Difusor de Ambiente Aromático Vainilla & Lavanda (250ml)',
    category: 'Difusores',
    priceMinorista: 6900,
    priceMayorista: 4800,
    description: 'Difusor de varillas de ratán de larga duración. Perfuma intensamente el hogar con notas cálidas de lavanda silvestre y vainilla dulce.',
    imageUrl: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800',
    stock: 24,
    featured: true,
    properties: ['Aroma Duradero', 'Aromaterapia', 'Anti-Estrés'],
    usageGuide: 'Insertar las varillas de bambú y darles vuelta cada 3 días para mantener la intensidad aromática.',
    minWholesaleQty: 5
  },
  {
    id: 'prod-4',
    name: 'Aromatizante Concentrado Textil Citrus & Azahar (500ml)',
    category: 'Aromatizantes',
    priceMinorista: 4500,
    priceMayorista: 3100,
    description: 'Perfume para telas, sábanas, sillones y cortinas con gatillo atomizador. Aporta frescura instantánea y energía solar revitalizante.',
    imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&q=80&w=800',
    stock: 30,
    featured: false,
    properties: ['Textil & Ambiente', 'Energizante', 'Notas Cítricas'],
    usageGuide: 'Rociar a 30 cm de distancia sobre telas fijas o aire ambiente.',
    minWholesaleQty: 6
  },
  {
    id: 'prod-5',
    name: 'Vela Aromática de Cera de Soja en Cuenco Místico',
    category: 'Velas',
    priceMinorista: 8900,
    priceMayorista: 6200,
    description: 'Vela artesanal vertida a mano en cuenco de cerámica con flores secas de lavanda y cuarzo cristal. 100% cera vegetal de soja no tóxica.',
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800',
    stock: 18,
    featured: true,
    properties: ['Cera 100% Soja', 'Con Cuarzo Natural', 'Duración +40hs'],
    usageGuide: 'Encender durante al menos 1 hora en la primera combustión hasta derretir toda la superficie superior.',
    minWholesaleQty: 4
  },
  {
    id: 'prod-6',
    name: 'Vela Altar Holístico con Cristales Energizados',
    category: 'Velas',
    priceMinorista: 7500,
    priceMayorista: 5200,
    description: 'Vela mística de intención para manifestación, calma y abundancia. Contiene esencia pura de canela, jazmín y chips de amatista.',
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
    stock: 22,
    featured: false,
    properties: ['Amatista', 'Manifestación', 'Aroma Pura Canela'],
    usageGuide: 'Usar para momentos de introspección, journaling y meditación.',
    minWholesaleQty: 4
  },
  {
    id: 'prod-7',
    name: 'Porta Sahumerio Ceremonial Madera Tallada a Mano',
    category: 'Porta Sahumerios',
    priceMinorista: 3900,
    priceMayorista: 2600,
    description: 'Tabla porta sahumerio con grabado místico de las fases lunares y la flor de la vida. Protege tus muebles y recoge las cenizas sagradas.',
    imageUrl: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=800',
    stock: 15,
    featured: false,
    properties: ['Madera Sustentable', 'Artesanal', 'Fases Lunares'],
    usageGuide: 'Colocar sobre superficie plana e insertar el extremo de madera del varillo.',
    minWholesaleQty: 5
  },
  {
    id: 'prod-8',
    name: 'Pinza de Sahumado & Carbonitos Defumadores',
    category: 'Accesorios',
    priceMinorista: 3200,
    priceMayorista: 2100,
    description: 'Pinza metálica dorada para sostener carbonitos vegetales encendidos sin riesgo de quemaduras + pack de 10 carbonitos sin olor.',
    imageUrl: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=800',
    stock: 40,
    featured: false,
    properties: ['Seguridad', 'Defumación', 'Metal Dorado'],
    usageGuide: 'Sostener el carbón vegetal con la pinza mientras se acerca la flama.',
    minWholesaleQty: 10
  },
  {
    id: 'prod-9',
    name: 'Conos Cascada de Humo Inverso - Cascada Energética',
    category: 'Conos Cascada',
    priceMinorista: 3400,
    priceMayorista: 2300,
    description: 'Conos perfumados con orificio central diseñados para sahumar en fuentes de cascada de humo. Crea un manto denso y calmante de humo descendente.',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800',
    stock: 35,
    featured: true,
    properties: ['Humo Denso Descendente', 'Variedad de Aromas', 'Efecto Místico'],
    usageGuide: 'Usar exclusivamente en quemadores de fuente de humo cascada.',
    minWholesaleQty: 8
  },
  {
    id: 'prod-10',
    name: 'Esencia Pura de Aceite Esencial de Palo Santo (15ml)',
    category: 'Esencias',
    priceMinorista: 4900,
    priceMayorista: 3400,
    description: 'Aceite esencial hidrosoluble concentrado de Palo Santo de recolección sustentable. Limpia energías densas y armoniza el espíritu.',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
    stock: 28,
    featured: true,
    properties: ['Palo Santo 100% Puro', 'Aromaterapia', 'Para Hornillo & Humidificador'],
    usageGuide: 'Colocar de 5 a 8 gotas en agua tibia dentro del hornillo o humidificador.',
    minWholesaleQty: 6
  },
  {
    id: 'prod-11',
    name: 'Esferas Defumadoras Mágicas para Limpieza Energética',
    category: 'Esferas',
    priceMinorista: 3600,
    priceMayorista: 2400,
    description: 'Esferas concentradas de incienso, mirra, romero y ruda. Listas para encender directamente en sahumador para sahumar casas y locales.',
    imageUrl: 'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&q=80&w=800',
    stock: 50,
    featured: false,
    properties: ['Limpieza Intensa', 'Incienso & Mirra', 'Uso Directo'],
    usageGuide: 'Encender sobre cuenco cerámico resistente al calor y recorrer los ambientes en sentido de las agujas del reloj.',
    minWholesaleQty: 10
  },
  {
    id: 'prod-12',
    name: 'Hornillo de Cerámica Artesanal & Cuenco Sahumador',
    category: 'Hornillos y Sahumadores',
    priceMinorista: 11500,
    priceMayorista: 8200,
    description: 'Hornillo cerámico calado a mano con cuenco desmontable para esencias y velas de noche + Sahumador con mango de madera rústica.',
    imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=800',
    stock: 12,
    featured: true,
    properties: ['Cerámica Esmaltada', 'Resistente al Calor', 'Hecho en Argentina'],
    usageGuide: 'Llenar el cuenco con agua caliente y agregar gotas de tu esencia favorita.',
    minWholesaleQty: 3
  },
  {
    id: 'prod-13',
    name: 'Humidificador Ultrasónico Místico con Luz LED Cromoterapia',
    category: 'Humidificadores',
    priceMinorista: 18900,
    priceMayorista: 13500,
    description: 'Humidificador y difusor ultrasónico de aromas con acabado de grano de madera cálida. Vapor frío silencioso y 7 luces cromáticas relajantes.',
    imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&q=80&w=800',
    stock: 10,
    featured: true,
    properties: ['Vapor Frío Silencioso', 'Luz Cambiante', 'Capacidad 400ml'],
    usageGuide: 'Conectar por USB o toma corriente, agregar agua purificada y esencias hidrosolubles.',
    minWholesaleQty: 2
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'banner-1',
    title: 'Transforma tu Espacio con Aromas Sagrados',
    subtitle: 'Descubre nuestra línea holística de sahumerios, velas artesanales y esencias naturales. Envíos a todo el país.',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1600',
    ctaText: 'Ver Catálogo Holístico',
    ctaLink: '#productos',
    active: true,
    order: 1
  },
  {
    id: 'banner-2',
    title: 'Ventas por Menor y Mayor con Descuentos Especiales',
    subtitle: 'Surtido completo para tu negocio o emprendimiento holístico. Precios mayoristas directo de fábrica.',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=1600',
    ctaText: 'Solicitar Lista Mayorista',
    ctaLink: '#mayorista',
    active: true,
    order: 2
  },
  {
    id: 'banner-3',
    title: 'Novedades en Aromaterapia & Cera de Soja',
    subtitle: 'Velas en cuenco con cuarzos energizados y humidificadores ultrasónicos con cromoterapia.',
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1600',
    ctaText: 'Explorar Novedades',
    ctaLink: '#productos',
    active: true,
    order: 3
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Guía de Sahumado: Cómo Limpiar y Armonizar la Energía de tu Hogar',
    slug: 'guia-de-sahumado-limpieza-energetica',
    excerpt: 'Aprende los pasos esenciales para sahumular tus ambientes con resinas puras, incienso y hierbas sagradas para liberar energías densas.',
    content: `El sahumado es una práctica milenaria presente en diversas culturas del mundo. Consiste en quemar plantas medicinales, resinas y maderas sagradas para purificar la energía sutil de nuestros espacios.

### ¿Cuándo es conveniente sahumar?
- Al mudarte a un nuevo hogar.
- Luego de visitas concurridas o discusiones.
- Al inicio de un nuevo ciclo lunar o mes.
- Cuando sientas el ambiente denso o pesado.

### Pasos para un sahumado efectivo:
1. **Intención:** Abre ventanas y fija la intención clara de paz, protección y abundancia.
2. **Encendido:** Enciende tu esfera, varilla o carbón vegetal con fósforo de madera.
3. **Recorrido:** Comienza desde el fondo de tu casa hacia la puerta de entrada, recorriendo las esquinas en sentido horario.
4. **Cierre:** Da las gracias y deja que los restos se apaguen solos en un recipiente cerámico seguro.`,
    category: 'Rituales & Energía',
    author: 'Barmina Holística',
    date: '10 de Agosto, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
    readTime: '4 min'
  },
  {
    id: 'post-2',
    title: 'El Poder de la Aromaterapia: Aceites Esenciales para Reducir el Estrés',
    slug: 'poder-de-la-aromaterapia-anti-estres',
    excerpt: 'Descubre cómo los aromas penetran en el sistema límbico modulando tus emociones, mejorando la calidad del sueño y la calma interior.',
    content: `Los aceites esenciales contienen la quintaesencia biológica de flores, hojas y raíces. Al evaporarse mediante humidificadores o hornillos, estimulan directamente los receptores olfativos.

### Aceites recomendados para el estrés:
- **Lavanda:** Promueve la relajación y prepara el cuerpo para un sueño reparador.
- **Sándalo:** Favorece la meditación y aquíeta la mente hiperactiva.
- **Bergamota:** Eleva el ánimo y disipa la ansiedad diaria.

Integra unos minutos de respiración consciente en tu hornillo al regresar del trabajo.`,
    category: 'Bienestar & Aromaterapia',
    author: 'Barmina Holística',
    date: '02 de Agosto, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800',
    readTime: '3 min'
  }
];

export const INITIAL_SITE_CONFIG: SiteConfig = {
  whatsappNumber: '5491164504653',
  whatsappMessageHeader: '✨ Hola Barmina Tienda Holística, quisiera realizar un pedido con los siguientes detalles:',
  storeAddress: 'Parque Chacabuco, Ciudad Autónoma de Buenos Aires',
  neighborhood: 'Parque Chacabuco',
  city: 'Buenos Aires, Argentina',
  phone: '+54 9 11 6450-4653',
  email: 'contacto@barmina.com.ar',
  announcementText: '✨ ¡ENVÍOS A TODO EL PAÍS! 📦 VENTAS POR MENOR Y MAYOR CON ATENCIÓN PERSONALIZADA 🌿',
  minWholesaleAmount: 25000,
  flatShippingCost: 2900,
  freeShippingThreshold: 35000,
  transferDiscountPercent: 10,
  adminPin: '1234',
  storeHours: 'Lunes a Viernes de 09:30 a 18:30 hs | Sábados de 10:00 a 14:00 hs',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13133.090533355208!2d-58.4485573!3d-34.6290073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccb0ef18dbe15%3A0xb36f7eb54f3b20ed!2sParque%20Chacabuco%2C%20CABA!5e0!3m2!1ses!2sar!4v1690000000000!5m2!1ses!2sar',
  locationTitle: 'Visítanos en Parque Chacabuco',
  locationSubtitle: 'Conoce nuestro espacio holístico en la Ciudad Autónoma de Buenos Aires. Atendemos consultas minoristas y mayoristas.',
  newsletterTitle: 'Recibe Novedades, Calendario Lunar & Descuentos',
  newsletterSubtitle: 'Suscríbete a nuestro boletín para recibir guías de sahumado, consejos de aromaterapia y promociones exclusivas para tus compras holísticas.',
  newsletterButtonText: 'Suscribirme Gratis',
  newsletterSuccessMessage: '¡Gracias por unirte a nuestra comunidad holística!',
  footerAbout: 'Tienda holística dedicada al bienestar, aromaterapia y armonización de espacios. Envíos a todo el país y atención personalizada.',
  footerCopyright: 'Tienda Holística Barmina. Todos los derechos reservados.',
  instagramUrl: 'https://instagram.com/barminaholistica',
  tiktokUrl: 'https://tiktok.com/@barminaholistica',

  // Section Toggles Defaults (All active by default)
  showAnnouncementBar: true,
  showHeroCarousel: true,
  showCategoriesSection: true,
  showCommercialHighlights: true,
  showProductCatalog: true,
  showBlogSection: true,
  showLocationSection: true,
  showNewsletterSection: true,
  showFooterSection: true,
  showWhatsAppButton: true,
  showLowStockBadgeGlobal: true,

  // Commercial Highlights Defaults
  highlightsBadge: '¿Por Qué Elegirnos?',
  highlightsTitle: 'Calidad, Energía & Compromiso Holístico',
  highlightsSubtitle: 'Atendemos a nuestros clientes particulares en todo el país con productos cuidadosamente seleccionados para armonizar espacios.',
  highlight1Title: 'Envíos a Todo el País',
  highlight1Desc: 'Despachamos rápidamente a todas las provincias por Correo Argentino, Andreani y mensajería en CABA / GBA.',
  highlight1Icon: 'Truck',
  highlight2Title: 'Atención Directa',
  highlight2Desc: 'Insumos de primera línea para armonizar tu hogar o negocio con envíos rápidos y embalaje protegido.',
  highlight2Icon: 'Store',
  highlight3Title: '100% Natural & Artesanal',
  highlight3Desc: 'Ingredientes puros, resinas naturales, aceites esenciales concentrados y cera de soja vertida a mano.',
  highlight3Icon: 'Sparkles',
  highlight4Title: 'Asesoramiento Personalizado',
  highlight4Desc: 'Te asesoramos por WhatsApp para elegir las fragancias e insumos ideales para tus espacios y rituales.',
  highlight4Icon: 'PhoneCall'
};
