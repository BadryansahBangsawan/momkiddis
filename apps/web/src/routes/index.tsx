import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@momkiddis/ui/components/button";
import { ArrowRightIcon } from "lucide-react";

import {
	PROGRAM_LIST,
	KEUNGGULAN,
	CARA_KERJA,
} from "@/lib/programs-content";
import { orpc } from "@/utils/orpc";

import { HeroWaves } from "@/components/sections/hero-waves";
import ProgramCard from "@/components/sections/program-card";
import { AlumniSlider, type AlumniReview } from "@/components/sections/alumni-slider";
import KeunggulanSection from "@/components/sections/keunggulan-section";
import StepsSection from "@/components/sections/steps-section";
import WhatsAppCta from "@/components/sections/whatsapp-cta";

export const Route = createFileRoute("/")({
	loader: async ({ context: { queryClient } }) => {
		void queryClient.prefetchQuery(
			orpc.testimonials.listFeatured.queryOptions(),
		);
		void queryClient.prefetchQuery(
			orpc.alumni.listFeatured.queryOptions(),
		);
	},
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div>
			{/* ── Hero ── (extends behind the floating nav) */}
			<div className="-mt-24">
				<HeroWaves />
			</div>


			{/* ── Tentang Momkiddis ── */}
			<AboutTeaser />

			{/* ── Program Unggulan ── */}
			<ProgramsSection />

			{/* ── Cara Kerja ── */}
			<StepsSection steps={CARA_KERJA} />

			{/* ── Keunggulan ── */}
			<KeunggulanSection items={KEUNGGULAN} />

			{/* ── Testimoni ── */}
			<TestimoniSection />

			{/* ── Alumni Showcase ── */}
			<AlumniSection />

			{/* ── CTA Final Banner ── */}
			<WhatsAppCta variant="full" label="Daftar Sekarang via WhatsApp" />
		</div>
	);
}

