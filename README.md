# Hugo Blog Template

A clean, deployable Hugo blog starter with responsive post cards, light and dark themes, local fonts, Pagefind search, SEO metadata, RSS, related posts, image shortcodes, and optional comments and newsletter support.

This repository intentionally ships with **no posts, personal images, author details, branding, or analytics identifiers**. Clone it, personalize the configuration, and start writing.

## Quick start

```bash
git clone https://github.com/your-account/your-blog.git
cd your-blog
./dev.sh
```

Open `http://localhost:1313`. The development script uses a local URL automatically and includes draft posts.

### Requirements

- [Hugo extended](https://gohugo.io/installation/) (version 0.148 or newer)
- Node.js 18 or newer (only required for the production search index)
- Optional: `cwebp` from `brew install webp` for automatic WebP image optimization

## Personalize in five minutes

Open [`hugo.toml`](hugo.toml) and replace the values under **“Change these first”**:

1. Set `baseURL` to your production domain.
2. Change `title`, `author`, `description`, `keywords`, and metadata.
3. Set `heroHeadline` and `authorBio`.
4. Add your website and social-profile URLs only if you want to show them.
5. Add `assets/profile.png` or `assets/profile.webp` if you want an author photo. It is optional.

The default settings deliberately disable analytics, comments, and newsletters. Configure and enable them only after adding your own provider IDs and URLs.

## Write and preview a post

```bash
./new-post.sh "My First Post"
./dev.sh
```

This creates a draft at `content/posts/my-first-post/index.md` with a dedicated `images/` directory. See [WRITING-GUIDE.md](WRITING-GUIDE.md) for front matter, images, and publishing checks.

## Build and deploy

```bash
./build.sh
./verify-urls.sh
```

`build.sh` creates the optimized Hugo site and Pagefind search index in `public/`. The included [`vercel.json`](vercel.json) runs the same production build on Vercel, but the generated `public/` directory can be deployed to any static host.

Before deploying, make sure `baseURL` in `hugo.toml` is your real production URL.

## Project structure

```text
assets/                 CSS, JavaScript, and optional author photo
content/posts/          Your Markdown post bundles (starts empty)
archetypes/             New-post front-matter defaults
layouts/                Hugo templates, partials, and shortcodes
scripts/                Image optimization and SEO checks
static/                 Fonts, generic favicon, and web manifest
```

## License

See [LICENSE](LICENSE). Confirm you have the rights to every post, image, font, and brand asset you add before publishing.
