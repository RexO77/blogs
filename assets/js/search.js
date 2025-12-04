// Pagefind search integration
(function () {
    'use strict';

    let pagefind;
    let pagefindLoaded = false;
    let searchModal, searchInput, searchResults, searchClose;

    // Lazy load Pagefind only when needed
    async function ensurePagefind() {
        if (pagefindLoaded) return;

        try {
            pagefind = await import('/pagefind/pagefind.js');
            pagefindLoaded = true;
        } catch (error) {
            console.error('Error loading Pagefind:', error);
            throw error;
        }
    }

    // Perform search with Pagefind
    async function performSearch(query) {
        if (!query || query.length < 2) {
            searchResults.innerHTML = '<div class="search-no-results"><div class="search-no-results-icon">🔍</div><p>Start typing to search posts...</p></div>';
            return;
        }

        // Show loading state immediately
        searchResults.innerHTML = '<div class="search-no-results"><div class="search-no-results-icon">⏳</div><p>Searching...</p></div>';

        try {
            // Ensure Pagefind is loaded
            await ensurePagefind();

            const search = await pagefind.search(query);

            if (search.results.length === 0) {
                searchResults.innerHTML = '<div class="search-no-results"><div class="search-no-results-icon">😕</div><p>No posts found matching your search.</p></div>';
                return;
            }

            // Limit to first 10 results for speed
            const limitedResults = search.results.slice(0, 10);

            // Load data for limited results
            const results = await Promise.all(
                limitedResults.map(r => r.data())
            );

            displayResults(results, search.results.length);
        } catch (error) {
            console.error('Search error:', error);
            searchResults.innerHTML = `<div class="search-no-results"><div class="search-no-results-icon">⚠️</div><p>Unable to load search results. Please check your internet connection or refresh the page and try again.</p>${error && error.message ? `<div class="search-error-details">Error: ${error.message}</div>` : ''}</div>`;
        }
    }

    // Display search results with staggered animation
    function displayResults(results, totalCount) {
        const resultCount = totalCount > results.length
            ? `<div class="search-result-count">Showing ${results.length} of ${totalCount} results</div>`
            : `<div class="search-result-count">${results.length} result${results.length !== 1 ? 's' : ''}</div>`;

        const resultsHtml = results.map((result, index) => {
            // Extract tags from meta if available
            const tags = result.meta.tags ?
                result.meta.tags.slice(0, 3).map(tag =>
                    `<span class="search-result-tag">${tag}</span>`
                ).join('') : '';

            return `
                <a href="${result.url}" class="search-result-item" style="animation-delay: ${index * 0.05}s">
                    <h3 class="search-result-title">${result.meta.title || 'Untitled'}</h3>
                    <div class="search-result-meta">${result.meta.date || ''}</div>
                    <p class="search-result-description">${result.excerpt}</p>
                    ${tags ? `<div class="search-result-tags">${tags}</div>` : ''}
                </a>
            `;
        }).join('');

        searchResults.innerHTML = resultCount + resultsHtml;
    }

    // Open search modal with animation
    function openSearch() {
        searchModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Trigger animation
        requestAnimationFrame(() => {
            searchModal.classList.add('visible');
        });

        setTimeout(() => searchInput.focus(), 150);

        // Preload Pagefind when modal opens (lazy load)
        if (!pagefindLoaded) {
            ensurePagefind().catch(err =>
                console.error('Failed to preload Pagefind:', err)
            );
        }
    }

    // Close search modal with animation
    function closeSearch() {
        searchModal.classList.remove('visible');

        // Wait for animation to complete before hiding
        setTimeout(() => {
            searchModal.style.display = 'none';
            searchInput.value = '';
            searchResults.innerHTML = '<div class="search-no-results"><div class="search-no-results-icon">🔍</div><p>Start typing to search posts...</p></div>';
        }, 450);

        document.body.style.overflow = '';
    }

    // Initialize search
    function initSearch() {
        searchModal = document.getElementById('search-modal');
        searchInput = document.getElementById('search-input');
        searchResults = document.getElementById('search-results');
        searchClose = document.getElementById('search-close');
        const searchTrigger = document.getElementById('search-trigger');

        if (!searchModal || !searchInput || !searchResults) return;

        // Keep the hint showing both shortcuts - works for everyone
        // No need to change it, the HTML already has both ⌘ K and Ctrl K

        // Wire up search trigger button
        if (searchTrigger) {
            searchTrigger.addEventListener('click', openSearch);
        }

        // Event listeners
        searchClose.addEventListener('click', closeSearch);

        // Close on background click
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                closeSearch();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchModal.style.display === 'flex') {
                closeSearch();
            }
            // Open with Cmd/Ctrl + K
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                openSearch();
            }
        });

        // Perform search as user types (reduced debounce for faster response)
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(e.target.value);
            }, 150);
        });

        // Show initial message
        searchResults.innerHTML = '<div class="search-no-results"><div class="search-no-results-icon">🔍</div><p>Start typing to search posts...</p></div>';
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }

})();
