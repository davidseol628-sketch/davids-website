# Frontend Restyle — SKEC Look & Feel

Porting the visual style of the **Smart Kids Enrichment Center** Wix site
(`harpalsingh0005.wixsite.com/smart-kids-enrichmen`) into this app.

**Status:** Proposal only — nothing implemented yet.

---

## 1. What was captured (recon)

### Image assets downloaded → `skec-assets/`
| File | Source | Size |
|------|--------|------|
| `logo.jpg` | SKEC navy wordmark | 592×77 |
| `hero-country.jpg` | Teacher reading to kids | 1536×1024 |
| `smart-kids.jpg` | "Our Network" portrait | 1000×1500 |

> Program-card photos (Outdoor Play / Art Lessons / Imaginative Play) and the
> service photos are available to pull as well — not yet downloaded.

### Pages toured
| Page | Content |
|------|---------|
| Home | Hero carousel, "Find Best Tutors Anywhere", Our Services (3 booking cards), Our Network, video widget, contact form |
| About Us | "Our Roots" — gray text panel + photo, outlined *Explore* button |
| Information Pack | "Apply Today" — file-download rows, circular black download icons |
| BlankPage / Quote | Empty placeholders |
| After School program | Heading + paragraphs + Google Drive link |
| Time Management | Full-width **yellow** band, centered tip list |
| Programs | "Our Educational Programs" — 3 cards (gray header strip + photo) |
| Book Online | Wix Bookings — same 3 service cards as home |
| Program List | "No available programs" empty state |
| Location | Centered address list, outlined *Explore* button |
| Get In Touch | Contact form + address + Opening Hours panel + map photo |

---

## 2. Style fingerprint (measured from the live site)

| Token | SKEC site | This app (current) |
|-------|-----------|--------------------|
| Font | **Roboto** (bold/black headings, regular body), Arial fallback | `system-ui` |
| Heading color | near-black `#20303c` | slate `#0f172a` |
| Brand color | indigo-navy `#1a2b6b` (logo) / slate `#20455e` | — |
| Accent (links) | blue `#116dff` | blue `#2563eb` |
| Primary button | **black bg, white text, 0 radius** | accent-blue, 8px radius |
| Secondary button | transparent, thin black outline, square | green-tinted, rounded |
| Sections | white ↔ light-gray panels `#f4f5f6`, one yellow band | white only |
| Cards | flat, thin gray border, square corners | 12px radius, soft shadow |

**Read:** SKEC is heavier, squarer, more traditional/education-center.
This app is lighter, softer, more modern-SaaS.

---

## 3. Proposed changes

**Approach:** retheme the shared design system, not rebuild pages. The whole app
(forms, dashboards, admin tables, catalog) already runs off CSS variables +
shared module classes, so changing tokens cascades everywhere automatically.

### 3.1 `index.html`
- Add Roboto Google Fonts `<link>` (weights 400/500/700/900) in `<head>`.

### 3.2 `src/index.css` — design tokens (the big lever)
```css
--sans:    'Roboto', Arial, Helvetica, sans-serif;
--heading: 'Roboto', Arial, Helvetica, sans-serif;
--text-h:  #20303c;   /* near-black headings */
--text:    #4a4a4a;   /* warmer body gray */
--accent:  #116dff;   /* SKEC link blue */
--ink:     #000;      /* button black     (new) */
--panel:   #f4f5f6;   /* gray section bg  (new) */
--brand:   #1a2b6b;   /* logo navy        (new) */
```
- Headings → weight 700, tighter spacing to match SKEC's heavy look.

### 3.3 `src/components/shared.module.css` — propagating change
- `.btn` → black bg, white text, **border-radius 0**, weight 600
  → restyles buttons across every form / dashboard / admin page at once.
- `.btnSecondary` → transparent, black text, thin black outline, square
  (the "Explore" style).
- `.card` → keep thin border, square the corners.
- `.badge` → stays on blue accent.

### 3.4 `src/components/Nav.module.css`
- `.brand` → bigger, navy (`--brand`), evokes the SKEC wordmark.
- `.signup` → black, square button.
- `.active` underline → SKEC blue.

### 3.5 `src/routes/Home.module.css`
- `.primaryBtn` → black/square; `.secondaryBtn` → outline/square.
- Alternate `.section` backgrounds white ↔ `--panel`.
- Center headings.

### 3.6 `src/components/Layout.module.css`
- Minor footer tweak — centered, gray, to match.

---

## 4. Open decisions (need your call before implementing)

1. **Scope**
   - **(a) Theme only** — swap tokens + button/card styling. App *feels* like
     SKEC but keeps current page structure. _(lower risk, fast)_
   - **(b) Theme + restructure Home** — also rebuild the landing page to mirror
     SKEC's sections (hero w/ logo, Our Services cards, Our Network image block,
     contact form). _(more work, closer match)_

2. **Logo**
   - Use the actual `SKEC` image in the nav, **or**
   - Keep your text wordmark "Enrichment Center", restyled in navy Roboto.

   > Note: SKEC's logo/photos belong to that business — fine as a visual
   > reference, but reusing their exact logo/branding on a different live site
   > isn't recommended long-term.

---

## 5. Files touched (summary)

| File | Change |
|------|--------|
| `index.html` | + Roboto font link |
| `src/index.css` | tokens + heading weights |
| `src/components/shared.module.css` | black square buttons, square cards |
| `src/components/Nav.module.css` | navy brand, black signup btn |
| `src/routes/Home.module.css` | black btns, alternating sections |
| `src/components/Layout.module.css` | footer tweak |
| `skec-assets/*` | (already downloaded) reference images |

No functional/logic changes — CSS + one `<head>` link only (scope (a)).
