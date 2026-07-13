# Momkiddy Indonesia — Website Plan (Detail)

## Overview

Website edukasi mirip Ruang Guru untuk **Lembaga Pendidikan Momkiddy Indonesia**.
Platform marketing + course listing + komunitas untuk ibu dan anak.

**Keputusan utama:**
- Enrollment = WhatsApp redirect (bukan sistem database)
- Admin panel = tidak untuk sekarang (konten via seed data / static)
- Extra pages: Blog/Artikel, FAQ, Galeri/Dokumentasi

**Brand:**
- Nama: Lembaga Pendidikan Momkiddy Indonesia
- Founder: Lita Hendratno
- Tagline: "Ibu Pintar Mengajar, Anak Cerdas Berkarya"
- Primary: `#1877F2` (biru)
- Accent: `#FF8A00` (oranye)
- WA Admin: 08xx-xxxx-xxxx (isi nomor asli)
- Instagram: @litahendratno_
- Alamat: (isi alamat lengkap)

---

## Semua Halaman (25+ Pages)

### A. Public Marketing Pages

---

#### 1. `/` — Landing Page (Homepage)
**File:** `routes/index.tsx`

| Section | Detail |
|---|---|
| **Navbar** | Logo Momkiddy + Nav Links + CTA "Daftar Sekarang" (sticky top) |
| **Hero** | Judul besar: "Ibu Pintar Mengajar, Anak Cerdas Berkarya" + Sub-copy pendek tentang Momkiddy + 2 tombol: "Lihat Program" (→ /programs) & "Hubungi Kami" (→ WA) + Ilustrasi ibu & anak belajar |
| **Social Proof Bar** | Angka: "500+ Ibu Terlatih • 5 Program Unggulan • 20+ Batch Selesai • 4.9/5 Rating" |
| **Tentang Momkiddy** | Teaser 2-3 paragraf dari company profile + foto founder kecil + tombol "Selengkapnya →" ke /about |
| **Program Unggulan** | 5 kartu program (icon + judul + target usia + badge "Best Seller" untuk Microteaching) + tombol "Lihat Semua Program →" ke /programs |
| **Cara Kerja** | 4 langkah: (1) Pilih Program → (2) Hubungi Admin → (3) Ikuti Kelas → (4) Dapatkan Sertifikat. Dengan icon tiap step |
| **Keunggulan** | 5 kartu keunggulan: Ibu & Anak Satu Kurikulum, Play-Based Learning, Kelas Hybrid, Dibimbing Founder, Kelas Kecil & Terarah |
| **Testimonial** | 3 kartu testimoni featured + rating bintang + tombol "Lihat Semua →" ke /testimoni |
| **Alumni Showcase** | 3 kartu alumni featured (foto, nama, batch, cerita singkat) + tombol "Lihat Semua →" ke /alumni |
| **Batch Terbaru** | Banner: "Batch XX — Pendaftaran Dibuka!" + tanggal + sisa kuota + CTA WA |
| **Blog Terbaru** | 3 kartu artikel terbaru + tombol "Baca Selengkapnya →" ke /blog |
| **CTA Footer Banner** | Background biru/oranye gradient + "Siap Menjadi Guru Pertama untuk Anak Anda?" + tombol WA besar |
| **Footer** | Logo + tagline + quick links + kontak + sosmed + copyright |

---

#### 2. `/about` — Tentang Kami
**File:** `routes/about.tsx`

| Section | Detail |
|---|---|
| **Hero Kecil** | Judul "Tentang Momkiddy Indonesia" + breadcrumb |
| **Company Profile** | Full paragraf tentang lembaga dari isi-content.md |
| **Visi** | Box highlight dengan ikon target |
| **Misi** | 3 misi dengan icon masing-masing (Membekali Ibu, Mencerdaskan Anak, Menguatkan Bahasa) |
| **Founder Story** | Foto besar Lita Hendratno + bio lengkap + kutipan inspiratif |
| **Timeline** | Sejarah singkat Momkiddy: kapan didirikan, milestone batch, jumlah alumni |
| **Nilai-Nilai** | 4 core values: Percaya Diri, Menyenangkan, Terarah, Bermakna |
| **CTA** | "Tertarik Bergabung?" + tombol ke /programs dan /kontak |

---

#### 3. `/founder` — Profil Founder
**File:** `routes/founder.tsx`

| Section | Detail |
|---|---|
| **Hero** | Foto besar Lita Hendratno + nama + gelar/peran |
| **Bio Lengkap** | Latar belakang pendidikan, pengalaman, motivasi mendirikan Momkiddy |
| **Filosofi Mengajar** | Kutipan-kutipan dari founder tentang pendidikan anak dan peran ibu |
| **Pencapaian** | Jumlah batch yang telah dibimbing, jumlah alumni, penghargaan (jika ada) |
| **Media & Liputan** | Jika ada liputan media / wawancara |
| **CTA** | "Belajar Langsung dari Bu Lita" → link ke program Microteaching |

---

#### 4. `/programs` — Semua Program
**File:** `routes/programs/index.tsx`
**Layout:** `routes/programs/route.tsx` (breadcrumb wrapper)

