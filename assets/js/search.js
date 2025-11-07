// Simple client-side search functionality
(function() {
    'use strict';
    
    let searchIndex = [];
    let searchModal, searchInput, searchResults, searchClose;
    
    // Simple fuzzy search function
    function fuzzySearch(query, text) {
        if (!query || !text) return false;
        
        query = query.toLowerCase();
        text = text.toLowerCase();
        
        // Direct match gets highest priority
        if (text.includes(query)) return true;
        
        // Fuzzy match - all query chars appear in order
        let queryIndex = 0;
        for (let i = 0; i < text.length && queryIndex < query.length; i++) {
            if (text[i] === query[queryIndex]) {
                queryIndex++;
            }
        }
        return queryIndex === query.length;
    }
    
    // Search function
    function performSearch(query) {
        if (!query || query.length < 2) {
            searchResults.innerHTML = '<div class="search-no-results"><div class="search-no-results-icon">🔍</div><p>Start typing to search posts...</p></div>';
            return;
        }
        
        const results = searchIndex.filter(post => {
            return fuzzySearch(query, post.title) ||
                   fuzzySearch(query, post.description) ||
                   fuzzySearch(query, post.content) ||
                   (post.tags && post.tags.some(tag => fuzzySearch(query, tag))) ||
                   (post.categories && post.categories.some(cat => fuzzySearch(query, cat)));
        });
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results"><div class="search-no-results-icon">😕</div><p>No posts found matching your search.</p></div>';
            return;
        }
        
        searchResults.innerHTML = results.map(post => {
            const tags = post.tags ? post.tags.slice(0, 3).map(tag => 
                `<span class="search-result-tag">${tag}</span>`
            ).join('') : '';
            
            return `
                <a href="${post.permalink}" class="search-result-item">
                    <h3 class="search-result-title">${post.title}</h3>
                    <div class="search-result-meta">${post.date}</div>
                    <p class="search-result-description">${post.description || post.content}</p>
                    ${tags ? `<div class="search-result-tags">${tags}</div>` : ''}
                </a>
            `;
        }).join('');
    }
    
    // Open search modal
    function openSearch() {
        searchModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchInput.focus(), 100);
    }
    
    // Close search modal
    function closeSearch() {
        searchModal.style.display = 'none';
        document.body.style.overflow = '';
        searchInput.value = '';
        searchResults.innerHTML = '';
    }
    
    // Load search index
    function loadSearchIndex() {
        fetch('/index.json')
            .then(response => response.json())
            .then(data => {
                searchIndex = data;
            })
            .catch(error => {
                console.error('Error loading search index:', error);
            });
    }
    
    // Initialize search
    function initSearch() {
        searchModal = document.getElementById('search-modal');
        searchInput = document.getElementById('search-input');
        searchResults = document.getElementById('search-results');
        searchClose = document.getElementById('search-close');
        
        if (!searchModal || !searchInput || !searchResults) return;
        
        // Load search index
        loadSearchIndex();
        
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
        
        // Perform search as user types
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(e.target.value);
            }, 200);
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

