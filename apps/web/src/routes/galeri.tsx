import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Play, Pause, Volume2, VolumeX, X, ChevronLeft, ChevronRight } from "lucide-react";
import PageHero from "@/components/sections/page-hero";
import { orpc } from "@/utils/orpc";
import { cn } from "@momkiddis/ui/lib/utils";

const CLOUDINARY_BASE = "https://res.cloudinary.com/dapw2uaa9/video/upload/q_auto/momkiddis";

const VIDEOS = [
	{
		id: "1",
		src: `${CLOUDINARY_BASE}/vidio/1.mp4`,
		caption: "Praktik Mengajar Momsky Class",
		event: "Momsky Class",
	},
	{
		id: "2",
		src: `${CLOUDINARY_BASE}/vidio/2.mp4`,
		caption: "Belajar Seru Kiddis Class",
		event: "Kiddis Class",
	},
	{
		id: "3",
		src: `${CLOUDINARY_BASE}/vidio/3.mp4`,
		caption: "Latihan Komunikasi Teenager Class",
		event: "Teenager Class",
	},
	{
		id: "4",
		src: `${CLOUDINARY_BASE}/vidio/4.mp4`,
		caption: "Mentoring Professional Class",
		event: "Professional Class",
	},
	{
		id: "5",
		src: `${CLOUDINARY_BASE}/vidio/5.mp4`,
		caption: "Latihan IELTS & TOEFL Class",
		event: "IELTS & TOEFL",
	},
	{
		id: "6",
		src: `${CLOUDINARY_BASE}/vidio/6.mp4`,
		caption: "E-Certificate Momkiddis Batch 5",
		event: "E-Certificate",
	},
];

const LOCAL_PHOTOS = [
	{
		id: "l1",
		src: "/gallery-foto/Alumni-test-Greece-.jpg",
		caption: "Alumni Test — Yunani",
		category: "Alumni",
	},
	{
		id: "l2",
		src: "/gallery-foto/Alumni-test-UK-3.jpg",
		caption: "Alumni Test — Inggris",
		category: "Alumni",
	},
	{
		id: "l3",
		src: "/gallery-foto/Alumni-test-USA-4.jpg",
		caption: "Alumni Test — Amerika",
		category: "Alumni",
	},
	{
		id: "l4",
		src: "/gallery-foto/Alumni-test-polandia.jpg",
		caption: "Alumni Test — Polandia",
		category: "Alumni",
	},
	{
		id: "l5",
		src: "/gallery-foto/TEST-English-School-Alumni-18.jpg",
		caption: "Alumni Batch 18",
		category: "Alumni",
	},
	{
		id: "l6",
		src: "/gallery-foto/TEST-English-School-Alumni-30.jpg",
		caption: "Alumni Batch 30",
		category: "Alumni",
	},
	{
		id: "l7",
		src: "/gallery-foto/TEST-English-School-Alumni-32.jpg",
		caption: "Alumni Batch 32",
		category: "Alumni",
	},
	{
		id: "l8",
		src: "/gallery-foto/IMG_0521.jpg",
		caption: "Kegiatan Kelas",
		category: "Kelas",
	},
	{
		id: "l9",
		src: "/gallery-foto/PP3.jpg",
		caption: "Sesi Belajar",
		category: "Kelas",
	},
	{
		id: "l10",
		src: "/gallery-foto/12b.jpg",
		caption: "Aktivitas Kelas",
		category: "Kelas",
	},
	{
		id: "l11",
		src: "/gallery-foto/17-1.jpg",
		caption: "Kegiatan Bersama",
		category: "Kegiatan",
	},
	{
		id: "l12",
		src: "/gallery-foto/18-1.jpg",
		caption: "Momen Belajar",
		category: "Kegiatan",
	},
	{
		id: "l13",
		src: "/gallery-foto/feb10.jpg",
		caption: "Kegiatan Februari",
		category: "Kegiatan",
	},
	{
		id: "l14",
		src: "/gallery-foto/scr-2.jpg",
		caption: "Sesi Online",
		category: "Kegiatan",
	},
];

