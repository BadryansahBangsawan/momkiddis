import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PageHero from "@/components/sections/page-hero";
import { AlumniVideoSlider, type AlumniVideo } from "@/components/sections/alumni-video-slider";
import { STATIC_ALUMNI, PROGRAM_LIST } from "@/lib/programs-content";
import { useSiteConfig } from "@/hooks/use-site-config";
import { orpc } from "@/utils/orpc";
import { Award } from "lucide-react";

export const Route = createFileRoute("/alumni")({
	head: () => ({
		meta: [{ title: "Alumni — Momkiddis Indonesia" }],
	}),
	loader: async ({ context: { queryClient } }) => {
		void queryClient.prefetchQuery(orpc.alumni.list.queryOptions({ input: { page: 1 } }));
	},
	component: AlumniPage,
});

const CLOUDINARY_BASE = "https://res.cloudinary.com/dapw2uaa9/video/upload/q_auto/momkiddis";

const FEATURED_VIDEOS: AlumniVideo[] = [
	{
		id: "f1",
		name: "Fitri Handayani",
		batchLabel: "Momkiddis Indonesia · Momsky Class",
		quote:
			"Saya jadi lebih percaya diri mendampingi anak belajar dan mempraktikkan cara mengajar yang lebih terarah.",
		videoSrc: `${CLOUDINARY_BASE}/vidio/1.mp4`,
	},
	{
		id: "f2",
		name: "Nanda Pratiwi",
		batchLabel: "Momkiddis Indonesia · Kiddis Class",
		quote:
			"Anak saya lebih semangat mengikuti aktivitas calistung dan English Fun yang kreatif.",
		videoSrc: `${CLOUDINARY_BASE}/vidio/2.mp4`,
	},
	{
		id: "f3",
		name: "Maya Sari",
		batchLabel: "Momkiddis Indonesia · Teenager Class",
		quote:
			"Latihan komunikasi dan presentasi membantu saya lebih berani tampil di depan kelas.",
		videoSrc: `${CLOUDINARY_BASE}/vidio/3.mp4`,
	},
	{
		id: "f4",
		name: "Rini Wahyuni",
		batchLabel: "Momkiddis Indonesia · Professional Class",
		quote:
			"Praktik microteaching dan evaluasi mentor membuat cara mengajar saya lebih rapi.",
		videoSrc: `${CLOUDINARY_BASE}/vidio/4.mp4`,
	},
	{
		id: "f5",
		name: "Desi Kurniawati",
		batchLabel: "Momkiddis Indonesia · IELTS & TOEFL Class",
		quote:
			"Latihan listening, reading, speaking, dan writing membuat persiapan English test saya lebih terarah.",
		videoSrc: `${CLOUDINARY_BASE}/vidio/5.mp4`,
	},
];

type FilterSlug = "semua" | (typeof PROGRAM_LIST)[number]["slug"];

const PROGRAM_FILTERS: { id: FilterSlug; label: string }[] = [
	{ id: "semua", label: "Semua" },
	...PROGRAM_LIST.map((p) => ({ id: p.slug as FilterSlug, label: p.shortTitle })),
];

function AlumniPage() {
	const { getWaUrl } = useSiteConfig();
	const waUrl = getWaUrl();
	const [activeFilter, setActiveFilter] = useState<FilterSlug>("semua");

	const { data, isLoading } = useQuery(
		orpc.alumni.list.queryOptions({
			input: {
				page: 1,
				programSlug: activeFilter === "semua" ? undefined : activeFilter,
			},
		}),
	);

	const items = data?.items?.length ? data.items : STATIC_ALUMNI;

	return (
		<>
			<PageHero
				title="Peserta Momkiddis"
				subtitle="Cerita peserta yang mengikuti kelas online Momkiddis Indonesia."
				breadcrumbs={[{ label: "Alumni" }]}
			/>

			<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				{/* ── Animated alumni slider ── */}
				<div className="mb-12">
					<p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
						Kisah Unggulan
					</p>
					<AlumniVideoSlider videos={FEATURED_VIDEOS} />
				</div>

				{/* ── All alumni grid ── */}
				<div>
					<p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
						Semua Alumni
					</p>

					{/* Program filter */}
					<div className="mb-6 flex gap-2 overflow-x-auto pb-1">
						{PROGRAM_FILTERS.map(({ id, label }) => (
							<button
								key={id}
								type="button"
								onClick={() => setActiveFilter(id)}
								className={[
									"shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150 active:scale-[0.97]",
									activeFilter === id
										? "border-primary bg-primary text-primary-foreground"
										: "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
								].join(" ")}
							>
								{label}
							</button>
						))}
					</div>

					{isLoading ? (
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
							))}
						</div>
					) : (
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{items?.map((alumni, i) => (
								<div
									key={alumni.id}
									className="rounded-xl border border-border bg-card p-5"
									style={{ animationDelay: `${i * 60}ms` }}
								>
									<div className="flex items-start gap-3">
										<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
											{alumni.name.slice(0, 2).toUpperCase()}
										</div>
										<div>
											<p className="text-sm font-semibold text-foreground">
												{alumni.name}
											</p>
											<div className="mt-0.5 flex items-center gap-1">
												<Award className="size-3 text-amber-500" />
												<p className="text-xs text-muted-foreground">
													{alumni.batchLabel}
												</p>
											</div>
										</div>
									</div>
									<p className="mt-3 text-xs leading-relaxed text-muted-foreground">
										"{alumni.shortStory}"
									</p>
								</div>
							))}

							{!items?.length && (
								<div className="col-span-full py-12 text-center text-sm text-muted-foreground">
									Belum ada alumni untuk program ini.
								</div>
							)}
						</div>
					)}
				</div>

				{/* CTA */}
				<div className="mt-10 rounded-2xl bg-primary px-8 py-10 text-center">
					<p className="text-lg font-bold text-white">Jadilah Bagian dari Cerita Ini</p>
					<p className="mt-1 text-sm text-white/75">
						Bergabunglah dengan ratusan ibu yang telah membuktikan perubahan nyata.
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
