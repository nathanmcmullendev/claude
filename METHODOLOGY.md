# RapidWoo Development Methodology

**The Precision Approach to Code Changes**

---

## The Problem We Solved

Early attempts at implementing features failed due to:
- Making multiple changes across files simultaneously
- Umbrella statements like "fix prices everywhere"
- Not identifying specific code snippets before editing
- Duplicate variable declarations breaking entire pages
- No syntax verification before pushing

**Result:** Broken pages, rollbacks, wasted effort.

---

## The Solution: Precision Development

### 5-Step Process

```
┌─────────────────────────────────────────────────────────────────┐
│  1. STATE THE GOAL                                              │
│     "We want to show price ranges for variable products"        │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. IDENTIFY ALL LOCATIONS                                      │
│     • Product Table (demo/editor.js)                            │
│     • Preview Modal (demo/editor.js)                            │
│     • Shop Preview (demo/editor.js)                             │
│     • Shop Catalog (shop.html)                                  │
│     • Product Page (product.html)                               │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. MAP SPECIFIC CODE SNIPPETS                                  │
│     Location 1: Line 1100                                       │
│     Current:  ${product.regular_price || ''}                    │
│     Change:   ${getVariationPriceRange(product)?.formatted...}  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. EXECUTE IN ORDER                                            │
│     Step 1a: Add helper function → syntax check                 │
│     Step 1b: Update table → push → verify                       │
│     Step 1c: Update modal → push → verify                       │
│     Step 1d: Update preview → push → verify                     │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. VERIFY EACH STEP                                            │
│     • node --check before push                                  │
│     • curl to confirm deployed                                  │
│     • Test in browser                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Example: Price Range Implementation

### Step 1: State the Goal

> **"We want to show price ranges for variable products at all appropriate locations"**
>
> Example: T-Shirt with variations $19.99, $22.99, $24.99 displays as **$19.99 – $24.99**

### Step 2: Identify All Locations

| # | Location | File | Description |
|---|----------|------|-------------|
| 1 | Product Table | `demo/editor.js` | Price column in admin table |
| 2 | Preview Modal | `demo/editor.js` | Eye icon popup |
| 3 | Shop Preview | `demo/editor.js` | Bottom preview grid |
| 4 | Shop Catalog | `shop.html` | Product cards on shop page |
| 5 | Product Page | `product.html` | Initial price display |

### Step 3: Map Specific Code Snippets

**Location 1: Product Table**
```javascript
// File: demo/editor.js, Line ~1100
// CURRENT:
<td data-col="price">${product.regular_price || ''}</td>

// CHANGE TO:
<td data-col="price">${(() => {
  const range = getVariationPriceRange(product);
  return range ? range.formatted : '$' + product.regular_price;
})()}</td>
```

**Location 4: Shop Catalog**
```javascript
// File: shop.html, Line ~265
// CURRENT:
<div class="product-price">
  ${hasSale ? `<del>${nf.format(...)}</del>` : ''}
  <span>${nf.format(effectivePrice)}</span>
</div>

// CHANGE TO:
<div class="product-price">
  ${isVariable ? `<span>${priceRange.formatted}</span>` : ...}
</div>
```

### Step 4: Execute in Order

| Step | Action | Verify |
|------|--------|--------|
| 1a | Add `getVariationPriceRange()` helper | `node --check` ✓ |
| 1b | Update product table | Push → curl → verify |
| 1c | Update preview modal | Push → curl → verify |
| 1d | Update shop preview | Push → curl → verify |
| 2 | Update shop.html | Push → curl → verify |
| 3 | Update product.html | Push → curl → verify |

### Step 5: Verify Each Step

```bash
# After each push:
sleep 40
curl -s "https://rapidwoo.com/[file]" | grep "[expected code]"
```

---

## Key Principles

### ✅ DO

| Principle | Example |
|-----------|---------|
| State goal as a single sentence | "Show price ranges for variable products" |
| List ALL affected locations first | Table, Modal, Preview, Shop, Product |
| Show exact code before/after | `${price}` → `${range.formatted}` |
| One change per commit | "Update table price display" |
| Syntax check before push | `node --check file.js` |
| Verify deployment works | `curl` + browser test |

### ❌ DON'T

| Anti-Pattern | Why It Fails |
|--------------|--------------|
| "Fix prices everywhere" | No clear scope, miss locations |
| Change 5 files at once | One error breaks everything |
| Skip syntax check | Broken JS stops page load |
| Assume it deployed | Cache + timing issues |
| Reuse variable names | `const isVariable` declared twice = crash |

---

## Debugging Failures

When something breaks:

### 1. Identify the Error
```bash
# Check if page loads
curl -s "https://rapidwoo.com/shop.html" | head -20

# Look for JS errors (check browser console)
# Or search for syntax issues
grep -n "isVariable" shop.html  # Find duplicates
```

### 2. Isolate the Cause
```bash
# Check what changed
git diff HEAD~1 shop.html
```

### 3. Fix Precisely
```bash
# Don't revert everything - fix the specific issue
sed -i 's/const isVariable/const isVariableType/' shop.html
```

### 4. Verify Fix
```bash
node --check extracted_script.js  # If possible
# Then push and test
```

---

## Template for New Features

Copy this for each new feature:

```markdown
## Feature: [NAME]

**Goal:** [One sentence description]

### Locations to Change

| # | Location | File | Line |
|---|----------|------|------|
| 1 | | | |
| 2 | | | |

### Code Changes

**Location 1:**
```javascript
// CURRENT (line X):
[existing code]

// NEW:
[new code]
```

### Implementation Order

| Step | Task | Verify |
|------|------|--------|
| 1 | | |
| 2 | | |

### Acceptance Criteria

- [ ] [Test case 1]
- [ ] [Test case 2]
```

---

## Why This Works

| Old Approach | New Approach |
|--------------|--------------|
| Vague goals | Specific, measurable goal |
| Unknown scope | All locations mapped upfront |
| Bulk changes | One change at a time |
| Hope it works | Verify each step |
| Debug chaos | Isolate and fix precisely |

**Result:** Fewer errors, faster fixes, reliable deployments.

---

*This methodology was developed during RapidWoo v3.1 implementation after experiencing multiple failed deployments from umbrella-style changes.*
