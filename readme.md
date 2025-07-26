# IDEA LAB – Hugo Blog

A modern, minimal, and customizable blog built with [Hugo](https://gohugo.io/). This project is set up for rapid content publishing and easy design customization, inspired by clean, interactive web aesthetics.

## Features
- **No external theme**: All templates and styles are custom, found in the `layouts` and `static` folders.
- **Modern, bold homepage**: Custom hero headline with interactive elements (CSS-based, easily swappable for 3D/SVG).
- **Pagination**: Configurable via `hugo.toml`.
- **Easy content management**: Write posts in Markdown under `content/posts/`.
- **Google Fonts**: Uses Unbounded and Inter for a unique look.

## Project Structure

```
blog.nischalskanda.tech/
├── archetypes/
│   └── default.md         # Archetype for new posts
├── content/
│   └── posts/
│       └── my-first-post.md
├── layouts/
│   └── _default/
│       ├── baseof.html    # Main HTML skeleton
│       ├── list.html      # Homepage/blog list template
│       └── single.html    # Single post template
├── static/
│   └── css/
│       └── style.css      # Custom CSS
├── hugo.toml              # Main site configuration
└── ... (other Hugo folders)
```

## Quick Start

### 1. Prerequisites
- [Install Hugo](https://gohugo.io/getting-started/install/) (e.g. `brew install hugo` on macOS)

### 2. Clone or Copy This Project
```
git clone <your-repo-url>
cd blog.nischalskanda.tech
```

### 3. Run the Development Server
```
hugo server
```
Visit [https://blog.nischalskanda.tech/](https://blog.nischalskanda.tech/) in your browser.

### 4. Add Your First Post
```
hugo new posts/my-second-post.md
```
Edit the new file in `content/posts/` and set `draft: false` to publish.

## Configuration

Edit `hugo.toml` to change site settings:
```toml
baseURL = "https://blog.nischalskanda.tech/"
languageCode = "en-us"
title = "IDEA LAB"

[pagination]
  pagerSize = 5

[params]
  description = "A space for ideas, design, and technology."
```

## Customization
- **Homepage Headline**: Edit `layouts/_default/list.html` for the hero section.
- **Navigation**: Change links in `layouts/_default/baseof.html`.
- **Styles**: Tweak `static/css/style.css` for colors, fonts, and layout.
- **Fonts**: Google Fonts are loaded in `baseof.html`.
- **Interactive Elements**: The `.interactive-o` and `.interactive-arrow` spans in the hero headline are styled with CSS. Replace with SVG or 3D embeds as desired.

## Directory Details
- `archetypes/default.md`: Template for new posts (auto-filled front matter).
- `content/posts/`: Your blog posts in Markdown.
- `layouts/_default/`: Main HTML templates (base, list, single).
- `static/css/style.css`: All custom styles.
- `hugo.toml`: Site config.

## Deployment
1. Build the static site:
   ```
   hugo
   ```
   The output will be in the `public/` directory.
2. Deploy `public/` to your static host (Netlify, Vercel, GitHub Pages, etc).

## Troubleshooting
- If you see errors about `paginate` or themes, ensure your `hugo.toml` matches the config above and does **not** include a `theme` line.
- If you want to use a theme, set `theme = "your-theme-name"` and add it to the `themes/` directory.

## License
MIT or your preferred license.

---
Inspired by clean, interactive web design. Built with ❤️ using Hugo.
