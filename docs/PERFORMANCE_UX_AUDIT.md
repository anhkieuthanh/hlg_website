# Performance And UX Audit

Audit date: 2026-04-19

Scope: public website in `apps/web`. API/proxy behavior was reviewed only where it affects public data loading, cache behavior, or contact form UX.

## Baseline

Commands run:

- `npm run test -w apps/web`: passed when run after build/type generation settled.
- `npm run build -w apps/web`: passed.
- `npx next start -p 3010`: production server used for Lighthouse.
- `HLG_API_URL=http://127.0.0.1:4999 npx next start -p 3011`: broken-upstream smoke test for public fallback behavior.

Build output summary:

- All localized routes are dynamic SSR (`ƒ`), including `/[locale]`, `/[locale]/projects`, detail pages, and `/[locale]/contact`.
- First Load JS is about `137 kB` for most localized pages and `131 kB` for contact.
- Shared First Load JS is `87.3 kB`.

Local TTFB smoke test on production server:

| Route | HTTP | TTFB | Total |
| --- | ---: | ---: | ---: |
| `/vi` | 200 | 0.433s | 0.436s |
| `/en` | 200 | 0.035s | 0.037s |
| `/vi/projects` | 200 | 0.033s | 0.034s |
| `/vi/contact` | 200 | 0.025s | 0.026s |
| `/vi/projects/nha-may-cong-nghiep-mien-nam` | 200 | 0.023s | 0.025s |

Lighthouse 13.1.0, local production server:

| Route | Form factor | Perf | A11y | BP | SEO | LCP | CLS | TBT | Transfer |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/vi` | mobile 390px | 68 | 96 | 100 | 100 | 15.7s | 0 | 330ms | 2,879 KiB |
| `/vi` | desktop | 100 | 96 | 100 | 100 | 0.6s | 0 | 0ms | 2,879 KiB |
| `/en` | mobile 390px | 69 | 96 | 100 | 100 | 15.6s | 0 | 290ms | 2,879 KiB |
| `/en` | desktop | 85 | 96 | 100 | 100 | 2.8s | 0 | 0ms | 2,879 KiB |
| `/vi/projects` | mobile 390px | 98 | 93 | 100 | 100 | 2.3s | 0 | 70ms | 2,877 KiB |
| `/vi/projects` | desktop | 100 | 93 | 100 | 100 | 0.5s | 0 | 0ms | 2,878 KiB |
| `/vi/contact` | mobile 390px | 97 | 96 | 100 | 100 | 1.6s | 0 | 200ms | 167 KiB |
| `/vi/contact` | desktop | 100 | 96 | 100 | 100 | 0.5s | 0 | 0ms | 167 KiB |
| `/vi/projects/nha-may-cong-nghiep-mien-nam` | mobile 390px | 98 | 95 | 100 | 100 | 2.3s | 0 | 60ms | 2,877 KiB |
| `/vi/projects/nha-may-cong-nghiep-mien-nam` | desktop | 86 | 95 | 100 | 100 | 2.7s | 0 | 0ms | 2,878 KiB |

Broken-upstream smoke test with `HLG_API_URL=http://127.0.0.1:4999`:

- Public pages still render with fallback content: `/vi`, `/vi/projects`, `/vi/contact`, and project detail all returned 200.
- Contact POST to `/api/public/leads` returned 500, which is expected while the API is unavailable; the client form already has an error state.

## Findings

### P1: Homepage mobile LCP is dominated by a 2.7 MB hero image

Evidence:

- `apps/web/app/[locale]/page.tsx` renders `<img src="/assets/industrial-hero.png" alt="" />` in the hero.
- `apps/web/public/assets/industrial-hero.png` is about `2.7M`.
- Lighthouse mobile for `/vi` reports performance `68`, LCP `15.7s`, total transfer `2,879 KiB`.
- Lighthouse identifies `div.site-shell > main > section.hero > img` as the LCP element and recommends high priority discovery.

Impact:

- This is the largest measurable performance issue. It directly hurts first impression on mobile and slower networks.
- The same placeholder image is reused across CMS seed content, so non-home routes also carry a large transfer size even when their Lighthouse score is otherwise high.

