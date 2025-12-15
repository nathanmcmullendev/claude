# RapidWoo

**A proof-of-concept serverless product catalog with Snipcart checkout, running entirely on GitHub Pages.**

> **Live Demo:** [rapidwoo.com](https://rapidwoo.com)

## What This Demonstrates

- ✅ Full product catalog with visual editor
- ✅ Snipcart checkout integration (test mode ready - use card `4242424242424242`)
- ✅ Automatic price validation to prevent cart tampering
- ✅ Cloudinary CDN for image hosting
- ✅ GitHub Pages hosting with zero monthly costs
- ✅ No custom backend required

## What This Is NOT

- ❌ **Not production-ready** — PAT stored in browser localStorage (see [Security Notes](#security-notes))
- ❌ **Not multi-user safe** — No conflict resolution for simultaneous editors
- ❌ **Not for customer PII** — No authentication, no customer data protection
- ❌ **Not PCI compliant** — Snipcart handles payment compliance, but this admin interface is not hardened

---

## Quick Start

### 1. Fork & Enable GitHub Pages

```bash
git clone https://github.com/YOUR_USERNAME/rapidwoo.git
```

Go to **Settings → Pages → Source: GitHub Actions**

### 2. Create GitHub Token

1. GitHub **Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. Select your repo, grant **Contents: Read and write**
3. Copy the token

### 3. Set Up Cloudinary (Free)

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Create unsigned upload preset named `rapidwoo_unsigned`
3. Note your Cloud name

### 4. Set Up Snipcart (Free for Test Mode)

1. Sign up at [snipcart.com](https://snipcart.com)
2. Get your **public API key** from Dashboard
3. Add to `index.html`, `shop.html`, `product.html`:
```html
<script src="https://cdn.snipcart.com/themes/v3.x.x/default/snipcart.js"></script>
<div id="snipcart" data-api-key="YOUR_PUBLIC_KEY" hidden></div>
```

### 5. Configure Editor

1. Open `https://YOUR_SITE/demo/`
2. Click **⚙️ Settings**
3. Enter GitHub token, repo info, Cloudinary credentials
4. **Save & Test Connection**

---

## ⚠️ GitHub Pages Deployment Note

If deploying as a **project site** (e.g., `username.github.io/rapidwoo/`), all fetch calls must use relative paths:

```javascript
// ✅ Correct (works in subdirectory)
fetch('./data/products.json')

// ❌ Wrong (404 on project sites)  
fetch('/data/products.json')
```

The live demo at `rapidwoo.com` uses a custom domain (root path), so this doesn't apply there.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         BROWSER                               │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────────────┐ │
│  │   Editor    │  │    Shop     │  │   Snipcart Checkout   │ │
│  │   /demo/    │  │  /shop.html │  │   (hosted by Snipcart)│ │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬───────────┘ │
└─────────┼────────────────┼─────────────────────┼─────────────┘
          │                │                     │
          ▼                ▼                     ▼
    ┌───────────┐    ┌───────────┐    ┌─────────────────────┐
    │  GitHub   │    │ Cloudinary│    │ Snipcart Validation │
    │   API     │    │    CDN    │    │ /snipcart-products  │
    │           │    │           │    │      .json          │
    └─────┬─────┘    └───────────┘    └─────────────────────┘
          │
          ▼
    ┌───────────┐
    │  GitHub   │
    │   Pages   │
    │ (hosting) │
    └───────────┘
```

### Storage Strategy

| Layer | Purpose | Persistence |
|-------|---------|-------------|
| localStorage | Draft/cache, instant saves | Browser only |
| GitHub API | Source of truth | Permanent, deployed |
| Snipcart validation | Price verification | Auto-generated on save |

---

## Snipcart Integration

### How Checkout Works

1. User adds product to cart (Snipcart widget)
2. User clicks checkout → Snipcart hosted checkout
3. Snipcart validates prices against `/snipcart-products.json`
4. Test card `4242 4242 4242 4242` + any future date + any CVC
5. Order confirmed → Snipcart dashboard

### Automatic Price Validation

When you save products in the editor, RapidWoo automatically generates `snipcart-products.json`:

```json
[
  {
    "id": "graphic-tshirt-neon-wave",
    "price": 19.99,
    "url": "/snipcart-products.json",
    "customFields": [
      {
        "name": "Size",
        "options": "S|M|L[+3.00]|XL[+5.00]"
      }
    ]
  }
]
```

**This prevents price tampering** — Snipcart rejects any cart where prices don't match the validation file.

### Variable Products

For products with variations (sizes, colors), the editor generates Snipcart-compatible custom fields:

```
Size: S|M|L[+3.00]|XL[+5.00]
```

Price modifiers (`[+3.00]`) are calculated automatically from your variation prices.

---

## File Structure

```
rapidwoo/
├── index.html              # Landing page
├── shop.html               # Product listing
├── product.html            # Single product page
├── snipcart-products.json  # Auto-generated validation (DO NOT EDIT)
│
├── data/
│   ├── products.json       # Product data (synced to GitHub)
│   └── dummy-products.json # Demo products
│
├── demo/
│   ├── index.html          # Product editor UI
│   └── editor.js           # Editor logic
│
└── assets/js/
    ├── storage.js          # GitHub API + Snipcart validation generation
    ├── imageHandler.js     # Cloudinary uploads
    ├── config.js           # Default settings
    ├── utils.js            # Helpers (toast, modal)
    └── cart.js             # Cart functionality
```

---

## Security Notes

### ⚠️ GitHub Token Risk

This POC stores your GitHub Personal Access Token in browser `localStorage`. This means:

- Any XSS vulnerability can steal it
- Browser extensions can access it
- Shared computers are a risk

**Mitigations for production:**
- Use a dedicated bot account with minimal permissions
- Implement a serverless proxy (Cloudflare Worker) for token storage
- Use GitHub OAuth App instead of PAT

### ⚠️ HTML in Descriptions

Product descriptions are rendered as HTML. If accepting user-generated content, sanitize input:

```javascript
const safe = DOMPurify.sanitize(product.description);
```

### ⚠️ Cloudinary Unsigned Uploads

Unsigned presets allow anyone with the preset name to upload. Restrict in Cloudinary settings:
- Allowed formats: `jpg, png, webp, gif`
- Max file size: 10MB
- Folder restriction: `rapidwoo/`

### ⚠️ Single Editor Assumption

No conflict resolution exists. If two people edit simultaneously, last save wins. For teams, consider:
- Designating a single editor
- Implementing optimistic locking
- Using a proper CMS

---

## Save Flow

```
Edit Product → localStorage (instant)
      │
      ▼
Click "Save" → GitHub API
      │
      ├──→ Update data/products.json
      │
      └──→ Auto-generate snipcart-products.json
                    │
                    ▼
            GitHub Actions deploys (~60 seconds)
                    │
                    ▼
            Live site updated + Snipcart validation synced
```

---

## Testing Checkout

1. Add products to cart
2. Click cart → Checkout
3. Use test card: `4242 4242 4242 4242`
4. Expiry: Any future date
5. CVC: Any 3 digits
6. Complete order
7. Check Snipcart dashboard for order

---

## Troubleshooting

### "GitHub not configured"
→ Go to Settings, enter token and repo info

### Images not uploading
→ Check Cloudinary credentials in Settings
→ Ensure upload preset is **Unsigned**

### Changes not appearing
→ Wait ~60 seconds for GitHub Actions
→ Hard refresh (`Ctrl+Shift+R`)

### Snipcart price mismatch error
→ Save products again to regenerate validation file
→ Wait for deployment, then retry checkout

### Debug in Console

```javascript
// Check configuration
RapidWoo.Storage.isGitHubConfigured()
RapidWoo.Storage.isCloudinaryConfigured()

// View products
console.log(App.products)

// Force save
await window.saveToGitHubManual()
```

---

## Who Is This For?

- **Developers** exploring JAMstack e-commerce patterns
- **Small catalog owners** who want a simple, free solution
- **Prototypers** testing product ideas before investing in full platforms
- **Learners** studying static site + API integration

---

## Roadmap (Potential)

- [ ] GitHub OAuth instead of PAT
- [ ] Conflict detection/merge UI
- [ ] Schema validation before save
- [ ] Image alt text and metadata
- [ ] Inventory sync with Snipcart
- [ ] Order webhooks → serverless endpoint (Cloudflare Worker) → GitHub Issues

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

**Status:** Proof of Concept  
**Production-ready:** No  
**But it works:** Yes ✔
