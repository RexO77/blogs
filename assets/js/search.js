(function () {
    'use strict';

    const MIN_QUERY_LENGTH = 2;
    const RESULT_LIMIT = 10;
    const SEARCH_DEBOUNCE_MS = 150;
    const CLOSE_DURATION_MS = 160;
    const focusableSelector = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'textarea:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    let pagefindModule;
    let pagefindPromise;
    let closeTimer;
    let searchTimer;
    let requestGeneration = 0;
    let lastFocusedElement;
    let previousBodyOverflow = '';

    const elements = {};

    function createElement(tagName, className, text) {
        const element = document.createElement(tagName);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    }

    function renderSearchState(title, copy, variant, detail) {
        const state = createElement('div', `search-state${variant ? ` is-${variant}` : ''}`);
        state.appendChild(createElement('p', 'search-state-title', title));

        if (copy) {
            state.appendChild(createElement('p', 'search-state-copy', copy));
        }

        if (detail) {
            state.appendChild(createElement('div', 'search-state-meta', detail));
        }

        elements.results.replaceChildren(state);
    }

    function appendSafeExcerpt(container, excerpt) {
        const parsed = new DOMParser().parseFromString(String(excerpt || ''), 'text/html');

        function appendNode(node, destination) {
            if (node.nodeType === Node.TEXT_NODE) {
                destination.appendChild(document.createTextNode(node.textContent || ''));
                return;
            }

            if (node.nodeType !== Node.ELEMENT_NODE) return;

            if (node.tagName === 'MARK') {
                const mark = document.createElement('mark');
                Array.from(node.childNodes).forEach((child) => appendNode(child, mark));
                destination.appendChild(mark);
                return;
            }

            Array.from(node.childNodes).forEach((child) => appendNode(child, destination));
        }

        Array.from(parsed.body.childNodes).forEach((node) => appendNode(node, container));
    }

    function normalizeResultUrl(value) {
        try {
            const url = new URL(value, window.location.origin);
            return url.origin === window.location.origin ? `${url.pathname}${url.search}${url.hash}` : '#';
        } catch {
            return '#';
        }
    }

    function displayResults(results, totalCount) {
        const fragment = document.createDocumentFragment();
        const countText = totalCount > results.length
            ? `Showing ${results.length} of ${totalCount} results`
            : `${results.length} result${results.length === 1 ? '' : 's'}`;
        fragment.appendChild(createElement('div', 'search-result-count', countText));

        results.forEach((result) => {
            const item = createElement('a', 'search-result-item');
            item.href = normalizeResultUrl(result.url);
            item.appendChild(createElement('h3', 'search-result-title', result.meta?.title || 'Untitled'));

            if (result.meta?.date) {
                item.appendChild(createElement('div', 'search-result-meta', result.meta.date));
            }

            const description = createElement('p', 'search-result-description');
            appendSafeExcerpt(description, result.excerpt);
            item.appendChild(description);

            const tags = Array.isArray(result.meta?.tags) ? result.meta.tags.slice(0, 3) : [];
            if (tags.length > 0) {
                const tagList = createElement('div', 'search-result-tags');
                tags.forEach((tag) => tagList.appendChild(createElement('span', 'search-result-tag', String(tag))));
                item.appendChild(tagList);
            }

            fragment.appendChild(item);
        });

        elements.results.replaceChildren(fragment);
    }

    async function ensurePagefind() {
        if (pagefindModule) return pagefindModule;

        if (!pagefindPromise) {
            const moduleUrl = elements.modal.dataset.pagefindUrl;
            pagefindPromise = import(moduleUrl)
                .then((module) => {
                    pagefindModule = module;
                    return module;
                })
                .catch((error) => {
                    pagefindPromise = undefined;
                    throw error;
                });
        }

        return pagefindPromise;
    }

    async function performSearch(rawQuery) {
        const query = rawQuery.trim();
        const generation = ++requestGeneration;

        if (query.length < MIN_QUERY_LENGTH) {
            renderSearchState('Type at least 2 letters', 'Search by title, topic, or phrase.', 'empty');
            return;
        }

        renderSearchState('Searching…', 'Looking through all posts now.', 'loading');

        try {
            const pagefind = await ensurePagefind();
            const search = await pagefind.search(query);
            if (generation !== requestGeneration) return;

            if (search.results.length === 0) {
                renderSearchState('No posts found', 'Try a broader keyword or a different phrase.', 'empty');
                return;
            }

            const resultData = await Promise.all(
                search.results.slice(0, RESULT_LIMIT).map((result) => result.data())
            );
            if (generation !== requestGeneration) return;

            displayResults(resultData, search.results.length);
        } catch (error) {
            if (generation !== requestGeneration) return;
            console.error('Search failed to load.', error);
            renderSearchState('Search is unavailable', 'Refresh the page and try again.', 'error');
        }
    }

    function setBackgroundInert(isInert) {
        [elements.skipLink, elements.header, elements.main].forEach((element) => {
            if (!element) return;
            element.inert = isInert;
            if (isInert) {
                element.setAttribute('aria-hidden', 'true');
            } else {
                element.removeAttribute('aria-hidden');
            }
        });
    }

    function openSearch({ instant = false } = {}) {
        if (closeTimer) {
            window.clearTimeout(closeTimer);
            closeTimer = undefined;
        }

        if (!elements.modal.hidden && elements.modal.classList.contains('visible')) return;

        if (elements.modal.hidden || !elements.modal.contains(document.activeElement)) {
            lastFocusedElement = document.activeElement;
        }
        previousBodyOverflow = document.body.style.overflow;
        elements.modal.classList.toggle('is-instant', instant);
        elements.modal.hidden = false;
        elements.modal.setAttribute('aria-hidden', 'false');
        elements.trigger?.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        setBackgroundInert(true);

        const reveal = () => {
            elements.modal.classList.add('visible');
            elements.input.focus({ preventScroll: true });
        };

        if (instant) {
            reveal();
            requestAnimationFrame(() => {
                requestAnimationFrame(() => elements.modal.classList.remove('is-instant'));
            });
        } else {
            requestAnimationFrame(reveal);
        }

        ensurePagefind().catch((error) => {
            console.error('Search index preload failed.', error);
        });
    }

    function closeSearch({ restoreFocus = true } = {}) {
        if (elements.modal.hidden) return;

        elements.modal.classList.remove('visible', 'is-instant');
        elements.trigger?.setAttribute('aria-expanded', 'false');
        requestGeneration += 1;
        window.clearTimeout(searchTimer);
        document.body.style.overflow = previousBodyOverflow;
        setBackgroundInert(false);

        if (restoreFocus && lastFocusedElement instanceof HTMLElement && lastFocusedElement.isConnected) {
            lastFocusedElement.focus();
        }
        elements.modal.setAttribute('aria-hidden', 'true');

        closeTimer = window.setTimeout(() => {
            elements.modal.hidden = true;
            elements.input.value = '';
            renderSearchState('Type at least 2 letters', 'Search by title, topic, or phrase.', 'empty');
            closeTimer = undefined;
        }, CLOSE_DURATION_MS);
    }

    function trapFocus(event) {
        if (event.key !== 'Tab' || elements.modal.hidden) return;

        const focusable = Array.from(elements.modal.querySelectorAll(focusableSelector))
            .filter((element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true');
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function initialize() {
        elements.modal = document.getElementById('search-modal');
        elements.input = document.getElementById('search-input');
        elements.results = document.getElementById('search-results');
        elements.close = document.getElementById('search-close');
        elements.trigger = document.getElementById('search-trigger');
        elements.skipLink = document.querySelector('.skip-link');
        elements.header = document.querySelector('.site-header-shell');
        elements.main = document.getElementById('main-content');

        if (!elements.modal || !elements.input || !elements.results || !elements.close) return;

        elements.modal.setAttribute('aria-hidden', 'true');
        elements.trigger?.addEventListener('click', () => openSearch());
        elements.close.addEventListener('click', () => closeSearch());
        elements.modal.addEventListener('keydown', trapFocus);
        elements.modal.addEventListener('click', (event) => {
            if (event.target === elements.modal) closeSearch();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !elements.modal.hidden) {
                closeSearch();
                return;
            }

            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                openSearch({ instant: true });
            }
        });

        elements.input.addEventListener('input', (event) => {
            window.clearTimeout(searchTimer);
            searchTimer = window.setTimeout(
                () => performSearch(event.target.value),
                SEARCH_DEBOUNCE_MS
            );
        });

        renderSearchState('Type at least 2 letters', 'Search by title, topic, or phrase.', 'empty');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
})();
