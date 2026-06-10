import { createFileRoute } from "@tanstack/react-router";
import PageHero from "@/components/sections/page-hero";

const SECTIONS = [
	{
		title: "1. Penerimaan Syarat",
		content:
			"Dengan mendaftarkan diri ke program Momkiddis Indonesia, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku.",
	},
	{
		title: "2. Program dan Layanan",
		content:
			"Momkiddis Indonesia menyediakan program untuk ibu, anak, remaja, profesional, serta persiapan IELTS & TOEFL. Deskripsi program, kurikulum, dan jadwal dapat berubah sewaktu-waktu. Peserta akan diinformasikan terlebih dahulu melalui grup WhatsApp kelas.",
	},
	{
		title: "3. Pendaftaran dan Pembayaran",
		content:
			"Pendaftaran dinyatakan sah setelah pembayaran dikonfirmasi oleh admin. Pembayaran dilakukan melalui transfer bank atau e-wallet sesuai informasi yang diberikan admin. Kami berhak membatalkan pendaftaran yang tidak dikonfirmasi dalam batas waktu yang ditentukan.",
	},
	{
		title: "4. Kebijakan Pembatalan dan Pengembalian Dana",
		content:
			"Pembatalan yang dilakukan lebih dari 7 hari sebelum kelas dimulai dapat mengajukan pengembalian dana sebesar 80%. Pembatalan kurang dari 7 hari sebelum kelas dimulai tidak mendapatkan pengembalian dana, namun peserta dapat dipindahkan ke batch berikutnya. Setelah kelas dimulai, tidak ada pengembalian dana.",
	},
	{
		title: "5. Hak Kekayaan Intelektual",
		content:
			"Seluruh materi pembelajaran, modul, konten video, dan bahan ajar yang disediakan oleh Momkiddis Indonesia merupakan hak kekayaan intelektual eksklusif milik Momkiddis Indonesia. Peserta dilarang mendistribusikan, memperbanyak, atau menjual materi tersebut tanpa izin tertulis.",
	},
	{
		title: "6. Perilaku Peserta",
		content:
			"Peserta wajib menjaga sopan santun dan menghormati sesama peserta dan pengajar dalam kelas maupun grup WhatsApp. Momkiddis Indonesia berhak mengeluarkan peserta yang melanggar norma dan tidak memberikan pengembalian dana.",
	},
	{
		title: "7. Keterbatasan Tanggung Jawab",
		content:
			"Momkiddis Indonesia tidak bertanggung jawab atas hasil belajar yang tidak sesuai ekspektasi jika peserta tidak mengikuti kelas secara aktif. Hasil belajar sangat bergantung pada konsistensi dan keterlibatan peserta.",
	},
	{
		title: "8. Perubahan Syarat",
		content:
			"Momkiddis Indonesia berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diinformasikan melalui website atau grup WhatsApp kelas.",
	},
	{
		title: "9. Kontak",
		content:
			"Pertanyaan terkait syarat dan ketentuan dapat disampaikan melalui WhatsApp admin Momkiddis Indonesia.",
	},
];

export const Route = createFileRoute("/syarat-ketentuan")({
	head: () => ({
		meta: [{ title: "Syarat & Ketentuan — Momkiddis Indonesia" }],
	}),
	component: SyaratKetentuanPage,
});

function SyaratKetentuanPage() {
	return (
		<>
			<PageHero
				title="Syarat & Ketentuan"
				subtitle="Harap baca dengan seksama sebelum menggunakan layanan Momkiddis Indonesia."
				breadcrumbs={[{ label: "Syarat & Ketentuan" }]}
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
