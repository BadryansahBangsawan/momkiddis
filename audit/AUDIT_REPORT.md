# Web Application Audit Report

**Generated:** 2026-06-10 18:39:36  
**Base URL:** http://localhost:3001  
**Total Pages Tested:** 31  

## Summary

| Category | Count |
|----------|-------|
| ✅ OK | 31 |
| ⚠️ Warnings | 0 |
| ❌ Errors/Failed | 0 |
| ⏭️ Skipped | 0 |
| **Total** | **31** |

## Admin Authentication

✅ **Status:** Login successful — at http://localhost:3001/admin

## Public Routes

| Status | Page | URL | Load Time | HTTP | Broken Images | Notes |
|--------|------|-----|-----------|------|---------------|-------|
| ✅ | Homepage | `/` | 1090ms | 200 | 1 | Internal links: 28 |
| ✅ | About | `/about` | 617ms | 200 | 0 | Internal links: 20 |
| ✅ | Programs | `/programs` | 597ms | 200 | 0 | Internal links: 24 |
| ✅ | Alumni | `/alumni` | 594ms | 200 | 0 | Internal links: 19 |
| ✅ | Testimoni | `/testimoni` | 715ms | 200 | 1 | Internal links: 19 |
| ✅ | Galeri | `/galeri` | 3841ms | 200 | 0 | Internal links: 19 |
| ✅ | Mitra | `/mitra` | 596ms | 200 | 0 | Internal links: 19 |
| ✅ | Event | `/event` | 610ms | 200 | 0 | Internal links: 19 |
| ✅ | Jadwal | `/jadwal` | 600ms | 200 | 0 | Internal links: 24 |
| ✅ | Cara Daftar | `/cara-daftar` | 590ms | 200 | 0 | Internal links: 21 |
| ✅ | Sertifikasi | `/sertifikasi` | 598ms | 200 | 0 | Internal links: 20 |
| ✅ | Metode | `/metode` | 591ms | 200 | 0 | Internal links: 19 |
| ✅ | Promo | `/promo` | 639ms | 200 | 0 | Internal links: 19 |
| ✅ | Resources | `/resources` | 671ms | 200 | 0 | Internal links: 19 |
| ✅ | Kontak | `/kontak` | 705ms | 200 | 0 | Internal links: 19 |
| ✅ | FAQ | `/faq` | 664ms | 200 | 0 | Internal links: 19 |
| ✅ | Founder | `/founder` | 621ms | 200 | 0 | Internal links: 21 |
| ✅ | Kebijakan Privasi | `/kebijakan-privasi` | 593ms | 200 | 0 | Internal links: 19 |
| ✅ | Syarat & Ketentuan | `/syarat-ketentuan` | 597ms | 200 | 0 | Internal links: 19 |

## Admin Routes

| Status | Page | URL | Load Time | HTTP | Broken Images | Notes |
|--------|------|-----|-----------|------|---------------|-------|
| ✅ | Admin Dashboard | `/admin` | 200ms | — | 0 | Internal links: 15 |
| ✅ | Admin Testimonials | `/admin/testimonials` | 47ms | — | 0 | Actual URL: http://localhost:3001/admin/testimonials |
| ✅ | Admin Alumni | `/admin/alumni` | 140ms | — | 0 | Actual URL: http://localhost:3001/admin/alumni |
| ✅ | Admin Gallery | `/admin/gallery` | 42ms | — | 0 | Actual URL: http://localhost:3001/admin/gallery |
| ✅ | Admin Events | `/admin/events` | 41ms | — | 0 | Actual URL: http://localhost:3001/admin/events |
| ✅ | Admin Resources | `/admin/resources` | 44ms | — | 0 | Actual URL: http://localhost:3001/admin/resources |
| ✅ | Admin Promos | `/admin/promos` | 58ms | — | 0 | Actual URL: http://localhost:3001/admin/promos |
| ✅ | Admin Contacts | `/admin/contacts` | 44ms | — | 0 | Actual URL: http://localhost:3001/admin/contacts |
| ✅ | Admin Activity | `/admin/activity` | 42ms | — | 0 | Actual URL: http://localhost:3001/admin/activity |
| ✅ | Admin Users | `/admin/users` | 42ms | — | 0 | Actual URL: http://localhost:3001/admin/users |
| ✅ | Admin Site Config | `/admin/site-config` | 43ms | — | 0 | Actual URL: http://localhost:3001/admin/site-config |
| ✅ | Admin Settings | `/admin/settings` | 42ms | — | 0 | Actual URL: http://localhost:3001/admin/settings |

## Console Errors & Warnings

### Admin Alumni (`/admin/alumni`)

- **ERROR**: In HTML, %s cannot be a descendant of <%s>.
This will cause a hydration error.%s <button> button 

  ...
    <TableBody>
      <tbody data-slot="table-body" className={"[&_tr:la..."}>
        <TableRo
- **ERROR**: <%s> cannot contain a nested %s.
See this log for the ancestor stack trace. button <button>
- **ERROR**: React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from

## Network / HTTP Errors

No network errors detected.

## Broken Images

### Homepage (`/`)

- `https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=200&h=200&fit=crop&q=80`

### Testimoni (`/testimoni`)

- `https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=200&h=200&fit=crop&q=80`

## Performance

