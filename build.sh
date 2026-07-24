#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

echo "🏗️  Building site for production..."
echo "🌐 Using the baseURL configured in hugo.toml"
echo ""

command -v hugo >/dev/null 2>&1 || {
  echo "❌ Hugo is required. Install Hugo Extended 0.156.0 or newer." >&2
  exit 1
}

if [[ ! -x "node_modules/.bin/pagefind" ]]; then
  echo "❌ Pagefind is not installed. Run 'npm ci' first." >&2
  exit 1
fi

hugo --cleanDestinationDir --minify

echo ""
echo "🔍 Building search index with Pagefind..."
npm run --silent search:index

"${SCRIPT_DIR}/verify-urls.sh"

echo ""
echo "✅ Production build complete!"
echo "📁 Files are ready in ./public/ directory"
echo "🚀 Deploy the ./public/ directory to your hosting provider"
