# Admin Dashboard — Momkiddy Indonesia (Detail Lengkap)

## Overview

Panel admin untuk mengelola semua konten website Momkiddy Indonesia secara langsung dari browser tanpa perlu ubah kode. Superadmin mengatur siapa bisa akses apa, admin mengelola konten sehari-hari.

**Stack:** TanStack Start + TanStack Router, oRPC, Cloudflare D1 (SQLite) + Drizzle ORM, Better-Auth, shadcn/ui, Tailwind v4, Lucide React

**URL:** `/admin/*` (protected)

---

## Role Hierarchy

Website ini adalah **company profile murni** — tidak ada akun untuk pengunjung atau murid. Semua urusan murid (pendaftaran, jadwal, komunikasi) ditangani admin lewat WhatsApp. Login hanya untuk pengelola internal website.

```
admin  <  superadmin
```

### Detail Hak Akses per Role

| Kemampuan | `admin` | `superadmin` |
|-----------|:-------:|:------------:|
| Masuk panel admin (`/admin`) | v | v |
| Lihat stats dashboard admin | v | v |
| CRUD konten (testimoni, alumni, galeri, dll) | hanya menu yang diaktifkan | v (semua) |
| Export data ke CSV | hanya menu yang diaktifkan | v |
| Bulk actions (publish/hapus banyak sekaligus) | hanya menu yang diaktifkan | v |
| Lihat activity log | - | v |
| Kelola akun admin (tambah, ubah role, nonaktifkan) | - | v |
| Ubah site config (WA, sosmed, dsb) | - | v |
| Atur menu admin (toggle on/off per menu) | - | v |
| Lihat contact form submissions | jika diaktifkan | v |

### Aturan Penting

1. `superadmin` **selalu** punya akses ke semua menu — tidak bisa dibatasi oleh siapapun
2. `admin` **hanya melihat** menu yang diaktifkan oleh superadmin di halaman `/admin/settings`
3. Jika superadmin menonaktifkan menu "Galeri" → sidebar admin tidak menampilkan Galeri, route `/admin/gallery` return 403, API `admin.gallery.*` return 403
4. `superadmin` tidak bisa di-downgrade oleh superadmin lain — hanya bisa lewat database langsung (safety)
5. Pengaturan menu disimpan di tabel `admin_menu_settings` di D1 (bukan hardcode)
6. Satu website bisa punya banyak admin, tapi direkomendasikan hanya 1 superadmin
7. **Tidak ada akun untuk pengunjung/murid** — website adalah company profile murni, tidak ada fitur register atau login untuk publik
8. **Akses admin panel sepenuhnya tersembunyi dari publik** — tidak ada link, tombol, atau petunjuk apapun di website yang mengarah ke `/admin`

### Cara Masuk Admin (Hidden Entry)

Alur masuk ke panel admin:

1. Admin/superadmin ketik langsung `yourdomain.com/admin` di browser
2. Jika belum login → diarahkan ke halaman login **khusus admin** (`/admin/login`) yang tidak ada linknya di mana pun di website publik
3. Setelah login berhasil → langsung masuk ke `/admin`
4. Jika sudah login dan buka `/admin` → langsung masuk tanpa login ulang
5. Jika buka `/admin/login` padahal sudah login sebagai admin/superadmin → redirect ke `/admin`

**Halaman login admin (`/admin/login`):**
- Desain minimal, tidak pakai branding besar Momkiddy (supaya tidak mencolok)
- Hanya form: Email + Password + tombol Masuk
- Tidak ada link "Daftar", "Lupa Password via publik", atau apapun
- Jika email/password salah → pesan error generik: "Email atau password salah"
- Tidak ada tombol Google OAuth atau social login

**Yang TIDAK boleh dilakukan:**
- Jangan ada link ke `/admin` atau `/admin/login` di navbar, footer, atau halaman publik manapun
- Jangan ada tombol "Login" untuk pengunjung biasa di website
- Jangan tampilkan pesan yang membocorkan keberadaan panel admin jika ada yang coba akses `/admin` tanpa login

**Dampak ke kode existing:**
- Route `_auth/` (protected user routes) dan `/login` publik → **dihapus** atau diabaikan
- `routes/_auth/dashboard.tsx` dan `routes/_auth/profile.tsx` → **tidak dipakai**
- Halaman login admin dibuat baru di `routes/_admin/login.tsx` (di luar layout admin, tidak perlu auth)
- Tabel `user` tetap ada (dipakai Better-Auth), tapi role `user` praktis tidak dipakai di UI

---

## Semua Fitur Admin Panel

### Menu yang bisa dikelola (on/off oleh superadmin):

| Menu Key | Icon | Halaman | Kelola | Superadmin Only? |
|----------|------|---------|--------|:----------------:|
| `dashboard` | `LayoutDashboard` | `/admin` | Stats ringkasan | **selalu aktif** |
| `testimonials` | `MessageSquareQuote` | `/admin/testimonials` | CRUD testimoni | - |
| `alumni` | `GraduationCap` | `/admin/alumni` | CRUD alumni | - |
| `gallery` | `Image` | `/admin/gallery` | CRUD foto galeri | - |
| `events` | `Calendar` | `/admin/events` | CRUD event & webinar | - |
| `resources` | `Download` | `/admin/resources` | CRUD materi gratis | - |
| `promos` | `Tag` | `/admin/promos` | CRUD promo & diskon | - |
| `contacts` | `Mail` | `/admin/contacts` | **BARU** — Lihat submission form kontak | - |
| `activity` | `Clock` | `/admin/activity` | **BARU** — Activity log / audit trail | v |
| `users` | `Users` | `/admin/users` | Kelola user & role | v |
| `site-config` | `Settings2` | `/admin/site-config` | **BARU** — Edit konfigurasi website | v |
| `settings` | `Shield` | `/admin/settings` | Toggle menu admin | v |

---

## Fitur Baru yang Ditambahkan

### 1. Contact Form Submissions (`/admin/contacts`)

Halaman `/kontak` punya form kontak. Saat ini form belum menyimpan ke DB. Dengan fitur ini:

- Form submission tersimpan ke tabel `contact_submissions` di DB
- Admin bisa lihat semua pesan masuk dari halaman `/admin/contacts`
- Status per pesan: `unread` → `read` → `replied` → `archived`
- Admin bisa tandai sebagai "sudah dibalas"
- Badge counter di sidebar: jumlah pesan belum dibaca

### 2. Activity Log (`/admin/activity`)

Audit trail otomatis untuk setiap perubahan yang dilakukan admin/superadmin:

- Siapa melakukan apa, kapan, terhadap resource apa
- Contoh: "Admin Lita mengubah testimoni #5 — mengaktifkan isFeatured — 5 menit lalu"
- Filter by: tanggal, user, tipe aksi, resource
- Hanya superadmin yang bisa melihat log ini
- Log disimpan di tabel `activity_logs` di DB

### 3. Site Configuration (`/admin/site-config`)

Edit konfigurasi website tanpa ubah kode. Saat ini config hardcode di `site-config.ts`. Dengan fitur ini:

- Nomor WhatsApp admin
- Link sosial media (Instagram, TikTok, YouTube, Facebook)
- Alamat lengkap
- Jam operasional
- Tagline / subtitle
- Nama founder
- Disimpan di tabel `site_config` (key-value pairs)
- Override static config: DB config menimpa `site-config.ts` jika ada

### 4. Export Data ke CSV

Setiap halaman CRUD admin punya tombol "Export CSV":

- Testimoni: export semua kolom ke `testimoni_YYYY-MM-DD.csv`
- Alumni: export ke `alumni_YYYY-MM-DD.csv`
- Users: export email + nama + role + tanggal daftar
- Proses export di server → return file response

