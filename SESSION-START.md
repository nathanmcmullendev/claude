# RapidWoo Session Start Guide

**For Claude Project Context**

---

## Quick Context

You're working on **RapidWoo**, a serverless e-commerce platform.

- **Live Site:** https://rapidwoo.com
- **Repository:** github.com/nathanmcmullendev/claude
- **Current Version:** v3.1
- **GitHub Token:** `[YOUR_GITHUB_PAT_HERE]`
- **Cloudinary:** Cloud name `dh4qwuvuo`

---

## How to Start a Session

### Option 1: Continue Roadmap (Recommended)

```
"Let's continue with RapidWoo. Check ROADMAP.md for the next version 
and implement it following our iterated approach."
```

### Option 2: Specific Task

```
"Let's work on RapidWoo. I need [specific feature/fix]. 
Check VERSION.md for current state first."
```

### Option 3: Bug Fix

```
"There's a bug in RapidWoo: [describe issue]. 
Check the relevant files and fix it with targeted changes."
```

---

## Before Making Changes

Always follow this workflow:

```
1. STATE the goal clearly
2. IDENTIFY all affected files
3. VIEW current code (use curl to fetch from GitHub)
4. PLAN targeted edits
5. MAKE changes one at a time
6. TEST syntax (node --check for JS)
7. PUSH to GitHub
8. VERIFY deployment (wait 30-40s)
```

---

## Key Commands

### Fetch Current File
```bash
curl -s "https://raw.githubusercontent.com/nathanmcmullendev/claude/main/[PATH]"
```

### Push File to GitHub
```bash
SHA=$(curl -s -H "Authorization: Bearer [TOKEN]" \
  "https://api.github.com/repos/nathanmcmullendev/claude/contents/[PATH]" \
  | grep '"sha"' | head -1 | cut -d'"' -f4)

CONTENT=$(base64 -w 0 /tmp/[FILE])

curl -s -X PUT \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/nathanmcmullendev/claude/contents/[PATH]" \
  -d '{"message":"[COMMIT MSG]","content":"'$CONTENT'","sha":"'$SHA'","branch":"main"}'
```

### Verify Deployment
```bash
sleep 40
curl -s "https://rapidwoo.com/[PATH]" | grep "[EXPECTED]"
```

---

## File Reference

| File | Purpose |
|------|---------|
| `demo/editor.js` | Main editor logic (~2300 lines) |
| `demo/index.html` | Editor HTML interface |
| `shop.html` | Product catalog page |
| `product.html` | Single product page |
| `data/products.json` | Live product data |
| `data/dummy-products.json` | Demo/fallback data |
| `assets/js/storage.js` | GitHub API operations |
| `assets/js/config.js` | Global configuration |
| `snipcart-products.json` | Price validation for checkout |

---

## Common Pitfalls to Avoid

| Issue | Prevention |
|-------|------------|
| Duplicate variable declarations | Use unique names in each scope |
| UTF-8 encoding corruption | Type directly, don't copy special chars |
| Pushing without syntax check | Always `node --check` before push |
| Making too many changes at once | One feature per commit |
| Not waiting for deployment | Wait 30-40s after push |

---

## Next Version: v3.2

**Goal:** Editor UX Polish

**Tasks:**
1. Add loading spinner during GitHub save
2. Add success/error toast notifications
3. Confirm before delete (single + bulk)
4. Auto-save to localStorage on changes
5. "Unsaved changes" warning before leaving

**Files to modify:** `demo/editor.js`, `assets/css/editor.css`

---

## Rollback Commands

If something breaks:

```bash
# Get clean v3.1
curl -s "https://raw.githubusercontent.com/nathanmcmullendev/claude/v3.1/[FILE]" > /tmp/clean.js

# Push it back
# (use standard push commands above)
```

---

## Session End Checklist

Before ending a session:

- [ ] All changes pushed to GitHub
- [ ] Deployment verified working
- [ ] VERSION.md updated if needed
- [ ] ROADMAP.md updated if version completed
- [ ] New version tagged if milestone reached

---

*This file provides context for starting new Claude sessions on RapidWoo.*
