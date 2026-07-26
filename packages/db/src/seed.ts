/**
 * Seed script for Momkiddy Indonesia
 *
 * Populates:
 *   - 5 testimonials (3 featured)
 *   - 3 alumni (all featured)
 *   - 5 gallery items
 *
 * Inserts directly into the local Miniflare-backed D1 database (same access
 * path as `scripts/seed-local-superadmin.ts`), so it reflects immediately in
 * the local dev server regardless of any in-memory caching.
 *
 * Run with: bun run db:seed   (from packages/db, or `turbo -F @momkiddis/db db:seed`)
 * Optional env: MINIFLARE_D1_DATABASE_ID (defaults to the local alchemy database ID)
 */

export const SEED_TESTIMONIALS = [
	{
		id: "t1",
		authorName: "Ibu Rina Susanti",
		authorRole: "Peserta Batch 4 — Microteaching",
		authorImage: null,
		programSlug: "microteaching",
		content:
			"Sebelum ikut kelas ini, saya bingung harus mulai dari mana mengajar anak. Sekarang saya punya metode yang jelas dan anak saya jadi lebih semangat belajar di rumah! Terima kasih Bu Lita.",
		rating: 5,
		isPublished: true,
		isFeatured: true,
	},
	{
		id: "t2",
		authorName: "Ibu Sari Dewanti",
		authorRole: "Peserta Batch 6 — Microteaching",
		authorImage: null,
		programSlug: "microteaching",
		content:
			"Kelas microteaching Bu Lita benar-benar membuka mata saya. Ternyata mengajar itu ada seninya. Sekarang saya sudah bisa membuka les privat kecil dari rumah dan sudah ada 4 murid!",
		rating: 5,
		isPublished: true,
		isFeatured: true,
	},
	{
		id: "t3",
		authorName: "Ibu Dewi Rahayu",
		authorRole: "Orang Tua Murid — Calistung Fun",
		authorImage: null,
		programSlug: "calistung",
		content:
			"Anak saya yang tadinya tidak mau belajar sekarang malah minta belajar setiap hari. Metode phonics-nya memang beda — anak lebih cepat nangkap tanpa stres sama sekali.",
		rating: 5,
		isPublished: true,
		isFeatured: true,
	},
	{
		id: "t4",
		authorName: "Ibu Nisa Pratiwi",
		authorRole: "Peserta Batch 8 — Microteaching",
		authorImage: null,
		programSlug: "microteaching",
		content:
			"Praktik langsung di depan mentor sangat membantu. Saya jadi tahu persis kelemahan saya dalam mengajar dan cara memperbaikinya. Investasi terbaik tahun ini!",
		rating: 5,
		isPublished: true,
		isFeatured: false,
	},
	{
		id: "t5",
		authorName: "Ibu Ratna Kusuma",
		authorRole: "Orang Tua Murid — English Fun Class",
		authorImage: null,
		programSlug: "english-fun",
		content:
			"Anak saya sekarang sudah berani berbicara bahasa Inggris di depan keluarga besar. Dulu jangankan bicara, dengar kata 'English' saja sudah kabur. Luar biasa perubahannya!",
		rating: 5,
		isPublished: true,
		isFeatured: false,
	},
] as const;

export const SEED_ALUMNI = [
	{
		id: "a1",
		name: "Ibu Fitri Handayani",
		photo: null,
		batchLabel: "Batch 3 — Januari 2024",
		programSlug: "microteaching",
		certificateUrl: null,
		shortStory:
			"Setelah lulus dari Kelas Microteaching, Fitri kini membuka kelas belajar dari rumah untuk 5 anak di lingkungan RT-nya. Dalam 3 bulan ia sudah memiliki murid tetap.",
		isPublished: true,
		isFeatured: true,
		graduatedAt: new Date("2024-01-31").getTime(),
	},
	{
		id: "a2",
		name: "Ibu Nanda Puspita",
		photo: null,
		batchLabel: "Batch 5 — Maret 2024",
		programSlug: "microteaching",
		certificateUrl: null,
		shortStory:
			"Berhasil mendampingi anak dari tidak bisa membaca sama sekali hingga lancar membaca dalam waktu 2 bulan menggunakan metode phonics yang dipelajari di Momkiddy.",
		isPublished: true,
		isFeatured: true,
		graduatedAt: new Date("2024-03-28").getTime(),
	},
	{
		id: "a3",
		name: "Ibu Maya Sartika",
		photo: null,
		batchLabel: "Batch 7 — Juni 2024",
		programSlug: "microteaching",
		certificateUrl: null,
		shortStory:
			"Kini aktif sebagai pengajar les privat dan sudah memiliki 8 murid tetap. Sertifikat Mom Teacher Momkiddy menjadi bekal kepercayaan yang ia tunjukkan kepada orang tua murid.",
		isPublished: true,
		isFeatured: true,
		graduatedAt: new Date("2024-06-30").getTime(),
	},
] as const;