### 5. Bulk Actions

Di setiap tabel data:

- Checkbox select per row + "Select All"
- Toolbar muncul saat ada item terpilih: "X item dipilih"
- Aksi bulk: Publish All, Unpublish All, Delete All
- Konfirmasi dialog sebelum aksi destruktif
- Toast notification setelah selesai

---

## Arsitektur File Lengkap

```
apps/web/src/routes/
├── admin/
│   └── login.tsx                  ← /admin/login — halaman login admin (TANPA auth guard)
│
├── _admin/
│   ├── route.tsx                  ← layout admin (sidebar + header + outlet)
│   │                                 beforeLoad: cek role admin/superadmin
│   │                                 loader: fetch menuConfig dari API
│   │
│   ├── index.tsx                  ← /admin — Dashboard stats + recent activity
│   │
│   ├── testimonials/
│   │   ├── index.tsx              ← list + search + filter + bulk actions
│   │   └── $id.tsx                ← edit form (id = "new" untuk create baru)
│   │
│   ├── alumni/
│   │   ├── index.tsx
│   │   └── $id.tsx
│   │
│   ├── gallery/
│   │   └── index.tsx              ← grid foto + dialog add/edit
│   │
│   ├── events/
│   │   ├── index.tsx
│   │   └── $id.tsx
│   │
│   ├── resources/
│   │   ├── index.tsx
│   │   └── $id.tsx
│   │
│   ├── promos/
│   │   ├── index.tsx
│   │   └── $id.tsx
│   │
│   ├── contacts/
│   │   └── index.tsx              ← BARU: inbox pesan kontak
│   │
│   ├── activity.tsx               ← BARU: activity log (superadmin only)
│   ├── users.tsx                  ← superadmin only
│   ├── site-config.tsx            ← BARU: edit config website (superadmin only)
│   └── settings.tsx               ← superadmin only: toggle menu on/off

packages/api/src/routers/
├── admin/
│   ├── index.ts                   ← export semua admin sub-routers
│   ├── stats.ts                   ← dashboard stats + recent items
│   ├── users.ts                   ← superadmin: list, updateRole, disable
│   ├── settings.ts                ← superadmin: menu config CRUD
│   ├── site-config.ts             ← BARU superadmin: baca & update site config
│   ├── activity.ts                ← BARU superadmin: query activity logs
│   ├── contacts.ts                ← BARU: list submissions, updateStatus
│   ├── testimonials.ts            ← full CRUD + toggle + bulk + export
│   ├── alumni.ts                  ← full CRUD + toggle + bulk + export
│   ├── gallery.ts                 ← full CRUD + toggle + bulk
│   ├── events.ts                  ← full CRUD + toggle
│   ├── resources.ts               ← full CRUD + toggle
│   └── promos.ts                  ← full CRUD + toggle

packages/db/src/schema/
├── auth.ts                        ← UPDATE: tambah kolom `role` ke user
├── testimonials.ts                ← existing
├── alumni.ts                      ← existing
├── gallery-items.ts               ← existing
├── events.ts                      ← existing
├── resources.ts                   ← existing
├── promos.ts                      ← existing
├── admin-menu-settings.ts         ← BARU
├── contact-submissions.ts         ← BARU
├── activity-logs.ts               ← BARU
└── site-config.ts                 ← BARU

apps/web/src/components/admin/
├── admin-layout.tsx               ← wrapper: sidebar + header + content area
├── admin-sidebar.tsx              ← nav links dinamis berdasarkan role + menuConfig
├── admin-header.tsx               ← breadcrumb + user info + role badge + logout
├── admin-data-table.tsx           ← TanStack Table wrapper (search, sort, filter, pagination, bulk select)
├── admin-form-shell.tsx           ← form wrapper: title + save/cancel + loading state
├── admin-stat-card.tsx            ← kartu angka (icon + label + value + trend)
├── admin-empty-state.tsx          ← placeholder saat tabel kosong
├── admin-confirm-dialog.tsx       ← konfirmasi hapus / aksi destruktif
├── admin-status-badge.tsx         ← badge Published/Draft/Active/Inactive/Unread
├── admin-bulk-toolbar.tsx         ← toolbar aksi massal (muncul saat ada item terpilih)
├── admin-image-preview.tsx        ← preview URL gambar kecil di tabel
└── admin-activity-item.tsx        ← satu baris activity log
```

---

## Schema Database Lengkap

### 1. UPDATE: Tabel `user` — Tambah Role

**File:** `packages/db/src/schema/auth.ts`

```typescript
// Tambah kolom ini ke user table
role: text("role").notNull().default("admin")
// Valid: "admin" | "superadmin"

isActive: integer("is_active", { mode: "boolean" }).notNull().default(true)
// Superadmin bisa nonaktifkan user/admin (soft ban)
```

**Index baru:**
```typescript
roleIdx: index("user_role_idx").on(user.role)
```

---

### 2. BARU: Tabel `admin_menu_settings`

**File:** `packages/db/src/schema/admin-menu-settings.ts`

```
Kolom            Tipe           Detail
─────────────────────────────────────────────────────────────
id               TEXT PK        nanoid()
menuKey          TEXT UNIQUE     'testimonials' | 'alumni' | 'gallery' |
                                'events' | 'resources' | 'promos' | 'contacts'
label            TEXT NOT NULL   label tampilan di sidebar ("Testimoni", "Alumni", dll)
icon             TEXT NOT NULL   nama icon Lucide ("MessageSquareQuote", dll)
description      TEXT            deskripsi singkat menu ("Kelola testimoni pelanggan")
isEnabled        INTEGER (bool)  DEFAULT 1 — aktif untuk admin
sortOrder        INTEGER         DEFAULT 0 — urutan di sidebar (superadmin bisa drag-reorder)
createdAt        INTEGER (ms)    timestamp
updatedAt        INTEGER (ms)    timestamp
updatedBy        TEXT            FK ke user.id — siapa terakhir mengubah
```

**Seed default (7 row):**
```typescript
const defaultMenus = [
  { menuKey: "testimonials", label: "Testimoni",    icon: "MessageSquareQuote", sortOrder: 1 },
  { menuKey: "alumni",       label: "Alumni",       icon: "GraduationCap",      sortOrder: 2 },
  { menuKey: "gallery",      label: "Galeri",       icon: "Image",              sortOrder: 3 },
  { menuKey: "events",       label: "Event",        icon: "Calendar",           sortOrder: 4 },
  { menuKey: "resources",    label: "Resources",    icon: "Download",           sortOrder: 5 },
  { menuKey: "promos",       label: "Promo",        icon: "Tag",                sortOrder: 6 },
  { menuKey: "contacts",     label: "Pesan Masuk",  icon: "Mail",               sortOrder: 7 },
];
```

---

### 3. BARU: Tabel `contact_submissions`

**File:** `packages/db/src/schema/contact-submissions.ts`

```
Kolom            Tipe           Detail
─────────────────────────────────────────────────────────────
id               TEXT PK        nanoid()
name             TEXT NOT NULL   nama pengirim
email            TEXT NOT NULL   email pengirim
phone            TEXT            nomor HP (opsional)
subject          TEXT NOT NULL   "Tanya Program" | "Pendaftaran" | "Kerjasama" | "Lainnya"
message          TEXT NOT NULL   isi pesan
status           TEXT NOT NULL   DEFAULT 'unread'
                                Valid: 'unread' | 'read' | 'replied' | 'archived'
adminNotes       TEXT            catatan internal admin (tidak dilihat pengirim)
repliedBy        TEXT            FK user.id — admin yang membalas
repliedAt        INTEGER (ms)   kapan dibalas
createdAt        INTEGER (ms)   kapan pesan dikirim
updatedAt        INTEGER (ms)
```

