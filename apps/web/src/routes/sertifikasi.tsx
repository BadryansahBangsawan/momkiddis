import { createFileRoute, Link } from "@tanstack/react-router";
import PageHero from "@/components/sections/page-hero";
import { useSiteConfig } from "@/hooks/use-site-config";
import { Award, CheckCircle2, BookOpen, Users, Home, Briefcase } from "lucide-react";

const KEGUNAAN = [
	{
		icon: Home,
		title: "Portofolio Belajar",
		desc: "Jadikan sebagai bukti bahwa kamu telah mengikuti program belajar Momkiddis.",
	},
	{
		icon: Users,
		title: "Pengembangan Diri",
		desc: "Dokumentasikan progres belajar untuk kebutuhan pribadi, kampus, atau kerja.",
	},
	{
		icon: Briefcase,
		title: "Kebutuhan Profesional",
		desc: "Tambahkan sebagai pendukung saat melamar kerja, interview, atau program pengembangan.",
	},
	{
		icon: BookOpen,
		title: "Target Lanjutan",
		desc: "Bisa menjadi catatan perkembangan sebelum melanjutkan ke tahap belajar berikutnya.",
	},
];

const SYARAT = [
	"Mengikuti minimal 80% dari total sesi kelas",
	"Aktif mengikuti latihan dan diskusi kelas",
	"Menyelesaikan aktivitas belajar yang diberikan mentor",
	"Mengikuti evaluasi atau progress check di akhir program",
];

export const Route = createFileRoute("/sertifikasi")({
	head: () => ({
		meta: [{ title: "Sertifikasi — Momkiddis Indonesia" }],
	}),
	component: SertifikasiPage,
});

function SertifikasiPage() {
	const { getWaUrl } = useSiteConfig();
	const waUrl = getWaUrl("Momkiddis Indonesia");

	return (
		<>
			<PageHero
				title="E-Certificate Momkiddis"
				subtitle="Sertifikat digital untuk peserta yang menyelesaikan kelas online Momkiddis Indonesia."
				breadcrumbs={[{ label: "Sertifikasi" }]}
			/>

			<div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-14">
				{/* Hero visual + description */}
				<section className="grid gap-8 lg:grid-cols-2 lg:items-center">
					<div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-10">
						<Award className="size-16 text-primary" />
						<p className="mt-3 text-base font-semibold text-foreground">
							E-Certificate
						</p>
						<p className="mt-1 text-sm text-muted-foreground">Momkiddis Indonesia</p>
						<div className="mt-4 h-px w-16 bg-border" />
						<p className="mt-4 text-xs text-center text-muted-foreground">
							Diterbitkan atas nama peserta yang berhasil menyelesaikan program
						</p>
					</div>
					<div className="space-y-4">
						<h2 className="text-xl font-bold text-foreground">
							Lebih dari Sekadar Kertas
						</h2>
						<div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
							<p>
								E-certificate Momkiddis adalah bukti perjalanan belajar Anda
								setelah mengikuti kelas online, latihan, progress check, dan
								pendampingan mentor.
							</p>
							<p>
								Sertifikat diberikan dalam format digital dan dapat digunakan
								untuk dokumentasi pengembangan diri.
							</p>
						</div>
					</div>
				</section>

				{/* Kegunaan */}
				<section>
					<h2 className="mb-5 text-base font-semibold text-foreground">
						Untuk Apa Sertifikat Ini?
					</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						{KEGUNAAN.map((item) => (
							<div
								key={item.title}
								className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
							>
								<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
									<item.icon className="size-4 text-primary" />
								</div>
								<div>
									<p className="text-sm font-semibold text-foreground">{item.title}</p>
									<p className="mt-0.5 text-xs leading-snug text-muted-foreground">
										{item.desc}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Syarat */}
				<section className="rounded-xl border border-border bg-muted/30 p-6">
					<h2 className="mb-4 text-base font-semibold text-foreground">
						Syarat Mendapatkan Sertifikat
					</h2>
					<ul className="space-y-2.5">
						{SYARAT.map((s) => (
							<li key={s} className="flex items-start gap-2.5">
								<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
								<span className="text-sm text-muted-foreground">{s}</span>
							</li>
						))}
					</ul>
					<p className="mt-4 text-xs text-muted-foreground">
						Sertifikat diterbitkan dalam format digital (PDF) dan dikirimkan
						melalui WhatsApp atau email setelah program selesai.
					</p>
				</section>

				{/* CTA */}
				<section className="text-center space-y-3">
					<p className="text-sm font-medium text-foreground">
						Siap mendapatkan e-certificate?
					</p>
					<p className="text-sm text-muted-foreground">
						Daftarkan diri ke{" "}
						<Link
							to="/programs/$slug"
							params={{ slug: "momsky-class" }}
							className="text-primary hover:underline"
						>
							Momsky Class
						</Link>{" "}
						sekarang.
					</p>
					<a
						href={waUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity duration-150 active:scale-[0.97] hover:opacity-90"
					>
						Daftar Momkiddis
					</a>
				</section>
			</div>
		</>
	);
}
