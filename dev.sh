#!/bin/bash

# Development server script for local development
# This ensures all URLs point to localhost instead of production

echo "🚀 Starting Hugo development server..."
echo "📍 Server will be available at http://localhost:1313/"
echo "🔗 All links will use localhost URLs for proper local development"
echo ""

hugo server \
  --buildDrafts \
  --buildFuture \
  --baseURL="http://localhost:1313" \
  --bind="127.0.0.1" \
  --port=1313

echo "👋 Development server stopped"
