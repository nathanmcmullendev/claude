// ============================================
// RAPIDWOO SETTINGS - Configuration UI
// Allows users to connect GitHub and Cloudinary
// ============================================

window.RapidWoo = window.RapidWoo || {};

window.RapidWoo.Settings = {

  // ============================================
  // INITIALIZATION
  // ============================================

  init() {
    this._injectStyles();
    this._createModal();
    this._bindEvents();
    console.log('âœ… RapidWoo Settings initialized');
    return this;
  },

  // ============================================
  // MODAL CREATION
  // ============================================

  _createModal() {
    const modal = document.createElement('div');
    modal.id = 'rapidwoo-settings-modal';
    modal.className = 'rw-settings-modal';
    modal.innerHTML = `
      <div class="rw-settings-overlay"></div>
      <div class="rw-settings-dialog">
        <div class="rw-settings-header">
          <h2>âš™ï¸ RapidWoo Settings</h2>
          <button class="rw-settings-close" aria-label="Close">âœ•</button>
        </div>
        
        <div class="rw-settings-body">
          <!-- GitHub Section -->
          <div class="rw-settings-section">
            <div class="rw-section-header">
              <h3>ðŸ™ GitHub Connection</h3>
              <span class="rw-status" id="gh-status">Not configured</span>
            </div>
            <p class="rw-section-desc">Connect to GitHub to save products directly to your repository.</p>
            
            <div class="rw-field">
              <label for="gh-token">Personal Access Token</label>
              <input type="password" id="gh-token" placeholder="ghp_xxxxxxxxxxxx or github_pat_xxxxx">
              <small>Need a token? <a href="https://github.com/settings/tokens?type=beta" target="_blank">Create one here</a> (needs Contents: Read/Write)</small>
            </div>
            
            <div class="rw-field-row">
              <div class="rw-field">
                <label for="gh-owner">Username / Org</label>
                <input type="text" id="gh-owner" placeholder="your-username">
              </div>
              <div class="rw-field">
                <label for="gh-repo">Repository</label>
                <input type="text" id="gh-repo" placeholder="your-repo">
              </div>
            </div>
            
            <div class="rw-field">
              <label for="gh-branch">Branch</label>
              <input type="text" id="gh-branch" placeholder="main" value="main">
            </div>
            
            <div class="rw-actions">
              <button id="gh-test" class="rw-btn">Test Connection</button>
              <button id="gh-save" class="rw-btn rw-btn-primary">Save GitHub Settings</button>
            </div>
            <div id="gh-result" class="rw-result"></div>
          </div>

          <!-- Cloudinary Section -->
          <div class="rw-settings-section">
            <div class="rw-section-header">
              <h3>â˜ï¸ Cloudinary (Image Hosting)</h3>
              <span class="rw-status" id="cl-status">Not configured</span>
            </div>
            <p class="rw-section-desc">Connect to Cloudinary for free image hosting. <a href="https://cloudinary.com/users/register_free" target="_blank">Sign up free</a> (25GB included).</p>
            
            <div class="rw-field-row">
              <div class="rw-field">
                <label for="cl-cloudname">Cloud Name</label>
                <input type="text" id="cl-cloudname" placeholder="your-cloud-name">
                <small>Found in your Cloudinary dashboard</small>
              </div>
              <div class="rw-field">
                <label for="cl-preset">Upload Preset</label>
                <input type="text" id="cl-preset" placeholder="your-unsigned-preset">
                <small>Create an <strong>unsigned</strong> preset in Settings â†’ Upload</small>
              </div>
            </div>
            
            <div class="rw-actions">
              <button id="cl-test" class="rw-btn">Test Upload</button>
              <button id="cl-save" class="rw-btn rw-btn-primary">Save Cloudinary Settings</button>
            </div>
            <div id="cl-result" class="rw-result"></div>
          </div>

          <!-- Status Overview -->
          <div class="rw-settings-section rw-status-overview">
            <h3>ðŸ“Š Connection Status</h3>
            <div class="rw-status-grid">
              <div class="rw-status-item" id="status-github">
                <span class="rw-status-icon">âŒ</span>
                <span class="rw-status-label">GitHub</span>
                <span class="rw-status-text">Not connected</span>
              </div>
              <div class="rw-status-item" id="status-cloudinary">
                <span class="rw-status-icon">âŒ</span>
                <span class="rw-status-label">Cloudinary</span>
                <span class="rw-status-text">Not connected</span>
              </div>
            </div>
          </div>
        </div>

        <div class="rw-settings-footer">
          <button class="rw-btn" id="rw-settings-done">Done</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modal = modal;
  },

  // ============================================
  // STYLES
  // ============================================

  _injectStyles() {
    if (document.getElementById('rw-settings-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'rw-settings-styles';
    styles.textContent = `
      .rw-settings-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
      }
      .rw-settings-modal.open {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .rw-settings-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
      }
      .rw-settings-dialog {
        position: relative;
        background: #fff;
        border-radius: 12px;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }
      .rw-settings-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 24px;
        border-bottom: 1px solid #e5e7eb;
      }
      .rw-settings-header h2 {
        margin: 0;
        font-size: 20px;
      }
      .rw-settings-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
      }
      .rw-settings-close:hover {
        background: #f3f4f6;
      }
      .rw-settings-body {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
      }
      .rw-settings-section {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
      }
      .rw-section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      .rw-section-header h3 {
        margin: 0;
        font-size: 16px;
      }
      .rw-section-desc {
        color: #6b7280;
        font-size: 14px;
        margin: 0 0 16px;
      }
      .rw-section-desc a {
        color: #2271b1;
      }
      .rw-status {
        font-size: 12px;
        padding: 4px 10px;
        border-radius: 999px;
        background: #fee2e2;
        color: #991b1b;
      }
      .rw-status.connected {
        background: #d1fae5;
        color: #065f46;
      }
      .rw-field {
        margin-bottom: 16px;
      }
      .rw-field label {
        display: block;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 6px;
        color: #374151;
      }
      .rw-field input {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 14px;
      }
      .rw-field input:focus {
        outline: none;
        border-color: #2271b1;
        box-shadow: 0 0 0 3px rgba(34, 113, 177, 0.1);
      }
      .rw-field small {
        display: block;
        margin-top: 6px;
        font-size: 12px;
        color: #6b7280;
      }
      .rw-field small a {
        color: #2271b1;
      }
      .rw-field-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      .rw-actions {
        display: flex;
        gap: 8px;
        margin-top: 16px;
      }
      .rw-btn {
        padding: 10px 16px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        background: #fff;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .rw-btn:hover {
        background: #f9fafb;
      }
      .rw-btn-primary {
        background: #2271b1;
        border-color: #1a5a8a;
        color: #fff;
      }
      .rw-btn-primary:hover {
        background: #1a5a8a;
      }
      .rw-result {
        margin-top: 12px;
        padding: 10px 12px;
        border-radius: 6px;
        font-size: 13px;
        display: none;
      }
      .rw-result.success {
        display: block;
        background: #d1fae5;
        color: #065f46;
      }
      .rw-result.error {
        display: block;
        background: #fee2e2;
        color: #991b1b;
      }
      .rw-status-overview {
        background: #fff;
      }
      .rw-status-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 12px;
      }
      .rw-status-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px;
        background: #f9fafb;
        border-radius: 6px;
      }
      .rw-status-icon {
        font-size: 20px;
      }
      .rw-status-label {
        font-weight: 600;
        font-size: 14px;
      }
      .rw-status-text {
        font-size: 12px;
        color: #6b7280;
        margin-left: auto;
      }
      .rw-settings-footer {
        padding: 16px 24px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        justify-content: flex-end;
      }
      @media (max-width: 600px) {
        .rw-field-row {
          grid-template-columns: 1fr;
        }
        .rw-status-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(styles);
  },

  // ============================================
  // EVENT BINDING
  // ============================================

  _bindEvents() {
    const modal = this.modal;
    const Storage = window.RapidWoo.Storage;
    const ImageHandler = window.RapidWoo.ImageHandler;

    // Close handlers
    modal.querySelector('.rw-settings-overlay').addEventListener('click', () => this.close());
    modal.querySelector('.rw-settings-close').addEventListener('click', () => this.close());
    modal.querySelector('#rw-settings-done').addEventListener('click', () => this.close());

    // GitHub save
    modal.querySelector('#gh-save').addEventListener('click', () => {
      const token = modal.querySelector('#gh-token').value.trim();
      const owner = modal.querySelector('#gh-owner').value.trim();
      const repo = modal.querySelector('#gh-repo').value.trim();
      const branch = modal.querySelector('#gh-branch').value.trim() || 'main';

      try {
        Storage.configureGitHub({ token, owner, repo, branch });
        this._showResult('gh-result', 'success', 'âœ… GitHub settings saved!');
        this._updateStatus();
      } catch (e) {
        this._showResult('gh-result', 'error', 'âŒ ' + e.message);
      }
    });

    // GitHub test
    modal.querySelector('#gh-test').addEventListener('click', async () => {
      const btn = modal.querySelector('#gh-test');
      btn.textContent = 'Testing...';
      btn.disabled = true;

      // Temporarily save settings for test
      const token = modal.querySelector('#gh-token').value.trim();
      const owner = modal.querySelector('#gh-owner').value.trim();
      const repo = modal.querySelector('#gh-repo').value.trim();
      const branch = modal.querySelector('#gh-branch').value.trim() || 'main';

      try {
        Storage.configureGitHub({ token, owner, repo, branch });
        const result = await Storage.testGitHubConnection();
        
        if (result.success) {
          this._showResult('gh-result', 'success', `âœ… Connected to ${result.repo} (${result.private ? 'private' : 'public'})`);
        } else {
          this._showResult('gh-result', 'error', 'âŒ ' + result.error);
        }
      } catch (e) {
        this._showResult('gh-result', 'error', 'âŒ ' + e.message);
      }

      btn.textContent = 'Test Connection';
      btn.disabled = false;
      this._updateStatus();
    });

    // Cloudinary save
    modal.querySelector('#cl-save').addEventListener('click', () => {
      const cloudName = modal.querySelector('#cl-cloudname').value.trim();
      const uploadPreset = modal.querySelector('#cl-preset').value.trim();

      try {
        Storage.configureCloudinary({ cloudName, uploadPreset });
        this._showResult('cl-result', 'success', 'âœ… Cloudinary settings saved!');
        this._updateStatus();
      } catch (e) {
        this._showResult('cl-result', 'error', 'âŒ ' + e.message);
      }
    });

    // Cloudinary test
    modal.querySelector('#cl-test').addEventListener('click', async () => {
      const btn = modal.querySelector('#cl-test');
      btn.textContent = 'Testing...';
      btn.disabled = true;

      // Temporarily save settings for test
      const cloudName = modal.querySelector('#cl-cloudname').value.trim();
      const uploadPreset = modal.querySelector('#cl-preset').value.trim();

      try {
        Storage.configureCloudinary({ cloudName, uploadPreset });
        const result = await ImageHandler.testCloudinaryConnection();
        
        if (result.success) {
          this._showResult('cl-result', 'success', 'âœ… Upload test successful!');
        } else {
          this._showResult('cl-result', 'error', 'âŒ ' + result.error);
        }
      } catch (e) {
        this._showResult('cl-result', 'error', 'âŒ ' + e.message);
      }

      btn.textContent = 'Test Upload';
      btn.disabled = false;
      this._updateStatus();
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('open')) {
        this.close();
      }
    });
  },

  // ============================================
  // UI HELPERS
  // ============================================

  _showResult(id, type, message) {
    const el = this.modal.querySelector('#' + id);
    el.className = 'rw-result ' + type;
    el.textContent = message;
  },

  _updateStatus() {
    const Storage = window.RapidWoo.Storage;
    const config = Storage.getConfig();

    // GitHub status
    const ghStatus = this.modal.querySelector('#gh-status');
    const ghItem = this.modal.querySelector('#status-github');
    if (config.github.configured) {
      ghStatus.textContent = 'Connected';
      ghStatus.classList.add('connected');
      ghItem.querySelector('.rw-status-icon').textContent = 'âœ…';
      ghItem.querySelector('.rw-status-text').textContent = config.github.owner + '/' + config.github.repo;
    } else {
      ghStatus.textContent = 'Not configured';
      ghStatus.classList.remove('connected');
      ghItem.querySelector('.rw-status-icon').textContent = 'âŒ';
      ghItem.querySelector('.rw-status-text').textContent = 'Not connected';
    }

    // Cloudinary status
    const clStatus = this.modal.querySelector('#cl-status');
    const clItem = this.modal.querySelector('#status-cloudinary');
    if (config.cloudinary.configured) {
      clStatus.textContent = 'Connected';
      clStatus.classList.add('connected');
      clItem.querySelector('.rw-status-icon').textContent = 'âœ…';
      clItem.querySelector('.rw-status-text').textContent = config.cloudinary.cloudName;
    } else {
      clStatus.textContent = 'Not configured';
      clStatus.classList.remove('connected');
      clItem.querySelector('.rw-status-icon').textContent = 'âŒ';
      clItem.querySelector('.rw-status-text').textContent = 'Not connected';
    }
  },

  _loadCurrentValues() {
    const Storage = window.RapidWoo.Storage;
    const config = Storage._config;

    // GitHub
    if (config.github.owner) {
      this.modal.querySelector('#gh-owner').value = config.github.owner;
    }
    if (config.github.repo) {
      this.modal.querySelector('#gh-repo').value = config.github.repo;
    }
    if (config.github.branch) {
      this.modal.querySelector('#gh-branch').value = config.github.branch;
    }
    // Don't pre-fill token for security

    // Cloudinary
    if (config.cloudinary.cloudName) {
      this.modal.querySelector('#cl-cloudname').value = config.cloudinary.cloudName;
    }
    if (config.cloudinary.uploadPreset) {
      this.modal.querySelector('#cl-preset').value = config.cloudinary.uploadPreset;
    }
  },

  // ============================================
  // PUBLIC API
  // ============================================

  open() {
    this._loadCurrentValues();
    this._updateStatus();
    this.modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  close() {
    this.modal.classList.remove('open');
    document.body.style.overflow = '';
  },

  toggle() {
    if (this.modal.classList.contains('open')) {
      this.close();
    } else {
      this.open();
    }
  }
};

// Auto-initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.RapidWoo.Settings.init());
} else {
  window.RapidWoo.Settings.init();
}

console.log('âœ… RapidWoo Settings loaded');
