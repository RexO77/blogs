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
            railTooltip.style.top = `${clampedY}px`;
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

            link.addEventListener('mouseenter', function () { showTooltip(link); });
            link.addEventListener('focus', function () { showTooltip(link); });
            link.addEventListener('mouseleave', scheduleHideTooltip);
            link.addEventListener('blur', scheduleHideTooltip);
            link.addEventListener('click', function () { showTooltip(link, { keepInteraction: true }); });

            railLines.appendChild(link);
            return link;
        });

        // ── Show rail ──
        rail.hidden = false;

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
            }
        }

        function getActivationOffset() {
            const rootStyle = getComputedStyle(document.documentElement);
            const headerSlotHeight = parseFloat(rootStyle.getPropertyValue('--header-slot-height')) || 0;
            return headerSlotHeight + 44;
        }

        function syncActiveRailLine() {
            const activationOffset = getActivationOffset();
            let activeHeading = headings[0];

            headings.forEach(function (heading) {
                if (heading.getBoundingClientRect().top <= activationOffset) {
                    activeHeading = heading;
                }
            });

            setActiveRailLine(activeHeading.id);
        }

        let activeSyncFrame = null;

        function requestActiveRailSync() {
            if (activeSyncFrame !== null) return;
            activeSyncFrame = raf(function () {
                activeSyncFrame = null;
                syncActiveRailLine();
            });
        }

        window.addEventListener('scroll', requestActiveRailSync, { passive: true });
        window.addEventListener('resize', requestActiveRailSync);

        syncActiveRailLine();
    }

    // Optimized theme management - instant switching
    function initThemeManager() {
        const html = document.documentElement;
        const themeColor = document.querySelector('meta[name="theme-color"]');
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        function getSavedTheme() {
            try {
                const value = localStorage.getItem('theme');
                return value === 'light' || value === 'dark' ? value : null;
            } catch {
                return null;
            }
        }

        function saveTheme(theme) {
            try {
                localStorage.setItem('theme', theme);
            } catch {
                // The active theme still applies when storage is unavailable.
            }
        }

        function updateThemeColor(theme) {
            if (themeColor) {
                themeColor.setAttribute('content', theme === 'dark' ? '#141414' : '#F8F7F3');
            }
        }

        let currentTheme = getSavedTheme() || (mediaQuery.matches ? 'dark' : 'light');

        // Theme toggle click handler - optimized for instant switching
        function setupThemeToggle() {
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                if (themeToggle.dataset.bound === 'true') {
                    return;
                }
                themeToggle.addEventListener('click', function () {
                    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
                    html.setAttribute('data-theme', currentTheme);
                    saveTheme(currentTheme);
                    updateThemeColor(currentTheme);
                    themeToggle.setAttribute(
                        'aria-label',
                        currentTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
                    );
                });
                themeToggle.dataset.bound = 'true';
                themeToggle.setAttribute(
                    'aria-label',
                    currentTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
                );
            }
        }

        // Listen for system theme changes
        function handleSystemThemeChange(event) {
            if (!getSavedTheme()) {
                currentTheme = event.matches ? 'dark' : 'light';
                html.setAttribute('data-theme', currentTheme);
                updateThemeColor(currentTheme);
            }
        }

        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', handleSystemThemeChange);
        } else if (typeof mediaQuery.addListener === 'function') {
            mediaQuery.addListener(handleSystemThemeChange);
        }

        // Setup toggle immediately and on DOM ready
        setupThemeToggle();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupThemeToggle);
        }
    }

    function initSmartHeaderReveal() {
        const headerShell = document.querySelector('.site-header-shell');
        const headerTrack = document.querySelector('.site-header-track');
        const header = document.querySelector('.site-header');
        if (!headerShell || !headerTrack || !header) return;

        const root = document.documentElement;
        let lastScrollY = window.scrollY;
        let upDistance = 0;
        let downDistance = 0;
        let floating = false;
        let headerSlotHeight = 0;

        function updateHeaderMetrics() {
            headerSlotHeight = Math.ceil(headerTrack.getBoundingClientRect().height);
            const headerBarHeight = Math.ceil(header.getBoundingClientRect().height);

            root.style.setProperty('--header-slot-height', `${headerSlotHeight}px`);
            root.style.setProperty('--header-bar-height', `${headerBarHeight}px`);
        }

        function setFloating(nextState) {
            if (floating === nextState) return;
            floating = nextState;
            headerShell.classList.toggle('is-floating', nextState);

            if (!nextState) {
                headerShell.classList.remove('is-hidden');
            }
        }

        function update() {
            const currentY = window.scrollY;
            const delta = currentY - lastScrollY;
            const activationPoint = headerSlotHeight + 24;

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
                    headerShell.classList.add('is-hidden');
                }
            }

            if (delta > 0) {
                downDistance += delta;
                upDistance = 0;
                if (downDistance > 10) {
                    headerShell.classList.add('is-hidden');
                }
            } else if (delta < 0) {
                upDistance += Math.abs(delta);
                downDistance = 0;
                if (upDistance > 34) {
                    headerShell.classList.remove('is-hidden');
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
            updateHeaderMetrics();
            update();
        }, 120));

        if ('ResizeObserver' in window) {
            const observer = new ResizeObserver(() => {
                updateHeaderMetrics();
                update();
            });
            observer.observe(headerTrack);
        }

        if (document.fonts && typeof document.fonts.ready === 'object') {
            document.fonts.ready.then(() => {
                updateHeaderMetrics();
                update();
            }).catch(() => {
                updateHeaderMetrics();
                update();
            });
        }

        window.addEventListener('load', () => {
            updateHeaderMetrics();
            update();
        }, { once: true });

        headerShell.addEventListener('focusin', () => {
            if (floating) headerShell.classList.remove('is-hidden');
        });

        updateHeaderMetrics();
        update();
    }

    function initCommentThemeSync() {
        const comments = document.querySelector('.comments-section');
        if (!comments) return;

        function syncTheme() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const giscusFrame = comments.querySelector('iframe.giscus-frame');
            const utterancesFrame = comments.querySelector('iframe.utterances-frame');

            giscusFrame?.contentWindow?.postMessage(
                { giscus: { setConfig: { theme: isDark ? 'dark' : 'light' } } },
                'https://giscus.app'
            );
            utterancesFrame?.contentWindow?.postMessage(
                { type: 'set-theme', theme: isDark ? 'github-dark' : 'github-light' },
                'https://utteranc.es'
            );
        }

        const observer = new MutationObserver(syncTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
        observer.observe(comments, { childList: true, subtree: true });
        syncTheme();
    }

    function initCustomNewsletter() {
        const form = document.querySelector('[data-custom-newsletter]');
        if (!form) return;

        const input = form.querySelector('input[name="email"]');
        const button = form.querySelector('button[type="submit"]');
        const message = form.querySelector('[role="status"]');
        if (!input || !button || !message) return;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            button.disabled = true;
            button.textContent = 'Subscribing…';
            message.hidden = true;

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: input.value })
                });

                if (!response.ok) throw new Error(`Subscription failed with status ${response.status}`);

                message.textContent = 'Thanks for subscribing. Check your email to confirm.';
                message.className = 'newsletter-message newsletter-message-success';
                message.hidden = false;
                form.reset();
            } catch (error) {
                console.error('Newsletter subscription failed.', error);
                message.textContent = 'Something went wrong. Please try again.';
                message.className = 'newsletter-message newsletter-message-error';
                message.hidden = false;
            } finally {
                button.disabled = false;
                button.textContent = 'Subscribe';
            }
        });
    }

    // Performance: Initialize everything when DOM is ready
    function init() {
        // Reveal header when scrolling up
        initSmartHeaderReveal();

        // Generate left-edge heading rail navigation
        initReadingRail();

        initCommentThemeSync();
        initCustomNewsletter();

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
