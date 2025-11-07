#!/bin/bash

# URL verification script
# Checks if the built files have the correct production URLs

echo "🔍 Verifying production URLs in built files..."
echo ""

# Check for any localhost URLs in production build (optimized with -q for quiet grep)
if grep -rq "localhost" public/ 2>/dev/null; then
    echo "❌ ERROR: Found localhost URLs in production build!"
    echo "📝 Files containing localhost URLs:"
    grep -r "localhost" public/ 2>/dev/null | head -5
    echo ""
    echo "🛠️  Solution: Run './build.sh' or 'hugo --cleanDestinationDir' to rebuild with production URLs"
    exit 1
else
    echo "✅ All URLs are correct for production deployment"
    echo "🌐 Using production domain: blog.nischalskanda.tech"
    
    # Show a sample of URLs to verify (optimized to extract only needed data)
    echo ""
    echo "📋 Sample URLs found:"
    grep -rh "blog.nischalskanda.tech" public/ 2>/dev/null | grep -o 'https://[^"]*' | head -3
fi