| Section | Detail |
|---|---|
| **Hero Kecil** | "Program Unggulan Momkiddy" + sub-copy |
| **Filter Tabs** | Tab: "Semua" / "Untuk Ibu" / "Untuk Anak" |
| **Grid Program** | Kartu per program: thumbnail, judul, kategori badge (Ibu/Anak), usia target, deskripsi singkat, badge "Best Seller" jika applicable, tombol "Lihat Detail" |
| **Comparison Table** | Tabel perbandingan: Nama Program / Target / Usia / Durasi / Mode / Harga |
| **CTA** | "Bingung Pilih Program?" + tombol konsultasi WA |

---

#### 5. `/programs/microteaching` — Kelas Pengajar Microteaching
**File:** `routes/programs/microteaching.tsx`

| Section | Detail |
|---|---|
| **Hero Program** | Judul + badge "Best Seller" + "Program untuk Ibu" tag + deskripsi singkat |
| **Overview** | Apa itu Mom Teacher? + foto kelas + penjelasan program |
| **Kurikulum (Accordion)** | 5 modul: (1) Teknik Mengajar 5 Menit, (2) Membuat RPP Simpel, (3) Mengelola Kelas di Rumah, (4) Metode Calistung Phonics, (5) Praktik Mengajar & Umpan Balik |
| **Hasil Belajar** | Checklist: 6 poin "Setelah mengikuti program ini, peserta mampu..." |
| **Sertifikat** | Info Sertifikat Mom Teacher + contoh gambar sertifikat |
| **Target Peserta** | 6 kategori target (ibu, calon guru, mompreneur, dll) |
| **Info Batch** | Batch dibuka tiap bulan, max 20 peserta, mode hybrid |
| **Jadwal & Harga** | Durasi, hari, waktu, harga (atau "Hubungi Admin") |
| **Testimoni** | 3 testimoni khusus program ini |
| **FAQ Program** | 5-8 FAQ spesifik Microteaching |
| **CTA Daftar** | Tombol besar WA: "Daftar Batch Selanjutnya" |

---

#### 6. `/programs/calistung` — Calistung Fun
**File:** `routes/programs/calistung.tsx`

| Section | Detail |
|---|---|
| **Hero Program** | "Calistung Fun" + tag "Usia 3–7 Tahun" |
| **Overview** | Metode phonics + storytelling + permainan edukatif |
| **Kurikulum** | Level 1: Mengenal huruf → Level 2: Suku kata → Level 3: Membaca kata → Level 4: Membaca kalimat + Menulis + Berhitung dasar |
| **Metode** | Phonics approach, tanpa tekanan, bertahap |
| **Jadwal & Harga** | Durasi per pertemuan, frekuensi, harga |
| **Testimoni** | Testimoni dari orang tua murid |
| **CTA** | WA daftar |

---

#### 7. `/programs/bimbel-sd` — Bimbel SD Tematik
**File:** `routes/programs/bimbel-sd.tsx`

| Section | Detail |
|---|---|
| **Hero Program** | "Bimbel SD Tematik" + tag "Kelas 1–6 SD" |
| **Overview** | Mata pelajaran: Matematika, Bahasa Indonesia, IPA, Tematik |
| **Keunggulan** | Max 5 anak/kelas, pendekatan personal |
| **Kelas Tersedia** | Kelas 1-2 / Kelas 3-4 / Kelas 5-6 (tabs atau cards) |
| **Jadwal & Harga** | Per kelas/level |
| **CTA** | WA daftar |

---

#### 8. `/programs/english-fun` — English Fun Class
**File:** `routes/programs/english-fun.tsx`

| Section | Detail |
|---|---|
| **Hero Program** | "English Fun Class" + tag "Usia 5–12 Tahun" |
| **Overview** | Berbasis speaking & listening, bukan grammar hafalan |
| **Metode** | Games, role play, lagu, percakapan harian |
| **Level** | Beginner → Intermediate → Advanced |
| **Sample Aktivitas** | Contoh games dan role play yang digunakan |
| **Jadwal & Harga** | |
| **CTA** | WA daftar |

---

#### 9. `/programs/menulis-kreatif` — Menulis Kreatif dan Literasi
**File:** `routes/programs/menulis-kreatif.tsx`

| Section | Detail |
|---|---|
| **Hero Program** | "Menulis Kreatif & Literasi" + target usia |
| **Overview** | Cerita, puisi, pidato, karya tulis sederhana |
| **Apa yang Dipelajari** | Menuangkan ide, struktur cerita, percaya diri tampil |
| **Showcase** | Contoh karya murid (jika ada) |
| **Jadwal & Harga** | |
| **CTA** | WA daftar |

---

#### 10. `/metode` — Metode Belajar Momkiddy
**File:** `routes/metode.tsx`

| Section | Detail |
|---|---|
| **Hero** | "Metode Belajar Momkiddy" + sub-copy |
| **Phonics Method** | Penjelasan lengkap metode phonics: apa, mengapa, bagaimana + diagram/infografis |
| **Play-Based Learning** | Penjelasan belajar berbasis permainan + contoh aktivitas |
| **Microteaching Approach** | Teknik mengajar 5 menit + RPP simpel |
| **Satu Kurikulum Ibu & Anak** | Bagaimana materi ibu terhubung dengan materi anak |
| **Perbandingan** | Tabel: Metode Momkiddy vs Metode Konvensional |
| **CTA** | "Coba Metode Kami" → link ke programs |

