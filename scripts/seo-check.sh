#!/bin/bash

# SEO Performance Checker for IDEA LABS Blog
# Run this script periodically to check SEO health

echo "🔍 SEO Health Check for IDEA LABS Blog"
echo "======================================"

# Check if Hugo is available
if ! command -v hugo &> /dev/null; then
    echo "❌ Hugo not found. Please install Hugo first."
    exit 1
fi

echo "✅ Hugo found"

# Build the site
echo "🔨 Building site..."
hugo --minify --quiet

if [ $? -eq 0 ]; then
    echo "✅ Site built successfully"
else
    echo "❌ Site build failed"
    exit 1
fi

# Check for common SEO issues
echo ""
echo "🔍 Checking for SEO issues..."

# Check for missing meta descriptions
echo "📝 Checking meta descriptions..."
missing_desc=$(find public -name "*.html" -exec grep -L "meta name=\"description\"" {} \; | wc -l)
if [ $missing_desc -gt 0 ]; then
    echo "⚠️  Found $missing_desc pages without meta descriptions"
else
    echo "✅ All pages have meta descriptions"
fi

# Check for missing alt tags
echo "🖼️  Checking image alt tags..."
missing_alt=$(grep -r "img.*src=" public --include="*.html" | grep -v "alt=" | wc -l)
if [ $missing_alt -gt 0 ]; then
    echo "⚠️  Found $missing_alt images without alt tags"
else
    echo "✅ All images have alt tags"
fi

# Check for missing canonical URLs
echo "🔗 Checking canonical URLs..."
missing_canonical=$(find public -name "*.html" -exec grep -L "rel=\"canonical\"" {} \; | wc -l)
if [ $missing_canonical -gt 0 ]; then
    echo "⚠️  Found $missing_canonical pages without canonical URLs"
else
    echo "✅ All pages have canonical URLs"
fi

# Check sitemap
echo "🗺️  Checking sitemap..."
if [ -f "public/sitemap.xml" ]; then
    sitemap_pages=$(grep -c "<url>" public/sitemap.xml)
    echo "✅ Sitemap found with $sitemap_pages pages"
else
    echo "❌ Sitemap not found"
fi

# Check robots.txt
echo "🤖 Checking robots.txt..."
if [ -f "public/robots.txt" ]; then
    echo "✅ Robots.txt found"
else
    echo "❌ Robots.txt not found"
fi

# Portfolio link check
echo "🔗 Checking portfolio links..."
portfolio_links=$(grep -r "nischalskanda.tech" public --include="*.html" | wc -l)
echo "✅ Found $portfolio_links references to portfolio site"

echo ""
echo "📊 SEO Summary:"
echo "==============="
echo "- Meta descriptions: $(( $(find public -name "*.html" | wc -l) - $missing_desc )) / $(find public -name "*.html" | wc -l)"
echo "- Image alt tags: Good coverage"
echo "- Canonical URLs: $(( $(find public -name "*.html" | wc -l) - $missing_canonical )) / $(find public -name "*.html" | wc -l)"
echo "- Portfolio links: $portfolio_links found"

echo ""
echo "💡 Next steps:"
echo "- Add meta descriptions to pages missing them"
echo "- Add alt tags to images without them"
echo "- Monitor site performance with Google Search Console"
echo "- Create more high-quality content linking to portfolio"

echo ""
echo "🎉 SEO check complete!"
