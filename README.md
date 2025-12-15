# RapidWoo

**A serverless e-commerce platform running entirely on GitHub Pages.**

> **Live Demo:** [rapidwoo.com](https://rapidwoo.com)  
> **Current Version:** v3.1  
> **Test Card:** `4242 4242 4242 4242`

---

## Features

### ✅ What's Included

| Feature | Description |
|---------|-------------|
| **Product Editor** | Visual admin interface for managing products |
| **Simple & Variable Products** | Single items or products with variations (sizes, colors) |
| **Price Range Display** | Variable products show `$19.99 – $29.99` |
| **Snipcart Checkout** | Full shopping cart and payment processing |
| **Cloudinary Images** | CDN-hosted product images |
| **GitHub Storage** | Products saved to repository via API |
| **Zero Monthly Cost** | GitHub Pages + Snipcart test mode = free |

### ⚠️ Current Limitations

| Limitation | Reason |
|------------|--------|
| Not production-ready | GitHub token stored in localStorage |
| Single editor only | No multi-user conflict resolution |
| No customer accounts | Snipcart handles all customer data |
| Manual deployment | ~60 second wait after saves |

---

## Quick Start

### 1. Fork & Enable GitHub Pages

```bash
git clone https://github.com/YOUR_USERNAME/rapidwoo.git
```

**Settings → Pages → Source: GitHub Actions**

### 2. Create GitHub Token

1. **Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. Select your repo
3. Grant: **Contents: Read and write**
4. Copy token

### 3. Set Up Cloudinary (Free)

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Create unsigned upload preset
3. Note your Cloud name

### 4. Set Up Snipcart (Free Test Mode)

1. Sign up at [snipcart.com](https://snipcart.com)
2. Get public API key from Dashboard
3. Update API key in HTML files

### 5. Configure Editor

1. Visit `https://YOUR_SITE/demo/`
2. Click **⚙️ Settings**
3. Enter credentials
4. **Save & Test Connection**

---

## Architecture

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

### Data Flow

```
Editor → localStorage (instant) → GitHub API (permanent)
                                        ↓
                              GitHub Actions deploys
                                        ↓
                              Live site updated (~60s)
```

---

## File Structure

```
rapidwoo/
├── index.html              # Landing page
├── shop.html               # Product catalog
├── product.html            # Product detail page
├── snipcart-products.json  # Price validation (auto-generated)
│
├── demo/
│   ├── index.html          # Editor interface
│   └── editor.js           # Editor logic (~2300 lines)
│
├── data/
│   ├── products.json       # Live product data
│   └── dummy-products.json # Demo data
│
├── assets/
│   ├── js/                 # Core modules
│   └── css/                # Stylesheets
│
├── VERSION.md              # Current version documentation
├── ROADMAP.md              # Development roadmap
├── METHODOLOGY.md          # Development approach
└── SESSION-START.md        # Session context guide
```

---

## Documentation

| Document | Purpose |
|----------|---------|
| [VERSION.md](VERSION.md) | Current state, schema, features |
| [ROADMAP.md](ROADMAP.md) | Short-term (v3.2-3.5) and long-term (v4.0-6.0) plans |
| [METHODOLOGY.md](METHODOLOGY.md) | Precision development approach |
| [SESSION-START.md](SESSION-START.md) | How to start development sessions |

---

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Landing | `/` | Hero + featured products |
| Shop | `/shop.html` | Product catalog grid |
| Product | `/product.html?product=slug` | Single product detail |
| Editor | `/demo/` | Admin product editor |

---

## Product Types

### Simple Products
Single item, single price.

```
Price: $24.99
[Add to Cart]
```

### Variable Products
Multiple variations with individual prices.

```
Price: $19.99 – $29.99
Size: [S ▼]
[Add to Cart]
```

When customer selects a size, price updates to that variation's price.

---

## Snipcart Integration

### Price Validation

Products are validated against `snipcart-products.json` to prevent tampering:

```json
{
  "id": "graphic-tshirt",
  "price": 19.99,
  "customFields": [
    { "name": "Size", "options": "S|M|L[+3.00]|XL[+5.00]" }
  ]
}
```

This file auto-generates when you save products.

### Test Checkout

1. Add products to cart
2. Use card: `4242 4242 4242 4242`
3. Expiry: Any future date
4. CVC: Any 3 digits

---

## Security Notes

| Risk | Mitigation |
|------|------------|
| GitHub token in localStorage | Use dedicated bot account with minimal permissions |
| Unsigned Cloudinary uploads | Restrict formats and file size in Cloudinary settings |
| HTML in descriptions | Sanitize with DOMPurify if accepting user content |
| Single editor | Designate one editor or implement locking |

**For production:** Use GitHub OAuth or serverless proxy for token storage.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "GitHub not configured" | Enter credentials in Settings |
| Images not uploading | Check Cloudinary preset is unsigned |
| Changes not appearing | Wait 60s, hard refresh (`Ctrl+Shift+R`) |
| Price mismatch error | Re-save products to regenerate validation |
| Page not loading | Check browser console for JS errors |

### Debug Commands

```javascript
// Check configuration
RapidWoo.Storage.isGitHubConfigured()
RapidWoo.Storage.isCloudinaryConfigured()

// View products
console.log(App.products)

// Clear cache
localStorage.clear(); location.reload();
```

---

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| **v3.1** | Dec 2025 | Price range display, editor UX improvements |
| v3.0 | Dec 2025 | Stable baseline, full editor functionality |
| v4.0 | Deprecated | Had encoding issues, rolled back |

See [VERSION.md](VERSION.md) for complete details.

---

## Roadmap

### Short-Term (v3.2 – v3.5)
- Editor UX polish (spinners, toasts, confirmations)
- Image management improvements
- Variation enhancements
- Data validation

### Long-Term (v4.0 – v6.0)
- Schema migration (prices as cents)
- Security hardening (remove PAT from localStorage)
- Multi-user support
- Order management integration

See [ROADMAP.md](ROADMAP.md) for complete details.

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Hosting | GitHub Pages |
| Data Storage | GitHub API |
| Images | Cloudinary CDN |
| Checkout | Snipcart v3.4.1 |
| Frontend | Vanilla JS (ES6+) |
| Styling | Custom CSS |

---

## Contributing

1. Read [METHODOLOGY.md](METHODOLOGY.md) for development approach
2. Check [ROADMAP.md](ROADMAP.md) for next version tasks
3. Follow precision development process:
   - State goal clearly
   - Identify all affected files
   - Map specific code changes
   - Execute one change at a time
   - Verify each step

---

## License

MIT License

---

## Credits

Built with:
- [Snipcart](https://snipcart.com) — Checkout & payments
- [Cloudinary](https://cloudinary.com) — Image CDN
- [GitHub Pages](https://pages.github.com) — Hosting
- [GitHub API](https://docs.github.com/en/rest) — Data persistence

---

**Version:** 3.1  
**Status:** Proof of Concept  
**Works:** Yes ✔
