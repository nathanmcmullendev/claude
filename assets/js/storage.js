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
      return cached;
    }

    // Try GitHub
    if (this.isGitHubConfigured()) {
      try {
        const data = await this._fetchFromGitHub();
        this._setCache(data);
        console.log('📦 Loaded from GitHub:', data.products.length, 'products');
        return data;
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
        return data;
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

  /**
   * Push products to GitHub (the real save)
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

    try {
      const gh = this._config.github;
      const content = JSON.stringify({ products }, null, 2);
      const message = commitMessage || `Update products (${products.length} items) via RapidWoo`;

      // Get current file SHA (needed for update)
      const currentFile = await this._getGitHubFile(gh.productPath);
      const sha = currentFile?.sha || null;

      // Create/update file
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
        throw new Error(result.message || `HTTP ${response.status}`);
      }

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
