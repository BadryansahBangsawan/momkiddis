import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@momkiddis/ui/components/button";
import { cn } from "@momkiddis/ui/lib/utils";

export type AlumniVideo = {
	id: string | number;
	name: string;
	batchLabel: string;
	quote: string;
	videoSrc: string;
};

const videoVariants = {
	enter: (dir: "left" | "right") => ({
		y: dir === "right" ? "100%" : "-100%",
		opacity: 0,
	}),
	center: { y: 0, opacity: 1 },
	exit: (dir: "left" | "right") => ({
		y: dir === "right" ? "-100%" : "100%",
		opacity: 0,
	}),
};

const textVariants = {
	enter: (dir: "left" | "right") => ({
		x: dir === "right" ? 50 : -50,
		opacity: 0,
	}),
	center: { x: 0, opacity: 1 },
	exit: (dir: "left" | "right") => ({
		x: dir === "right" ? -50 : 50,
		opacity: 0,
	}),
};

interface AlumniVideoSliderProps {
	videos: AlumniVideo[];
	className?: string;
}

function VideoPlayer({ src, isActive }: { src: string; isActive: boolean }) {
	const ref = useRef<HTMLVideoElement>(null);
	const [playing, setPlaying] = useState(false);
	const [muted, setMuted] = useState(true);

	// Pause when slide changes away
	useEffect(() => {
		if (!isActive && ref.current) {
			ref.current.pause();
			setPlaying(false);
		}
	}, [isActive]);

	function togglePlay(e: React.MouseEvent) {
		e.stopPropagation();
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
		<div className="relative h-full w-full">
			<video
				ref={ref}
				src={src}
				className="h-full w-full rounded-xl object-cover"
				loop
				muted={muted}
				playsInline
				preload="metadata"
			/>

			{/* Play/Pause overlay */}
			{!playing && (
				// biome-ignore lint/a11y/useKeyWithClickEvents: play button overlay
				<div
					className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/30 cursor-pointer"
					onClick={togglePlay}
				>
					<div className="flex size-14 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-transform duration-150 active:scale-95">
						<Play className="size-6 translate-x-0.5 text-black" fill="black" />
					</div>
				</div>
			)}

			{/* Controls */}
			{playing && (
				<div className="absolute bottom-3 right-3 flex items-center gap-1.5">
					<button
						type="button"
						onClick={toggleMute}
						className="flex size-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
					>
						{muted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
					</button>
					<button
						type="button"
						onClick={togglePlay}
						className="flex size-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
					>
						<Pause className="size-3.5" fill="white" />
					</button>
				</div>
			)}
		</div>
	);
}

export function AlumniVideoSlider({ videos, className }: AlumniVideoSliderProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [direction, setDirection] = useState<"left" | "right">("right");

	const active = videos[currentIndex];

	const handleNext = () => {
		setDirection("right");
		setCurrentIndex((p) => (p + 1) % videos.length);
	};

	const handlePrev = () => {
		setDirection("left");
		setCurrentIndex((p) => (p - 1 + videos.length) % videos.length);
	};

	return (
		<div
			className={cn(
				"relative w-full min-h-[620px] md:min-h-[560px] overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-12",
				className,
			)}
		>
			<div className="grid h-full grid-cols-1 gap-8 md:grid-cols-12">
				{/* ── Left: counter ── */}
				<div className="order-2 flex flex-col justify-between md:order-1 md:col-span-3">
					<div className="flex flex-row justify-between space-x-4 md:flex-col md:justify-start md:space-x-0 md:space-y-4">
						<span className="font-mono text-sm text-muted-foreground">
							{String(currentIndex + 1).padStart(2, "0")} /{" "}
							{String(videos.length).padStart(2, "0")}
						</span>
						<h2 className="hidden text-sm font-medium uppercase tracking-widest [writing-mode:vertical-rl] md:block rotate-180">
							Peserta
						</h2>
					</div>

					{/* Video dots */}
					<div className="mt-8 flex space-x-2 md:mt-0">
						{videos.map((video, i) => (
							<button
								key={video.id}
								type="button"
								onClick={() => {
									setDirection(i > currentIndex ? "right" : "left");
									setCurrentIndex(i);
								}}
								aria-label={`Lihat peserta ${video.name}`}
								className={cn(
									"h-2 rounded-full transition-all duration-300",
									i === currentIndex
										? "w-8 bg-primary"
										: "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50",
								)}
							/>
						))}
					</div>
				</div>

				{/* ── Center: main video ── */}
				<div className="relative order-1 h-80 min-h-[380px] md:order-2 md:col-span-4 md:min-h-[460px]">
					<AnimatePresence initial={false} custom={direction}>
						<motion.div
							key={currentIndex}
							custom={direction}
							variants={videoVariants}
							initial="enter"
							animate="center"
							exit="exit"
							transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
							className="absolute inset-0"
						>
							<VideoPlayer
								src={active.videoSrc}
								isActive={true}
							/>
						</motion.div>
					</AnimatePresence>
				</div>

				{/* ── Right: text + navigation ── */}
				<div className="order-3 flex flex-col justify-between md:col-span-5 md:pl-8">
					<div className="relative min-h-[180px] overflow-hidden pt-4 md:pt-20">
						<AnimatePresence initial={false} custom={direction} mode="wait">
							<motion.div
								key={currentIndex}
								custom={direction}
								variants={textVariants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
							>
								<p className="text-sm font-medium text-muted-foreground">
									{active.batchLabel}
								</p>
								<h3 className="mt-1 text-xl font-semibold text-foreground">
									{active.name}
								</h3>
								<blockquote className="mt-6 text-xl font-medium leading-snug text-foreground md:text-2xl">
									"{active.quote}"
								</blockquote>
							</motion.div>
						</AnimatePresence>
					</div>

					{/* Nav buttons */}
					<div className="mt-8 flex items-center gap-2 md:mt-0">
						<Button
							variant="outline"
							size="icon"
							onClick={handlePrev}
							aria-label="Sebelumnya"
							className="h-12 w-12"
						>
							<ArrowLeft className="h-5 w-5" />
						</Button>
						<Button
							variant="default"
							size="icon"
							onClick={handleNext}
							aria-label="Berikutnya"
							className="h-12 w-12"
						>
							<ArrowRight className="h-5 w-5" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
