#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${SCRIPT_DIR}"

if [[ ! -d public ]]; then
  echo "❌ public/ does not exist. Run ./build.sh first." >&2
  exit 1
fi

total=0
failures=0

while IFS= read -r -d '' file; do
  total=$((total + 1))

  if ! grep -Eqi '<link[^>]+rel=("canonical"|canonical)([ >])' "${file}"; then
    echo "❌ Missing canonical URL: ${file}"
    failures=$((failures + 1))
  fi

  if grep -Eqi '<meta[^>]+http-equiv=("refresh"|refresh)([ >])' "${file}"; then
    continue
  fi

  if ! grep -Eqi '<meta[^>]+name=("description"|description)([ >])' "${file}"; then
    echo "❌ Missing meta description: ${file}"
    failures=$((failures + 1))
  fi

  while IFS= read -r image_tag; do
    if [[ "${image_tag}" != *" alt="* ]]; then
      echo "❌ Image without alt attribute: ${file}"
      failures=$((failures + 1))
      break
    fi
  done < <(grep -Eio '<img[^>]*>' "${file}" || true)
done < <(find public -type f -name '*.html' -print0)

[[ -f public/sitemap.xml ]] || {
  echo "❌ Missing sitemap.xml"
  failures=$((failures + 1))
}

[[ -f public/robots.txt ]] || {
  echo "❌ Missing robots.txt"
  failures=$((failures + 1))
}

if (( failures > 0 )); then
  echo "❌ SEO validation failed with ${failures} issue(s)." >&2
  exit 1
fi

echo "✅ SEO validation passed for ${total} HTML files"
