import { createFileRoute, Link } from "@tanstack/react-router";
import PageHero from "@/components/sections/page-hero";
import { KEUNGGULAN } from "@/lib/programs-content";
import { useSiteConfig } from "@/hooks/use-site-config";
import {
	Users,
	Gamepad2,
	Monitor,
	Heart,
	Target,
	Award,
	BookOpen,
	Star,
} from "lucide-react";

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
	Users: ({ className }) => <Users className={className} />,
	Gamepad2: ({ className }) => <Gamepad2 className={className} />,
	Monitor: ({ className }) => <Monitor className={className} />,
	Heart: ({ className }) => <Heart className={className} />,
	Target: ({ className }) => <Target className={className} />,
};

const VISI_MISI = {
	visi: "Menjadi Rumah Belajarnya Ibu dan Anak.",
	misi: [
		"Memberdayakan ibu melalui Kelas Pengajar Microteaching yang mengajarkan skill mengajar praktis yang langsung bisa dipakai malam itu juga.",
		"Mendidik anak lewat program Calistung Fun, Bimbel SD, dan English Fun dengan metode play-based learning yang membuat anak belajar sambil bermain.",
	],
};

const NILAI = [
	{
		icon: Heart,
		label: "Suportif",
		desc: "Ruang belajar dibuat nyaman agar setiap peserta berani mencoba, bertanya, dan berkembang.",
	},
	{
		icon: Star,
		label: "Berkualitas",
		desc: "Setiap kelas dirancang dengan materi terstruktur, strategi yang terbukti, dan mentor berpengalaman.",
	},
	{
		icon: BookOpen,
		label: "Praktis",
		desc: "Materi dirancang agar mudah dipraktikkan di rumah, sekolah, tempat kerja, maupun saat persiapan tes.",
	},
	{
		icon: Award,
		label: "Berdampak",
		desc: "Keberhasilan peserta menerapkan keterampilan dan mencapai target belajar adalah keberhasilan kami.",
	},
];

export const Route = createFileRoute("/about")({
	head: () => ({
		meta: [{ title: "Tentang Kami — Momkiddis Indonesia" }],
	}),
	component: AboutPage,
});

