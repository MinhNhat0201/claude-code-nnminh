# My Book Vault — Framer Setup Guide

Follow these steps in order after adding `BookShelf.tsx` to your Framer project.

---

## Step 1 — Add BookShelf.tsx to Framer

1. In Framer: **Assets panel → Code → + New File**
2. Name it `BookShelf`
3. Paste the full contents of `framer/BookShelf.tsx` from this repo
4. Save — the component appears under **Code Components** in the Assets panel

---

## Step 2 — Connect Notion CMS

1. **Plugins → Marketplace → search "Notion" → Install**
2. Open the Notion plugin → **Connect to Notion** → authorize your book database
3. Map fields:
   - Title → `title`
   - Author → `author`
   - Cover (Files & Media) → `cover`
   - Genre (Multi-select) → `genre`
   - Status (Select) → `status`
   - Notes → `notes`
   - Spine Color (Select, optional) → `spineColor`
4. Click **Create CMS Collection** then **Sync**

---

## Step 3 — Create "My Book Vault" Page

1. Pages panel → **+** → **New Page**
   - Name: `My Book Vault`
   - Slug: `/library`
2. Set page background to a dark color (e.g. `#0E0E12`)
3. Add a page header frame at the top:
   - Heading: `My Book Vault`
   - Subheading: `Books I've read, loved, and lived through`
4. Drag `BookShelf` from Assets onto the page — fill the lower portion of the canvas
5. In the right panel set:
   - `previewMode`: Off
   - `idleDrift`: On
   - `maxBooks`: 0 (show all)
6. Connect `books` data: in the component's props, link each field to the CMS collection
   (Title → `title`, Author → `author`, Cover → `coverImage`, Status → `status`,
   Genre → `genre`, Notes → `notes`, Spine Color → `spineColor`)

---

## Step 4 — Homepage "Recent Reads" Preview Section

Add a new section on the **Homepage**, below the **About Me** section:

1. Insert a new Frame (full-width, ~380px tall)
2. Add a text layer: heading `Recently on my shelf`, subheading `What I've been reading lately`
3. Drag a second instance of `BookShelf` into the frame:
   - `previewMode`: **On**
   - `maxBooks`: **6**
   - `previewHref`: `/library`
   - `idleDrift`: On
   - Connect the same CMS collection, sorted by **Created date descending**
4. Below the shelf, add a button:
   - Label: `See My Full Library →`
   - Link: `/library` (internal)
   - Style: match your site's secondary button style

---

## Step 5 — Sidebar Navigation Item

1. Open your shared **Nav / Sidebar** component
2. Add a new nav link item:
   - Label: `My Book Vault`
   - Link: `/library`
   - (Optional) Icon: an open-book SVG placed before the label
3. Position it after the main nav links
4. Save — syncs across all pages automatically

---

## Step 6 — Homepage Hero CTA

1. Open the **Homepage** in the Framer canvas
2. In the **Hero section**, add a button alongside or below the existing CTA:
   - Label: `See What I'm Reading`
   - Link: `/library`
   - Style: ghost / outline (secondary) to avoid competing with your primary CTA
3. On mobile breakpoint: stack the buttons vertically

---

## CMS Data Shape Reference

When passing `books` to the `BookShelf` component, each item should conform to:

```ts
{
  id: string           // unique — use CMS item slug or ID
  title: string
  author?: string
  spineColor?: string  // hex color; falls back to auto-assigned palette color
  coverImage?: string  // image URL from CMS
  status?: string      // e.g. "Finished", "Reading", "Want to Read"
  genre?: string       // first genre tag displayed in detail panel
  notes?: string       // personal review or summary
}
```

---

## Verification Checklist

### Shelf animation
- [ ] Books render as upright spines in a diagonal isometric row
- [ ] Heights vary per book (180–240px)
- [ ] Shelf has visible tilt (rotateX 15°)
- [ ] Idle drift oscillates the whole row slowly (±3px, 4s loop)
- [ ] Hovering a book lifts it slightly
- [ ] Clicking: book lifts → rotates to cover-facing → detail panel slides in
- [ ] "← Back to shelf" reverses the animation correctly

### Horizontal scroll
- [ ] Row scrolls horizontally when books exceed viewport width
- [ ] Scrollbar is hidden
- [ ] Desktop: drag left/right to scroll
- [ ] Mobile: swipe left/right works

### Homepage preview
- [ ] Shows 6 newest books only
- [ ] Clicking any book navigates to `/library` (no inline detail panel)
- [ ] "See My Full Library →" CTA links to `/library`

### Navigation
- [ ] "My Book Vault" in sidebar links to `/library`
- [ ] "See What I'm Reading" hero CTA links to `/library`
