import { createFileRoute, Link } from "@tanstack/react-router";
import PageHero from "@/components/sections/page-hero";
import { useSiteConfig } from "@/hooks/use-site-config";
import { Heart } from "lucide-react";

const PENCAPAIAN = [
	{ value: "10+", label: "Tahun pengalaman mengajar" },
	{ value: "500+", label: "Total Peserta" },
	{ value: "20+", label: "Batch kelas selesai" },
	{ value: "5", label: "Kelas aktif" },
];

const PERJALANAN = [
	{
		year: "2015",
		title: "Memulai Karier di Dunia Pendidikan",
		desc: "Lita memulai kariernya sebagai pendidik dan langsung jatuh cinta dengan dunia pengajaran bahasa.",
	},
	{
		year: "2018",
		title: "Mendalami Pengajaran Bahasa Inggris",
		desc: "Mengikuti pelatihan intensif metode pengajaran bahasa Inggris komunikatif dan berbasis praktik.",
	},
	{
		year: "2020",
		title: "Melihat Peluang di Kelas Online",
		desc: "Melihat kebutuhan besar akan kelas bahasa Inggris online yang fleksibel, terjangkau, dan bisa diakses dari mana saja.",
	},
	{
		year: "2021",
		title: "Momkiddis Resmi Diluncurkan",
		desc: "Kelas pertama Momkiddis dibuka dengan peserta dari berbagai kota. Respons luar biasa mendorong Lita untuk terus berkembang.",
	},
	{
		year: "2024",
		title: "500+ Peserta dari Seluruh Indonesia",
		desc: "Momkiddis telah membantu ratusan peserta di seluruh Indonesia meningkatkan kemampuan bahasa Inggris mereka.",
	},
];

export const Route = createFileRoute("/founder")({
	head: () => ({
		meta: [{ title: "Founder — Momkiddis Indonesia" }],
	}),
	component: FounderPage,
});

function FounderPage() {
	const { getWaUrl } = useSiteConfig();
	const waUrl = getWaUrl();

	return (
		<>
			<PageHero
				title="Lita Hendratno"
				subtitle="Founder & Lead Educator Momkiddis Indonesia"
				breadcrumbs={[{ label: "Tentang Kami", to: "/about" }, { label: "Founder" }]}
			/>

			<div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-14">
				{/* Profile */}
				<section className="grid gap-8 lg:grid-cols-3 lg:items-start">
					<div className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center">
						<img
							src="/Lita.png"
							alt="Lita Hendratno"
							className="size-24 rounded-full object-cover"
						/>
						<p className="mt-3 text-base font-semibold text-foreground">
							Lita Hendratno
						</p>
						<p className="mt-0.5 text-xs text-muted-foreground">
							Founder & Lead Educator
						</p>
						<div className="mt-3 flex flex-wrap justify-center gap-1.5">
							{["Education Mentor", "English Educator", "Women Empowerment"].map((tag) => (
								<span
									key={tag}
									className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
								>
									{tag}
								</span>
							))}
						</div>
					</div>

					<div className="lg:col-span-2 space-y-4">
						<div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
							<p>
								Lita Hendratno adalah pendidik bahasa Inggris berpengalaman yang
								telah lebih dari satu dekade bergelut di dunia pengajaran. Kini
								ia fokus membangun Momkiddis Indonesia — platform kelas online
								bahasa Inggris yang menjangkau peserta dari berbagai kota
								di seluruh Indonesia.
							</p>
							<p>
								Lita percaya bahwa siapa saja bisa berbahasa Inggris dengan percaya
								diri — apapun latar belakangnya. Dari keyakinan inilah Momkiddis
								lahir: bukan sekadar kursus, tapi ruang aman untuk belajar,
								berlatih, dan berkembang bersama.
							</p>
							<p>
								Yang membedakan Lita: ia tidak mendelegasikan pengajaran.
								Setiap kelas, setiap sesi, setiap koreksi — ia tangani langsung.
								Peserta mendapat feedback nyata dari praktisi, bukan sekadar
								teori atau rekaman video.
							</p>
						</div>

						<div className="flex gap-3">
							<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
								<Heart className="size-4 text-primary" />
							</div>
							<p className="text-sm italic text-muted-foreground">
								"Saya percaya siapa pun bisa berbahasa Inggris dengan percaya diri.
								Tugas saya adalah memastikan setiap peserta tahu cara yang tepat
								dan berani mempraktikkannya."
							</p>
						</div>
					</div>
				</section>

				{/* Pencapaian */}
				<section>
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
						{PENCAPAIAN.map(({ value, label }) => (
							<div
								key={label}
								className="rounded-xl border border-border bg-card p-4 text-center"
							>
								<p className="text-2xl font-bold text-primary">{value}</p>
								<p className="mt-1 text-xs text-muted-foreground">{label}</p>
							</div>
						))}
					</div>
				</section>

				{/* Perjalanan */}
				<section>
					<h2 className="mb-6 text-base font-semibold text-foreground">
						Perjalanan Lita & Momkiddis
					</h2>
					<div className="space-y-0">
						{PERJALANAN.map((item, i) => (
							<div key={item.year} className="flex gap-5">
								<div className="flex flex-col items-center">
									<div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-bold text-foreground">
										{item.year}
									</div>
									{i < PERJALANAN.length - 1 && (
										<div className="mt-1 w-px flex-1 bg-border" style={{ minHeight: "1.5rem" }} />
									)}
								</div>
								<div className="pb-7 pt-1.5">
									<p className="text-sm font-semibold text-foreground">{item.title}</p>
									<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
										{item.desc}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* CTA */}
				<section className="rounded-2xl bg-primary px-8 py-10 text-center">
					<p className="text-lg font-bold text-white">
						Belajar Langsung bersama Lita
					</p>
					<p className="mt-1 text-sm text-white/75">
						Daftar ke Momkiddis dan mulai perjalanan bahasa Inggrismu hari ini.
					</p>
					<div className="mt-5 flex flex-wrap justify-center gap-3">
						<Link
							to="/programs"
							className="rounded-full bg-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-opacity duration-150 active:scale-[0.97] hover:bg-white/30"
						>
							Lihat Program
						</Link>
						<a
							href={waUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary transition-opacity duration-150 active:scale-[0.97] hover:opacity-90"
						>
							Hubungi Admin
						</a>
					</div>
				</section>
			</div>
		</>
	);
}
