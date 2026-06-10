import { createFileRoute } from "@tanstack/react-router";
import PageHero from "@/components/sections/page-hero";

const SECTIONS = [
	{
		title: "1. Informasi yang Kami Kumpulkan",
		content:
			"Ketika Anda mendaftar atau berinteraksi dengan Momkiddis Indonesia, kami mungkin mengumpulkan: nama lengkap, nomor WhatsApp, nama dan usia anak (untuk program anak), serta informasi yang Anda bagikan secara sukarela dalam percakapan.",
	},
	{
		title: "2. Bagaimana Kami Menggunakan Informasi Anda",
		content:
			"Informasi yang kami kumpulkan digunakan untuk: memproses pendaftaran dan pembayaran, mengkomunikasikan jadwal dan informasi kelas, memberikan layanan terbaik yang sesuai kebutuhan Anda, serta mengirimkan informasi program terbaru (Anda dapat berhenti kapan saja).",
	},
	{
		title: "3. Keamanan Data",
		content:
			"Kami mengambil langkah-langkah yang wajar untuk melindungi informasi pribadi Anda dari akses tidak sah. Data Anda hanya diakses oleh tim internal Momkiddis yang membutuhkannya untuk memberikan layanan.",
	},
	{
		title: "4. Berbagi Data dengan Pihak Ketiga",
		content:
			"Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Data hanya dibagikan jika diwajibkan oleh hukum yang berlaku.",
	},
	{
		title: "5. Konten di Grup WhatsApp",
		content:
			"Grup WhatsApp kelas adalah ruang bersama. Hindari membagikan informasi pribadi sensitif di grup. Momkiddis tidak bertanggung jawab atas privasi konten yang dibagikan oleh peserta lain.",
	},
	{
		title: "6. Foto dan Dokumentasi",
		content:
			"Foto atau video kegiatan kelas dapat digunakan untuk keperluan promosi Momkiddis Indonesia. Jika Anda tidak ingin muncul dalam konten promosi, silakan informasikan kepada admin sebelum kelas dimulai.",
	},
	{
		title: "7. Hak Anda",
		content:
			"Anda berhak untuk meminta akses, koreksi, atau penghapusan data pribadi Anda kapan saja dengan menghubungi admin Momkiddis Indonesia.",
	},
	{
		title: "8. Perubahan Kebijakan",
		content:
			"Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan diinformasikan melalui website.",
	},
	{
		title: "9. Kontak",
		content:
			"Pertanyaan terkait kebijakan privasi ini dapat disampaikan melalui WhatsApp admin Momkiddis Indonesia.",
	},
];

export const Route = createFileRoute("/kebijakan-privasi")({
	head: () => ({
		meta: [{ title: "Kebijakan Privasi — Momkiddis Indonesia" }],
	}),
	component: KebijakanPrivasiPage,
});

function KebijakanPrivasiPage() {
	return (
		<>
			<PageHero
				title="Kebijakan Privasi"
				subtitle="Kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda."
				breadcrumbs={[{ label: "Kebijakan Privasi" }]}
			/>

			<div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
				<p className="mb-8 text-xs text-muted-foreground">
					Terakhir diperbarui: 1 Januari 2025
				</p>

				<div className="space-y-8">
					{SECTIONS.map((section) => (
						<section key={section.title}>
							<h2 className="mb-2 text-sm font-semibold text-foreground">
								{section.title}
							</h2>
							<p className="text-sm leading-relaxed text-muted-foreground">
								{section.content}
							</p>
						</section>
					))}
				</div>
			</div>
		</>
	);
}
