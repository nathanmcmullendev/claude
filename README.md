# RapidWoo

**A serverless e-commerce platform with a browser-based product editor — no backend required.**

> 🔗 **[Live Demo](https://rapidwoo.com)** · **[Editor](https://rapidwoo.com/demo/)** · Test Card: `4242 4242 4242 4242`

![RapidWoo Editor](https://res.cloudinary.com/dh4qwuvuo/image/upload/v1765795777/rapidwoo/products/qcxy2q7u470du17ifurk.png)

---

## Why This Exists

Most static e-commerce solutions rely on external dashboards or headless CMSs. I wanted to explore whether a **full product management workflow could live entirely in the browser** while persisting safely to GitHub — no server, no database, no monthly hosting costs.

The result is a working proof-of-concept that demonstrates:
- Client-side data persistence using GitHub's REST API
- Real checkout integration (Snipcart) with price validation
- CDN image uploads from the browser (Cloudinary)
- A complete admin interface built in vanilla JavaScript

---

## Key Engineering Challenges

These are the interesting problems I solved:

| Challenge | Solution |
|-----------|----------|
| **Client-side persistence** | GitHub Contents API for reads/writes with SHA-based conflict detection |
| **Idempotent variation generation** | Prevent duplicate SKUs when clicking "Generate" multiple times |
| **Global SKU uniqueness** | Build index from all products before generating new SKUs |
| **Schema evolution without migrations** | Runtime normalization layer that handles legacy + new formats |
| **Optimistic UI with eventual consistency** | localStorage for instant feedback, GitHub API for permanent storage |
| **Price validation for checkout security** | Auto-generated validation file synced with product data |
| **Storing credentials client-side** | Documented tradeoffs; designed for dedicated bot accounts with minimal permissions |

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  GitHub Pages   │────▶│  Static HTML    │────▶│   Snipcart      │
│  (Free Hosting) │     │  + Vanilla JS   │     │   (Checkout)    │
└────────┬────────┘     └────────┬────────┘     └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  GitHub API     │     │   Cloudinary    │
│  (Data Store)   │     │   (Image CDN)   │
└─────────────────┘     └─────────────────┘
```

**Data Flow:**
```
User edits → localStorage (instant) → GitHub API (permanent) → GitHub Actions → Live site (~60s)
```

This architecture eliminates:
- Monthly hosting costs
- Database management
- Server maintenance
- DevOps complexity

---

## What It Does

### Product Editor
- Visual interface for creating/editing products
- Simple products (single price) and variable products (size/color variations)
- Drag-and-drop image uploads to Cloudinary
- Real-time preview
- One-click save to GitHub

### Storefront
- Responsive product catalog
- Dynamic price ranges for variable products (`$19.99 – $29.99`)
- Working checkout with Snipcart integration
- Auto-generated price validation to prevent tampering

### Variable Products
- Generate variations from attribute options (S, M, L, XL)
- Auto-generate unique SKUs across all products
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
| Styling | Custom CSS | Full control, no framework bloat |

---

## Code Highlights

**Editor:** `demo/editor.js` (~2500 lines)
- Complete product CRUD interface
- Variation management with idempotent generation
- Image upload with drag-and-drop
- Settings panel for credentials

**Storage Layer:** `assets/js/storage.js`
- GitHub API wrapper with error handling
- SHA tracking for updates
- Dirty state management

**Product Schema:** Normalized at runtime
- Handles legacy and current formats
- Automatic `gallery[]` ↔ `images[]` sync
- Price validation file generation

---

## Tradeoffs & Decisions

| Decision | Tradeoff | Rationale |
|----------|----------|-----------|
| GitHub token in localStorage | Security risk | POC scope; documented mitigation path |
| No build step | No TypeScript, no bundling | Faster iteration, simpler debugging |
| Vanilla JS over React | More verbose | Zero dependencies, no framework lock-in |
| Single editor assumption | No collaboration | Avoids complex conflict resolution |
| 60-second deploy delay | Not instant | Acceptable for low-frequency edits |

---

## Running Locally

```bash
git clone https://github.com/nathanmcmullendev/claude.git
cd claude
# Serve with any static server
npx serve .
```

Then visit `http://localhost:3000/demo/` and configure:
1. GitHub token (fine-grained, Contents: Read/Write)
2. Cloudinary cloud name + unsigned preset
3. Save & test connection

---

## What I Learned

1. **GitHub API is surprisingly capable as a data store** — version history, atomic updates, and free hosting make it viable for low-write applications.

2. **Idempotency matters even in simple UIs** — users click buttons multiple times. If your generators don't check for existing data, you get duplicates.

3. **Schema evolution is hard without a backend** — I ended up building a normalization layer that handles multiple data formats at runtime.

4. **Client-side security is about tradeoffs, not perfection** — documenting the risks and mitigation paths is more valuable than pretending they don't exist.

---

## Status

**Current Version:** 3.3  
**Status:** Proof of Concept (functional, not production-ready)

This project demonstrates the architecture and solves the interesting engineering problems. For production use, the token storage would need to move server-side (OAuth flow or serverless proxy).

---

## License

MIT

---

*Built by [Nathan McMullen](https://github.com/nathanmcmullendev)*
