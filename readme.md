# IDEA LAB – Hugo Blog

A modern, minimal, and customizable blog built with [Hugo](https://gohugo.io/). This project is set up for rapid content publishing and easy design customization, inspired by clean, interactive web aesthetics.

## Features
- **No external theme**: All templates and styles are custom, found in the `layouts` and `static` folders.
- **Modern, bold homepage**: Custom hero headline with interactive elements (CSS-based, easily swappable for 3D/SVG).
- **Pagination**: Configurable via `hugo.toml`.
- **Easy content management**: Write posts in Markdown under `content/posts/`.
- **Custom Fonts**: Uses Satoshi and Unbounded for a unique, modern look.

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
├── assets/
│   └── css/
│       └── style.css      # Custom CSS (processed via Hugo Pipes)
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

**Option 1: Use the development script (Recommended)**
```bash
./dev.sh
```

**Option 2: Manual command**
```bash
hugo server --buildDrafts --buildFuture --baseURL="http://localhost:1313"
```

Visit [http://localhost:1313](http://localhost:1313) in your browser.

**Note:** The development script ensures all links point to localhost instead of the production URL for proper local development and navigation.

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
- **Styles**: Tweak `assets/css/style.css` for colors, fonts, and layout.
- **Fonts**: Satoshi and Unbounded fonts are loaded in `baseof.html` and defined via `@font-face` in CSS.
- **Interactive Elements**: The `.interactive-o` and `.interactive-arrow` spans in the hero headline are styled with CSS. Replace with SVG or 3D embeds as desired.

## Directory Details
- `archetypes/default.md`: Template for new posts (auto-filled front matter).
- `content/posts/`: Your blog posts in Markdown.
- `layouts/_default/`: Main HTML templates (base, list, single).
- `assets/css/style.css`: All custom styles.
- `hugo.toml`: Site config.

## Deployment
1. Build the static site for production:
   ```bash
   ./build.sh
   ```
   Or manually:
   ```bash
   hugo --cleanDestinationDir --minify
   ```
   
2. (Optional) Verify URLs are correct:
   ```bash
   ./verify-urls.sh
   ```
   
3. Deploy the `public/` directory to your static host (Netlify, Vercel, GitHub Pages, etc).

**Important:** Always use the build script or manual `hugo` command for production builds. Never deploy files generated with the development server as they contain localhost URLs.

## Development vs Production Workflow

### For Local Development
- Use: `./dev.sh` or `hugo server --baseURL="http://localhost:1313"`
- Result: All links point to localhost for local testing
- Files: Development files in memory (not for deployment)

### For Production Deployment  
- Use: `./build.sh` or `hugo --cleanDestinationDir --minify`
- Result: All links point to production domain
- Files: Production-ready files in `./public/` directory

## Troubleshooting
- If you see errors about `paginate` or themes, ensure your `hugo.toml` matches the config above and does **not** include a `theme` line.
- If you want to use a theme, set `theme = "your-theme-name"` and add it to the `themes/` directory.

## License
MIT or your preferred license.

---
Inspired by clean, interactive web design. Built with ❤️ using Hugo.
