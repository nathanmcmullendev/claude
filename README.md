# RapidWoo

**A serverless static commerce platform with browser-based admin editor and hosted checkout — no backend required.**

> 🔗 **[Live Demo](https://rapidwoo.com)** · **[Editor](https://rapidwoo.com/demo/)** · Test Card: `4242 4242 4242 4242`

![RapidWoo Editor](https://res.cloudinary.com/dh4qwuvuo/image/upload/v1765797054/rapidwoo/products/lbohiyus6lvimunkwqos.png)

---

## Why This Exists

Most static e-commerce solutions rely on external dashboards or headless CMSs. I wanted to explore whether a **full product management workflow could live entirely in the browser** while persisting safely to GitHub — no server, no database, no monthly hosting costs.

The result is a working proof-of-concept that demonstrates:
- Client-side data persistence using GitHub's REST API
- Real checkout integration (Snipcart) with server-validated pricing
- CDN image uploads directly from the browser (Cloudinary)
- A complete admin interface built in vanilla JavaScript

**Source of truth:** Product JSON in GitHub is the single source of truth — the storefront renders from it, and checkout validation is generated from it.

---

## Key Engineering Challenges

| Challenge | Solution |
|-----------|----------|
| **Client-side persistence** | GitHub Contents API for reads/writes with SHA-based conflict detection |
| **Checkout price integrity** | Auto-generated `snipcart-products.json` validates prices server-side, preventing client tampering |
| **Idempotent variation generation** | Clicking "Generate Variations" twice won't duplicate rows — existing options are detected and skipped |
| **Global SKU uniqueness** | SKU generator builds index from ALL products before creating new codes |
| **Schema evolution without migrations** | Runtime normalization layer handles legacy + current data formats |
| **Optimistic UI with eventual consistency** | localStorage for instant feedback, GitHub API for permanent storage |
| **Zero-cost image pipeline** | Browser → Cloudinary CDN → optimized, cached, responsive delivery |

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  GitHub Pages   │────▶│  Static HTML    │────▶│   Snipcart      │
│  (Free Hosting) │     │  + Vanilla JS   │     │   (Checkout)    │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  GitHub API     │     │   Cloudinary    │     │  Validation     │
│  (Data Store)   │     │   (Image CDN)   │     │  (Price Check)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

**Data Flow:**
```
Editor → localStorage (instant) → GitHub API (permanent) → GitHub Actions → Live site (~60s)
```

**Cost Model:**
- GitHub Pages: Free hosting with SSL
- Cloudinary Free Tier: 25GB storage, 25GB bandwidth/month
- Snipcart Test Mode: Free for development
- **Result:** $0/month infrastructure for low-write stores

---

## Security & Integrity

### Checkout Validation

Snipcart validates every cart item against `snipcart-products.json` before processing payment:

```json
{
  "POST-MIN-0001": {
    "price": 21.99,
    "name": "Poster - Minimal Mountains",
    "variations": [
      { "sku": "POST-MIN-1620-PRINT", "price": 21.99 },
      { "sku": "POST-MIN-2436-PRINT", "price": 29.99 }
    ]
  }
}
```

This file is **auto-generated** when products are saved and deployed with the site. Client-side price manipulation is caught and rejected.

### Threat Model

| Risk | Current Mitigation | Production Path |
|------|-------------------|-----------------|
| Token stored client-side | Fine-grained token, minimal permissions, dedicated bot account | OAuth flow or serverless proxy |
| Price tampering | Snipcart server-side validation | Keep validation file deployed |
| Multi-admin conflicts | SHA-based conflict detection | Locking / PR workflow |
| Malicious image uploads | Cloudinary format/size restrictions | Signed uploads |

---

## What It Does

### Product Editor (`/demo/`)
- Visual admin interface with inline editing
- Bulk actions (delete, duplicate)
- Column visibility toggles
- Simple products (single price) and variable products (size/color variations)
- Drag-and-drop image uploads
- One-click save to GitHub

### Storefront
- Responsive product catalog
- Dynamic price ranges for variable products (`$21.99 – $45.99`)
- Variation selector with live price updates
- Working checkout with Snipcart

### Variable Products
- Generate variations from attribute options (S, M, L, XL)
- Auto-generate globally unique SKUs
- Per-variation pricing and stock status
- Inherited base prices with override capability

---

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Hosting | GitHub Pages | Free, reliable, automatic SSL |
| Data | GitHub REST API | Version control built-in, no database needed |
| Images | Cloudinary | CDN, automatic optimization, free tier |
| Checkout | Snipcart | Handles payments, cart, validation |
| Frontend | Vanilla JS (ES6+) | No build step, no dependencies, fast |

---

## File Structure

```
├── index.html                 # Landing page
├── shop.html                  # Product catalog
├── product.html               # Product detail + variations
├── snipcart-products.json     # Auto-generated price validation
│
├── demo/
│   ├── index.html             # Editor interface
│   └── editor.js              # Editor logic (~2500 lines)
│
├── data/
│   └── products.json          # Product data (source of truth)
│
└── assets/js/
    ├── storage.js             # GitHub API wrapper
    ├── imageHandler.js        # Cloudinary uploads
    └── config.js              # Runtime configuration
```

---

## Try It

**Live demo:** [rapidwoo.com/demo/](https://rapidwoo.com/demo/)

To run your own instance:
1. Fork this repo
2. Enable GitHub Pages (Settings → Pages → GitHub Actions)
3. Create a fine-grained GitHub token (Contents: Read/Write)
4. Set up free Cloudinary account with unsigned upload preset
5. Configure credentials in Editor → Settings

*No secrets are stored in the repo. Editor requires your own credentials.*

---

## What I Learned

1. **GitHub API works as a data store** — version history, atomic updates, and free hosting make it viable for low-write applications.

2. **Idempotency matters in UI generators** — users click buttons multiple times. Generators must detect existing data to prevent duplicates.

3. **Schema evolution is hard without a backend** — I built a normalization layer that handles multiple data formats at runtime.

4. **Client-side security is about tradeoffs** — documenting risks and mitigation paths is more valuable than pretending they don't exist.

5. **Validation must be server-controlled** — even in a "serverless" architecture, price validation needs a source of truth the client can't modify.

---

## Status

**Version:** 3.3  
**Status:** Proof of Concept (functional, not production-ready)

This project demonstrates architecture and solves real engineering problems. For production, token storage would move server-side via OAuth or serverless proxy.

---

## License

MIT

---

*Built by [Nathan McMullen](https://github.com/nathanmcmullendev)*
