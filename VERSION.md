# RapidWoo Version Documentation

**Current Version:** v3.2  
**Last Updated:** December 15, 2025  
**Repository:** [github.com/nathanmcmullendev/claude](https://github.com/nathanmcmullendev/claude)  
**Live Site:** [rapidwoo.com](https://rapidwoo.com)

---

## Overview

RapidWoo is a **serverless e-commerce platform** running entirely on GitHub Pages. It features a browser-based product editor, Snipcart checkout integration, and Cloudinary image hosting — all without a traditional backend server.

### Core Concept

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   GitHub Pages  │────▶│   Static HTML   │────▶│   Snipcart      │
│   (Hosting)     │     │   + JavaScript  │     │   (Checkout)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   GitHub API    │     │   Cloudinary    │     │   Payment       │
│   (Data Store)  │     │   (Images)      │     │   Processing    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## File Structure

```
rapidwoo/
├── index.html              # Landing page
├── shop.html               # Product catalog grid
├── product.html            # Single product detail page
├── snipcart-products.json  # Price validation for Snipcart
├── CNAME                   # Custom domain config
├── README.md               # Project documentation
│
├── demo/
│   ├── index.html          # Product editor interface
│   └── editor.js           # Editor logic (~2300 lines)
│
├── data/
│   ├── products.json       # Live product data
│   └── dummy-products.json # Demo/fallback data
│
├── assets/
│   ├── js/
│   │   ├── config.js       # Global configuration
│   │   ├── storage.js      # GitHub API & localStorage
│   │   ├── utils.js        # Helper functions
│   │   ├── imageHandler.js # Cloudinary upload handling
│   │   ├── settings.js     # Settings panel logic
│   │   └── cart.js         # Cart utilities
│   │
│   └── css/
│       ├── main.css        # Global styles
│       ├── components.css  # UI components
│       └── editor.css      # Editor-specific styles
│
├── docs/                   # Additional documentation
│
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Pages deployment
```

---

## Data Schema (v1)

### Product Object

```json
{
  "schema_version": 1,
  "products": [
    {
      "id": 1762000000001,
      "title": "Product Name",
      "slug": "product-slug",
      "sku": "SKU-001",
      "type": "simple | variable",
      "stock_status": "instock | outofstock | onbackorder",
      
      "regular_price": "24.99",
      "sale_price": "19.99",
      "price": "19.99",
      
      "categories": ["Category1", "Category2"],
      "tags": ["tag1", "tag2"],
      
      "image": "https://cloudinary.com/...",
      "images": ["url1", "url2"],
      "gallery": [{"url": "..."}, {"url": "..."}],
      "extra_images_enabled": true,
      
      "description": "<p>HTML description</p>",
      "short_description": "Brief text",
      
      "attributes": {
        "Size": ["S", "M", "L", "XL"]
      },
      "variations": [...],
      
      "manage_stock": true,
      "stock_quantity": 50,
      "weight": "0.5",
      "dimensions": {"length": "", "width": "", "height": ""},
      "shipping_class": "standard",
      "sold_individually": false,
      "hidden": false,
      "featured": false
    }
  ]
}
```

### Variation Object (for variable products)

```json
{
  "id": 17620000000011,
  "sku": "SKU-001-S",
  "attributes": {
    "Size": "S"
  },
  "regular_price": "24.99",
  "sale_price": "19.99",
  "stock_status": "instock",
  "price_delta": "+0.00"
}
```

### Price Display Rules

| Product Type | Display Format | Example |
|--------------|----------------|---------|
| Simple | Single price | $24.99 |
| Simple (on sale) | Strikethrough + sale | ~~$24.99~~ $19.99 |
| Variable | Price range | $19.99 – $29.99 |
| Variable (same price) | Single price | $24.99 |

---

## Page Functionality

### Landing Page (`index.html`)
- Hero section with call-to-action
- Featured products showcase
- Navigation to Shop and Editor

### Shop Catalog (`shop.html`)
- Responsive product grid (4/3/2/1 columns)
- Search and sort functionality
- Price range display for variable products
- "Add to Cart" for simple products
- "Choose" button for variable products
- Real-time Snipcart cart integration

### Product Detail (`product.html`)
- Image gallery with thumbnails
- Price range display (updates on variation selection)
- Size/variation selector dropdown
- Quantity input
- Add to Cart with Snipcart integration
- Product description and details

### Product Editor (`demo/index.html`)
- **Product Table**: List view with inline editing (name, SKU, categories, tags)
- **Edit Panel**: Slide-out panel for full product editing
- **Variations Manager**: Generate and manage product variations
- **Image Upload**: Cloudinary integration for image hosting
- **Shop Preview**: Live preview of shop appearance
- **Settings**: GitHub and Cloudinary configuration

---

## Editor Features

### Product Management
- ✅ Create, edit, duplicate, delete products
- ✅ Simple and Variable product types
- ✅ Bulk actions (delete selected)
- ✅ Search and filter products
- ✅ Column visibility toggle

### Pricing
- ✅ Regular and sale prices
- ✅ Variable product variations with individual prices
- ✅ Price range display ($19.99 – $29.99)
- ✅ Base price disabled for variable products (with warning)
- ✅ No inline price editing (prevents accidental changes)

### Images
- ✅ Primary image upload
- ✅ Gallery/additional images
- ✅ Cloudinary CDN hosting
- ✅ Drag-and-drop upload
- ✅ Image preview in editor

### Variations (Variable Products)
- ✅ Attribute-based variations (e.g., Size)
- ✅ Preset options (S-XL, S-XXL, Custom)
- ✅ Auto-generate variations from attributes
- ✅ Auto-generate SKUs
- ✅ Per-variation pricing, stock status

### Data Persistence
- ✅ Save to localStorage (instant, same browser)
- ✅ Save to GitHub (permanent, all devices)
- ✅ Auto-generate snipcart-products.json for validation
- ✅ Load from GitHub on page load

---

## Technical Stack

| Component | Technology |
|-----------|------------|
| Hosting | GitHub Pages |
| Data Storage | GitHub API (products.json) |
| Image CDN | Cloudinary |
| Checkout | Snipcart v3.4.1 |
| Styling | Custom CSS (no framework) |
| JavaScript | Vanilla ES6+ (no framework) |

### External Dependencies
- Snipcart JS/CSS (CDN)
- Cloudinary Upload Widget (optional)

### Browser Support
- Chrome, Firefox, Safari, Edge (modern versions)
- ES6+ JavaScript required

---

## Configuration

### GitHub Settings (stored in localStorage)
```javascript
{
  github: {
    token: "ghp_xxxx",           // Personal Access Token
    owner: "username",           // Repository owner
    repo: "repo-name",           // Repository name
    branch: "main",              // Branch name
    productPath: "data/products.json"
  }
}
```

### Cloudinary Settings
```javascript
{
  cloudinary: {
    cloudName: "your-cloud-name",
    uploadPreset: "unsigned-preset"  // Unsigned upload preset
  }
}
```

### Snipcart Configuration
```javascript
window.SnipcartSettings = {
  publicApiKey: "YOUR_API_KEY",
  loadStrategy: "on-user-interaction",
  currency: "usd"
}
```

---

## Security Considerations

### Current Limitations (POC)
- ⚠️ GitHub PAT stored in browser localStorage
- ⚠️ No server-side authentication
- ⚠️ No multi-user conflict resolution
- ⚠️ Not suitable for production with sensitive data

### What IS Secure
- ✅ Snipcart handles all payment processing (PCI compliant)
- ✅ Price validation via snipcart-products.json prevents tampering
- ✅ No customer PII stored in this system
- ✅ GitHub Pages served over HTTPS

---

## Version History

### v3.2 (Current) - December 15, 2025
- Added beforeunload warning for unsaved changes

### v3.1 - December 15, 2025
- ✅ Price range display for variable products
- ✅ Disabled base price fields for variable products (with warning)
- ✅ Removed inline price editing in product table
- ✅ Fixed UTF-8 encoding issues in product data
- ✅ Product page shows price range until variation selected

### v3.0 - Stable Baseline
- ✅ Complete editor functionality
- ✅ Simple and Variable product support
- ✅ Snipcart integration
- ✅ Cloudinary image upload
- ✅ GitHub API data persistence

### v4.0 (Deprecated)
- Added validation/sanitization
- Had emoji encoding corruption - rolled back

---

## Helper Functions Reference

### `getVariationPriceRange(product)`
Returns price range for variable products.

```javascript
// Returns: { min: 19.99, max: 29.99, isRange: true, formatted: "$19.99 – $29.99" }
// Returns: null for simple products or no variations
```

### `pickPriceNumber(product)`
Returns effective price as number.

```javascript
// Priority: sale_price → price → regular_price
// Returns: 19.99 (number)
```

### `priceOf(product)`
Returns first valid price found.

```javascript
// Priority: sale_price → price → regular_price
// Returns: number or null
```

---

## Deployment

### GitHub Pages
1. Push to `main` branch
2. GitHub Actions workflow triggers
3. Site deploys to `rapidwoo.com` (via CNAME)
4. Typical deployment: 30-60 seconds

### Manual Testing URLs
- Landing: https://rapidwoo.com
- Shop: https://rapidwoo.com/shop.html
- Product: https://rapidwoo.com/product.html?product=graphic-tshirt-neon-wave
- Editor: https://rapidwoo.com/demo/

---

## Troubleshooting

### Products Not Loading
1. Check browser console for errors
2. Verify GitHub token is valid
3. Clear localStorage: `localStorage.clear(); location.reload();`

### Images Not Uploading
1. Verify Cloudinary settings in editor
2. Check upload preset is unsigned
3. Ensure cloud name is correct

### Prices Not Updating
1. Click "Save to GitHub" (not just "Save")
2. Wait 30-60 seconds for GitHub Pages deploy
3. Hard refresh: `Ctrl+Shift+R`

### Encoding Issues (Ã— instead of ×)
- UTF-8 double encoding from copy/paste
- Fix: Replace corrupted characters in JSON
- Prevention: Type directly instead of copy/paste special characters

---

## Future Considerations

### Potential Improvements
- [ ] Server-side authentication (Netlify Functions, Cloudflare Workers)
- [ ] Multi-user support with conflict resolution
- [ ] Order management integration
- [ ] Inventory sync
- [ ] Schema migration tooling (v1 → v2)

### Not Planned
- Customer account management (use Snipcart)
- Payment processing (use Snipcart)
- Full CMS functionality (scope creep)

---

## License

MIT License - See repository for details.

---

*This document describes RapidWoo v3.2 as of December 15, 2025.*
