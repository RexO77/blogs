#!/bin/bash
set -euo pipefail

# ─────────────────────────────────────────────
# new-post.sh — Scaffold a new blog post
# Usage: ./new-post.sh "My Article Title"
# ─────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

# ── Validate argument ──────────────────────────────────────────────────────────
if [[ $# -eq 0 ]]; then
  echo "❌  No title provided."
  echo ""
  echo "Usage: ./new-post.sh \"My Article Title\""
  exit 1
fi

TITLE="$*"

# ── Slugify the title ──────────────────────────────────────────────────────────
# Lowercase → replace spaces/underscores with hyphens → strip non-alphanum-hyphen → collapse hyphens
SLUG="$(echo "${TITLE}" \
  | tr '[:upper:]' '[:lower:]' \
  | sed "s/[[:space:]_]\{1,\}/-/g" \
  | sed "s/[^a-z0-9-]//g" \
  | sed "s/-\{2,\}/-/g" \
  | sed "s/^-//;s/-$//")"

if [[ -z "${SLUG}" ]]; then
  echo "❌  Could not generate a valid slug from: \"${TITLE}\""
  echo "    Use letters, numbers, spaces, or hyphens in your title."
  exit 1
fi

# ── Paths ──────────────────────────────────────────────────────────────────────
POST_DIR="content/posts/${SLUG}"
IMAGES_DIR="${POST_DIR}/images"
INDEX_FILE="${POST_DIR}/index.md"

# ── Guard: don't overwrite existing post ──────────────────────────────────────
if [[ -d "${POST_DIR}" ]]; then
  echo "❌  A post already exists at: ${POST_DIR}"
  echo "    Choose a different title or delete the existing folder first."
  exit 1
fi

# ── Get current date in IST (UTC+5:30) ────────────────────────────────────────
# Prefer TZ override; fall back to plain UTC date if TZ isn't available
if TZ="Asia/Kolkata" date --version >/dev/null 2>&1; then
  # GNU date
  POST_DATE="$(TZ="Asia/Kolkata" date '+%Y-%m-%dT%H:%M:%S+05:30')"
else
  # BSD date (macOS)
  POST_DATE="$(TZ="Asia/Kolkata" date '+%Y-%m-%dT%H:%M:%S+05:30' 2>/dev/null \
    || date -u '+%Y-%m-%dT%H:%M:%SZ')"
fi

# ── Create directories ─────────────────────────────────────────────────────────
mkdir -p "${IMAGES_DIR}"

# ── Write index.md ─────────────────────────────────────────────────────────────
cat > "${INDEX_FILE}" <<FRONTMATTER
---
title: "${TITLE}"
date: ${POST_DATE}
draft: true
description: ""
tags: []
categories: []
author: "Nischal Skanda"
slug: "${SLUG}"
---

{{< img src="images/thumbnail.jpg" alt="" caption="" >}}

## Introduction

FRONTMATTER

# ── Done ───────────────────────────────────────────────────────────────────────
echo ""
echo "✅  Post created!"
echo ""
echo "   📁  Folder  →  ${POST_DIR}/"
echo "   📝  File    →  ${INDEX_FILE}"
echo "   🖼   Images  →  ${IMAGES_DIR}/"
echo ""
echo "Next steps:"
echo "   1. Open ${INDEX_FILE} and start writing"
echo "   2. Drop your thumbnail at ${IMAGES_DIR}/thumbnail.jpg"
echo "   3. Run ./dev.sh to preview at http://localhost:1313"
echo ""
