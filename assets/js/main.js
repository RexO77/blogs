// Lightweight performance-optimized JavaScript
(function() {
    'use strict';
    
    // Performance: Use requestAnimationFrame for smooth animations
    const raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
    
    // Performance: Debounce function for scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Performance: Throttle function for resize events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Performance: Intersection Observer for lazy loading
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    // Performance: Preload critical resources (handled in HTML via <link rel="preload">)
    function preloadCriticalResources() {
        // No-op: Font preloading is handled in HTML head for optimal timing.
    }
    
    // Performance: Optimize font loading to match CSS @font-face declarations
    function optimizeFontLoading() {
        if ('fonts' in document) {
            Promise.all([
                document.fonts.load('400 1em Satoshi'),
                document.fonts.load('700 1em Unbounded')
            ]).then(() => {
                document.documentElement.classList.add('fonts-loaded');
            });
        }
    }
    
    // Performance: Smooth scroll for anchor links
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(targetId);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }
    
    // Performance: Add loading states
    function initLoadingStates() {
        const elements = document.querySelectorAll('.hero-headline, .post-item');
        elements.forEach(element => {
            element.classList.add('loading');
        });
        
        // Use Intersection Observer for progressive loading
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('loading');
                    entry.target.classList.add('loaded');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        elements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Performance: Optimize images
    function optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" for images below the fold
            if (img.getBoundingClientRect().top > window.innerHeight) {
                img.loading = 'lazy';
            }
            
            // Add error handling
            img.addEventListener('error', function() {
                this.style.display = 'none';
            });
        });
    }
    
    // Performance: Service Worker registration (if available)
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }
    
    // Optimized theme management - instant switching with accessibility
    function initThemeManager() {
        const html = document.documentElement;
        
        // Get current theme immediately
        let currentTheme = localStorage.getItem('theme') || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        // Update aria-pressed and screen reader text
        function updateThemeToggleState(theme) {
            const themeToggle = document.getElementById('theme-toggle');
            const currentThemeSpan = document.getElementById('current-theme');
            if (themeToggle) {
                themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
            }
            if (currentThemeSpan) {
                currentThemeSpan.textContent = theme;
            }
        }
        
        // Theme toggle click handler - optimized for instant switching
        function setupThemeToggle() {
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                // Set initial state
                updateThemeToggleState(currentTheme);
                
                themeToggle.addEventListener('click', function() {
                    // Toggle theme instantly
                    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
                    
                    // Apply theme change immediately - no delays or transitions
                    html.setAttribute('data-theme', currentTheme);
                    localStorage.setItem('theme', currentTheme);
                    
                    // Update accessibility attributes
                    updateThemeToggleState(currentTheme);
                    
                    // Force repaint for instant visual change
                    html.offsetHeight;
                });
                
                // Keyboard accessibility
                themeToggle.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            }
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!localStorage.getItem('theme')) {
                currentTheme = e.matches ? 'dark' : 'light';
                html.setAttribute('data-theme', currentTheme);
                updateThemeToggleState(currentTheme);
                html.offsetHeight; // Force repaint
            }
        });
        
        // Setup toggle immediately and on DOM ready
        setupThemeToggle();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupThemeToggle);
        }
    }
    
    // Performance: Analytics optimization
    function optimizeAnalytics() {
        // Defer analytics loading
        const analyticsScript = document.querySelector('script[src*="vercel.com/analytics"]');
        if (analyticsScript) {
            analyticsScript.setAttribute('data-defer', 'true');
        }
    }
    
    // Performance: Memory management
    function cleanup() {
        // Clean up event listeners when page unloads
        window.addEventListener('beforeunload', () => {
            // Cleanup code here if needed
        });
    }
    
    // Performance: Sticky header scroll effect
    function initStickyHeader() {
        const header = document.querySelector('.site-header');
        if (header) {
            window.addEventListener('scroll', throttle(() => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }, 10));
        }
    }
    
    // Performance: Initialize everything when DOM is ready
    function init() {
        // Preload critical resources (already done in HTML)
        preloadCriticalResources();
        
        // Optimize font loading
        optimizeFontLoading();
        
        // Initialize smooth scroll
        initSmoothScroll();
        
        // Initialize loading states
        initLoadingStates();
        
        // Initialize sticky header
        initStickyHeader();
        
        // Optimize images
        optimizeImages();
        
        // Register service worker
        registerServiceWorker();
        
        // Optimize analytics
        optimizeAnalytics();
        
        // Setup cleanup
        cleanup();
        
        // Performance: Mark page as loaded
        window.addEventListener('load', () => {
            document.documentElement.classList.add('page-loaded');
        });
    }
    
    // Initialize theme manager immediately (don't wait for DOM)
    initThemeManager();
    
    // Performance: Use DOMContentLoaded for faster initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})(); 