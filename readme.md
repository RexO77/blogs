# IDEA LABS

A custom-built personal blog exploring AI, technology, cognitive science, and career insights.

**Live Site:** [blog.nischalskanda.tech](https://blog.nischalskanda.tech)

---

## Overview

IDEA LABS is a fully custom Hugo blog designed and developed from scratch—no third-party themes. It features a distinctive visual identity, performance-optimized architecture, and modern UX patterns.

## Features

### Design System

- **Typography:** Satoshi (body) + Unbounded (headings) with optimized font loading
- **Theming:** Light/dark mode with system preference detection and zero FOUC
- **Glassmorphism:** Frosted glass UI elements with backdrop blur effects
- **Responsive:** Mobile-first design with fluid typography and adaptive layouts

### Performance

- **Asset Pipeline:** CSS/JS minification and fingerprinting via Hugo Pipes
- **Image Optimization:** WebP conversion, lazy loading, responsive images
- **Search:** Pagefind integration for fast, client-side full-text search
- **Caching:** Aggressive asset caching (1 year for static assets)

### Content Features

- **Reading Progress:** Animated progress bar with gradient glow
- **Related Posts:** Tag and category-based recommendations
- **Social Sharing:** Twitter and LinkedIn integration
- **Comments:** Giscus (GitHub Discussions) support
- **Newsletter:** Multi-provider support (Mailchimp, ConvertKit, Substack)
- **Categories & Tags:** Full taxonomy system with archive pages

### Technical

- **SEO:** Schema.org markup, Open Graph, Twitter Cards, XML sitemap
- **Analytics:** Vercel Analytics + Google Analytics support
- **Accessibility:** Keyboard navigation, focus states, semantic HTML

## Project Structure

```
├── assets/
│   ├── css/style.css       # Complete design system (~2600 lines)
│   └── js/
│       ├── main.js         # Theme toggle, scroll effects, reading progress
│       └── search.js       # Pagefind search integration
├── content/posts/          # Blog posts (Markdown)
├── layouts/
│   ├── _default/           # Base templates
│   ├── partials/           # Reusable components
│   └── shortcodes/         # Custom image shortcodes
├── static/fonts/           # Satoshi, Unbounded typefaces
└── hugo.toml               # Site configuration
```

## Local Development

```bash
# Install Hugo (extended version required)
brew install hugo

# Start development server
hugo server -D

# Build for production
hugo --minify
```

## Configuration

Key settings in `hugo.toml`:

```toml
[params]
  author = "Nischal Skanda"
  mainSiteURL = "https://www.nischalskanda.tech/"
  
  # Enable/disable features
  [params.comments]
    enabled = true
    system = "giscus"
  
  [params.newsletter]
    enabled = true
    provider = "mailchimp"
```

## Deployment

Deployed on **Vercel** with automatic builds on push. Configuration in `vercel.json` handles routing and caching headers.

## Author

**Nischal Skanda**

- Portfolio: [nischalskanda.tech](https://www.nischalskanda.tech)
- Twitter: [@nischalskanda](https://twitter.com/nischalskanda)
- GitHub: [RexO77](https://github.com/RexO77)

---

Built with [Hugo](https://gohugo.io) • Deployed on [Vercel](https://vercel.com)
