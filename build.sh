#!/bin/bash

# Production build script

echo "🏗️  Building site for production..."
echo "🌐 Using the baseURL configured in hugo.toml"
echo ""

# Clean and build for production using the configured baseURL
hugo --cleanDestinationDir --minify

# Build Pagefind search index
echo ""
echo "🔍 Building search index with Pagefind..."
npx --yes pagefind@1.5.2 --site public

echo ""
echo "✅ Production build complete!"
echo "📁 Files are ready in ./public/ directory"
echo "🚀 Deploy the ./public/ directory to your hosting provider"