**Indexes:**
```typescript
statusIdx:    index("contact_status_idx").on(contactSubmissions.status)
createdAtIdx: index("contact_created_idx").on(contactSubmissions.createdAt)
```

---

### 4. BARU: Tabel `activity_logs`

**File:** `packages/db/src/schema/activity-logs.ts`

```
Kolom            Tipe           Detail
─────────────────────────────────────────────────────────────
id               TEXT PK        nanoid()
actorId          TEXT NOT NULL   FK user.id — siapa yang melakukan aksi
actorName        TEXT NOT NULL   nama user (denormalized untuk performa)
actorRole        TEXT NOT NULL   role saat aksi dilakukan ('admin' | 'superadmin')
action           TEXT NOT NULL   'create' | 'update' | 'delete' | 'bulk_delete' |
                                'publish' | 'unpublish' | 'toggle_featured' |
                                'export' | 'role_change' | 'menu_toggle' |
                                'config_update' | 'status_change'
entityType       TEXT NOT NULL   'testimonial' | 'alumni' | 'gallery_item' |
                                'event' | 'resource' | 'promo' |
                                'user' | 'menu_setting' | 'site_config' | 'contact'
entityId         TEXT            ID dari item yang di-aksi (nullable untuk bulk)
entityTitle      TEXT            judul/nama item (denormalized: "Testimoni dari Bu Rina")
details          TEXT            JSON string — detail perubahan (old → new values)
                                Contoh: '{"field":"isPublished","from":false,"to":true}'
ipAddress        TEXT            IP address (dari request header)
createdAt        INTEGER (ms)   kapan aksi dilakukan
```

**Indexes:**
```typescript
actorIdx:    index("activity_actor_idx").on(activityLogs.actorId)
entityIdx:   index("activity_entity_idx").on(activityLogs.entityType)
createdIdx:  index("activity_created_idx").on(activityLogs.createdAt)
```

**Retention:** Simpan log selama 90 hari, cron job hapus yang lebih lama (opsional, bisa ditambahkan nanti).

---

### 5. BARU: Tabel `site_config`

**File:** `packages/db/src/schema/site-config.ts`

```
Kolom            Tipe           Detail
─────────────────────────────────────────────────────────────
id               TEXT PK        nanoid()
key              TEXT UNIQUE     config key — flat namespace
value            TEXT NOT NULL   config value (string, JSON parse jika perlu)
label            TEXT NOT NULL   label UI ("Nomor WhatsApp")
group            TEXT NOT NULL   group untuk tampilan UI ('general' | 'social' | 'contact' | 'branding')
inputType        TEXT NOT NULL   'text' | 'textarea' | 'url' | 'tel' | 'email'
updatedAt        INTEGER (ms)
updatedBy        TEXT            FK user.id
```

**Seed default:**
```typescript
const defaultConfig = [
  // General
  { key: "site_name",         value: "Lembaga Pendidikan Momkiddy Indonesia", label: "Nama Lembaga",      group: "general",  inputType: "text" },
  { key: "site_tagline",      value: "Ibu Pintar Mengajar, Anak Cerdas Berkarya", label: "Tagline",       group: "general",  inputType: "text" },
  { key: "founder_name",      value: "Lita Hendratno",                        label: "Nama Founder",      group: "general",  inputType: "text" },

  // Contact
  { key: "whatsapp_number",   value: "6282343277820",                         label: "Nomor WhatsApp",    group: "contact",  inputType: "tel" },
  { key: "email",             value: "",                                      label: "Email",             group: "contact",  inputType: "email" },
  { key: "address",           value: "",                                      label: "Alamat",            group: "contact",  inputType: "textarea" },
  { key: "operating_hours",   value: "Senin–Sabtu, 08.00–17.00 WIB",         label: "Jam Operasional",   group: "contact",  inputType: "text" },

  // Social Media
  { key: "instagram_url",     value: "https://instagram.com/litahendratno_", label: "Instagram",     group: "social",   inputType: "url" },
  { key: "tiktok_url",        value: "",                                      label: "TikTok",            group: "social",   inputType: "url" },
  { key: "youtube_url",       value: "",                                      label: "YouTube",           group: "social",   inputType: "url" },
  { key: "facebook_url",      value: "",                                      label: "Facebook",          group: "social",   inputType: "url" },
];
```

**Cara pakai di frontend:**
```typescript
// API: publicProcedure — siapapun bisa baca (dibutuhkan header, footer, CTA WA)
siteConfig.getAll → return semua config sebagai Record<string, string>

// Di komponen: override static siteConfig.ts dengan DB values
const dbConfig = orpc.siteConfig.getAll.useQuery();
const waNumber = dbConfig.data?.whatsapp_number ?? siteConfig.whatsappNumber;
```

---

## Procedure Middleware — Detail Lengkap

**File:** `packages/api/src/index.ts` (tambahkan setelah `protectedProcedure`)

```typescript
import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { adminMenuSettings } from "@momkiddis/db/schema";

// ─────────────────────────────────────────────
// 1. adminProcedure — admin DAN superadmin
// ─────────────────────────────────────────────
const requireAdmin = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  const role = context.session.user.role;
  if (role !== "admin" && role !== "superadmin") {
    throw new ORPCError("FORBIDDEN", { message: "Hanya admin yang bisa mengakses" });
  }
  return next({
    context: {
      ...context,
      session: context.session,
      role,
      isSuperAdmin: role === "superadmin",
    },
  });
});

export const adminProcedure = publicProcedure.use(requireAdmin);

// ─────────────────────────────────────────────
// 2. superAdminProcedure — superadmin saja
// ─────────────────────────────────────────────
const requireSuperAdmin = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  if (context.session.user.role !== "superadmin") {
    throw new ORPCError("FORBIDDEN", { message: "Hanya superadmin yang bisa mengakses" });
  }
  return next({
    context: {
      ...context,
      session: context.session,
      role: "superadmin" as const,
      isSuperAdmin: true,
    },
  });
});

export const superAdminProcedure = publicProcedure.use(requireSuperAdmin);

// ─────────────────────────────────────────────
// 3. menuGuardProcedure — cek menu diaktifkan
// ─────────────────────────────────────────────
// Dipakai per-router: menuGuardProcedure("gallery").handler(...)
// Superadmin selalu lolos. Admin dicek terhadap admin_menu_settings.
export function createMenuGuard(menuKey: string) {
  return adminProcedure.use(async ({ context, next }) => {
    // Superadmin bypass semua
    if (context.isSuperAdmin) {
      return next({ context });
    }
    // Admin: cek apakah menu ini diaktifkan
    const setting = await context.db
      .select()
      .from(adminMenuSettings)
      .where(eq(adminMenuSettings.menuKey, menuKey))
      .get();

    if (!setting || !setting.isEnabled) {
      throw new ORPCError("FORBIDDEN", {
        message: `Menu "${menuKey}" tidak diaktifkan oleh superadmin`,
      });
    }
    return next({ context });
  });
}
```

---

## Route Guard (Frontend) — Detail Lengkap

### 1. Layout Admin `_admin/route.tsx`

```typescript
import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/admin-layout";

export const Route = createFileRoute("/_admin")({
  beforeLoad: async ({ context }) => {
    // 1. Cek session
    const session = await getUser();
    if (!session) throw redirect({ to: "/admin/login" });

    // 2. Cek role
    const role = session.user.role;
    if (role !== "admin" && role !== "superadmin") {
      throw redirect({ to: "/" }); // Kembali ke homepage, bukan error
    }

    return { session, role, isSuperAdmin: role === "superadmin" };
  },

  loader: async ({ context }) => {
    // 3. Fetch menu config dari DB (untuk sidebar dinamis)
    const menuConfig = await context.orpc.admin.settings.getMenuConfig.query();
    return { menuConfig };
  },

  component: () => {
    const { menuConfig } = Route.useLoaderData();
    const { session, role, isSuperAdmin } = Route.useRouteContext();

    return (
      <AdminLayout
        session={session}
        role={role}
        isSuperAdmin={isSuperAdmin}
        menuConfig={menuConfig}
      >
        <Outlet />
      </AdminLayout>
    );
  },
});
```