function AboutPage() {
	const { getWaUrl } = useSiteConfig();
	const waUrl = getWaUrl();

	return (
		<>
			<PageHero
				title="Tentang Momkiddis"
				subtitle="Rumah Belajarnya Ibu dan Anak — didirikan oleh Lita Hendratno untuk menjawab tantangan nyata ibu-ibu milenial modern."
				breadcrumbs={[{ label: "Tentang Kami" }]}
			/>

			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
				{/* Origin story */}
				<section className="grid gap-10 lg:grid-cols-2 lg:items-center">
					<div className="space-y-4">
						<span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
							Tentang Kami
						</span>
						<h2 className="text-2xl font-bold tracking-tight text-foreground">
							Lahir dari Kebutuhan Belajar Keluarga
						</h2>
						<div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
							<p>
								Momkiddis lahir dari keyakinan bahwa ibu adalah guru pertama
								bagi anak dan setiap keluarga berhak mendapatkan pendampingan
								belajar yang mudah diterapkan.
							</p>
							<p>
								Program kami mendampingi ibu, anak, remaja, dan profesional
								dengan materi yang aktif, fun, praktis, dan terarah sesuai
								kebutuhan masing-masing.
							</p>
							<p>
								Untuk target studi dan karier, IELTS dan TOEFL tersedia dalam
								satu kelas persiapan English test yang fokus dan sistematis.
							</p>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						{[
							{ value: "500+", label: "Total Peserta" },
							{ value: "20+", label: "Batch Selesai" },
							{ value: "5", label: "Kelas Aktif" },
							{ value: "4.9★", label: "Rating Peserta" },
						].map(({ value, label }) => (
							<div
								key={label}
								className="rounded-xl border border-border bg-card p-5 text-center"
							>
								<p className="text-2xl font-bold text-primary">{value}</p>
								<p className="mt-1 text-xs text-muted-foreground">{label}</p>
							</div>
						))}
					</div>
				</section>

				{/* Visi & Misi */}
				<section className="rounded-2xl border border-border bg-muted/30 p-8">
					<div className="grid gap-8 lg:grid-cols-2">
						<div>
							<h3 className="mb-3 text-base font-semibold text-foreground">
								Visi
							</h3>
							<p className="text-sm leading-relaxed text-muted-foreground">
								{VISI_MISI.visi}
							</p>
						</div>
						<div>
							<h3 className="mb-3 text-base font-semibold text-foreground">
								Misi
							</h3>
							<ul className="space-y-2">
								{VISI_MISI.misi.map((item, i) => (
									<li key={i} className="flex items-start gap-2.5">
										<span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
										<span className="text-sm leading-relaxed text-muted-foreground">
											{item}
										</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</section>

				{/* Founder teaser */}
				<section className="grid gap-8 lg:grid-cols-3 lg:items-start">
					<div className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center">
						<img
							src="/Lita.png"
							alt="Lita Hendratno"
							className="size-20 rounded-full object-cover object-top"
						/>
						<p className="mt-3 text-sm font-semibold text-foreground">
							Lita Hendratno
						</p>
						<p className="mt-0.5 text-xs text-muted-foreground">
							Founder & Lead Educator
						</p>
						<p className="mt-3 text-xs leading-relaxed text-muted-foreground">
							Pendidik dan founder Momkiddis Indonesia. Berpengalaman lebih dari
							satu dekade mendampingi peserta belajar, mengajar, dan berkembang.
						</p>
						<Link
							to="/founder"
							className="mt-4 text-xs font-medium text-primary hover:underline"
						>
							Baca lebih lanjut →
						</Link>
					</div>
					<div className="lg:col-span-2 space-y-4">
						<h2 className="text-xl font-bold tracking-tight text-foreground">
							Dibimbing Langsung, Feedback Nyata
						</h2>
						<p className="text-sm leading-relaxed text-muted-foreground">
							Yang membedakan Momkiddis dari kursus online lain adalah:
							setiap kelas dibimbing langsung oleh Lita Hendratno — bukan
							rekaman video, bukan modul yang dikerjakan sendiri.
						</p>
						<p className="text-sm leading-relaxed text-muted-foreground">
							Peserta mendapat feedback langsung, evaluasi praktik, dan dapat
							berkonsultasi mengenai arah belajar sesuai target masing-masing.
						</p>
						<div className="grid gap-3 sm:grid-cols-2">
							{NILAI.map(({ icon: Icon, label, desc }) => (
								<div
									key={label}
									className="flex items-start gap-3 rounded-lg border border-border bg-card p-3"
								>
									<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
										<Icon className="size-4 text-primary" />
									</div>
									<div>
										<p className="text-xs font-semibold text-foreground">
											{label}
										</p>
										<p className="mt-0.5 text-xs leading-snug text-muted-foreground">
											{desc}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Keunggulan */}
				<section>
					<div className="mb-6 text-center">
						<h2 className="text-xl font-bold tracking-tight text-foreground">
							Mengapa Momkiddis?
						</h2>
						<p className="mt-2 text-sm text-muted-foreground">
							Lima hal yang membuat program Momkiddis terarah dan mudah diterapkan.
						</p>
					</div>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{KEUNGGULAN.map((item, i) => {
							const Icon = ICON_MAP[item.icon];
							return (
								<div
									key={item.title}
									className="rounded-xl border border-border bg-card p-5"
									style={{ animationDelay: `${i * 60}ms` }}
								>
									{Icon && (
										<div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/10">
											<Icon className="size-5 text-primary" />
										</div>
									)}
									<p className="text-sm font-semibold text-foreground">
										{item.title}
									</p>
									<p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
										{item.description}
									</p>
								</div>
							);
						})}
					</div>
				</section>

				{/* CTA */}
				<section className="rounded-2xl bg-primary px-8 py-10 text-center">
					<h2 className="text-xl font-bold text-white">
						Siap Bergabung di Momkiddis?
					</h2>
					<p className="mt-2 text-sm text-white/80">
						Ratusan peserta sudah membuktikannya. Sekarang giliran kamu.
					</p>
					<a
						href={waUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary transition-opacity duration-150 active:scale-[0.97] hover:opacity-90"
					>
						Hubungi Admin Sekarang
					</a>
				</section>
			</div>
		</>
	);
}