---

#### 11. `/sertifikasi` — Sertifikasi Mom Teacher
**File:** `routes/sertifikasi.tsx`

| Section | Detail |
|---|---|
| **Hero** | "Sertifikat Mom Teacher Momkiddy" + gambar contoh sertifikat |
| **Apa Itu** | Penjelasan sertifikasi, apa artinya, siapa yang bisa dapat |
| **Manfaat** | Bekal homeschooling, buka les privat, kelas dari rumah |
| **Proses** | Langkah mendapatkan: Daftar → Ikuti Kelas → Praktik → Evaluasi → Sertifikat |
| **Verifikasi** | (Opsional) Input nomor sertifikat untuk verifikasi keaslian |
| **Alumni Bersertifikat** | Grid alumni yang sudah sertifikasi + cerita mereka |
| **CTA** | "Dapatkan Sertifikat Anda" → link ke /programs/microteaching |

---

#### 12. `/jadwal` — Jadwal & Harga
**File:** `routes/jadwal.tsx`

| Section | Detail |
|---|---|
| **Hero** | "Jadwal Kelas & Biaya Program" |
| **Batch Aktif** | Kartu per batch yang sedang dibuka: program, tanggal mulai, sisa kuota, status (Open/Full) |
| **Kalender** | Kalender visual bulanan menunjukkan jadwal batch |
| **Tabel Harga** | Tabel semua program: Nama / Durasi / Mode / Harga / Status |
| **Paket Bundling** | Jika ada paket ibu+anak atau multi-program |
| **Early Bird / Promo** | Promo yang sedang berlaku |
| **CTA** | WA untuk daftar + info lebih lanjut |

---

#### 13. `/testimoni` — Halaman Testimoni
**File:** `routes/testimoni.tsx`

| Section | Detail |
|---|---|
| **Hero** | "Apa Kata Mereka?" + rating rata-rata |
| **Filter** | Tab filter: Semua / Microteaching / Calistung / Bimbel SD / English / Menulis |
| **Grid Testimoni** | Kartu: foto, nama, role ("Peserta Batch 3"), program, rating bintang, isi testimoni |
| **Video Testimoni** | Embed video YouTube/TikTok testimoni (jika ada) |
| **Stats** | "98% peserta puas" / "95% merekomendasikan" / dsb |
| **CTA** | "Gabung dan rasakan sendiri!" |

---

#### 14. `/alumni` — Alumni & Lulusan
**File:** `routes/alumni.tsx`

| Section | Detail |
|---|---|
| **Hero** | "Alumni Momkiddy Indonesia" + angka total alumni |
| **Filter** | Filter by program / batch |
| **Grid Alumni** | Kartu: foto, nama, batch ("Batch 5, Maret 2025"), program, cerita singkat |
| **Success Stories** | 2-3 cerita panjang alumni yang sudah sukses (buka kelas sendiri, dll) |
| **Sertifikat** | Contoh sertifikat yang didapat alumni |
| **Map Alumni** | (Opsional) Peta persebaran alumni di Indonesia |
| **CTA** | "Jadilah Alumni Berikutnya" |

---

#### 15. `/blog` — Blog & Artikel
**File:** `routes/blog/index.tsx`

| Section | Detail |
|---|---|
| **Hero** | "Blog Momkiddy" + "Tips Parenting & Belajar Anak" |
| **Featured Article** | 1 artikel utama besar di atas (cover image besar) |
| **Filter/Tags** | Tag: Parenting, Calistung, Tips Mengajar, Homeschooling, English, Aktivitas Anak |
| **Grid Artikel** | Kartu: cover image, judul, excerpt, tanggal, tag, penulis |
| **Pagination** | Load more atau pagination |
| **Sidebar/Newsletter** | CTA "Dapatkan tips parenting mingguan" (opsional email subscribe) |

---

#### 16. `/blog/:slug` — Detail Artikel
**File:** `routes/blog/$slug.tsx`

| Section | Detail |
|---|---|
| **Breadcrumb** | Blog > Kategori > Judul Artikel |
| **Header** | Judul, tanggal publish, penulis + foto, estimasi baca |
| **Cover Image** | Gambar besar |
| **Content** | Markdown rendered: heading, paragraf, list, gambar, quote |
| **Tags** | Tag artikel di bawah content |
| **Share** | Tombol share: WhatsApp, Facebook, Twitter, Copy Link |
| **Author Bio** | Kartu penulis di bawah artikel |
| **Related Articles** | 3 artikel terkait berdasarkan tag |
| **CTA** | "Tertarik belajar lebih?" → link ke programs |

---

#### 17. `/galeri` — Galeri & Dokumentasi
**File:** `routes/galeri.tsx`

| Section | Detail |
|---|---|
| **Hero** | "Galeri Kegiatan Momkiddy" |
| **Filter** | Filter: Semua / Kelas Microteaching / Kelas Anak / Workshop / Event |
| **Masonry Grid** | Foto-foto kegiatan dalam layout masonry/pinterest |
| **Lightbox** | Klik foto → modal besar dengan caption + navigasi prev/next |
| **Video** | Section embed video kegiatan (YouTube) |
| **CTA** | "Ikuti kegiatan kami selanjutnya" |

