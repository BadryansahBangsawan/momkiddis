import { createFileRoute } from "@tanstack/react-router";
import PageHero from "@/components/sections/page-hero";
import { useSiteConfig } from "@/hooks/use-site-config";
import {
	BookOpen,
	FileText,
	MessageSquare,
	Mic,
	Target,
	UserRound,
} from "lucide-react";

const METODE = [
	{
		icon: MessageSquare,
		color: "bg-primary/10 text-primary",
		title: "Microteaching & Mentoring",
		subtitle: "Praktik mengajar terarah",
		desc: "Peserta berlatih menyampaikan materi, mencoba teknik mengajar, dan mendapat evaluasi langsung dari mentor.",
		applies: ["Momsky Class", "Professional Class"],
	},
	{
		icon: Mic,
		color: "bg-primary/10 text-primary",
		title: "Belajar Aktif & Fun",
		subtitle: "Belajar melalui aktivitas",
		desc: "Materi baca, tulis, hitung, dan English Fun disampaikan melalui aktivitas yang aktif, kreatif, dan menyenangkan.",
		applies: ["Kiddis Class"],
	},
	{
		icon: Target,
		color: "bg-primary/10 text-primary",
		title: "Komunikasi & Public Speaking",
		subtitle: "Membangun kepercayaan diri",
		desc: "Remaja berlatih speaking, presentasi, ekspresi, fokus, dan penyelesaian target belajar secara bertahap.",
		applies: ["Teenager Class"],
	},
	{
		icon: BookOpen,
		color: "bg-primary/10 text-primary",
		title: "Strategi IELTS & TOEFL",
		subtitle: "Satu kelas English test",
		desc: "Listening, reading, speaking, writing, simulasi, dan evaluasi dipelajari dalam satu program persiapan yang sistematis.",
		applies: ["IELTS & TOEFL Class"],
	},
	{
		icon: FileText,
		color: "bg-primary/10 text-primary",
		title: "Praktik & Evaluasi",
		subtitle: "Progress yang terarah",
		desc: "Setiap program mengutamakan praktik, feedback, dan evaluasi agar peserta mengetahui perkembangan belajarnya.",
		applies: ["Semua Program"],
	},
	{
		icon: UserRound,
		color: "bg-primary/10 text-primary",
		title: "Materi Sesuai Kategori",
		subtitle: "Fokus pada kebutuhan peserta",
		desc: "Materi, aktivitas, dan target belajar disesuaikan dengan tahap ibu, anak, remaja, profesional, atau peserta English test.",
		applies: ["Semua Program"],
	},
];

export const Route = createFileRoute("/metode")({
	component: MetodePage,
});

function MetodePage() {
	const { getWaUrl } = useSiteConfig();
	const waUrl = getWaUrl();

	return (
		<>
			<PageHero
				title="Metode Belajar Momkiddis"
				subtitle="Pendekatan belajar yang aktif, fun, praktis, dan terarah untuk setiap kategori peserta."
				breadcrumbs={[{ label: "Metode Belajar" }]}
			/>

			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<section>
					<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{METODE.map((m, i) => (
							<div
								key={m.title}
								className="rounded-xl border border-border bg-card p-5"
								style={{ animationDelay: `${i * 60}ms` }}
							>
								<div
									className={`mb-4 inline-flex rounded-xl p-2.5 ${m.color.split(" ")[0]}`}
								>
									<m.icon className={`size-5 ${m.color.split(" ")[1]}`} />
								</div>
								<p className="text-sm font-semibold text-foreground">
									{m.title}
								</p>
								<p className="mt-0.5 text-xs font-medium text-muted-foreground">
									{m.subtitle}
								</p>
								<p className="mt-2 text-xs leading-relaxed text-muted-foreground">
									{m.desc}
								</p>
								<div className="mt-3 flex flex-wrap gap-1">
									{m.applies.map((a) => (
										<span
											key={a}
											className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
										>
											{a}
										</span>
									))}
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="mt-16 rounded-2xl border border-border bg-muted/30 p-8">
					<div className="mx-auto flex max-w-2xl flex-col gap-4 text-center">
						<h2 className="text-xl font-bold text-foreground">
							Filosofi Pembelajaran
						</h2>
						<p className="text-sm leading-relaxed text-muted-foreground">
							Momkiddis mengutamakan latihan langsung, koreksi yang jelas,
							dan materi yang bisa diterapkan dalam kegiatan belajar, mengajar,
							komunikasi, serta persiapan English test.
						</p>
						<p className="text-sm leading-relaxed text-muted-foreground">
							Setiap program memiliki alur praktik dan evaluasi agar peserta
							memahami perkembangan serta langkah belajar berikutnya.
						</p>
					</div>
				</section>

				<section className="mt-16 text-center">
					<p className="text-sm font-medium text-foreground">
						Ingin tahu metode mana yang cocok untuk targetmu?
					</p>
					<p className="mt-1 text-sm text-muted-foreground">
						Konsultasikan kebutuhan Momsky, Kiddis, Teenager, Professional,
						atau IELTS &amp; TOEFL Class dengan admin.
					</p>
					<a
						href={waUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity duration-150 active:scale-[0.97] hover:opacity-90"
					>
						Daftar Sekarang
					</a>
				</section>
			</div>
		</>
	);
}
