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
                if (this.hasAttribute('data-no-smooth')) {
                    return;
                }
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

    function initReadingRail() {
        const content = document.querySelector('.post-content .content');
        const rail = document.getElementById('reading-rail');
        const railLines = document.getElementById('reading-rail-lines');
        const railTooltip = document.getElementById('reading-rail-tooltip');
        const railTooltipIndex = document.getElementById('reading-rail-tooltip-index');
        const railTooltipTitle = document.getElementById('reading-rail-tooltip-title');
        const railTooltipMeta = document.getElementById('reading-rail-tooltip-meta');

        if (!content || !rail || !railLines || !railTooltip || !railTooltipIndex || !railTooltipTitle || !railTooltipMeta) return;

        const headings = Array.from(content.querySelectorAll('h2, h3'))
            .filter((heading) => heading.textContent.trim().length > 0);

        if (headings.length < 2) {
            rail.hidden = true;
            return;
        }

        // ── Generate unique heading IDs ──
        const usedIds = new Set();

        function toSlug(text) {
            return text
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
        }

        function uniqueId(base) {
            let candidate = base || 'section';
            let counter = 2;
            while (usedIds.has(candidate) || document.getElementById(candidate)) {
                candidate = `${base}-${counter++}`;
            }
            usedIds.add(candidate);
            return candidate;
        }

        headings.forEach((heading, index) => {
            if (!heading.id) {
                heading.id = uniqueId(toSlug(heading.textContent) || `section-${index + 1}`);
            } else {
                usedIds.add(heading.id);
            }
        });

        // ── Build rail lines ──
        railLines.replaceChildren();

        let hideTooltipTimer;
        railTooltip.setAttribute('aria-hidden', 'true');

        function clearPendingHide() {
            if (hideTooltipTimer) {
                window.clearTimeout(hideTooltipTimer);
                hideTooltipTimer = null;
            }
        }

        function setTooltipContent(link) {
            railTooltipIndex.textContent = link.dataset.section || '';
            railTooltipTitle.textContent = link.getAttribute('aria-label') || '';
            railTooltipMeta.textContent = link.dataset.level === 'h2' ? 'Section' : 'Subsection';
        }

        function setTooltipPosition(link) {
            const railRect = rail.getBoundingClientRect();
            const linkRect = link.getBoundingClientRect();
            const rawY = (linkRect.top - railRect.top) + (linkRect.height / 2);
            const clampedY = Math.max(18, Math.min(railRect.height - 18, rawY));
            rail.style.setProperty('--rail-tooltip-y', `${clampedY}px`);
        }

        function setHoverState(link) {
            rail.classList.toggle('is-interacting', Boolean(link));
            links.forEach((item) => {
                item.classList.toggle('is-emphasis', item === link);
            });
        }

        function showTooltip(link, options) {
            options = options || {};
            clearPendingHide();
            if (!options.keepInteraction) {
                setHoverState(link);
            }
            setTooltipContent(link);
            setTooltipPosition(link);
            rail.classList.add('is-tooltip-visible');
            railTooltip.setAttribute('aria-hidden', 'false');
        }

        function scheduleHideTooltip() {
            clearPendingHide();
            hideTooltipTimer = window.setTimeout(function () {
                var railHovered = rail.matches(':hover');
                var railFocused = rail.contains(document.activeElement);
                if (!railHovered && !railFocused) {
                    rail.classList.remove('is-tooltip-visible');
                    railTooltip.setAttribute('aria-hidden', 'true');
                    setHoverState(null);
                }
            }, 160);
        }

        // ── Create line elements with staggered entrance ──
        let h2Counter = 0;
        let h3Counter = 0;

        const links = headings.map(function (heading, index) {
            if (heading.tagName === 'H2') {
                h2Counter += 1;
                h3Counter = 0;
            } else {
                if (h2Counter === 0) h2Counter = 1;
                h3Counter += 1;
            }

            const sectionLabel = heading.tagName === 'H2'
                ? String(h2Counter).padStart(2, '0')
                : String(h2Counter).padStart(2, '0') + '.' + h3Counter;

            const link = document.createElement('a');
            link.className = 'reading-rail-line';
            link.href = '#' + heading.id;
            link.dataset.targetId = heading.id;
            link.dataset.level = heading.tagName.toLowerCase();
            link.dataset.section = sectionLabel;
            link.setAttribute('aria-label', heading.textContent.trim());

            // Stagger entrance delay
            link.style.setProperty('--rail-enter-delay', (80 + index * 45) + 'ms');

            link.addEventListener('mouseenter', function () { showTooltip(link); });
            link.addEventListener('focus', function () { showTooltip(link); });
            link.addEventListener('mouseleave', scheduleHideTooltip);
            link.addEventListener('blur', scheduleHideTooltip);
            link.addEventListener('click', function () { showTooltip(link, { keepInteraction: true }); });

            railLines.appendChild(link);
            return link;
        });

        // ── Show rail and trigger entrance ──
        rail.hidden = false;

        raf(function () {
            rail.classList.add('is-ready');
            links.forEach(function (link) {
                link.classList.add('is-entered');
            });
        });

        rail.addEventListener('mouseleave', scheduleHideTooltip);
        rail.addEventListener('focusout', scheduleHideTooltip);

        // Re-position tooltip on rail scroll
        railLines.addEventListener('scroll', function () {
            var current = rail.querySelector('.reading-rail-line.is-emphasis') || rail.querySelector('.reading-rail-line.is-active');
            if (current) setTooltipPosition(current);
        }, { passive: true });

        // ── Active section tracking ──
        function setActiveRailLine(id) {
            let active = null;
            links.forEach(function (link) {
                const isActive = link.dataset.targetId === id;
                link.classList.toggle('is-active', isActive);
                if (isActive) active = link;
            });

            if (active && !rail.classList.contains('is-tooltip-visible')) {
                setTooltipContent(active);
                setTooltipPosition(active);
            }
        }

        const observer = new IntersectionObserver(function (entries) {
            const visible = entries
                .filter(function (entry) { return entry.isIntersecting; })
                .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });

            if (visible.length > 0) {
                setActiveRailLine(visible[0].target.id);
            }
        }, {
            rootMargin: '-20% 0px -65% 0px',
            threshold: [0, 1]
        });

        headings.forEach(function (heading) { observer.observe(heading); });
        setActiveRailLine(headings[0].id);
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

    function initSmartHeaderReveal() {
        const header = document.querySelector('.site-header');
        if (!header) return;

        const body = document.body;
        const root = document.documentElement;
        let lastScrollY = window.scrollY;
        let upDistance = 0;
        let downDistance = 0;
        let floating = false;

        function updateHeaderOffset() {
            root.style.setProperty('--floating-header-height', `${header.offsetHeight}px`);
        }

        function setFloating(nextState) {
            if (floating === nextState) return;
            floating = nextState;
            header.classList.toggle('is-floating', nextState);
            body.classList.toggle('has-floating-header', nextState);

            if (nextState) {
                updateHeaderOffset();
            } else {
                header.classList.remove('is-hidden');
                root.style.setProperty('--floating-header-height', '0px');
            }
        }

        function update() {
            const currentY = window.scrollY;
            const delta = currentY - lastScrollY;
            const activationPoint = header.offsetHeight + 24;

            if (currentY <= activationPoint) {
                setFloating(false);
                upDistance = 0;
                downDistance = 0;
                lastScrollY = currentY;
                return;
            }

            if (!floating) {
                setFloating(true);
                if (delta >= 0) {
                    header.classList.add('is-hidden');
                }
            }

            if (delta > 0) {
                downDistance += delta;
                upDistance = 0;
                if (downDistance > 10) {
                    header.classList.add('is-hidden');
                }
            } else if (delta < 0) {
                upDistance += Math.abs(delta);
                downDistance = 0;
                if (upDistance > 34) {
                    header.classList.remove('is-hidden');
                }
            }

            lastScrollY = currentY;
        }

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            raf(() => {
                update();
                ticking = false;
            });
        }, { passive: true });

        window.addEventListener('resize', throttle(() => {
            if (floating) {
                updateHeaderOffset();
            }
        }, 120));

        update();
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
            if (header) {
                const headerPosition = window.getComputedStyle(header).position;
                headerHeight = (headerPosition === 'fixed' || headerPosition === 'sticky')
                    ? header.offsetHeight
                    : 0;
            } else {
                headerHeight = 0;
            }
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

        // Reveal header when scrolling up
        initSmartHeaderReveal();

        // Initialize reading progress
        initReadingProgress();

        // Generate left-edge heading rail navigation
        initReadingRail();

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
