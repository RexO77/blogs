#!/bin/bash

# Enhanced Build Script for Production Deployment
# Senior Frontend Developer Optimizations

set -e  # Exit on any error

echo "🚀 Starting enhanced production build..."

# Color codes for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Hugo is installed
if ! command -v hugo &> /dev/null; then
    print_error "Hugo is not installed. Please install Hugo first."
    exit 1
fi

# Get Hugo version
HUGO_VERSION=$(hugo version)
print_status "Using $HUGO_VERSION"

# Clean previous build
print_status "Cleaning previous build..."
rm -rf public/
rm -rf resources/_gen/ 2>/dev/null || true
print_success "Build directory cleaned"

# Validate content before building
print_status "Validating content..."
if hugo --quiet --buildDrafts=false --buildFuture=false --renderToMemory; then
    print_success "Content validation passed"
else
    print_error "Content validation failed"
    exit 1
fi

# Run Hugo build with optimizations
print_status "Building site with Hugo optimizations..."

# Check if we're in a CI environment (like Vercel)
if [ -n "$CI" ] || [ -n "$VERCEL" ]; then
    print_status "Detected CI/Vercel environment - using optimized build"
    hugo \
      --minify \
      --gc \
      --cleanDestinationDir \
      --baseURL="https://blog.nischalskanda.tech/"
else
    print_status "Local development build"
    hugo \
      --minify \
      --gc \
      --cleanDestinationDir \
      --enableGitInfo \
      --templateMetrics \
      --templateMetricsHints \
      --printMemoryUsage \
      --printPathWarnings \
      --printUnusedTemplates \
      --baseURL="https://blog.nischalskanda.tech/"
fi

# Check build success
if [ $? -eq 0 ]; then
    print_success "Hugo build completed successfully"
else
    print_error "Hugo build failed"
    exit 1
fi

# Post-build optimizations
print_status "Running post-build optimizations..."

# Count generated files
FILE_COUNT=$(find public/ -type f | wc -l)
print_status "Generated $FILE_COUNT files"

# Calculate total size
TOTAL_SIZE=$(du -sh public/ | cut -f1)
print_status "Total build size: $TOTAL_SIZE"

# Check for large files that might need optimization
print_status "Checking for large files..."
LARGE_FILES=$(find public/ -type f -size +1M 2>/dev/null || true)
if [ ! -z "$LARGE_FILES" ]; then
    print_warning "Large files detected (>1MB):"
    echo "$LARGE_FILES" | while read file; do
        if [ ! -z "$file" ]; then
            size=$(du -h "$file" | cut -f1)
            echo "  - $file ($size)"
        fi
    done
else
    print_success "No unusually large files detected"
fi

# Validate critical files exist
print_status "Validating critical files..."
CRITICAL_FILES=("public/index.html" "public/sitemap.xml" "public/robots.txt")
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "$(basename "$file") exists"
    else
        print_error "Critical file missing: $file"
        exit 1
    fi
done

# Performance hints
print_status "Performance optimization summary:"
echo "  📦 CSS files: $(find public/ -name "*.css" 2>/dev/null | wc -l)"
echo "  📜 JS files: $(find public/ -name "*.js" 2>/dev/null | wc -l)"
echo "  🖼️  Images: $(find public/ \( -name "*.jpg" -o -name "*.png" -o -name "*.webp" -o -name "*.avif" \) 2>/dev/null | wc -l)"
echo "  📄 HTML files: $(find public/ -name "*.html" 2>/dev/null | wc -l)"

# Final success message
print_success "🎉 Enhanced production build completed successfully!"
echo ""
echo "📊 Build Summary:"
echo "  📁 Output directory: ./public/"
echo "  🌐 Base URL: https://blog.nischalskanda.tech/"
echo "  📈 Total files: $FILE_COUNT"
echo "  💾 Total size: $TOTAL_SIZE"
echo "  ⏱️  Build completed at: $(date)"
echo ""
echo "🚀 Ready for deployment!"
