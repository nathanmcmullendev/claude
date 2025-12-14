// ============================================
// RAPIDWOO CONFIGURATION
// Global constants and settings
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
    LEGACY: 'wfsm-v22-backup' // For backwards compatibility
  },

  // --------------------------------------------
  // API Endpoints
  // --------------------------------------------
  API: {
    UPLOAD: '/upload-temp.php',
    PRODUCTS_JSON: '/data/products.json',
    // NEW: Netlify function for GitHub commits
    GITHUB_SAVE: '/save-products.php'
  },

  // --------------------------------------------
  // Image Settings (used by ImageHandler)
  // --------------------------------------------
  IMAGE: {
    MAX_SIZE: 8 * 1024 * 1024, // 8MB (match PHP)
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
  // Demo Products (fallback if JSON fails)
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
      images: [
        { src: 'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?w=1000&auto=format&fit=crop&q=80' },
        { src: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=1000&auto=format&fit=crop&q=80' }
      ],
      gallery: [{ url: '' }, { url: '' }],
      extra_images_enabled: false,
      description: '<p>Vibrant neon reflections across a rainy avenue. Perfect centerpiece for modern spaces.</p>',
      short_description: 'A vibrant nightscape bathed in neon.',
      type: 'simple',
      manage_stock: true,
      stock_quantity: 18,
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      hidden: false
    },
    {
      id: 1761000000003,
      title: 'Tropical Wave',
      slug: 'tropical-wave',
      sku: 'ARTP-OCEAN-001',
      stock_status: 'instock',
      regular_price: '99.00',
      categories: ['Art Prints', 'Nature'],
      tags: ['ocean', 'surf', 'blue'],
      image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&auto=format&fit=crop&q=80',
      images: [
        { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80' },
        { src: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=1000&auto=format&fit=crop&q=80' }
      ],
      gallery: [{ url: '' }, { url: '' }],
      extra_images_enabled: false,
      description: '<p>A crystalline breaker captured at golden hour. Cool blues with soft foam detail.</p>',
      short_description: 'Serene, high-energy ocean print.',
      type: 'simple',
      manage_stock: true,
      stock_quantity: 32,
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      hidden: false
    },
    {
      id: 1761000000004,
      title: 'Golden Desert Dunes',
      slug: 'golden-desert-dunes',
      sku: 'ARTP-DESERT-001',
      stock_status: 'instock',
      regular_price: '109.00',
      categories: ['Art Prints', 'Landscape'],
      tags: ['desert', 'sand', 'minimal'],
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&auto=format&fit=crop&q=80',
      images: [
        { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000&auto=format&fit=crop&q=80' },
        { src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80' }
      ],
      gallery: [{ url: '' }, { url: '' }],
      extra_images_enabled: false,
      description: '<p>Minimalist ridgelines and long shadowsÃ¢â‚¬â€calm, warm, and sculptural.</p>',
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

console.log('âœ… RapidWoo Config loaded');