Recommendation:

- Convert the hero to `next/image` with `priority`, `fetchPriority="high"`, responsive `sizes`, and stable fill/cover layout.
- Replace `industrial-hero.png` with optimized AVIF/WebP/JPEG variants sized for mobile and desktop. Target: hero mobile payload under 200-350 KiB and desktop under 500-800 KiB.
- Keep source originals outside runtime, as already noted in `docs/ASSET_PLAN.md`.

Effort: Medium.

### P1: Card/detail images are eager `<img>` tags and reuse the same heavy placeholder

Evidence:

- `apps/web/components/Cards.tsx` uses `<img className="card-media">` for project, product, and news cards.
- `apps/web/app/[locale]/capabilities/page.tsx`, `manufacturing/page.tsx`, and detail pages also use raw `<img>`.
- Lighthouse total transfer for `/vi/projects` and project detail is still about `2,877 KiB`, mainly from `/assets/industrial-hero.png`.

Impact:

- Below-the-fold card images can load eagerly.
- All cards/details currently pay the full placeholder image cost.
- Real CMS images will repeat this risk unless upload/serving rules enforce variants.

Recommendation:

- Add a small shared image component for site media using `next/image`.
- Use lazy loading for cards and non-critical detail images; use priority only for the real LCP image.
- Add CMS image requirements: width/height metadata, alt text per locale, generated `640/960/1440` variants, WebP/AVIF output, and max upload/runtime sizes.

Effort: Medium.

### P1: Marketing pages are forced into dynamic SSR and `no-store` fetching

Evidence:

- `apps/web/app/[locale]/layout.tsx` exports `dynamic = "force-dynamic"`.
- `apps/web/lib/public-api.ts` fetches all public GET data with `{ cache: "no-store" }`.
- `apps/web/app/api/[...path]/route.ts` proxies upstream with `{ cache: "no-store" }`.
- Build output marks all localized public routes as dynamic SSR (`ƒ`).

Impact:

- Public marketing pages cannot be prerendered or cached by Next/CDN despite mostly static B2B content.
- More requests hit the server/API path, reducing resilience and increasing latency under traffic.
- Fallback content works, but the current setup leaves performance on the table.

Recommendation:

- Remove `force-dynamic` from the locale layout unless a route truly requires request-time behavior.
- Use ISR/revalidation for public GET content, for example `next: { revalidate: 300 }` or `600`, with a clear cache policy per content type.
- Keep `no-store` for contact POST and admin-like mutations only.
- If CMS updates need immediate reflection, add an explicit revalidation endpoint or tag-based revalidation later.

Effort: Medium.

### P2: Client animation layer increases JS and runs across most pages

Evidence:

- `apps/web/components/MotionPrimitives.tsx` and `PageTransition.tsx` import `framer-motion`.
- `SiteChrome` uses `PageTransition`, `Reveal`, and `Stagger`; most pages import `Reveal`/`Stagger`.
- Lighthouse reports about `24-28 KiB` unused JS in chunk `951-acbdf57c0855ffd7.js`.
- First Load JS is `137 kB` for most localized routes.

Impact:

- The site is mostly content/marketing, but much of the chrome and section layout becomes client-side because of animation wrappers.
- This adds hydration work and keeps interaction code on pages that may not need it.

Recommendation:

- Keep motion where it materially helps orientation, such as route progress or high-value hero reveals.
- Replace simple reveal/stagger effects with CSS transitions or static server-rendered markup where possible.
- Consider dynamically loading page-transition behavior after idle, or disabling it on fast same-site navigations if it is mostly decorative.

Effort: Medium.

### P2: Mobile navigation consumes too much of the first viewport

Evidence:

- `apps/web/app/globals.css` switches `.nav` to a vertical stacked layout at `max-width: 900px`.
- A 390px screenshot shows the header/nav/language switcher occupying the top of the screen before the hero starts; hero CTA is below the first viewport.

Impact:

- Mobile users see less value proposition and no primary CTA above the fold.
- The nav is clear but heavy for a corporate landing page.

Recommendation:

