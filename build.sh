#!/bin/bash

# Production build script
# This builds the site with production URLs for deployment

echo "🏗️  Building site for production..."
echo "🌐 Using production baseURL: https://blog.nischalskanda.tech/"
echo ""

# Clean and build for production with explicit baseURL
hugo --cleanDestinationDir --minify --baseURL="https://blog.nischalskanda.tech/"

# Build Pagefind search index
echo ""
echo "🔍 Building search index with Pagefind..."
npx --yes pagefind@latest --site public

echo ""
echo "✅ Production build complete!"
echo "📁 Files are ready in ./public/ directory"
echo "🚀 Deploy the ./public/ directory to your hosting provider"
