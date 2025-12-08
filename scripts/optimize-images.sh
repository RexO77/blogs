#!/bin/bash

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "Error: cwebp is not installed. Please install 'webp' package."
    echo "  brew install webp"
    exit 1
fi

echo "Starting image optimization..."

# Find all PNG and JPG images in static and content directories
find static content assets -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r img; do
    webp="${img%.*}.webp"
    
    # Check if webp version exists and is newer
    if [ -f "$webp" ] && [ "$webp" -nt "$img" ]; then
        # echo "Skipping $img (WebP exists and is newer)"
        continue
    fi
    
    echo "Converting $img to WebP..."
    cwebp -q 80 "$img" -o "$webp" -quiet
    
    if [ $? -eq 0 ]; then
        orig_size=$(wc -c < "$img")
        webp_size=$(wc -c < "$webp")
        savings=$((orig_size - webp_size))
        
        if [ $savings -gt 0 ]; then
            echo "  Saved $((savings / 1024)) KB"
        else
            echo "  No savings, but WebP created."
        fi
    else
        echo "  Failed to convert $img"
    fi
done

echo "Optimization complete!"
