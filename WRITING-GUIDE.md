# Writing Guide

Reference doc for writing posts on IDEA LABS. Keep this open in a tab while writing — it never touches your actual post files.

---

## Starting a New Post

```bash
./new-post.sh "Your Article Title"
```

That's it. Your folder, `images/` subfolder, and `index.md` are created instantly. Then:

1. Drop your thumbnail at `content/posts/your-slug/images/thumbnail.jpg`
2. Run `./dev.sh` to preview at `http://localhost:1313`
3. Write.

---

## Front Matter Fields

```yaml
---
title: "Your Title Here"           # 50-60 characters ideally, main keyword near the front
date: 2025-01-01T08:30:00+05:30    # auto-filled by new-post.sh
draft: true                         # flip to false when ready to publish
description: ""                     # 150-160 characters, include main keyword, make it click-worthy
tags: []                            # 3-5 tags, e.g. ["AI", "Technology", "Career"]
categories: []                      # 1-2 from: Technology, Health, Lifestyle, Business, Career Advice
author: "Nischal Skanda"            # always this
slug: "your-post-slug"              # auto-filled by new-post.sh, URL-safe version of title
---
```

**Optional fields** (add only when relevant):

```yaml
keywords: ["main keyword", "secondary keyword"]   # extra SEO signal, 3-5 terms
series: ["series-name"]                           # if this is part of a multi-post series
```

---

## Thumbnail

- Filename: `thumbnail.jpg` or `thumbnail.png` inside the post's `images/` folder
- The site auto-detects it for the post card on the homepage — no config needed
- Run `./dev.sh` and it will auto-convert to WebP before starting the server
- Recommended size: 1200×630px (good for both cards and social sharing)

---

## Image Shortcode

For images inside the post body:

```
{{< img src="images/your-image.jpg" alt="Descriptive alt text" caption="Optional caption" >}}
```

- `src` — relative to the post folder, always starts with `images/`
- `alt` — describe what's in the image, include a keyword naturally if it fits
- `caption` — optional, supports Markdown (bold, links, etc.)

The shortcode handles responsive sizing and lazy loading automatically.

---

## Infographics Shortcode

For the built-in data visualization charts:

```
{{< infographics items="stats,memory,addiction,platforms" >}}
```

Available items: `stats`, `memory`, `addiction`, `platforms` — mix and match as needed.

---

## Content Structure That Works

A post that reads well and ranks well tends to follow this shape:

```
## Introduction
Hook the reader in the first paragraph. State the problem clearly.
Include your main keyword naturally in the first 100 words.

## [Main Section 1]
First big idea. Use real data, studies, or examples.

### [Subsection]
Break up long sections with H3s for readability.

## [Main Section 2]
Second big idea.

## Takeaways / What To Do
Actionable list. Readers skim to this.

## Conclusion
Recap + one question or CTA to spark comments/shares.
```

---

## SEO Checklist

Run through this before flipping `draft: false`:

- [ ] Title is 50-60 characters and includes the main keyword
- [ ] Description is 150-160 characters and reads like a compelling tweet
- [ ] Main keyword appears in the first 100 words of the post
- [ ] H2/H3 headings include keywords naturally (not stuffed)
- [ ] All images have descriptive `alt` text
- [ ] At least one internal link to another post or your portfolio
- [ ] At least one external link to an authoritative source
- [ ] Post is 1000+ words (1500+ for competitive topics)
- [ ] `draft: false` when ready

---

## Linking to Your Portfolio

These are the natural link spots across your posts:

```markdown
[my portfolio](https://www.nischalskanda.tech)
[my projects](https://www.nischalskanda.tech/#projects)
[connect with me](https://www.nischalskanda.tech/#contact)
[designing digital experiences](https://www.nischalskanda.tech/#projects)
```

Aim for one portfolio link per post — enough to drive traffic, not so many it reads as spam.

---

## Tags & Categories Reference

**Categories** (pick 1-2 per post):
- `Technology`
- `Health`
- `Lifestyle`
- `Business`
- `Career Advice`

**Tag examples by topic:**

| Topic | Tags to use |
|---|---|
| AI / LLMs | `AI`, `Technology`, `Research` |
| Career / Jobs | `Careers`, `Job Market`, `Early Career` |
| Social media | `Social Media`, `Digital Detox`, `Mental Health` |
| Brain / focus | `Brain Health`, `Cognitive Science`, `Product Design` |
| Economics | `Economics`, `Business`, `Research` |

---

## Author Bio

The author bio partial is automatically added to every post. It pulls from `hugo.toml`. No changes needed per post.

---

## Deploying

```bash
# 1. Flip draft: false in your post
# 2. Build
./build.sh

# 3. Push to GitHub — Vercel auto-deploys
git add .
git commit -m "publish: your post title"
git push
```

---

## File & Folder Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Post folder | `snake_case` | `stop_waiting_for_junior_roles` |
| Post slug in front matter | `kebab-case` | `stop-waiting-for-junior-roles` |
| Image files | `lowercase_with_underscores` | `thumbnail.jpg`, `brain_scan.png` |
| Tags | `Title Case` | `"AI"`, `"Career Advice"` |
| Categories | `Title Case` | `"Technology"`, `"Health"` |