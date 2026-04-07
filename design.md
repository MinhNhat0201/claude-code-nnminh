# MISA Design System Reference

> Source: `📏 Space` collection (Space Tokens) + UI Colors + Typography + MISA Application Tokens.
> This file is referenced by the Design Lead Agent to apply correct tokens when designing screens.

---

## 1. Space Tokens — Component & Pattern Level

Three density modes: **Standard**, **Compact**, **Comfortable**.

> **Responsive mapping** — density modes are automatically applied based on viewport width:
>
> | Viewport | Density Mode |
> |----------|-------------|
> | < 768px (mobile) | Compact |
> | 768px – 1279px (tablet) | Standard |
> | ≥ 1280px (desktop) | Comfortable |
>
> All px values are design-time constants. Components must respect a **minimum touch target of 44×44px** regardless of visual size — use transparent padding to extend hit areas for small components (e.g. Button Small, Icon Button, Checkbox, Radio Button, Toggle Switch). See also: WCAG 2.5.5.

---

### Components

#### Accordion

| Token | Standard | Compact | Comfortable |
|-------|----------|---------|-------------|
| Padding-Horizontal | 16 | 16 | 20 |
| Padding-Vertical | 16 | 16 | 20 |
| Gap-Body | 12 | 12 | 16 |
| Gap-Container | 12 | 12 | 16 |
| Gap-Accordion | 12 | 12 | 16 |

#### Alert — Inline Alert

| Token | Standard | Compact | Comfortable |
|-------|----------|---------|-------------|
| Padding-Horizontal | 12 | 12 | 16 |
| Padding-Vertical | 12 | 12 | 16 |
| Gap-Alert | 12 | 12 | 16 |
| Gap-Container | 12 | 12 | 16 |
| Gap-Content | 8 | 8 | 12 |

#### Avatar

| Token | Standard | Compact | Comfortable |
|-------|----------|---------|-------------|
| Gap-Text | 8 | 8 | 8 |
| Size-12 | 12 | 12 | 16 |
| Size-16 | 16 | 16 | 20 |
| Size-20 | 20 | 20 | 24 |
| Size-24 | 24 | 24 | 28 |

#### Button — Small

> ⚠️ Visual height is below 44px in all density modes. Implement an invisible padding area (via `::after` or wrapper) to ensure touch target ≥ 44×44px.

| Token | Standard | Compact | Comfortable |
|-------|----------|---------|-------------|
| Fix-Height | 28 | 24 | 32 |
| Fix-Width | 28 | 24 | 32 |
| Min-Width | 56 | 48 | 64 |
| Touch-Target-Min | 44 | 44 | 44 |
| Padding-Text-Horizontal | 12 | 8 | 12 |
| Padding-Icon-Horizontal | 6 | 4 | 8 |
| Gap-Content | 8 | 4 | 8 |
| Gap-Button-Group | 8 | 4 | 8 |

#### Button — Medium

| Token | Standard | Compact | Comfortable |
|-------|----------|---------|-------------|
| Fix-Height | 32 | 28 | 36 |
| Fix-Width | 32 | 28 | 36 |
| Min-Width | 84 | 80 | 96 |
| Min-Width Split | 56 | 48 | 60 |
| Touch-Target-Min | 44 | 44 | 44 |
| Padding-Text-Horizontal | 12 | 12 | 16 |
| Padding-Icon-Horizontal | 8 | 6 | 8 |
| Gap-Content | 8 | 8 | 8 |
| Gap-Button-Group | 8 | 8 | 8 |

#### Checkbox

> ⚠️ Visual Size (16–20px) is below 44px. Extend touch target via padding.

| Token | Standard | Compact | Comfortable |
|-------|----------|---------|-------------|
| Gap-Text | 8 | 8 | 8 |
| Gap-Horizontal-Group | 24 | 24 | 32 |
| Gap-Vertical-Group | 8 | 8 | 12 |
| Size | 16 | 16 | 20 |
| Touch-Target-Min | 44 | 44 | 44 |

