# Article Reading System

## 1. Typography system

- Primary body font: `Lora, Georgia, serif`
- Secondary/display font: `Inter, system-ui, sans-serif`
- Fallbacks:
  - Body: `Georgia, serif`
  - Headings/UI: `system-ui, sans-serif`

Desktop:
- Body: `clamp(1.0625rem, 1rem + 0.24vw, 1.17rem)`
- Body line-height: `1.84`
- H1: `clamp(2.35rem, 3rem on tablet, 3.85rem on desktop)` with `line-height: 1.04`
- H2: `clamp(1.7rem, 1.45rem + 0.7vw, 2.15rem)` with `line-height: 1.14`
- H3: `clamp(1.24rem, 1.12rem + 0.35vw, 1.48rem)` with `line-height: 1.25`

Mobile:
- Body: `1rem`
- Body line-height: `1.78`
- H2: `1.55rem`
- H3: `1.15rem`

Weights:
- Body: `400`
- Strong text: `650`
- H1: `700`
- H2/H3: `600`
- Meta/supporting UI: `500-600`

Spacing:
- Paragraph gap: `1.12em`
- H2 top spacing: `2.65em`
- H3 top spacing: `1.95em`

Why:
- Serif body text improves long-form reading endurance and gives editorial credibility.
- Sans headings create contrast and make section scanning faster.
- Slightly looser leading than app-style interfaces reduces fatigue in 5-10 minute reading sessions.
- Negative letter spacing on headings improves density and polish without hurting legibility.

## 2. Layout structure

- Main reading width: `42.5rem` body measure
- Effective line length target: `65-75 characters`
- Article shell: centered within `max-width: 76rem`
- Desktop reading grid: `44rem` main column + `16-18rem` side rail
- TOC sits in a sticky right rail on desktop; collapses above content on smaller screens

Spacing rules:
- Outer page padding: `px-4 sm:px-6 lg:px-8`
- Article vertical padding: `py-8 sm:py-10 lg:py-12`
- Reading grid gap: `2.5rem`, desktop `3rem`

Why:
- The body column stays narrow enough to avoid lateral eye travel.
- The side rail keeps navigation available without stealing width from content.
- Large outer whitespace makes the article feel premium and easier to cognitively parse.

## 3. Headings hierarchy

- H1: oversized, high-contrast, text-balance enabled, strong hero presence
- H2: clearly resets rhythm, strong sectional divider, optimized for scanner behavior
- H3: sub-section marker, slightly tighter and faster
- H4: optional micro-heading in uppercase muted UI style

Why:
- Readers skim first and commit second. Strong hierarchy turns an article into a map.
- Larger H2 spacing creates cognitive chapter breaks and improves retention.

## 4. Reading flow optimization

Rules:
- Ideal paragraph length: `2-4 lines desktop`, `2-5 lines mobile`
- Use one core idea per paragraph
- Break dense sections with lists, callouts, comparison tables, images, and quotes
- Avoid back-to-back oversized blocks
- Use whitespace as pacing, not decoration

Why:
- Compact paragraphs lower intimidation and increase scroll depth.
- Alternating text density keeps attention from collapsing mid-article.

## 5. Highlight elements

- Quotes: soft editorial card, serif italic, visible accent rule
- Notes: quiet muted container for secondary information
- Callouts: compact framed blocks with icon + uppercase title
- Pros/cons: two balanced cards with stronger spacing and list rhythm
- CTA: high-contrast but visually integrated; feels premium, not banner-like
- Lists: slightly larger leading and vertical separation between bullets

Goal:
- Improve scanability, memory anchors, and rest points without fragmenting the narrative.

## 6. Color system

- Background: `hsl(38 27% 97%)`
- Primary text: `hsl(222 21% 14%)`
- Secondary text: `hsl(220 10% 43%)`
- Border: `hsl(220 14% 85%)`
- Accent/link: `hsl(231 57% 52%)`
- Accent subtle: `hsl(230 45% 95%)`

Rules:
- Never pure black on pure white
- Keep link underline visible with softer default decoration
- Hover shifts links toward primary text for a more premium feel

Why:
- Warm paper background and softened dark text reduce glare in long sessions.
- Controlled contrast feels more expensive than harsh monochrome.

## 7. Mobile optimization

- Body text locked to `1rem`
- Line-height slightly tightened to `1.78`
- H2/H3 scaled down to preserve hierarchy without dominating the viewport
- Rail collapses away
- Blocks use larger radii and generous internal padding
- Buttons preserve `min-height: 44px`

Why:
- Mobile reading needs compact but breathable rhythm.
- Tap targets stay usable without turning the page into a mobile app dashboard.

## 8. Anti-patterns

Avoid:
- `16px` body text with cramped `1.5-1.6` line-height for long-form
- Full-width article bodies over `80ch`
- Pure black text on pure white backgrounds
- Overusing Inter/Roboto for body copy in editorial layouts
- Excessively saturated link colors
- Tiny captions and tiny metadata
- Giant blocks with no visual breaks
- Banner-like affiliate CTAs that visually break trust
- Heading scales that are too close together
- Heavy borders and noisy shadows on every block

## Final design system summary

- Body font: `Lora`
- UI/headings font: `Inter`
- Body width: `42.5rem`
- Reading target: `65-75 CPL`
- Body size: `1rem mobile`, `~1.06-1.17rem desktop`
- Body leading: `1.78 mobile`, `1.84 desktop`
- H1: `2.35-3.85rem`
- H2: `1.55-2.15rem`
- H3: `1.15-1.48rem`
- Background: warm off-white
- Text: softened slate
- Links: slate-indigo with soft underline
- Desktop layout: content column + sticky TOC rail
- Visual rhythm: large section spacing, short paragraphs, premium secondary blocks

## CSS example

```css
.article-body {
  font-family: "Lora", Georgia, serif;
  font-size: clamp(1.0625rem, 1rem + 0.24vw, 1.17rem);
  line-height: 1.84;
  color: hsl(222 21% 14% / 0.94);
  max-width: 42.5rem;
}

.article-body p {
  margin: 1.12em 0;
  text-wrap: pretty;
}

.article-body h2,
.article-body h3 {
  font-family: "Inter", system-ui, sans-serif;
  letter-spacing: -0.024em;
  color: hsl(222 21% 14%);
}

.article-body h2 {
  margin-top: 2.65em;
  margin-bottom: 0.85em;
  font-size: clamp(1.7rem, 1.45rem + 0.7vw, 2.15rem);
  line-height: 1.14;
}

.article-body h3 {
  margin-top: 1.95em;
  margin-bottom: 0.72em;
  font-size: clamp(1.24rem, 1.12rem + 0.35vw, 1.48rem);
  line-height: 1.25;
}

.article-reading-grid {
  display: grid;
  grid-template-columns: minmax(0, 44rem) minmax(16rem, 18rem);
  gap: 3rem;
  justify-content: center;
}

.article-toc {
  position: sticky;
  top: 6.25rem;
  border: 1px solid hsl(220 14% 85%);
  border-radius: 1.25rem;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(10px);
}

@media (max-width: 640px) {
  .article-body {
    font-size: 1rem;
    line-height: 1.78;
  }

  .article-reading-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
```
