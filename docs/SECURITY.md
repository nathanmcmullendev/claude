# RapidWoo Security Documentation

**Version:** 4.0  
**Last Updated:** December 2024

---

## ⚠️ Important Security Notice

RapidWoo is a **proof-of-concept** demonstrating serverless e-commerce architecture. It is NOT designed for production use with real customer data.

### Current Security Model

This system stores credentials in the browser's localStorage. This means:

1. **Anyone with access to your browser** can view your GitHub token and Cloudinary credentials
2. **Browser extensions** may be able to read localStorage
3. **XSS vulnerabilities** could expose credentials

### Acceptable Use Cases

✅ Personal portfolio/demo site  
✅ Learning serverless architecture  
✅ Prototyping e-commerce flows  
✅ Internal tools with trusted users

### NOT Acceptable For

❌ Real customer payment data  
❌ Multi-user production systems  
❌ Sites handling sensitive PII  
❌ High-value inventory management

---

## Credential Storage

### GitHub Token

- **Storage:** localStorage (`rapidwoo-config`)
- **Scope:** Contents (read/write), Workflows, Actions, Metadata
- **Risk:** Token theft allows repository modification
- **Mitigation:** Use fine-grained token with minimal permissions

### Cloudinary

- **Storage:** localStorage (`rapidwoo-config`)
- **Type:** Unsigned upload preset
- **Risk:** Anyone with preset name can upload files
- **Mitigation:** Configure preset restrictions in Cloudinary dashboard

---

## Data Validation (V4+)

### On Save

Before saving to GitHub, all products are validated:

- Required fields: `id`, `title`, `slug`, `sku`
- Price must be non-negative number
- URLs must be valid format
- No script injection in text fields

### On Load

When loading products, data is sanitized:

- HTML tags stripped from descriptions (except safe tags)
- Script tags removed entirely
- Titles are HTML-escaped
- URLs validated against allowlist

---

## Content Security Policy

All pages include CSP meta tags restricting:

- **Scripts:** Self, Snipcart CDN only
- **Styles:** Self, Snipcart CDN only  
- **Images:** Self, Cloudinary, Snipcart
- **Connections:** GitHub API, Cloudinary API, Snipcart

---

## Cloudinary Configuration

### Current Setup

- Unsigned upload preset: `rapidwoo_unsigned`
- Folder: `rapidwoo/products`
- No format restrictions by default

### Risk

Anyone who discovers the preset name can upload files to your Cloudinary account.

### Recommended Cloudinary Settings

In Cloudinary Dashboard → Settings → Upload → Upload Presets → `rapidwoo_unsigned`:

| Setting | Recommended Value |
|---------|-------------------|
| Folder | `rapidwoo/products` (locked) |
| Allowed formats | `jpg, png, webp, gif` |
| Max file size | `10000000` (10MB) |
| Unique filename | `true` |
| Overwrite | `false` |
| Invalidate | `false` |

### For Production (V6+)

Switch to signed uploads with server-side signature generation.

---

## Recommendations for Production

If adapting this code for production:

1. **Move credentials server-side** - Use environment variables, not localStorage
2. **Add authentication** - Require login before editor access
3. **Use signed uploads** - Generate Cloudinary signatures server-side
4. **Implement rate limiting** - Prevent abuse of save endpoints
5. **Add audit logging** - Track who changed what and when
6. **Regular token rotation** - Change GitHub tokens periodically

---

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do not** open a public GitHub issue
2. Contact the repository owner directly
3. Allow reasonable time for fixes before disclosure

---

## Version History

| Version | Changes |
|---------|---------|
| V4 | Initial security documentation, input validation, CSP headers |
| V3 | POC release (no formal security measures) |
