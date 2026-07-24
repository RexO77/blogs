#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

if [[ ! -d public ]]; then
    echo "❌ public/ does not exist. Run ./build.sh first." >&2
    exit 1
fi

echo "🔍 Verifying production URLs in built files..."
echo ""

local_matches="$(grep -RIlE \
    --include='*.html' --include='*.xml' --include='*.json' --include='*.txt' \
    'https?://(localhost|127\.0\.0\.1)(:[0-9]+)?' public 2>/dev/null || true)"
if [[ -n "${local_matches}" ]]; then
    echo "❌ Found local development URLs in the production build:"
    printf '%s\n' "${local_matches}" | sed -n '1,10p'
    exit 1
fi

placeholder_matches="$(grep -RIl \
    --include='*.html' --include='*.xml' --include='*.json' --include='*.txt' \
    'https://example.com' public 2>/dev/null || true)"
if [[ -n "${placeholder_matches}" ]]; then
    echo "❌ Found placeholder production URLs in the production build:"
    printf '%s\n' "${placeholder_matches}" | sed -n '1,10p'
    echo ""
    echo "Set baseURL in hugo.toml to the deployment domain."
    exit 1
fi

echo "✅ Production URLs are free of localhost and placeholder domains"