### 2. Per-halaman Menu Guard (contoh Galeri)

```typescript
// _admin/gallery/index.tsx
export const Route = createFileRoute("/_admin/gallery/")({
  beforeLoad: ({ context }) => {
    // Superadmin selalu lolos
    if (context.isSuperAdmin) return;
    // Admin: cek dari menuConfig yang sudah di-fetch di layout
    const galleryMenu = context.menuConfig?.find(m => m.menuKey === "gallery");
    if (!galleryMenu?.isEnabled) {
      throw redirect({ to: "/admin" }); // Kembali ke dashboard admin
    }
  },
});
```

### 3. Superadmin-only Guard (contoh Users)

```typescript
// _admin/users.tsx
export const Route = createFileRoute("/_admin/users")({
  beforeLoad: ({ context }) => {
    if (!context.isSuperAdmin) {
      throw redirect({ to: "/admin" });
    }
  },
});
```

---

## Komponen Admin UI — Detail

### `admin-layout.tsx`

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  ┌──────────┐  ┌────────────────────────────────────────────┐  │
│  │          │  │ HEADER                                     │  │
│  │ SIDEBAR  │  │ Breadcrumb: Admin > Galeri                 │  │
│  │          │  │                     [Admin ●] Lita ▾       │  │
│  │ Logo     │  ├────────────────────────────────────────────┤  │
│  │          │  │                                            │  │
│  │ Dashboard│  │  CONTENT AREA                              │  │
│  │ ──────── │  │                                            │  │
│  │ Testimoni│  │  (Outlet dari route children)              │  │
│  │ Alumni   │  │                                            │  │
│  │ Galeri   │  │                                            │  │
│  │ Event    │  │                                            │  │
│  │ Resources│  │                                            │  │
│  │ Promo    │  │                                            │  │
│  │ Pesan    │  │                                            │  │
│  │ ──────── │  │                                            │  │
│  │ Activity*│  │                                            │  │
│  │ Users*   │  │                                            │  │
│  │ Config*  │  │                                            │  │
│  │ Settings*│  │                                            │  │
│  │          │  │                                            │  │
│  │ * = super│  │                                            │  │
│  │   admin  │  │                                            │  │
│  └──────────┘  └────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Sidebar behaviour:**
- Desktop: selalu tampil, lebar 240px, collapsible ke 60px (icon only)
- Mobile: hidden, bisa buka via hamburger → Sheet overlay dari kiri
- Collapsed state disimpan di localStorage
- Menu superadmin-only dipisah dengan separator + label "Superadmin"
- Badge counter merah di "Pesan Masuk" menunjukkan jumlah `unread`

### `admin-header.tsx`

- **Kiri:** Breadcrumb navigasi (Admin > Galeri)
- **Kanan:** Role badge (`Admin` biru / `Super Admin` oranye) + nama user + dropdown menu
- Dropdown: Kembali ke Website, Logout
- Height: 56px, border-bottom, sticky top-0

### `admin-data-table.tsx`

Wrapper TanStack Table yang dipakai semua halaman list. Props:

```typescript
interface AdminDataTableProps<T> {
  columns: ColumnDef<T>[];          // definisi kolom TanStack Table
  data: T[];                         // data rows
  isLoading: boolean;
  // Search
  searchPlaceholder?: string;        // "Cari testimoni..."
  searchColumn?: string;             // kolom yang dicari (default: semua)
  // Pagination
  pageSize?: number;                 // default 10
  // Filter
  filters?: FilterConfig[];          // dropdown filter (status, program, dll)
  // Bulk
  enableBulkSelect?: boolean;        // default false
  bulkActions?: BulkAction[];        // [{label, action, variant}]
  // Actions
  onAdd?: () => void;                // tombol "Tambah" di header tabel
  addLabel?: string;                 // "Tambah Testimoni"
  onExport?: () => void;             // tombol "Export CSV" (opsional)
  // Empty
  emptyTitle?: string;               // "Belum ada testimoni"
  emptyDescription?: string;         // "Tambahkan testimoni pertama"
}
```

**Filter config:**
```typescript
interface FilterConfig {
  key: string;             // "status" | "programSlug"
  label: string;           // "Program"
  options: { label: string; value: string }[];
}
```

### `admin-form-shell.tsx`

Wrapper untuk form create/edit. Mengatur layout, loading, save, cancel.

```typescript
interface AdminFormShellProps {
  title: string;                   // "Edit Testimoni" / "Tambah Foto Galeri"
  isLoading?: boolean;             // skeleton placeholder
  isSaving?: boolean;              // disable tombol saat save
  onSave: () => void;
  onCancel: () => void;
  children: React.ReactNode;       // form fields
}
```

**Layout:**
```
┌───────────────────────────────────────────────┐
│ ← Kembali     Edit Testimoni     [Simpan]     │
├───────────────────────────────────────────────┤
│                                               │
│  Form fields (children)                       │
│                                               │
│  ┌─────────────────┐  ┌─────────────────┐     │
│  │ Nama Penulis    │  │ Program         │     │
│  │ [____________]  │  │ [Dropdown ▾]    │     │
│  └─────────────────┘  └─────────────────┘     │
│                                               │
│  ┌──────────────────────────────────────┐     │
│  │ Isi Testimoni                       │     │
│  │ [____________________________]      │     │
│  │ [____________________________]      │     │
│  └──────────────────────────────────────┘     │
│                                               │
│  ┌──────────┐  ┌───────────┐                  │
│  │ Published │  │ Featured  │                  │
│  │ [● ON ]  │  │ [○ OFF]   │                  │
│  └──────────┘  └───────────┘                  │
│                                               │
└───────────────────────────────────────────────┘
```

### `admin-confirm-dialog.tsx`

```typescript
interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;           // "Hapus Testimoni?"
  description: string;     // "Aksi ini tidak bisa dibatalkan."
  confirmLabel?: string;   // "Ya, Hapus" (default)
  variant?: "destructive" | "default";
  onConfirm: () => void;
  isLoading?: boolean;
}
```

### `admin-status-badge.tsx`

```typescript
type Status = "published" | "draft" | "featured" | "active" | "inactive" |
              "unread" | "read" | "replied" | "archived";

// Warna per status:
// published/active:  bg-green-100 text-green-800
// draft/inactive:    bg-gray-100 text-gray-600
// featured:          bg-yellow-100 text-yellow-800
// unread:            bg-red-100 text-red-800
// read:              bg-blue-100 text-blue-800
// replied:           bg-green-100 text-green-800
// archived:          bg-gray-100 text-gray-500
```

---

## Detail Setiap Halaman Admin

### `/admin` — Dashboard

**API:** `admin.stats.summary`

```typescript
// Response:
{
  testimonials: { total: 12, published: 8, featured: 3 },
  alumni:       { total: 25, published: 20, featured: 5 },
  gallery:      { total: 45, published: 40 },
  events:       { total: 5,  upcoming: 2 },
  resources:    { total: 15, published: 12 },
  promos:       { total: 3,  active: 2 },
  users:        { total: 50, admins: 3 },
  contacts:     { total: 20, unread: 5 },  // badge merah jika > 0
}
```

