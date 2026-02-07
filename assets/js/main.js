// Lightweight performance-optimized JavaScript
(function () {
    'use strict';

    // requestAnimationFrame alias with fallback
    const raf = window.requestAnimationFrame || ((cb) => setTimeout(cb, 16));

    // Performance: Throttle function for resize events
    function throttle(func, limit) {
        let inThrottle;
        return function () {
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
            link.addEventListener('click', function (e) {
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
            img.addEventListener('error', function () {
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
                if (themeToggle.dataset.bound === 'true') {
                    return;
                }
                themeToggle.addEventListener('click', function () {
                    // Toggle theme instantly
                    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';

                    // Apply theme change immediately - no delays or transitions
                    html.setAttribute('data-theme', currentTheme);
                    localStorage.setItem('theme', currentTheme);
                });
                themeToggle.dataset.bound = 'true';
            }
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            if (!localStorage.getItem('theme')) {
                currentTheme = e.matches ? 'dark' : 'light';
                html.setAttribute('data-theme', currentTheme);
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
            }, 10), { passive: true });
        }
    }

    // Performance: Reading progress indicator (Robust Implementation)
    function initReadingProgress() {
        const article = document.querySelector('.post-content .content');
        if (!article) return;

        // Create progress bar if it doesn't exist
        let progressBar = document.querySelector('.reading-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'reading-progress';
            progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
            document.body.appendChild(progressBar);
        }

        const progressFill = progressBar.querySelector('.reading-progress-fill');
        const header = document.querySelector('.site-header');

        // State
        let articleHeight = 0;
        let headerHeight = 0;
        let windowHeight = 0;

        function updateMetrics() {
            articleHeight = article.offsetHeight;
            headerHeight = header ? header.offsetHeight : 0;
            windowHeight = window.innerHeight;
            updateProgress();
        }

        function updateProgress() {
            // Get current positions relative to viewport
            const rect = article.getBoundingClientRect();

            // Start reading: When top of article passes the header
            // End reading: When bottom of article hits bottom of viewport

            // Distance from top of article to bottom of header
            // If rect.top > headerHeight, we haven't started reading (negative distance)
            const distanceFromStart = headerHeight - rect.top;

            // Total scrollable distance to finish reading
            // This is the total height of article minus the visible window area (adjusted for header)
            // Effectively: How much do we need to scroll to get the bottom of article to bottom of screen?
            const totalDistance = articleHeight - (windowHeight - headerHeight);

            let progress = 0;

            if (totalDistance > 0) {
                progress = distanceFromStart / totalDistance;
            } else {
                // Content fits in screen or something is wrong, assume 100% if visible
                progress = 1;
            }

            // Clamp between 0 and 1
            progress = Math.min(Math.max(progress, 0), 1);

            progressFill.style.width = `${progress * 100}%`;
        }

        // Observers and Listeners
        const resizeObserver = new ResizeObserver(throttle(() => {
            updateMetrics();
        }, 100));

        resizeObserver.observe(article);
        if (header) resizeObserver.observe(header);

        let scrollTicking = false;
        window.addEventListener('scroll', () => {
            if (scrollTicking) {
                return;
            }
            scrollTicking = true;
            raf(() => {
                updateProgress();
                scrollTicking = false;
            });
        }, { passive: true });

        window.addEventListener('resize', throttle(updateMetrics, 100));

        // Initial call
        updateMetrics();
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
