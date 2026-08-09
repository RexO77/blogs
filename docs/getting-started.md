# Getting Started

## Requirements

- Git
- Node.js 20 or newer
- Hugo Extended 0.156.0 or newer

Check your versions:

```bash
node --version
hugo version
```

## Install Hugo

### macOS

```bash
brew install hugo
```

### Windows

```powershell
winget install Hugo.Hugo.Extended
```

Chocolatey and Scoop users can install `hugo-extended`.

### Linux

Use an Extended binary from [Hugo Releases](https://github.com/gohugoio/hugo/releases) if your distribution ships an older version.

Confirm that `hugo version` includes `extended`. More options are in the official [installation reference](https://gohugo.io/installation/).

## Run the blog

After creating a repository with **Use this template**:

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
cd YOUR-REPOSITORY
npm ci
./dev.sh
```

Open `http://localhost:1313`. Stop the server with `Ctrl+C`.

## Configure the site

The settings intended for you are grouped near the top of `hugo.toml`.

```toml
baseURL = "https://blog.example.com/"
title = "My Blog"

[params]
  description = "What this blog is about."
  author = "Your Name"
  authorBio = "A short introduction."
  heroHeadline = "A BLOG ABOUT <em>WHAT MATTERS.</em>"
```

Use the final production URL in `baseURL`, including the trailing slash. Hugo uses it for canonical URLs, RSS, sitemap, and social metadata.

Optional settings:

- Add `assets/profile.webp` or `assets/profile.png` for an author photo.
- Fill in `mainSiteURL`, `twitter`, `linkedin`, or `github` to show those links.
- Replace `static/og-default.png` for the default social image.
- Configure comments or newsletters in their existing blocks, then set `enabled = true`.
- Leave analytics, comments, and newsletters disabled when unused.

Blank optional values stay hidden. The production checks reject enabled integrations with missing settings.

## Create the first article

```bash
./new-post.sh
./dev.sh
```

Continue in the [Writing Guide](../WRITING-GUIDE.md).

Remove `content/posts/welcome-to-your-new-blog/` after replacing the sample article.

## Validate

```bash
npm run check
```

This builds the site, creates search, checks URLs and SEO, and validates the generated HTML.

[Documentation](README.md) · [Deployment](deployment.md)
