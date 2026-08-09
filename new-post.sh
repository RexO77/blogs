#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────
# new-post.sh — Scaffold a new blog post
# Usage: ./new-post.sh "My Article Title"
# ─────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

# ── Collect article details ───────────────────────────────────────────────────
DESCRIPTION=""
TAGS_INPUT=""
CATEGORIES_INPUT=""
AUTHOR=""

if [[ $# -eq 0 ]]; then
  if [[ ! -t 0 ]]; then
    echo "❌  No title provided and an interactive terminal is not available."
    echo ""
    echo "Usage: ./new-post.sh \"My Article Title\""
    exit 1
  fi

  echo ""
  echo "Create a new article"
  echo "────────────────────────────────────────"

  while [[ -z "${TITLE:-}" ]]; do
    printf "Title (required): "
    IFS= read -r TITLE
    if [[ -z "${TITLE}" ]]; then
      echo "A title is required."
    fi
  done

  printf "Description (optional): "
  IFS= read -r DESCRIPTION
  printf "Tags, separated by commas (optional): "
  IFS= read -r TAGS_INPUT
  printf "Categories, separated by commas (optional): "
  IFS= read -r CATEGORIES_INPUT
  printf "Author override (optional): "
  IFS= read -r AUTHOR
else
  TITLE="$*"
fi

escape_yaml_string() {
  local value="$1"
  value="${value//\\/\\\\}"
  value="${value//\"/\\\"}"
  printf '%s' "${value}"
}

yaml_array_from_csv() {
  local raw="$1"
  local output=""
  local item
  local escaped_item
  local -a items

  if [[ -z "${raw//[[:space:]]/}" ]]; then
    printf '[]'
    return
  fi

  IFS=',' read -r -a items <<< "${raw}"
  for item in "${items[@]}"; do
    item="$(printf '%s' "${item}" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
    [[ -z "${item}" ]] && continue
    escaped_item="$(escape_yaml_string "${item}")"
    if [[ -n "${output}" ]]; then
      output+=", "
    fi
    output+="\"${escaped_item}\""
  done

  if [[ -z "${output}" ]]; then
    printf '[]'
  else
    printf '[%s]' "${output}"
  fi
}

YAML_TITLE="$(escape_yaml_string "${TITLE}")"
YAML_DESCRIPTION="$(escape_yaml_string "${DESCRIPTION}")"
YAML_AUTHOR="$(escape_yaml_string "${AUTHOR}")"
YAML_TAGS="$(yaml_array_from_csv "${TAGS_INPUT}")"
YAML_CATEGORIES="$(yaml_array_from_csv "${CATEGORIES_INPUT}")"

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

# ── Use a portable, location-neutral publication timestamp ───────────────────
POST_DATE="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

# ── Create directories ─────────────────────────────────────────────────────────
mkdir -p "${IMAGES_DIR}"

# ── Write index.md ─────────────────────────────────────────────────────────────
cat > "${INDEX_FILE}" <<FRONTMATTER
---
title: "${YAML_TITLE}"
date: ${POST_DATE}
draft: true
description: "${YAML_DESCRIPTION}"
tags: ${YAML_TAGS}
categories: ${YAML_CATEGORIES}
author: "${YAML_AUTHOR}"
slug: "${SLUG}"
---

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
echo "   2. Optionally add a thumbnail at ${IMAGES_DIR}/thumbnail.jpg"
echo "   3. Run ./dev.sh to preview at http://localhost:1313"
echo "   4. Set draft: false when the article is ready to publish"
echo ""