---

#### 18. `/faq` — FAQ
**File:** `routes/faq.tsx`

| Section | Detail |
|---|---|
| **Hero** | "Pertanyaan yang Sering Diajukan" |
| **Search** | Input search untuk filter FAQ |
| **Kategori Tabs** | Umum / Pendaftaran / Program Ibu / Program Anak / Teknis |
| **Accordion FAQ** | Pertanyaan + jawaban per kategori |
| **Contoh FAQ** | |
| | Q: Apa itu Momkiddy Indonesia? |
| | Q: Siapa yang bisa ikut program Microteaching? |
| | Q: Bagaimana cara mendaftar? |
| | Q: Apakah kelas bisa diikuti secara online? |
| | Q: Berapa biaya program? |
| | Q: Berapa lama durasi program? |
| | Q: Anak saya belum bisa baca, bisa ikut Calistung Fun? |
| | Q: Apa manfaat Sertifikat Mom Teacher? |
| | Q: Bagaimana jika saya ketinggalan sesi? |
| | Q: Apakah ada garansi? |
| **CTA** | "Masih ada pertanyaan?" → WA admin |

---

#### 19. `/kontak` — Kontak
**File:** `routes/kontak.tsx`

| Section | Detail |
|---|---|
| **Hero** | "Hubungi Kami" |
| **Info Kontak** | WhatsApp (klik langsung buka WA), Instagram, Email |
| **Alamat** | Alamat lengkap + embed Google Maps |
| **Jam Operasional** | Senin–Sabtu, 08.00–17.00 WIB |
| **Form Kontak** | Nama, email, nomor HP, subjek (dropdown), pesan → submit ke WA atau simpan ke DB |
| **Sosial Media** | Link ke semua platform: IG, TikTok, YouTube, Facebook |
| **CTA** | "Chat langsung via WhatsApp" tombol besar hijau |

---

#### 20. `/cara-daftar` — Cara Mendaftar
**File:** `routes/cara-daftar.tsx`

| Section | Detail |
|---|---|
| **Hero** | "Cara Mendaftar di Momkiddy" |
| **Step-by-Step** | 5 langkah visual: (1) Pilih Program → (2) Chat Admin via WA → (3) Konfirmasi & Pembayaran → (4) Masuk Grup Kelas → (5) Mulai Belajar |
| **Info Pembayaran** | Transfer bank / e-wallet (nomor rekening) |
| **Dokumen Diperlukan** | Apa saja yang perlu disiapkan |
| **Batch Terdekat** | Info batch yang paling dekat + sisa kuota |
| **CTA** | "Daftar Sekarang via WA" |

---

#### 21. `/event` — Event & Webinar
**File:** `routes/event.tsx`

| Section | Detail |
|---|---|
| **Hero** | "Event & Webinar Momkiddy" |
| **Upcoming Events** | Kartu event: judul, tanggal, lokasi (online/offline), deskripsi singkat, status (Buka/Penuh), tombol daftar (WA) |
| **Past Events** | Grid event yang sudah selesai + foto dokumentasi |
| **Kalender** | Mini kalender dengan event yang ditandai |
| **CTA** | "Jangan lewatkan event kami — follow IG @litahendratno_" |

---

#### 22. `/promo` — Promo & Penawaran
**File:** `routes/promo.tsx`

| Section | Detail |
|---|---|
| **Hero** | "Promo Spesial Momkiddy" |
| **Active Promos** | Kartu promo: nama promo, program, diskon/benefit, berlaku sampai, syarat |
| **Referral** | "Ajak Teman, Dapat Potongan" — program referral jika ada |
| **Paket Bundling** | Paket ibu+anak, multi-program discount |
| **CTA** | "Klaim promo via WA" |

---

#### 23. `/resources` — Materi Gratis
**File:** `routes/resources.tsx`

| Section | Detail |
|---|---|
| **Hero** | "Materi Gratis untuk Orang Tua" |
| **Kategori** | Worksheet Calistung / Flashcard / Jadwal Belajar Template / Tips PDF |
| **Grid Resources** | Kartu: thumbnail, judul, deskripsi, format (PDF/Image), tombol download |
| **Preview** | Modal preview sebelum download |
| **Email Gate** | (Opsional) Masukkan email untuk download → lead generation |
| **CTA** | "Mau lebih? Ikuti program lengkap kami" |

---

#### 24. `/mitra` — Jadi Mitra / Karir
**File:** `routes/mitra.tsx`

| Section | Detail |
|---|---|
| **Hero** | "Bergabung Bersama Momkiddy" |
| **Peluang** | Jadi pengajar mitra, buka cabang kelas, kolaborasi konten |
| **Syarat** | Kualifikasi yang diperlukan |
| **Benefit** | Apa yang didapat mitra: pelatihan, materi, branding |
| **Testimoni Mitra** | Cerita mitra yang sudah bergabung |
| **CTA** | "Hubungi kami untuk kerjasama" → WA |

---

