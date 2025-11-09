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
    
    // Performance: Optimize font loading
    function optimizeFontLoading() {
        if ('fonts' in document) {
            Promise.all([
                document.fonts.load('400 1em Satoshi'),
                document.fonts.load('700 1em Unbounded')
            ]).then(() => {
                document.documentElement.classList.add('fonts-loaded');
            }).catch(() => {
                // Fallback if font loading fails
                document.documentElement.classList.add('fonts-loaded');
            });
        }
    }
    
    // Performance: Smooth scroll for anchor links
    function initSmoothScroll() {
        // Cache anchor links query
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
        const elements = document.querySelectorAll('.hero-headline, .post-item, .post-card');
        
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
            element.classList.add('loading');
            observer.observe(element);
        });
    }
    
    // Performance: Optimize images
    function optimizeImages() {
        const images = document.querySelectorAll('img');
        const viewportHeight = window.innerHeight;
        
        images.forEach(img => {
            // Add loading="lazy" for images below the fold
            if (img.getBoundingClientRect().top > viewportHeight) {
                img.loading = 'lazy';
            }
            
            // Add error handling
            img.addEventListener('error', function() {
                this.style.display = 'none';
            });
        });
    }
    
    // Optimized theme management - instant switching
    function initThemeManager() {
        const html = document.documentElement;
        
        // Get current theme immediately
        let currentTheme = localStorage.getItem('theme') || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        // Theme toggle click handler - optimized for instant switching
        function setupThemeToggle() {
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', function() {
                    // Toggle theme instantly
                    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
                    
                    // Apply theme change immediately - no delays or transitions
                    html.setAttribute('data-theme', currentTheme);
                    localStorage.setItem('theme', currentTheme);
                    
                    // Force repaint for instant visual change
                    html.offsetHeight;
                });
            }
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!localStorage.getItem('theme')) {
                currentTheme = e.matches ? 'dark' : 'light';
                html.setAttribute('data-theme', currentTheme);
                html.offsetHeight; // Force repaint
            }
        });
        
        // Setup toggle immediately and on DOM ready
        setupThemeToggle();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupThemeToggle);
        }
    }
    
    // Performance: Sticky header scroll effect (cached header element)
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
    
    // Performance: Reading progress indicator (cached elements)
    function initReadingProgress() {
        const article = document.querySelector('.post-content .content');
        if (!article) return;
        
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
        document.body.appendChild(progressBar);
        
        const progressFill = progressBar.querySelector('.reading-progress-fill');
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        
        function updateProgress() {
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;
            
            const articleEnd = articleTop + articleHeight - windowHeight;
            const progress = Math.min(Math.max((scrollTop - articleTop) / (articleEnd - articleTop), 0), 1);
            
            progressFill.style.width = `${progress * 100}%`;
        }
        
        window.addEventListener('scroll', throttle(updateProgress, 10));
        updateProgress();
    }
    
    // Performance: Initialize everything when DOM is ready
    function init() {
        // Optimize font loading
        optimizeFontLoading();
        
        // Initialize smooth scroll
        initSmoothScroll();
        
        // Initialize loading states
        initLoadingStates();
        
        // Initialize sticky header
        initStickyHeader();
        
        // Initialize reading progress
        initReadingProgress();
        
        // Optimize images
        optimizeImages();
        
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