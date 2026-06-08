import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import PageHero from "@/components/sections/page-hero";
import { useSiteConfig } from "@/hooks/use-site-config";

export const Route = createFileRoute("/testimoni")({
	component: TestimoniPage,
});

// ─── Expanded testimonial data ─────────────────────────────────────────────
const TESTIMONIALS = [
	{
		id: 1,
		name: "Nadia Putri",
		role: "Momsky Class",
		quote:
			"Saya jadi lebih percaya diri mendampingi dan mengajar anak di rumah.",
		avatarSrc:
			"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&q=80",
	},
	{
		id: 2,
		name: "Rani Kusuma",
		role: "Kiddis Class",
		quote:
			"Anak saya menikmati kegiatan calistung dan English Fun yang aktif.",
		avatarSrc:
			"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&q=80",
	},
	{
		id: 3,
		name: "Aulia Rahma",
		role: "Teenager Class",
		quote:
			"Latihan komunikasi dan public speaking membuat saya lebih percaya diri.",
		avatarSrc:
			"https://images.unsplash.com/photo-1488508872907-592763824245?w=200&h=200&fit=crop&q=80",
	},
	{
		id: 4,
		name: "Maya Lestari",
		role: "Professional Class",
		quote:
			"Microteaching dan evaluasi mentor membantu saya menyampaikan materi dengan lebih rapi.",
		avatarSrc:
			"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop&q=80",
	},
	{
		id: 5,
		name: "Dinda Permata",
		role: "IELTS & TOEFL Class",
		quote:
			"Strategi dan simulasi tes membuat persiapan IELTS maupun TOEFL saya lebih sistematis.",
		avatarSrc:
			"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80",
	},
	{
		id: 6,
		name: "Salsa Wulandari",
		role: "Momsky Class",
		quote:
			"Teknik mengajarnya simpel dan mudah saya praktikkan bersama anak.",
		avatarSrc:
			"https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=200&h=200&fit=crop&q=80",
	},
	{
		id: 7,
		name: "Putri Handayani",
		role: "Teenager Class",
		quote:
			"Saya belajar mengatur fokus, target tugas, dan tampil lebih percaya diri.",
		avatarSrc:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80",
	},
];

// ─── Animated reveal card ─────────────────────────────────────────────────
interface CardProps {
	name: string;
	role: string;
	quote: string;
	avatarSrc: string;
	animIndex: number;
	variant?: "light" | "primary" | "dark";
	className?: string;
}

function TestiCard({ name, role, quote, avatarSrc, animIndex, variant = "light", className }: CardProps) {
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
			{/* Quote */}
			<p
				className={[
					"text-sm leading-relaxed",
					variant === "light" ? "text-foreground/80" : "opacity-90",
				].join(" ")}
			>
				"{quote}"
			</p>

			{/* Author */}
			<div className="mt-5 flex items-center justify-between">
				<div>
					<p className="text-sm font-semibold">{name}</p>
					<p
						className={[
							"text-xs",
							variant === "light" ? "text-muted-foreground" : "opacity-70",
						].join(" ")}
					>
						{role}
					</p>
				</div>
				<img
					src={avatarSrc}
					alt={name}
					className="h-12 w-12 rounded-xl object-cover"
				/>
			</div>
		</motion.div>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────
function TestimoniPage() {
	const { getWaUrl } = useSiteConfig();
	const waUrl = getWaUrl();
	const [t1, t2, t3, t4, t5, t6, t7] = TESTIMONIALS;

	return (
		<>
			<PageHero
				title="Testimoni Peserta"
				subtitle="Kata mereka tentang pengalaman belajar di kelas Momkiddis Indonesia."
				breadcrumbs={[{ label: "Testimoni" }]}
			/>

			<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				{/* ── Bento testimonial grid ── */}
				<div className="grid gap-2 lg:grid-cols-3 lg:py-6">
					{/* Column 1 */}
					<div className="flex flex-col gap-2 md:flex lg:flex-col">
						<TestiCard
							{...t1}
							animIndex={0}
							variant="light"
							className="relative flex-[7] before:absolute before:inset-0 before:bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_3%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_3%,transparent)_1px,transparent_1px)] before:bg-[size:40px_40px] before:[mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] before:pointer-events-none"
						/>
						<TestiCard {...t2} animIndex={1} variant="primary" className="flex-[3]" />
					</div>

					{/* Column 2 */}
					<div className="flex h-full flex-col gap-2 md:flex lg:flex-col">
						<TestiCard {...t3} animIndex={2} variant="dark" />
						<TestiCard {...t4} animIndex={3} variant="dark" />
						<TestiCard {...t5} animIndex={4} variant="dark" />
					</div>

					{/* Column 3 */}
					<div className="flex h-full flex-col gap-2 md:flex lg:flex-col">
						<TestiCard {...t6} animIndex={5} variant="primary" className="flex-[3]" />
						<TestiCard
							{...t7}
							animIndex={6}
							variant="light"
							className="relative flex-[7] before:absolute before:inset-0 before:bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_3%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_3%,transparent)_1px,transparent_1px)] before:bg-[size:40px_40px] before:[mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] before:pointer-events-none"
						/>
					</div>
				</div>

				{/* CTA */}
				<div className="mt-10 rounded-2xl bg-primary px-8 py-10 text-center">
					<p className="text-lg font-bold text-white">Jadilah Cerita Berikutnya</p>
					<p className="mt-1 text-sm text-white/75">
						Bergabunglah dan rasakan sendiri pengalaman belajar online yang
						terarah.
					</p>
					<a
						href={waUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary transition-opacity duration-150 active:scale-[0.97] hover:opacity-90"
					>
						Daftar Sekarang
					</a>
				</div>
			</div>
		</>
	);
}
