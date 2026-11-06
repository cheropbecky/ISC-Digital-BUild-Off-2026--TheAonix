---
name: Kampas
colors:
  surface: '#f9f9ff'
  surface-dim: '#d1daee'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dfe8fd'
  surface-container-highest: '#dae3f7'
  on-surface: '#131c2a'
  on-surface-variant: '#444651'
  inverse-surface: '#283140'
  inverse-on-surface: '#ebf1ff'
  outline: '#757682'
  outline-variant: '#c5c6d2'
  surface-tint: '#435ba1'
  primary: '#00164a'
  on-primary: '#ffffff'
  primary-container: '#0b2a6f'
  on-primary-container: '#7d94df'
  inverse-primary: '#b4c5ff'
  secondary: '#4d5c8e'
  on-secondary: '#ffffff'
  secondary-container: '#b5c5fd'
  on-secondary-container: '#405081'
  tertiary: '#251900'
  on-tertiary: '#ffffff'
  tertiary-container: '#3e2d00'
  on-tertiary-container: '#bf9000'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174c'
  on-primary-fixed-variant: '#2a4388'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b5c5fd'
  on-secondary-fixed: '#041847'
  on-secondary-fixed-variant: '#354575'
  tertiary-fixed: '#ffdf9d'
  tertiary-fixed-dim: '#f9bd14'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#5b4300'
  background: '#f9f9ff'
  on-background: '#131c2a'
  surface-variant: '#dae3f7'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.005em
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an authoritative, welcoming, and technologically modern collegiate portal for the University of Eastern Africa, Baraton (UEAB). The brand personality balances academic prestige, trust, and community warmth—positioning the platform as the vital digital hub where daily academic logistics and campus life converge under the tagline: *"The campus, in one place."*

The visual philosophy relies on a **Corporate / Modern Institutional** foundation infused with tailored academic character:
- **Structural Integrity:** High-utility layout structures designed for dense academic data (timetables, clearance deadlines, course schedules) paired with breathable margins.
- **Calm Authority:** Deep varsity navy foundations ground the experience, while vibrant UEAB gold provides focused highlights and energetic active states without degrading institutional gravitas.
- **High Legibility & Clarity:** Pristine surfaces, crisp borders, and purposeful contrast engineered for all lighting environments, from direct outdoor sunlight in Baraton to low-light study halls.

## Colors

The color palette reflects UEAB’s historic institutional identity through a refined collegiate triad: Primary Navy, Dark Royal Blue, and UEAB Gold.

- **Primary Canvas & Surfaces:** The base canvas runs on `#F7F9FC` (a cool tinted off-white) to reduce eye fatigue across extended study and administrative sessions. Component cards, tables, and modal containers sit on solid `#FFFFFF`.
- **Primary Navy (`#0B2A6F`) & Dark Blue (`#071B4A`):** Anchors primary actions, navigation headers, persistent sidebar backgrounds or active indicators, and high-impact structural UI elements.
- **UEAB Gold (`#F2B705`):** Reserved strictly for high-visibility visual cues: active indicator bars, prominent badges, micro-highlights, and button hover states. It must never be used for long-form body text.
- **Borders & Dividers:** Defined as `#E3E8F0`, offering gentle architectural structure without harsh separation.
- **Text & Typography:** Headings, primary labels, and base body text use high-contrast `#0F172A`. Secondary labels, contextual captions, metadata, and placeholder states use `#5B6475`.
- **Status & Feedback Tokens:**
  - **Success / Done / Active:** `#16A34A` (with a 10% tint background `#DCFCE7`)
  - **Warning / Pending / Soon:** `#F59E0B` (with a 10% tint background `#FEF3C7`)
  - **Critical / Urgent / Danger:** `#DC2626` (with a 10% tint background `#FEE2E2`)

## Typography

Typography relies on **Inter** across all display, body, and micro-copy levels. Inter delivers systematic legibility, neutral geometry, and clear distinction between similar glyphs, which is critical for course codes (e.g., `COSC 311`, `BIOL 112`), room numbers, and academic timetables.

- **Baseline Body:** Standard reading text is locked at `body-lg` (16px / 24px line height) to ensure effortless readability on student tablets, laptops, and hand-held devices.
- **Information Density:** Compact tables and list items use `body-md` (14px) and `label-md` (12px).
- **Numbers and Monospacing:** Timetable schedules, grades, and reference IDs utilize `font-feature-settings: 'tnum' on, 'cv05' on` to keep numeric columns aligned and legible.

## Layout & Spacing

The architecture operates on an 8pt spatial grid system centered on a targeted 1440px desktop container, with a responsive fluid model for lower breakpoints.

### Desktop Canvas Archetype (1440px):
- **Top Header Bar:** 68px fixed height spanning edge-to-edge. Contains UEAB official emblem, bold *Kampas* wordmark, centered expandable global search bar (min-width 360px), quick-action notification bell with unread indicator badge, and user profile avatar pill with status menu.
- **Persistent Left Sidebar:** Fixed width of 260px spanning viewport height below the top bar. Houses primary navigation routes: *Home, Campus, Share, Community, Found, Timetable, Deadlines, Events,* and *Manage*.
- **Content Area:** 12-column layout with 24px (`1.5rem`) gutters and a minimum 32px (`2rem`) outer margin padding inside the main workspace container.

