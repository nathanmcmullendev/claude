// ============================================
// RAPIDWOO STORAGE - SERVERLESS EDITION
// GitHub API for persistence, localStorage for cache
// No PHP required
// ============================================

window.RapidWoo = window.RapidWoo || {};

window.RapidWoo.Storage = {

  // ============================================
  // CONFIGURATION
  // ============================================
  
  _config: {
    // GitHub settings (stored in localStorage after first setup)
    github: {
      token: null,
      owner: null,
      repo: null,
      branch: 'main',
      productPath: 'data/products.json'
    },
    // Cloudinary settings
    cloudinary: {
      cloudName: null,
      uploadPreset: null
    }
  },

  // Storage keys
  KEYS: {
    CONFIG: 'rapidwoo-config',
    PRODUCTS_CACHE: 'rapidwoo-products-cache',
    PRODUCTS_DIRTY: 'rapidwoo-products-dirty'
  },

  // ============================================
  // SECURITY: Input Validation & Sanitization (V4)
  // ============================================
  // WARNING: This is a POC system. Credentials are stored in localStorage.
  // Do NOT use for production with real customer data.
  // See docs/SECURITY.md for details.
  // ============================================

  /**
   * Validate products before saving to GitHub
   * Returns { valid: boolean, errors: string[] }
   */
  _validateProductsBeforeSave(products) {
    const errors = [];
    
    if (!Array.isArray(products)) {
      return { valid: false, errors: ['Products must be an array'] };
    }
    
    products.forEach((product, index) => {
      // Required fields
      if (!product.id) errors.push(`Product ${index}: missing id`);
      if (!product.title) errors.push(`Product ${index}: missing title`);
      if (!product.slug) errors.push(`Product ${index}: missing slug`);
      if (!product.sku) errors.push(`Product ${index}: missing sku`);
      
      // Price validation
      const price = parseFloat(product.price);
      if (isNaN(price) || price < 0) {
        errors.push(`Product ${index}: invalid price "${product.price}"`);
      }
      
      // Check for script injection in text fields
      const textFields = ['title', 'description', 'short_description'];
      textFields.forEach(field => {
        if (product[field] && /<script/i.test(product[field])) {
          errors.push(`Product ${index}: script tag detected in ${field}`);
        }
      });
      
      // URL validation for images
      if (product.image && !this._isValidUrl(product.image)) {
        errors.push(`Product ${index}: invalid image URL`);
      }
    });
    
    return { valid: errors.length === 0, errors };
  },

  /**
   * Sanitize products when loading from GitHub
   * Removes potentially dangerous content
   */
  _sanitizeProducts(data) {
    if (!data || !Array.isArray(data.products)) {
      return data;
    }
    
    data.products = data.products.map(product => {
      // Sanitize text fields
      if (product.title) {
        product.title = this._escapeHtml(product.title);
      }
      
      if (product.description) {
        product.description = this._sanitizeHtml(product.description);
      }
      
      if (product.short_description) {
        product.short_description = this._sanitizeHtml(product.short_description);
      }
      
      return product;
    });
    
    return data;
  },

  /**
   * Escape HTML entities (for titles, plain text)
   */
  _escapeHtml(str) {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * Sanitize HTML (allow basic formatting, remove scripts)
   */
  _sanitizeHtml(str) {
    if (typeof str !== 'string') return str;
    
    // Remove script tags and their contents
    let clean = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove on* event handlers
    clean = clean.replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '');
    clean = clean.replace(/\bon\w+\s*=\s*[^\s>]*/gi, '');
    
    // Remove javascript: URLs
    clean = clean.replace(/javascript:/gi, '');
    
    // Log if we sanitized anything
    if (clean !== str) {
      console.warn('⚠️ Sanitized potentially dangerous content from product');
    }
    
    return clean;
  },

  /**
   * Validate URL format
   */
  _isValidUrl(str) {
    if (!str || typeof str !== 'string') return false;
    
    // Allow Cloudinary URLs and common image hosts
    const allowedPatterns = [
      /^https:\/\/res\.cloudinary\.com\//,
      /^https:\/\/images\.unsplash\.com\//,
      /^https:\/\/via\.placeholder\.com\//,
      /^\/images\//,  // Relative paths
      /^data:image\//  // Data URLs (base64)
    ];
    
    return allowedPatterns.some(pattern => pattern.test(str));
  },

  // ============================================
  // INITIALIZATION
  // ============================================

  init() {
    this._loadConfig();
    console.log('✅ RapidWoo Storage initialized (Serverless Mode)');
    return this;
  },

  _loadConfig() {
    try {
      const saved = localStorage.getItem(this.KEYS.CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        this._config = { ...this._config, ...parsed };
      }
    } catch (e) {
      console.warn('Could not load config:', e);
    }
  },

  _saveConfig() {
    try {
      localStorage.setItem(this.KEYS.CONFIG, JSON.stringify(this._config));
    } catch (e) {
      console.error('Could not save config:', e);
    }
  },

  // ============================================
  // CONFIGURATION METHODS
  // ============================================

  /**
   * Configure GitHub connection
   * @param {Object} options - { token, owner, repo, branch? }
   */
  configureGitHub(options) {
    if (!options.token) throw new Error('GitHub token required');
    if (!options.owner) throw new Error('GitHub owner/username required');
    if (!options.repo) throw new Error('GitHub repo name required');

    this._config.github = {
      ...this._config.github,
      token: options.token,
      owner: options.owner,
      repo: options.repo,
      branch: options.branch || 'main'
    };
    this._saveConfig();
    console.log('✅ GitHub configured:', options.owner + '/' + options.repo);
    return true;
  },

  /**
   * Configure Cloudinary connection
   * @param {Object} options - { cloudName, uploadPreset }
   */
  configureCloudinary(options) {
    if (!options.cloudName) throw new Error('Cloudinary cloud name required');
    if (!options.uploadPreset) throw new Error('Cloudinary upload preset required');

    this._config.cloudinary = {
      cloudName: options.cloudName,
      uploadPreset: options.uploadPreset
    };
    this._saveConfig();
    console.log('✅ Cloudinary configured:', options.cloudName);
    return true;
  },

  /**
   * Check if GitHub is configured
   */
  isGitHubConfigured() {
    const gh = this._config.github;
    return !!(gh.token && gh.owner && gh.repo);
  },

  /**
   * Get GitHub config for save operations
   */
  getGitHubConfig() {
    return this._config.github;
  },

  /**
   * Check if Cloudinary is configured
   */
  isCloudinaryConfigured() {
    const cl = this._config.cloudinary;
    return !!(cl.cloudName && cl.uploadPreset);
  },

  /**
   * Get current configuration (tokens masked)
   */
  getConfig() {
    return {
      github: {
        configured: this.isGitHubConfigured(),
        owner: this._config.github.owner,
        repo: this._config.github.repo,
        branch: this._config.github.branch
      },
      cloudinary: {
        configured: this.isCloudinaryConfigured(),
        cloudName: this._config.cloudinary.cloudName
      }
    };
  },

  // ============================================
  // PRODUCT OPERATIONS
  // ============================================

  /**
   * Get products - tries cache first, then GitHub
   */
  async getProducts() {
    // Try cache first
    const cached = this._getCache();
    if (cached && cached.products) {
      console.log('📦 Loaded from cache:', cached.products.length, 'products');
      return this._sanitizeProducts(cached);
    }

    // Try GitHub
    if (this.isGitHubConfigured()) {
      try {
        const data = await this._fetchFromGitHub();
        this._setCache(data);
        console.log('📦 Loaded from GitHub:', data.products.length, 'products');
        return this._sanitizeProducts(data);
      } catch (e) {
        console.warn('GitHub fetch failed:', e.message);
      }
    }

    // Try fetching products.json directly (works on deployed site)
    try {
      const response = await fetch('/data/products.json', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        this._setCache(data);
        console.log('📦 Loaded from file:', data.products.length, 'products');
        return this._sanitizeProducts(data);
      }
    } catch (e) {
      console.warn('Direct fetch failed:', e.message);
    }

    // Return empty
    console.log('📦 No products found, returning empty');
    return { products: [] };
  },

  /**
   * Save products locally (marks as dirty)
   */
  saveProducts(data) {
    this._setCache(data);
    this._markDirty(true);
    console.log('💾 Saved to cache:', data.products.length, 'products (not yet pushed to GitHub)');
    return true;
  },

  // SHA cache to prevent mismatch on rapid saves
  // GitHub's CDN may return stale SHA, so we cache the last known good SHA
  _lastKnownSha: {
    products: null,
    snipcart: null
  },

  /**
   * Push products to GitHub (the real save)
   * Also generates and saves snipcart-products.json for checkout validation
   */
  async saveToGitHub(data, commitMessage = null) {
    if (!this.isGitHubConfigured()) {
      return { 
        success: false, 
        error: 'GitHub not configured. Go to Settings to connect your repository.' 
      };
    }

    const products = data.products || data;
    if (!Array.isArray(products)) {
      return { success: false, error: 'Invalid data: products array required' };
    }


    // V4: Validate before saving
    const validation = this._validateProductsBeforeSave(products);
    if (!validation.valid) {
      console.error('❌ Validation failed:', validation.errors);
      return { 
        success: false, 
        error: 'Validation failed: ' + validation.errors.join(', ') 
      };
    }
    try {
      const gh = this._config.github;
      const content = JSON.stringify({ schema_version: 1, products }, null, 2);
      const message = commitMessage || `Update products (${products.length} items) via RapidWoo`;

      // Use cached SHA if available (prevents CDN stale SHA issue)
      // Otherwise fetch from GitHub API
      let sha = this._lastKnownSha.products;
      if (!sha) {
        const currentFile = await this._getGitHubFile(gh.productPath);
        sha = currentFile?.sha || null;
      }

      // Create/update products.json
      const response = await fetch(
        `https://api.github.com/repos/${gh.owner}/${gh.repo}/contents/${gh.productPath}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${gh.token}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message,
            content: btoa(unescape(encodeURIComponent(content))),
            branch: gh.branch,
            ...(sha && { sha })
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // If SHA mismatch, clear cache and retry once
        if (result.message && result.message.includes('does not match')) {
          console.warn('⚠️ SHA mismatch detected, fetching fresh SHA and retrying...');
          this._lastKnownSha.products = null;
          const freshFile = await this._getGitHubFile(gh.productPath);
          const freshSha = freshFile?.sha || null;
          
          // Retry with fresh SHA
          const retryResponse = await fetch(
            `https://api.github.com/repos/${gh.owner}/${gh.repo}/contents/${gh.productPath}`,
            {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${gh.token}`,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                message,
                content: btoa(unescape(encodeURIComponent(content))),
                branch: gh.branch,
                ...(freshSha && { sha: freshSha })
              })
            }
          );
          
          const retryResult = await retryResponse.json();
          
          if (!retryResponse.ok) {
            throw new Error(retryResult.message || `HTTP ${retryResponse.status}`);
          }
          
          // Cache the new SHA from retry
          this._lastKnownSha.products = retryResult.content?.sha || null;
          console.log('✅ Retry succeeded, new SHA cached:', this._lastKnownSha.products?.substring(0, 7));
          
          // Continue with snipcart validation
          await this._saveSnipcartValidation(products);
          this._setCache({ products });
          this._markDirty(false);
          
          return {
            success: true,
            commit: retryResult.commit?.sha?.substring(0, 7),
            productCount: products.length,
            url: retryResult.content?.html_url,
            retried: true
          };
        }
        
        throw new Error(result.message || `HTTP ${response.status}`);
      }

      // Cache the new SHA for next save (prevents CDN stale SHA issue)
      this._lastKnownSha.products = result.content?.sha || null;
      console.log('📌 SHA cached for products.json:', this._lastKnownSha.products?.substring(0, 7));

      // Also update Snipcart validation file
      await this._saveSnipcartValidation(products);

      // Update cache and clear dirty flag
      this._setCache({ products });
      this._markDirty(false);

      console.log('✅ Pushed to GitHub:', result.commit?.sha?.substring(0, 7));

      return {
        success: true,
        commit: result.commit?.sha?.substring(0, 7),
        productCount: products.length,
        url: result.content?.html_url
      };

    } catch (error) {
      console.error('❌ GitHub push failed:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Generate and save Snipcart validation JSON
   * This file is used by Snipcart to validate prices at checkout
   * Prevents price tampering in the cart
   */
  async _saveSnipcartValidation(products) {
    const gh = this._config.github;
    const validationPath = 'snipcart-products.json';
    
    try {
      // Generate Snipcart validation array
      const snipcartProducts = this._generateSnipcartValidation(products);
      const content = JSON.stringify(snipcartProducts, null, 2);
      
      // Use cached SHA if available, otherwise fetch
      let sha = this._lastKnownSha.snipcart;
      if (!sha) {
        const currentFile = await this._getGitHubFile(validationPath);
        sha = currentFile?.sha || null;
      }
      
      // Upload validation file
      const response = await fetch(
        `https://api.github.com/repos/${gh.owner}/${gh.repo}/contents/${validationPath}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${gh.token}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `Update Snipcart validation (${snipcartProducts.length} products)`,
            content: btoa(unescape(encodeURIComponent(content))),
            branch: gh.branch,
            ...(sha && { sha })
          })
        }
      );
      
      const result = await response.json();
      
      if (response.ok) {
        // Cache the new SHA
        this._lastKnownSha.snipcart = result.content?.sha || null;
        console.log('✅ Snipcart validation updated:', snipcartProducts.length, 'products');
      } else {
        // If SHA mismatch, retry with fresh SHA
        if (result.message && result.message.includes('does not match')) {
          console.warn('⚠️ Snipcart SHA mismatch, retrying...');
          this._lastKnownSha.snipcart = null;
          const freshFile = await this._getGitHubFile(validationPath);
          const freshSha = freshFile?.sha || null;
          
          const retryResponse = await fetch(
            `https://api.github.com/repos/${gh.owner}/${gh.repo}/contents/${validationPath}`,
            {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${gh.token}`,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                message: `Update Snipcart validation (${snipcartProducts.length} products)`,
                content: btoa(unescape(encodeURIComponent(content))),
                branch: gh.branch,
                ...(freshSha && { sha: freshSha })
              })
            }
          );
          
          if (retryResponse.ok) {
            const retryResult = await retryResponse.json();
            this._lastKnownSha.snipcart = retryResult.content?.sha || null;
            console.log('✅ Snipcart validation retry succeeded');
          } else {
            console.warn('⚠️ Snipcart validation retry failed');
          }
        } else {
          console.warn('⚠️ Snipcart validation update failed:', result.message);
        }
      }
    } catch (error) {
      console.warn('⚠️ Could not update Snipcart validation:', error.message);
      // Don't fail the main save - validation is secondary
    }
  },

  /**
   * Generate Snipcart-compatible validation array from products
   * Format: [{ id, price, url, customFields? }]
   */
  _generateSnipcartValidation(products) {
    const validationUrl = '/snipcart-products.json';
    const result = [];
    
    products.forEach(product => {
      if (product.hidden) return; // Skip hidden products
      
      // Get the active price (sale price takes priority)
      const price = parseFloat(product.sale_price) || 
                    parseFloat(product.price) || 
                    parseFloat(product.regular_price) || 0;
      
      // Base validation entry using slug as ID
      const entry = {
        id: product.slug || String(product.id),
        price: Math.round(price * 100) / 100, // Ensure 2 decimal places
        url: validationUrl
      };
      
      // Add custom fields for variable products
      if (product.type === 'variable' && product.variations?.length > 0) {
        const customFields = this._buildSnipcartCustomFields(product);
        if (customFields.length > 0) {
          entry.customFields = customFields;
        }
      }
      
      result.push(entry);
      
      // Also add entry with numeric ID for compatibility
      if (product.id && String(product.id) !== entry.id) {
        result.push({
          ...entry,
          id: String(product.id)
        });
      }
    });
    
    return result;
  },

  /**
   * Build Snipcart customFields from product variations
   * Format: [{ name: "Size", options: "S|M|L[+3.00]|XL[+5.00]" }]
   */
  _buildSnipcartCustomFields(product) {
    const customFields = [];
    const variations = product.variations || [];
    const attributes = product.attributes || {};
    
    // Get base price for calculating deltas
    const basePrice = parseFloat(product.sale_price) || 
                      parseFloat(product.price) || 
                      parseFloat(product.regular_price) || 0;
    
    // Group variations by attribute name
    Object.keys(attributes).forEach(attrName => {
      const attrValues = attributes[attrName];
      if (!Array.isArray(attrValues) || attrValues.length === 0) return;
      
      // Build options string with price modifiers
      const options = attrValues.map(value => {
        // Find variation for this attribute value
        const variation = variations.find(v => 
          v.attributes && v.attributes[attrName] === value
        );
        
        let optionStr = value;
        
        if (variation) {
          // Calculate price difference from base
          const varPrice = parseFloat(variation.sale_price) || 
                          parseFloat(variation.price) || 
                          parseFloat(variation.regular_price);
          
          // Check for price_delta field (e.g., "+3.00" or "-2.00")
          if (variation.price_delta) {
            const delta = variation.price_delta.toString().trim();
            if (delta && delta !== '+0.00' && delta !== '0.00' && delta !== '0') {
              // Ensure proper format [+X.XX] or [-X.XX]
              const numDelta = parseFloat(delta.replace('+', ''));
              if (numDelta !== 0) {
                optionStr += `[${numDelta >= 0 ? '+' : ''}${numDelta.toFixed(2)}]`;
              }
            }
          } else if (varPrice && varPrice !== basePrice) {
            // Calculate delta from prices
            const delta = varPrice - basePrice;
            if (delta !== 0) {
              optionStr += `[${delta >= 0 ? '+' : ''}${delta.toFixed(2)}]`;
            }
          }
        }
        
        return optionStr;
      }).join('|');
      
      customFields.push({
        name: attrName,
        options: options
      });
    });
    
    return customFields;
  },

  /**
   * Check if there are unsaved changes
   */
  isDirty() {
    return localStorage.getItem(this.KEYS.PRODUCTS_DIRTY) === 'true';
  },

  // ============================================
  // GITHUB API HELPERS
  // ============================================

  async _fetchFromGitHub() {
    const gh = this._config.github;
    const file = await this._getGitHubFile(gh.productPath);
    
    if (!file || !file.content) {
      throw new Error('File not found on GitHub');
    }

    // Decode base64 content
    const decoded = decodeURIComponent(escape(atob(file.content)));
    return JSON.parse(decoded);
  },

  async _getGitHubFile(path) {
    const gh = this._config.github;
    
    try {
      const response = await fetch(
        `https://api.github.com/repos/${gh.owner}/${gh.repo}/contents/${path}?ref=${gh.branch}`,
        {
          headers: {
            'Authorization': `Bearer ${gh.token}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
          }
        }
      );

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (e) {
      console.error('GitHub file fetch error:', e);
      return null;
    }
  },

  // ============================================
  // CACHE HELPERS
  // ============================================

  _getCache() {
    try {
      const cached = localStorage.getItem(this.KEYS.PRODUCTS_CACHE);
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  },

  _setCache(data) {
    try {
      localStorage.setItem(this.KEYS.PRODUCTS_CACHE, JSON.stringify(data));
    } catch (e) {
      console.error('Cache write failed:', e);
    }
  },

  _markDirty(dirty) {
    localStorage.setItem(this.KEYS.PRODUCTS_DIRTY, dirty ? 'true' : 'false');
  },

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Export products as JSON file download
   */
  exportJSON(data, filename = 'products.json') {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      return true;
    } catch (e) {
      console.error('Export failed:', e);
      return false;
    }
  },

  /**
   * Import products from JSON file
   */
  async importJSON(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!data.products || !Array.isArray(data.products)) {
        throw new Error('Invalid JSON: missing products array');
      }
      
      this.saveProducts(data);
      return data;
    } catch (e) {
      console.error('Import failed:', e);
      throw e;
    }
  },

  /**
   * Clear all local data
   */
  clearAll() {
    Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
    console.log('🗑️ Cleared all local data');
  },

  /**
   * Check connection to GitHub
   */
  async testGitHubConnection() {
    if (!this.isGitHubConfigured()) {
      return { success: false, error: 'GitHub not configured' };
    }

    try {
      const gh = this._config.github;
      const response = await fetch(
        `https://api.github.com/repos/${gh.owner}/${gh.repo}`,
        {
          headers: {
            'Authorization': `Bearer ${gh.token}`,
            'Accept': 'application/vnd.github+json'
          }
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || `HTTP ${response.status}`);
      }

      const repo = await response.json();
      return { 
        success: true, 
        repo: repo.full_name,
        private: repo.private,
        permissions: repo.permissions
      };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

}.init();

console.log('✅ RapidWoo Storage loaded (Serverless Mode)');
