#!/bin/bash

# URL verification script
# Checks if the built files have the correct production URLs

echo "🔍 Verifying production URLs in built files..."
echo ""

# Check for any localhost URLs in production build
LOCALHOST_COUNT=$(grep -r "localhost" public/ 2>/dev/null | wc -l)

if [ $LOCALHOST_COUNT -gt 0 ]; then
    echo "❌ ERROR: Found localhost URLs in production build!"
    echo "📝 Files containing localhost URLs:"
    grep -r "localhost" public/ | head -5
    echo ""
    echo "🛠️  Solution: Run './build.sh' or 'hugo --cleanDestinationDir' to rebuild with production URLs"
    exit 1
else
    echo "✅ All URLs are correct for production deployment"
    echo "🌐 Using production domain: blog.nischalskanda.tech"
    
    # Show a sample of URLs to verify
    echo ""
    echo "📋 Sample URLs found:"
    grep -r "blog.nischalskanda.tech" public/ | head -3 | sed 's/.*href="//g' | sed 's/".*//g'
fi