- Replace the stacked mobile nav with a compact mobile header and menu toggle, or use a horizontally scrollable nav row with reduced spacing.
- Keep brand and language switcher visible; move secondary links into a menu.
- Validate at `360`, `390`, `768`, `1366`, and `1440` widths after the change.

Effort: Medium.

### P2: Accessibility contrast and heading order need cleanup

Evidence:

- Lighthouse accessibility for `/vi/projects` is `93`.
- `apps/web/app/globals.css` uses `.eyebrow` color `--signal` (`#fff200`) globally; on light `detail-hero` background this has contrast around `1.02`.
- `.meta` uses `--oxide` (`#ed1b24`) on white cards with contrast around `4.39`, just below the 4.5 requirement for small text.
- `/vi/projects` skips from `h1` to card `h3` without an intervening `h2`.

Impact:

- Yellow labels are difficult to read on light sections.
- Heading jumps reduce screen-reader navigability and automated a11y quality.

Recommendation:

- Add a light-section variant such as `.detail-hero .eyebrow { color: var(--brand-blue); }`.
- Darken `--oxide` for small metadata text or use a darker semantic color for `.meta`.
- Add visible or screen-reader-only `h2` headings before card grids, or change card heading levels per page context.

Effort: Small.

### P2: SEO metadata is too generic for localized public pages

Evidence:

- Only `apps/web/app/layout.tsx` exports root metadata.
- No route-specific `generateMetadata`, canonical URL, locale alternates, Open Graph, or Twitter metadata was found.
- `apps/web/app/sitemap.ts` defaults to `https://example.com` when `NEXT_PUBLIC_SITE_URL` is absent and includes seed dynamic paths for both locales.

Impact:

- Search previews are generic.
- Localized canonical/alternate signals are weak.
- Sitemap can be wrong in environments missing `NEXT_PUBLIC_SITE_URL`.

Recommendation:

- Add route-level metadata for homepage, listing pages, and detail pages using localized title/description.
- Add canonical and language alternates for `/vi` and `/en`.
- Require `NEXT_PUBLIC_SITE_URL` in production deployment validation.
- Filter sitemap entries by publish/enPublished status if real CMS data is used at build time.

Effort: Medium.

### P3: Contact form UX is functional but minimal

Evidence:

- `apps/web/components/ContactForm.tsx` has `idle`, `sending`, `sent`, and `error` states.
- Submit button changes to `"..."` while sending.
- Error/success messages are plain paragraphs and are not announced with `aria-live`.
- `apps/web/app/api/[...path]/route.ts` does not catch upstream fetch failures; with a broken `HLG_API_URL`, contact POST returned 500 and the server logged a raw `fetch failed` stack.

Impact:

- The form works, but users get limited feedback during slow API responses.
- Screen reader users may not be informed when submit state changes.
- Upstream API outages are surfaced as generic 500 responses instead of a controlled public API error.

Recommendation:

- Replace `"..."` with localized sending copy.
- Add `aria-live="polite"` for success/error status.
- Add explicit field-level validation copy for required fields and email.
- Consider preserving form values on error, which it already does because reset happens only on success.
- Wrap the web proxy fetch in `try/catch` and return a small `503` JSON response for upstream failures.

Effort: Small.

## Quick Wins

1. Replace homepage hero `<img>` with `next/image` and an optimized image asset.
2. Add `loading="lazy"`/`next/image` for cards and details, with correct `sizes`.
3. Fix light-section `.eyebrow` contrast and `.meta` contrast.
4. Add `h2` headings before listing grids where the page jumps from `h1` to card `h3`.
5. Remove `force-dynamic` and switch public GET fetches to ISR after confirming CMS freshness requirements.

## Acceptance Checklist For Follow-Up Implementation

- Home mobile Lighthouse performance should improve from `68` to at least `85`, with LCP under `2.5s` in simulated mobile.
- Total transfer for `/vi` should drop from about `2,879 KiB` to under `900 KiB` before real photography is added.
- `/vi/projects` accessibility should improve from `93` to at least `98`.
- Build output should show eligible marketing routes as static or ISR instead of dynamic SSR.
- Public pages must continue rendering fallback content when the API is unavailable.
- Contact form must still submit successfully when API is available and show a clear error when API is unavailable.
