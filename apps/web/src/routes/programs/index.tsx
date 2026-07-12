import { createFileRoute } from "@tanstack/react-router";
import {
	PROGRAM_CATEGORY_LABELS,
	PROGRAM_LIST,
	type ProgramCategory,
} from "@/lib/programs-content";
import ProgramCard from "@/components/sections/program-card";
import PageHero from "@/components/sections/page-hero";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const Route = createFileRoute("/programs/")({
	head: () => ({
		meta: [{ title: "Program Kursus — Momkiddis Indonesia" }],
	}),
	component: ProgramsPage,
});

type Filter = "semua" | ProgramCategory;

const FILTERS: { id: Filter; label: string; count: number }[] = [
	{ id: "semua", label: "Semua Kelas", count: PROGRAM_LIST.length },
	...Object.entries(PROGRAM_CATEGORY_LABELS).map(([id, label]) => ({
		id: id as ProgramCategory,
		label,
		count: PROGRAM_LIST.filter((program) => program.category === id).length,
	})),
];

function ProgramsPage() {
	const [active, setActive] = useState<Filter>("semua");

	const displayed =
		active === "semua"
			? PROGRAM_LIST
			: PROGRAM_LIST.filter((program) => program.category === active);

	return (
		<>
			<PageHero
				title="Program Unggulan Momkiddis"
				subtitle="Program untuk ibu, anak, remaja, profesional, serta persiapan IELTS & TOEFL."
				breadcrumbs={[{ label: "Program" }]}
			/>

			<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				{/* Filter tabs */}
				<div className="flex gap-2 overflow-x-auto pb-1">
					{FILTERS.map(({ id, label, count }) => (
						<button
							key={id}
							type="button"
							onClick={() => setActive(id)}
							className={[
								"flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-150 active:scale-[0.97]",
								active === id
									? "border-primary bg-primary text-primary-foreground"
									: "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
							].join(" ")}
						>
							{label}
							<span
								className={[
									"rounded-full px-1.5 py-0.5 text-xs",
									active === id
										? "bg-white/20"
										: "bg-muted",
								].join(" ")}
							>
								{count}
							</span>
						</button>
					))}
				</div>

				{/* Program grid */}
				<AnimatePresence mode="wait">
					<motion.div
						key={active}
						className="mt-8 grid grid-cols-2 justify-center gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5"
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={{
							hidden: { opacity: 0 },
							visible: {
								opacity: 1,
								transition: { staggerChildren: 0.07 },
							},
						}}
					>
						{displayed.map((program, i) => (
							<motion.div
								key={program.slug}
								className="h-full"
								variants={{
									hidden: { opacity: 0, y: 16 },
									visible: {
										opacity: 1,
										y: 0,
										transition: { duration: 0.35, ease: "easeOut" },
									},
								}}
							>
								<ProgramCard program={program} index={i} />
							</motion.div>
						))}
					</motion.div>
				</AnimatePresence>

				{/* CTA strip */}
				<div className="mt-12 rounded-xl border border-border bg-muted/40 p-6 text-center">
					<p className="text-sm font-medium text-foreground">
						Tidak yakin kelas mana yang tepat?
					</p>
					<p className="mt-1 text-sm text-muted-foreground">
						Konsultasikan kebutuhan belajar untuk ibu, anak, remaja,
						profesional, atau English test dengan admin.
					</p>
					<a
						href="https://wa.me/6282230251104?text=Halo%20Momkiddis%2C%20saya%20ingin%20konsultasi%20program"
						target="_blank"
						rel="noopener noreferrer"
						className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2 text-sm font-semibold text-white transition-opacity duration-150 active:scale-[0.97] hover:opacity-90"
					>
						<svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
							<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
						</svg>
						Konsultasi Gratis
					</a>
				</div>
			</div>
		</>
	);
}