#### Chip — Medium

| Token | Standard | Compact | Comfortable |
|-------|----------|---------|-------------|
| Fix-Height | 28 | 24 | 32 |
| Padding-Text-Horizontal | 8 | 8 | 8 |
| Padding-Avatar-Horizontal | 6 | 4 | 6 |
| Gap-Content | 8 | 8 | 8 |
| Gap-Chip-Group | 4 | 4 | 8 |

#### Input

| Token | Standard | Compact | Comfortable |
|-------|----------|---------|-------------|
| Fix-Height | 32 | 28 | 36 |
| Fix-Width | 32 | 28 | 36 |
| Min-Width-TextBox | 80 | 80 | 96 |
| Padding-Icon-Horizontal | 8 | 8 | 8 |
| Padding-Text-Horizontal | 12 | 12 | 12 |
| Padding-Text-Vertical | 8 | 6 | 10 |
| Gap-Content | 8 | 8 | 8 |
| Gap-Label-Horizontal | 8 | 8 | 8 |
| Gap-Label-Vertical | 8 | 4 | 8 |
| Gap-Input-Vertical | 16 | 8 | 20 |
| Gap-Input-Horizontal | 12 | 8 | 16 |
| Gap-Input-Group-Vertical | 24 | 16 | 24 |

#### Menu List

| Token | Standard | Compact | Comfortable |
|-------|----------|---------|-------------|
| Fix-Height-1-Line | 32 | 28 | 36 |
| Fix-Height-2-Line | 48 | 44 | 52 |
| Min-Width | 80 | 80 | 96 |
| Padding-Text-Horizontal | 12 | 12 | 16 |
| Padding-Vertical | 8 | 6 | 12 |
| Gap-Content | 8 | 8 | 8 |

#### Tag — Small

| Token | Standard | Compact | Comfortable |
|-------|----------|---------|-------------|
| Fix-Height | 24 | 20 | 28 |
| Padding-Text-Horizontal | 8 | 8 | 8 |
| Gap-Content | 6 | 4 | 6 |
| Gap-Tag-Group | 4 | 4 | 4 |

#### Tag — Medium

| Token | Standard | Compact | Comfortable |
|-------|----------|---------|-------------|
| Fix-Height | 28 | 24 | 32 |
| Padding-Text-Horizontal | 8 | 8 | 12 |
| Gap-Content | 4 | 4 | 8 |
| Gap-Tag-Group | 4 | 4 | 8 |

#### Tabs — Medium

| Token | Standard | Compact | Comfortable |
|-------|----------|---------|-------------|
| Fix-Height | 32 | 28 | 36 |
| Fix-Height-Underline | 40 | 36 | 44 |
| Padding-Horizontal | 12 | 12 | 20 |
| Padding-Vertical | 8 | 8 | 12 |
| Gap-Content | 8 | 8 | 8 |
| Gap-Tabs | 8 | 8 | 8 |

#### Toggle Switch

> ⚠️ Visual height (16–20px) is below 44px. Extend touch target via padding.

| Token | Standard | Compact | Comfortable |
|-------|----------|---------|-------------|
| Height | 16 | 16 | 20 |
| Width | 28 | 28 | 36 |
| Selector | 12 | 12 | 16 |
| Touch-Target-Min | 44 | 44 | 44 |

---

### Patterns

#### Button Bar

| Token | Standard | Compact | Comfortable |
|-------|----------|---------|-------------|
| Padding-Horizontal | 16 | 16 | 20 |
| Padding-Vertical | 12 | 8 | 16 |
| Gap-Container | 16 | 12 | 20 |

#### Card

| Token | Standard | Compact | Comfortable |
|-------|----------|---------|-------------|
| Padding-Horizontal | 16 | 16 | 20 |
| Padding-Vertical | 16 | 16 | 20 |
| Gap-Body | 12 | 8 | 16 |
| Gap-Container | 16 | 12 | 20 |

