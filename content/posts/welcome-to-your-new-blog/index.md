---
title: "Welcome to Your New Blog"
date: 2026-07-24T09:00:00+05:30
draft: false
description: "A sample article that demonstrates the layout and shows how to turn this starter into your own blog."
tags: ["Getting Started", "Hugo"]
categories: ["Guide"]
slug: "welcome-to-your-new-blog"
---

{{< img src="images/thumbnail.svg" alt="Abstract editorial shapes framing the words Your Ideas Live Here" caption="This sample image demonstrates how post media appears in the article layout." >}}

This is a ready-to-replace sample post. It gives you a real article to explore while you customize the template, so the homepage, search, article typography, tags, and sharing controls do not start empty.

## Make the template yours

Open `hugo.toml` and update the values under **Change these first**:

1. Replace the site title, author name, and description.
2. Set `baseURL` to the domain where the blog will be published.
3. Rewrite the homepage headline and author biography.
4. Add your website and social links—or leave them blank to hide them.

> A useful template gives you enough structure to begin, without deciding what you have to say.

## Create your first post

Run the included helper from the project directory:

```bash
./new-post.sh "The Title of Your Post"
./dev.sh
```

The first command creates a Markdown article and its own image folder. The second starts a local browser preview.

Each post begins with a small block of front matter:

```yaml
---
title: "The Title of Your Post"
draft: true
description: "A short summary for cards and search results."
tags: ["Design", "Ideas"]
---
```

Change `draft` to `false` when the article is ready to publish.

## What this starter already includes

- Responsive post cards and article layouts
- Light and dark themes
- Pagefind-powered search
- SEO metadata, RSS, and a sitemap
- Local fonts and image helpers
- Optional comments and newsletter integrations

Delete this sample folder when your own first article is ready. Until then, it acts as a compact tour of the blog you are building.