export const SEED_GALLERY_ITEMS = [
	{
		id: "g1",
		imageUrl: "/gallery/microteaching-batch7.jpg",
		caption: "Sesi Praktik Microteaching Batch 7",
		event: "Kelas Microteaching",
		takenAt: new Date("2024-06-20").getTime(),
		isPublished: true,
	},
	{
		id: "g2",
		imageUrl: "/gallery/calistung-phonics.jpg",
		caption: "Aktivitas Phonics Bersama Anak",
		event: "Calistung Fun",
		takenAt: new Date("2024-07-10").getTime(),
		isPublished: true,
	},
	{
		id: "g3",
		imageUrl: "/gallery/workshop-mom-teacher.jpg",
		caption: "Workshop Mom Teacher — Sesi Offline",
		event: "Kelas Microteaching",
		takenAt: new Date("2024-08-05").getTime(),
		isPublished: true,
	},
	{
		id: "g4",
		imageUrl: "/gallery/online-class-zoom.jpg",
		caption: "Kelas Online via Zoom — Batch 9",
		event: "Kelas Online",
		takenAt: new Date("2024-09-12").getTime(),
		isPublished: true,
	},
	{
		id: "g5",
		imageUrl: "/gallery/sertifikat-batch5.jpg",
		caption: "Penyerahan Sertifikat Mom Teacher Batch 5",
		event: "Sertifikasi",
		takenAt: new Date("2024-03-30").getTime(),
		isPublished: true,
	},
] as const;

// Only run the actual seeding when this file is executed directly (`bun run
// db:seed`) — importers elsewhere (e.g. tests) can still use the SEED_*
// constants above as plain data without triggering any DB access.
if (import.meta.main) {
	const { default: mf } = await import("miniflare");
	const { userInfo } = await import("node:os");
	const path = await import("node:path");

	const DATABASE_ID =
		process.env.MINIFLARE_D1_DATABASE_ID ?? `momkiddis-database-${userInfo().username}`;
	const WORKSPACE_ROOT = new URL("../../../", import.meta.url).pathname;
	const PERSIST_ROOT = path.join(WORKSPACE_ROOT, ".alchemy", "miniflare", "v3");

	console.log("🚀 Connecting to local Miniflare D1...");
	const miniflare = new mf.Miniflare({
		script: "",
		modules: true,
		defaultPersistRoot: PERSIST_ROOT,
		d1Persist: true,
		d1Databases: { DB: DATABASE_ID },
	});

	await miniflare.ready;
	const db = await miniflare.getD1Database("DB");
	const session = db.withSession("first-primary");

	console.log(`🌱 Seeding ${SEED_TESTIMONIALS.length} testimonials...`);
	await session.batch(
		SEED_TESTIMONIALS.map((t) =>
			session
				.prepare(
					`INSERT OR REPLACE INTO testimonials
					 (id, author_name, author_role, author_image, program_slug, content, rating, is_published, is_featured)
					 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				)
				.bind(
					t.id,
					t.authorName,
					t.authorRole,
					t.authorImage,
					t.programSlug,
					t.content,
					t.rating,
					t.isPublished ? 1 : 0,
					t.isFeatured ? 1 : 0,
				),
		),
	);

	console.log(`🌱 Seeding ${SEED_ALUMNI.length} alumni...`);
	await session.batch(
		SEED_ALUMNI.map((a) =>
			session
				.prepare(
					`INSERT OR REPLACE INTO alumni
					 (id, name, photo, batch_label, program_slug, certificate_url, short_story, is_published, is_featured, graduated_at)
					 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				)
				.bind(
					a.id,
					a.name,
					a.photo,
					a.batchLabel,
					a.programSlug,
					a.certificateUrl,
					a.shortStory,
					a.isPublished ? 1 : 0,
					a.isFeatured ? 1 : 0,
					a.graduatedAt,
				),
		),
	);

	console.log(`🌱 Seeding ${SEED_GALLERY_ITEMS.length} gallery items...`);
	await session.batch(
		SEED_GALLERY_ITEMS.map((g) =>
			session
				.prepare(
					`INSERT OR REPLACE INTO gallery_items
					 (id, image_url, caption, event, taken_at, is_published)
					 VALUES (?, ?, ?, ?, ?, ?)`,
				)
				.bind(g.id, g.imageUrl, g.caption, g.event, g.takenAt, g.isPublished ? 1 : 0),
		),
	);

	await miniflare.dispose();
	console.log("✅ Seed complete.");
}
