# RapidWoo

**Static e-commerce with a browser-based product editor. No database. No monthly fees.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PHP](https://img.shields.io/badge/PHP-7.4%2B-purple.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)

RapidWoo is a self-hosted storefront with a WooCommerce-style product editor that runs entirely in the browser. Edit products without touching code—changes save directly to JSON files and can optionally commit to GitHub for automatic deployment.

---

## ✨ Features

- **No Database Required** — Products live in a JSON file. No server maintenance, no database backups, no security patches.
- **Visual Product Editor** — WooCommerce-style admin interface. Edit prices, images, descriptions, variations—all in your browser.
- **Variable Products** — Support for size/color variations with different prices and SKUs.
- **Snipcart Integration** — Drop-in shopping cart with Stripe/PayPal. No backend code required.
- **Image Uploads** — Drag-and-drop or click to upload. Auto-compression with server upload or base64 fallback.
- **GitHub Persistence** — Click save. Changes commit to your repo. Site rebuilds automatically.
- **Free Hosting Compatible** — Deploy on Netlify, Vercel, or any PHP-capable host.
- **No Build Step** — Vanilla HTML, CSS, JavaScript. Fork and customize in minutes.

---

## 📁 Project Structure

```
rapidwoo/
├── index.html              # Homepage with features and hero section
├── shop.html               # Product grid with search and sort
├── product.html            # Single product page (dynamic via ?product=slug)
├── save-products.php       # POST endpoint to save products.json
├── upload-temp.php         # Image upload handler
│
├── assets/
│   ├── css/
│   │   ├── main.css        # Global styles, CSS variables, layout
│   │   └── components.css  # Toasts, modals, cards, forms
│   └── js/
│       ├── config.js       # Configuration and constants
│       ├── storage.js      # Data persistence (localStorage + server)
│       ├── utils.js        # UI helpers (toasts, confirms, modals)
│       ├── imageHandler.js # Image upload and compression
│       └── cart.js         # Snipcart integration helpers
│
├── data/
│   ├── products.json       # Working product data (modified by editor)
│   └── dummy-products.json # Sample products (pristine, for reset)
│
└── demo/
    ├── index.html          # Product Editor UI (admin interface)
    └── editor.js           # Editor logic (~2200 lines)
```

---

## 🚀 Quick Start

### Option 1: Deploy to Netlify (Recommended)

1. **Fork this repository** to your GitHub account
2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com) and click "Add new site"
   - Choose "Import an existing project" → GitHub
   - Select your forked repo
