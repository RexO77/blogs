#!/bin/bash

# URL verification script
# Checks that the built files do not contain local development URLs.

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
    echo "✅ No localhost URLs found in the production build"
    echo "💡 Confirm that baseURL in hugo.toml matches your production domain before deploying."
fi
