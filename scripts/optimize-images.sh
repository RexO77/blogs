#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${SCRIPT_DIR}"

if ! command -v cwebp >/dev/null 2>&1; then
    echo "Error: cwebp is not installed. Please install 'webp' package."
    echo "  brew install webp"
    exit 1
fi

echo "Starting image optimization..."

while IFS= read -r -d '' img; do
    webp="${img%.*}.webp"

    if [[ -f "${webp}" && "${webp}" -nt "${img}" ]]; then
        continue
    fi

    temporary="${webp}.tmp.$$"
    trap 'rm -f "${temporary:-}"' EXIT

    echo "Converting $img to WebP..."
    cwebp -quiet -q 80 "${img}" -o "${temporary}"

    original_size="$(wc -c < "${img}" | tr -d ' ')"
    webp_size="$(wc -c < "${temporary}" | tr -d ' ')"

    if (( webp_size < original_size )); then
        mv "${temporary}" "${webp}"
        echo "  Saved $(((original_size - webp_size) / 1024)) KB"
    else
        rm -f "${temporary}"
        echo "  Skipped: WebP was not smaller."
    fi
    trap - EXIT
done < <(find static content assets -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0)

echo "Optimization complete!"
