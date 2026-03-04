# yoopychristian.github.io

Personal portfolio — Tech Lead & Software Engineer.

## Stack

Vanilla HTML + CSS + JS. No build step. Deploys directly to GitHub Pages.

## File Structure

```
├── index.html                   # Page structure (static hero + containers)
├── style.css                    # Design system + all styles
├── script.js                    # Renders data sections + nav interactions
├── data/
│   └── content.json             # All editable content (projects, experience, skills)
├── assets/
│   ├── favicon.svg              # YC logo favicon
│   └── site.webmanifest         # PWA manifest
├── Resume-Yoopy-Christian.pdf   # Downloadable resume
└── README.md
```

## Updating Content

All project, experience, and skills data lives in **`data/content.json`**. Edit that file to update the site — no HTML changes needed for content updates.

### Adding a project

Add an object to the `projects` array:

```json
{
  "title": "Project Name",
  "description": "One to two sentences. Impact-focused.",
  "tech": ["Go", "PostgreSQL"],
  "url": "https://example.com",
  "type": "lead"
}
```

**`type`** values: `lead` (leading), `build` (built), `contract` (freelance), `personal` (side project). Determines the label shown above the project title.

**`url`** is optional. If provided, the card becomes a clickable link with an arrow indicator.

### Adding experience

Add an object to the `experience` array:

```json
{
  "role": "Job Title",
  "company": "Company Name",
  "period": "Jan 2023 — Dec 2024",
  "description": "Brief description of the role.",
  "highlights": ["Key achievement 1", "Key achievement 2"]
}
```

For the current role, add `"current": true` and `"startDate": "2023-01"` — the duration will be calculated automatically.

### Updating skills

Edit the `skills` object. Keys are category names, values are arrays of skill strings:

```json
{
  "Languages": ["Go", "JavaScript", "Python"],
  "Backend": ["PostgreSQL", "MySQL"]
}
```

### Updating hero / contact info

The hero section and contact info are **static HTML** in `index.html` (for SEO). Edit them directly in the HTML file. The `meta` object in `content.json` is available for reference but doesn't auto-render into the hero.

## Deploy

Push to `main` branch. GitHub Pages serves from root automatically.

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

Settings: Repository → Settings → Pages → Source: "Deploy from branch" → Branch: `main`, folder: `/ (root)`.

## Design Rationale

### Direction

"Product UI" card/grid layout inspired by Linear, Vercel, and Raycast. Chosen over editorial/docs style because:
- Card containers create clear scan paths for fast parsing (recruiters spend ~30s)
- Structured layout signals "engineer who builds products"
- Cards map 1:1 to JSON data objects, making the content system clean

### Typography

- **Inter** (400/500/600/700) — the workhorse sans-serif of modern product design. Excellent legibility at small sizes, strong character at large sizes.
- **JetBrains Mono** — for code-like accents: tech tags, dates, meta labels. Reinforces the technical identity.
- Scale: 48/17/15/14/13/11px. Tight but readable. Headings use -0.03em tracking for density. Body at 15px hits the sweet spot between information density and readability.

### Spacing

4px base unit. Consistent multiples (8/12/16/24/32/48/64/80/96/128). Generous section padding (80px) creates breathing room. Card internal padding (24px) is tight enough to feel product-like, loose enough to read.

### Color

Dark-only. Near-black background (#09090b) with subtle zinc-based surface layers (#111113, #1a1a1f). Text hierarchy through three zinc tones (#fafafa, #a1a1aa, #71717a) — all passing WCAG AA contrast. Single accent (#3b82f6 blue) used only for interactive elements and tech tags. Green dot (#22c55e) for "currently active" status badge.

### Components

- **Nav**: 56px fixed, backdrop-blur, minimal links. Monospace "YC" badge as logo.
- **Hero**: Name + status badge + bio + icon links. No image/avatar — the writing is the identity.
- **Project cards**: 14px radius, 1px borders, stretched-link pattern (whole card clickable). Hover = border brightens + 1px lift. Tech tags as monospace pills with accent background.
- **Experience**: Grid layout with monospace date column. Clean rows, no cards — editorial feel within the product structure.
- **Skills**: Category-label + tag-pill rows. Hoverable tags with border transition.
- **Contact**: Simple text links with inline SVG icons. No form (static site = use email directly).

### Performance

- Zero external dependencies besides Google Fonts (Inter + JetBrains Mono)
- No icon library — all icons are inline SVGs (~200 bytes each)
- No images — entirely CSS/text-based design
- JS is ~4KB, runs as ES module (auto-deferred)
- CSS is ~8KB (single file, no preprocessor needed)
- Total page weight under 50KB (excluding fonts and PDF resume)

### Accessibility

- Semantic HTML: nav, main, section, article, footer, h1→h3
- Skip-to-content link
- ARIA labels on all icon-only links
- `aria-expanded` on mobile menu toggle
- Escape key closes mobile menu
- `focus-visible` outlines on all interactive elements
- `prefers-reduced-motion` disables all animations
- All text passes WCAG AA contrast on dark background
- Print stylesheet hides nav/decorative elements
