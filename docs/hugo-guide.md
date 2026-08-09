# Hugo Reference

This page covers the Hugo concepts used by this template.

## Project structure

```text
content/      articles and metadata
layouts/      page templates and partials
assets/       processed CSS, JavaScript, and profile image
static/       files copied directly to the site
hugo.toml     site and feature configuration
public/       generated site; do not edit or commit
```

An article is a Hugo leaf bundle:

```text
content/posts/article-slug/
├── index.md
└── images/
```

Keeping text and images together makes articles portable.

## Commands

| Task | Command |
| --- | --- |
| Preview drafts | `./dev.sh` |
| Create an article | `./new-post.sh` |
| Production build | `./build.sh` |
| Full validation | `npm run check` |

Prefer these scripts to raw Hugo commands because they represent the actual development and production setup.

## Production build

`./build.sh` runs three steps:

```text
Hugo renders public/
        ↓
Pagefind builds search
        ↓
production URLs are checked
```

Plain `hugo` does not build the Pagefind index. Hosting providers must use `./build.sh`.

## Minification

Production runs:

```bash
hugo --cleanDestinationDir --minify
```

- `--cleanDestinationDir` removes stale generated files.
- `--minify` compresses supported HTML, CSS, JavaScript, JSON, SVG, and XML.

The `[minify]` block in `hugo.toml` controls which formats may be processed. It does not enable minification by itself; the production flag does that.

```toml
[minify]
  disableCSS = false
  disableHTML = false
  disableJS = false
  disableJSON = false
  disableSVG = false
  disableXML = false
```

Advanced options are documented in Hugo’s [minify reference](https://gohugo.io/configuration/minify/).

## Drafts and dates

Production excludes content when:

- `draft` is `true`;
- its publish date is in the future;
- its expiry date is in the past.

`./dev.sh` includes drafts and future content for preview.

## Markdown and images

Raw HTML in Markdown is disabled. Use Markdown or an existing shortcode.

Article images belong inside the article folder. Global files such as the favicon and default social image belong in `static/`.

## Configuration map

| Section | Controls |
| --- | --- |
| `baseURL`, `title` | site URL and identity |
| `[params]` | author, copy, SEO, social links, integrations |
| `[imaging]` | image quality and WebP output |
| `[markup]` | Markdown and code highlighting |
| `[taxonomies]` | tags and categories |
| `[related]` | related-article scoring |
| `[module.hugoVersion]` | minimum Hugo version |

Use `hugo config` to inspect the resolved configuration. The full option list is in the official [Hugo configuration reference](https://gohugo.io/configuration/).

[Documentation](README.md) · [Writing Guide](../WRITING-GUIDE.md)
