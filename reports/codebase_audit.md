# Codebase Audit (2026-02-07)

## Scope
- Hugo site architecture and template/runtime behavior
- SEO/meta correctness and crawlability checks
- Blog content quality baseline using `blog_post_optimizer`

## Health Snapshot
- `hugo` build: passes
- Canonical URLs: present on all generated pages
- Meta descriptions: present on 65 / 116 generated pages
- Sitemap: generated with 63 URLs

## Required (Core Runtime)
- `hugo.toml`
- `layouts/_default/baseof.html`
- `layouts/_default/list.html`
- `layouts/_default/single.html`
- `layouts/partials/head-seo.html`
- `layouts/partials/related-posts.html`
- `layouts/partials/newsletter.html`
- `assets/css/style.css`
- `assets/js/main.js`
- `assets/js/search.js`

## Not Required Right Now (Candidates for Cleanup)
- `assets/js/analytics-test.js` (not referenced in templates/build)
- `assets/css/theme.css` (not referenced in templates/build)
- `layouts/shortcodes/image.html` (unused by current content)
- `layouts/shortcodes/img-enhanced.html` (unused by current content)
- `layouts/_default/index.json` (not emitted by current Hugo outputs; Pagefind is used)

## Content Audit Baseline
- Detailed report: `reports/blog_audit.json`
- Posts analyzed: 12
- Average score: 58/100
- Posts below 60: 5
- Common issues:
  - weak headline optimization
  - inconsistent keyword prominence in first 100 words
  - one very short post (`content/posts/my-first-post.md`)

## Changes Applied in This Pass
- Fixed structured data generation to produce valid JSON-LD with escaped content.
- Removed duplicate `robots` meta output and improved page keyword derivation.
- Switched default social image to an existing asset (`/apple-touch-icon.png`).
- Hardened thumbnail URL handling in list and related-post cards.
- Fixed list template date format typo and paginator variable consistency.
- Cleaned card excerpt rendering by stripping HTML before truncation.
- Made theme-toggle listener idempotent; removed forced reflow calls.
- Added passive scroll handling and rAF gating for reading progress updates.
- Improved search shortcut handling (`Cmd/Ctrl + K`) and modal open/close guards.
- Hardened newsletter rendering when provider config is placeholder/incomplete.
- Fixed SEO checker patterns and sitemap counting logic.
- Ignored Hugo local cache dir in `.gitignore` to reduce workspace noise.
