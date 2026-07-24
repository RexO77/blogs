#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${SCRIPT_DIR}"

bash -n build.sh dev.sh new-post.sh verify-urls.sh scripts/optimize-images.sh scripts/seo-check.sh scripts/check.sh
node --check assets/js/main.js
node --check assets/js/search.js

./build.sh
./scripts/seo-check.sh
node scripts/validate-html.mjs

echo "✅ Source, production build, URLs, and SEO checks passed"