#### DataTable

| Token | Standard | Compact | Comfortable |
|-------|----------|---------|-------------|
| Fix-Height-Cell-1-Line | 36 | 32 | 40 |
| Fix-Height-Cell-2-Line | 56 | 52 | 60 |
| Fix-Height-Header-1-Row | 44 | 44 | 44 |
| Fix-Height-Footer | 36 | 32 | 40 |
| Padding-Horizontal | 4 | 4 | 4 |
| Min-Width-Column | 44 | 44 | 48 |

#### Dialog

| Token | Standard | Compact | Comfortable |
|-------|----------|---------|-------------|
| Padding-Horizontal | 24 | 16 | 20 |
| Padding-Vertical | 16 | 16 | 20 |
| Gap-Body | 12 | 12 | 16 |
| Gap-Container | 16 | 16 | 20 |

#### Form

| Token | Standard | Compact | Comfortable |
|-------|----------|---------|-------------|
| Padding-Horizontal | 24 | 16 | 20 |
| Padding-Vertical | 16 | 12 | 20 |
| Gap-Body-Vertical | 16 | 12 | 20 |
| Gap-Body-Horizontal | 32 | 28 | 36 |

#### Side Bar

| Token | Standard | Compact | Comfortable |
|-------|----------|---------|-------------|
| Padding-Horizontal | 16 | 12 | 16 |
| Padding-Vertical | 16 | 12 | 16 |
| Gap | 8 | 8 | 12 |

---

## 2. Chart Colors

Three palette modes: **Palette**, **Single Hue**, **Divergent**. Each contains 10 color families with 7 stops.

> **Dark mode usage note:** Light stops (positions 6–7) may produce insufficient contrast against dark surfaces. When rendering charts in dark mode, prefer stops 1–5 and validate at ≥ 3:1 contrast.

### Palette Mode

| Family | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|--------|---|---|---|---|---|---|---|
| Blue | `#4584ec` | `#ad63e1` | `#f157c0` | `#ff5f96` | `#ff7e6d` | `#ffa54d` | `#ffcc42` |
| Green | `#19b070` | `#4d9a3e` | `#759a28` | `#989815` | `#bb9311` | `#db8c24` | `#f9823e` |
| Teal | `#15b79e` | `#4bb882` | `#72b765` | `#97b34b` | `#bbac39` | `#dea137` | `#ff9248` |
| Indigo | `#6172f3` | `#c465df` | `#fd5dbc` | `#ff6994` | `#ff876f` | `#ffab54` | `#ffce4e` |
| Orange | `#fd853a` | `#dc9829` | `#baa52f` | `#98ae45` | `#77b463` | `#59b681` | `#43b69c` |

### Single Hue Mode

| Family | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|--------|---|---|---|---|---|---|---|
| Blue | `#4584ec` | `#5481f2` | `#7693f5` | `#93a6f8` | `#adb9fb` | `#c5ccfd` | `#dce0ff` |
| Green | `#19b070` | `#3ca669` | `#5cb47c` | `#78c291` | `#92d0a5` | `#acdebb` | `#c5ecd0` |
| Teal | `#15b79e` | `#43c0a9` | `#5fc9b4` | `#77d2bf` | `#8ddbca` | `#a3e4d5` | `#b7ede0` |
| Indigo | `#6172f3` | `#7d83f5` | `#9494f8` | `#a9a6fa` | `#bdb8fc` | `#d0cbfd` | `#e2deff` |
| Orange | `#fd853a` | `#ff9451` | `#ffa268` | `#ffb07e` | `#ffbe95` | `#ffccac` | `#ffdac4` |

---

## 3. UI Colors

Two modes: **Light** and **Dark**.

### Base — Neutral Scale

