# Writing Guide

## Create a post

```bash
./new-post.sh "Your Article Title"
```

The command creates `content/posts/your-article-title/`, an `images/` folder, and an `index.md` draft. Run `./dev.sh` to preview it at `http://localhost:1313`.

## Front matter

```yaml
---
title: "Your Article Title"
date: 2026-01-01T08:30:00+00:00
draft: true
description: "A concise, reader-focused summary of the post."
tags: ["Topic"]
categories: ["Category"]
author: "" # Optional: leave blank to use the site author in hugo.toml
slug: "your-article-title"
---
```

Set `draft: false` when the post is ready to publish.

## Images

Put a card image at `content/posts/your-slug/images/thumbnail.jpg` (or `.png`/`.webp`). A good default is 1200 × 630 px.

Use the image shortcode inside a post:

```text
{{< img src="images/your-image.jpg" alt="Describe the image" caption="Optional caption" >}}
```

## Before publishing

- Use a descriptive title and summary.
- Add useful alt text to every image.
- Use headings to make longer posts scannable.
- Link to relevant internal or authoritative external sources.
- Set `draft: false`.
- Run `./build.sh` and `./verify-urls.sh`.