### Responsive Breakpoints:
- **Desktop (≥ 1200px):** Full persistent sidebar (260px) + full top bar.
- **Tablet (768px – 1199px):** Sidebar collapses to a 72px icon-only navigation rail; global search compresses into an icon trigger expandable on click.
- **Mobile (< 768px):** Sidebar converts into a sliding drawer or persistent bottom sheet/tab bar for the top 5 core views (*Home, Timetable, Deadlines, Campus, Events*); top bar shrinks to 56px with a mobile burger trigger and standard 16px (`1rem`) outer canvas margins.

## Elevation & Depth

Visual depth is communicated through crisp **low-contrast outlines** paired with **ambient soft shadows**. Surface hierarchy uses tonal discipline rather than dramatic drops to sustain an orderly academic atmosphere:

- **Level 0 (Canvas):** `#F7F9FC`, flat base.
- **Level 1 (Cards, Modules, Feeds):** `#FFFFFF` surface bounded by a continuous 1px solid `#E3E8F0` border and an ambient shadow: `0px 1px 3px rgba(11, 42, 111, 0.04), 0px 4px 8px rgba(11, 42, 111, 0.02)`.
- **Level 2 (Hovered Cards, Dropdowns, Popovers):** `#FFFFFF` surface, 1px solid `#CBD5E1` border with elevated soft shadow: `0px 4px 12px rgba(7, 27, 74, 0.08), 0px 1px 2px rgba(7, 27, 74, 0.04)`.
- **Level 3 (Modals, Overlays, Dialogs):** `#FFFFFF` surface with `0px 12px 28px rgba(7, 27, 74, 0.14), 0px 4px 8px rgba(7, 27, 74, 0.06)`, framed against a backdrop scrim of `#071B4A` with 40% opacity.

## Shapes

The design system incorporates geometric balance through clean, consistent curvature:
- **Base Surfaces & Cards:** Standardized on `rounded-xl` (12px / 0.75rem to 1rem equivalent in this tier), lending a welcoming feel to dashboard modules and notices while keeping tables and academic logs crisp.
- **Interactive Controls:** Buttons, input fields, select dropdowns, and search controls carry an 8px (`rounded-md` to `rounded-lg`) radius.
- **Chips, Badges, and Status Tags:** Full pill radius (`rounded-full` / 9999px) to distinctly isolate metadata from rectangular content blocks.
- **Touch Targets:** All interactive triggers enforce a minimum bounding box of 44px × 44px regardless of visual padding, strictly honoring mobile usability standards.

## Components

### Buttons
- **Primary:** Solid `#0B2A6F` background with `#FFFFFF` text. On hover, background shifts dynamically to `#F2B705` with `#071B4A` text and subtle scale (`transform: translateY(-1px)`). Active state darkens to `#DDA704`. Minimum height: 44px, horizontal padding: 20px, font weight: 600.
- **Secondary / Outline:** `#FFFFFF` background with 1px border `#0B2A6F`, text `#0B2A6F`. On hover, fills with `#0B2A6F` with 8% opacity tint.
- **Ghost:** Transparent background with `#0B2A6F` or `#5B6475` text; transitions to light neutral fill (`#E2E8F0` at 50%) on hover.

### Inputs & Global Search
- **Height & Bounds:** 44px height, 8px border radius, 1px `#E3E8F0` border, white fill.
- **Focus State:** 2px ring in UEAB Gold `#F2B705` with border color shifting to `#0B2A6F`.
- **Global Search Bar:** Positioned prominently in the top bar. Integrated with a leading Lucide `Search` icon (18px, `#5B6475`) and a trailing keyboard shortcut chip (`⌘K` or `Ctrl+K`).

### Status Chips & Badges
- Pill-shaped tags (`height: 26px`, padding: 2px 10px, 12px text weight: 600).
- **Done / Active:** `#DCFCE7` background, `#16A34A` text, leading filled dot (6px).
- **Soon / Warning:** `#FEF3C7` background, `#D97706` text, leading filled dot (6px).
- **Urgent / Danger:** `#FEE2E2` background, `#DC2626` text, leading filled dot (6px).
- **Academic Category / Tag:** `#EEF2F6` background, `#0B2A6F` text.

### Cards
- Surface: `#FFFFFF`, 12px rounded corners, 1px `#E3E8F0` outline, soft baseline shadow.
- Inner padding: 20px desktop, 16px mobile.
- Section header within cards features a clear title in `headline-sm` or `title-md` (`#0F172A`) paired with an optional top-right contextual action or chip.

### Sidebar Navigation Items
- Container: 44px height, 8px corner radius, flex row layout, 12px horizontal padding.
- Default: `#5B6475` icon and label text.
- Hover: `#F1F5F9` background, `#0B2A6F` text.
- Active: Background tint `#0B2A6F` (10% opacity) or solid `#071B4A`, accompanied by a solid 4px vertical UEAB Gold (`#F2B705`) bar pinned to the left edge, and bold `#0B2A6F` text.

### Selection Controls (Checkboxes & Radios)
- Checkboxes: 20px × 20px, 4px rounded radius, 1.5px border `#CBD5E1`. When selected: solid `#0B2A6F` background with white check mark.
- Radios: 20px × 20px round with concentric `#0B2A6F` dot when active.

### Iconography
- Set to **Lucide Icons** at 20px default for navigation and action icons, 16px for inline text badges. Stroke width locked at 2px for crisp structural legibility across high-DPI and standard campus display panels.