| Token | Light | Dark |
|-------|-------|------|
| `Neutral/50` | `#f6f6f6` | `#1c1c1c` |
| `Neutral/100` | `#e7e7e7` | `#3d3d3d` |
| `Neutral/200` | `#d1d1d1` | `#454545` |
| `Neutral/300` | `#b0b0b0` | `#4f4f4f` |
| `Neutral/400` | `#888888` | `#5d5d5d` |
| `Neutral/500` | `#6d6d6d` | `#939393` |
| `Neutral/600` | `#5d5d5d` | `#888888` |
| `Neutral/700` | `#4f4f4f` | `#b0b0b0` |
| `Neutral/800` | `#454545` | `#d1d1d1` |
| `Neutral/900` | `#3d3d3d` | `#e7e7e7` |
| `Neutral/950` | `#1f1f1f` | `#f6f6f6` |

### Base — Brand

| State | Light | Dark |
|-------|-------|------|
| Default | `#ea580c` | `#f97316` |
| Hover | `#c2490a` | `#fb923c` |
| Pressed | `#9b3a08` | `#fdba74` |
| Disabled | `#fef0e7` | `#4c3a31` |
| Light Hover | `#fddece` | `#4c3a31` |

### Base — Accent

| State | Light | Dark |
|-------|-------|------|
| Default | `#7c3aed` | `#a78bfa` |
| Hover | `#6d28d9` | `#c4b5fd` |
| Pressed | `#5b21b6` | `#ddd6fe` |

### Base — Info

| State | Light | Dark |
|-------|-------|------|
| Default | `#2563eb` | `#173763` |
| Hover | `#1d4ed8` | `#122d58` |
| Pressed | `#1e40af` | `#0f2550` |
| Light Hover | `#dbeafe` | `#2f3c52` |

### Base — Warning

| State | Light | Dark |
|-------|-------|------|
| Default | `#d97706` | `#fb923c` |
| Hover | `#b45309` | `#fdba74` |
| Pressed | `#92400e` | `#fcd34d` |
| Light Hover | `#fffbeb` | `#78350f` |

### Base — Danger

| State | Light | Dark |
|-------|-------|------|
| Default | `#dc2626` | `#3e0f0f` |
| Hover | `#b91c1c` | `#2a0b0b` |
| Pressed | `#991b1b` | `#220909` |
| Light Hover | `#fee2e2` | `#6b1c1c` |

### Base — Success

| State | Light | Dark |
|-------|-------|------|
| Default | `#16a34a` | `#0c1f14` |
| Hover | `#15803d` | `#0a1a11` |
| Pressed | `#166534` | `#071509` |
| Light Hover | `#dcfce7` | `#3d6a50` |

### Semantic — Text

| Token | Light | Dark |
|-------|-------|------|
| Primary Neutral | `#1f1f1f` | `#f6f6f6` |
| Secondary Neutral | `#5d5d5d` | `#b0b0b0` |
| Hint Neutral | `#6d6d6d` | `#939393` |
| Disabled Neutral | `#888888` | `#5d5d5d` |
| White | `#ffffff` | `#292828` |
| Brand | `#ea580c` | `#f97316` |
| Danger | `#dc2626` | `#3e0f0f` |
| Warning | `#d97706` | `#fb923c` |
| Success | `#166534` | `#0c1f14` |
| Accent | `#7c3aed` | `#a78bfa` |

### Semantic — Background (BG)

| Token | Light | Dark |
|-------|-------|------|
| Page | `#e7e7e7` | `#3d3d3d` |
| White | `#ffffff` | `#292828` |
| Brand | `#ea580c` | `#f97316` |
| Success | `#16a34a` | `#4b7f61` |
| Danger | `#dc2626` | `#a42828` |
| Warning | `#d97706` | `#6e4c21` |
| Info | `#2563eb` | `#4b5b7e` |

---

## 4. Spacing

Three density modes: **Compact**, **Standard**, **Comfortable**.

### Border Radius

| Token | Compact | Standard | Comfortable |
|-------|---------|----------|-------------|
| Default | 6 | 8 | 8 |
| Small | 2 | 4 | 4 |
| Inner | 4 | 6 | 6 |
| Focus | 8 | 12 | 12 |
| Pill | 9999 | 9999 | 9999 |
| Dialog / Card / Popover | 8 | 12 | 12 |

