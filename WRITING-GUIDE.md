# Writing Guide

Each article is a Markdown file with its own image folder.

![Create, write, preview, and publish an article.](docs/assets/article-workflow.svg)

## Create

Use the guided command:

```bash
./new-post.sh
```

Or pass the title directly:

```bash
./new-post.sh "Your Article Title"
```

The result:

```text
content/posts/your-article-title/
├── index.md
└── images/
```

## Write

Article metadata lives at the top of `index.md`:

```yaml
---
title: "Your Article Title"
date: 2026-01-01T08:30:00Z
draft: true
description: "A short, useful summary."
tags: ["Design", "Engineering"]
categories: ["Notes"]
author: ""
slug: "your-article-title"
---
```

| Field | Purpose |
| --- | --- |
| `title` | Article and browser title |
| `date` | Publication date and ordering |
| `draft` | `true` hides the article from production |
| `description` | Cards, search, and social preview copy |
| `tags` | Topic pages and related articles |
| `categories` | Broader grouping |
| `author` | Optional override; blank uses the site author |
| `slug` | Public URL segment |

Write normal Markdown below the front matter.

## Add images

Place images in the article bundle:

```text
images/
├── thumbnail.webp
└── diagram.png
```

`thumbnail.jpg`, `.png`, or `.webp` becomes the article-card image. A useful source size is 1200 × 630.

Use the image shortcode when you need a caption:

```text
{{< img src="images/diagram.png" alt="Describe the image" caption="Optional caption" >}}
```

Standard Markdown images also work:

```markdown
![Describe the image](images/diagram.png)
```

Always include useful alt text.

## Preview and publish

```bash
./dev.sh
```

Drafts and future-dated articles appear at `http://localhost:1313`.

When ready:

1. Set `draft: false`.
2. Run `npm run check`.
3. Review the article locally.
4. Commit and push the article folder.

Changing `slug` changes the public URL. Deleting an article means deleting its entire folder.

## Final check

- Clear title and description
- Useful headings
- Compressed images with alt text
- Relevant tags and categories
- Working links
- `draft: false`
- `npm run check` passes

[Documentation](docs/README.md) · [Hugo Reference](docs/hugo-guide.md)
