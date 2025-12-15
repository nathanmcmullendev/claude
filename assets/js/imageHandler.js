// ============================================
// RAPIDWOO IMAGE HANDLER - SERVERLESS EDITION
// Cloudinary for uploads, no PHP required
// ============================================

window.RapidWoo = window.RapidWoo || {};

window.RapidWoo.ImageHandler = {

  // ============================================
  // UPLOAD TO CLOUDINARY
  // ============================================

  /**
   * Upload image to Cloudinary
   * @param {File} file - Image file to upload
   * @returns {Promise<string>} - Cloudinary URL
   */
  async uploadToCloudinary(file) {
    const Storage = window.RapidWoo.Storage;
    
    if (!Storage.isCloudinaryConfigured()) {
      throw new Error('Cloudinary not configured. Go to Settings to connect.');
    }

    const config = Storage._config.cloudinary;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);
    formData.append('folder', 'rapidwoo'); // Organize in folder

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || `Upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Uploaded to Cloudinary:', result.secure_url);
      
      return result.secure_url;
    } catch (error) {
      console.error('❌ Cloudinary upload failed:', error);
      throw error;
    }
  },

  /**
   * Process image file - tries Cloudinary first, falls back to base64
   * @param {File} file - Image file
   * @returns {Promise<{type: string, data: string}>}
   */
  async processImageFile(file) {
    // Validate first
    const validation = this.validateImage(file);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    // Try Cloudinary
    const Storage = window.RapidWoo.Storage;
    if (Storage.isCloudinaryConfigured()) {
      try {
        const url = await this.uploadToCloudinary(file);
        return { type: 'url', data: url };
      } catch (error) {
        console.warn('⚠️ Cloudinary failed, using base64 fallback:', error.message);
      }
    }

    // Fallback to compressed base64
    console.warn('⚠️ Using base64 fallback (Cloudinary not configured)');
    const dataURL = await this.compressImage(file);
    return { type: 'base64', data: dataURL };
  },

  // ============================================
  // IMAGE COMPRESSION (BASE64 FALLBACK)
  // ============================================

  /**
   * Compress image to base64 (fallback when Cloudinary unavailable)
   */
  compressImage(file, maxWidth = 800, quality = 0.7) {
    const config = window.RapidWoo.Config?.IMAGE || {
      MAX_SIZE: 8 * 1024 * 1024,
      ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    };

    return new Promise((resolve, reject) => {
      if (!config.ALLOWED_TYPES.includes(file.type)) {
        reject(new Error(`Invalid file type: ${file.type}`));
        return;
      }
      if (file.size > config.MAX_SIZE) {
        reject(new Error(`File too large: ${(file.size / 1048576).toFixed(2)}MB`));
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          try {
            let w = img.width, h = img.height;
            if (w > maxWidth) {
              h = h * (maxWidth / w);
              w = maxWidth;
            }

            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl);
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },

  // ============================================
  // VALIDATION
  // ============================================

  validateImage(file) {
    const config = window.RapidWoo.Config?.IMAGE || {
      MAX_SIZE: 8 * 1024 * 1024,
      ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    };

    const errors = [];

    if (!config.ALLOWED_TYPES.includes(file.type)) {
      errors.push(`Invalid file type: ${file.type}. Allowed: JPG, PNG, WebP, GIF`);
    }

    if (file.size > config.MAX_SIZE) {
      errors.push(`File too large: ${(file.size / 1048576).toFixed(2)}MB (max ${(config.MAX_SIZE / 1048576)}MB)`);
    }

    return { valid: errors.length === 0, errors };
  },

  // ============================================
  // BULK PROCESSING
  // ============================================

  /**
   * Process multiple images for product creation
   */
  async processImages(files, progressCallback = null) {
    const results = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      progressCallback?.({
        current: i + 1,
        total: files.length,
        filename: file.name,
        status: 'processing'
      });

      try {
        const res = await this.processImageFile(file);
        const imageUrl = res.data;

        // Extract product info from filename
        const basename = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').trim();
        const priceMatch = basename.match(/\$?\s*(\d+(?:\.\d{1,2})?)/);
        const price = priceMatch ? Number(priceMatch[1]).toFixed(2) : (Math.random() * 200 + 50).toFixed(2);

        results.push({
          id: Date.now() + i,
          title: basename.replace(/,?\s*\$\d+(\.\d{1,2})?/, '') || `Product ${i + 1}`,
          slug: this.slugify(basename.replace(/,?\s*\$\d+(\.\d{1,2})?/, '') || `product-${i + 1}`),
          image: imageUrl,
          images: [imageUrl],
          regular_price: price,
          price,
          sale_price: '',
          stock_status: 'instock',
          categories: ['Artwork'],
          tags: ['art'],
          description: '<p>Beautiful original artwork from your collection.</p>',
          short_description: 'A stunning piece from your collection.',
          type: 'simple',
          sku: '',
          manage_stock: false,
          stock_quantity: null,
          weight: '',
          dimensions: { length: '', width: '', height: '' },
          featured: false,
          sold_individually: false,
          hidden: false,
          gallery: [{ url: '' }, { url: '' }],
          extra_images_enabled: false
        });

        progressCallback?.({
          current: i + 1,
          total: files.length,
          filename: file.name,
          status: 'complete',
          imageType: res.type
        });

      } catch (error) {
        console.error(`❌ Failed to process ${file.name}:`, error);
        progressCallback?.({
          current: i + 1,
          total: files.length,
          filename: file.name,
          status: 'error',
          error: error.message
        });
      }
    }

    return results;
  },

  // ============================================
  // UTILITIES
  // ============================================

  slugify(text) {
    return String(text)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  },

  getImageDimensions(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = src;
    });
  },

  /**
   * Get optimized Cloudinary URL with transforms
   */
  getOptimizedUrl(url, options = {}) {
    if (!url || !url.includes('cloudinary.com')) {
      return url;
    }

    const { width, height, quality = 'auto', format = 'auto' } = options;
    
    // Insert transforms into Cloudinary URL
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;

    const transforms = [];
    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);
    transforms.push(`q_${quality}`);
    transforms.push(`f_${format}`);

    return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
  },

  /**
   * Test Cloudinary connection
   */
  async testCloudinaryConnection() {
    const Storage = window.RapidWoo.Storage;
    
    if (!Storage.isCloudinaryConfigured()) {
      return { success: false, error: 'Cloudinary not configured' };
    }

    // Create a tiny test image
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const testFile = new File([blob], 'test.png', { type: 'image/png' });

    try {
      const url = await this.uploadToCloudinary(testFile);
      return { success: true, testUrl: url };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

console.log('✅ RapidWoo ImageHandler loaded (Serverless Mode)');