### Font Size (px)

| Token | Compact | Standard | Comfortable |
|-------|---------|----------|-------------|
| H1 — Banner Title | 20 | 24 | 24 |
| H2 — App / Page Title | 16 | 20 | 24 |
| H3 — Form / Card / Section Title | 15 | 16 | 20 |
| Body Large | 15 | 16 | 16 |
| Body Regular | 14 | 14 | 14 |
| Body Small | 12 | 12 | 12 |
| Caption | 12 | 12 | 12 |
| Overline | 12 | 12 | 12 |

### Line Height (px)

| Token | Compact | Standard | Comfortable |
|-------|---------|----------|-------------|
| H1 — Page Title | 32 | 36 | 36 |
| H2 — Section Title | 21 | 28 | 32 |
| H3 — Card Title | 22 | 22 | 28 |
| Body Large | 20 | 20 | 20 |
| Body Regular | 18 | 18 | 18 |
| Body Small | 18 | 18 | 18 |
| Caption | 18 | 18 | 18 |

---

## 5. Typography

### Font Family

| Role | Value |
|------|-------|
| Display | Inter |
| Heading | Inter |
| Body | Inter |
| Caption | Inter |

### Font Weight

| Token | Value |
|-------|-------|
| Regular | Regular |
| Medium | Medium |
| Semi-Bold | Semi Bold |
| Bold | Bold |

---

## 6. MISA Application Tokens

### 6.1 Colors

| Token | Value | Notes |
|-------|-------|-------|
| Brand Color | `#EA580C` | `Base.Brand.Default` (Light) |
| Brand Light | `#FEF0E7` | `Base.Brand.Disabled` (Light) |
| Warning Color | `#D97706` | Amber — distinct from Brand |
| Warning Light | `#FFFBEB` | `Base.Warning.Light Hover` |
| Neutral Border | `#D1D1D1` | `Base.Neutral.200` |
| Neutral Border Light | `#E7E7E7` | `Base.Neutral.100` |
| Icon Neutral | `#5D5D5D` | `Base.Neutral.600` |
| Text Primary | `#1F1F1F` | `Base.Neutral.950` |
| Text Secondary | `#5D5D5D` | `Base.Neutral.600` |
| Text Hint | `#6D6D6D` | `Base.Neutral.500` (AA: 5.7:1) |
| Background Page | `#F0F2F4` | MISA-specific |
| Background Container | `#FCFCFC` | MISA-specific |

### 6.2 Typography — MISA Application Scale

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| H1 — Welcome / Banner | 28px | Semibold | 40px |
| H2 — Section Title | 20px | Semibold | 30px |
| H3 — Card Title | 16px | Semibold | 24px |
| Body Regular | 14px | Regular | 21px |
| Body Small | 12px | Regular | 18px |

Font family: **Inter**.

### 6.3 Spacing & Radius — MISA Application Defaults

| Token | Value | Notes |
|-------|-------|-------|
| Control Height | 32px | Standard input/button height |
| Touch Target Min | 44px | WCAG 2.5.5 AA — all interactive controls |
| Border Radius — Standard | 8px | Inputs, buttons |
| Border Radius — Large / Card | 12px | Cards, dialogs, popovers |
| Button Min Width | 84px | MISA override (Figma primitive: 80px) |
| Standard Margin | 16px | Page-level margins |

---

## 7. MISA Components

### 7.1 Buttons

| Variant | Background | Border | Text | Height | Radius |
|---------|-----------|--------|------|--------|--------|
| Primary | `#EA580C` (Brand) | — | White `#FFFFFF` | 32px | 8px |
| Secondary | `#FFFFFF` | `1px #D1D1D1` | `#1F1F1F` | 32px | 8px |
| Icon Button | Transparent | — | — | 32×32px | 8px |

