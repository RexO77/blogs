#!/bin/bash

# Enhanced Development Server Script
# Optimized for local development with hot reloading

set -e  # Exit on any error

echo "🚀 Starting Hugo development server..."
echo "📍 Server will be available at http://localhost:1313/"
echo "🔗 All links will use localhost URLs for proper local development"
echo "🔥 Hot reloading enabled for instant updates"
echo ""

# Clean any previous build artifacts for fresh start
echo "🧹 Cleaning previous build artifacts..."
rm -rf public/ 2>/dev/null || true
rm -rf resources/_gen/ 2>/dev/null || true

echo "🔧 Starting development server with enhanced features..."

# Start Hugo development server with optimized settings
hugo server \
  --buildDrafts \
  --buildFuture \
  --buildExpired \
  --baseURL="http://localhost:1313" \
  --bind="127.0.0.1" \
  --port=1313 \
  --navigateToChanged \
  --watch \
  --livereload \
  --disableFastRender=false \
  --gc \
  --cleanDestinationDir

echo ""
echo "👋 Development server stopped"