type Photo = (typeof LOCAL_PHOTOS)[number];

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({
	photos,
	index,
	onClose,
	onChange,
}: {
	photos: Photo[];
	index: number;
	onClose: () => void;
	onChange: (i: number) => void;
}) {
	const photo = photos[index];
	const total = photos.length;
	const touchStartX = useRef<number>(0);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowLeft") onChange((index - 1 + total) % total);
			if (e.key === "ArrowRight") onChange((index + 1) % total);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [index, total, onClose, onChange]);

	// Lock body scroll while lightbox is open
	useEffect(() => {
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, []);

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: lightbox overlay
		<div
			className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95"
			onClick={onClose}
		>
			{/* Top bar */}
			<div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3">
				<span className="text-xs font-medium text-white/50">
					{index + 1} / {total}
				</span>
				<button
					type="button"
					onClick={onClose}
					className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-95"
				>
					<X className="size-4" />
				</button>
			</div>

			{/* Image area with swipe */}
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: image click stops propagation */}
			<div
				className="relative flex w-full flex-1 items-center justify-center px-12 sm:px-16"
				onClick={(e) => e.stopPropagation()}
				onTouchStart={(e) => {
					touchStartX.current = e.touches[0].clientX;
				}}
				onTouchEnd={(e) => {
					const dx = e.changedTouches[0].clientX - touchStartX.current;
					if (dx > 50) onChange((index - 1 + total) % total);
					if (dx < -50) onChange((index + 1) % total);
				}}
			>
				<img
					src={photo.src}
					alt={photo.caption}
					className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl"
					draggable={false}
				/>
			</div>

			{/* Prev button */}
			{total > 1 && (
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onChange((index - 1 + total) % total);
					}}
					className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-95 sm:left-4 sm:size-10"
				>
					<ChevronLeft className="size-5" />
				</button>
			)}

			{/* Next button */}
			{total > 1 && (
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onChange((index + 1) % total);
					}}
					className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-95 sm:right-4 sm:size-10"
				>
					<ChevronRight className="size-5" />
				</button>
			)}

			{/* Caption */}
			<div className="absolute inset-x-0 bottom-0 pb-5 pt-3 text-center">
				<p className="text-sm font-semibold text-white">{photo.caption}</p>
				<span className="mt-1.5 inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] text-white/70 backdrop-blur-sm">
					{photo.category}
				</span>
			</div>
		</div>
	);
}