**Tampilan:**

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard                                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │ 📝 12      │ │ 🎓 25      │ │ 📷 45      │ │ 📅 5     │ │
│  │ Testimoni  │ │ Alumni     │ │ Galeri     │ │ Event    │ │
│  │ 8 published│ │ 5 featured │ │ 40 publish │ │ 2 upcome │ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
│                                                             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │ 📥 15      │ │ 🏷️ 3       │ │ 👥 50      │ │          │ │
│  │ Resources  │ │ Promo      │ │ Users      │ │          │ │
│  │ 12 publish │ │ 2 active   │ │ 3 admin    │ │          │ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────┐           │
│  │ 📬 5 Pesan Belum Dibaca                      │ ← merah  │
│  │ Lihat pesan →                                │           │
│  └──────────────────────────────────────────────┘           │
│                                                             │
│  Aktivitas Terbaru                     (superadmin only)    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • Lita mengubah testimoni "Bu Rina" — 5 menit lalu  │   │
│  │ • Admin1 menambah foto galeri "Workshop Batch 9" — 1 jam│   │
│  │ • Lita menghapus promo "Diskon Maret" — 3 jam lalu  │   │
│  │ • Admin2 membalas pesan dari Sari — kemarin          │   │
│  │ [Lihat semua aktivitas →]                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Catatan:** Stat cards hanya tampil untuk menu yang diaktifkan. Jika galeri dinonaktifkan → card galeri tidak muncul di dashboard admin (tapi tetap tampil untuk superadmin).

---

### `/admin/testimonials` — CRUD Testimoni

**Zod Schema (Input):**
```typescript
const testimonialInput = z.object({
  authorName:  z.string().min(2, "Minimal 2 karakter").max(100),
  authorRole:  z.string().min(2).max(100),      // "Peserta Batch 3"
  authorImage: z.string().url().optional().or(z.literal("")),
  programSlug: z.string().optional(),             // dropdown: microteaching, calistung, dll
  content:     z.string().min(10, "Minimal 10 karakter").max(1000),
  rating:      z.number().int().min(1).max(5).default(5),
  isPublished: z.boolean().default(false),
  isFeatured:  z.boolean().default(false),
});
```

**Tabel Kolom:**
| # | Kolom | Width | Sortable | Detail |
|---|-------|-------|----------|--------|
| 1 | Checkbox | 40px | - | bulk select |
| 2 | Penulis | 200px | v | `authorName` + `authorRole` stacked |
| 3 | Program | 120px | v | Badge warna dari `programSlug` |
| 4 | Rating | 80px | v | Bintang (1-5) |
| 5 | Isi | flex | - | Truncated 100 chars |
| 6 | Published | 90px | v | Toggle switch langsung |
| 7 | Featured | 90px | v | Toggle switch langsung |
| 8 | Tanggal | 100px | v | `createdAt` format "12 Jan 2026" |
| 9 | Aksi | 80px | - | Dropdown: Edit, Hapus |

**Filter:** Program (dropdown semua program), Status (Published/Draft/Featured)

**API Procedures:**
```
admin.testimonials.list     → menuGuardProcedure("testimonials")  → paginated list, sortable
admin.testimonials.getById  → menuGuardProcedure("testimonials")  → single item
admin.testimonials.create   → menuGuardProcedure("testimonials")  → insert + log activity
admin.testimonials.update   → menuGuardProcedure("testimonials")  → update + log activity
admin.testimonials.delete   → menuGuardProcedure("testimonials")  → delete + log activity
admin.testimonials.toggle   → menuGuardProcedure("testimonials")  → toggle isPublished/isFeatured
admin.testimonials.bulkAction → menuGuardProcedure("testimonials") → publish/unpublish/delete banyak
admin.testimonials.export   → menuGuardProcedure("testimonials")  → return CSV string
```

---

### `/admin/alumni` — CRUD Alumni

**Zod Schema:**
```typescript
const alumniInput = z.object({
  name:           z.string().min(2).max(100),
  photo:          z.string().url().optional().or(z.literal("")),
  batchLabel:     z.string().min(2).max(50),    // "Batch 5, Maret 2025"
  programSlug:    z.string(),                    // dropdown
  certificateUrl: z.string().url().optional().or(z.literal("")),
  shortStory:     z.string().min(10).max(500),
  graduatedAt:    z.number(),                    // timestamp ms — date picker
  isPublished:    z.boolean().default(false),
  isFeatured:     z.boolean().default(false),
});
```

**Tabel Kolom:**
| Kolom | Detail |
|-------|--------|
| Checkbox | bulk select |
| Foto | avatar kecil 32x32 |
| Nama | `name` |
| Batch | `batchLabel` |
| Program | badge warna |
| Cerita | truncated 80 chars |
| Published | toggle |
| Featured | toggle |
| Tanggal Lulus | `graduatedAt` |
| Aksi | Edit, Hapus |

---

### `/admin/gallery` — CRUD Galeri

**Zod Schema:**
```typescript
const galleryInput = z.object({
  imageUrl:    z.string().url(),
  caption:     z.string().min(2).max(200),
  event:       z.string().min(2).max(100),       // "Workshop Batch 3"
  takenAt:     z.number(),                        // timestamp ms
  isPublished: z.boolean().default(false),
});
```

**UI:** Grid foto (bukan tabel) — 4 kolom desktop, 2 kolom mobile. Setiap foto:
- Thumbnail besar
- Caption overlay di bawah
- Toggle published (icon mata)
- Tombol hapus (icon trash) dengan hover overlay
- Klik foto → dialog edit

---

### `/admin/events` — CRUD Event

**Zod Schema:**
```typescript
const eventInput = z.object({
  title:       z.string().min(5).max(200),
  description: z.string().max(2000).optional(),
  date:        z.number(),                        // timestamp ms — date+time picker
  endDate:     z.number().optional(),
  location:    z.string().max(200).optional(),     // "Online via Zoom" / alamat
  type:        z.enum(["webinar", "workshop", "kelas-terbuka"]),
  imageUrl:    z.string().url().optional().or(z.literal("")),
  isUpcoming:  z.boolean().default(true),
  isPublished: z.boolean().default(false),
  maxSeats:    z.number().int().positive().optional(),
  waMessage:   z.string().max(500).optional(),     // custom WA message
});
```

**Tabel Kolom:**
| Kolom | Detail |
|-------|--------|
| Judul | `title` |
| Tanggal | formatted date range |
| Lokasi | `location` |
| Tipe | badge: Webinar / Workshop / Kelas Terbuka |
| Status | `isUpcoming` → "Akan Datang" (biru) / "Selesai" (abu) |
| Published | toggle |
| Max Seats | jumlah |
| Aksi | Edit, Hapus |

---

### `/admin/resources` — CRUD Resources

**Zod Schema:**
```typescript
const resourceInput = z.object({
  title:        z.string().min(3).max(200),
  description:  z.string().max(500).optional(),
  category:     z.enum(["worksheet", "flashcard", "template", "tips"]),
  fileUrl:      z.string().url(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  fileType:     z.enum(["pdf", "image", "zip"]),
  isPublished:  z.boolean().default(false),
});
```

**Tabel Kolom:**
| Kolom | Detail |
|-------|--------|
| Thumbnail | image kecil |
| Judul | `title` |
| Kategori | badge warna |
| Tipe File | icon (PDF/Image/ZIP) |
| Downloads | `downloadCount` angka |
| Published | toggle |
| Aksi | Edit, Preview file, Hapus |

---

### `/admin/promos` — CRUD Promo

**Zod Schema:**
```typescript
const promoInput = z.object({
  title:         z.string().min(3).max(200),
  description:   z.string().max(500).optional(),
  programSlug:   z.string().optional(),            // null = semua program
  discountLabel: z.string().max(50),               // "Diskon 20%"
  validFrom:     z.number(),                        // timestamp ms
  validUntil:    z.number(),                        // timestamp ms
  isActive:      z.boolean().default(true),
});
```

