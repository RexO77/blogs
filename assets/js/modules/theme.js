/**
 * Theme Management Module
 * Handles dark/light theme switching with optimized performance
 */

export class ThemeManager {
  constructor() {
    this.html = document.documentElement;
    this.storageKey = 'theme';
    this.prefersDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.toggleButton = null;
    
    this.init();
  }

  /**
   * Initialize theme system
   */
  init() {
    // Get current theme immediately
    this.currentTheme = this.getCurrentTheme();
    // Sync with attribute set by the inline head script if present
    const attrTheme = this.html.getAttribute('data-theme');
    if (attrTheme === 'dark' || attrTheme === 'light') {
      this.currentTheme = attrTheme;
    }
    
    // Only apply immediately if the user has an explicit stored preference
    // This avoids overriding system preference when no choice was made
    const stored = localStorage.getItem(this.storageKey);
    if (!this.html.hasAttribute('data-theme') && stored) {
      this.applyTheme(stored, false);
    } else {
      // Ensure ARIA state reflects the current theme
      this.updateToggleState();
    }
    
    // Setup theme toggle
    this.setupThemeToggle();
    
    // Listen for system theme changes
    this.setupSystemThemeListener();
  }

  /**
   * Get current theme from storage or system preference
   * @returns {string} 'light' or 'dark'
   */
  getCurrentTheme() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) return stored;
    
    return this.prefersDarkQuery.matches ? 'dark' : 'light';
  }

  /**
   * Apply theme to document
   * @param {string} theme - 'light' or 'dark'
   * @param {boolean} save - Whether to save to localStorage
   */
  applyTheme(theme, save = true) {
    // Remove any existing theme attribute
    this.html.removeAttribute('data-theme');
    
    // Force reflow to ensure clean state
    this.html.offsetHeight;
    
    // Apply new theme explicitly for both states to override system preference
    this.html.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    // Apply a class to help debug CSS specificity issues
    this.html.classList.remove('theme-light', 'theme-dark');
    this.html.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
    
    // Force another reflow for instant visual change
    this.html.offsetHeight;
    
    // Save to localStorage
    if (save) {
      localStorage.setItem(this.storageKey, theme);
    }
    
    this.currentTheme = theme;
    
    // Reflect state on the toggle for accessibility
    this.updateToggleState();
    
    // Dispatch custom event for other modules to listen
    this.dispatchThemeChangeEvent(theme);
  }

  /**
   * Toggle between light and dark theme
   */
  toggle() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  /**
   * Setup theme toggle button
   */
  setupThemeToggle() {
    const setupToggle = () => {
      const themeToggle = document.getElementById('theme-toggle');
      if (themeToggle && !themeToggle._themeHandlerAttached) {
        this.toggleButton = themeToggle;
        themeToggle.addEventListener('click', () => this.toggle());
        themeToggle._themeHandlerAttached = true;
        
        // Sync initial state
        this.updateToggleState();
        
        // Add keyboard support
        themeToggle.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggle();
          }
        });
      }
    };

    // Setup immediately and on DOM ready
    setupToggle();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupToggle);
    }
  }

  /**
   * Update toggle accessibility and label state
   */
  updateToggleState() {
    if (!this.toggleButton) return;
    const isDark = this.currentTheme === 'dark';
    this.toggleButton.setAttribute('aria-pressed', String(isDark));
    this.toggleButton.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  /**
   * Listen for system theme changes
   */
  setupSystemThemeListener() {
    this.prefersDarkQuery.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem(this.storageKey)) {
        const newTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(newTheme, false);
      }
    });
  }

  /**
   * Dispatch theme change event
   * @param {string} theme - The new theme
   */
  dispatchThemeChangeEvent(theme) {
    const event = new CustomEvent('themechange', {
      detail: { theme },
      bubbles: true
    });
    document.dispatchEvent(event);
  }

  /**
   * Get current theme
   * @returns {string} Current theme ('light' or 'dark')
   */
  getTheme() {
    return this.currentTheme;
  }

  /**
   * Check if dark mode is active
   * @returns {boolean}
   */
  isDarkMode() {
    return this.currentTheme === 'dark';
  }

  /**
   * Set theme programmatically
   * @param {string} theme - 'light' or 'dark'
   */
  setTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      this.applyTheme(theme);
    } else {
      console.warn(`Invalid theme: ${theme}. Use 'light' or 'dark'.`);
    }
  }

  /**
   * Reset theme to system preference
   */
  resetToSystem() {
    localStorage.removeItem(this.storageKey);
    const systemTheme = this.prefersDarkQuery.matches ? 'dark' : 'light';
    this.applyTheme(systemTheme, false);
  }
}