// ── Photo Grid ────────────────────────────────────────────────────────────────
function PhotoGrid({ photos }: { photos: Photo[] }) {
	const [filter, setFilter] = useState("Semua");
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

	const categories = ["Semua", ...Array.from(new Set(photos.map((p) => p.category)))];
	const filtered = filter === "Semua" ? photos : photos.filter((p) => p.category === filter);

	return (
		<>
			{/* Filter pills */}
			<div className="mb-5 flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
				{categories.map((cat) => (
					<button
						key={cat}
						type="button"
						onClick={() => setFilter(cat)}
						className={cn(
							"shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150 active:scale-[0.97]",
							filter === cat
								? "bg-primary text-primary-foreground shadow-sm"
								: "bg-muted text-muted-foreground hover:bg-muted/70",
						)}
					>
						{cat}
					</button>
				))}
			</div>

			{/* Masonry grid */}
			<div className="columns-2 gap-2.5 sm:columns-3 sm:gap-3 lg:columns-4 lg:gap-4">
				{filtered.map((photo, i) => (
					// biome-ignore lint/a11y/useKeyWithClickEvents: gallery item
					<div
						key={photo.id}
						className="group relative mb-2.5 cursor-pointer break-inside-avoid overflow-hidden rounded-xl bg-muted sm:mb-3 sm:rounded-2xl"
						onClick={() => setLightboxIndex(i)}
					>
						<img
							src={photo.src}
							alt={photo.caption}
							className="w-full object-cover transition-transform duration-300 group-hover:scale-105 group-active:scale-[1.02]"
							loading="lazy"
						/>
						{/* Overlay — visible on hover (desktop) and always on mobile tap feedback */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
							<div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3">
								<p className="line-clamp-2 text-[11px] font-semibold leading-snug text-white sm:text-xs">
									{photo.caption}
								</p>
								<span className="mt-1 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white/90 backdrop-blur-sm">
									{photo.category}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Lightbox */}
			{lightboxIndex !== null && (
				<Lightbox
					photos={filtered}
					index={lightboxIndex}
					onClose={() => setLightboxIndex(null)}
					onChange={setLightboxIndex}
				/>
			)}
		</>
	);
}

// ── Video Card ────────────────────────────────────────────────────────────────
function VideoCard({ video }: { video: (typeof VIDEOS)[number] }) {
	const ref = useRef<HTMLVideoElement>(null);
	const [playing, setPlaying] = useState(false);
	const [muted, setMuted] = useState(false);

	function togglePlay() {
		const el = ref.current;
		if (!el) return;
		if (el.paused) {
			el.play();
			setPlaying(true);
		} else {
			el.pause();
			setPlaying(false);
		}
	}

	function toggleMute(e: React.MouseEvent) {
		e.stopPropagation();
		const el = ref.current;
		if (!el) return;
		el.muted = !el.muted;
		setMuted(el.muted);
	}

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: video card
		<div
			className="group relative cursor-pointer overflow-hidden rounded-2xl bg-black shadow-sm"
			onClick={togglePlay}
		>
			<video
				ref={ref}
				src={video.src}
				className="aspect-[9/16] w-full object-cover"
				loop
				playsInline
				onEnded={() => setPlaying(false)}
			/>

			{/* Play overlay */}
			{!playing && (
				<div className="absolute inset-0 flex items-center justify-center bg-black/30">
					<div className="flex size-12 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-transform duration-150 active:scale-95 sm:size-14">
						<Play className="size-5 translate-x-0.5 text-black sm:size-6" fill="black" />
					</div>
				</div>
			)}

			{/* Bottom overlay */}
			<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-3 pb-3 pt-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
				<p className="text-xs font-semibold leading-snug text-white">{video.caption}</p>
				<div className="mt-1.5 flex items-center justify-between">
					<span className="inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white/90 backdrop-blur-sm">
						{video.event}
					</span>
					{playing && (
						<div className="flex items-center gap-1.5">
							<button
								type="button"
								onClick={toggleMute}
								className="flex size-6 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
							>
								{muted ? <VolumeX className="size-3" /> : <Volume2 className="size-3" />}
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									togglePlay();
								}}
								className="flex size-6 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
							>
								<Pause className="size-3" fill="white" />
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

// ── Route ─────────────────────────────────────────────────────────────────────
export const Route = createFileRoute("/galeri")({
	head: () => ({
		meta: [{ title: "Galeri — Momkiddis Indonesia" }],
	}),
	loader: async ({ context: { queryClient } }) => {
		void queryClient.prefetchQuery(orpc.gallery.list.queryOptions());
	},
	component: GaleriPage,
});

function GaleriPage() {
	const { data: adminPhotos = [] } = useQuery(orpc.gallery.list.queryOptions());

	// Merge: local static photos first, then admin-uploaded extras
	const allPhotos: Photo[] = [
		...LOCAL_PHOTOS,
		...adminPhotos.map((p) => ({
			id: p.id,
			src: p.imageUrl,
			caption: p.caption,
			category: p.event ?? "Kegiatan",
		})),
	];

	return (
		<>
			<PageHero
				title="Galeri Kegiatan"
				subtitle="Momen belajar dan berkembang bersama peserta Momkiddis."
				breadcrumbs={[{ label: "Galeri" }]}
			/>

			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
				{/* ── Foto Kegiatan ── */}
				<p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
					Foto Kegiatan
				</p>
				<PhotoGrid photos={allPhotos} />

				<div className="my-10 border-t border-border" />

				{/* ── Video Kegiatan ── */}
				<p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
					Video Kegiatan
				</p>
				<div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:gap-3">
					{VIDEOS.map((video) => (
						<VideoCard key={video.id} video={video} />
					))}
				</div>

				{/* ── Instagram CTA ── */}
				<div className="mt-10 rounded-xl border border-border bg-card p-5 text-center sm:p-6">
					<p className="text-sm font-semibold text-foreground">
						Lihat aktivitas terkini di Instagram kami
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Konten harian, tips belajar bahasa Inggris, dan update kelas terbaru.
					</p>
					<a
						href="https://instagram.com/momkiddy.education"
						target="_blank"
						rel="noopener noreferrer"
						className="mt-4 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-gradient-to-r from-purple-50 to-pink-50 px-5 py-2 text-sm font-semibold text-pink-700 transition-opacity duration-150 hover:opacity-80 active:scale-[0.97] dark:border-pink-900 dark:from-purple-950/40 dark:to-pink-950/40 dark:text-pink-400"
					>
						@momkiddy.education
					</a>
				</div>
			</div>
		</>
	);
}
