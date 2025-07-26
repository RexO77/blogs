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
    
    // Performance: Preload critical resources
    function preloadCriticalResources() {
        const criticalResources = [
            '/fonts/inter.woff2',
            '/fonts/unbounded.woff2'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = resource.endsWith('.css') ? 'style' : 'font';
            link.href = resource;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }
    
    // Performance: Optimize font loading
    function optimizeFontLoading() {
        if ('fonts' in document) {
            Promise.all([
                document.fonts.load('400 1em Inter'),
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
    
    // Performance: Theme management
    function initThemeManager() {
        const html = document.documentElement;
        
        // Get saved theme or system preference
        function getInitialTheme() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme;
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        // Update theme text immediately
        function updateThemeText(theme) {
            const themeText = document.querySelector('.theme-text');
            if (themeText) {
                themeText.textContent = theme === 'dark' ? 'Dark' : 'Light';
            }
        }
        
        // Ensure text is updated with multiple attempts
        function ensureTextUpdate(theme) {
            updateThemeText(theme);
            // Try again after a micro-task delay
            setTimeout(() => updateThemeText(theme), 0);
            // Try again after DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => updateThemeText(theme), { once: true });
            }
        }
        
        // Apply theme with instant text update
        function setTheme(theme) {
            html.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            ensureTextUpdate(theme);
        }
        
        // Toggle theme with instant text update
        function toggleTheme() {
            const currentTheme = html.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        }
        
        // Initialize theme immediately
        const initialTheme = getInitialTheme();
        setTheme(initialTheme);
        
        // Add event listener when DOM is ready
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                setTheme(newTheme);
            }
        });
        

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
        // Preload critical resources
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