- Icon Button hover: background `#FEF0E7` (Brand Light).
- All variants: invisible hit area **44×44px min** via `::after` or wrapper.

### 7.2 Containers & Cards

#### MISA Container

| Property | Value |
|----------|-------|
| Border Radius | 12px |
| Box Shadow | `0 0 1px 0 rgba(0,0,0,0.10), 0 0 2px 0 rgba(0,0,0,0.10)` |
| Background | `#FCFCFC` |

#### MISA Card

| Property | Value |
|----------|-------|
| Border Radius | 12px |
| Box Shadow | `0 4px 16px 0 rgba(0,0,0,0.04)` |
| Background | `#FFFFFF` |

### 7.3 Chat Composer

| Property | Value |
|----------|-------|
| Background | White |
| Border Radius | 24px |
| Min-Height | 132px |
| Max-Height | 320px |
| Animated Border | Rotating conic gradient `#50BEFF` → `#EE5DFF`, 6s linear infinite |

---

## 8. Layout Structure

### 8.1 Header

| Property | Value |
|----------|-------|
| Height | 48px |
| Background | `#FFFFFF` |
| Position | Fixed, full width |

### 8.2 Sidebar

| Property | Value |
|----------|-------|
| Min Width | 220px |
| Mobile State | Collapsed (off-canvas) at viewport < 768px |
| Active State BG | `#FEF0E7` (Brand Light) |
| Active State Text/Icon | `#EA580C` (Brand) |
| Inactive State BG | `#FFFFFF` |
| Inactive Icon | `#5D5D5D` |
| Inactive Text | `#1F1F1F` |

### 8.3 Main Content Area

| Property | Value |
|----------|-------|
| Background | `#F0F2F4` (page) / `#FCFCFC` (container) |
| Padding (Internal) | 8px |
| Gap (Between Panels) | 8px |
| Margin Around | 8px |

---

## 9. Interactive Effects

### 9.1 Spotlight Hover Effect

| Property | Value |
|----------|-------|
| Dot Grid | 32×32px, color `#F6F6F6` |
| Radial gradient mask | Follows cursor |
| Opacity (hover) | 0.8 |
| Radius (hover) | 200px |
| Transition | 0.6s ease |

> Wrap in `@media (prefers-reduced-motion: no-preference)`.

### 9.2 Animated Border

| Property | Value |
|----------|-------|
| Type | Rotating conic gradient |
| Colors | `#50BEFF` → `#EE5DFF` |
| Animation | 6s linear infinite |

> Wrap in `@media (prefers-reduced-motion: no-preference)`.

---

## 10. Charts & Data Visualization

| Property | Value |
|----------|-------|
| Library | ECharts |
| Style | Modern, clean, brand-aligned |
| Preferred Chart Type | Donut (over standard pie) |
| Max Donut Segments | 6 |
| Color Palette | See Section 2 — Chart Colors |

> **Dark mode for charts:** Use stops 1–5 from chart color families on dark surfaces. Validate all chart colors at ≥ 3:1 contrast before release.

---

## Quick Reference — Most Used Tokens

| Purpose | Value |
|---------|-------|
| Primary Brand | `#EA580C` |
| Brand Light (bg hover) | `#FEF0E7` |
| Page Background | `#F0F2F4` |
| Container Background | `#FCFCFC` |
| Card Background | `#FFFFFF` |
| Text Primary | `#1F1F1F` |
| Text Secondary | `#5D5D5D` |
| Text Hint | `#6D6D6D` |
| Border | `#D1D1D1` |
| Border Light | `#E7E7E7` |
| Control Height | 32px |
| Touch Target | 44px |
| Card Radius | 12px |
| Button Radius | 8px |
| Header Height | 48px |
| Sidebar Width | 220px |
| Font | Inter |
| H1 App | 28px / Semibold |
| H2 Section | 20px / Semibold |
| H3 Card | 16px / Semibold |
| Body | 14px / Regular |
