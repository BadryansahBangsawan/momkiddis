import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@momkiddis/ui/components/button";
import { SlideButton } from "@/components/ui/slide-button";
import { useSiteConfig } from "@/hooks/use-site-config";

type Point = { x: number; y: number };

interface WaveConfig {
	offset: number;
	amplitude: number;
	frequency: number;
	color: string;
	opacity: number;
}

const stats = [
	{ label: "Total Peserta", value: "500+" },
	{ label: "Batch Selesai", value: "20+" },
	{ label: "Rating Peserta", value: "4.9/5" },
];

const pills = [
	"Program Ibu · Anak · Remaja",
	"Profesional · English Test",
	"Belajar Aktif dan Terarah",
] as const;

const container: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, staggerChildren: 0.12 },
	},
};

const item: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const statsAnim: Variants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.08 },
	},
};

export function HeroWaves() {
	const { getWaUrl } = useSiteConfig();
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const mouseRef = useRef<Point>({ x: 0, y: 0 });
	const targetRef = useRef<Point>({ x: 0, y: 0 });

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animId: number;
		let time = 0;

		const resolveColor = (vars: string[], alpha = 1): string => {
			const root = getComputedStyle(document.documentElement);
			const tmp = document.createElement("div");
			tmp.style.cssText = "position:absolute;visibility:hidden;width:1px;height:1px";
			document.body.appendChild(tmp);
			let out = `rgba(24,119,242,${alpha})`;
			for (const v of vars) {
				if (!root.getPropertyValue(v).trim()) continue;
				tmp.style.backgroundColor = `var(${v})`;
				const c = getComputedStyle(tmp).backgroundColor;
				if (c && c !== "rgba(0, 0, 0, 0)") {
					if (alpha < 1) {
						const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
						out = m ? `rgba(${m[1]},${m[2]},${m[3]},${alpha})` : c;
					} else {
						out = c;
					}
					break;
				}
			}
			document.body.removeChild(tmp);
			return out;
		};

		const computeColors = () => ({
			bgTop: resolveColor(["--background"]),
			bgBot: resolveColor(["--muted", "--background"], 0.95),
			waves: [
				{ offset: 0, amplitude: 65, frequency: 0.003, color: resolveColor(["--primary"], 0.75), opacity: 0.45 },
				{ offset: Math.PI / 2, amplitude: 85, frequency: 0.0026, color: resolveColor(["--accent", "--primary"], 0.65), opacity: 0.38 },
				{ offset: Math.PI, amplitude: 55, frequency: 0.0034, color: resolveColor(["--primary"], 0.5), opacity: 0.28 },
				{ offset: Math.PI * 1.5, amplitude: 75, frequency: 0.0022, color: resolveColor(["--accent"], 0.3), opacity: 0.22 },
				{ offset: Math.PI * 2, amplitude: 50, frequency: 0.004, color: resolveColor(["--foreground"], 0.15), opacity: 0.15 },
			] satisfies WaveConfig[],
		});

		let colors = computeColors();

		const obs = new MutationObserver(() => { colors = computeColors(); });
		obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });

		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const influence = reduced ? 10 : 65;
		const radius = reduced ? 160 : 300;
		const smooth = reduced ? 0.04 : 0.1;

		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		const recenter = () => {
			const c = { x: canvas.width / 2, y: canvas.height / 2 };
			mouseRef.current = c;
			targetRef.current = c;
		};

		resize();
		recenter();

		const onResize = () => { resize(); recenter(); };
		const onMove = (e: MouseEvent) => { targetRef.current = { x: e.clientX, y: e.clientY }; };
		const onLeave = () => recenter();

		window.addEventListener("resize", onResize);
		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseleave", onLeave);

		const drawWave = (wave: WaveConfig) => {
			ctx.save();
			ctx.beginPath();
			for (let x = 0; x <= canvas.width; x += 4) {
				const dx = x - mouseRef.current.x;
				const dy = canvas.height / 2 - mouseRef.current.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				const inf = Math.max(0, 1 - dist / radius);
				const me = inf * influence * Math.sin(time * 0.001 + x * 0.01 + wave.offset);
				const y =
					canvas.height / 2 +
					Math.sin(x * wave.frequency + time * 0.002 + wave.offset) * wave.amplitude +
					Math.sin(x * wave.frequency * 0.4 + time * 0.003) * (wave.amplitude * 0.45) +
					me;
				x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
			}
			ctx.lineWidth = 2.5;
			ctx.strokeStyle = wave.color;
			ctx.globalAlpha = wave.opacity;
			ctx.shadowBlur = 32;
			ctx.shadowColor = wave.color;
			ctx.stroke();
			ctx.restore();
		};

		const animate = () => {
			time++;
			mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * smooth;
			mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * smooth;

			const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
			grad.addColorStop(0, colors.bgTop);
			grad.addColorStop(1, colors.bgBot);
			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.globalAlpha = 1;
			ctx.shadowBlur = 0;
			colors.waves.forEach(drawWave);
			animId = requestAnimationFrame(animate);
		};

		animId = requestAnimationFrame(animate);

		return () => {
			window.removeEventListener("resize", onResize);
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseleave", onLeave);
			cancelAnimationFrame(animId);
			obs.disconnect();
		};
	}, []);

	return (
		<section
			className="relative isolate flex min-h-[90svh] w-full items-center justify-center overflow-hidden bg-background"
			aria-label="Hero section"
		>
			{/* Animated canvas */}
			<canvas
				ref={canvasRef}
				className="absolute inset-0 h-full w-full"
				aria-hidden
			/>

			{/* Soft glow blobs */}
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/[0.04] blur-[140px]" />
				<div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-accent/[0.04] blur-[120px]" />
			</div>

			{/* Content */}
			<div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 pb-24 pt-52 text-center md:px-8">
				<motion.div
					variants={container}
					initial="hidden"
					animate="visible"
					className="w-full"
				>
					{/* Heading */}
					<motion.h1
						variants={item}
						className="mb-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
					>
						<span className="block bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
							Ibu Pintar Mengajar
						</span>
						<span className="block bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
							Anak Cerdas Berkarya
						</span>
					</motion.h1>

					{/* Sub-copy */}
					<motion.p
						variants={item}
						className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-foreground/65 sm:text-lg"
					>
						Program belajar untuk ibu, anak, remaja, profesional, serta
						persiapan IELTS &amp; TOEFL dengan metode aktif dan terarah.
					</motion.p>

					{/* CTAs */}
					<motion.div
						variants={item}
						className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
					>
						<Link to="/programs">
							<Button size="lg" className="group gap-2 px-7">
								Lihat Program
								<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
							</Button>
						</Link>
						<SlideButton url={getWaUrl()} label="Hubungi Kami" />
					</motion.div>

					{/* Feature pills */}
					<motion.ul
						variants={item}
						className="mb-10 flex flex-wrap items-center justify-center gap-2"
					>
						{pills.map((pill) => (
							<li
								key={pill}
								className="rounded-full border border-border/40 bg-background/60 px-3.5 py-1 text-xs text-foreground/60 backdrop-blur"
							>
								{pill}
							</li>
						))}
					</motion.ul>

					{/* Stats */}
					<motion.div
						variants={statsAnim}
						className="mb-20 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border/30 bg-border/20 backdrop-blur-sm"
					>
						{stats.map((s) => (
							<motion.div
								key={s.label}
								variants={item}
								className="flex flex-col items-center justify-center gap-0.5 bg-background/65 px-4 py-5 text-center backdrop-blur"
							>
								<span className="text-2xl font-bold text-foreground sm:text-3xl">
									{s.value}
								</span>
								<span className="text-xs text-foreground/50">{s.label}</span>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
