# Bugfix Report — Audit Findings

**Date:** 2026-06-10  
**Source:** Web Application Audit (AUDIT_REPORT.md)

---

## Bug 1 — React Hydration / Nested Button in Admin Tables

**Severity:** Medium — Console errors, potential UI glitches in admin  
**Affected pages:** `/admin/alumni`, `/admin/testimonials`, `/admin/resources`, `/admin/promos`, `/admin/events`

### Root Cause

`DropdownMenuTrigger asChild` from Radix UI was wrapping `Button` from `@base-ui/react`. These two libraries use incompatible `Slot`/`asChild` mechanisms:

- Radix's `Slot` merges its child by cloneElement-ing it
- `@base-ui/react` Button uses its own internal composability mechanism
- This produces a nested `<button>` in the DOM (Base UI renders its own `<button>` while Radix also renders one), plus unknown Radix props leaking to DOM elements

### Fix

Removed `asChild` from `DropdownMenuTrigger` in all 5 affected files. Applied button styles directly via `buttonVariants()` CSS — the same pattern already used in `AdminHeader`:

```tsx
// Before (broken — Base UI + Radix Slot conflict)
<DropdownMenuTrigger asChild>
  <Button variant="ghost" size="icon-sm">
    <MoreHorizontal className="h-4 w-4" />
  </Button>
</DropdownMenuTrigger>

// After (correct — Radix renders its own button, styles via CSS)
<DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon-sm" })}>
  <MoreHorizontal className="h-4 w-4" />
</DropdownMenuTrigger>
```

**Files changed:**
- `apps/web/src/routes/admin/alumni/index.tsx`
- `apps/web/src/routes/admin/testimonials/index.tsx`
- `apps/web/src/routes/admin/resources/index.tsx`
- `apps/web/src/routes/admin/promos/index.tsx`
- `apps/web/src/routes/admin/events/index.tsx`

---

## Bug 2 — Broken Placeholder Image

**Severity:** Low — visual placeholder broken for 1 testimonial entry  
**Affected pages:** `/` (Homepage), `/testimoni`

### Root Cause

Unsplash photo `photo-1580894742597-87bc8789db3d` has been deleted/unpublished from Unsplash, causing a broken image for the 6th testimonial placeholder avatar.

### Fix

Replaced with `photo-1494790108377-be9c29b29330`, a stable Unsplash portrait photo that has been available long-term.

**Files changed:**
- `apps/web/src/routes/index.tsx` (line 259)
- `apps/web/src/routes/testimoni.tsx` (line 61)

---

## Bug 3 — Identical Page Titles (SEO)

**Severity:** Medium — bad for SEO and browser tab UX  
**Affected pages:** All 19 public routes

### Root Cause

Only `__root.tsx` defined a `head()` with a generic title. No individual routes overrode it, so every public page showed the same title: *"Momkiddis Indonesia — Belajar Bahasa Inggris Online"*.

### Fix

Added `head()` with a per-page `title` meta to all 19 public routes:

| Route | New Title |
|-------|-----------|
| `/` | Beranda — Momkiddis Indonesia |
| `/about` | Tentang Kami — Momkiddis Indonesia |
| `/programs` | Program Kursus — Momkiddis Indonesia |
| `/alumni` | Alumni — Momkiddis Indonesia |
| `/testimoni` | Testimoni — Momkiddis Indonesia |
| `/galeri` | Galeri — Momkiddis Indonesia |
| `/mitra` | Mitra — Momkiddis Indonesia |
| `/event` | Event — Momkiddis Indonesia |
| `/jadwal` | Jadwal Kelas — Momkiddis Indonesia |
| `/cara-daftar` | Cara Daftar — Momkiddis Indonesia |
| `/sertifikasi` | Sertifikasi — Momkiddis Indonesia |
| `/metode` | Metode Belajar — Momkiddis Indonesia |
| `/promo` | Promo — Momkiddis Indonesia |
| `/resources` | Resources — Momkiddis Indonesia |
| `/kontak` | Kontak — Momkiddis Indonesia |
| `/faq` | FAQ — Momkiddis Indonesia |
| `/founder` | Founder — Momkiddis Indonesia |
| `/kebijakan-privasi` | Kebijakan Privasi — Momkiddis Indonesia |
| `/syarat-ketentuan` | Syarat & Ketentuan — Momkiddis Indonesia |

---

## Summary

| # | Bug | Files Changed | Status |
|---|-----|---------------|--------|
| 1 | Nested button / hydration error in admin tables | 5 files | ✅ Fixed |
| 2 | Broken Unsplash placeholder image | 2 files | ✅ Fixed |
| 3 | All pages same browser title (SEO) | 19 files | ✅ Fixed |
