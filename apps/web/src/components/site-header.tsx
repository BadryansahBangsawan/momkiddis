import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
	Home,
	BookOpen,
	Lightbulb,
	Award,
	Images,
	HelpCircle,
	Phone,
	type LucideIcon,
} from "lucide-react";
import { Button } from "@momkiddis/ui/components/button";
import { cn } from "@momkiddis/ui/lib/utils";

import { useSiteConfig } from "@/hooks/use-site-config";

interface NavItemDef {
	name: string;
	to: string;
	icon: LucideIcon;
	exact?: boolean;
}

const NAV_ITEMS: NavItemDef[] = [
	{ name: "Beranda", to: "/", icon: Home, exact: true },
	{ name: "Program", to: "/programs", icon: BookOpen },
	{ name: "Metode", to: "/metode", icon: Lightbulb },
	{ name: "Alumni", to: "/alumni", icon: Award },
	{ name: "Galeri", to: "/galeri", icon: Images },
	{ name: "FAQ", to: "/faq", icon: HelpCircle },
	{ name: "Kontak", to: "/kontak", icon: Phone },
];

function useActiveNav() {
	const { location } = useRouterState();
	const pathname = location.pathname;

	for (const item of NAV_ITEMS) {
		if (item.exact) {
			if (pathname === item.to) return item.name;
		} else {
			if (pathname === item.to || pathname.startsWith(`${item.to}/`)) {
				return item.name;
			}
		}
	}
	return undefined;
}

export default function SiteHeader() {
	const activeName = useActiveNav();
	const { siteName, getWaUrl } = useSiteConfig();
	const waUrl = getWaUrl();

	return (
		<>
			{/* ── Top bar: logo + right actions ── */}
			<header className="fixed inset-x-0 top-0 z-40 px-4 pt-6 pointer-events-none sm:px-6 lg:px-8">
				<div className="mx-auto flex h-11 max-w-7xl items-center justify-between">
					{/* Logo */}
					<Link
						to="/"
						className="pointer-events-auto flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 shadow-sm backdrop-blur-md border border-border/30 transition-opacity hover:opacity-80 active:scale-[0.98]"
					>
						<span className="text-sm font-bold tracking-tight text-primary">
							{siteName}
						</span>
					</Link>

					{/* Right: WA CTA (desktop) */}
					<div className="pointer-events-auto hidden items-center gap-2 md:flex">
						<a href={waUrl} target="_blank" rel="noopener noreferrer">
							<Button
								size="lg"
								className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm"
							>
								Daftar Sekarang
							</Button>
						</a>
					</div>
				</div>
			</header>

			{/* ── Tubelight floating pill nav (desktop center) ── */}
			<div className="fixed inset-x-0 top-0 z-50 hidden md:flex justify-center pt-4 pointer-events-none">
				<div className="pointer-events-auto flex items-center gap-1 rounded-full border border-border/40 bg-background/70 px-2 py-1.5 shadow-lg backdrop-blur-md">
					{NAV_ITEMS.map(({ name, to }) => {
						const isActive = activeName === name;
						return (
							<Link
								key={name}
								to={to}
								className={cn(
									"relative cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-colors select-none",
									isActive
										? "text-primary"
										: "text-foreground/60 hover:text-foreground",
								)}
							>
								{isActive && (
									<motion.div
										layoutId="tubelight-lamp"
										className="absolute inset-0 rounded-full bg-primary/8 -z-10"
										initial={false}
										transition={{ type: "spring", stiffness: 350, damping: 30 }}
									>
										{/* Lamp glow at top */}
										<div className="absolute -top-2 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-t-full bg-primary">
											<div className="absolute -left-2 -top-2 h-5 w-10 rounded-full bg-primary/20 blur-md" />
											<div className="absolute -top-1 h-4 w-6 rounded-full bg-primary/20 blur-md" />
										</div>
									</motion.div>
								)}
								<span>{name}</span>
							</Link>
						);
					})}
				</div>
			</div>

			{/* ── Mobile bottom floating pill nav ── */}
			<div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pb-4 md:hidden pointer-events-none">
				<div className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-border/40 bg-background/80 px-1 py-1 shadow-xl backdrop-blur-md">
					{NAV_ITEMS.map(({ name, to, icon: Icon }) => {
						const isActive = activeName === name;
						return (
							<Link
								key={name}
								to={to}
								className={cn(
									"relative flex items-center justify-center rounded-full p-2.5 transition-colors",
									isActive ? "text-primary" : "text-foreground/50 hover:text-foreground",
								)}
								aria-label={name}
							>
								{isActive && (
									<motion.div
										layoutId="tubelight-lamp-mobile"
										className="absolute inset-0 rounded-full bg-primary/8 -z-10"
										initial={false}
										transition={{ type: "spring", stiffness: 350, damping: 30 }}
									>
										<div className="absolute -top-1.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-t-full bg-primary">
											<div className="absolute -left-1.5 -top-1.5 h-4 w-7 rounded-full bg-primary/20 blur-sm" />
										</div>
									</motion.div>
								)}
								<Icon size={18} strokeWidth={2.5} />
							</Link>
						);
					})}
				</div>
			</div>
		</>
	);
}
