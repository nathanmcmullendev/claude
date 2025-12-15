// ============================================
// RAPIDWOO CONFIGURATION - SERVERLESS EDITION
// No PHP required - GitHub API + Cloudinary
// ============================================

window.RapidWoo = window.RapidWoo || {};

window.RapidWoo.Config = {
  // --------------------------------------------
  // LocalStorage Keys
  // --------------------------------------------
  STORAGE_KEYS: {
    USER_PRODUCTS: 'rapidwoo-user-products',
    DEMO_PRODUCTS: 'rapidwoo-demo-products',
    UPLOADED_DEMO: 'rapidwoo-uploaded-demo',
    GITHUB_CONFIG: 'rapidwoo-github-config',
    CLOUDINARY_CONFIG: 'rapidwoo-cloudinary-config',
    PRODUCTS_CACHE: 'rapidwoo-products-cache',
    PRODUCTS_DIRTY: 'rapidwoo-products-dirty'
  },

  // --------------------------------------------
  // API Endpoints (serverless - no PHP!)
  // --------------------------------------------
  API: {
    // Products JSON path in repository
    PRODUCTS_JSON: '/data/products.json',
    // GitHub API base (used by storage.js)
    GITHUB_API: 'https://api.github.com',
    // Cloudinary upload URL template (cloud name inserted at runtime)
    CLOUDINARY_UPLOAD: 'https://api.cloudinary.com/v1_1/{cloudName}/image/upload'
  },

  // --------------------------------------------
  // Default Cloudinary Settings
  // Users can override these in Settings
  // --------------------------------------------
  CLOUDINARY_DEFAULTS: {
    cloudName: 'dh4qwuvuo',  // Your cloud name
    folder: 'rapidwoo'       // Organize uploads in folder
  },

  // --------------------------------------------
  // Image Settings
  // --------------------------------------------
  IMAGE: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB (Cloudinary free tier)
    MAX_WIDTH: 1200,
    QUALITY: 0.85,
    THUMBNAIL_SIZE: 400,
    THUMBNAIL_QUALITY: 0.8,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  },

  // --------------------------------------------
  // Product Defaults
  // --------------------------------------------
  DEFAULTS: {
    PRODUCT: {
      id: null,
      title: 'New Product',
      slug: '',
      sku: '',
      type: 'simple',
      status: 'publish',
      stock_status: 'instock',
      regular_price: '',
      sale_price: '',
      price: '',
      description: '',
      short_description: '',
      categories: [],
      tags: [],
      image: '',
      images: [],
      gallery: [{ url: '' }, { url: '' }],
      extra_images_enabled: false,
      manage_stock: false,
      stock_quantity: null,
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      shipping_class: '',
      featured: false,
      sold_individually: false,
      hidden: false
    }
  },

  // --------------------------------------------
  // Demo Products (fallback if fetch fails)
  // --------------------------------------------
  DEMO_PRODUCTS: [
    {
      id: 1761000000001,
      title: 'Neon City Lights',
      slug: 'neon-city-lights',
      sku: 'ARTP-NEON-001',
      stock_status: 'instock',
      regular_price: '82.00',
      categories: ['Art Prints', 'Photography'],
      tags: ['neon', 'city', 'night'],
      image: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1200&auto=format&fit=crop&q=80',
      images: [],
      gallery: [{ url: '' }, { url: '' }],
      extra_images_enabled: false,
      description: '<p>Vibrant neon reflections across a rainy avenue.</p>',
      short_description: 'A vibrant nightscape bathed in neon.',
      type: 'simple',
      manage_stock: true,
      stock_quantity: 18,
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      hidden: false
    },
    {
      id: 1761000000002,
      title: 'Tropical Wave',
      slug: 'tropical-wave',
      sku: 'ARTP-OCEAN-001',
      stock_status: 'instock',
      regular_price: '99.00',
      categories: ['Art Prints', 'Nature'],
      tags: ['ocean', 'surf', 'blue'],
      image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&auto=format&fit=crop&q=80',
      images: [],
      gallery: [{ url: '' }, { url: '' }],
      extra_images_enabled: false,
      description: '<p>A crystalline breaker captured at golden hour.</p>',
      short_description: 'Serene, high-energy ocean print.',
      type: 'simple',
      manage_stock: true,
      stock_quantity: 32,
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      hidden: false
    },
    {
      id: 1761000000003,
      title: 'Golden Desert Dunes',
      slug: 'golden-desert-dunes',
      sku: 'ARTP-DESERT-001',
      stock_status: 'instock',
      regular_price: '109.00',
      categories: ['Art Prints', 'Landscape'],
      tags: ['desert', 'sand', 'minimal'],
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&auto=format&fit=crop&q=80',
      images: [],
      gallery: [{ url: '' }, { url: '' }],
      extra_images_enabled: false,
      description: '<p>Minimalist ridgelines and long shadows.</p>',
      short_description: 'Minimal desert geometry.',
      type: 'simple',
      manage_stock: false,
      stock_quantity: null,
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      hidden: false
    }
  ]
};

console.log('✅ RapidWoo Config loaded (Serverless Mode)');
