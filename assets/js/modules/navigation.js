/**
 * Navigation Module
 * Handles site navigation, smooth scrolling, and header behavior
 */

import { throttle, smoothScrollTo } from './utils.js';

export class NavigationManager {
  constructor() {
    this.header = document.querySelector('.site-header');
    this.lastScrollY = window.scrollY;
    this.scrollThreshold = 50;
    
    this.init();
  }

  /**
   * Initialize navigation functionality
   */
  init() {
    this.setupSmoothScrolling();
    this.setupHeaderScroll();
    this.setupKeyboardNavigation();
    this.setupMobileNavigation();
  }

  /**
   * Setup smooth scrolling for anchor links
   */
  setupSmoothScrolling() {
    // Handle anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', this.handleAnchorClick.bind(this));
    });

    // Handle hash changes
    window.addEventListener('hashchange', this.handleHashChange.bind(this));
    
    // Handle initial hash on page load
    if (window.location.hash) {
      setTimeout(() => this.handleHashChange(), 100);
    }
  }

  /**
   * Handle anchor link clicks
   * @param {Event} event - Click event
   */
  handleAnchorClick(event) {
    const href = event.currentTarget.getAttribute('href');
    if (href.length <= 1) return; // Skip empty or just "#" links
    
    const targetId = href.substring(1);
    const target = document.getElementById(targetId);
    
    if (target) {
      event.preventDefault();
      
      // Calculate offset for fixed header
      const headerHeight = this.header ? this.header.offsetHeight : 0;
      const offset = headerHeight + 20; // Add some padding
      
      smoothScrollTo(target, { offset });
      
      // Update URL without triggering scroll
      if (history.pushState) {
        history.pushState(null, null, href);
      } else {
        window.location.hash = href;
      }
    }
  }

  /**
   * Handle hash changes
   */
  handleHashChange() {
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        const headerHeight = this.header ? this.header.offsetHeight : 0;
        const offset = headerHeight + 20;
        smoothScrollTo(target, { offset });
      }
    }
  }

  /**
   * Setup header scroll behavior
   */
  setupHeaderScroll() {
    if (!this.header) return;

    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;
      
      // Add/remove scrolled class
      if (currentScrollY > this.scrollThreshold) {
        this.header.classList.add('site-header--scrolled');
      } else {
        this.header.classList.remove('site-header--scrolled');
      }
      
      this.lastScrollY = currentScrollY;
    }, 10);

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    // Handle escape key for modals/dropdowns
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeAllDropdowns();
      }
    });

    // Skip to main content link for accessibility
    this.createSkipLink();
  }

  /**
   * Create skip to main content link for accessibility
   */
  createSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link sr-only';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--color-primary);
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 10000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      const main = document.querySelector('#main, main, [role="main"]');
      if (main) {
        main.focus();
        main.scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  /**
   * Setup mobile navigation (if needed)
   */
  setupMobileNavigation() {
    // Mobile menu toggle functionality can be added here
    // For now, the current design doesn't need a mobile menu
    
    // Add touch-friendly enhancements
    this.addTouchEnhancements();
  }

  /**
   * Add touch enhancements for mobile devices
   */
  addTouchEnhancements() {
    // Add touch delay removal
    if ('ontouchstart' in window) {
      document.body.classList.add('touch-device');
      
      // Improve touch target sizes
      const style = document.createElement('style');
      style.textContent = `
        .touch-device button,
        .touch-device a,
        .touch-device input,
        .touch-device select {
          min-height: 44px;
          min-width: 44px;
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Close all dropdown menus
   */
  closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown.open, .menu.open');
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('open');
    });
  }

  /**
   * Get current scroll position
   * @returns {number} Current scroll Y position
   */
  getScrollPosition() {
    return window.scrollY || document.documentElement.scrollTop;
  }

  /**
   * Check if header is in scrolled state
   * @returns {boolean} Whether header is scrolled
   */
  isHeaderScrolled() {
    return this.header && this.header.classList.contains('site-header--scrolled');
  }

  /**
   * Scroll to top of page
   * @param {boolean} smooth - Whether to use smooth scrolling
   */
  scrollToTop(smooth = true) {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
  }

  /**
   * Get navigation height (useful for offset calculations)
   * @returns {number} Navigation height in pixels
   */
  getNavigationHeight() {
    return this.header ? this.header.offsetHeight : 0;
  }

  /**
   * Highlight active navigation item based on current page
   */
  highlightActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .menu-item a');
    
    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPath) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Update page title and meta description
   * @param {string} title - New page title
   * @param {string} description - New meta description
   */
  updatePageMeta(title, description) {
    if (title) {
      document.title = title;
    }
    
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;
    }
  }

  /**
   * Cleanup navigation event listeners
   */
  cleanup() {
    // Remove event listeners if component is destroyed
    // This is useful for SPA-like behavior
  }
}
