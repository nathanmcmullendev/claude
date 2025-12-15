# RapidWoo Project Setup Guide

Complete setup documentation for the RapidWoo serverless e-commerce platform.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Credentials & Configuration](#credentials--configuration)
4. [GitHub Setup](#github-setup)
5. [Cloudinary Setup](#cloudinary-setup)
6. [DNS Configuration](#dns-configuration)
7. [File Structure](#file-structure)
8. [Development Workflow](#development-workflow)

---

## Project Overview

**RapidWoo** is a static e-commerce platform with a browser-based product editor. It's designed to work without a traditional backend server by leveraging:

- **GitHub API** - For data persistence (commits products.json directly to repo)
- **Cloudinary** - For image uploads and CDN delivery
- **GitHub Pages** - For hosting
- **Snipcart** - For shopping cart functionality

### Live URLs

| Resource | URL |
|----------|-----|
| Production Site | https://rapidwoo.com |
| GitHub Repository | https://github.com/nathanmcmullendev/claude |
| GitHub Pages | https://nathanmcmullendev.github.io/claude |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SERVERLESS ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Browser (Editor)                                               │
│        │                                                         │
│        ├──────────────► GitHub API ───────► products.json       │
│        │                (commit files)      (data/products.json) │
│        │                                                         │
│        └──────────────► Cloudinary ─────► Image URLs            │
│                         (upload images)    (CDN delivery)        │
│                                                                  │
│   No PHP. No server. 100% static hosting.                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

BEFORE (PHP Required)              AFTER (Serverless)
─────────────────────              ─────────────────────
save-products.php          →       GitHub API (direct commits)
upload-temp.php            →       Cloudinary (free tier)
PHP server required        →       100% static hosting
```

---

## Credentials & Configuration

### GitHub Personal Access Token

```
Token: [STORED SECURELY - See Settings in Editor or contact admin]

Repository: nathanmcmullendev/claude
Branch: main
```

**Token Permissions Required:**

| Permission | Access Level | Purpose |
|------------|--------------|---------|
| Contents | Read & Write | Commit files (products.json, etc.) |
| Workflows | Read & Write | Create/edit GitHub Actions |
| Actions | Read & Write | Trigger workflow runs |
| Metadata | Read | Required by default |

**To create/update token:**
1. Go to: https://github.com/settings/personal-access-tokens/new
2. Select repository: `nathanmcmullendev/claude`
3. Set permissions as listed above
4. Generate and save token securely

---

### Cloudinary Configuration

```
Cloud Name:     dh4qwuvuo
API Key:        753291364978368
API Secret:     [STORED SECURELY]
```

**Creating an Unsigned Upload Preset (Required for browser uploads):**

1. Log into Cloudinary: https://cloudinary.com/console
2. Go to **Settings → Upload**
3. Scroll to **Upload presets**
4. Click **Add upload preset**
5. Configure:
   - **Preset name:** `rapidwoo_unsigned` (or your choice)
   - **Signing mode:** **Unsigned** ⚠️ Important!
   - **Folder:** `rapidwoo` (optional, for organization)
   - **Allowed formats:** `jpg, jpeg, png, gif, webp`
6. Save the preset
7. Enter this preset name in RapidWoo Settings

---

## GitHub Setup

### Repository Structure

```
nathanmcmullendev/claude/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment
├── assets/
│   ├── css/
│   │   ├── main.css           # Global styles
│   │   ├── components.css     # Component styles
│   │   └── editor.css         # Editor-specific styles
│   └── js/
│       ├── cart.js            # Snipcart integration
│       ├── config.js          # Configuration
│       ├── imageHandler.js    # Cloudinary uploads
│       ├── settings.js        # Settings UI modal
│       ├── storage.js         # GitHub API persistence
│       └── utils.js           # Utilities
├── data/
│   └── products.json          # Product data (auto-committed)
├── demo/
│   ├── index.html             # Product editor
│   └── editor.js              # Editor logic
├── docs/
│   ├── PROJECT-SETUP.md       # This file
│   └── QUICK-REFERENCE.md     # Quick reference card
├── CNAME                       # Custom domain (rapidwoo.com)
├── index.html                  # Homepage
├── product.html                # Product detail page
├── shop.html                   # Shop listing page
├── snipcart-products.json     # Snipcart validation
└── README.md                   # Documentation
```

### GitHub Pages Deployment

The repository uses GitHub Actions for automatic deployment. The workflow (`.github/workflows/deploy.yml`) triggers on:

- Push to `main` branch
- Changes to `data/products.json`, `.html`, `.css`, or `.js` files

**To verify deployment:**
1. Go to repository → Settings → Pages
2. Source should be: "GitHub Actions"
3. Check Actions tab for deployment status

---

## DNS Configuration

### For InMotion Hosting (or similar)

To point `rapidwoo.com` to GitHub Pages:

**A Records (Root Domain):**
```
Type: A
Host: @
Points to: 185.199.108.153
TTL: 14400

Type: A
Host: @
Points to: 185.199.109.153
TTL: 14400

Type: A
Host: @
Points to: 185.199.110.153
TTL: 14400

Type: A
Host: @
Points to: 185.199.111.153
TTL: 14400
```

**CNAME Record (www subdomain):**
```
Type: CNAME
Host: www
Points to: nathanmcmullendev.github.io
TTL: 14400
```

**Verification:**
1. DNS changes can take 24-48 hours to propagate
2. Check with: `dig rapidwoo.com` or `nslookup rapidwoo.com`
3. Verify HTTPS is enabled in GitHub Pages settings

---

## File Structure

### Core Files

| File | Purpose |
|------|---------|
| `index.html` | Homepage/landing page |
| `shop.html` | Product listing with filtering |
| `product.html` | Individual product detail page |
| `demo/index.html` | Product editor interface |

### JavaScript Modules

| File | Purpose |
|------|---------|
| `storage.js` | GitHub API integration for saving/loading products |
| `imageHandler.js` | Cloudinary image upload handling |
| `settings.js` | Settings modal UI (GitHub + Cloudinary config) |
| `config.js` | Configuration constants |
| `utils.js` | Utility functions (toast notifications, etc.) |
| `cart.js` | Snipcart shopping cart integration |

### CSS Files

| File | Purpose |
|------|---------|
| `main.css` | Global styles, variables, reset |
| `components.css` | Reusable component styles |
| `editor.css` | Editor-specific styles (extracted from demo/index.html) |

---

## Development Workflow

### First-Time Setup

1. **Clone or access the repository**
2. **Configure Settings in Editor:**
   - Open `/demo/index.html`
   - Click ⚙️ **Settings** button
   - Enter GitHub token, owner, repo
   - Enter Cloudinary cloud name + upload preset
   - Test both connections
   - Save

### Making Changes

1. **Edit products** in the browser editor
2. Click **💾 Save** to commit to GitHub
3. GitHub Actions automatically deploys to GitHub Pages
4. Changes live on `rapidwoo.com` within ~1-2 minutes

### Local Development

For local testing, you need a simple HTTP server:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

Then open `http://localhost:8000/demo/index.html`

---

## Troubleshooting

### "GitHub not configured"
→ Open Settings and enter your GitHub token + repo details

### "Cloudinary not configured"
→ Open Settings and enter your cloud name + unsigned upload preset

### Images not uploading
→ Verify upload preset is set to "Unsigned" in Cloudinary console

### Save button shows error
→ Check GitHub token has "Contents: Read & Write" permission

### Site not updating after save
→ Check GitHub Actions tab for deployment status

---

## Quick Reference

```
GitHub Repo:     nathanmcmullendev/claude
GitHub Branch:   main

Cloudinary Cloud:   dh4qwuvuo
Cloudinary Key:     753291364978368

Domain:          rapidwoo.com
Editor:          /demo/index.html
Shop:            /shop.html
```

---

*Last updated: December 2024*