#### 25. `/syarat-ketentuan` — Syarat & Ketentuan
**File:** `routes/syarat-ketentuan.tsx`

Halaman legal: syarat pendaftaran, kebijakan pembatalan, refund, hak cipta materi.

---

#### 26. `/kebijakan-privasi` — Kebijakan Privasi
**File:** `routes/kebijakan-privasi.tsx`

Halaman legal: data yang dikumpulkan, penggunaan data, hak pengguna.

---

### B. Protected Pages (Setelah Login)

---

#### 27. `/dashboard` — Dashboard Murid
**File:** `routes/_auth/dashboard.tsx` (update)

| Section | Detail |
|---|---|
| **Welcome** | "Selamat datang, [Nama]!" |
| **Program Saya** | Kartu program yang diikuti (jika ada) |
| **Batch Terbaru** | Info batch yang sedang berjalan / akan datang |
| **Resources** | Akses cepat ke materi/resources |
| **Notifikasi** | Pengumuman dari admin |

---

#### 28. `/profile` — Profil Murid
**File:** `routes/_auth/profile.tsx`

| Section | Detail |
|---|---|
| **Avatar & Info** | Foto, nama, email |
| **Edit Profile** | Form: ubah nama, foto, nomor HP |
| **Riwayat** | Batch yang pernah diikuti |
| **Sertifikat** | Download sertifikat (jika ada) |

---

### C. Utility Pages

---

#### 29. `/login` — Login (sudah ada, update styling)
#### 30. `/404` — Not Found (custom design)

---

## Landing Page Detail Sections (`/`)

```
┌─────────────────────────────────────────────────┐
│  NAVBAR (sticky)                                │
│  Logo | Beranda | Program | Metode | Alumni |   │
│  Blog | Kontak | [Daftar Sekarang]              │
├─────────────────────────────────────────────────┤
│  HERO                                           │
│  "Ibu Pintar Mengajar, Anak Cerdas Berkarya"   │
│  Sub-copy + [Lihat Program] [Hubungi Kami]      │
│  + Ilustrasi/Foto                               │
├─────────────────────────────────────────────────┤
│  SOCIAL PROOF BAR                               │
│  500+ Ibu | 5 Program | 20+ Batch | 4.9 Rating │
├─────────────────────────────────────────────────┤
│  TENTANG MOMKIDDY (teaser)                      │
│  2-3 paragraf + foto founder + [Selengkapnya]   │
├─────────────────────────────────────────────────┤
│  PROGRAM UNGGULAN                               │
│  [Microteaching★] [Calistung] [Bimbel SD]       │
│  [English Fun] [Menulis Kreatif]                │
│  + [Lihat Semua Program →]                      │
├─────────────────────────────────────────────────┤
│  CARA KERJA (4 Steps)                           │
│  Pilih → Chat WA → Ikuti Kelas → Sertifikat    │
├─────────────────────────────────────────────────┤
│  KEUNGGULAN MOMKIDDY                            │
│  5 kartu: Satu Kurikulum, Play-Based,           │
│  Hybrid, Bimbingan Founder, Kelas Kecil         │
├─────────────────────────────────────────────────┤
│  TESTIMONI                                      │
│  3 kartu testimoni + [Lihat Semua →]            │
├─────────────────────────────────────────────────┤
│  ALUMNI SHOWCASE                                │
│  3 kartu alumni + [Lihat Semua →]               │
├─────────────────────────────────────────────────┤
│  BATCH TERBARU                                  │
│  "Batch XX Dibuka!" + tanggal + kuota + WA CTA  │
├─────────────────────────────────────────────────┤
│  BLOG TERBARU                                   │
│  3 artikel terbaru + [Baca Selengkapnya →]      │
├─────────────────────────────────────────────────┤
│  CTA BANNER                                     │
│  "Siap Menjadi Guru Pertama?" + [Daftar WA]    │
├─────────────────────────────────────────────────┤
│  FOOTER                                         │
│  Logo + Links + Kontak + Sosmed + Copyright     │
└─────────────────────────────────────────────────┘
```

---

## Database Schema

### `testimonials`
```
id          TEXT PK
authorName  TEXT NOT NULL
authorRole  TEXT                   -- "Peserta Batch 3"
authorImage TEXT                   -- URL
programSlug TEXT                   -- nullable, "microteaching" dll
content     TEXT NOT NULL
rating      INTEGER DEFAULT 5     -- 1–5
isPublished INTEGER DEFAULT 0     -- boolean
isFeatured  INTEGER DEFAULT 0     -- boolean
createdAt   INTEGER               -- timestamp_ms
updatedAt   INTEGER
```

### `alumni`
```
id              TEXT PK
name            TEXT NOT NULL
photo           TEXT              -- URL
batchLabel      TEXT              -- "Batch 5, Maret 2025"
programSlug     TEXT
certificateUrl  TEXT              -- URL nullable
shortStory      TEXT
isPublished     INTEGER DEFAULT 0
isFeatured      INTEGER DEFAULT 0
graduatedAt     INTEGER           -- timestamp_ms
createdAt       INTEGER
updatedAt       INTEGER
```

