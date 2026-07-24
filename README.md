# Hugo Blog Template

A clean, deployable Hugo blog starter with responsive post cards, light and dark themes, local fonts, Pagefind search, SEO metadata, RSS, related posts, image helpers, and optional comments and newsletter support.

The repository ships with one clearly labeled sample article so the homepage, search, article layout, tags, and sharing controls can be evaluated before real content is added. It contains no personal author details or analytics identifiers.

## Quick start

```bash
git clone https://github.com/your-account/your-blog.git
cd your-blog
npm ci
./dev.sh
```

Open `http://localhost:1313`. The development script uses a local URL automatically and includes draft posts.

### Requirements

- [Hugo extended](https://gohugo.io/installation/) (version 0.156 or newer)
- Node.js 20 or newer
- Optional: `cwebp` from `brew install webp` for automatic WebP image optimization

## Personalize in five minutes

Open [`hugo.toml`](hugo.toml) and replace the values under **“Change these first”**:

1. Set `baseURL` to your production domain (the demo uses `https://blog.nischal.fyi/`).
2. Change `title`, `author`, `description`, and social metadata.
3. Set `heroHeadline` and `authorBio`.
4. Add your website and social-profile URLs only if you want to show them.
5. Add `assets/profile.png` or `assets/profile.webp` if you want an author photo. It is optional.

The default settings deliberately disable analytics, comments, and newsletters. Configure and enable them only after adding your own provider IDs and URLs.

When your first real article is ready, delete `content/posts/welcome-to-your-new-blog/`.

## Write and preview a post

```bash
./new-post.sh "My First Post"
./dev.sh
```

This creates a draft at `content/posts/my-first-post/index.md` with a dedicated `images/` directory. See [WRITING-GUIDE.md](WRITING-GUIDE.md) for front matter, images, and publishing checks.

## Build and deploy

```bash
npm run check
```

`build.sh` creates the optimized Hugo site and pinned Pagefind search index in `public/`, then rejects localhost and placeholder production URLs. `scripts/check.sh` also validates shell and JavaScript syntax plus essential SEO output.

The included [`vercel.json`](vercel.json) runs the same locked build on Vercel and adds conservative security and caching headers. The generated `public/` directory can also be deployed to any static host.

Before deploying, make sure `baseURL` in `hugo.toml` is your real production URL.

## Project structure

```text
assets/                 CSS, JavaScript, and optional author photo
content/posts/          Markdown post bundles and the removable sample article
archetypes/             New-post front-matter defaults
layouts/                Hugo templates, partials, and shortcodes
scripts/                Image optimization and SEO checks
static/                 Local fonts and generic social/favicon assets
package.json            Locked Pagefind dependency and repeatable npm scripts
```

## Quality gates

Pull requests and pushes to `main` run the same production checks in GitHub Actions. A deployment fails when Hugo cannot render content, an image shortcode points to a missing resource, an enabled integration is incomplete, or the generated site contains local/placeholder URLs.

## License

See [LICENSE](LICENSE). Confirm you have the rights to every post, image, font, and brand asset you add before publishing.
