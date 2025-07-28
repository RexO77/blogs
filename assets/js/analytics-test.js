// Analytics Test Script
console.log('Analytics test script loaded');

// Check if Vercel Analytics script is loaded
window.addEventListener('load', function() {
    setTimeout(function() {
        if (window.va) {
            console.log('✅ Vercel Analytics is loaded and working');
            console.log('Vercel Analytics object:', window.va);
        } else {
            console.log('❌ Vercel Analytics is not loaded');
        }
    }, 1000);
});

// Test page view tracking
if (typeof window !== 'undefined' && window.va) {
    console.log('Testing page view tracking...');
    window.va('track', { name: 'test-page-view' });
} 