**Tabel Kolom:**
| Kolom | Detail |
|-------|--------|
| Judul | `title` |
| Program | badge / "Semua Program" |
| Diskon | `discountLabel` |
| Periode | `validFrom` — `validUntil` |
| Status | Active (hijau) / Expired (merah) / Inactive (abu) |
| Aksi | Edit, Hapus |

**Logic:** Jika `validUntil < now` → otomatis tampil sebagai "Expired" meskipun `isActive = true`.

---

### `/admin/contacts` — Pesan Masuk

**Tidak ada create/edit — hanya read + update status.**

**Tabel Kolom:**
| Kolom | Detail |
|-------|--------|
| Status | badge: Unread (merah) / Read (biru) / Replied (hijau) / Archived (abu) |
| Nama | `name` |
| Email | `email` |
| Subjek | `subject` |
| Pesan | truncated 80 chars |
| Tanggal | `createdAt` |
| Aksi | Lihat Detail, Tandai Dibaca, Tandai Dibalas, Arsipkan |

**Detail view:** klik row → sheet/panel samping kanan dengan:
- Info lengkap pengirim
- Isi pesan penuh
- Admin notes (textarea — catatan internal)
- Tombol aksi status
- Tombol "Balas via WhatsApp" → buka wa.me dengan nomor pengirim

**Badge sidebar:** jumlah `unread` — misalnya "Pesan Masuk (3)"

---

### `/admin/activity` — Activity Log (Superadmin Only)

**Tampilan:** timeline vertikal, terbaru di atas.

```
┌──────────────────────────────────────────────────────────────┐
│  Activity Log                                                │
│                                                              │
│  Filter: [Semua Aksi ▾] [Semua Resource ▾] [7 hari ▾]       │
│                                                              │
│  Hari ini                                                    │
│  ─────────────────────────────────────────────────            │
│  14:32  Lita (superadmin) menambah foto galeri "Workshop Batch 9" │
│  14:20  Lita (superadmin) mempublish testimoni #12           │
│  13:55  Admin1 (admin) mengubah alumni "Bu Rina" — foto      │
│                                                              │
│  Kemarin                                                     │
│  ─────────────────────────────────────────────────            │
│  17:45  Lita (superadmin) menonaktifkan menu "Promo"         │
│  16:20  Admin1 (admin) menghapus 3 foto galeri               │
│  09:10  Lita (superadmin) mengubah role user@email → admin   │
│                                                              │
│  [Muat lebih banyak]                                         │
└──────────────────────────────────────────────────────────────┘
```

**Filter:**
- Aksi: Semua / Create / Update / Delete / Publish / Export / Role Change
- Resource: Semua / Testimonial / Alumni / Gallery / Event / Resource / Promo / User / Config
- Rentang waktu: 7 hari / 30 hari / 90 hari

---

### `/admin/users` — User Management (Superadmin Only)

**Tabel Kolom:**
| Kolom | Detail |
|-------|--------|
| Avatar | dari `user.image` atau inisial |
| Nama | `name` |
| Email | `email` |
| Role | Dropdown inline: `admin` / `superadmin` |
| Status | Active (hijau) / Inactive (merah) — dari `isActive` |
| Terdaftar | `createdAt` |
| Aksi | Ubah Role, Nonaktifkan/Aktifkan |

**Tombol "Tambah Admin":**
- Di atas tabel, tombol `+ Tambah Admin` (karena tidak ada signup publik)
- Dialog form: Nama, Email, Password, Konfirmasi Password, Role (`admin` / `superadmin`)
- Validasi: email unik, password min 8 karakter
- Setelah dibuat, admin baru bisa langsung login di `/admin/login`

**Aturan:**
- Superadmin tidak bisa mengubah role superadmin lain (safety)
- Superadmin tidak bisa menonaktifkan diri sendiri
- Ubah role memunculkan dialog konfirmasi
- Setiap perubahan role dicatat di activity log

---

### `/admin/site-config` — Edit Konfigurasi (Superadmin Only)

**Tampilan:** form grouped by kategori, tab atau section.

```
┌──────────────────────────────────────────────────┐
│  Konfigurasi Website                             │
├──────────────────────────────────────────────────┤
│                                                  │
│  Umum                                            │
│  ┌────────────────────────────────────────┐       │
│  │ Nama Lembaga  [Momkiddy Indonesia___]  │       │
│  │ Tagline       [Ibu Pintar Mengajar..]  │       │
│  │ Nama Founder  [Lita Hendratno_______]  │       │
│  └────────────────────────────────────────┘       │
│                                                  │
│  Kontak                                          │
│  ┌────────────────────────────────────────┐       │
│  │ WhatsApp      [6282343277820________]  │       │
│  │ Email         [info@momkiddy.id_____]  │       │
│  │ Alamat        [________________]       │       │
│  │               [________________]       │       │
│  │ Jam Operasi   [Senin–Sabtu 08-17___]   │       │
│  └────────────────────────────────────────┘       │
│                                                  │
│  Media Sosial                                    │
│  ┌────────────────────────────────────────┐       │
│  │ Instagram     [https://instagram.com/] │       │
│  │ TikTok        [_____________________]  │       │
│  │ YouTube       [_____________________]  │       │
│  │ Facebook      [_____________________]  │       │
│  └────────────────────────────────────────┘       │
│                                                  │
│  [Simpan Perubahan]                              │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Cara kerja runtime:**
1. Frontend load: `siteConfig.ts` dipakai sebagai default
2. API `siteConfig.getAll` (publicProcedure) → return semua key-value dari DB
3. Merge: DB values override static defaults
4. Komponen header/footer/CTA pakai merged config
5. Cache: TanStack Query cache 5 menit (staleTime), revalidate saat admin update

---

### `/admin/settings` — Pengaturan Menu Admin (Superadmin Only)

**Tampilan:**

```
┌──────────────────────────────────────────────────────────┐
│  Pengaturan Panel Admin                                  │
│  Atur menu mana saja yang bisa diakses oleh admin        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Menu Konten                                             │
│  ┌─────────────────────────────┬─────────┬────────────┐  │
│  │ Menu                        │ Aktif   │ Urutan     │  │
│  ├─────────────────────────────┼─────────┼────────────┤  │
│  │ ≡ 📝 Testimoni              │ [ON ●]  │ 1          │  │
│  │ ≡ 🎓 Alumni                 │ [ON ●]  │ 2          │  │
│  │ ≡ 📷 Galeri                  │ [ON ●]  │ 3          │  │
│  │ ≡ 📅 Event                   │ [ON ●]  │ 4          │  │
│  │ ≡ 📥 Resources               │ [ON ●]  │ 5          │  │
│  │ ≡ 🏷 Promo                   │ [OFF ○] │ 6          │  │
│  │ ≡ 📬 Pesan Masuk             │ [ON ●]  │ 7          │  │
│  └─────────────────────────────┴─────────┴────────────┘  │
│                                                          │
│  ≡ = drag handle untuk reorder                           │
│                                                          │
│  ℹ️ Dashboard selalu aktif untuk semua admin.              │
│  ℹ️ Users, Activity Log, Site Config, dan Settings        │
│     hanya bisa diakses oleh superadmin.                  │
│                                                          │
│  [Simpan Perubahan]                                      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Fitur:**
- Toggle switch on/off per menu
- Drag-and-drop reorder (mengubah `sortOrder`)
- Perubahan disimpan ke DB saat klik "Simpan"
- Setelah simpan: invalidate menuConfig query → sidebar semua admin yang sedang online langsung update