| Page | URL | Load Time | Status |
|------|-----|-----------|--------|
| Galeri | `/galeri` | 3841ms 🟡 | ✅ |
| Homepage | `/` | 1090ms | ✅ |
| Testimoni | `/testimoni` | 715ms | ✅ |
| Kontak | `/kontak` | 705ms | ✅ |
| Resources | `/resources` | 671ms | ✅ |
| FAQ | `/faq` | 664ms | ✅ |
| Promo | `/promo` | 639ms | ✅ |
| Founder | `/founder` | 621ms | ✅ |
| About | `/about` | 617ms | ✅ |
| Event | `/event` | 610ms | ✅ |
| Jadwal | `/jadwal` | 600ms | ✅ |
| Sertifikasi | `/sertifikasi` | 598ms | ✅ |
| Programs | `/programs` | 597ms | ✅ |
| Syarat & Ketentuan | `/syarat-ketentuan` | 597ms | ✅ |
| Mitra | `/mitra` | 596ms | ✅ |
| Alumni | `/alumni` | 594ms | ✅ |
| Kebijakan Privasi | `/kebijakan-privasi` | 593ms | ✅ |
| Metode | `/metode` | 591ms | ✅ |
| Cara Daftar | `/cara-daftar` | 590ms | ✅ |
| Admin Dashboard | `/admin` | 200ms | ✅ |
| Admin Alumni | `/admin/alumni` | 140ms | ✅ |
| Admin Promos | `/admin/promos` | 58ms | ✅ |
| Admin Testimonials | `/admin/testimonials` | 47ms | ✅ |
| Admin Resources | `/admin/resources` | 44ms | ✅ |
| Admin Contacts | `/admin/contacts` | 44ms | ✅ |
| Admin Site Config | `/admin/site-config` | 43ms | ✅ |
| Admin Gallery | `/admin/gallery` | 42ms | ✅ |
| Admin Activity | `/admin/activity` | 42ms | ✅ |
| Admin Users | `/admin/users` | 42ms | ✅ |
| Admin Settings | `/admin/settings` | 42ms | ✅ |
| Admin Events | `/admin/events` | 41ms | ✅ |

## Page Titles

| Page | URL | Title |
|------|-----|-------|
| Homepage | `/` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| About | `/about` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Programs | `/programs` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Alumni | `/alumni` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Testimoni | `/testimoni` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Galeri | `/galeri` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Mitra | `/mitra` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Event | `/event` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Jadwal | `/jadwal` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Cara Daftar | `/cara-daftar` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Sertifikasi | `/sertifikasi` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Metode | `/metode` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Promo | `/promo` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Resources | `/resources` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Kontak | `/kontak` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| FAQ | `/faq` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Founder | `/founder` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Kebijakan Privasi | `/kebijakan-privasi` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Syarat & Ketentuan | `/syarat-ketentuan` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Admin Dashboard | `/admin` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Admin Testimonials | `/admin/testimonials` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Admin Alumni | `/admin/alumni` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Admin Gallery | `/admin/gallery` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Admin Events | `/admin/events` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Admin Resources | `/admin/resources` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Admin Promos | `/admin/promos` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Admin Contacts | `/admin/contacts` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Admin Activity | `/admin/activity` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Admin Users | `/admin/users` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Admin Site Config | `/admin/site-config` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |
| Admin Settings | `/admin/settings` | Momkiddis Indonesia — Belajar Bahasa Inggris Online |

## Screenshots

All screenshots saved in `/Users/bbbadry/Downloads/momkiddis/audit/screenshots/`

- **Homepage** → `screenshots/homepage.png`
- **About** → `screenshots/about.png`
- **Programs** → `screenshots/programs.png`
- **Alumni** → `screenshots/alumni.png`
- **Testimoni** → `screenshots/testimoni.png`
- **Galeri** → `screenshots/galeri.png`
- **Mitra** → `screenshots/mitra.png`
- **Event** → `screenshots/event.png`
- **Jadwal** → `screenshots/jadwal.png`
- **Cara Daftar** → `screenshots/caradaftar.png`
- **Sertifikasi** → `screenshots/sertifikasi.png`
- **Metode** → `screenshots/metode.png`
- **Promo** → `screenshots/promo.png`
- **Resources** → `screenshots/resources.png`
- **Kontak** → `screenshots/kontak.png`
- **FAQ** → `screenshots/faq.png`
- **Founder** → `screenshots/founder.png`
- **Kebijakan Privasi** → `screenshots/kebijakanprivasi.png`
- **Syarat & Ketentuan** → `screenshots/syaratketentuan.png`
- **Admin Dashboard** → `screenshots/admin.png`
- **Admin Testimonials** → `screenshots/admin_testimonials.png`
- **Admin Alumni** → `screenshots/admin_alumni.png`
- **Admin Gallery** → `screenshots/admin_gallery.png`
- **Admin Events** → `screenshots/admin_events.png`
- **Admin Resources** → `screenshots/admin_resources.png`
- **Admin Promos** → `screenshots/admin_promos.png`
- **Admin Contacts** → `screenshots/admin_contacts.png`
- **Admin Activity** → `screenshots/admin_activity.png`
- **Admin Users** → `screenshots/admin_users.png`
- **Admin Site Config** → `screenshots/admin_siteconfig.png`
- **Admin Settings** → `screenshots/admin_settings.png`