### `blog_posts`
```
id          TEXT PK
slug        TEXT UNIQUE NOT NULL
title       TEXT NOT NULL
excerpt     TEXT
content     TEXT NOT NULL          -- markdown
authorName  TEXT
authorImage TEXT                   -- URL nullable
coverImage  TEXT                   -- URL
tags        TEXT                   -- JSON array string
isPublished INTEGER DEFAULT 0
publishedAt INTEGER               -- timestamp_ms
createdAt   INTEGER
updatedAt   INTEGER
```

### `gallery_items`
```
id          TEXT PK
imageUrl    TEXT NOT NULL
caption     TEXT
event       TEXT                   -- "Workshop Batch 3"
category    TEXT                   -- "microteaching" / "kelas-anak" / "workshop" / "event"
takenAt     INTEGER               -- timestamp_ms
isPublished INTEGER DEFAULT 0
createdAt   INTEGER
updatedAt   INTEGER
```

### `events`
```
id          TEXT PK
title       TEXT NOT NULL
description TEXT
date        INTEGER NOT NULL      -- timestamp_ms
endDate     INTEGER               -- timestamp_ms nullable
location    TEXT                   -- "Online via Zoom" / alamat
type        TEXT                   -- "webinar" / "workshop" / "kelas-terbuka"
imageUrl    TEXT
isUpcoming  INTEGER DEFAULT 1     -- boolean
maxSeats    INTEGER
waMessage   TEXT                   -- custom WA message untuk event ini
createdAt   INTEGER
updatedAt   INTEGER
```

### `resources`
```
id          TEXT PK
title       TEXT NOT NULL
description TEXT
category    TEXT                   -- "worksheet" / "flashcard" / "template" / "tips"
fileUrl     TEXT NOT NULL          -- download URL
thumbnailUrl TEXT
fileType    TEXT                   -- "pdf" / "image" / "zip"
downloadCount INTEGER DEFAULT 0
isPublished INTEGER DEFAULT 0
createdAt   INTEGER
updatedAt   INTEGER
```

### `promos`
```
id          TEXT PK
title       TEXT NOT NULL
description TEXT
programSlug TEXT                   -- nullable (all programs jika null)
discountLabel TEXT                 -- "Diskon 20%" / "Free Worksheet"
validFrom   INTEGER               -- timestamp_ms
validUntil  INTEGER               -- timestamp_ms
isActive    INTEGER DEFAULT 1
createdAt   INTEGER
updatedAt   INTEGER
```

**Program data** → Static TypeScript di `apps/web/src/lib/programs-content.ts`
**FAQ data** → Static TypeScript di `apps/web/src/lib/faq-content.ts`
**Legal pages** → Static TypeScript di `apps/web/src/lib/legal-content.ts`

---

## API Procedures

| Router | Procedure | Auth | Keterangan |
|---|---|---|---|
| testimonials | `listFeatured` | public | Homepage (isFeatured & isPublished) |
| testimonials | `listByProgram` | public | Program detail page |
| testimonials | `list` | public | Halaman /testimoni, paginated |
| alumni | `listFeatured` | public | Homepage + alumni page |
| alumni | `list` | public | Halaman /alumni, paginated, filter by program |
| blog | `list` | public | Halaman /blog, paginated, filter by tag |
| blog | `getBySlug` | public | Detail artikel |
| blog | `listRelated` | public | Artikel terkait by tags |
| gallery | `list` | public | Halaman /galeri, filter by category |
| events | `listUpcoming` | public | Event yang akan datang |
| events | `listPast` | public | Event yang sudah lewat |
| resources | `list` | public | Halaman /resources, filter by category |
| resources | `incrementDownload` | public | Track download count |
| promos | `listActive` | public | Promo yang aktif |

---

## Design System

### Brand Colors di `globals.css`
```css
:root {
  --primary: oklch(0.514 0.222 253.4);        /* #1877F2 biru */
  --primary-foreground: oklch(0.985 0 0);
  --accent: oklch(0.712 0.185 54.7);          /* #FF8A00 oranye */
  --accent-foreground: oklch(0.145 0 0);
}
```

### Komponen UI Baru (packages/ui/src/components/)
`badge`, `separator`, `avatar`, `sheet`, `accordion`, `breadcrumb`, `tabs`, `dialog`, `textarea`, `progress`, `carousel`, `lightbox`

### Komponen App Baru (apps/web/src/components/)
```
site-header.tsx          — Marketing nav + mobile hamburger
site-footer.tsx          — Footer links + kontak + sosmed
sections/
  hero-section.tsx       — Reusable hero untuk semua page
  program-card.tsx       — Kartu program
  testimonial-card.tsx   — Kartu testimoni
  alumni-card.tsx        — Kartu alumni
  keunggulan-section.tsx — 5 keunggulan
  whatsapp-cta.tsx       — Tombol WA reusable
  stats-bar.tsx          — Social proof angka-angka
  steps-section.tsx      — Cara kerja / langkah-langkah
  blog-card.tsx          — Kartu artikel blog
  event-card.tsx         — Kartu event
  resource-card.tsx      — Kartu resource/download
  promo-banner.tsx       — Banner promo
  page-hero.tsx          — Hero kecil untuk inner pages (judul + breadcrumb)
  share-buttons.tsx      — Tombol share artikel (WA, FB, Twitter, Copy)
  gallery-grid.tsx       — Masonry grid + lightbox
  faq-accordion.tsx      — Reusable FAQ accordion
```

