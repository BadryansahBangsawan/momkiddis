import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@momkiddis/ui/lib/utils";
import { useSiteConfig } from "@/hooks/use-site-config";

if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

// ─── Inline styles ────────────────────────────────────────────────────────
const STYLES = `
@keyframes footer-breathe {
  0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}
@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1);   filter: drop-shadow(0 0 5px  color-mix(in oklch, var(--destructive) 50%, transparent)); }
  15%, 45%  { transform: scale(1.2); filter: drop-shadow(0 0 10px color-mix(in oklch, var(--destructive) 80%, transparent)); }
  30%        { transform: scale(1); }
}

.cinematic-footer-wrapper {
  -webkit-font-smoothing: antialiased;
  --pill-bg-1:             color-mix(in oklch, var(--foreground)  3%, transparent);
  --pill-bg-2:             color-mix(in oklch, var(--foreground)  1%, transparent);
  --pill-shadow:           color-mix(in oklch, var(--background) 50%, transparent);
  --pill-highlight:        color-mix(in oklch, var(--foreground) 10%, transparent);
  --pill-inset-shadow:     color-mix(in oklch, var(--background) 80%, transparent);
  --pill-border:           color-mix(in oklch, var(--foreground)  8%, transparent);
  --pill-bg-1-hover:       color-mix(in oklch, var(--foreground)  8%, transparent);
  --pill-bg-2-hover:       color-mix(in oklch, var(--foreground)  2%, transparent);
  --pill-border-hover:     color-mix(in oklch, var(--foreground) 20%, transparent);
  --pill-shadow-hover:     color-mix(in oklch, var(--background) 70%, transparent);
  --pill-highlight-hover:  color-mix(in oklch, var(--foreground) 20%, transparent);
}

.animate-footer-breathe         { animation: footer-breathe        8s  ease-in-out infinite alternate; }
.animate-footer-scroll-marquee  { animation: footer-scroll-marquee 40s linear      infinite; }
.animate-footer-heartbeat       { animation: footer-heartbeat      2s  cubic-bezier(0.25,1,0.5,1) infinite; }

.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right,  color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px);
  mask-image:         linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in oklch, var(--primary)   15%, transparent) 0%,
    color-mix(in oklch, var(--accent)    10%, transparent) 40%,
    transparent 70%
  );
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow:
    0 10px 30px -10px var(--pill-shadow),
    inset 0 1px 1px var(--pill-highlight),
    inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow:
    0 20px 40px -10px var(--pill-shadow-hover),
    inset 0 1px 1px var(--pill-highlight-hover);
  color: var(--foreground);
}

.footer-giant-bg-text {
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, var(--foreground) 5%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, var(--foreground) 10%, transparent) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

.footer-text-glow {
  background: linear-gradient(180deg, var(--foreground) 0%, color-mix(in oklch, var(--foreground) 40%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px color-mix(in oklch, var(--foreground) 15%, transparent));
}
`;

// ─── Marquee ──────────────────────────────────────────────────────────────
function MarqueeItem() {
	return (
		<div className="flex items-center space-x-12 px-6">
			<span>Momsky Class</span>
			<span className="text-primary/60">✦</span>
			<span>Kiddis Class</span>
			<span className="text-accent/60">✦</span>
			<span>Teenager Class</span>
			<span className="text-primary/60">✦</span>
			<span>Professional Class</span>
			<span className="text-accent/60">✦</span>
			<span>IELTS &amp; TOEFL Class</span>
			<span className="text-primary/60">✦</span>
		</div>
	);
}

// ─── Magnetic Button ──────────────────────────────────────────────────────
function MagneticButton({
	className,
	children,
	as: Component = "button",
	...props
}: {
	className?: string;
	children: React.ReactNode;
	as?: React.ElementType;
	[key: string]: unknown;
}) {
	const ref = useRef<HTMLElement>(null);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const el = ref.current;
		if (!el) return;

		const ctx = gsap.context(() => {
			const onMove = (e: MouseEvent) => {
				const rect = el.getBoundingClientRect();
				const x = e.clientX - rect.left - rect.width / 2;
				const y = e.clientY - rect.top - rect.height / 2;
				gsap.to(el, { x: x * 0.4, y: y * 0.4, scale: 1.05, ease: "power2.out", duration: 0.4 });
			};
			const onLeave = () => {
				gsap.to(el, { x: 0, y: 0, scale: 1, ease: "elastic.out(1,0.3)", duration: 1.2 });
			};
			el.addEventListener("mousemove", onMove as EventListener);
			el.addEventListener("mouseleave", onLeave);
			return () => {
				el.removeEventListener("mousemove", onMove as EventListener);
				el.removeEventListener("mouseleave", onLeave);
			};
		}, el);

		return () => ctx.revert();
	}, []);

	return (
		<Component
			ref={ref}
			className={cn("cursor-pointer", className)}
			{...props}
		>
			{children}
		</Component>
	);
}

