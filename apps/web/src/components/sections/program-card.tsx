import { Link } from "@tanstack/react-router";
import { Badge } from "@momkiddis/ui/components/badge";
import {
	Card,
	CardContent,
	CardTitle,
} from "@momkiddis/ui/components/card";
import { cn } from "@momkiddis/ui/lib/utils";
import {
	GraduationCap,
	BookOpen,
	Calculator,
	FileText,
	Globe,
	MessageCircle,
	PenLine,
	UserRound,
} from "lucide-react";
import {
	PROGRAM_CATEGORY_LABELS,
	type Program,
} from "@/lib/programs-content";

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
	GraduationCap: ({ className }) => <GraduationCap className={className} />,
	BookOpen: ({ className }) => <BookOpen className={className} />,
	Calculator: ({ className }) => <Calculator className={className} />,
	FileText: ({ className }) => <FileText className={className} />,
	Globe: ({ className }) => <Globe className={className} />,
	MessageCircle: ({ className }) => <MessageCircle className={className} />,
	PenLine: ({ className }) => <PenLine className={className} />,
	UserRound: ({ className }) => <UserRound className={className} />,
};

const UNIFIED_COLOR = {
	border: "border-border",
	icon: "bg-primary text-primary-foreground",
	badge: "bg-primary text-primary-foreground",
};

const COLOR_MAP: Record<string, typeof UNIFIED_COLOR> = {
	blue: UNIFIED_COLOR,
	green: UNIFIED_COLOR,
	purple: UNIFIED_COLOR,
	orange: UNIFIED_COLOR,
	pink: UNIFIED_COLOR,
};

interface ProgramCardProps {
	program: Program;
	index?: number;
}

export default function ProgramCard({ program, index = 0 }: ProgramCardProps) {
	const Icon = ICON_MAP[program.icon] ?? ICON_MAP.BookOpen;
	const colors = COLOR_MAP[program.color] ?? COLOR_MAP.blue;

	return (
		<Link
			to="/programs/$slug"
			params={{ slug: program.slug }}
			aria-label={`Buka program ${program.shortTitle}`}
			className="group mx-auto block h-full w-full max-w-[25.5rem] transition-all duration-200 hover:-translate-y-1 active:scale-[0.99]"
			style={{ animationDelay: `${index * 60}ms` }}
		>
			<Card
				size="sm"
				className={cn(
					"relative h-full !gap-0 overflow-hidden rounded-[1.25rem] border bg-primary/10 !py-0 text-card-foreground shadow-sm transition-all duration-200 group-hover:shadow-xl sm:rounded-[1.6rem]",
					colors.border,
				)}
			>
				<div className="relative aspect-[4/5] overflow-hidden bg-secondary leading-none">
					{program.image ? (
						<img
							src={program.image}
							alt={`Poster program ${program.shortTitle}`}
							className="block size-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
							loading="lazy"
						/>
					) : (
						<div className="flex size-full items-center justify-center bg-secondary">
							<div
								className={cn(
									"flex size-10 items-center justify-center rounded-2xl shadow-sm sm:size-16",
									colors.icon,
								)}
							>
								<Icon className="size-5 sm:size-8" />
							</div>
						</div>
					)}
				</div>

				<CardContent className="relative -mt-5 flex flex-1 flex-col gap-2 rounded-t-[1.25rem] bg-card px-3 pb-3 pt-3 shadow-[0_-18px_36px_rgba(15,23,42,0.10)] sm:-mt-7 sm:gap-4 sm:rounded-t-[1.75rem] sm:px-5 sm:pb-6 sm:pt-5">
					<div className="flex flex-wrap items-center gap-1.5">
						<Badge
							className={cn(
								"h-5 rounded-full px-2 text-[9px] font-bold sm:h-6 sm:px-3 sm:text-[10px]",
								colors.badge,
							)}
						>
							{PROGRAM_CATEGORY_LABELS[program.category]}
						</Badge>
					</div>

					<div>
						<CardTitle className="text-sm font-bold leading-tight tracking-normal text-foreground sm:text-[1.45rem] sm:font-extrabold">
							{program.shortTitle}
						</CardTitle>
						<p className="mt-1 line-clamp-2 text-[11px] font-medium leading-relaxed text-muted-foreground sm:mt-1.5 sm:line-clamp-none sm:min-h-[4.75rem] sm:text-sm">
							{program.subtitle}
						</p>
					</div>

					<span className="inline-flex h-9 items-center justify-center rounded-full bg-accent px-3 text-xs font-extrabold text-accent-foreground shadow-sm transition-transform duration-150 group-active:scale-[0.97] sm:h-14 sm:px-5 sm:text-base">
						Daftar Sekarang
					</span>

				</CardContent>
			</Card>
		</Link>
	);
}