---

## WhatsApp CTA Pattern

```tsx
const WA_NUMBER = "6208xxxxxxxxxx"
const waUrl = (program?: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    program
      ? `Halo Momkiddy, saya ingin daftar program ${program}`
      : `Halo Momkiddy, saya ingin bertanya tentang program`
  )}`
```

---

## Static Content Files

### `apps/web/src/lib/programs-content.ts`
Semua data 5 program: slug, title, subtitle, description, category, ageRange, curriculum, targetPeserta, hasil, jadwal, harga, metode, FAQ per program.

### `apps/web/src/lib/faq-content.ts`
Semua FAQ per kategori: Umum, Pendaftaran, Program Ibu, Program Anak, Teknis.

### `apps/web/src/lib/legal-content.ts`
Syarat & Ketentuan + Kebijakan Privasi.

### `apps/web/src/lib/site-config.ts`
Config global: WA number, IG handle, alamat, jam operasional, social links.

---

## Urutan Implementasi

### Phase 1 — Visual Foundation ✅ SELESAI
- [x] Update brand colors di `globals.css`
- [x] Tambah shadcn components: `badge`, `separator`, `avatar`, `sheet`, `accordion`, `breadcrumb`
- [x] Buat `site-config.ts` (WA number, social links, dll)
- [x] Buat `site-header.tsx` (marketing nav + mobile hamburger via Sheet)
- [x] Buat `site-footer.tsx`
- [x] Buat `page-hero.tsx` (reusable inner page hero)
- [x] Buat `whatsapp-cta.tsx`
- [x] Update `__root.tsx`: lang="id", hapus dark, flex col layout

### Phase 2 — Landing Page ✅ SELESAI
- [x] Buat section components: `stats-bar`, `program-card`, `testimonial-card`, `alumni-card`, `keunggulan-section`, `steps-section`, `whatsapp-cta`
- [x] Rewrite `routes/index.tsx` — Hero, StatsBar, AboutTeaser, ProgramsSection, StepsSection, KeunggulanSection, TestimoniSection (live DB), AlumniSection (live DB), WhatsAppCta
- [x] Connect homepage Testimoni + Alumni ke live DB via TanStack Query (dengan static fallback)

### Phase 3 — Static Content Pages ✅ SELESAI
- [x] Buat `programs-content.ts`, `faq-content.ts`, `site-config.ts`
- [ ] `legal-content.ts` — belum dibuat (syarat-ketentuan & kebijakan-privasi pakai inline content)
- [x] `routes/programs/index.tsx` + `route.tsx` + **`$slug.tsx`** (dynamic, 1 file untuk semua 5 program — menggantikan 5 file individual)
- [x] `routes/about.tsx`
- [x] `routes/founder.tsx`
- [x] `routes/metode.tsx`
- [x] `routes/sertifikasi.tsx`
- [x] `routes/jadwal.tsx`
- [x] `routes/cara-daftar.tsx`
- [x] `routes/faq.tsx`
- [x] `routes/kontak.tsx`
- [x] `routes/mitra.tsx`
- [x] `routes/syarat-ketentuan.tsx`
- [x] `routes/kebijakan-privasi.tsx`
- [x] `routes/testimoni.tsx` (static + filter UI)
- [x] `routes/event.tsx` (placeholder "segera hadir")
- [x] `routes/promo.tsx` (placeholder "segera hadir")
- [x] `routes/resources.tsx` (placeholder "segera hadir")

> **Catatan:** 5 program detail pages (microteaching, calistung, dll) dikonsolidasi menjadi `programs/$slug.tsx` satu file dinamis — lebih DRY dan mudah di-maintain.

### Phase 4 — DB + Seed ✅ SELESAI
- [x] Tulis 7 schema files: `testimonials.ts`, `alumni.ts`, `blog_posts.ts`, `gallery_items.ts`, `events.ts`, `resources.ts`, `promos.ts`
- [x] Update `schema/index.ts`
- [x] `bun db:generate` → migration `0000_special_devos.sql` + `0001_modern_morgan_stark.sql` berhasil
- [x] Buat `packages/db/src/seed.ts` (5 testimonials, 3 alumni, 2 blog posts, 5 gallery items)

### Phase 5 — Dynamic Data Pages ✅ SELESAI
- [x] Tulis 7 API routers: `testimonials.ts`, `alumni.ts`, `blog.ts`, `gallery.ts`, `events.ts`, `resources.ts`, `promos.ts`
- [x] Update `packages/api/src/routers/index.ts`
- [x] Connect `routes/index.tsx` (homepage) ke DB — testimonials + alumni dengan static fallback
- [x] `routes/alumni.tsx` — live DB dengan filter by program
- [x] `routes/blog/index.tsx` — live DB, kartu artikel
- [x] `routes/blog/$slug.tsx` — live DB, custom markdown renderer
- [x] `routes/galeri.tsx` — live DB dengan placeholder fallback
- [x] `routes/event.tsx` — live DB, upcoming + past events, static fallback
- [x] `routes/resources.tsx` — live DB, filter by kategori, static fallback
- [x] `routes/promo.tsx` — live DB, promo cards + WA CTA, static fallback

### Phase 6 — Auth Pages ✅ SELESAI
- [x] Update `routes/_auth/dashboard.tsx` — welcome, quick actions, program cards, profil teaser
- [x] `routes/_auth/profile.tsx` — edit nama, view email, logout
- [x] Rewrite `routes/login.tsx` — brand Momkiddy, tab masuk/daftar, Indonesian labels

---

## Status File Aktual

### Modified ✅
- `packages/ui/src/styles/globals.css` — brand colors OKLCH
- `apps/web/src/routes/__root.tsx` — lang="id", light mode, flex col
- `apps/web/src/routes/index.tsx` — full rewrite landing page
- `packages/db/src/schema/index.ts` — tambah 4 schema exports
- `packages/api/src/routers/index.ts` — tambah 4 routers bersarang
- `apps/web/vite.config.ts` — fix type error `cloudflareWorkersAlias`
- `packages/api/package.json` — tambah `drizzle-orm` dependency

### Created — UI Components ✅ (6 dari 12 yang direncanakan)
`badge.tsx`, `separator.tsx`, `avatar.tsx`, `sheet.tsx`, `accordion.tsx`, `breadcrumb.tsx`

Belum dibuat: `tabs.tsx`, `dialog.tsx`, `textarea.tsx`, `progress.tsx`, `carousel.tsx`, `lightbox.tsx`

### Created — App Components ✅ (10 dari 18 yang direncanakan)
`site-header.tsx`, `site-footer.tsx`, `sections/page-hero.tsx`, `sections/program-card.tsx`, `sections/testimonial-card.tsx`, `sections/alumni-card.tsx`, `sections/keunggulan-section.tsx`, `sections/whatsapp-cta.tsx`, `sections/stats-bar.tsx`, `sections/steps-section.tsx`

Belum dibuat: `sections/blog-card.tsx`, `sections/event-card.tsx`, `sections/resource-card.tsx`, `sections/promo-banner.tsx`, `sections/share-buttons.tsx`, `sections/gallery-grid.tsx`, `sections/faq-accordion.tsx`, `sections/hero-section.tsx`

### Created — Content / Config ✅ (3 dari 4 yang direncanakan)
`apps/web/src/lib/programs-content.ts`, `apps/web/src/lib/faq-content.ts`, `apps/web/src/lib/site-config.ts`

Belum dibuat: `apps/web/src/lib/legal-content.ts`

### Created — Routes ✅ (27 dari yang direncanakan)
`about.tsx`, `founder.tsx`, `metode.tsx`, `sertifikasi.tsx`, `jadwal.tsx`, `cara-daftar.tsx`, `testimoni.tsx`, `alumni.tsx`, `faq.tsx`, `kontak.tsx`, `event.tsx` *(placeholder)*, `promo.tsx` *(placeholder)*, `resources.tsx` *(placeholder)*, `mitra.tsx`, `galeri.tsx`, `syarat-ketentuan.tsx`, `kebijakan-privasi.tsx`, `programs/route.tsx`, `programs/index.tsx`, `programs/$slug.tsx` *(1 file dinamis, ganti 5 individual)*, `blog/index.tsx`, `blog/$slug.tsx`

Belum dibuat: `_auth/profile.tsx`

### Created — DB Schema ✅ (4 dari 7 yang direncanakan)
`testimonials.ts`, `alumni.ts`, `blog_posts.ts`, `gallery_items.ts`

Belum dibuat: `events.ts`, `resources.ts`, `promos.ts`

### Created — API Routers ✅ (4 dari 7 yang direncanakan)
`testimonials.ts`, `alumni.ts`, `blog.ts`, `gallery.ts`

Belum dibuat: `events.ts`, `resources.ts`, `promos.ts`

### Created — Seed ✅
`packages/db/src/seed.ts`

### Created — Migration ✅
`packages/db/src/migrations/0000_special_devos.sql`

---

## Yang Masih Perlu Dikerjakan

### Prioritas Tinggi
1. **Seed data ke DB** — jalankan `seed.ts` ke D1 database lokal/production (isi nomor WA asli di `site-config.ts` dulu)
2. **Isi data nyata** — alamat, nomor WA, foto founder, konten program di `site-config.ts` dan `programs-content.ts`

### Prioritas Rendah / Nice to Have
3. Homepage: tambah section **Blog Terbaru** (3 artikel dari DB)
4. `/testimoni` — connect live DB dengan filter by program
5. `/jadwal` — jadwal batch nyata dari DB events
6. Lightbox pada galeri (klik foto → modal besar)
7. `legal-content.ts` — ekstrak konten syarat & kebijakan ke file terpisah
8. Section components: `share-buttons` (share artikel), `gallery-grid` masonry

---

## Verification
1. `bun run dev` → buka localhost:3001
2. Test semua halaman navigasi tanpa error
3. Test responsive: desktop, tablet, mobile
4. Test WA redirect di semua CTA
5. Test blog: list, detail
6. Test galeri: grid
7. `bun run check-types` ✅ pass (0 errors)
8. `bun run check` (Biome lint) — belum diverifikasi
