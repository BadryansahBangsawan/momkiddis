import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "framer-motion";
import PageHero from "@/components/sections/page-hero";
import { useSiteConfig } from "@/hooks/use-site-config";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/testimoni")({
	head: () => ({
		meta: [{ title: "Testimoni — Momkiddis Indonesia" }],
	}),
	loader: async ({ context: { queryClient } }) => {
		void queryClient.prefetchQuery(orpc.testimonials.list.queryOptions());
	},
	component: TestimoniPage,
});

// ─── Fallback static data (dipakai saat DB kosong) ────────────────────────
const STATIC_TESTIMONIALS = [
	{
		id: "s1",
		authorName: "Nadia Putri",
		authorRole: "Momsky Class",
		content: "Saya jadi lebih percaya diri mendampingi dan mengajar anak di rumah.",
		authorImage: "/gallery-foto/PP3.jpg",
	},
	{
		id: "s2",
		authorName: "Rani Kusuma",
		authorRole: "Kiddis Class",
		content: "Anak saya menikmati kegiatan calistung dan English Fun yang aktif.",
		authorImage: "/gallery-foto/IMG_0521.jpg",
	},
	{
		id: "s3",
		authorName: "Aulia Rahma",
		authorRole: "Teenager Class",
		content: "Latihan komunikasi dan public speaking membuat saya lebih percaya diri.",
		authorImage: "/gallery-foto/12b.jpg",
	},
	{
		id: "s4",
		authorName: "Maya Lestari",
		authorRole: "Professional Class",
		content: "Microteaching dan evaluasi mentor membantu saya menyampaikan materi dengan lebih rapi.",
		authorImage: "/gallery-foto/feb10.jpg",
	},
	{
		id: "s5",
		authorName: "Dinda Permata",
		authorRole: "IELTS & TOEFL Class",
		content: "Strategi dan simulasi tes membuat persiapan IELTS maupun TOEFL saya lebih sistematis.",
		authorImage: "/gallery-foto/TEST-English-School-Alumni-30.jpg",
	},
	{
		id: "s6",
		authorName: "Salsa Wulandari",
		authorRole: "Momsky Class",
		content: "Teknik mengajarnya simpel dan mudah saya praktikkan bersama anak.",
		authorImage: "/gallery-foto/TEST-English-School-Alumni-32.jpg",
	},
	{
		id: "s7",
		authorName: "Putri Handayani",
		authorRole: "Teenager Class",
		content: "Saya belajar mengatur fokus, target tugas, dan tampil lebih percaya diri.",
		authorImage: "/gallery-foto/scr-2.jpg",
	},
];

// ─── Animated reveal card ─────────────────────────────────────────────────
interface CardProps {
	name: string;
	role: string;
	quote: string;
	avatarSrc?: string | null;
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
				{avatarSrc && (
					<img
						src={avatarSrc}
						alt={name}
						className="h-12 w-12 rounded-xl object-cover"
					/>
				)}
			</div>
		</motion.div>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────
function TestimoniPage() {
	const { getWaUrl } = useSiteConfig();
	const waUrl = getWaUrl();

	const { data: dbTestimonials = [] } = useQuery(orpc.testimonials.list.queryOptions());

	// Gunakan data dari DB jika ada, fallback ke static
	const items = dbTestimonials.length > 0
		? dbTestimonials.map((t) => ({
				id: String(t.id),
				name: t.authorName,
				role: t.authorRole,
				quote: t.content,
				avatarSrc: t.authorImage,
			}))
		: STATIC_TESTIMONIALS.map((t) => ({
				id: t.id,
				name: t.authorName,
				role: t.authorRole,
				quote: t.content,
				avatarSrc: t.authorImage,
			}));

	// Bagi item ke 3 kolom
	const col1 = items.filter((_, i) => i % 3 === 0);
	const col2 = items.filter((_, i) => i % 3 === 1);
	const col3 = items.filter((_, i) => i % 3 === 2);

	const VARIANTS: Array<"light" | "primary" | "dark"> = ["light", "primary", "dark"];

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
					{[col1, col2, col3].map((col, ci) => (
						<div key={ci} className="flex flex-col gap-2">
							{col.map((t, ri) => (
								<TestiCard
									key={t.id}
									name={t.name}
									role={t.role}
									quote={t.quote}
									avatarSrc={t.avatarSrc}
									animIndex={ci * 3 + ri}
									variant={VARIANTS[(ci + ri) % 3]}
								/>
							))}
						</div>
					))}
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
