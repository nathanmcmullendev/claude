# RapidWoo

**A serverless e-commerce product management system built for GitHub Pages**

RapidWoo is a lightweight, fully client-side e-commerce solution that requires no backend server. Products are stored as JSON in your GitHub repository, images are hosted on Cloudinary CDN, and the entire system runs on GitHub Pages for free.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-GitHub%20Pages-black.svg)
![Storage](https://img.shields.io/badge/storage-Cloudinary%20CDN-blue.svg)

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [File Structure](#file-structure)
- [Product Data Schema](#product-data-schema)
- [Editor Guide](#editor-guide)
- [Image Handling](#image-handling)
- [Save & Sync Flow](#save--sync-flow)
- [Shop Integration](#shop-integration)
- [API Reference](#api-reference)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [Development Notes](#development-notes)

---

## Features

### Core Features
- ✅ **Serverless Architecture** - Runs entirely on GitHub Pages, no backend required
- ✅ **Visual Product Editor** - Full-featured slide-out panel for editing products
- ✅ **Cloudinary CDN Integration** - Automatic image upload and optimization
- ✅ **GitHub API Sync** - Products saved directly to your repository
- ✅ **Real-time Preview** - Live shop preview within the editor
- ✅ **Variable Products** - Support for sizes, colors, and custom attributes
- ✅ **Bulk Operations** - Select multiple products for batch actions

### Product Management
- Create, edit, duplicate, and delete products
- Variable product support with SKU generation
- Inventory tracking (in stock, out of stock, on backorder)
- Sale pricing with automatic price display
- Categories and tags
- SEO-friendly slugs
- Short and long descriptions
- Multiple gallery images

### Editor Features
- Drag & drop image uploads
- Collapsible sections for organized editing
- Column visibility toggles
- Import/Export JSON
- Demo data loading
- Settings panel for credentials

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Editor UI  │  │  Shop UI    │  │  Product Pages          │  │
│  │  /demo/     │  │  /shop.html │  │  /product.html          │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
│         │                │                      │                │
│         ▼                ▼                      ▼                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    JavaScript Layer                       │   │
│  │  storage.js │ editor.js │ imageHandler.js │ cart.js      │   │
│  └──────────────────────────────────────────────────────────┘   │
│         │                │                      │                │
└─────────┼────────────────┼──────────────────────┼────────────────┘
          │                │                      │
          ▼                ▼                      ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────────┐
│   localStorage  │ │  GitHub API     │ │  Cloudinary API         │
│   (cache/draft) │ │  (persistence)  │ │  (image CDN)            │
└─────────────────┘ └────────┬────────┘ └─────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  GitHub Pages   │
                    │  (hosting)      │
                    │                 │
                    │ /data/          │
                    │   products.json │
                    └─────────────────┘
```

### Data Flow

1. **Read**: Browser fetches `products.json` from GitHub Pages
2. **Cache**: Products cached in localStorage for instant access
3. **Edit**: Changes saved to localStorage immediately (auto-save)
4. **Persist**: Manual "Save" pushes to GitHub via API
5. **Deploy**: GitHub Actions deploys changes (~30 seconds)
6. **Images**: Uploaded to Cloudinary, URL stored in product data

---

## Quick Start

### 1. Fork the Repository

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/rapidwoo.git
cd rapidwoo
```

### 2. Enable GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Set source to **GitHub Actions**
3. The site will deploy to `https://YOUR_USERNAME.github.io/rapidwoo/`

### 3. Create a GitHub Personal Access Token

1. Go to **GitHub Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**
2. Create new token with:
   - Repository access: Select your rapidwoo repo
   - Permissions: Contents (Read and write)
3. Copy the token (starts with `github_pat_`)

### 4. Set Up Cloudinary (Free)

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to **Settings** → **Upload** → **Upload presets**
3. Create new preset:
   - Name: `rapidwoo_unsigned`
   - Signing Mode: **Unsigned**
   - Folder: `rapidwoo/products`
4. Note your **Cloud name** from the dashboard

### 5. Configure the Editor

1. Open `https://YOUR_SITE/demo/`
2. Click **⚙️ Settings**
3. Enter your credentials:
   - GitHub Token
   - GitHub Username
   - Repository Name
   - Cloudinary Cloud Name
   - Upload Preset
4. Click **Save & Test Connection**

---

## Configuration

### Settings Storage

Credentials are stored in browser localStorage under the key `rapidwoo-config`:

```javascript
{
  "github": {
    "token": "github_pat_xxxx",
    "owner": "your-username",
    "repo": "rapidwoo",
    "branch": "main",
    "productPath": "data/products.json"
  },
  "cloudinary": {
    "cloudName": "your-cloud-name",
    "uploadPreset": "rapidwoo_unsigned"
  }
}
```

### Programmatic Configuration

```javascript
// Configure GitHub
RapidWoo.Storage.configureGitHub({
  token: "github_pat_xxxx",
  owner: "your-username",
  repo: "rapidwoo",
  branch: "main"
});

// Configure Cloudinary
RapidWoo.Storage.configureCloudinary({
  cloudName: "your-cloud-name",
  uploadPreset: "rapidwoo_unsigned"
});

// Check configuration status
RapidWoo.Storage.isGitHubConfigured();    // true/false
RapidWoo.Storage.isCloudinaryConfigured(); // true/false
```

---

## File Structure

```
rapidwoo/
├── index.html              # Landing/home page
├── shop.html               # Product listing page
├── product.html            # Single product page
│
├── data/
│   ├── products.json       # Live product data (synced with GitHub)
│   └── dummy-products.json # Demo/sample products
│
├── demo/
│   ├── index.html          # Product editor interface
│   └── editor.js           # Editor logic, UI, save handling
│
├── assets/
│   ├── css/
│   │   ├── main.css        # Global styles
│   │   ├── components.css  # Reusable components
│   │   └── editor.css      # Editor-specific styles
│   │
│   └── js/
│       ├── storage.js      # localStorage + GitHub API
│       ├── imageHandler.js # Cloudinary upload + compression
│       ├── config.js       # Default configuration
│       ├── utils.js        # Utilities (toast, modal, etc.)
│       └── cart.js         # Shopping cart functionality
│
└── .github/
    └── workflows/
        └── static.yml      # GitHub Pages deployment
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `storage.js` | Handles all data persistence: localStorage caching, GitHub API saves, configuration management |
| `editor.js` | Complete product editor: UI rendering, form handling, image uploads, variations management |
| `imageHandler.js` | Image processing: Cloudinary uploads, validation, base64 fallback compression |
| `config.js` | Default settings, image constraints, product templates |
| `utils.js` | Helper functions: DOM queries, toast notifications, modals, confirmations |
| `cart.js` | Shopping cart: add/remove items, quantity management, checkout |

---

## Product Data Schema

Products are stored in `data/products.json` with the following structure:

```json
{
  "products": [
    {
      "id": 1734567890123,
      "title": "Product Name",
      "slug": "product-name",
      "sku": "PROD-001",
      "type": "simple",
      "stock_status": "instock",
      "regular_price": "29.99",
      "sale_price": "24.99",
      "price": "24.99",
      "short_description": "Brief product summary",
      "description": "Full product description with details",
      "categories": ["Category1", "Category2"],
      "tags": ["tag1", "tag2"],
      "image": "https://res.cloudinary.com/xxx/image/upload/product-1.jpg",
      "images": [
        "https://res.cloudinary.com/xxx/image/upload/product-2.jpg",
        "https://res.cloudinary.com/xxx/image/upload/product-3.jpg"
      ],
      "gallery": [
        {"url": "https://res.cloudinary.com/xxx/image/upload/product-2.jpg"},
        {"url": "https://res.cloudinary.com/xxx/image/upload/product-3.jpg"}
      ],
      "extra_images_enabled": true,
      "hidden": false,
      "attributes": {
        "Size": ["S", "M", "L", "XL"]
      },
      "variations": [
        {
          "id": 1734567890124,
          "sku": "PROD-001-S",
          "attributes": {"Size": "S"},
          "regular_price": "29.99",
          "sale_price": "24.99",
          "stock_status": "instock"
        }
      ]
    }
  ]
}
```

### Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique identifier (timestamp-based) |
| `title` | string | Product display name |
| `slug` | string | URL-friendly identifier |
| `sku` | string | Stock keeping unit |
| `type` | string | `"simple"` or `"variable"` |
| `stock_status` | string | `"instock"`, `"outofstock"`, `"onbackorder"` |
| `regular_price` | string | Normal price |
| `sale_price` | string | Discounted price (optional) |
| `price` | string | Active price (sale or regular) |
| `image` | string | Main product image URL |
| `images` | array | Gallery image URLs |
| `gallery` | array | Gallery objects with `{url}` |
| `extra_images_enabled` | boolean | Show gallery images |
| `hidden` | boolean | Hide from shop |
| `attributes` | object | Variation attributes |
| `variations` | array | Variation options |

---

## Editor Guide

### Accessing the Editor

Navigate to `/demo/` on your site (e.g., `https://yoursite.com/demo/`)

### Toolbar Actions

| Button | Action |
|--------|--------|
| **💾 Save** | Push changes to GitHub |
| **🔄 Refresh** | Reload from GitHub (discards local changes) |
| **📦 Load Demo** | Load sample products (doesn't auto-save) |
| **➕ Add** | Create new product |
| **📥 Import** | Import products from JSON file |
| **📤 Export** | Download products as JSON |
| **⚙️ Settings** | Configure GitHub & Cloudinary |

### Editing Products

1. Click the **✏️ pencil icon** on any product row
2. Edit fields in the slide-out panel
3. Changes auto-save to localStorage
4. Click **Save Changes** or the main **💾 Save** button to push to GitHub

### Working with Variations

1. Set **Product Type** to `Variable`
2. Enter **Main Attribute Name** (e.g., "Size")
3. Select **Preset Options** or enter custom options
4. Click **Generate Variations**
5. Customize individual variation prices/stock/SKUs
6. Click **Generate SKUs** for automatic SKU creation

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Escape` | Close edit panel |

---

## Image Handling

### Upload Flow

```
User selects image
        │
        ▼
┌───────────────────┐
│ Validate image    │ ← Check type, size
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐     ┌───────────────────┐
│ Upload to         │────▶│ Return Cloudinary │
│ Cloudinary        │     │ secure_url        │
└─────────┬─────────┘     └───────────────────┘
          │ (if fails)
          ▼
┌───────────────────┐     ┌───────────────────┐
│ Compress to       │────▶│ Return base64     │
│ base64 fallback   │     │ data URL          │
└───────────────────┘     └───────────────────┘
```

### Image Constraints

```javascript
{
  MAX_SIZE: 8 * 1024 * 1024,  // 8MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  COMPRESSION_QUALITY: 0.7,
  MAX_DIMENSION: 800
}
```

### Cloudinary URL Format

```
https://res.cloudinary.com/{cloud_name}/image/upload/{folder}/{filename}
```

Example:
```
https://res.cloudinary.com/dh4qwuvuo/image/upload/rapidwoo/products/tshirt-1.jpg
```

### Image Transformations

Cloudinary supports on-the-fly transformations:

```javascript
// Original
https://res.cloudinary.com/xxx/image/upload/rapidwoo/products/image.jpg

// Resized to 400x400, cropped to fill
https://res.cloudinary.com/xxx/image/upload/w_400,h_400,c_fill/rapidwoo/products/image.jpg

// Auto quality and format
https://res.cloudinary.com/xxx/image/upload/q_auto,f_auto/rapidwoo/products/image.jpg

// Thumbnail (150x150)
https://res.cloudinary.com/xxx/image/upload/w_150,h_150,c_thumb/rapidwoo/products/image.jpg
```

---

## Save & Sync Flow

### Dual-Layer Storage

RapidWoo uses a two-tier storage strategy:

1. **localStorage** (immediate, local)
   - Instant saves on every edit
   - Survives page refresh
   - Browser-specific

2. **GitHub API** (persistent, shared)
   - Manual save via button
   - Permanent storage in repo
   - Deploys to live site

### Save Process

```javascript
// 1. Auto-save to localStorage (every edit)
safeSaveProducts();  // Calls Storage.saveProducts()

// 2. Manual save to GitHub (Save button)
saveToGitHubManual();  // Calls Storage.saveToGitHub()
```

### GitHub API Flow

```
┌─────────────────┐
│ Get current SHA │ ← Required for update
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Encode content  │ ← Base64 encode JSON
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ PUT to GitHub   │ ← Update file
│ Contents API    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │ ← Auto-deploy
│ deploys site    │   (~30 seconds)
└─────────────────┘
```

### Conflict Prevention

A save lock prevents concurrent GitHub API calls:

```javascript
let _githubSaveInProgress = false;

async function saveToGitHubManual() {
  if (_githubSaveInProgress) {
    _pendingGitHubSave = true;
    return;
  }
  _githubSaveInProgress = true;
  // ... save logic
  _githubSaveInProgress = false;
}
```

---

## Shop Integration

### Loading Products in Shop Pages

```javascript
// In shop.html or product.html
const Storage = window.RapidWoo.Storage;

async function loadProducts() {
  try {
    // Try localStorage cache first
    const cached = Storage.getProducts();
    if (cached?.products) {
      return cached.products;
    }
    
    // Fallback to fetch from file
    const response = await fetch('/data/products.json');
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Failed to load products:', error);
    return [];
  }
}
```

### Rendering Products

```javascript
function renderProductCard(product) {
  const price = product.sale_price || product.price || product.regular_price;
  const hasGallery = product.extra_images_enabled && product.images?.length;
  
  return `
    <div class="product-card" data-id="${product.id}">
      <img src="${product.image}" alt="${product.title}">
      ${hasGallery ? `<div class="gallery-indicator">${product.images.length + 1} images</div>` : ''}
      <h3>${product.title}</h3>
      <p class="price">$${parseFloat(price).toFixed(2)}</p>
      ${product.sale_price ? `<p class="was-price">Was $${product.regular_price}</p>` : ''}
      <a href="/product.html?slug=${product.slug}">View Details</a>
    </div>
  `;
}
```

### Cart Integration

```javascript
const Cart = window.RapidWoo.Cart;

// Add to cart
Cart.add(productId, quantity, variationId);

// Get cart contents
const items = Cart.getItems();

// Get total
const total = Cart.getTotal();

// Clear cart
Cart.clear();
```

---

## API Reference

### RapidWoo.Storage

```javascript
// Configuration
Storage.configureGitHub({ token, owner, repo, branch })
Storage.configureCloudinary({ cloudName, uploadPreset })
Storage.isGitHubConfigured() → boolean
Storage.isCloudinaryConfigured() → boolean
Storage.getGitHubConfig() → object

// Product Operations
Storage.getProducts() → { products: [] }
Storage.saveProducts({ products: [] })
Storage.saveToGitHub({ products: [] }) → Promise<{ success, commit, productCount }>
Storage.loadFromGitHub() → Promise<{ products: [] }>

// Import/Export
Storage.importJSON(file) → Promise<{ products: [] }>
Storage.exportJSON({ products: [] })

// Cache Management
Storage.isDirty() → boolean
Storage._markDirty(boolean)
Storage._setCache({ products: [] })
Storage._getCache() → { products: [] }
```

### RapidWoo.ImageHandler

```javascript
// Upload
ImageHandler.uploadToCloudinary(file) → Promise<string>  // Returns URL
ImageHandler.processImageFile(file) → Promise<{ type: 'url'|'base64', data: string }>

// Validation
ImageHandler.validateImage(file) → { valid: boolean, errors: [] }

// Compression (fallback)
ImageHandler.compressImage(file, maxWidth, quality) → Promise<string>  // Returns base64
```

### RapidWoo.Utils

```javascript
// DOM
Utils.q(selector) → Element
Utils.qa(selector) → NodeList
Utils.esc(string) → string  // HTML escape

// Notifications
Utils.showToast(message, type, title)  // type: 'success'|'error'|'warning'|'info'
Utils.showConfirm(message, title) → Promise<boolean>
Utils.showAlert(message, title) → Promise<void>
```

---

## Customization

### Styling

Override CSS variables in your stylesheet:

```css
:root {
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --text: #1f2937;
  --text-muted: #6b7280;
  --bg: #ffffff;
  --bg-alt: #f9fafb;
  --line: #e5e7eb;
}
```

### Adding Custom Fields

1. Add field to product schema in `config.js`
2. Add input to editor panel in `demo/index.html`
3. Handle field in `editor.js` `openPanel()` and `applyPanel()`

### Custom Product Types

Extend the type dropdown in the editor:

```javascript
// In editor.js
const PRODUCT_TYPES = ['simple', 'variable', 'grouped', 'external'];
```

---

## Troubleshooting

### Common Issues

#### "GitHub not configured"
- Go to Settings and enter your GitHub token
- Ensure token has `contents:write` permission

#### Images not uploading
- Check Cloudinary credentials in Settings
- Ensure upload preset is set to **Unsigned**
- Check browser console for errors

#### Changes not appearing on live site
- Wait 30-60 seconds for GitHub Actions deployment
- Hard refresh (`Ctrl+Shift+R`) to clear cache
- Check GitHub Actions tab for deployment status

#### "SHA mismatch" error
- Another save is in progress, wait and retry
- Refresh editor to get latest SHA

#### Corrupted characters (mojibake)
- Ensure files are saved as UTF-8
- Hard refresh to clear cached JavaScript

### Debug Commands

Open browser console and run:

```javascript
// Check configuration
console.log(RapidWoo.Storage.isGitHubConfigured());
console.log(RapidWoo.Storage.isCloudinaryConfigured());

// View current products
console.log(App.products);

// Check localStorage
console.log(localStorage.getItem('rapidwoo-config'));
console.log(localStorage.getItem('rapidwoo-products-cache'));

// Force refresh from GitHub
await RapidWoo.Storage.loadFromGitHub();

// Manual save
await window.saveToGitHubManual();
```

### Cache Reset

```javascript
// Clear product cache (keeps credentials)
localStorage.removeItem('rapidwoo-products-cache');
localStorage.removeItem('rapidwoo-products-dirty');
location.reload();

// Full reset (clears everything)
localStorage.clear();
location.reload();
```

---

## Development Notes

### Local Development

```bash
# Simple local server
npx serve .

# Or with Python
python -m http.server 8000
```

### GitHub Actions Deployment

The `.github/workflows/static.yml` handles automatic deployment:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - uses: actions/deploy-pages@v4
```

### Security Considerations

- **GitHub Token**: Store only in localStorage, never commit
- **Cloudinary**: Use unsigned presets for browser uploads
- **CORS**: GitHub Pages allows cross-origin requests to GitHub API

### Performance Tips

- Use Cloudinary transformations for thumbnails
- Enable gzip in GitHub Pages (automatic)
- Minimize product JSON size (remove unused fields)
- Use `f_auto,q_auto` Cloudinary params for optimal images

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Credits

Built with:
- [Cloudinary](https://cloudinary.com) - Image CDN
- [GitHub Pages](https://pages.github.com) - Hosting
- [GitHub API](https://docs.github.com/en/rest) - Data persistence

---

**Made with ❤️ for serverless e-commerce**
