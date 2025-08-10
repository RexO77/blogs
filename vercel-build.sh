#!/bin/bash

# Vercel-Optimized Build Script
# Specifically designed for Vercel's build environment

set -e  # Exit on any error

echo "🚀 Starting Vercel-optimized build..."

# Color codes for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[VERCEL BUILD] $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vercel environment detection
if [ -n "$VERCEL" ]; then
    print_status "Running in Vercel environment"
    print_status "Vercel URL: ${VERCEL_URL:-'not set'}"
    print_status "Vercel Region: ${VERCEL_REGION:-'not set'}"
else
    print_status "Running outside Vercel (local build)"
fi

# Hugo version check
if command -v hugo &> /dev/null; then
    HUGO_VERSION=$(hugo version)
    print_status "$HUGO_VERSION"
else
    print_error "Hugo not found!"
    exit 1
fi

# Clean previous build (Vercel starts fresh, but just in case)
print_status "Cleaning build directory..."
rm -rf public/
rm -rf resources/_gen/ 2>/dev/null || true

# Validate content
print_status "Validating Hugo content..."
if hugo --quiet --buildDrafts=false --buildFuture=false --renderToMemory; then
    print_success "Content validation passed"
else
    print_error "Content validation failed"
    exit 1
fi

# Vercel-optimized Hugo build
print_status "Building with Vercel optimizations..."
hugo \
  --minify \
  --gc \
  --cleanDestinationDir \
  --environment production \
  --baseURL="https://blog.nischalskanda.tech/"

# Verify build success
if [ $? -eq 0 ]; then
    print_success "Hugo build completed successfully"
else
    print_error "Hugo build failed"
    exit 1
fi

# Post-build optimizations for Vercel
print_status "Running Vercel-specific optimizations..."

# Verify critical files exist
CRITICAL_FILES=("public/index.html" "public/sitemap.xml")
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "$(basename "$file") ✓"
    else
        print_error "Missing critical file: $file"
        exit 1
    fi
done

# Get build stats
FILE_COUNT=$(find public/ -type f 2>/dev/null | wc -l)
TOTAL_SIZE=$(du -sh public/ 2>/dev/null | cut -f1 || echo "unknown")

# Performance summary
print_status "Build Summary:"
echo "  📁 Files: $FILE_COUNT"
echo "  💾 Size: $TOTAL_SIZE"
echo "  🌐 URL: https://blog.nischalskanda.tech/"

print_success "🎉 Vercel build completed successfully!"
print_status "Ready for deployment to Vercel Edge Network"
