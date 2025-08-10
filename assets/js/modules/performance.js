/**
 * Performance Optimization Module
 * Handles lazy loading, image optimization, and performance monitoring
 */

export class PerformanceManager {
  constructor() {
    this.observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };
    
    this.init();
  }

  /**
   * Initialize performance optimizations
   */
  init() {
    this.optimizeFonts();
    this.setupLazyLoading();
    this.setupImageOptimization();
    this.setupIntersectionObserver();
    this.monitorPerformance();
  }

  /**
   * Optimize font loading
   */
  optimizeFonts() {
    if ('fonts' in document) {
      Promise.all([
        document.fonts.load('400 1em Satoshi'),
        document.fonts.load('700 1em Unbounded')
      ]).then(() => {
        document.documentElement.classList.add('fonts-loaded');
      }).catch(error => {
        console.warn('Font loading failed:', error);
      });
    }
  }

  /**
   * Setup lazy loading for images
   */
  setupLazyLoading() {
    // Use native lazy loading where supported
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img:not([loading])');
      images.forEach(img => {
        // Add lazy loading to images below the fold
        if (img.getBoundingClientRect().top > window.innerHeight) {
          img.loading = 'lazy';
        }
      });
    } else {
      // Fallback for browsers without native lazy loading
      this.setupIntersectionObserverLazyLoading();
    }
  }

  /**
   * Setup intersection observer for lazy loading fallback
   */
  setupIntersectionObserverLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    if (images.length === 0) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, this.observerOptions);

    images.forEach(img => imageObserver.observe(img));
  }

  /**
   * Optimize images
   */
  setupImageOptimization() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Add error handling
      img.addEventListener('error', this.handleImageError);
      
      // Add loading state
      img.addEventListener('load', this.handleImageLoad);
    });
  }

  /**
   * Handle image loading errors
   * @param {Event} event - Error event
   */
  handleImageError(event) {
    const img = event.target;
    console.warn('Image failed to load:', img.src);
    
    // Hide broken images or show placeholder
    img.style.display = 'none';
    
    // Optionally, add a placeholder or retry logic
    if (img.dataset.fallback) {
      img.src = img.dataset.fallback;
    }
  }

  /**
   * Handle successful image loading
   * @param {Event} event - Load event
   */
  handleImageLoad(event) {
    const img = event.target;
    img.classList.add('loaded');
  }

  /**
   * Setup intersection observer for animations and loading states
   */
  setupIntersectionObserver() {
    const elements = document.querySelectorAll('.hero__headline, .post-item, .data-card');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    elements.forEach(element => {
      element.classList.add('pre-load');
      observer.observe(element);
    });
  }

  /**
   * Monitor performance metrics
   */
  monitorPerformance() {
    // Monitor Core Web Vitals
    this.measureCLS();
    this.measureFID();
    this.measureLCP();
    
    // Monitor page load performance
    this.measurePageLoad();
  }

  /**
   * Measure Cumulative Layout Shift (CLS)
   */
  measureCLS() {
    if ('LayoutShiftObserver' in window) {
      let clsValue = 0;
      const observer = new LayoutShiftObserver((entries) => {
        for (const entry of entries) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
      
      // Report CLS after page is loaded
      window.addEventListener('beforeunload', () => {
        if (clsValue > 0.1) {
          console.warn(`High CLS detected: ${clsValue}`);
        }
      });
    }
  }

  /**
   * Measure First Input Delay (FID)
   */
  measureFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.processingStart && entry.startTime) {
            const fid = entry.processingStart - entry.startTime;
            if (fid > 100) {
              console.warn(`High FID detected: ${fid}ms`);
            }
          }
        }
      });
      observer.observe({ type: 'first-input', buffered: true });
    }
  }

  /**
   * Measure Largest Contentful Paint (LCP)
   */
  measureLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry.startTime > 2500) {
          console.warn(`High LCP detected: ${lastEntry.startTime}ms`);
        }
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    }
  }

  /**
   * Measure page load performance
   */
  measurePageLoad() {
    window.addEventListener('load', () => {
      // Mark page as fully loaded
      document.documentElement.classList.add('page-loaded');
      
      // Measure performance timing
      if ('performance' in window && 'timing' in performance) {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
        
        if (loadTime > 3000) {
          console.warn(`Slow page load: ${loadTime}ms`);
        }
        
        // Optional: Send metrics to analytics
        this.reportPerformanceMetrics({
          loadTime,
          domReady,
          firstPaint: timing.responseStart - timing.navigationStart
        });
      }
    });
  }

  /**
   * Report performance metrics (override in analytics module)
   * @param {Object} metrics - Performance metrics
   */
  reportPerformanceMetrics(metrics) {
    // This can be overridden by analytics module
    if (window.gtag) {
      gtag('event', 'page_load_time', {
        'custom_parameter': metrics.loadTime
      });
    }
  }

  /**
   * Preload critical resources
   * @param {Array} resources - Array of resource URLs
   */
  preloadResources(resources = []) {
    const defaultResources = [
      '/fonts/Satoshi-Regular.otf',
      '/fonts/Unbounded-VariableFont_wght.ttf'
    ];
    
    [...defaultResources, ...resources].forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.crossOrigin = 'anonymous';
      
      if (resource.endsWith('.css')) {
        link.as = 'style';
      } else if (resource.includes('font')) {
        link.as = 'font';
        link.type = resource.endsWith('.woff2') ? 'font/woff2' : 'font/otf';
      } else if (resource.endsWith('.js')) {
        link.as = 'script';
      }
      
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  /**
   * Cleanup performance observers
   */
  cleanup() {
    // Called on page unload if needed
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
