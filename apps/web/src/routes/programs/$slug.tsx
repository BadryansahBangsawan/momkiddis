import { createFileRoute, notFound } from "@tanstack/react-router";
import {
	CLASS_SCHEDULES,
	PROGRAM_BONUSES,
	PROGRAMS,
} from "@/lib/programs-content";
import PageHero from "@/components/sections/page-hero";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@momkiddis/ui/components/accordion";
import { useSiteConfig } from "@/hooks/use-site-config";
import { SlideButton } from "@/components/ui/slide-button";
import {
	Award,
	CalendarDays,
	CheckCircle2,
	Clock,
	Gift,
	Monitor,
	Users,
} from "lucide-react";

export const Route = createFileRoute("/programs/$slug")({
	component: ProgramDetailPage,
	loader: ({ params }) => {
		const program = PROGRAMS[params.slug as keyof typeof PROGRAMS];
		if (!program) throw notFound();
		return { program };
	},
	head: ({ loaderData }) => ({
		meta: [
			{
				title: loaderData
					? `${loaderData.program.shortTitle} — Momkiddis Indonesia`
					: "Program — Momkiddis Indonesia",
			},
		],
	}),
});

function ProgramDetailPage() {
	const { getWaUrl } = useSiteConfig();
	const { program } = Route.useLoaderData();
	const waUrl = getWaUrl(program.shortTitle);

	return (
		<>
			<PageHero
				title={program.title}
				subtitle={program.subtitle}
				breadcrumbs={[
					{ label: "Program", to: "/programs" },
					{ label: program.shortTitle },
				]}
			/>

			{/* ── Mobile sticky CTA ── */}
			<div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 px-4 pb-safe pt-3 pb-4 backdrop-blur-md sm:hidden">
				<a
					href={waUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-sm font-semibold text-white active:scale-[0.98]"
				>
					<svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
						<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
					</svg>
					Daftar Sekarang
				</a>
			</div>

			<div className="mx-auto max-w-7xl px-4 py-10 pb-28 sm:pb-10 sm:px-6 lg:px-8">
				<div className="grid gap-10 lg:grid-cols-3">
					<div className="flex flex-col gap-8 lg:col-span-2">
						{/* Banner image */}
						<div className="overflow-hidden rounded-2xl border border-border bg-card">
							<img
								src={program.landscapeImage}
								alt={`Banner ${program.shortTitle}`}
								className="block h-auto w-full"
							/>
						</div>

						{/* ── Mobile: compact info chips ── */}
						<div className="grid grid-cols-3 gap-2 sm:hidden">
							<div className="rounded-xl bg-muted/60 p-3 text-center">
								<Monitor className="mx-auto mb-1 size-4 text-primary" />
								<p className="text-[10px] text-muted-foreground">Format</p>
								<p className="mt-0.5 text-[11px] font-semibold leading-snug text-foreground">
									{program.formatLabel}
								</p>
							</div>
							<div className="rounded-xl bg-muted/60 p-3 text-center">
								<Clock className="mx-auto mb-1 size-4 text-primary" />
								<p className="text-[10px] text-muted-foreground">Durasi</p>
								<p className="mt-0.5 text-[11px] font-semibold leading-snug text-foreground">
									{program.duration}
								</p>
							</div>
							<div className="rounded-xl bg-muted/60 p-3 text-center">
								<Award className="mx-auto mb-1 size-4 text-primary" />
								<p className="text-[10px] text-muted-foreground">Biaya</p>
								<p className="mt-0.5 text-[11px] font-semibold leading-snug text-foreground">
									{program.priceLabel}
								</p>
							</div>
						</div>

						{/* Materi Kelas */}
						<section>
							<h2 className="mb-4 text-base font-semibold text-foreground">
								Materi Kelas
							</h2>
							<Accordion
								multiple
								className="overflow-hidden rounded-xl border border-border divide-y divide-border"
							>
								{program.curriculum.map((item, i) => (
									<AccordionItem
										key={item.title}
										value={`item-${i}`}
										className="px-4"
									>
										<AccordionTrigger className="py-3.5 text-sm font-medium hover:no-underline">
											<span className="mr-3 text-xs font-bold text-muted-foreground tabular-nums">
												{String(i + 1).padStart(2, "0")}
											</span>
											{item.title}
										</AccordionTrigger>
										<AccordionContent>
											<p className="pb-3.5 pl-7 text-sm leading-relaxed text-muted-foreground">
												{item.description}
											</p>
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</section>

						{/* Paket Harga */}
						<section>
							<h2 className="mb-4 text-base font-semibold text-foreground">
								Paket Harga
							</h2>
							<div className="overflow-hidden rounded-xl border border-border bg-card">
								<table className="w-full border-collapse text-sm">
									<tbody>
										{program.pricePackages.map((pricePackage) => (
											<tr
												key={pricePackage.label}
												className="border-b border-border last:border-b-0"
											>
												<td className="border-r border-border px-4 py-3 text-muted-foreground">
													{pricePackage.label}
												</td>
												<td className="px-4 py-3 text-right font-semibold text-foreground">
													{pricePackage.price}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							{program.note && (
								<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
									{program.note}
								</p>
							)}
						</section>

						{/* Yang Akan Kamu Dapat */}
						<section>
							<h2 className="mb-4 text-base font-semibold text-foreground">
								Yang Akan Kamu Dapat
							</h2>
							<ul className="grid gap-2.5 sm:grid-cols-2">
								{program.outcomes.map((outcome) => (
									<li
										key={outcome}
										className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-3"
									>
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span className="text-sm leading-snug text-foreground">
											{outcome}
										</span>
									</li>
								))}
							</ul>
						</section>
					</div>

					{/* ── Sidebar (desktop only) ── */}
					<div className="hidden flex-col gap-4 sm:flex lg:sticky lg:top-24 lg:self-start">
						<div className="rounded-xl border border-border bg-card p-5">
							<h3 className="text-sm font-semibold text-foreground">
								Detail Kelas
							</h3>
							<ul className="mt-4 flex flex-col gap-3">
								<li className="flex items-center gap-3">
									<div className="flex size-8 items-center justify-center rounded-lg bg-muted">
										<Monitor className="size-4 text-muted-foreground" />
									</div>
									<div>
										<p className="text-xs text-muted-foreground">Format</p>
										<p className="text-sm font-medium text-foreground">
											{program.formatLabel}
										</p>
									</div>
								</li>
								<li className="flex items-center gap-3">
									<div className="flex size-8 items-center justify-center rounded-lg bg-muted">
										<Clock className="size-4 text-muted-foreground" />
									</div>
									<div>
										<p className="text-xs text-muted-foreground">Durasi</p>
										<p className="text-sm font-medium text-foreground">
											{program.duration}
										</p>
									</div>
								</li>
								<li className="flex items-center gap-3">
									<div className="flex size-8 items-center justify-center rounded-lg bg-muted">
										<Users className="size-4 text-muted-foreground" />
									</div>
									<div>
										<p className="text-xs text-muted-foreground">Kelas</p>
										<p className="text-sm font-medium text-foreground">
											{program.maxStudents
												? `1 on 1, maks. ${program.maxStudents} peserta`
												: "Program kelas Momkiddis"}
										</p>
									</div>
								</li>
							</ul>

							<div className="mt-4 border-t border-border pt-4">
								<p className="text-xs text-muted-foreground">Informasi Biaya</p>
								<p className="mt-0.5 text-base font-semibold text-foreground">
									{program.priceLabel}
								</p>
							</div>

							<SlideButton
								url={waUrl}
								label="Daftar Sekarang"
								className="mt-4 w-full"
							/>
						</div>

						<div className="rounded-xl border border-border bg-card p-5">
							<h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
								<Gift className="size-4 text-primary" />
								Bonus Free
							</h3>
							<ul className="flex flex-col gap-2">
								{PROGRAM_BONUSES.map((bonus) => (
									<li key={bonus} className="flex items-start gap-2">
										<Award className="mt-0.5 size-3.5 shrink-0 text-primary" />
										<span className="text-xs leading-snug text-muted-foreground">
											{bonus}
										</span>
									</li>
								))}
							</ul>
						</div>

						<div className="rounded-xl border border-border bg-card p-5">
							<h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
								<CalendarDays className="size-4 text-primary" />
								Jadwal Kelas
							</h3>
							<ul className="flex flex-col gap-2">
								{CLASS_SCHEDULES.map((schedule) => (
									<li
										key={schedule.session}
										className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2"
									>
										<span className="text-xs font-medium text-foreground">
											{schedule.session}
										</span>
										<span className="text-right text-xs text-muted-foreground">
											{schedule.time}
										</span>
									</li>
								))}
							</ul>
							<p className="mt-3 text-xs leading-relaxed text-muted-foreground">
								Jadwal fleksibel untuk mahasiswi, pekerja, dan ibu rumah
								tangga.
							</p>
						</div>

						<div className="rounded-xl border border-border bg-card p-5">
							<h3 className="mb-3 text-sm font-semibold text-foreground">
								Cocok Untuk
							</h3>
							<ul className="flex flex-col gap-2">
								{program.targetPeserta.map((target) => (
									<li key={target} className="flex items-start gap-2">
										<span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
										<span className="text-xs leading-snug text-muted-foreground">
											{target}
										</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