/* ─── About Teaser ─────────────────────────────── */
function AboutTeaser() {
	return (
		<section className="px-4 py-16 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="grid items-center gap-10 lg:grid-cols-2">
					{/* Text */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.6, ease: "easeOut" }}
					>
						<p className="text-xs font-semibold uppercase tracking-widest text-primary">
							Tentang Kami
						</p>
						<h2 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
							Kelas Online Bahasa Inggris dari Mana Saja
						</h2>
						<div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
							<p>
								<strong className="text-foreground">Momkiddis Indonesia</strong>{" "}
								adalah lembaga pendidikan dengan program untuk ibu, anak,
								remaja, profesional, serta persiapan IELTS &amp; TOEFL.
							</p>
							<p>
								Didirikan oleh{" "}
								<strong className="text-foreground">Lita Hendratno</strong>,
								Momkiddis hadir untuk menguatkan kemampuan mengajar,
								komunikasi, belajar, dan kepercayaan diri di setiap tahap.
							</p>
							<p className="italic text-foreground/70">
								"Tidak ada yang terlambat belajar bahasa Inggris. Yang ada
								adalah orang yang belum menemukan cara yang tepat."
							</p>
						</div>
						<Link to="/about" className="mt-5 inline-block">
							<Button
								variant="outline"
								size="sm"
								className="gap-1.5 transition-transform active:scale-[0.97]"
							>
								Selengkapnya
								<ArrowRightIcon className="size-3.5" />
							</Button>
						</Link>
					</motion.div>

					{/* Visual — stats cards */}
					<div className="grid grid-cols-2 gap-4">
						{[
							{ label: "Total Peserta", value: "500+", sub: "dari berbagai kota di Indonesia" },
							{ label: "Batch Selesai", value: "20+", sub: "kelas online dan mentoring" },
							{ label: "Kelas Aktif", value: "5", sub: "program Momkiddis Indonesia" },
							{ label: "Rating Kepuasan", value: "4.9", sub: "berdasarkan testimoni peserta" },
						].map(({ label, value, sub }, i) => (
							<motion.div
								key={label}
								className="rounded-xl border border-border bg-card p-4"
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-60px" }}
								transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
							>
								<p className="text-2xl font-bold text-primary">{value}</p>
								<p className="text-xs font-semibold text-foreground">{label}</p>
								<p className="mt-1 text-xs text-muted-foreground">{sub}</p>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

/* ─── Programs Section ──────────────────────────── */
function ProgramsSection() {
	const featuredPrograms = PROGRAM_LIST.slice(0, 5);

	return (
		<section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				{/* Header */}
				<motion.div
					className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-80px" }}
					transition={{ duration: 0.6, ease: "easeOut" }}
				>
					<div>
						<p className="text-xs font-semibold uppercase tracking-widest text-primary">
							Program Unggulan
						</p>
						<h2 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
							Momkiddis Indonesia
						</h2>
						<p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
							Momsky, Kiddis, Teenager, Professional, serta satu kelas
							gabungan IELTS &amp; TOEFL.
						</p>
					</div>
					<Link to="/programs" className="shrink-0">
						<Button
							variant="outline"
							size="sm"
							className="gap-1.5 text-xs transition-transform active:scale-[0.97]"
						>
							Lihat Semua
							<ArrowRightIcon className="size-3" />
						</Button>
					</Link>
				</motion.div>

				{/* Grid */}
				<div className="mt-8 grid grid-cols-2 justify-center gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
					{featuredPrograms.map((program, i) => (
						<motion.div
							key={program.slug}
							className={i === 4 ? "hidden lg:block h-full" : "h-full"}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-60px" }}
							transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
						>
							<ProgramCard program={program} index={i} />
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─── Testimoni Section (bento grid) ───────────── */
const HOME_TESTIMONIALS = [
	{
		id: "h1",
		name: "Nadia Putri",
		role: "Momsky Class",
		content:
			"Saya jadi lebih percaya diri mengajar dan mendampingi anak belajar di rumah.",
		avatarSrc:
			"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&q=80",
	},
	{
		id: "h2",
		name: "Rani Kusuma",
		role: "Teenager Class",
		content:
			"Latihan komunikasi dan public speaking membantu saya tampil lebih percaya diri.",
		avatarSrc:
			"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&q=80",
	},
	{
		id: "h3",
		name: "Aulia Rahma",
		role: "IELTS & TOEFL Class",
		content:
			"Latihan listening, reading, speaking, dan writing membuat persiapan tes lebih terarah.",
		avatarSrc:
			"https://images.unsplash.com/photo-1488508872907-592763824245?w=200&h=200&fit=crop&q=80",
	},
	{
		id: "h4",
		name: "Maya Lestari",
		role: "Kiddis Class",
		content:
			"Anak saya menikmati aktivitas calistung dan English Fun karena belajarnya aktif.",
		avatarSrc:
			"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop&q=80",
	},
	{
		id: "h5",
		name: "Dinda Permata",
		role: "Professional Class",
		content:
			"Praktik komunikasi profesional dan evaluasi mentor sangat membantu pekerjaan saya.",
		avatarSrc:
			"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80",
	},
	{
		id: "h6",
		name: "Salsa Wulandari",
		role: "Momsky Class",
		content:
			"Teknik mengajarnya simpel dan langsung bisa saya praktikkan bersama anak.",
		avatarSrc:
			"https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=200&h=200&fit=crop&q=80",
	},
	{
		id: "h7",
		name: "Putri Handayani",
		role: "Teenager Class",
		content:
			"Saya lebih terarah mengatur target belajar dan berani melakukan presentasi.",
		avatarSrc:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80",
	},
];

interface BentoCardProps {
	name: string;
	role: string;
	content: string;
	avatarSrc: string;
	animIndex: number;
	variant?: "light" | "primary" | "dark";
	className?: string;
}

function BentoCard({ name, role, content, avatarSrc, animIndex, variant = "light", className }: BentoCardProps) {
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { once: true, margin: "-60px" });

	const bgClass =
		variant === "primary"
			? "bg-primary text-primary-foreground"
			: variant === "dark"
				? "bg-foreground text-background"
				: "bg-card text-foreground border border-border";

	return (
		<motion.div
			ref={ref}
			animate={inView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
			initial={{ y: -20, opacity: 0, filter: "blur(10px)" }}
			transition={{ duration: 0.5, delay: animIndex * 0.1 }}
			className={`flex flex-col justify-between overflow-hidden rounded-xl p-5 ${bgClass} ${className ?? ""}`}
		>
			{variant === "light" && (
				<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_3%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_3%,transparent)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
			)}
			<p className={`relative text-sm leading-relaxed ${variant === "light" ? "text-foreground/80" : "opacity-90"}`}>
				"{content}"
			</p>
			<div className="relative mt-5 flex items-center justify-between">
				<div>
					<p className="text-sm font-semibold">{name}</p>
					<p className={`text-xs ${variant === "light" ? "text-muted-foreground" : "opacity-70"}`}>{role}</p>
				</div>
				<img src={avatarSrc} alt={name} className="h-12 w-12 rounded-xl object-cover" />
			</div>
		</motion.div>
	);
}

function TestimoniSection() {
	const [t1, t2, t3, t4, t5, t6, t7] = HOME_TESTIMONIALS;

	return (
		<section className="px-4 py-16 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<motion.div
					className="flex items-end justify-between"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-80px" }}
					transition={{ duration: 0.6, ease: "easeOut" }}
				>
					<div>
						<p className="text-xs font-semibold uppercase tracking-widest text-primary">Testimoni</p>
						<h2 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">Apa Kata Mereka?</h2>
					</div>
					<Link to="/testimoni">
						<Button variant="ghost" size="sm" className="gap-1 text-xs text-primary hover:text-primary/80">
							Lihat Semua <ArrowRightIcon className="size-3" />
						</Button>
					</Link>
				</motion.div>

				{/* Mobile: horizontal scroll — 3 cards */}
				<div className="mt-5 flex gap-3 overflow-x-auto pb-2 sm:hidden">
					{[t1, t2, t3].map((t) => (
						<div
							key={t.id}
							className="w-72 flex-none rounded-xl border border-border bg-card p-4"
						>
							<p className="text-sm leading-relaxed text-foreground/80">
								"{t.content}"
							</p>
							<div className="mt-4 flex items-center gap-3">
								<img
									src={t.avatarSrc}
									alt={t.name}
									className="size-9 rounded-lg object-cover"
								/>
								<div>
									<p className="text-sm font-semibold text-foreground">{t.name}</p>
									<p className="text-xs text-muted-foreground">{t.role}</p>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Desktop: bento grid */}
				<div className="mt-6 hidden gap-2 sm:grid lg:grid-cols-3">
					{/* Col 1 */}
					<div className="flex flex-col gap-2">
						<BentoCard {...t1} animIndex={0} variant="light" className="relative flex-[7]" />
						<BentoCard {...t2} animIndex={1} variant="primary" className="flex-[3]" />
					</div>
					{/* Col 2 */}
					<div className="flex flex-col gap-2">
						<BentoCard {...t3} animIndex={2} variant="dark" />
						<BentoCard {...t4} animIndex={3} variant="dark" />
						<BentoCard {...t5} animIndex={4} variant="dark" />
					</div>
					{/* Col 3 */}
					<div className="flex flex-col gap-2">
						<BentoCard {...t6} animIndex={5} variant="primary" className="flex-[3]" />
						<BentoCard {...t7} animIndex={6} variant="light" className="relative flex-[7]" />
					</div>
				</div>
			</div>
		</section>
	);
}

/* ─── Alumni Section (animated slider) ─────────── */
const HOME_ALUMNI_SLIDER: AlumniReview[] = [
	{
		id: "a1",
		name: "Fitri Handayani",
		batchLabel: "Momkiddis Indonesia · Momsky Class",
		quote: "Sekarang saya lebih percaya diri mengajar dan mendampingi anak belajar di rumah.",
		imageSrc: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop&q=80",
		thumbnailSrc: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=120&fit=crop&q=80",
	},
	{
		id: "a2",
		name: "Nanda Pratiwi",
		batchLabel: "Momkiddis Indonesia · IELTS & TOEFL Class",
		quote: "Latihan setiap bagian tes membuat persiapan studi saya lebih fokus dan sistematis.",
		imageSrc: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&q=80",
		thumbnailSrc: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=120&fit=crop&q=80",
	},
	{
		id: "a3",
		name: "Maya Sari",
		batchLabel: "Momkiddis Indonesia · Professional Class",
		quote: "Mentoring dan latihan komunikasi membantu saya tampil lebih rapi dan profesional.",
		imageSrc: "https://images.unsplash.com/photo-1488508872907-592763824245?w=400&h=600&fit=crop&q=80",
		thumbnailSrc: "https://images.unsplash.com/photo-1488508872907-592763824245?w=100&h=120&fit=crop&q=80",
	},
];

function AlumniSection() {
	return (
		<section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<motion.div
					className="mb-6 flex items-end justify-between"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-80px" }}
					transition={{ duration: 0.6, ease: "easeOut" }}
				>
					<div>
						<p className="text-xs font-semibold uppercase tracking-widest text-primary">Peserta</p>
						<h2 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">Cerita Peserta Momkiddis</h2>
					</div>
					<Link to="/alumni">
						<Button variant="ghost" size="sm" className="gap-1 text-xs text-primary hover:text-primary/80">
							Lihat Semua <ArrowRightIcon className="size-3" />
						</Button>
					</Link>
				</motion.div>
				<AlumniSlider reviews={HOME_ALUMNI_SLIDER} />
			</div>
		</section>
	);
}
