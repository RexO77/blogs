/**
 * Main Application Entry Point
 * Modern ES6+ Module Architecture with Senior Frontend Best Practices
 */

import { ThemeManager } from './modules/theme.js';
import { PerformanceManager } from './modules/performance.js';
import { NavigationManager } from './modules/navigation.js';
import { waitForDOM, dispatchCustomEvent } from './modules/utils.js';

/**
 * Main Application Class
 * Orchestrates all modules and handles application lifecycle
 */
class App {
  constructor() {
    this.modules = new Map();
    this.initialized = false;
    this.version = '2.0.0';
    
    // Initialize immediately for critical functionality
    this.initImmediate();
  }

  /**
   * Initialize critical functionality immediately (theme management)
   */
  initImmediate() {
    // Theme must be initialized immediately to prevent FOUC
    try {
      this.modules.set('theme', new ThemeManager());
      console.log('🎨 Theme manager initialized');
    } catch (error) {
      console.error('Failed to initialize theme manager:', error);
    }
  }

  /**
   * Initialize application after DOM is ready
   */
  async init() {
    if (this.initialized) {
      console.warn('App already initialized');
      return;
    }

    try {
      console.log(`🚀 Initializing App v${this.version}`);
      
      // Wait for DOM to be ready
      await waitForDOM();
      
      // Initialize modules in order of priority
      await this.initializeModules();
      
      // Setup global event listeners
      this.setupGlobalEvents();
      
      // Mark as initialized
      this.initialized = true;
      
      // Dispatch app ready event
      dispatchCustomEvent('app:ready', { version: this.version });
      
      console.log('✅ App initialization complete');
      
    } catch (error) {
      console.error('❌ App initialization failed:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Initialize all application modules
   */
  async initializeModules() {
    const moduleInitializers = [
      { name: 'performance', class: PerformanceManager, critical: true },
      { name: 'navigation', class: NavigationManager, critical: true }
    ];

    for (const { name, class: ModuleClass, critical } of moduleInitializers) {
      try {
        console.log(`🔧 Initializing ${name} module...`);
        const instance = new ModuleClass();
        this.modules.set(name, instance);
        console.log(`✅ ${name} module initialized`);
      } catch (error) {
        console.error(`❌ Failed to initialize ${name} module:`, error);
        
        if (critical) {
          throw new Error(`Critical module ${name} failed to initialize`);
        }
      }
    }
  }

  /**
   * Setup global application event listeners
   */
  setupGlobalEvents() {
    // Handle page visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Handle online/offline status
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    
    // Handle global errors
    window.addEventListener('error', this.handleGlobalError.bind(this));
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    
    // Handle page unload
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    
    // Page load complete
    window.addEventListener('load', this.handlePageLoad.bind(this));
  }

  /**
   * Handle page visibility changes
   */
  handleVisibilityChange() {
    if (document.hidden) {
      console.log('📱 Page hidden');
      dispatchCustomEvent('app:hidden');
    } else {
      console.log('👁️ Page visible');
      dispatchCustomEvent('app:visible');
    }
  }

  /**
   * Handle online status
   */
  handleOnline() {
    console.log('🌐 Connection restored');
    dispatchCustomEvent('app:online');
    document.documentElement.classList.remove('offline');
    document.documentElement.classList.add('online');
  }

  /**
   * Handle offline status
   */
  handleOffline() {
    console.log('📡 Connection lost');
    dispatchCustomEvent('app:offline');
    document.documentElement.classList.remove('online');
    document.documentElement.classList.add('offline');
  }

  /**
   * Handle global JavaScript errors
   * @param {ErrorEvent} event - Error event
   */
  handleGlobalError(event) {
    console.error('Global error:', event.error);
    
    // Report to analytics if available
    if (window.gtag) {
      gtag('event', 'exception', {
        'description': event.error.message,
        'fatal': false
      });
    }
  }

  /**
   * Handle unhandled promise rejections
   * @param {PromiseRejectionEvent} event - Promise rejection event
   */
  handleUnhandledRejection(event) {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Report to analytics if available
    if (window.gtag) {
      gtag('event', 'exception', {
        'description': `Unhandled Promise: ${event.reason}`,
        'fatal': false
      });
    }
  }

  /**
   * Handle page unload
   */
  handleBeforeUnload() {
    console.log('📤 Page unloading');
    
    // Cleanup modules
    this.modules.forEach((module, name) => {
      if (typeof module.cleanup === 'function') {
        try {
          module.cleanup();
        } catch (error) {
          console.error(`Error cleaning up ${name} module:`, error);
        }
      }
    });
    
    dispatchCustomEvent('app:beforeunload');
  }

  /**
   * Handle page load complete
   */
  handlePageLoad() {
    console.log('🎯 Page load complete');
    document.documentElement.classList.add('page-loaded');
    dispatchCustomEvent('app:loaded');
    
    // Report performance metrics
    const performance = this.getModule('performance');
    if (performance && typeof performance.reportPerformanceMetrics === 'function') {
      // Performance metrics will be reported by the performance module
    }
  }

  /**
   * Handle initialization errors
   * @param {Error} error - Initialization error
   */
  handleInitializationError(error) {
    // Show user-friendly error message
    console.error('Application failed to initialize properly');
    
    // Try to initialize in degraded mode
    this.initializeDegradedMode();
  }

  /**
   * Initialize application in degraded mode (fallback)
   */
  initializeDegradedMode() {
    console.log('🔄 Initializing in degraded mode');
    
    // Basic functionality only
    document.documentElement.classList.add('degraded-mode');
    
    // Ensure theme still works
    if (!this.modules.has('theme')) {
      try {
        this.modules.set('theme', new ThemeManager());
      } catch (error) {
        console.error('Even theme failed in degraded mode:', error);
      }
    }
  }

  /**
   * Get module instance
   * @param {string} name - Module name
   * @returns {Object|null} Module instance
   */
  getModule(name) {
    return this.modules.get(name) || null;
  }

  /**
   * Check if module is loaded
   * @param {string} name - Module name
   * @returns {boolean} Whether module is loaded
   */
  hasModule(name) {
    return this.modules.has(name);
  }

  /**
   * Get application version
   * @returns {string} Application version
   */
  getVersion() {
    return this.version;
  }

  /**
   * Get initialization status
   * @returns {boolean} Whether app is initialized
   */
  isInitialized() {
    return this.initialized;
  }

  /**
   * Reload application
   */
  reload() {
    console.log('🔄 Reloading application');
    window.location.reload();
  }

  /**
   * Debug information
   * @returns {Object} Debug information
   */
  debug() {
    return {
      version: this.version,
      initialized: this.initialized,
      modules: Array.from(this.modules.keys()),
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
  }
}

// Initialize application
const app = new App();

// Make app available globally for debugging
window.app = app;

// Start initialization
app.init().catch(error => {
  console.error('Critical app initialization failure:', error);
});

// Export for potential module usage
export default app; 