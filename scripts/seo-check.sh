#!/bin/bash

# SEO Performance Checker
# Run this script periodically to check SEO health

echo "🔍 SEO Health Check"
echo "======================================"

# Check if Hugo is available
if ! command -v hugo &> /dev/null; then
    echo "❌ Hugo not found. Please install Hugo first."
    exit 1
fi

echo "✅ Hugo found"

# Check if public directory exists, otherwise build
if [ ! -d "public" ]; then
    echo "🔨 Building site..."
    hugo --minify --quiet
    
    if [ $? -ne 0 ]; then
        echo "❌ Site build failed"
        exit 1
    fi
    echo "✅ Site built successfully"
else
    echo "ℹ️  Using existing public directory (run './build.sh' to rebuild)"
fi

# Check for common SEO issues
echo ""
echo "🔍 Checking for SEO issues..."

# Count total HTML files once for efficiency
total_html=$(find public -name "*.html" -type f | wc -l | tr -d ' ')

# Check for missing meta descriptions (optimized with single pass)
echo "📝 Checking meta descriptions..."
missing_desc=$(find public -name "*.html" -type f -print0 | xargs -0 grep -LE 'name=("description"|'\'description\'\''|description)' | wc -l | tr -d ' ')
if [ $missing_desc -gt 0 ]; then
    echo "⚠️  Found $missing_desc pages without meta descriptions"
else
    echo "✅ All pages have meta descriptions"
fi

# Check for missing alt tags (optimized to find all img tags first, then check for alt)
echo "🖼️  Checking image alt tags..."
missing_alt=$(grep -roh '<img[^>]*>' public --include="*.html" | grep -cvi 'alt=')
if [ $missing_alt -gt 0 ]; then
    echo "⚠️  Found $missing_alt images without alt tags"
else
    echo "✅ All images have alt tags"
fi

# Check for missing canonical URLs (optimized with single pass)
echo "🔗 Checking canonical URLs..."
missing_canonical=$(find public -name "*.html" -type f -print0 | xargs -0 grep -LE 'rel=("canonical"|'\'canonical\'\''|canonical)' | wc -l | tr -d ' ')
if [ $missing_canonical -gt 0 ]; then
    echo "⚠️  Found $missing_canonical pages without canonical URLs"
else
    echo "✅ All pages have canonical URLs"
fi

# Check sitemap (optimized with -f for file test)
echo "🗺️  Checking sitemap..."
if [ -f "public/sitemap.xml" ]; then
    sitemap_pages=$(grep -o "<url>" public/sitemap.xml | wc -l | tr -d ' ')
    echo "✅ Sitemap found with $sitemap_pages pages"
else
    echo "❌ Sitemap not found"
fi

# Check robots.txt (optimized with -f for file test)
echo "🤖 Checking robots.txt..."
if [ -f "public/robots.txt" ]; then
    echo "✅ Robots.txt found"
else
    echo "❌ Robots.txt not found"
fi

echo ""
echo "📊 SEO Summary:"
echo "==============="
echo "- Meta descriptions: $(( total_html - missing_desc )) / $total_html"
if [ $missing_alt -eq 0 ]; then
    echo "- Image alt tags: Good coverage"
else
    echo "- Image alt tags: Issues found ($missing_alt missing)"
fi
echo "- Canonical URLs: $(( total_html - missing_canonical )) / $total_html"

echo ""
echo "💡 Next steps:"
echo "- Add meta descriptions to pages missing them"
echo "- Add alt tags to images without them"
echo "- Monitor site performance with Google Search Console"
echo "- Add internal links between related posts"

echo ""
echo "🎉 SEO check complete!"