// ─── Main Footer ──────────────────────────────────────────────────────────
export default function SiteFooter() {
	const { instagram, getWaUrl } = useSiteConfig();
	const wrapperRef = useRef<HTMLDivElement>(null);
	const giantTextRef = useRef<HTMLDivElement>(null);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const linksRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (typeof window === "undefined") return;
		if (!wrapperRef.current) return;

		const ctx = gsap.context(() => {
			gsap.fromTo(
				giantTextRef.current,
				{ y: "10vh", scale: 0.8, opacity: 0 },
				{
					y: "0vh",
					scale: 1,
					opacity: 1,
					ease: "power1.out",
					scrollTrigger: {
						trigger: wrapperRef.current,
						start: "top 80%",
						end: "bottom bottom",
						scrub: 1,
					},
				},
			);

			gsap.fromTo(
				[headingRef.current, linksRef.current],
				{ y: 50, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					stagger: 0.15,
					ease: "power3.out",
					scrollTrigger: {
						trigger: wrapperRef.current,
						start: "top 40%",
						end: "bottom bottom",
						scrub: 1,
					},
				},
			);
		}, wrapperRef);

		return () => ctx.revert();
	}, []);

	return (
		<>
			<style dangerouslySetInnerHTML={{ __html: STYLES }} />

			{/* Curtain reveal wrapper */}
			<div
				ref={wrapperRef}
				className="relative h-screen w-full"
				style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
			>
				{/* Fixed inner footer */}
				<footer className="cinematic-footer-wrapper fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-background text-foreground">
					{/* Aurora + grid background */}
					<div className="footer-aurora pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[80vw] animate-footer-breathe rounded-[50%] blur-[80px] z-0" />
					<div className="footer-bg-grid pointer-events-none absolute inset-0 z-0" />

					{/* Giant background text */}
					<div
						ref={giantTextRef}
						className="footer-giant-bg-text pointer-events-none absolute -bottom-[5vh] left-1/2 -translate-x-1/2 select-none whitespace-nowrap z-0"
					>
						MOMKIDDIS
					</div>

					{/* 1. Diagonal marquee strip */}
					<div className="absolute top-12 left-0 z-10 w-full -rotate-2 scale-110 overflow-hidden border-y border-border/50 bg-background/60 py-4 shadow-2xl backdrop-blur-md">
						<div className="animate-footer-scroll-marquee flex w-max text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground md:text-sm">
							<MarqueeItem />
							<MarqueeItem />
						</div>
					</div>

					{/* 2. Main center content */}
					<div className="relative z-10 mx-auto mt-20 flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6">
						<h2
							ref={headingRef}
							className="footer-text-glow mb-12 text-center text-5xl font-black tracking-tighter md:text-8xl"
						>
							Mulai Belajar Bersama
						</h2>

						{/* CTA Pills */}
						<div ref={linksRef} className="flex w-full flex-col items-center gap-6">
							{/* Primary CTA buttons */}
							<div className="flex flex-wrap justify-center gap-4">
								<MagneticButton
									as="a"
									href={getWaUrl()}
									target="_blank"
									rel="noopener noreferrer"
									className="footer-glass-pill group flex items-center gap-3 rounded-full px-10 py-5 text-sm font-bold text-foreground md:text-base"
								>
									{/* WhatsApp icon */}
									<svg className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
										<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
									</svg>
									Daftar via WhatsApp
								</MagneticButton>

								<MagneticButton
									as="a"
									href={instagram}
									target="_blank"
									rel="noopener noreferrer"
									className="footer-glass-pill group flex items-center gap-3 rounded-full px-10 py-5 text-sm font-bold text-foreground md:text-base"
								>
									{/* Instagram icon */}
									<svg className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
										<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
									</svg>
									Ikuti di Instagram
								</MagneticButton>
							</div>

							{/* Secondary text links */}
							<div className="mt-2 flex flex-wrap justify-center gap-3 md:gap-4">
								<MagneticButton
									as={Link}
									to="/kontak"
									className="footer-glass-pill rounded-full px-6 py-3 text-xs font-medium text-muted-foreground hover:text-foreground md:text-sm"
								>
									Kontak Kami
								</MagneticButton>
								<MagneticButton
									as={Link}
									to="/faq"
									className="footer-glass-pill rounded-full px-6 py-3 text-xs font-medium text-muted-foreground hover:text-foreground md:text-sm"
								>
									FAQ
								</MagneticButton>
								<MagneticButton
									as={Link}
									to="/programs"
									className="footer-glass-pill rounded-full px-6 py-3 text-xs font-medium text-muted-foreground hover:text-foreground md:text-sm"
								>
									Lihat Program
								</MagneticButton>
							</div>
						</div>
					</div>

					{/* 3. Bottom bar */}
					<div className="relative z-20 flex w-full flex-col items-center justify-between gap-6 px-6 pb-8 md:flex-row md:px-12">
						{/* Copyright */}
						<div className="order-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground md:order-1 md:text-xs">
							&copy; {new Date().getFullYear()} Momkiddis Indonesia. Hak cipta dilindungi.
						</div>

						{/* Back to top */}
						<MagneticButton
							as="button"
							onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
							className="footer-glass-pill order-3 flex h-12 w-12 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
						>
							<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
							</svg>
						</MagneticButton>
					</div>
				</footer>
			</div>
		</>
	);
}