---

## Activity Logging — Detail Implementasi

### Utility Function

**File:** `packages/api/src/utils/log-activity.ts`

```typescript
import { nanoid } from "nanoid";
import { activityLogs } from "@momkiddis/db/schema";

interface LogActivityInput {
  db: DrizzleDB;
  actorId: string;
  actorName: string;
  actorRole: "admin" | "superadmin";
  action: ActivityAction;
  entityType: EntityType;
  entityId?: string;
  entityTitle?: string;
  details?: Record<string, unknown>;  // { field, from, to }
  ipAddress?: string;
}

type ActivityAction =
  | "create" | "update" | "delete" | "bulk_delete"
  | "publish" | "unpublish" | "toggle_featured"
  | "export" | "role_change" | "menu_toggle"
  | "config_update" | "status_change";

type EntityType =
  | "testimonial" | "alumni" | "gallery_item"
  | "event" | "resource" | "promo"
  | "user" | "menu_setting" | "site_config" | "contact";

export async function logActivity(input: LogActivityInput) {
  await input.db.insert(activityLogs).values({
    id: nanoid(),
    actorId: input.actorId,
    actorName: input.actorName,
    actorRole: input.actorRole,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId ?? null,
    entityTitle: input.entityTitle ?? null,
    details: input.details ? JSON.stringify(input.details) : null,
    ipAddress: input.ipAddress ?? null,
    createdAt: Date.now(),
  });
}
```

### Contoh Pemakaian

```typescript
// Di admin.testimonials.create handler:
const result = await context.db.insert(testimonials).values({ ... }).returning();

await logActivity({
  db: context.db,
  actorId: context.session.user.id,
  actorName: context.session.user.name,
  actorRole: context.role,
  action: "create",
  entityType: "testimonial",
  entityId: result.id,
  entityTitle: `Testimoni dari ${input.authorName}`,
});

// Di admin.users.updateRole handler:
await logActivity({
  db: context.db,
  actorId: context.session.user.id,
  actorName: context.session.user.name,
  actorRole: "superadmin",
  action: "role_change",
  entityType: "user",
  entityId: targetUser.id,
  entityTitle: targetUser.email,
  details: { field: "role", from: oldRole, to: newRole },
});
```

---

## Update Halaman `/kontak` — Simpan Form ke DB

**Perubahan:** form di `/kontak` yang saat ini tidak menyimpan ke DB, sekarang kirim ke API.

**API baru (public):**
```typescript
// packages/api/src/routers/contacts.ts (public, bukan admin)
export const contactsRouter = {
  submit: publicProcedure
    .input(z.object({
      name:    z.string().min(2).max(100),
      email:   z.string().email(),
      phone:   z.string().max(20).optional(),
      subject: z.enum(["Tanya Program", "Pendaftaran", "Kerjasama", "Lainnya"]),
      message: z.string().min(10).max(2000),
    }))
    .handler(async ({ context, input }) => {
      await context.db.insert(contactSubmissions).values({
        id: nanoid(),
        ...input,
        status: "unread",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return { success: true };
    }),
};
```

**Di halaman `/kontak`:**
- Setelah submit berhasil → toast "Pesan terkirim! Kami akan segera merespons."
- Form di-reset
- Juga tetap tampilkan tombol WA sebagai alternatif

---

## Shadcn Components yang Perlu Ditambah

Komponen shadcn/ui yang belum ada di `packages/ui/` dan dibutuhkan admin:

| Komponen | Dipakai untuk |
|----------|---------------|
| `table` | Basis admin-data-table |
| `dialog` | Konfirmasi hapus, form create/edit |
| `select` | Dropdown filter, role picker |
| `switch` | Toggle published/featured/menu on-off |
| `textarea` | Testimoni content, pesan, catatan admin |
| `tabs` | Site config grouping, filter tabs |
| `tooltip` | Info hover di stat cards |
| `popover` | Date picker wrapper |
| `command` | Search di tabel |
| `scroll-area` | Sidebar scroll |
| `alert-dialog` | Konfirmasi aksi destruktif |
| `progress` | Export progress (opsional) |

**Install semua:**
```bash
bunx shadcn@latest add table dialog select switch textarea tabs tooltip popover command scroll-area alert-dialog
```

---

## Phase 0 — Hapus Kode Lama

**Lakukan ini SEBELUM mulai implementasi admin.** Karena website ini company profile tanpa login untuk pengunjung, beberapa file existing tidak relevan dan harus dihapus:

### Hapus Routes
```
apps/web/src/routes/login.tsx           ← halaman login publik — HAPUS
apps/web/src/routes/_auth/route.tsx     ← protected layout untuk murid — HAPUS
apps/web/src/routes/_auth/dashboard.tsx ← dashboard murid — HAPUS
apps/web/src/routes/_auth/profile.tsx   ← profil murid — HAPUS
```

### Hapus Komponen
```
apps/web/src/components/sign-in-form.tsx  ← HAPUS
apps/web/src/components/sign-up-form.tsx  ← HAPUS
apps/web/src/components/user-menu.tsx     ← HAPUS (ada di header publik)
```

### Update Navbar (`site-header.tsx`)
- Tombol "Daftar Sekarang" **tidak perlu diubah** — sudah benar, langsung navigasi ke WhatsApp
- Hapus semua referensi ke session/auth di navbar publik jika ada

### Yang TIDAK dihapus
```
apps/web/src/routes/api/auth/$.ts  ← tetap ada (Better-Auth butuh ini untuk session admin)
packages/auth/                     ← tetap ada (dipakai admin login)
packages/db/src/schema/auth.ts     ← tetap ada (tabel user, session, account)
```

---

## Step-by-Step Implementasi (18 Phase, mulai dari Phase 0)

### ✅ Phase 0 — Hapus Kode Lama
- Hapus semua file yang tercantum di bagian "Phase 0 — Hapus Kode Lama" di atas
- Hapus referensi auth dari navbar publik (`site-header.tsx`) jika ada
- Verifikasi: website publik masih berfungsi normal tanpa login

### ✅ Phase 1 — DB: Schema Baru & Migration
- Update `user` table: tambah `role`, `isActive`
- Buat schema: `admin-menu-settings.ts`
- Buat schema: `contact-submissions.ts`
- Buat schema: `activity-logs.ts`
- Buat schema: `site-config.ts`
- Update `schema/index.ts` — export semua
- Migration: `packages/db/src/migrations/0002_admin_panel.sql`

### ✅ Phase 2 — DB: Seed Data
- Insert 8 default menu settings
- Insert 11+ default site config
- Set satu user sebagai superadmin:
  ```sql
  UPDATE user SET role = 'superadmin' WHERE email = 'badryansah99@gmail.com';
  ```
  > **Catatan:** Lakukan lewat D1 console di Cloudflare dashboard setelah deploy pertama.
  > Kemudian panggil `admin.settings.seedDefaultMenus` dari admin panel.

### ✅ Phase 3 — API: Procedure Builders
- Buat `adminProcedure` (admin + superadmin)
- Buat `superAdminProcedure` (superadmin only)
- Buat `createMenuGuard(menuKey)` (admin + cek menu config)
- Buat `logActivity()` utility di `packages/api/src/utils/log-activity.ts`

### ✅ Phase 4 — API: Core Admin Routers
- `admin/settings.ts` — getMenuConfig, updateMenuConfig, seedDefaultMenus
- `admin/stats.ts` — summary counts + recent items
- `admin/users.ts` — list, updateRole, toggleActive, create
- `admin/site-config.ts` — getAll (public), getGrouped, update
- `admin/activity.ts` — list (paginated, filterable)
- `admin/contacts.ts` — list, getById, updateStatus, addNote
- Semua sudah di-register di `admin/index.ts` → appRouter

