# web/

Pyramidev website. Astro 6 (static) + Tailwind 4 + TypeScript strict. Zero framework JS: Astro components plus small inline scripts (menu, theme toggle).

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies (Node >= 22.12) |
| `npm run dev` | Dev server |
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Preview the build |
| `npm run check` | `astro check` (types and templates) |

## Brand tokens

`src/styles/global.css` imports `src/styles/brand-tokens.css`, a generated copy of the workspace `brand/tokens.css` (the single source of truth). This site is published from its own public repository, so after changing brand tokens run `scripts/sync-brand.sh` from the private workspace root and commit the result here. Tokens are exposed to Tailwind through `@theme inline` with these utilities: `bg-canvas`, `bg-panel`, `text-fg`, `text-fg-muted`, `border-line`, `border-line-strong`, `bg-brand`, `bg-brand-hover`, `text-on-brand`, `text-link-base`, `bg-ink`. Dark mode follows `[data-theme="dark"]` (toggle) or the system preference.

Fonts: Inter Tight 300/400/500 self-hosted via `@fontsource/inter-tight`.

## Assets

`scripts/generate-assets.py` (Pillow) regenerates `public/logo-*.png`, favicons and the branded `og-image.png` (1200x630: Base Oscura gradient, isotipo watermark, imagotipo and headline in Inter Tight) from `brand/logos/`. The headline needs `pip install fonttools brotli` (to decompress the woff2 into a TTF); without them the OG image falls back to logo-only. TODO(brand): replace PNG logos with SVG once exported from `Logotipo.ai`.

## Dependency notes

`@tailwindcss/vite` is pinned to 4.2.2 and `overrides.vite` to ^7 so a single Vite 7 is used (Astro 6 is on Vite 7; Tailwind 4.3 pulls Vite 8 and breaks the build and `astro check`). Revisit when Astro moves to Vite 8.

## Structure

`src/layouts/BaseLayout.astro` (SEO, OG/Twitter, JSON-LD Organization), `src/components/` (Header, Footer, ThemeToggle, Button, Container, Section, SectionHeader, PageHeader, CtaBand, Watermark, TechMarquee, `form/` Input, Textarea, Select, Checkbox), `src/data/` (services, tech), `src/pages/`. The isotipo watermark uses trimmed copies in `src/assets/brand/`; tech icons come from `simple-icons` (devDependency, inlined at build) plus `src/assets/tech/` (AWS, Azure from the legacy site).

## Site config (`src/data/site.ts`)

One module for contact data and integration hooks. Contact details and the WhatsApp number (floating button, contacto, footer) come from `CONTACT` / `WHATSAPP_URL`.

- `SCHEDULER_URL` (TODO(config)): booking link (Cal.com, Calendly, ...). Empty by default, so every "Agenda una llamada" button goes to `/contacto`. When set, all of them open it in a new tab (`rel="noopener"`).
- `ANALYTICS.cloudflareToken` (TODO(config)): Cloudflare Web Analytics site token. Empty by default, so nothing is rendered. When set, `BaseLayout` adds the cookieless beacon script.

## Case imagery

Cases accept an optional `images` array (`src` via Astro's `image()` helper, plus es-MX `alt`) in their frontmatter; files live in `src/assets/cases/<slug>/`. Use only product screens with demo data or captures of public sites of authorized clients. Airport and government cases stay anonymous and have no imagery.

## Deploy

The site is published from the public repository that serves `www.pyramidev.com.mx` through GitHub Pages:

- Source lives on the `source` branch.
- `.github/workflows/deploy.yml` runs `npm ci`, `npm run check` and `npm run build` on every push to `source`, then publishes `dist/` to `main` (with `CNAME` and `.nojekyll`), which GitHub Pages serves as-is.
- Never commit to `main` by hand; it is overwritten on each deploy.
