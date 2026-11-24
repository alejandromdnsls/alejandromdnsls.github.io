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
| `npm run build && node --test 'src/**/*.test.mjs'` | FAQ tests (provenance and JSON-LD; run after a build) |

## Brand tokens

`src/styles/global.css` imports `src/styles/brand-tokens.css`, a generated copy of the workspace `brand/tokens.css` (the single source of truth). This site is published from its own public repository, so after changing brand tokens run `scripts/sync-brand.sh` from the private workspace root and commit the result here. Tokens are exposed to Tailwind through `@theme inline` with these utilities: `bg-canvas`, `bg-panel`, `text-fg`, `text-fg-muted`, `border-line`, `border-line-strong`, `bg-brand`, `bg-brand-hover`, `text-on-brand`, `text-link-base`, `bg-ink`. Dark mode follows `[data-theme="dark"]` (toggle) or the system preference.

Fonts: Inter Tight 300/400/500 self-hosted via `@fontsource/inter-tight`.

## Assets

`scripts/generate-assets.py` (Pillow) regenerates `public/logo-*.png`, favicons and the branded `og-image.png` (1200x630: Base Oscura gradient, isotipo watermark, imagotipo and headline in Inter Tight) from `brand/logos/`. The headline needs `pip install fonttools brotli` (to decompress the woff2 into a TTF); without them the OG image falls back to logo-only. TODO(brand): replace PNG logos with SVG once exported from `Logotipo.ai`.

## Dependency notes

`@tailwindcss/vite` is pinned to 4.2.2 and `overrides.vite` to ^7 so a single Vite 7 is used (Astro 6 is on Vite 7; Tailwind 4.3 pulls Vite 8 and breaks the build and `astro check`). Revisit when Astro moves to Vite 8.

## Structure

`src/layouts/BaseLayout.astro` (SEO, OG/Twitter, JSON-LD Organization), `src/components/` (Header, Footer, ThemeToggle, Button, Container, Section, SectionHeader, PageHeader, CtaBand, Watermark, TechMarquee, RiskReducer, BrowserFrame, PhoneFrame, CaseMockup, `form/` Input, Textarea, Select, Checkbox), `src/data/` (services, tech), `src/pages/`. The isotipo watermark uses trimmed copies in `src/assets/brand/`; tech icons come from `simple-icons` (devDependency, inlined at build) plus `src/assets/tech/` (AWS, Azure from the legacy site).

## Site config (`src/data/site.ts`)

One module for contact data and integration hooks. Contact details and the WhatsApp number (floating button, contacto, footer) come from `CONTACT` / `WHATSAPP_URL`.

- `SCHEDULER_URL` (TODO(config)): booking link (Cal.com, Calendly, ...). Empty by default, so every "Agenda una llamada" button goes to `/contacto`. When set, all of them open it in a new tab (`rel="noopener"`).
- `ANALYTICS.cloudflareToken` (TODO(config)): Cloudflare Web Analytics site token. Empty by default, so nothing is rendered. When set, `BaseLayout` adds the cookieless beacon script.

## Home FAQ and risk reducer (`src/data/faq.ts`)

The home FAQ, its FAQPage JSON-LD, the risk-reducer line under the hero CTA and the risk-reducer section (`RISK_ITEMS`, rendered by `RiskReducer.astro`) come from one module. Copy is plain es-MX in the site's «tú» register, two or three short sentences per answer. Each answer declares the facts it uses (figures, named options, legal entity, key commitments), each tied to a key of the workspace `templates/data/terms.json` (source of truth for Pyramidev services) or a repository file. `src/data/faq.test.mjs` checks that every fact equals its source and appears in the answer, that every number in an answer is a declared fact, and that the built JSON-LD matches the rendered FAQ (the source checks are skipped where `terms.json` is absent, as in the public repository). To change an answer, change `terms.json` first. `public/llms.txt` describes Pyramidev with the same facts.

## Navigation and frames

`Header.astro` is a floating, solid nav (no blur) fixed over the page. Pages that open with an always-dark band (home hero, `PageHeader`) pass `overDark`: the nav starts with the dark tokens and switches to the theme surface with a neutral shadow once the band is behind it; other pages get a spacer. On the home the main links follow the section in view (`data-nav-section`); `/servicios` passes `sections` for a second, scrollable row of in-page links. Case screenshots are shown in `BrowserFrame` (address bar with the site's hostname) and `PhoneFrame` (8px radius, flat ink bezel); `CaseMockup` combines a landscape screen with an app screen beside it.

## Home hero illustration

`SoftwareFactory.astro` is an original isometric inline SVG: a thick upper slab with the client operation (office, lane with barrier, ticket totem, plate reader, canopy, cashier booth, payment kiosk, cars, people) floats over a larger translucent diamond with the software layer (phone with an app, server rack, laptop, dashboard monitor, router, people); straight beams drop from slab objects to each device and carry data packets both ways. Repeated parts (cars, people, cones, trees, windows, rooftop units) are reused with `<use>`. Payments are explicit: a card taps the kiosk and a check appears, «$» coins travel down its beam to the phone, which shows a paid row and badge, and the monitor has a revenue tile. The barrier arm rises in its own vertical plane: each pose is rotated geometry and the poses play as opacity frames, so it never swings sideways. Geometry is generated in the component from world coordinates; colors are brand tokens only; motion is CSS (`transform`/`opacity`), paused off screen and removed under `prefers-reduced-motion`. The hero never shows product or case images (`src/data/hero.test.mjs`).

## Case imagery

Cases accept an optional `images` array (`src` via Astro's `image()` helper, plus es-MX `alt`) in their frontmatter; files live in `src/assets/cases/<slug>/`. Use only product screens with demo data or captures of public sites of authorized clients. Airport and government cases stay anonymous and have no imagery.

## Delivery (GitHub Pages)

- CSS is inlined in every page (`build.inlineStylesheets: 'always'`), so the first paint does not wait for a stylesheet request.
- GitHub Pages sets its own `Cache-Control` (short `max-age` plus `ETag`) and cannot serve custom headers, so there is no `_headers` file and no header-based CSP. Built assets under `/_astro/` carry a content hash, so a new deploy never serves stale CSS, JS or images. Do not add a `<meta>` CSP without allowing Formspree (contact form), the WhatsApp links and the analytics hook in `src/data/site.ts`.
- `public/llms.txt` summarizes the company for language models and links every page of the sitemap; `src/data/delivery.test.mjs` checks it against the built sitemap and checks that no stylesheet is linked.

## Deploy

The site is published from the public repository that serves `www.pyramidev.com.mx` through GitHub Pages:

- Source lives on the `source` branch.
- `.github/workflows/deploy.yml` runs `npm ci`, `npm run check` and `npm run build` on every push to `source`, then publishes `dist/` to `main` (with `CNAME` and `.nojekyll`), which GitHub Pages serves as-is.
- Never commit to `main` by hand; it is overwritten on each deploy.
