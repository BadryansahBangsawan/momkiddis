import { createFileRoute } from "@tanstack/react-router";
import PageHero from "@/components/sections/page-hero";
import { useSiteConfig } from "@/hooks/use-site-config";
import { HandshakeIcon, Users, Building2, Megaphone } from "lucide-react";

const TYPES = [
	{
		icon: Building2,
		title: "Lembaga Pendidikan",
		desc: "Lembaga kursus, bimbel, atau sekolah bahasa yang ingin mengintegrasikan program Momkiddis untuk peserta mereka.",
	},
	{
		icon: Users,
		title: "Komunitas Ibu",
		desc: "Arisan, kelompok parenting, atau komunitas ibu yang ingin menyelenggarakan workshop bersama.",
	},
	{
		icon: Megaphone,
		title: "Content Creator",
		desc: "Influencer parenting atau educator yang ingin berkolaborasi dalam konten edukatif.",
	},
	{
		icon: HandshakeIcon,
		title: "Perusahaan / CSR",
		desc: "Program pelatihan ibu pekerja atau kegiatan CSR pendidikan untuk komunitas.",
	},
];

const BENEFITS = [
	"Akses program eksklusif dengan harga kemitraan",
	"Materi dan modul pembelajaran Momkiddis",
	"Sertifikat kolaborasi resmi dari Momkiddis Indonesia",
	"Branding bersama dalam aktivitas promosi",
	"Dukungan langsung dari tim Momkiddis",
];

export const Route = createFileRoute("/mitra")({
	component: MitraPage,
});

function MitraPage() {
	const { getWaUrl } = useSiteConfig();
	const waUrl = getWaUrl("Program Kemitraan");

	return (
		<>
			<PageHero
				title="Menjadi Mitra Momkiddis"
				subtitle="Bersama, kita berdampak lebih luas untuk pelajar bahasa Inggris di seluruh Indonesia."
				breadcrumbs={[{ label: "Kemitraan" }]}
			/>

			<div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-14">
				{/* Intro */}
				<section className="text-center max-w-2xl mx-auto">
					<p className="text-sm leading-relaxed text-muted-foreground">
						Momkiddis terbuka untuk berbagai bentuk kemitraan yang
						bertujuan memperluas akses belajar bahasa Inggris yang
						berkualitas di seluruh Indonesia. Kami percaya bahwa
						kolaborasi adalah kunci untuk dampak yang lebih besar.
					</p>
				</section>

				{/* Types */}
				<section>
					<h2 className="mb-5 text-base font-semibold text-foreground">
						Siapa yang Bisa Menjadi Mitra?
					</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						{TYPES.map((type) => (
							<div
								key={type.title}
								className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
							>
								<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
									<type.icon className="size-4 text-primary" />
								</div>
								<div>
									<p className="text-sm font-semibold text-foreground">
										{type.title}
									</p>
									<p className="mt-0.5 text-xs leading-snug text-muted-foreground">
										{type.desc}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Benefits */}
				<section className="rounded-xl border border-border bg-muted/30 p-6">
					<h2 className="mb-4 text-base font-semibold text-foreground">
						Keuntungan Bermitra
					</h2>
					<ul className="space-y-2.5">
						{BENEFITS.map((b) => (
							<li key={b} className="flex items-start gap-2.5">
								<span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
								<span className="text-sm text-muted-foreground">{b}</span>
							</li>
						))}
					</ul>
				</section>

				{/* CTA */}
				<section className="rounded-2xl bg-primary px-8 py-10 text-center">
					<p className="text-lg font-bold text-white">Tertarik Bermitra?</p>
					<p className="mt-1 text-sm text-white/75">
						Hubungi kami untuk mendiskusikan bentuk kemitraan yang tepat.
					</p>
					<a
						href={waUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary transition-opacity duration-150 active:scale-[0.97] hover:opacity-90"
					>
						Diskusi Kemitraan
					</a>
				</section>
			</div>
		</>
	);
}