3. **Configure Snipcart:**
   - Get your API key from [snipcart.com](https://snipcart.com)
   - Update the `data-api-key` in `shop.html` and `product.html`
4. **Done!** Your store is live.

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/rapidwoo.git
cd rapidwoo

# Start a local PHP server
php -S localhost:8000

# Open in browser
open http://localhost:8000
```

### Option 3: Traditional Web Hosting

Upload all files to your web host. Requires PHP 7.4+ with `mb_string` extension.

---

## 📝 Using the Product Editor

Access the editor at `/demo/` (e.g., `https://yoursite.com/demo/`).

### Editor Features

| Feature | Description |
|---------|-------------|
| **Inline Editing** | Click any cell in the table to edit directly |
| **Side Panel** | Click ✏️ to open the full editor with all fields |
| **Preview** | Click 👁️ to preview how the product will look |
| **Bulk Actions** | Select multiple products to delete, hide, or show |
| **Image Upload** | Drag-drop or click to upload images |
| **Variable Products** | Create size/color variations with different prices |

### Toolbar Actions

| Button | Action |
|--------|--------|
| ➕ **Add Product** | Create a new product |
| 💾 **Save** | Save changes to the server |
| 👁️ **View** | View Shop, Shop Settings, Spreadsheet View |
| 📁 **Data** | Refresh, Load Demo, Import/Export JSON |

### Data Management

- **Products.json** — Your working product data (gets modified when you save)
- **Dummy-products.json** — Pristine sample data (never modified, used for "Load Demo")

---

## ⚙️ Configuration

### Snipcart Setup

1. Create a [Snipcart account](https://snipcart.com)
2. Get your public API key from Dashboard → API Keys
3. Replace the `data-api-key` attribute in:
   - `shop.html`
   - `product.html`

```html
<div hidden id="snipcart"
     data-api-key="YOUR_SNIPCART_API_KEY"
     data-config-modal-style="side"
     data-currency="usd">
</div>
```

### Image Upload Settings

Configure in `assets/js/config.js`:

```javascript
IMAGE: {
  MAX_SIZE: 8 * 1024 * 1024,  // 8MB max file size
  MAX_WIDTH: 1200,             // Max width for compression
  QUALITY: 0.85,               // JPEG quality (0-1)
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}
```

### Storage Keys

```javascript
STORAGE_KEYS: {
  USER_PRODUCTS: 'rapidwoo-user-products',    // Primary storage
  DEMO_PRODUCTS: 'rapidwoo-demo-products',    // Cached demos
  UPLOADED_DEMO: 'rapidwoo-uploaded-demo',    // From home upload
}
```

---

## 🛒 Product Schema

Each product in `products.json` follows this structure:

```json
{
  "id": 1762000000001,
  "title": "Product Name",
  "slug": "product-name",
  "sku": "SKU-001",
  "type": "simple",
  "stock_status": "instock",
  "regular_price": "29.99",
  "sale_price": "24.99",
  "price": "24.99",
  "categories": ["Category 1", "Category 2"],
  "tags": ["tag1", "tag2"],
  "image": "https://example.com/image.jpg",
  "images": ["https://example.com/image2.jpg"],
  "gallery": [{"url": ""}, {"url": ""}],
  "extra_images_enabled": false,
  "description": "<p>Full product description with HTML.</p>",
  "short_description": "Brief description for listings.",
  "manage_stock": true,
  "stock_quantity": 50,
  "weight": "1.5",
  "dimensions": {"length": "10", "width": "5", "height": "3"},
  "shipping_class": "standard",
  "featured": false,
  "sold_individually": false,
  "hidden": false
}
```

### Variable Products

For products with variations (sizes, colors):

```json
{
  "type": "variable",
  "attributes": {
    "Size": ["S", "M", "L", "XL"]
  },
  "variations": [
    {
      "id": 17620000000011,
      "sku": "SKU-001-S",
      "attributes": {"Size": "S"},
      "regular_price": "29.99",
      "sale_price": "24.99",
      "stock_status": "instock"
    },
    {
      "id": 17620000000012,
      "sku": "SKU-001-M",
      "attributes": {"Size": "M"},
      "regular_price": "29.99",
      "sale_price": "24.99",
      "stock_status": "instock"
    }
  ]
}
```

---

## 🔧 API Endpoints

### POST `/save-products.php`

Saves products to `data/products.json`.

**Request:**
```json
{
  "products": [...]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Products saved to server",
  "productCount": 11,
  "timestamp": "2025-12-14 22:54:00",
  "commit": "a1b2c3d"
}
```

### POST `/upload-temp.php`

Uploads an image to `/uploads/tmp/`.

**Request:** `multipart/form-data` with `file` or `image` field

**Response:**
```json
{
  "ok": true,
  "url": "https://yoursite.com/uploads/tmp/abc123.jpg",
  "filename": "abc123.jpg",
  "mime": "image/jpeg",
  "width": 1200,
  "height": 800
}
```

---

## 🎨 Customization

### CSS Variables

Customize the look in `assets/css/main.css`:

```css
:root {
  --brand: #2271b1;        /* Primary color */
  --brand-600: #135e96;    /* Darker brand */
  --ink: #0f172a;          /* Text color */
  --text: #334155;         /* Body text */
  --muted: #6b7280;        /* Secondary text */
  --bg: #f5f7fb;           /* Background */
  --card: #ffffff;         /* Card background */
  --line: #e5e7eb;         /* Borders */
  --ok: #0f9d58;           /* Success */
  --danger: #d63638;       /* Error/delete */
  --warn: #f59e0b;         /* Warning */
  --radius: 16px;          /* Border radius */
}
```

### Adding Custom Fields

1. Update `DEFAULTS.PRODUCT` in `config.js`
2. Add form fields in `demo/index.html`
3. Update `normalizeProduct()` in `editor.js`
4. Update `applyPanel()` and `openPanel()` in `editor.js`

---

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

Mobile responsive design works on all modern mobile browsers.

---

## 🐛 Troubleshooting

### Products not saving

1. Check that `save-products.php` has write permissions
2. Verify the `data/` directory exists and is writable
3. Check browser console for errors

### Images not uploading

1. Verify `upload-temp.php` is accessible
2. Check that `uploads/tmp/` directory exists (created automatically)
3. Ensure file size is under 8MB
4. Confirm file type is allowed (JPEG, PNG, WebP, GIF)

### Snipcart not working

1. Verify your API key is correct
2. Check that product URLs are accessible
3. Ensure `data-item-url` points to a valid JSON endpoint

### UTF-8/Encoding issues

If you see corrupted characters:
1. Ensure all files are saved as UTF-8
2. Check `save-products.php` includes proper headers
3. Clear browser localStorage and reload

---

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 🙏 Credits

- **Snipcart** — Shopping cart and checkout
- **Unsplash** — Demo product images
- Built with vanilla HTML, CSS, and JavaScript

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/nathanmcmullendev/rapidwoo/issues)
- **Documentation:** This README

---

*Built by [Nathan McMullen](https://github.com/nathanmcmullendev)*