### ✅ Phase 5 — Shadcn: Install Components
- Semua komponen shadcn yang dibutuhkan sudah terinstall

### ✅ Phase 6 — UI: Admin Layout + Komponen Dasar
- `admin-layout.tsx` — sidebar + header + content area
- `admin-sidebar.tsx` — dinamis berdasarkan role + menuConfig + badge unread
- `admin-header.tsx` — breadcrumb + role badge + user dropdown
- `admin-stat-card.tsx`, `admin-data-table.tsx`, `admin-form-shell.tsx`
- `admin-confirm-dialog.tsx`, `admin-status-badge.tsx`
- `admin-bulk-toolbar.tsx`, `admin-empty-state.tsx`, `admin-image-preview.tsx`

### ✅ Phase 7 — Route: Login + Layout + Guard
- `admin/login.tsx` — halaman login admin
- `admin/route.tsx` — layout + beforeLoad role check + loader menuConfig

### ✅ Phase 8 — Page: Dashboard Stats
- `admin/index.tsx` — grid stat cards + pesan belum dibaca + recent activity

### ✅ Phase 9 — Page: Settings (Superadmin)
- `admin/settings.tsx` — toggle on/off + drag reorder + simpan

### ✅ Phase 10 — Page: User Management (Superadmin)
- `admin/users.tsx` — tabel user + dropdown role + toggle aktif
- Tombol "Tambah Admin" + dialog form

### ✅ Phase 11 — Page: Site Config (Superadmin)
- `admin/site-config.tsx` — form grouped + simpan ke DB
- `useSiteConfig()` hook di `apps/web/src/hooks/use-site-config.ts`
- Root loader di `__root.tsx` prefetch site config saat SSR
- Semua komponen publik (header, footer, CTA, 20+ route) sudah baca dari DB

### ✅ Phase 12 — Page: CRUD Testimoni
- API: `admin/testimonials.ts` — all CRUD + toggle + bulk + export
- Route: `admin/testimonials/index.tsx` + `admin/testimonials/$id.tsx`

### ✅ Phase 13 — Page: CRUD Alumni
- API: `admin/alumni.ts`
- Route: `admin/alumni/index.tsx` + `admin/alumni/$id.tsx`

### ✅ Phase 14 — Page: CRUD Galeri
- API: `admin/gallery.ts`
- Route: `admin/gallery/index.tsx` (grid + dialog add/edit)

### ⏳ Phase 15 — Page: CRUD Events + Resources + Promos
- API sudah ada: `admin/events.ts`, `admin/resources.ts`, `admin/promos.ts`
- **BELUM:** Route frontend untuk events, resources, promos (index + $id masing-masing)

### ⏳ Phase 16 — Page: Pesan Masuk (Contact Submissions)
- API sudah ada: `admin/contacts.ts`
- **BELUM:** Route `admin/contacts/index.tsx` — inbox + detail sheet
- **BELUM:** Update halaman `/kontak` — form kirim ke API (simpan ke DB)

### ⏳ Phase 17 — Page: Activity Log (Superadmin)
- **BELUM:** Route `admin/activity.tsx` — timeline + filter
- Pastikan semua mutation Phase 12-16 sudah panggil `logActivity()`

---

## Urutan Prioritas

```
[✅]  Phase 0   → Hapus kode lama (login publik, _auth)
[✅]  Phase 1   → DB schema baru
[✅]  Phase 2   → Seed data
[✅]  Phase 3   → 3 procedure builders + logActivity
[✅]  Phase 4   → Core admin routers (settings, stats, users, config)
[✅]  Phase 5   → Install shadcn components
[✅]  Phase 6   → Admin UI components
[✅]  Phase 7   → Login page + Layout route + guard
[✅]  Phase 8   → Dashboard stats page
[✅]  Phase 9   → Settings page (superadmin)
[✅]  Phase 10  → User management (superadmin) + Tambah Admin
[✅]  Phase 11  → Site config (superadmin) + useSiteConfig hook
[✅]  Phase 12  → CRUD Testimoni
[✅]  Phase 13  → CRUD Alumni
[✅]  Phase 14  → CRUD Galeri
[⏳]  Phase 15  → CRUD Events + Resources + Promos  ← API ✅, route frontend BELUM
[⏳]  Phase 16  → Pesan Masuk + update form /kontak  ← API ✅, route + form BELUM
[⏳]  Phase 17  → Activity Log                       ← belum sama sekali
```

---

## Error Handling Patterns

### API Errors
```typescript
// Not found
const item = await db.select().from(testimonials).where(eq(testimonials.id, input.id)).get();
if (!item) throw new ORPCError("NOT_FOUND", { message: "Testimoni tidak ditemukan" });

// Forbidden (role)
if (context.role !== "superadmin") throw new ORPCError("FORBIDDEN");

// Validation — handled otomatis oleh Zod .input()

// DB error — catch & wrap
try { ... } catch (e) {
  throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Gagal menyimpan data" });
}
```

### Frontend Error Handling
```typescript
// Mutation error → toast
const mutation = orpc.admin.testimonials.create.useMutation({
  onSuccess: () => {
    toast.success("Testimoni berhasil ditambahkan");
    queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
    router.navigate({ to: "/admin/testimonials" });
  },
  onError: (error) => {
    toast.error(error.message ?? "Terjadi kesalahan");
  },
});
```

---

## Responsive Design Rules

| Breakpoint | Sidebar | Tabel | Form |
|------------|---------|-------|------|
| Desktop (>1024px) | Tetap tampil 240px, collapsible ke 60px | Full columns | 2 kolom grid |
| Tablet (768-1024px) | Collapsed 60px | Hide kolom minor | 2 kolom grid |
| Mobile (<768px) | Hidden, buka via Sheet | Scroll horizontal, hide kolom | 1 kolom stack |

---

## Checklist Pre-Launch Admin

### Infrastruktur
- [ ] DB migration berhasil (4 tabel baru + 2 kolom baru di user)
- [ ] Seed data tersimpan (8 menu + 11 config + 1 superadmin)
- [ ] `bun run check-types` pass 0 errors
- [ ] `bun run check` (Biome lint) pass

### Keamanan & Role
- [ ] Non-admin/non-superadmin di-redirect dari `/admin/*`
- [ ] Admin tidak bisa akses menu yang dinonaktifkan (frontend + API)
- [ ] Admin tidak bisa akses Users/Settings/SiteConfig/Activity
- [ ] Superadmin tidak bisa di-downgrade oleh superadmin lain
- [ ] Superadmin tidak bisa menonaktifkan diri sendiri

### Fungsional
- [ ] Dashboard menampilkan stats real dari DB
- [ ] Settings: toggle menu on/off tersimpan dan efektif
- [ ] User management: ubah role berfungsi
- [ ] Site config: perubahan terbaca di frontend (header, footer, CTA WA)
- [ ] Semua CRUD (7 resource + contacts): create, read, update, delete berfungsi
- [ ] Toggle published/featured langsung di tabel
- [ ] Bulk actions: select + publish/delete banyak sekaligus
- [ ] Export CSV berfungsi per resource
- [ ] Form kontak di `/kontak` menyimpan ke DB
- [ ] Badge unread pesan di sidebar
- [ ] Activity log mencatat semua aksi admin

### UX
- [ ] Loading: skeleton placeholder di tabel dan form
- [ ] Empty state: pesan + CTA saat tabel kosong
- [ ] Konfirmasi dialog sebelum hapus
- [ ] Toast notification setelah setiap aksi
- [ ] Responsive: mobile sidebar via Sheet, tabel scrollable
- [ ] Breadcrumb navigasi di header akurat
