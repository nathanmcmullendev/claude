# RapidWoo Development Roadmap

**Created:** December 15, 2025  
**Current Version:** v3.2  
**Repository:** [github.com/nathanmcmullendev/claude](https://github.com/nathanmcmullendev/claude)

---

## Roadmap Philosophy

> **"Small, focused changes. Test before merge. One feature at a time."**

Every version increment follows these principles:
1. **State the goal clearly** before writing code
2. **Identify all affected files** before making changes
3. **Make targeted edits** — no umbrella fixes
4. **Test thoroughly** before pushing
5. **Tag stable versions** for easy rollback

---

## Current State (v3.1)

### ✅ What Works
- Product editor with full CRUD operations
- Simple and Variable product support
- Price range display for variable products
- Snipcart checkout integration
- Cloudinary image uploads
- GitHub API data persistence
- Responsive shop and product pages

### ⚠️ Known Limitations
- No server-side authentication (PAT in localStorage)
- No multi-user conflict resolution
- No order management
- Manual schema migrations
- No automated testing

---

# SHORT-TERM ROADMAP (v3.3 – v3.5)

*Target: Next 2-4 weeks*

---

## v3.2 — Editor UX Polish ✅ COMPLETED

**Goal:** Improve editor usability and fix remaining rough edges.

### Changes

| # | Task | File(s) | Status |
|---|------|---------|--------|
| 1 | Add loading spinner during GitHub save | `demo/editor.js` | ✅ Already existed |
| 2 | Add success/error toast notifications | `demo/editor.js`, `editor.css` | ✅ Already existed |
| 3 | Confirm before delete (single + bulk) | `demo/editor.js` | ✅ Already existed |
| 4 | Auto-save to localStorage on changes | `demo/editor.js` | ✅ Already existed |
| 5 | "Unsaved changes" warning before leaving | `demo/editor.js` | ✅ Added |

### Acceptance Criteria
- [x] User sees spinner when saving to GitHub
- [x] Toast shows "Saved successfully" or error message
- [x] Delete requires confirmation click
- [x] Changes persist in localStorage automatically
- [x] Browser warns if leaving with unsaved changes

---

## v3.3 — Image Management Improvements

**Goal:** Make image handling more robust and user-friendly.

### Changes

| # | Task | File(s) | Priority |
|---|------|---------|----------|
| 1 | Image reordering via drag-and-drop | `demo/editor.js` | High |
| 2 | Delete image button (gallery items) | `demo/editor.js` | High |
| 3 | Image upload progress indicator | `imageHandler.js`, `demo/editor.js` | Medium |
| 4 | Lazy loading for gallery images | `demo/editor.js` | Low |
| 5 | Image dimension validation | `imageHandler.js` | Low |

### Acceptance Criteria
- [ ] User can drag to reorder gallery images
- [ ] Each gallery image has a delete (X) button
- [ ] Upload shows progress percentage
- [ ] Gallery images load on scroll (not all at once)

---

## v3.4 — Variation Enhancements

**Goal:** Improve variable product editing experience.

### Changes

| # | Task | File(s) | Priority |
|---|------|---------|----------|
| 1 | Bulk update variation prices | `demo/editor.js` | High |
| 2 | Copy base price to all variations button | `demo/editor.js` | High |
| 3 | Variation image support | `demo/editor.js`, schema | Medium |
| 4 | Multiple attributes (Size + Color) | `demo/editor.js`, schema | Low |
| 5 | Variation table sorting | `demo/editor.js` | Low |

### Acceptance Criteria
- [ ] "Apply to all" button sets same price across variations
- [ ] Bulk edit allows percentage or fixed price changes
- [ ] Each variation can have its own image (optional)

---

## v3.5 — Data Integrity & Validation

**Goal:** Prevent bad data and improve reliability.

### Changes

| # | Task | File(s) | Priority |
|---|------|---------|----------|
| 1 | Required field validation (title, price) | `demo/editor.js` | High |
| 2 | Price format validation (no negative) | `demo/editor.js` | High |
| 3 | Duplicate SKU warning | `demo/editor.js` | Medium |
| 4 | Slug auto-generation from title | `demo/editor.js` | Medium |
| 5 | Data export (download JSON) | `demo/editor.js` | Low |
| 6 | Data import (upload JSON) | `demo/editor.js` | Low |

### Acceptance Criteria
- [ ] Cannot save product without title
- [ ] Price fields reject invalid input
- [ ] Warning shown if SKU already exists
- [ ] Slug auto-generates on title blur (if empty)
- [ ] Export/Import buttons in settings

---

# LONG-TERM ROADMAP (v4.0 – v6.0)

*Target: 2-6 months*

---

## v4.0 — Schema Migration (V2)

**Goal:** Clean up data schema for better maintainability.

### Schema Changes

```
V1 (Current)                    V2 (Target)
─────────────────────────────────────────────────
regular_price: "24.99"    →    regular_price_cents: 2499
sale_price: "19.99"       →    sale_price_cents: 1999
price: "19.99"            →    (removed - computed)

image: "url"              →    images: ["url1", "url2"]
images: ["url"]           →    (merged into images[])
gallery: [{url}]          →    (removed - redundant)
extra_images_enabled      →    (removed)
show_additional_images    →    (removed)
```

### Implementation Steps

| Step | Task | Risk |
|------|------|------|
| 1 | Create migration script (V1 → V2) | Low |
| 2 | Update `storage.js` to handle V2 | Medium |
| 3 | Update all read locations (shop, product, editor) | High |
| 4 | Update all write locations (editor save) | High |
| 5 | Backward compatibility layer (read V1, write V2) | Medium |
| 6 | Remove V1 support after migration | Low |

### Critical Files
- `assets/js/storage.js` — Read/write logic
- `demo/editor.js` — All price displays and inputs
- `shop.html` — Price display
- `product.html` — Price display and variation handling

### Migration Strategy
1. V2 readers support both V1 and V2 data
2. V2 writers always output V2 format
3. Migration script converts existing data
4. After 30 days, remove V1 support

---

## v4.1 — Security Hardening

**Goal:** Move from POC security to production-ready.

### Changes

| # | Task | Approach |
|---|------|----------|
| 1 | Remove PAT from localStorage | Use OAuth flow or backend proxy |
| 2 | Server-side GitHub operations | Netlify/Cloudflare Functions |
| 3 | Rate limiting | Implement at function level |
| 4 | Input sanitization | Server-side validation |
| 5 | CORS configuration | Restrict to known domains |

### Architecture Options

**Option A: Netlify Functions**
```
Browser → Netlify Function → GitHub API
                ↓
         (PAT stored in env vars)
```

**Option B: Cloudflare Workers**
```
Browser → CF Worker → GitHub API
              ↓
        (PAT in Worker secrets)
```

**Option C: GitHub OAuth App**
```
Browser → GitHub OAuth → Access Token
              ↓
        (User's own token, scoped)
```

### Recommendation
Start with **Option A (Netlify Functions)** — simplest migration path, free tier available.

---

## v5.0 — Multi-User Support

**Goal:** Allow multiple editors without conflicts.

### Features

| Feature | Description |
|---------|-------------|
| User identification | Track who made changes |
| Conflict detection | Warn if data changed since load |
| Merge strategy | Last-write-wins or manual merge |
| Activity log | Show recent changes |
| Locking (optional) | Prevent simultaneous edits |

### Implementation Approach

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User A    │     │   Server    │     │   User B    │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │──── Load ────────▶│                   │
       │◀─── Data + SHA ───│                   │
       │                   │                   │
       │                   │◀──── Load ────────│
       │                   │──── Data + SHA ──▶│
       │                   │                   │
       │──── Save (SHA) ──▶│                   │
       │◀─── OK + newSHA ──│                   │
       │                   │                   │
       │                   │◀── Save (oldSHA) ─│
       │                   │─── CONFLICT! ────▶│
       │                   │                   │
```

### Database Consideration
For true multi-user, may need to move from JSON file to:
- Firebase Realtime Database
- Supabase
- PlanetScale

---

## v6.0 — Order Management Integration

**Goal:** View and manage orders from Snipcart.

### Features

| Feature | Description |
|---------|-------------|
| Order list | View recent orders in editor |
| Order details | See items, customer, status |
| Inventory sync | Update stock on order |
| Notifications | Alert on new orders |
| Basic analytics | Sales summary |

### Implementation

Uses Snipcart API:
```
GET /api/orders          — List orders
GET /api/orders/{token}  — Order details
PUT /api/orders/{token}  — Update status
```

### Requirements
- Snipcart secret API key (server-side only)
- Backend function to proxy API calls
- Webhook handler for real-time updates

---

# VERSION TAGGING STRATEGY

## Tag Format
```
v{major}.{minor}.{patch}

major = Breaking changes or major features
minor = New features, backward compatible
patch = Bug fixes only
```

## Examples
```
v3.1.0 → v3.1.1  (bug fix)
v3.1.1 → v3.2.0  (new feature: toast notifications)
v3.5.0 → v4.0.0  (schema migration - breaking)
```

## Tagging Process

```bash
# 1. Ensure all changes pushed
git status

# 2. Create annotated tag
git tag -a v3.2.0 -m "Editor UX Polish - loading spinners, toasts, confirmations"

# 3. Push tag
git push origin v3.2.0
```

## Rollback Process

```bash
# 1. Identify last good version
git tag --list

# 2. Reset to that version
git reset --hard v3.1.0

# 3. Force push (careful!)
git push --force origin main
```

---

# IMPLEMENTATION CHECKLIST

## Before Starting Any Version

- [ ] Read this roadmap section completely
- [ ] Identify ALL files that need changes
- [ ] Create a test plan
- [ ] Ensure current version is tagged

## During Implementation

- [ ] Make ONE change at a time
- [ ] Test after each change
- [ ] Commit with clear messages
- [ ] Check syntax before pushing

## After Implementation

- [ ] Test all affected pages
- [ ] Clear cache and test again
- [ ] Update VERSION.md
- [ ] Create new version tag
- [ ] Update this roadmap (move to "completed")

---

# COMPLETED VERSIONS

## v3.0 — Stable Baseline ✅
- Core editor functionality
- Simple/Variable products
- Snipcart integration
- Cloudinary uploads

## v3.1 — Price Range Display ✅
- Price range for variable products ($19.99 – $29.99)
- Disabled base price for variables (with warning)
- Removed inline price editing
- Fixed UTF-8 encoding issues

## v3.2 — Editor UX Polish ✅
- Unsaved changes warning (beforeunload)
- Confirmed existing: loading spinner, toasts, delete confirmations, auto-save

---

# DECISION LOG

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-12-15 | Rolled back v4.0 | Emoji encoding corruption throughout codebase |
| 2025-12-15 | Keep schema V1 for now | V2 migration too risky without proper testing |
| 2025-12-15 | Price range before schema | User-facing improvement, lower risk |
| 2025-12-15 | No inline price editing | Prevents accidental changes to critical data |

---

# CONTRIBUTING

## For Future Development Sessions

1. **Start here** — Read current version section
2. **Check VERSION.md** — Understand current state
3. **One version at a time** — Don't skip ahead
4. **Test locally first** — Before pushing to GitHub
5. **Tag after completion** — Never leave untagged

## Questions to Ask Before Coding

1. What exactly are we changing?
2. Which files are affected?
3. What could break?
4. How will we test it?
5. Can we roll back easily?

---

*Last updated: December 15, 2025*
